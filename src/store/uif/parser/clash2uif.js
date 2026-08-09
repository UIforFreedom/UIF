import yaml from 'js-yaml'

export function ParseTLS(item) {
  var tlsType = 'tls';
  var tlsSetting = {};
  if ('skip-cert-verify' in item) {
    tlsSetting['insecure'] = item['skip-cert-verify']
  }
  if ('sni' in item) {
    tlsSetting['server_name'] = item['sni']
  } else if ('servername' in item) {
    tlsSetting['server_name'] = item['servername']
  }
  if ('alpn' in item) {
    tlsSetting['alpn'] = item['alpn']
  }

  if ('skip-cert-verify' in item) {
    tlsSetting['insecure'] = item['skip-cert-verify']
  }
  if ('disabled-sni' in item) {
    tlsSetting['disabled_sni'] = item['disabled-sni']
  }
  if ('reality-opt' in item) {
    tlsType = 'reality'
    tlsSetting['reality'] = {
      'enabled': true
    }

    if ('public-key' in item) {
      tlsSetting['reality']['public_key'] = item['public-key']
    }
    if ('short-id' in item) {
      tlsSetting['reality']['short_id'] = item['short-id']
    }
  }
  return [tlsType, tlsSetting]
}

export function ParseOutbound(item) {
  var protocol = item['type'];
  var protocolMap = {
    'ss': 'shadowsocks',
    'trojan': 'trojan',
    'socks5': 'socks',
    'http': 'http',
    'vmess': 'vmess',
    'hysteria': 'hysteria',
    'hysteria2': 'hysteria2',
    'tuic': 'tuic',
    'vless': 'vless',
  };
  if (!(protocol in protocolMap)) {
    console.log(protocol + ' is not supported.')
    return
  }
  protocol = protocolMap[protocol];
  var tlsType = 'none';
  var tlsSetting = {};
  var protocolSetting = {};
  var networkSetting = {};
  if (['trojan', 'hysteria2', 'hysteria', 'tuic', 'vless', 'tuic'].includes(protocol) || ('tls' in item && item['tls'])) {
    var temp = ParseTLS(item)
    tlsType = temp[0]
    tlsSetting = temp[1]
  } else if (protocol == 'shadowsocks' && ('plugin' in item && 'plugin-opts' in item)) {
    var pluginOpts = item['plugin-opts']
    protocolSetting['plugin'] = item['plugin']
    if (item['plugin'] == 'obfs') {
      protocolSetting['plugin'] = 'obfs-local'
      if ('host' in pluginOpts) {
        pluginOpts['obfs-host'] = pluginOpts['host']
        delete pluginOpts['host']
      }
    }
    if ('mux' in pluginOpts) {
      return
    }
    protocolSetting['plugin_opts'] = pluginOpts
  }

  var network = 'tcp';
  if ('network' in item) {
    network = item['network'];
    if (['h2', 'http', 'kcp'].includes(network)) {
      return
    }
  }

  if (network == 'grpc' && 'grpc-opts' in item) {
    networkSetting['service_name'] =
      item['grpc-opts']['grpc-service-name']
  } else if (network == 'ws' && 'ws-opts' in item) {
    var wsOpts = item['ws-opts']
    if ('path' in item['ws-opts']) {
      networkSetting['path'] = wsOpts['path'];
    } else {
      networkSetting['path'] = '/';
    }
    var host = getHost(wsOpts)
    if (host != '') {
      networkSetting['headers'] = {
        "Host": host
      }
    }
  }

  if (tlsType != 'none') {
    tlsSetting['enabled'] = true
  }
  var transport = {
    address: item['server'],
    port: item['port'],
    tls_type: tlsType,
    tls: tlsSetting,
    protocol: network,
    setting: networkSetting
  };

  if (protocol == 'trojan') {
    protocolSetting['password'] = String(item['password'])
  } else if (protocol == 'vmess') {
    protocolSetting['security'] = item['cipher']
    protocolSetting['alter_id'] = item['alterId']
    protocolSetting['uuid'] = item['uuid']
  } else if (protocol == 'shadowsocks') {
    var cipher = item['cipher']
    if (![
        '2022-blake3-aes-128-gcm',
        '2022-blake3-aes-256-gcm',
        '2022-blake3-chacha20-poly1305',
        'aes-128-gcm',
        'aes-192-gcm',
        'aes-256-gcm',
        'chacha20-ietf-poly1305',
        'xchacha20-ietf-poly1305',
        'none',
        'aes-128-ctr',
        'aes-192-ctr',
        'aes-256-ctr',
        'aes-128-cfb',
        'aes-192-cfb',
        'aes-256-cfb',
        'rc4-md5',
        'aes-128-ctr',
        'xchacha20',
      ].includes(cipher)) {
      return
    }
    protocolSetting['method'] = cipher
    protocolSetting['password'] = String(item['password'])
  } else if (protocol == 'hysteria2' || protocol == 'hysteria') {
    var pwd = String(item['password'])
    if (protocol == 'hysteria') {
      if ('auth-str' in item) {
        pwd = String(item['auth-str'])
      } else if ('auth_str' in item) {
        pwd = String(item['auth_str'])
      } else {
        return
      }
      protocolSetting['auth_str'] = pwd
    } else {
      protocolSetting['password'] = pwd
      if ('obfs' in item) {
        protocolSetting['obfs'] = {
          'type': '',
          'password': ''
        }
        protocolSetting['obfs']['type'] = item['obfs']
        protocolSetting['obfs']['password'] = item['obfs-password']
      }
    }
    protocolSetting['up_mbps'] = 0
    protocolSetting['down_mbps'] = 0
    if ('up' in item) {
      protocolSetting['up_mbps'] = getSpeed(item['up'])
    }
    if ('down' in item) {
      protocolSetting['down_mbps'] = getSpeed(item['down'])
    }
  } else if (protocol == 'tuic') {
    protocolSetting['uuid'] = item['uuid']
    protocolSetting['password'] = item['password']
    protocolSetting['congestion_control'] = 'bbr'
    protocolSetting['udp_relay_mode'] = 'native'
    if ('congestion-controller' in item) {
      protocolSetting['congestion_control'] = item['congestion-controller']
    }
    if ('reduce-rtt' in item) {
      protocolSetting['zero_rtt_handshake'] = item['reduce-rtt']
    }
    if ('udp-relay-mode' in item) {
      protocolSetting['udp_relay_mode'] = item['udp-relay-mode']
    }
  } else if (protocol == 'vless') {
    if ('flow' in item) {
      protocolSetting['flow'] = item['flow']
    }
    protocolSetting['uuid'] = item['uuid']
  }
  return {
    tag: item['name'],
    protocol: protocol,
    transport: transport,
    setting: protocolSetting
  }
}

export function Clash2UIF(input) {
  var rawData = yaml.load(input);
  var outbounds = [];
  for (var item in rawData['proxies']) {
    item = rawData['proxies'][item];
    var res = ParseOutbound(item)
    if (res == null) {
      continue
    }
    outbounds.push(res);
  }
  return outbounds
}

function getSpeed(data) {
  if (typeof data === 'number') {
    return data
  } else if (typeof data === 'string') {
    var data = data.split(" ")
    return parseInt(data[0])
  }
  return 0
}

function getHost(opts) {
  var host = ''

  if ('host' in opts) {
    host = opts['host']
  } else if ('Host' in opts) {
    host = opts['Host']
  } else if ('headers' in opts) {
    return getHost(opts['headers'])
  }
  return host
}
