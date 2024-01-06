export default function Xray2UIF(rawData) {
  rawData = JSON.parse(rawData)
  var outbounds = rawData['outbounds']

  var res = [];
  for (var item in outbounds) {
    item = outbounds[item]
    var protocol = item['protocol']
    var uif = {
      'transport': {},
      'protocol': protocol,
      'tag': item['tag'],
    }

    // init stream settings.
    var stream = item['streamSettings']
    var uifTransportSetting = {}
    if ('streamSettings' in stream) {
      stream = item['streamSettings']
    }
    var network = 'tcp'
    if ('network' in stream) {
      network = item['network']
    }
    var streamSettings = stream[network + 'Settings']
    if (network == 'ws') {
      uifTransportSetting['path'] = streamSettings['path']
      uifTransportSetting['headers'] = streamSettings['headers']
    } else if (network == 'grpc') {
      uifTransportSetting['service_name'] = streamSettings['serviceName']
    }

    // init TLS
    var tls_type = 'none'
    if ('security' in stream) {
      tls_type = stream['security']
    }
    var uifTLSSetting = {}
    if (tls_type == 'tls') {
      var tlsSetting = streamSettings['tlsSettings']
      uifTLSSetting['enabled'] = true
      uifTLSSetting['server_name'] = tlsSetting['serverName']
      uifTLSSetting['alpn'] = tlsSetting['alpn']
      uifTLSSetting['insecure'] = tlsSetting['allowInsecure']
    }

    // init proxy settings.
    var proxySetting = item['proxySettings']
    var uifProxySetting = {}
    if (protocol == 'shadowsocks') {
      proxySetting = proxySetting['servers'][0]
      uifProxySetting['method'] = proxySetting['method']
      uifProxySetting['password'] = proxySetting['password']
    } else if (protocol == 'vmess') {
      proxySetting = proxySetting['vnext'][0]
      uifProxySetting['uuid'] = proxySetting['users']['id']
      if ('security' in proxySetting['users']) {
        uifProxySetting['security'] = proxySetting['users']['security']
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
    }

    var address = proxySetting['address']
    var port = proxySetting['port']

    // parse to uif style.
    uif['setting'] = uifProxySetting
    uif['transport'] = {
      setting: uifTransportSetting,
      protocol: network,
      tls_type: tls_type,
      tls: {},
      address: address,
      port: port,
    }
    res.push(uif)
  }
  return res
}
