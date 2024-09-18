import {
  v4 as uuidv4
} from "uuid";

import axios from 'axios'

import {
  formatTime,
  GetAPIAddress,
  GetKey,
  InitSetting,
  MyPost,
  MyWS,
  SetAPIAddress,
  SetKey,
  SetSession,
  GetAllSession,
  DELAY_TIMEOUT,
  SetLang,
  DeepCopy,
  Translator,
  SetSimpleStyle,
  SetUIFAction,
  GetUIFActions,
  GetSimpleStyle
} from '@/utils'


import {
  BuildCoreConfig,
  BuildShareCoreConfig,
  DEFAULT_DNS_LOCAL,
  DEFAULT_DNS_REMOTE
} from "@/uif/template/tun_fakeip";

import {
  Notification,
  Message
} from 'element-ui';

import moment from 'moment'

import {
  configObj,
  InitConfigState,
  newFreedomOut,
  newLoginSession,
  newDefaultHttpIn,
  newDefaultTunIn,
  newSub
} from './config'

import TryParse from "@/store/uif/parser";

import {
  BuildTestNodeTemplate
} from '@/uif/template/speedtest';

import {
  getToken,
} from '@/utils/auth';


var defaultState = {
  apiAddress: 'http://127.0.0.1:9413',
  password: '',

  showToolTip: false,
  coreLog: 'empty.',
  consoleAuto: true,
  startTime: 0,
  loginSession: [newLoginSession()],
  loginSessionInfo: {
    isOpen: false,
    isReloadWeb: false
  },
  usingLoginSessionIndex: 0,
  usingOutObj: newFreedomOut(),
  clashConnection: {},
  clashProxies: {
    all: [],
    show: [],
    selecting: 'autoSelete',
    isUpdatingDelay: false,
  },
  connection: {
    isConnected: false,
    isConnecting: false,
    path: '',
    version: '-',
    coreVersion: '-',
    ip: '127.0.0.1',
    coreStatus: 3,
    system_info: {
      memory: {
        used: 100,
        available: 100
      },
      cpu_info: {},
      host_info: {}
    },
    cert: {
      public: ``,
      key: ``,
      domain: '',
    },
    times: '00:00:00'
  },
  subscribe: {
    isAdding: false,
    isOpenSub: false,
    isQuicImport: false,
    info: {
      tag: '',
      type: 'link',
      data: '',
    },
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
    isLoadingWarp: false,
    isShowingJson: false,
    info: {},
    info_string: '',
    all_list: [],
    index: 0
  },
  dnsServer: {
    localDNSList: [{
        'value': "udp://223.5.5.5",
        'label': 'udp://223.5.5.5',
      },
      {
        'value': "udp://1.12.12.12",
        'label': "udp://1.12.12.12",
      },
      {
        'value': "tls://223.5.5.5",
        'label': "tls://223.5.5.5",
      },
      {
        'value': "tls://1.12.12.12",
        'label': "tls://1.12.12.12",
      },
      {
        'value': "https://dns.alidns.com/dns-query",
        'label': "https://dns.alidns.com/dns-query (ECS)",
      },
      {
        'value': "https://doh.pub/dns-query",
        'label': "https://doh.pub/dns-query (ECS)",
      },
      {
        'value': "https://223.5.5.5/dns-query",
        'label': "https://223.5.5.5/dns-query",
      },
      {
        'value': "https://1.12.12.12/dns-query",
        'label': "https://1.12.12.12/dns-query",
      },
      {
        'value': "h3://223.5.5.5/dns-query",
        'label': "h3://223.5.5.5/dns-query",
      },
      {
        'value': "h3://1.12.12.12/dns-query",
        'label': "h3://1.12.12.12/dns-query",
      },
      {
        'value': "dhcp://auto",
        'label': "dhcp://auto",
      },
    ],
    remoteDNSList: [{
        'value': "udp://8.8.8.8",
        'label': "udp://8.8.8.8",
      },
      {
        'value': "udp://1.1.1.1",
        'label': "udp://1.1.1.1",
      },
      {
        'value': "tls://8.8.8.8",
        'label': "tls://8.8.8.8",
      },
      {
        'value': "tls://1.1.1.1",
        'label': "tls://1.1.1.1",
      },
      {
        'value': "https://dns.google/dns-query",
        'label': "https://dns.google/dns-query (ECS)",
      },
      {
        'value': "https://1dot1dot1dot1.cloudflare-dns.com/",
        'label': "https://1dot1dot1dot1.cloudflare-dns.com/",
      },
      {
        'value': "https://8.8.8.8/dns-query",
        'label': "https://8.8.8.8/dns-query (ECS)",
      },
      {
        'value': "https://1.1.1.1/dns-query",
        'label': "https://1.1.1.1/dns-query",
      },
      {
        'value': "h3://8.8.8.8/dns-query",
        'label': "h3://8.8.8.8/dns-query (ECS)",
      },
      {
        'value': "h3://1.1.1.1/dns-query",
        'label': "h3://1.1.1.1/dns-query",
      },
    ],
  },
  subNetList: [{
      value: "113.64.0.0/12",
      label: "广东电信"
    },
    {
      value: "210.21.0.0/16",
      label: "广东联通",
    },
    {
      value: "223.104.0.0/14",
      label: "广东移动",
    },
    {
      value: "",
      label: "不设置",
    },
  ],
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
    lang: "cn",
    simplified: {
      enabled: false,
      inboundMode: 'mixed',
      sortOpts: [],
    },
    autoUpdateUIF: true,
    autoUpdateCore: true,
    urlTest: {
      testURL: 'https://www.gstatic.com/generate_204',
      interval: '5',
      tolerance: 70
    },
    ntp: {
      enabled: false,
      server: 'ntp.aliyun.com',
      interval: '30', // minute
      server_port: 123
    },
    share: {
      domain: '',
      tunShareMode: 'fakeip',
      localDNSAddress: DEFAULT_DNS_LOCAL,
      remoteDNSAddress: DEFAULT_DNS_REMOTE,
    },
    subnet: {
      client: '', // local
      share: '',
      ip_mode_local: '',
      ip_mode_share: '',
    },
    clash: {
      enabled: false,
      apiAddress: 'http://127.0.0.1:9191', //deprecated
      apiIP: '127.0.0.1',
      apiPort: 9191,
      apiKey: '',
      external_ui_download_url: '',
      external_ui: '',
    },
    geoIPAddress: 'https://github.com/soffchen/sing-geoip/releases/latest/download/geoip.db',
    geoSiteAddress: 'https://github.com/soffchen/sing-geosite/releases/latest/download/geosite.db',
    uifUpdateAddress: 'https://github.com/UIforFreedom/UIF',
    coreUpdateAddress: 'https://github.com/SagerNet/sing-box',
    dnsAddress: DEFAULT_DNS_LOCAL, // local
    remoteDNSAddress: DEFAULT_DNS_REMOTE,
    routeType: 'route',
    useAdguardRule: false,
    coreAutoRestart: '0',
  },
}

var state = DeepCopy(defaultState)

export function InitUIFState() {
  state = DeepCopy(defaultState)
}

var isStartedGlobalClock = false
var CLOCK_INTERNAL = 3000

function StartClock() {
  if (isStartedGlobalClock) {
    return
  }
  isStartedGlobalClock = true
  setTimeout(heartBeat, CLOCK_INTERNAL);
}

// only update when it is connected.
function UpdateInfo(res) {
  state.connection.isConnected = true
  state.connection.path = res.data.path
  state.connection.version = res.data.version
  state.connection.coreVersion = res.data.coreVersion
  state.connection.ip = res.data.ip
  state.connection.cert = res.data.cert
  state.connection.coreStatus = res.data.coreStatus
  state.connection.system_info = res.data.system_info
  state.startTime = moment(res.data.startTime * 1000)
  state.connection.times = `${formatTime(state.startTime.toDate(), '')}`

  if ('coreLog' in res.data && state.consoleAuto) {
    state.coreLog = res.data.coreLog
    state.connection.coreStatus = res.data.coreStatus
    state.connection.system_info = res.data.system_info
  }
  ClashConnection()
  StartClock() // update next time.
}

async function heartBeat() {
  if (state.connection.isConnected) {
    try {
      var res = await MyPost(state.apiAddress + '/connect', {});
      if ('status' in res.data) {
        ConnectErrorMsg('后端连接已断开！密码错误', 0)
        return
      }
      UpdateInfo(res)
    } catch (e) {
      console.log(e)
      ConnectErrorMsg('后端连接已断开！', 0)
    }
  }
  setTimeout(heartBeat, CLOCK_INTERNAL);
}

function ClashConnection() {
  if (!state.config.clash.enabled) {
    return
  }

  UpdateSubExtraInfo()

  if (!state.config.simplified.enabled) {
    MyPost(state.apiAddress + "/proxy_get2", {
      dst: state.config.clash.apiAddress + "/connections",
      http_proxy_port: "", // not to use proxy
      authorization: state.config.clash.apiKey
    }).then(function(r) {
      state.clashConnection = r.data
    });
  }

  MyPost(state.apiAddress + "/proxy_get2", {
    dst: state.config.clash.apiAddress + "/proxies",
    http_proxy_port: "",
    authorization: state.config.clash.apiKey
  }).then(function(r) {
    if (state.clashProxies.isUpdatingDelay) {
      return
    }
    var urlTest = null
    state.clashProxies.all = []
    for (var item in r.data['proxies']) {
      if (item == 'GLOBAL') {
        continue
      }
      if (item == 'proxy') {
        state.clashProxies.selecting = r.data['proxies'][item]['now']
      }
      var type = r.data['proxies'][item]['type']
      type = type.toLowerCase()
      if (['reject', 'dns', 'direct', 'selector'].includes(type)) {
        continue
      }
      var item = r.data['proxies'][item]
      item.isTestingDelay = false
      item.delay = -1
      if ('history' in item && item['history'].length > 0 && 'delay' in item["history"][0]) {
        item.delay = item["history"][0]["delay"];
      }

      if (type == 'urltest') {
        urlTest = item
      } else {
        state.clashProxies.all.push(item)
      }
    }
    if (urlTest != null) {
      state.clashProxies.all = [urlTest].concat(state.clashProxies.all)
    }
    SortClashProxyNode()
  });
}

function ClashChangeProxy() {
  axios
    .put(state.config.clash.apiAddress + "/proxies/proxy", {
      'name': state.clashProxies.selecting
    }, {
      timeout: DELAY_TIMEOUT,
    })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {});
}

function UpdateClashDelay(node, url) {
  var ipv6 = 'https://ipv6.google.com'
  var params = {
    'url': url,
    'timeout': 10000
  }
  node['isTestingDelay'] = true
  console.log(node)
  axios
    .get(state.config.clash.apiAddress +
      "/proxies/" +
      encodeURIComponent(node['name']) + '/delay', {
        params
      })
    .then((response) => {
      state.clashProxies.isUpdatingDelay = true
      for (var item in state.clashProxies.all) {
        var item = state.clashProxies.all[item]
        if (item['name'] == node['name']) {
          item['delay'] = response.data['delay']
          break
        }
      }
      node['isTestingDelay'] = false
      state.clashProxies.isUpdatingDelay = false
    })
    .catch((error) => {
      node['delay'] = -1
      node['isTestingDelay'] = false
    });
}

function UpdateClashGroupDelay(url) {
  var ipv6 = 'https://ipv6.google.com'
  var params = {
    'url': url,
    'timeout': 10000
  }
  var nodes = state.clashProxies.show
  for (var item in nodes) {
    var item = nodes[item]
    item['isTestingDelay'] = true
    item['delay'] = -1
  }
  axios
    .get(state.config.clash.apiAddress +
      "/group/proxy/delay", {
        params
      })
    .then((response) => {
      state.clashProxies.isUpdatingDelay = true
      for (var item in nodes) {
        var item = nodes[item]
        if (item['name'] in response.data) {
          item['delay'] = response.data[item['name']]
        }
        item['isTestingDelay'] = false
      }
      state.clashProxies.isUpdatingDelay = false
    })
    .catch((error) => {
      state.clashProxies.isUpdatingDelay = false
    });
}

function SortClashProxyNode() {
  var sortOpts = state.config.simplified.sortOpts
  state.clashProxies.show = DeepCopy(state.clashProxies.all)

  var autoSelete = null
  if (state.clashProxies.show.length > 0) {
    var autoSelete = state.clashProxies.show.shift()
  }

  if (sortOpts.includes('按延迟排序') || sortOpts.includes('Sort By Delay')) {
    state.clashProxies.show = state.clashProxies.show.sort((a, b) => {
      var a1 = a['delay']
      var b1 = b['delay']
      if (a1 == -1) {
        a1 = 100000
      }
      if (b1 == -1) {
        b1 = 100000
      }
      return a1 - b1
    })

  }
  if (sortOpts.includes('过滤不可用') || sortOpts.includes('Only Show Available')) {
    state.clashProxies.show = state.clashProxies.show.filter((item) => {
      return item['delay'] !== -1
    })
  }
  if (autoSelete != null) {
    state.clashProxies.show = [autoSelete].concat(state.clashProxies.show)
  }
}

function ConnectErrorMsg(msg, duration) {
  DisConnect()
  Notification({
    message: msg,
    type: "error",
    duration: duration, // 0 means forever
  });
}

function CloseCore() {
  if (!state.connection.isConnected) {
    return;
  }
  MyPost(state.apiAddress + '/close_core', {}).then(function(_) {
    Message({
      type: 'success',
      message: Translator({
        'cn': "内核已关闭！",
        'en': 'Core Closed!'
      })
    });
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: Translator({
        'cn': "内核关闭失败",
        'en': 'Failed to close Core'
      })
    });
  });
}

function GetWarp() {
  if (!state.connection.isConnected) {
    return;
  }
  state.pannel.isLoadingWarp = true
  var outbound_obj = state.pannel.info
  MyPost(state.apiAddress + '/get_warp', {}).then(function(data) {
    state.pannel.isLoadingWarp = false
    data = data.data['res']
    console.log(data)
    console.log(outbound_obj)
    outbound_obj.setting['private_key'] = data['PrivateKey']
    outbound_obj.setting['peer_public_key'] = data['PublicKey']
    outbound_obj.setting['peer_public_key'] = data['PublicKey']
    outbound_obj.setting['reserved'] = data['ClientID']
    outbound_obj.setting['local_address'] = [data['Address1'] + "/32", data['Address2'] + "/128"]
    outbound_obj.transport['address'] = data['EndpointAddress']
    outbound_obj.transport['port'] = parseInt(data['EndpointPort'])

    Message({
      type: 'success',
      message: Translator({
        'cn': "已注册并生成Warp",
        'en': 'warp ok'
      })
    });
  }).catch(function(error) {
    state.pannel.isLoadingWarp = false
    console.log(error)
    Message.error({
      message: Translator({
        'cn': "Warp 生成失败",
        'en': 'Failed to build warp'
      })
    });
  });
}

function CloseUIF() {
  if (!state.connection.isConnected) {
    return;
  }
  MyPost(state.apiAddress + '/close_uif', {}).then(function(_) {
    Message({
      type: 'success',
      message: Translator({
        'cn': 'UIF 已关闭！',
        'en': 'UIF Closed!'
      })
    });
  }).catch(function(error) {
    Message({
      type: 'success',
      message: Translator({
        'cn': 'UIF 已关闭！',
        'en': 'UIF Closed!'
      })
    });
  });
}

function GetUIFConfig() {
  if (!state.connection.isConnected) {
    return;
  }
  MyPost(state.apiAddress + '/get_uif_config', {}).then(function(res) {
    if (res.data == '') {
      return
    }
    state.config = InitSetting(res.data.uif, state.config)
    if (res.data.data != undefined) {
      configObj.state.config = res.data.data
    }

    if ('lang' in state.config) {
      SetLang(state.config.lang)
    } else {
      SetLang('cn')
    }

    ClashConnection()
    if (ParseUIFAction()) {
      return
    }

    if ('simplified' in state.config) {
      if (GetSimpleStyle() != state.config.simplified.enabled) {
        SetSimpleStyle(state.config.simplified.enabled)
        window.location.reload();
      }
    }

  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: 'Failed: ' + error
    });
  });
}

function InitSimple() {
  if (state.config.simplified.enabled) {
    var isFound = false
    var inboundMode = state.config.simplified.inboundMode
    var inbounds = configObj.state.config.inbounds
    for (var item in inbounds) {
      item = inbounds[item]
      if (item['protocol'] == inboundMode) {
        isFound = true
        item['enabled'] = true
      } else {
        item['enabled'] = false
      }
    }
    if (!isFound) {
      var inb = newDefaultHttpIn()
      if (inboundMode == 'tun') {
        inb = newDefaultTunIn('fakeip')
      }
      inb['enabled'] = true
      inbounds.push(inb)
    }
    state.config.clash.enabled = true
    ApplyCoreConfig()
  }
  SaveUIFConfig()
}

function ApplyCoreConfig() {
  if (!state.connection.isConnected) {
    return;
  }
  var coreConfig = BuildCoreConfig(state.config, configObj.state.config, true, false)

  var inboudPorts = []
  for (var item in coreConfig['inbounds']) {
    item = coreConfig['inbounds'][item]
    if (item['listen'] != '0.0.0.0') {
      continue
    }
    inboudPorts.push(item['listen_port'].toString())
  }

  var c = state.config.clash
  if (c.enabled && c.apiIP != '127.0.0.1' && c.external_ui != '' && c.apiPort != '') {
    inboudPorts.push(c.apiPort)
  }

  var content = {
    config: coreConfig,
    inboudPorts: inboudPorts,
  }
  MyPost(state.apiAddress + '/run_core', content).then(function(_) {
    Message({
      type: 'success',
      message: Translator({
        'cn': '内核已更新！',
        'en': 'Core Updated.'
      })
    });
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: 'Core Update Failed: ' + error
    });
  });
}

// save and apply UIF config, then apply this config to core config.
function SaveUIFConfig() {
  if (!state.connection.isConnected) {
    return;
  }
  var shareConfig = {}
  try {
    shareConfig = BuildShareCoreConfig(state.config, configObj.state.config)
  } catch (e) {
    console.log(e)
  }

  MyPost(state.apiAddress + '/save_uif_config', {
    config: {
      uif: state.config,
      data: configObj.state.config
    },
    shareConfig: shareConfig
  }).then(function(_) {
    if (state.loginSession.isReloadWeb) {
      window.location.reload();
    }
    Message({
      type: 'success',
      message: Translator({
        'cn': 'UIF 配置保存成功！',
        'en': 'Config Saved.'
      })
    });
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: 'Config save failed: ' + error
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

function ParseUIFAction() {
  if (!state.connection.isConnected) {
    return false;
  }

  var savedAction = GetUIFActions()
  if (savedAction != null) {
    SetUIFAction('') // clear
    DoAction(savedAction)
    return true
  }

  var currentURL = window.location.href
  const url = new URL(currentURL);
  const queryParams = url.searchParams;
  var action = queryParams.get('action');
  if (action == null) {
    return false
  }
  var name = url.hash
  if (name == '') {}

  var parsedAction = {
    'actionType': action
  }
  if (action == 'add_subcription') {
    var importType = queryParams.get('import_type')
    if (importType == null || importType == '') {
      importType = 'link'
    }
    parsedAction['import_type'] = importType
    parsedAction['data'] = queryParams.get('data')
    if (parsedAction['data'] == null) {
      parsedAction['data'] = ''
    }
    parsedAction['tag'] = queryParams.get('tag')
    if (parsedAction['tag'] == null || parsedAction['tag'] == '') {
      parsedAction['tag'] = `UIF[${moment().format("YYYY-MM-DD HH:MM:SS")}]`
    }
  }
  console.log(url)
  SetUIFAction(parsedAction)
  if (state.config.simplified.enabled) {
    window.location.replace(url.origin + '/#/simple/out')
  } else {
    window.location.replace(url.origin + '/#/out/subscribe')
  }
  return true
}

function DoAction(action) {
  console.log(action)
  Notification.closeAll()
  var actionType = action['actionType']
  if (actionType == 'add_subcription' && action['data'] != '') {
    state.subscribe.info.tag = action['tag']
    state.subscribe.info.type = action['import_type']
    state.subscribe.info.data = action['data']
    state.subscribe.isQuicImport = true
    state.subscribe.isAdding = true
    state.subscribe.isOpenSub = true
  } else {
    var msg = Translator({
      'cn': "无效的 UIF 动作，如需帮助请联系提供该动作的人员",
      'en': 'invalid UIF action.'
    })
    var msgType = 'warning'
    Notification({
      message: msg,
      type: msgType,
      duration: 0, // 0 means forever
    });
  }
}

function Connect() {
  Notification.closeAll()
  if (state.connection.isConnected) {
    DisConnect()
    return;
  }
  var url = new URL(state.apiAddress)
  state.apiAddress = url.origin

  state.connection.isConnecting = true
  SetKey(state.password)

  MyPost(state.apiAddress + '/connect', {}).then(function(res) {
    state.connection.isConnecting = false

    if ('status' in res.data) { // failed to check.
      var msg = Translator({
        'cn': "UIF 后端已运行，请先输入密码 验证登录",
        'en': 'UIF is running, but you must login with password'
      })
      var msgType = 'warning'
      if (state.password != '') {
        msg = Translator({
          'cn': `验证失败！UIF密码 错误`,
          'en': 'Wrong UIF password'
        })
        msgType = 'error'
      }
      Notification({
        message: msg,
        type: msgType,
        duration: 0, // 0 means forever
      });
      return
    }


    UpdateInfo(res)
    SetKey(state.password)
    SetAPIAddress(state.apiAddress)
    SetSession({
      'password': state.password,
      'value': state.apiAddress
    })

    if (res.data.isFirstTime) {
      InitUIFState()
      state.apiAddress = GetAPIAddress()
      state.password = GetKey()
      state.connection.isConnected = true
      state.loginSession.isReloadWeb = true
      InitConfigState()

      SetSimpleStyle(false)
      if (res.data.useSimplified === true) {
        state.config.simplified.enabled = true
        SetSimpleStyle(true)
        InitSimple() // will SaveUIFConfig
        return
      }

      ApplyCoreConfig()
      SaveUIFConfig()
      return
    } else {
      GetUIFConfig()
    }
    Notification({
      message: Translator({
        'cn': "连接 UIF 成功！",
        'en': 'Connected!'
      }),
      type: "success",
      duration: 3000,
    });
  }).catch(function(error) {
    console.log(error)
    ConnectErrorMsg("无法连接后端，UIF 功能不可用，请确保本机正确地安装 UIF 并启动！", 0)
  });

}

function DisConnect() {
  Notification.closeAll()
  state.connection.isConnected = false
  state.connection.isConnecting = false
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
    .catch(function(_) {});

}

async function UpdateSub() {
  return await UpdateSub2(state.subscribe.info, false)
}

function UpdateSubExtraInfo() {
  if (!state.connection.isConnected || !state.config.simplified.enabled) {
    return;
  }

  for (var item in configObj.state.config.subscribe) {
    var item = configObj.state.config.subscribe[item]
    if (!('updateTime' in item)) {
      continue
    }
    var pastTime = moment(item['updateTime']);
    var currentTime = moment();
    var hoursDifference = currentTime.diff(pastTime, 'hours');

    console.log(hoursDifference)
    if (hoursDifference < 1) {
      continue
    }

    var extra = item['extra']
    if (
      extra != undefined &&
      extra != null &&
      extra["traffic"] != null &&
      extra["traffic"] != undefined &&
      extra["traffic"]["total"] != undefined &&
      extra["traffic"]["total"] != 0
    ) {
      UpdateSub2(item, true)
    }
  }

}

async function UpdateSub2(info, isUpdatingExtraData) {
  var rawData = info.data
  info.updateTime = moment().valueOf();
  if (info.type == 'link') {
    if (!state.connection.isConnected) {
      if (isUpdatingExtraData) {
        return
      }
      Message.error({
        message: Translator({
          'cn': '需先连接后端！',
          'en': 'Not connected.'
        })
      });
      return;
    }
    try {
      var res = await MyPost(state.apiAddress + "/proxy_get", {
        dst: info.data,
      });
      console.log(res)
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
    console.log(res.data);
    rawData = res.data["res"]
  } else if (isUpdatingExtraData) {
    return
  }

  if ('extra-info' in res.headers) {
    var ExtraInfo = JSON.parse(res.headers['extra-info'])
    if (!('extra' in info)) {
      info['extra'] = {}
    }
    info['extra']['openWebURL'] = ExtraInfo['profile-web-page-url']
    info['extra']['traffic'] = parseTraffic(ExtraInfo['subscription-userinfo'])
  }

  if (isUpdatingExtraData) {
    return
  }

  var outList = TryParse(rawData);
  if (outList.length == 0) {
    Message.error({
      message: Translator({
        'cn': "导入数据解析出错！可能不支持该订阅格式",
        'en': 'Parse Failed.'
      })
    });
    return false;
  }
  console.log(outList)

  for (var item in outList) {
    item = outList[item];
    item["enabled"] = false;
    item["delay"] = '';
    item["core_tag"] = '';
    item["id"] = uuidv4();
  }
  info.outbounds = outList;
  return true
}

function parseTraffic(data) {
  if (data != '' && data != undefined) {
    const pairs = data.split('; ');
    const result = {};
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      result[key] = Number(value);
    });
    return result
  }
  return null
}

function TestWeb1(t, start) {
  t["isTesting"] = true;
  var dst = "https://www." + t["domain"]
  MyPost(state.apiAddress + "/proxy_get", {
      dst: dst,
      proxy_first: "true",
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
    }).catch(function(e) {
      t["isTesting"] = false;
      t["delay2"] = -1;
      console.log(e)
    });
}

function TestWeb() {
  if (!state.connection.isConnected) {
    Message.error({
      message: Translator({
        'cn': '需先连接后端！',
        'en': 'Not connected.'
      })
    });
    return;
  }
  for (var item in state.testWebsiteList) {
    TestWeb1(state.testWebsiteList[item], new Date().getTime())
  }
}

function BuildShareLink() {
  if (!state.connection.isConnected) {
    Message.error({
      message: Translator({
        'cn': '需先连接后端！',
        'en': 'Not connected.'
      })
    });
    return '';
  }
  var apiAddress = new URL(state.apiAddress)
  return apiAddress.origin +
    "/share?key=" +
    encodeURIComponent(getToken());
}

async function InstallAutoStartup() {
  try {
    var res = await MyPost(state.apiAddress + "/auto_startup", {
      isInstall: state.config.startup,
    });
  } catch (error) {
    console.log(error);
    Message.error({
      message: 'Failed: ' + error
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
    message: Translator({
      'cn': "'设置开机自启成功！'",
      'en': 'OK!'
    })
  });
  return true
}

function TestNode(uifStyleNodeConfig) {
  if (!state.connection.isConnected) {
    return;
  }
  for (var item in uifStyleNodeConfig) {
    uifStyleNodeConfig[item]['delay'] = ' '
  }

  var tags = []
  var i = 0
  var config = BuildTestNodeTemplate(uifStyleNodeConfig, false)
  for (var item in config['outbounds']) {
    if (item == 0) {
      continue
    }
    item = config['outbounds'][item]
    item['tag'] = i.toString()
    tags.push(i.toString())
    i += 1
  }

  setTimeout(function() {
    for (var item in uifStyleNodeConfig) {
      if (uifStyleNodeConfig[item]['delay'] == ' ') {
        uifStyleNodeConfig[item]['delay'] = '-1'
      }
    }
  }, DELAY_TIMEOUT)

  MyWS(state.apiAddress + '/delay', {
    config: JSON.stringify(config),
    tags: tags,
  }, function(response) {
    console.log(response)
    var data = JSON.parse(response.data)
    var i = parseInt(data['tag'])
    var item = uifStyleNodeConfig[i]
    if (data['status'] == 0 && data['delay'] != 0) {
      item.delay = data['delay'].toString();
    } else {
      item.delay = '-1'
    }
  }, function(error) {
    Message.error({
      message: 'Failed: ' + error
    });
  });
}

function TestNodeIPInfo(uifStyleNodeConfig) {
  if (!state.connection.isConnected) {
    return;
  }
  domainList = {
    '1': function(data) {

    },
    '2': function(data) {

    }
  }
  var tags = []
  var config = BuildTestNodeTemplate(uifStyleNodeConfig, false)
  for (var item in domainList) {
    tags.push(item)
  }

  MyWS(state.apiAddress + '/delay', {
    config: JSON.stringify(config),
    is_ip_info: true,
    tags: tags,
  }, function(response) {
    var data = JSON.parse(response.data)
    var i = data['tag']
    domin[i].cb(data)
  }, function(error) {
    console.log(error)
  });
}

function AddNewSubcription() {
  state.subscribe.info = newSub();
  state.subscribe.isAdding = true;
  state.subscribe.isOpenSub = true;
}

function Init() {
  var address = GetAPIAddress()
  if (address != '') {
    state.apiAddress = address
  }
  state.password = GetKey()
  var session = GetAllSession()
  if (session.length != 0) {
    state.loginSession = session
  }
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
  BuildShareLink,
  TestNode,
  InstallAutoStartup,
  GetWarp,
  ClashChangeProxy,
  UpdateClashDelay,
  AddNewSubcription,
  UpdateClashGroupDelay,
  InitSimple,
  SortClashProxyNode,
}

export default {
  namespaced: true,
  state,
  actions
}
