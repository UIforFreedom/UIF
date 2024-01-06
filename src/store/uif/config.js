import {
  v4 as uuidv4
} from "uuid";

import {
  DeepCopy,
} from '@/utils'

import {
  AddInboudList,
  SetGeo,
  AddRouteList,
  SetDNS,
  SetOutboud
} from "@/uif/template/tun_fakeip";

import uif from './uif'


var transport = {
  setting: {},
  protocol: 'tcp',
  tls_type: 'none',
  // multiplex: {},
  tls: {},
  address: '127.0.0.1',
  port: 443,
}

var route = {
  tag: '未命名规则',
  outbound: 'freedom',

  domain: [],
  domain_suffix: [],
  domain_keyword: [],
  domain_regex: [],
  ip_cidr: [],

  geosite: [],
  geoip: [],
  protocol: [],
  process_name: [],
  port: []
}

var proxy = {
  transport: DeepCopy(transport),
  tag: '', // show to user
  protocol: 'trojan',
  enabled: false,
  delay: '',
  core_tag: '', // unique tag ID.
  setting: {},
}

var subscribe = {
  tag: '未命名 - 订阅',
  updateTime: new Date().valueOf(),
  type: 'link',
  data: '',
  updateGap: "0",
  outbounds: []
}

function newFreedomOut() {
  var res = DeepCopy(proxy);
  res.tag = 'freedom'
  res.protocol = 'freedom'
  return res
}

function newDefaultHttpOut() {
  var res = DeepCopy(proxy);
  res.tag = '未命名'
  res.protocol = 'http'
  res.transport.address = uif.state.connection.ip
  res.transport.port = 443
  return res
}

function newDefaultHttpIn() {
  var res = DeepCopy(proxy);
  res.tag = '默认 HTTP/Socks 入口'
  res.enabled = false
  res.setting.set_system_proxy = true
  res.protocol = 'mixed'
  res.transport.address = '127.0.0.1'
  res.transport.port = 9110
  return res
}

function newDefaultTunIn() {
  var res = DeepCopy(proxy);
  res.tag = 'Tun (需管理员权限)'
  res.enabled = false
  res.protocol = 'tun'
  res.setting = {
    interface_name: "uif_tun",
    inet4_address: "172.19.0.1/30",
    inet6_address: "",
    inet4_range: "198.18.0.0/15",
    inet6_range: "",
    auto_route: true,
    mtu: 9000,
    strict_route: false,
    stack: "system",
    mode: "fakeip",

  }
  return res
}

function newDefaultRoute() {
  var res = DeepCopy(route);
  return res
}

function BuildDefaultRoute() {
  var res = []
  var defaultList = ["youtube", "facebook", "google", "netflix", "telegram", "twitter"]
  defaultList = []
  for (var item in defaultList) {
    item = defaultList[item]
    var r = newDefaultRoute()
    r.tag = item
    r.geosite = [item]
    r.outbound = "proxy"
    res.push(r)
  }
  return res
}

function newSub() {
  var res = DeepCopy(subscribe);
  return res
}

var config = {
  outbounds: [],
  subscribe: [],
  inbounds: [newDefaultHttpIn(), newDefaultTunIn()],
  routes: BuildDefaultRoute()
}

// parse to singbox style
function UpdateConfig() {
  var coreConfig = AddInboudList(config.inbounds);
  SetOutboud(coreConfig, newFreedomOut())
  SetGeo(coreConfig, uif.state.geoIPAddress, uif.state.geoSiteAddress)
  AddRouteList(coreConfig, config.routes)
  SetDNS(coreConfig, uif.state.dnsAddress)
  console.log(coreConfig)
}

const state = {
  config: config,
}


const actions = {
  newDefaultHttpOut,
  UpdateConfig
}

var configObj = {
  namespaced: true,
  state,
  actions
}

export {
  configObj,
  newDefaultHttpOut,
  newSub,
  newDefaultRoute,
  newFreedomOut
}
