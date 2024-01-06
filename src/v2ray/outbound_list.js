import {
  v4 as uuidv4
} from 'uuid';

function NewTLS() {
  //{{{
  return {
    "serverName": "uifv2ray.xyz",
    "allowInsecure": false,
    "disableSystemRoot": false,
    "alpn": [
      "h2",
      "http/1.1"
    ],
    "certificates": [{
      "usage": "encipherment",
      "certificateFile": "/path/to/certificate.crt",
      "keyFile": "/path/to/key.key",
      "certificate": [],
      "key": []
    }]
  }
  //}}}
}

function NewTCPSetting() {
  //{{{
  return {
    "acceptProxyProtocol": false,
    "header": {
      "type": "none",
      "request": {
        "version": "1.1",
        "method": "GET",
        "path": [
          "/"
        ],
        "headers": {
          "Host": [
            "www.baidu.com",
            "www.bing.com"
          ],
          "User-Agent": [
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_2 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/53.0.2785.109 Mobile/14A456 Safari/601.1.46"
          ],
          "Accept-Encoding": [
            "gzip, deflate"
          ],
          "Connection": [
            "keep-alive"
          ],
          "Pragma": "no-cache"
        }
      },
      "response": {
        "version": "1.1",
        "status": "200",
        "reason": "OK",
        "headers": {
          "Content-Type": [
            "application/octet-stream",
            "video/mpeg"
          ],
          "Transfer-Encoding": [
            "chunked"
          ],
          "Connection": [
            "keep-alive"
          ],
          "Pragma": "no-cache"
        }
      }
    }
  }
  //}}}
}

function NewKCPSetting() {
  //{{{
  return {
    "mtu": 1350,
    "tti": 50,
    "uplinkCapacity": 5,
    "downlinkCapacity": 20,
    "congestion": false,
    "readBufferSize": 2,
    "writeBufferSize": 2,
    "header": {
      "type": "none"
    },
    "seed": "Password"
  }
  //}}}
}

function NewWSSetting() {
  //{{{
  return {
    "acceptProxyProtocol": false,
    "path": "/",
    "headers": {
      "Host": "uifv2ray.xyz"
    },
    "maxEarlyData": 1024,
    "useBrowserForwarding": false,
    "earlyDataHeaderName": ""
  }
  //}}}
}

function NewStreamSettings() {
  //{{{
  return {
    "network": "tcp",
    "security": "none",
    "tlsSettings": NewTLS(),
    "tcpSettings": NewTCPSetting(),
    "kcpSettings": NewKCPSetting(),
    "wsSettings": NewWSSetting(),
    "httpSettings": {
      "host": [
        "uif.com"
      ],
      "path": "/",
      "method": "PUT",
      "headers": {}
    },
    "quicSettings": {
      "security": "none",
      "key": "",
      "header": {
        "type": "none"
      }
    },
    "sockopt": {
      "mark": 0,
      "tcpFastOpen": false,
      "tcpKeepAliveInterval": 0,
      "tproxy": "off"
    }
  }
  //}}}
}

function NewMux() {
  //{{{
  return {
    "enabled": false,
    "concurrency": 8
  }
  //}}}
}

function NewUIFSetting() {
  //{{{
  return {
    'http': {
      "servers": [{
        "address": "192.168.108.1",
        "port": 3128,
        "users": [{
          "user": "",
          "pass": ""
        }]
      }]
    },
    'socks': {
      "servers": [{
        "address": "127.0.0.1",
        "port": 1234,
        "users": [{
          "user": "",
          "pass": "",
          "level": 0
        }]
      }]
    },
    'shadowsocks': {
      "servers": [{
        "email": "love@uifv2ray.com",
        "address": "127.0.0.1",
        "port": 1234,
        "method": "aes-256-gcm",
        "password": "",
        "level": 0
      }]
    },
    'trojan': {
      "servers": [{
        "address": "127.0.0.1",
        "port": 1234,
        "password": "password",
        "email": "love@v2fly.org",
        "level": 0
      }]
    },
    'vless': {
      "vnext": [{
        "address": "uifv2ray.org",
        "port": 443,
        "users": [{
          "id": "57848739-7e62-4138-9fd3-098a63964b6b",
          "encryption": "none",
          "level": 0
        }]
      }]
    },
    'vmess': {
      "vnext": [{
        "address": "127.0.0.1",
        "port": 37192,
        "users": [{
          "id": "37848739-7e62-4138-9fd3-098a63964b6b",
          "alterId": 0,
          "security": "auto",
          "level": 0
        }]
      }]
    }
  }
  //}}}
}

function NewItem() {
  //{{{
  var tag = uuidv4()
  var name = '未命名'

  var template = {
    "sendThrough": "0.0.0.0",
    "protocol": "vmess",
    "settings": {
      "vnext": [{
        "address": "127.0.0.1",
        "port": 37192,
        "users": [{
          "id": "37848739-7e62-4138-9fd3-098a63964b6b",
          "alterId": 0,
          "security": "auto",
          "level": 0
        }]
      }]
    },
    'is_disabled': false,
    "uif_settings": NewUIFSetting(),
    "name": name,
    "tag": tag,
    "streamSettings": NewStreamSettings(),
    "proxySettings": {
      "tag": "another-outbound-tag",
      "transportLayer": false
    },
    "mux": NewMux()
  }
  return template
  // return Object.assign({}, template, {});
  //}}}
}

function ReadUsableOutboundProtocol() {
  //{{{
  var temp = [];
  for (var item in NewUIFSetting()) {
    temp.push(item)
  }
  return temp
  //}}}
}


export default {
  ReadUsableOutboundProtocol,
  NewItem
}
