import {v4 as uuidv4} from "uuid";

import {DeepCopy} from "@/utils";

import uif from "./uif";

var transport = {
  setting: {},
  protocol: "tcp",
  certSignType: "self",
  tls_type: "none",
  tls: {},
  address: "127.0.0.1",
  port: 443,

  domain: "",
  bindPort: "",
};

var dial = {
  detour: {
    id: [],
    tag: "",
  },
};

var route = {
  tag: "New Rule",
  outbound: "freedom",
  id: ["freedom"], // legacy reason

  domain: [],
  domain_suffix: [],
  domain_keyword: [],
  domain_regex: [],
  ip_cidr: [],
  source_ip_cidr: [],
  auth_user: [],

  geosite: [],
  geoip: [],
  protocol: [],
  network: [],
  inbound: [],
  process_name: [],
  port: [],
};

var proxy = {
  enabled: false,

  transport: DeepCopy(transport),
  dial: DeepCopy(dial),

  tag: "", // show to user
  core_tag: "", // unique tag.
  id: "", // unique ID.
  delay: "",

  protocol: "trojan",
  setting: {},
};

var LoginSessionItem = {
  password: "",
  value: "http://127.0.0.1:9413",
};

var subscribe = {
  tag: "New Subscription",
  updateTime: new Date().valueOf(),
  type: "link",
  data: "",
  updateGap: "0",
  enabled: false,
  isCollapsed: false,
  extra: {
    openWebURL: "",
    traffic: {
      upload: 0,
      download: 0,
      total: 0,
      expire: 0,
    },
  },
  outbounds: [],
};

function newFreedomOut() {
  var res = DeepCopy(proxy);
  res.tag = "freedom";
  res.protocol = "freedom";
  return res;
}

function newLoginSession() {
  var res = DeepCopy(LoginSessionItem);
  return res;
}

function newDefaultHttpOut() {
  var res = DeepCopy(proxy);
  res.tag = "New Outbound";
  res.id = uuidv4();
  res.protocol = "http";
  res.transport.address = "127.0.0.1";
  res.transport.port = 443;
  return res;
}

export function newDefaultHttpIn() {
  var res = DeepCopy(proxy);
  res.tag = "HTTP/Socks";
  res.enabled = false;
  res.protocol = "mixed";
  res.transport.address = "127.0.0.1";
  res.transport.port = 9110;
  res.id = uuidv4();
  res.setting.set_system_proxy = true;
  return res;
}

export function newDefaultTunIn(mode) {
  var res = DeepCopy(proxy);
  res.tag = "Tun VPN";
  res.enabled = false;
  res.protocol = "tun";
  res.id = uuidv4();
  res.setting = {
    interface_name: "",
    inet4_address: "172.19.0.1/30",
    inet6_address: "",
    inet4_range: "198.18.0.0/15",
    inet6_range: "",
    auto_route: true,
    mtu: 9000,
    strict_route: false,
    stack: "gvisor",
    mode: mode,
  };
  return res;
}

function newDefaultRoute() {
  var res = DeepCopy(route);
  return res;
}

function BuildDefaultRoute() {
  var res = [];
  var defaultList = [
    "youtube",
    "facebook",
    "google",
    "netflix",
    "telegram",
    "twitter",
  ];
  defaultList = [];
  for (var item in defaultList) {
    item = defaultList[item];
    var r = newDefaultRoute();
    r.tag = item;
    r.geosite = [item];
    r.outbound = "proxy";
    res.push(r);
  }
  return res;
}

function newSub() {
  var res = DeepCopy(subscribe);
  res["id"] = uuidv4();
  return res;
}

function NewDefaultConfig() {
  return {
    outbounds: [],
    subscribe: [],
    inbounds: [newDefaultHttpIn(), newDefaultTunIn("fakeip")],
    routes: BuildDefaultRoute(),
  };
}
function NewDefaultState() {
  return {
    config: NewDefaultConfig(),
  };
}

var config = NewDefaultConfig();
var state = NewDefaultState();

export function InitConfigState() {
  state = NewDefaultState();
}

function FindOutByID(id) {
  var c = state.config;
  for (var i in c["outbounds"]) {
    i = c["outbounds"][i];
    if ("id" in i && i["id"] == id) {
      return i;
    }
  }

  for (var i in c["subscribe"]) {
    i = c["subscribe"][i];
    for (var j in i["outbounds"]) {
      j = i["outbounds"][j];
      if ("id" in j && j["id"] == id) {
        return j;
      }
    }
  }
  return null;
}

function FindInByID(id) {
  var c = state.config;
  for (var i in c["inbounds"]) {
    i = c["inbounds"][i];
    if ("id" in i && i["id"] == id) {
      return i;
    }
  }

  return null;
}

const actions = {
  newDefaultHttpOut,
};

var configObj = {
  namespaced: true,
  state,
  actions,
};

export {
  configObj,
  newDefaultHttpOut,
  newLoginSession,
  newSub,
  newDefaultRoute,
  newFreedomOut,
  FindInByID,
  FindOutByID,
};
