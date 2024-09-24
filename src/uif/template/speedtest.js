import {
  DeepCopy
} from '@/utils'

import {
  Outbound
} from '@/store/uif/parser/uif2singbox.js'
import {
  DEFAULT_DNS_LOCAL
} from './tun_fakeip'

import uif from '@/store/uif/uif'


export var MutipleTemplate = {
  "experimental": {
    "clash_api": {
      "external_controller": '127.0.0.1:111111'
    }
  },
  "dns": {
    "servers": [{
      "tag": "dns_direct",
      "address": DEFAULT_DNS_LOCAL,
      "detour": "freedom"
    }],
    "independent_cache": true
  },
  "outbounds": [{
    'tag': 'freedom',
    'type': 'direct'
  }],
  "route": {
    "auto_detect_interface": true
  }
}

export function BuildTestNodeTemplate(uifStyleNodeConfig, isAddHttpInbound) {
  var res = DeepCopy(MutipleTemplate)

  if (isAddHttpInbound) {
    res['inbounds'].push({
      'tag': 'http',
      'type': 'http',
      "server": '127.0.0.1',
      'server_port': 222222
    })
  }

  var dns = uif.state.config.dnsAddress
  res['dns']['servers'][0]['address'] = dns
  for (var item in uifStyleNodeConfig) {
    var out = Outbound(uifStyleNodeConfig[item])
    if ('detour' in out) {
      delete out['detour']
    }
    res['outbounds'].push(out)

    if (isAddHttpInbound) {
      res['route']['final'] = out['tag']
    }
  }
  return res
}
