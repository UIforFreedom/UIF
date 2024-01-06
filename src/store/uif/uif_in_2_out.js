import {
  DeepCopy
} from "@/utils";

export default function In2Out(inputJson) {
  var res = DeepCopy(inputJson)
  res['enabled'] = false
  var protocol = res['protocol']
  var proxySetting = DeepCopy(res['setting'])
  var tlsSetting = {}
  if ('tls' in res['transport']) {
    tlsSetting = DeepCopy(res['transport']['tls'])
  }

  if (['tun', 'http', 'socks', 'mixed'].includes(protocol)) {
    throw 'Can not share protocol ' + protocol
  }

  if ('users' in res['setting']) {
    for (var item in res['setting']['users'][0]) {
      proxySetting[item] = res['setting']['users'][0][item]
    }
    if ('users' in proxySetting) {
      delete proxySetting['users']
    }
    if ('name' in proxySetting) {
      delete proxySetting['name']
    }
  }

  if (['http', 'socks', 'mixed'].includes(protocol)) {
    proxySetting = {}
  } else if (protocol == 'vmess') {
    if ('alterId' in proxySetting) {
      delete proxySetting['alterId']
    }
    proxySetting['alter_id'] = res['setting']['users'][0]['alterId']
  } else if (protocol == 'hysteria') {
    if ('recv_window_client' in proxySetting) {
      delete proxySetting['recv_window_client']
    }
    if ('max_conn_client' in proxySetting) {
      delete proxySetting['max_conn_client']
    }
  } else if (protocol == 'trojan') {
    if ('fallback' in proxySetting) {
      delete proxySetting['fallback']
    }
  } else if (protocol == 'shadowtls') {
    proxySetting = {
      version: proxySetting['version'],
      password: proxySetting['password']
    }
  } else if (protocol == 'tuic') {
    if ('auth_timeout' in proxySetting) {
      delete proxySetting['auth_timeout']
    }
  }
  res['setting'] = proxySetting

  if ('certificate' in tlsSetting) {
    delete tlsSetting['fallback']
  }
  if ('key' in tlsSetting) {
    delete tlsSetting['key']
  }
  if ('tls' in res['transport']) {
    res['transport']['tls'] = tlsSetting
  }
  return res
}
