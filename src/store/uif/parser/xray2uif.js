export function Xray2UIF(rawData) {
  rawData = JSON.parse(rawData)
  var outbounds = rawData['outbounds']

  var res = [];
  for (var item in outbounds) {
    item = outbounds[item]
    var protocol = item['protocol']
    if (['']) {

    }
    var uif = {
      'transport': {},
      'protocol': protocol,
      'tag': item['tag'],
    }

    // init stream settings.
    var stream = {}
    var uifTransportSetting = {}
    if ('streamSettings' in item) {
      stream = item['streamSettings']
    }
    var network = 'tcp'
    if ('network' in stream) {
      network = stream['network']
    }
    var streamSettings = stream[network + 'Settings']
    if (network == 'ws') {
      uifTransportSetting['path'] = '/'
      if ('path' in streamSettings) {
        uifTransportSetting['path'] = streamSettings['path']
      }
      uifTransportSetting['headers'] = streamSettings['headers']
    } else if (network == 'grpc') {
      uifTransportSetting['service_name'] = streamSettings['serviceName']
      if ('idle_timeout' in streamSettings) {
        uifTransportSetting['idle_timeout'] = streamSettings['idle_timeout']
      }
    }

    // init TLS
    var tls_type = 'none'
    if ('security' in stream) {
      tls_type = stream['security']
    }
    var uifTLSSetting = {}
    if (tls_type == 'tls') {
      var tlsSetting = stream['tlsSettings']
      uifTLSSetting['enabled'] = true
      uifTLSSetting['server_name'] = tlsSetting['serverName']
      uifTLSSetting['alpn'] = tlsSetting['alpn']
      uifTLSSetting['insecure'] = tlsSetting['allowInsecure']
    }

    // init proxy settings.
    var proxySetting = item['settings']
    var uifProxySetting = {}
    if (protocol == 'shadowsocks') {
      proxySetting = proxySetting['servers'][0]
      uifProxySetting['method'] = proxySetting['method']
      uifProxySetting['password'] = proxySetting['password']
    } else if (protocol == 'vmess') {
      proxySetting = proxySetting['vnext'][0]
      var users = proxySetting['users'][0]
      uifProxySetting['uuid'] = users['id']
      if ('security' in users) {
        uifProxySetting['security'] = users['security']
      }
    } else if (protocol == 'vless') {
      proxySetting = proxySetting['vnext'][0]
      uifProxySetting['uuid'] = proxySetting['users']['id']
      if ('flow' in proxySetting['users']) {
        var flow = proxySetting['users']['flow']
        if (flow != '' && flow != 'none') {
          uifProxySetting['flow'] = flow
        }
      }
    } else if (protocol == 'trojan') {
      proxySetting = proxySetting['servers'][0]
      uifProxySetting['password'] = proxySetting['password']
    } else {
      continue
    }

    var address = proxySetting['address']
    var port = proxySetting['port']

    // parse to uif style.
    uif['setting'] = uifProxySetting
    uif['transport'] = {
      setting: uifTransportSetting,
      protocol: network,
      tls_type: tls_type,
      tls: uifTLSSetting,
      address: address,
      port: port,
    }
    res.push(uif)
  }
  return res
}
