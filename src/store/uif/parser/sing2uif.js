function GetThenDelete(j, k) {
  if (k in j) {
    var res = j[k]
    delete j[k]
    return res
  }
}

export function Sing2UIF(rawData) {
  rawData = JSON.parse(rawData)
  var outbounds = rawData['outbounds']
  var res = [];
  for (var item in outbounds) {
    item = outbounds[item]
    if (['selector', 'urltest', 'direct', 'block', 'dns'].includes(item['type'])) {
      continue
    }
    var uif = {
      'transport': {}
    }

    // transport
    uif.transport.protocol = 'tcp'
    if ('transport' in item) {
      uif.transport.protocol = GetThenDelete(item['transport'], 'type')
      if (uif.transport.protocol == undefined) {
        uif.transport.protocol = 'tcp'
      }
      uif.transport['setting'] = item['transport']
      delete item['transport']
    }
    uif.transport.address = GetThenDelete(item, 'server')
    uif.transport.port = GetThenDelete(item, 'server_port')

    // multiplex
    if ('multiplex' in item) {
      uif.transport.multiplex = item['multiplex']
      delete item['multiplex']
    }

    // tls
    uif.transport['tls_type'] = 'none'
    if ('tls' in item && item['tls']['enabled']) {
      uif.transport['tls_type'] = 'tls'
      uif.transport['tls'] = item['tls']
      delete item['tls']
    }

    if ('tcp_fast_open' in item && item['tcp_fast_open']) {
      uif['dial'] = {
        'tcp_fast_open': true
      }
    }

    if ('tcp_multi_path' in item && item['tcp_multi_path']) {
      if (!('dial' in uif)) {
        uif['dial'] = {}
      }
      uif['dial']['tcp_multi_path'] = true
    }

    // protocol
    uif['tag'] = GetThenDelete(item, 'tag')
    uif['protocol'] = GetThenDelete(item, 'type')
    uif['setting'] = item
    res.push(uif)
  }
  return res
}
