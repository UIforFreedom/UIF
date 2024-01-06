import axios from 'axios'
import Qs from 'qs'
import moment from 'moment'
import {
  getToken
} from '@/utils/auth'

import TransportObject from './default_transport_settings.js'

import subscribe_item_info from './subscribe_item.js'
import outbound_list from './outbound_list.js'
import v2ray_config from './v2ray.js'

import {
  Notification,
  MessageBox,
  Message
} from 'element-ui';

const g_port = "9090"
const g_address = "http://127.0.0.1"
const UIFV2RAY_ADDRESS = g_address + ':' + g_port + '/'
const USER_DOCS_ADDRESS = "http://127.0.0.1:9526"


var g_clock_obj = ''
var g_start_time = ''

const DEFAULT_OS_PROXY_SUGGEST_ADDRESS = "127.0.0.1:9527"

axios.defaults.timeout = 6000;

var val = document.body.clientWidth;
if (val <= 990) {
  var dialog_width = "100%";
} else {
  var dialog_width = "60%";
}

const getters = {
  OutboundGroup() {
    /*{{{*/
    var out_group = [{
        label: "内置",
        value: "内置",
        children: [{
            label: "直连",
            value: "直连"
          },
          {
            label: "屏蔽",
            value: "屏蔽"
          },
        ],
      },
      {
        label: "订阅",
        value: "订阅",
        children: [],
      },
      {
        label: "自添加",
        value: "自添加",
        children: [],
      },
    ];
    var outbounds = state.save_config.v2ray_config_obj.outbounds;
    var subscribed_group = {};
    for (var item in outbounds) {
      item = outbounds[item];
      if (
        ("is_disabled" in item && item["is_disabled"]) ||
        "is_default" in item
      ) {
        continue;
      }
      var push_item = {
        label: item["name"],
        value: item["name"],
      };
      if ("subscribed" in item) {
        var sub_name = item["subscribed"];
        if (!subscribed_group.hasOwnProperty(sub_name)) {
          subscribed_group[item["subscribed"]] = [];
        }
        subscribed_group[item["subscribed"]].push(push_item);
      } else {
        out_group[2]["children"].push(push_item);
      }
    }
    for (var item in subscribed_group) {
      var push_item = {
        label: item,
        value: item,
        children: subscribed_group[item],
      };
      out_group[1]["children"].push(push_item);
    }
    return out_group;
    /*}}}*/
  },
}

const state = {
  is_connect_uif: false,
  is_sendthrough: false,
  is_adding_routing: false,
  is_adding_outbound: false,
  is_connecting: false,
  local_ip: "",
  dialog_width: dialog_width,
  user_docs_address: USER_DOCS_ADDRESS,
  connect_time: moment().format('HH:mm:ss'),
  usable_outbound_protocol: outbound_list.ReadUsableOutboundProtocol(),

  // saved config
  save_config: {
    version: 0,
    is_disable_tips: false,
    auto_load: false,
    auto_open_proxy: false,
    auto_upgrade_uif: false,
    current_node_uuid: 'node_uuid_2', // using outbound server uuid.
    os_proxy_address: DEFAULT_OS_PROXY_SUGGEST_ADDRESS,
    subscribed_item: subscribe_item_info.ReadSubscribedItem(),
    v2ray_config_obj: v2ray_config.v2ray_config_obj,
  },
}

function AddInBounds(obj) {
  if ('StreamSettings' in obj) {
    obj['StreamSettings'] = TransportObject.Init(obj['StreamSettings'])
  }
  state.inbounds_obj.push(obj)
}

function HeartBeat() {
  if (!state.is_connect_uif) {
    return
  }
  MyGet(UIFV2RAY_ADDRESS + 'read_config', {}).then(function(response) {

    response = response['data']
    if (response == {} || response['version'] == 0) {
      return
    }

    if (state.save_config['version'] < response['version']) {
      // update json
      //
      state.save_config = response
      console.log(response)

      // CloseV2ray()
      // MessageBox.confirm("本地配置已更新，但与本页的配置不同步，可能是其他网页更改了配置。", '提示', {
      //   confirmButtonText: '刷新本页',
      //   cancelButtonText: '不刷新',
      //   type: 'warning'
      // }).then(() => {
      //   Message({
      //     type: 'success',
      //     message: 'UI 已更新'
      //   });
      // }).catch(() => {
      //   CloseV2ray()
      // });
    }
  }).catch(function(error) {
    ConnectErrorMsg("UIF 没了反应，可能是意外退出了。请尝试着重新启动 UIF !", 0)
  });
}

function ConnectV2ray() {
  //{{{
  if (!state.is_connect_uif) {
    Notification.closeAll()
    state.is_connecting = true
  }
  Check()
    .then(function(response) {
      if (state.is_connect_uif) {
        return
      }
      Notification({
        message: "连接 UIF 成功！",
        type: "success",
        duration: 0,
      });
      var data = response['data']
      state.is_connect_uif = true
      state.is_connecting = false

      state.V2ray_version = data['V2ray_version']
      state.V2ray_path = data['V2ray_path']
      state.local_ip = data['Local_IP']

      HeartBeat()
      setInterval(HeartBeat, 3000)
      StartClock()
    })
    .catch(function(error) {
      ConnectErrorMsg("检测不到 UIF 的存在，请确保本机正确地安装并启动！", 0)
    });
  //}}}
}


let config_queue = null;
let is_restarting = false;

function SaveConfig1(msg, type) {
  is_restarting = false;
  config_queue = null;
  Message.closeAll()
  Message({
    message: msg,
    type: type,
  });
}

function SaveConfig() {
  if (!state.is_connect_uif) {
    Message({
      message: "配置失败，请先连接UIF客户端",
      type: "error",
    });
    return;
  }

  if (is_restarting) {
    config_queue = 1;
  } else {

    Message({
      message: " 使新配置生效中...",
      iconClass: "el-icon-loading",
      duration: 0,
      type: "error",
    });
    is_restarting = true;

    state.save_config.version += 1;

    MyPost(UIFV2RAY_ADDRESS + 'save_config', {
      'config': JSON.stringify(state.save_config)
    }).then(function() {
      if (config_queue != null) {
        config_queue = null;
        SaveConfig();
      } else {
        SaveConfig1("保存成功！", 'success')
      }
    }).catch(function() {
      SaveConfig1("保存失败！", 'error')
    })

  }
}

function ConnectErrorMsg(msg, duration) {
  Notification.closeAll()
  Notification({
    message: msg,
    type: "error",
    duration: duration,
  });
  state.is_connect_uif = false
  state.is_connecting = false

  state.local_ip = ''

  state.V2ray_version = ""
  state.V2ray_path = ""

  StopClock()
}

function CloseV2ray() {
  //{{{
  Notification.closeAll()
  if (!state.is_connect_uif) {
    // had not connected.
    return
  }
  state.is_connecting = true
  state.is_connect_uif = false


  MessageBox.confirm("你真的要退出 UIF 吗？确认退出将关闭 UIF 的进程。", '提示', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    Message({
      type: 'success',
      message: '再见'
    });
  }).catch(() => {
    Message({
      type: 'success',
      duration: 0,
      message: '再见'
    });
  });

  MyGet(UIFV2RAY_ADDRESS + 'close_v2ray', {}).then(function(response) {
    state.is_connecting = false
    Notification({
      message: "成功关闭 UIF ！",
      type: "success",
      duration: 7000,
    });
  }).catch(function(error) {
    ConnectErrorMsg("UIF 没了反应，可能是意外退出了。请尝试着重新启动 UIF !", 0)
  });

  StopClock()
  //}}}
}

function MyGet(address, param) {
  param['token'] = getToken()
  return axios.get(address, {
    params: param
  })
}

function MyPost(address, param) {
  param['token'] = getToken()
  var data = Qs.stringify(param)
  return axios.post(address, data)
}

function Check() {
  return MyGet(UIFV2RAY_ADDRESS + 'check', {})
}

function StartClock() {
  g_start_time = moment()
  g_clock_obj = setInterval(Clock_cb, 1000);
}

function StopClock() {
  if (g_clock_obj != '') {
    clearInterval(g_clock_obj)
  }
  g_clock_obj = ''
  g_start_time = moment()
  state.connect_time = ''
}

function Clock_cb() {
  var HH = moment().diff(g_start_time, 'hour')

  if (HH < 10) {
    HH = '0' + HH
  }

  var temp = moment(moment().diff(g_start_time)).format('mm:ss')

  temp = `${HH}:${temp}`
  state.connect_time = temp
}


const actions = {
  ConnectV2ray,
  SaveConfig,
  CloseV2ray,
  Check,
  MyGet,
  AddInBounds,
}

export default {
  namespaced: true,
  getters,
  state,
  actions,
}
