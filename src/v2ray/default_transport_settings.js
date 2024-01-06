// 全局默认配置，如果出或入站没填写传输方法，将用此默认配置填充
const TransportObject = {
  "tcpSettings": {
    "acceptProxyProtocol": false,
    "header": {
      "type": "none"
    }
  },
  "kcpSettings": {
    "mtu": 1350,
    "tti": 20,
    "uplinkCapacity": 5,
    "downlinkCapacity": 20,
    "congestion": false,
    "readBufferSize": 1,
    "writeBufferSize": 1,
    "header": {
      "type": "none"
    },
    "seed": "Password"
  },
  "wsSettings": {
    "acceptProxyProtocol": false,
    "path": "/",
    "headers": {
      "Host": "v2ray.com"
    },
    "maxEarlyData": 1024,
    "useBrowserForwarding": true
  },
  "httpSettings": {
    "host": [
      "v2ray.com"
    ],
    "path": "/random/path"
  },
  "quicSettings": {
    "security": "none",
    "key": "",
    "header": {
      "type": "none"
    }
  },
  "dsSettings": {
    "path": "/path/to/ds/file",
    "abstract": false,
    "padding": false
  },
  "grpcSettings": {
    "serviceName": "GunService"
  }
}

function Init(streamSettings) {
  if ('network' in streamSettings) {
    var type = streamSettings['network'] + 'Settings'
    if (type in streamSettings) {
      streamSettings[type] = TransportObject[type]
    } else {
      for (var item in TransportObject[type]) {
        if (!(type in streamSettings)) {
          streamSettings[type][item] = TransportObject[type][item]
        }
      }
    }
  }

  return streamSettings

}

export default {
  TransportObject,
  Init
}
