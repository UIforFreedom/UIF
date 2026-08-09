import {
  BuildShareIP
} from "@/uif/template/tun_fakeip";

import {
  DeepCopy,
  DeleteKeyFromDict
} from "./utils.js";

export function In2Out(inputJson) {
  var res = DeepCopy(inputJson)
  res['enabled'] = false
  var proxyProtocol = res['protocol']
  var proxySetting = DeepCopy(res['setting'])
  var transport = res['transport']
  var tlsSetting = {}
  if ('tls' in transport) {
    tlsSetting = DeepCopy(transport['tls'])
  }

  var address = transport['address']
  if (address != '127.0.0.1') {
    transport['address'] = BuildShareIP()
    if ('domain' in transport) {
      var domain = transport['domain']
      if (domain != '') {
        transport['address'] = domain
      }
      DeleteKeyFromDict('domain', transport)
    }
    if ('bindPort' in transport) {
      var bindPort = transport['bindPort']
      if (bindPort != '') {
        transport['port'] = parseInt(bindPort)
      }
      DeleteKeyFromDict('bindPort', transport)
    }
  } else {
    throw 'can not share address 127.0.0.1; Please set it to 0.0.0.0'
  }

  if (['tun', 'http', 'socks', 'mixed'].includes(proxyProtocol)) {
    throw 'Can not share protocol ' + proxyProtocol
  }

  if ('users' in res['setting']) {
    for (var item in res['setting']['users'][0]) {
      proxySetting[item] = res['setting']['users'][0][item]
    }
    DeleteKeyFromDict('users', proxySetting)
    DeleteKeyFromDict('name', proxySetting)
  }

  if (['http', 'socks', 'mixed'].includes(proxyProtocol)) {
    proxySetting = {}
  } else if (proxyProtocol == 'vmess') {
    proxySetting['alter_id'] = res['setting']['users'][0]['alterId']
    DeleteKeyFromDict('alterId', proxySetting)
  } else if (proxyProtocol == 'hysteria') {
    DeleteKeyFromDict('recv_window_client', proxySetting)
    DeleteKeyFromDict('max_conn_client', proxySetting)
  } else if (proxyProtocol == 'hysteria2') {
    DeleteKeyFromDict('ignore_client_bandwidth', proxySetting)
    DeleteKeyFromDict('masquerade', proxySetting)
  } else if (proxyProtocol == 'trojan') {
    DeleteKeyFromDict('fallback', proxySetting)
  } else if (proxyProtocol == 'shadowtls') {
    proxySetting = {
      version: proxySetting['version'],
      password: proxySetting['password']
    }
  } else if (proxyProtocol == 'tuic') {
    DeleteKeyFromDict('auth_timeout', proxySetting)
  } else if (proxyProtocol == 'vless') {
    DeleteKeyFromDict('auth_timeout', proxySetting)
  } else if (proxyProtocol == 'hysteria') {
    DeleteKeyFromDict('recv_window_client', proxySetting)
    DeleteKeyFromDict('max_conn_client', proxySetting)
  }
  res['setting'] = proxySetting

  DeleteKeyFromDict('key', tlsSetting)
  DeleteKeyFromDict('acme', tlsSetting)
  DeleteKeyFromDict('acme', tlsSetting)
  if ('tls' in transport) {
    if ('certSignType' in transport && transport['certSignType'] == 'skip') {
      tlsSetting['insecure'] = true
      tlsSetting['certificate'] = ''
    }
    if ('reality' in tlsSetting) {
      var reality = tlsSetting['reality']
      reality['short_id'] = reality['short_id'][0]
      DeleteKeyFromDict('handshake', reality)
      DeleteKeyFromDict('max_time_difference', reality)
      DeleteKeyFromDict('private_key', reality)
    }
    transport['tls'] = tlsSetting
  }

  if ('dial' in res) {
    var tcp_multi_path = false
    var tcp_fast_open = false
    if ('tcp_multi_path' in res['dial'] && res['dial']['tcp_multi_path']) {
      tcp_multi_path = true
    }
    if ('tcp_fast_open' in res['dial'] && res['dial']['tcp_fast_open']) {
      tcp_fast_open = true
    }
    res['dial'] = {
      'tcp_fast_open': tcp_fast_open,
      'tcp_multi_path': tcp_multi_path
    }
  }
  return res
}
