import {
  Base64
} from 'js-base64';


function V2rayN2UIF(rawData) {
  var res = []
  rawData = Base64.decode(rawData)
  var protocolMap = {
    'ss:': 'shadowsocks',
    'trojan:': 'trojan',
    'trojan-go:': 'trojan',
    'hysteria2:': 'hysteria2',
    'vmess:': 'vmess'
  }
  rawData = rawData.split('\n')
  for (var item in rawData) {
    item = rawData[item]
    if (item == '') {
      continue
    }
    var url = new URL(item)
    var protocol = protocolMap[url.protocol]
    if (!['shadowsocks', 'trojan', 'vmess', 'hysteria2'].includes(protocol)) {
      continue
    }
    var transport = {
      'protocol': 'tcp',
      'tls_type': 'none',
      'tls': {},
    }
    var protocolSetting = {}
    var transportSetting = {}
    var address = ''
    var port = 443
    var tag = ''
    if (protocol == 'vmess') { //{{{
      var data = item.split('://')
      data = JSON.parse(Base64.decode(data[1]))
      url.data = data
      protocolSetting['uuid'] = data.id
      protocolSetting['alter_id'] = parseInt(data.aid)
      if ('scy' in data) {
        protocolSetting['security'] = data.scy
      } else {
        protocolSetting['security'] = 'auto'
      }
      if ('type' in data && data['type'] != 'none' && data['type'] != '' && data['type'] != 'auto') {
        throw 'type in vmess is not supported.'
      }
      if ('net' in data && data['net'] != 'tcp') {
        if (!['ws', 'quic'].includes(data['net'])) {
          throw 'transport protocol not supported.'
        }
        transport['protocol'] = data['net']
        if (data['net'] == 'ws') {
          if ('host' in data) {
            transportSetting['headers'] = {
              'Host': data['host']
            }
          }
          if ('path' in data) {
            transportSetting['path'] = data['path']
          } else {
            transportSetting['path'] = '/'
          }
        }
      }
      if ('tls' in data && data['tls'] == 'tls') {
        transport['tls_type'] = 'tls'
        if ('sni' in data && data['sni'] != '') {
          transport['tls']['server_name'] = data['sni']
        }
        if ('alpn' in data && data['alpn'] != '') {
          transport['tls']['alpn'] = data['alpn'].split(',')
        }
        if ('fp' in data && data['fp'] != '') {
          transport['tls']['utls'] = {
            'enabled': true,
            'fingerprint': data['fp']
          }
        }
      }
      address = data.add
      port = parseInt(data.port)
      tag = data.ps
    } else { //}}}
      var temp = url.href.split('@')
      var password = temp[0].split('://')[1]
      url = new URL(item.replace(password + '@', ''))
      if (temp[1].indexOf(':') != -1) {
        address = temp[1].split(':')
        port = parseInt(address[1].split('/')[0])
        address = address[0]
      } else {
        address = temp[1].split('/')[0]
      }
      if (protocol == 'shadowsocks') {
        password = Base64.decode(password).split(':')
        protocolSetting['method'] = password[0]
        password = password[1]
      } else {
        transport['tls_type'] = 'tls'
        var sni = url.searchParams.get('sni')
        if (sni != undefined) {
          transport['tls']['server_name'] = sni
        }

        var type = url.searchParams.get('type')
        if (type == 'ws') {
          transport['protocol'] = 'ws'
          transportSetting['path'] = url.searchParams.get('path')
          var host = url.searchParams.get('host')
          if (host != undefined) {
            transportSetting['headers'] = {
              'Host': host
            }
          }
        }

        var insecure = url.searchParams.get('insecure')
        if (insecure == '1' || insecure == 'true') {
          transport['tls']['insecure'] = true
        }

        var obfs = url.searchParams.get('obfs')
        if (obfs != '' && obfs != undefined) {
          protocolSetting['obfs'] = {
            'type': obfs,
            'password': url.searchParams.get('obfs-password')
          }
        }
      }
      protocolSetting['password'] = password
      tag = decodeURIComponent(url.hash.substring(1))
    }
    if (transport['tls_type'] == 'tls') {
      transport['tls']['enabled'] = true
    }
    transport['address'] = address
    transport['port'] = port
    transport['setting'] = transportSetting

    var itemRes = {
      'protocol': protocol,
      'tag': tag,
      'setting': protocolSetting,
      'transport': transport
    }
    res.push(itemRes)
  }
  return res;
}

export default V2rayN2UIF
