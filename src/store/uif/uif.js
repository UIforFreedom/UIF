import {
  formatTime,
  GetAPIAddress,
  GetKey,
  InitSetting,
  MyPost,
  MyGet,
  ObjEqual,
  SetAPIAddress,
  SetKey
} from '@/utils'

import {
  AddInboudList,
  SetGeo,
  AddRouteList,
  SetDNS,
  SetOutboud
} from "@/uif/template/tun_fakeip";

import {
  Notification,
  Message
} from 'element-ui';

import moment from 'moment'

import {
  configObj,
  newFreedomOut
} from './config'

import clash2UIF from "@/store/uif/clash2uif";
import V2rayN2UIF from "@/store/uif/v2rayn2uif";
import UIFRaw from "@/store/uif/uif_share";
import Sing2UIF from './sing2uif';

const state = {
  showToolTip: false,
  apiAddress: 'http://127.0.0.1:9413',
  password: '',
  coreLog: 'empty.',
  consoleAuto: true,
  startTime: 0,
  usingOutObj: newFreedomOut(),
  clashConnection: [{
    chains: ["freedom", "Rules::腾讯"],
    download: 234451,
    id: "7826f9d2-210f-46a8-b78e-672bdc15cba3",
    metadata: {
      network: "tcp",
      type: "mixed/默认 HTTP/Socks 入口0",
      sourceIP: "127.0.0.1",
      destinationIP: "",
      sourcePort: "49807",
      destinationPort: "443",
      host: "wup.browser.qq.com",
      dnsMode: "normal",
      processPath: "",
    },
    rule: "domain_keyword=[weixin qq tengxun] => Rules::腾讯",
    rulePayload: "",
    start: "2023-10-02T05:26:46.5865705+08:00",
    upload: 111552,
  }, ],
  connection: {
    isConnected: false,
    isConnecting: false,
    path: '',
    version: '-',
    coreVersion: '-',
    ip: '127.0.0.1',
    times: '00:00:00'
  },
  subscribe: {
    isAdding: false,
    isOpenSub: false,
    info: {},
  },
  share: {
    isOpenShare: false,
    isSingle: false,
    info: {},
  },
  testWebsiteList: [{
      domain: "baidu.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
    {
      domain: "github.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
    {
      domain: "youtube.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
    {
      domain: "google.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
    {
      domain: "instagram.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
    {
      domain: "netflix.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
  ],
  pannel: {
    isOpen: false,
    isAdding: false,
    isClient: false,
    isShowingJson: false,
    info: {},
    info_string: '',
    all_list: [],
    index: 0
  },
  route: {
    isOpen: false,
    isAdding: false,
    info: {},
    all_list: [],
    index: 0,
    routeType: 'route',
    matchType: 'route'
  },
  config: { // to save
    startup: false,
    popupWeb: true,
    autoUpdateUIF: true,
    autoUpdateCore: true,
    urlTest: {
      testURL: 'https://www.gstatic.com/generate_204',
      interval: '1',
      tolerance: 50
    },
    ntp: {
      enabled: false,
      server: 'ntp.aliyun.com',
      interval: '30', // minute
      server_port: 123
    },
    clash: {
      enabled: false,
      apiAddress: 'http://127.0.0.1:9181',
      apiKey: '',
    },
    geoIPAddress: 'https://github.com/soffchen/sing-geoip/releases/latest/download/geoip.db',
    geoSiteAddress: 'https://github.com/soffchen/sing-geosite/releases/latest/download/geosite.db',
    uifUpdateAddress: 'https://github.com/UIforFreedom/UIF',
    coreUpdateAddress: 'https://github.com/SagerNet/sing-box',
    dnsAddress: 'udp://114.114.114.114',
    routeType: 'route',
    coreAutoRestart: '0',
  },
}

//{{{clock
var g_clock_obj = ''

function StartClock() {
  g_clock_obj = setInterval(Clock_cb, 3000);
}

function StopClock() {
  if (g_clock_obj != '') {
    clearInterval(g_clock_obj)
  }
  g_clock_obj = ''
  state.connection.times = '00:00:00'
}

function Clock_cb() {
  var HH = moment().diff(state.startTime, 'hour')
  if (HH < 10) {
    HH = '0' + HH
  }
  var MMSS = moment(moment().diff(state.startTime)).format('mm:ss')

  var temp = formatTime(state.startTime.toDate(), '')

  // state.connection.times = `${temp} (${HH}:${MMSS})`
  state.connection.times = `${temp}`

  heartBeat()
} //}}}

async function heartBeat() {
  try {
    var res = await MyPost(state.apiAddress + '/connect', {});
    if ('status' in res.data) {
      ConnectErrorMsg('后端连接已断开！密码错误', 0)
    }
    if ('coreLog' in res.data && state.consoleAuto) {
      state.coreLog = res.data.coreLog
    }
    ClashConnection()
    return;
  } catch (e) {
    console.log(e)
  }
  ConnectErrorMsg('后端连接已断开！', 0)
}

function ClashConnection() {
  if (!state.config.clash.enabled) {
    return
  }
  MyGet(state.config.clash.apiAddress + "/connections", {}).then(function(r) {
    state.clashConnection = r.data
    console.log(r)
  });
}

function ConnectErrorMsg(msg, duration) {
  Notification.closeAll()
  Notification({
    message: msg,
    type: "error",
    duration: duration, // 0 means forever
  });
  state.connection.isConnected = false
  state.connection.isConnecting = false

  StopClock()
}

function CloseCore() {
  if (!state.connection.isConnected) {
    return;
  }
  MyPost(state.apiAddress + '/close_core', {}).then(function(res) {
    Message({
      type: 'success',
      message: '内核已关闭！'
    });
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: '内核关闭失败！' + error
    });
  });
}

function CloseUIF() {
  if (!state.connection.isConnected) {
    return;
  }
  MyPost(state.apiAddress + '/close_uif', {}).then(function(res) {
    Message({
      type: 'success',
      message: 'UIF 已关闭！'
    });
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: 'UIF 关闭失败！' + error
    });
  });
}

function GetUIFConfig() {
  if (!state.connection.isConnected) {
    return;
  }
  MyPost(state.apiAddress + '/get_uif_config', {}).then(function(res) {
    console.log(res)
    if (res.data == '') {
      return
    }
    state.config = InitSetting(res.data.uif, state.config)
    if (res.data.data != undefined) {
      configObj.state.config = res.data.data
    }
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: 'UIF 配置获取失败！' + error
    });
  });
}

function SelectOut(out) {
  if (ObjEqual(state.usingOutObj, out)) {
    state.usingOutObj = out
  }
}

function ApplyCoreConfig() {
  if (!state.connection.isConnected) {
    return;
  }
  var coreConfig = AddInboudList(configObj.state.config.inbounds);
  SetOutboud(coreConfig)
  SetGeo(coreConfig, state.config.geoIPAddress, state.config.geoSiteAddress)
  AddRouteList(coreConfig, configObj.state.config.routes)
  SetDNS(coreConfig, state.config.dnsAddress)
  console.log(coreConfig)

  MyPost(state.apiAddress + '/run_core', {
    config: coreConfig,
  }).then(function(res) {
    Message({
      type: 'success',
      message: '内核已更新！'
    });
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: '内核更新失败！' + error
    });
  });
}

// save and apply UIF config, then apply this config to core config.
function SaveUIFConfig() {
  if (!state.connection.isConnected) {
    return;
  }
  MyPost(state.apiAddress + '/save_uif_config', {
    config: {
      uif: state.config,
      data: configObj.state.config
    },
  }).then(function(res) {
    Message({
      type: 'success',
      message: 'UIF 配置保存成功！'
    });
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: 'UIF 配置更新失败！' + error
    });
  });
}

async function ResetAll() {
  if (!state.connection.isConnected) {
    return;
  }
  await MyPost(state.apiAddress + '/save_uif_config', {
    config: {}
  });

  SetAPIAddress("undefined")
  SetKey("undefined");
  CloseCore()
  location.reload();
}

function Connect() {
  Notification.closeAll()
  if (state.connection.isConnected) {
    state.connection.isConnected = false
    StopClock()
    return;
  }
  state.connection.isConnecting = true
  SetKey(state.password)

  MyPost(state.apiAddress + '/connect', {}).then(function(res) {
    state.connection.isConnecting = false
    console.log(res.data)

    if ('status' in res.data) { // failed to check.
      if (state.password == '') {
        Notification({
          message: 'UIF 后端已运行，请先输入密码 验证登录',
          type: "warning",
          duration: 0, // 0 means forever
        });
      } else {
        Notification({
          message: `验证失败！UIF密码 错误`,
          type: "error",
          duration: 0, // 0 means forever
        });
      }
      return
    }

    state.connection.isConnected = true
    state.connection.path = res.data.path
    state.connection.version = res.data.version
    state.connection.coreVersion = res.data.coreVersion
    state.connection.ip = res.data.ip
    state.startTime = moment(res.data.startTime * 1000)
    StartClock()
    SetKey(state.password)
    SetAPIAddress(state.apiAddress)

    if (res.data.isFirstTime) {
      SaveUIFConfig()
      ApplyCoreConfig()
    } else {
      GetUIFConfig()
    }
    Notification({
      message: "连接 UIF 成功！",
      type: "success",
      duration: 3000,
    });
  }).catch(function(error) {
    console.log(error)
    ConnectErrorMsg("无法连接后端，UIF 功能不可用，请确保本机正确地安装 UIF 并启动！", 0)
  });

}

function Ping(row) {
  if (!state.connection.isConnected || row == undefined) {
    return;
  }

  row.delay = "";
  MyPost(state.apiAddress + '/ping', {
      address: row['transport']['address']
    })
    .then(function(res) {
      var rtt = res.data.res;
      if (rtt == "0") {
        rtt = "-1";
      }
      row.delay = rtt;
    })
    .catch(function(error) {});

}

function TryParse(inputData) {
  try {
    var res = UIFRaw(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as uif " + error);
  }

  try {
    var res = clash2UIF(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as clash " + error);
  }

  try {
    var res = V2rayN2UIF(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as v2rayn " + error);
  }

  try {
    var res = Sing2UIF(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as sing-box " + error);
  }
  return [];
}

async function UpdateSub() {

  var rawData = state.subscribe.info.data
  if (state.subscribe.info.type == 'link') {
    if (!state.connection.isConnected) {
      Message.error({
        message: "需先连接后端！"
      });
      return;
    }
    try {
      var res = await MyPost(state.apiAddress + "/proxy_get", {
        dst: state.subscribe.info.data,
      });
    } catch (error) {
      console.log(error);
      Message.error({
        message: '请求出错！' + error
      });
      return false;
    }
    if (res.data["status"] != 0) {
      console.log(res);
      Message.error({
        message: res.data["res"]
      });
      return false;
    }
    rawData = res.data["res"]
  }

  var outList = TryParse(rawData);
  console.log(outList)
  if (outList.length == 0) {
    Message.error({
      message: "导入数据解析出错！可能不支持该订阅格式"
    });
    return false;
  }

  for (var item in outList) {
    item = outList[item];
    item["enabled"] = false;
    item["delay"] = '';
    item["core_tag"] = '';
  }
  state.subscribe.info.outbounds = outList;
  state.subscribe.info.updateTime = new Date().valueOf();
  return true
}

function TestWeb1(t, start) {
  t["isTesting"] = true;
  MyPost(state.apiAddress + "/proxy_get", {
      dst: "https://www." + t["domain"],
    })
    .then(function(r) {
      t["isTesting"] = false;
      var end = new Date().getTime()
      if (r.data['status'] != 0) {
        t["delay2"] = -1;
      } else {
        t["delay2"] = end - start;
      }
      t["delay"] = `[ ${t.delay2}ms ]`;
      console.log(r)
    });
}

function TestWeb() {
  if (!state.connection.isConnected) {
    Message.error({
      message: "需先连接后端！"
    });
    return;
  }
  for (var item in state.testWebsiteList) {
    TestWeb1(state.testWebsiteList[item], new Date().getTime())
  }
}

async function InstallAutoStartup() {
  try {
    var res = await MyPost(state.apiAddress + "/auto_startup", {
      isInstall: state.config.startup,
    });
  } catch (error) {
    console.log(error);
    Message.error({
      message: '请求出错！' + error
    });
    return false;
  }
  if (res.data["status"] != 0) {
    console.log(res);
    Message.error({
      message: res.data["res"]
    });
    return false;
  }
  Message({
    type: 'success',
    message: '设置开机自启成功！'
  });
  return true
}

function Init() {
  var address = GetAPIAddress()
  if (address != '') {
    state.apiAddress = address
  }
  state.password = GetKey()
  Connect()
}

Init()



const actions = {
  Connect,
  SaveUIFConfig,
  GetUIFConfig,
  ApplyCoreConfig,
  ResetAll,
  UpdateSub,
  Ping,
  CloseCore,
  CloseUIF,
  TestWeb,
  InstallAutoStartup
}

export default {
  namespaced: true,
  state,
  actions
}
