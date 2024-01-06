import yaml from 'js-yaml'

export function ParseTLS(item) {
  var enabledTLS = 'tls';
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
  return enabledTLS, tlsSetting
}

export function ParseSSPlugin(item) {
  var enabledTLS = 'tls';
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
  return enabledTLS, tlsSetting
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
  };
  if (!(protocol in protocolMap)) {
    console.log(protocol + ' is not supported.')
    return
  }
  protocol = protocolMap[protocol];
  var enabledTLS = 'none';
  var tlsSetting = {};
  var protocolSetting = {};
  var networkSetting = {};
  if (['trojan', 'hysteria2', 'hysteria', 'tuic'].includes(protocol) || ('tls' in item && item['tls'])) {
    var _, r2 = ParseTLS(item)
    enabledTLS = 'tls';
    tlsSetting = r2
  } else if (protocol == 'shadowsocks' && ('plugin' in item && 'plugin-opts' in item)) {
    var pluginOpts = item['plugin-opts']
    protocolSetting['plugin_opts'] = pluginOpts
    protocolSetting['plugin'] = item['plugin']
    if (item['plugin'] == 'obfs') {
      protocolSetting['plugin'] = 'obfs-local'
    }
  }

  var network = 'tcp';
  if ('network' in item) {
    network = item['network'];
    if (network == 'h2' || network == 'http') {
      // throw 'h2 and http is not supported.'
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

  if (enabledTLS == 'tls') {
    tlsSetting['enabled'] = true
  }
  var transport = {
    address: item['server'],
    port: item['port'],
    tls_type: enabledTLS,
    tls: tlsSetting,
    protocol: network,
    setting: networkSetting
  };

  if (protocol == 'trojan') {
    protocolSetting['password'] = item['password']
  } else if (protocol == 'vmess') {
    protocolSetting['security'] = item['cipher']
    protocolSetting['alter_id'] = item['alterId']
    protocolSetting['uuid'] = item['uuid']
  } else if (protocol == 'shadowsocks') {
    protocolSetting['method'] = item['cipher']
    protocolSetting['password'] = item['password']
  } else if (protocol == 'hysteria2' || protocol == 'hysteria') {
    protocolSetting['password'] = item['password']
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
  }
  return {
    tag: item['name'],
    protocol: protocol,
    transport: transport,
    setting: protocolSetting
  }
}

export default function clash2UIF(input) {
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
  var data = data.split(" ")
  return parseInt(data[0])
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
