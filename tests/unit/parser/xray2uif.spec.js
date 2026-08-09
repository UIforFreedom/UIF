import {
  Xray2UIF
} from '@/store/uif/parser/xray2uif.js'

describe('parser:parse to uif config', () => {
  it('trojan with tcp', () => {
    var rawData = {
      "outbounds": [{
        "sendThrough": "0.0.0.0",
        "protocol": "trojan",
        "tag": "tag",
        "streamSettings": {},
        "settings": {
          "servers": [{
            "address": "domain.com",
            "port": 1234,
            "password": "password",
            "email": "love@xray.com",
            "level": 0
          }]
        },
        "mux": {}
      }]
    }
    var res = Xray2UIF(JSON.stringify(rawData));
    expect(res[0]).toEqual({
      "tag": "tag",
      "protocol": "trojan",
      "transport": {
        "address": "domain.com",
        "port": 1234,
        "tls_type": "none",
        "tls": {},
        "protocol": "tcp",
        "setting": {},
      },
      "setting": {
        "password": "password"
      },
    })
  });

  it('freedom', () => {
    var rawData = {
      "outbounds": [{
        "protocol": "freedom"
      }]
    }
    var res = Xray2UIF(JSON.stringify(rawData));
    expect(res.length).toBe(0)
  });

  it('trojan with ws', () => {
    var rawData = {
      "outbounds": [{
        "protocol": "trojan",
        "tag": "tag",
        "streamSettings": {
          'network': 'ws',
          'wsSettings': {
            "acceptProxyProtocol": false,
            "path": "/path",
            "headers": {
              "Host": "uif.org"
            }
          }
        },
        "settings": {
          "servers": [{
            "address": "address",
            "port": 1234,
            "password": "password",
            "email": "love@xray.com",
            "level": 0
          }]
        },
        "mux": {}
      }]
    }
    var res = Xray2UIF(JSON.stringify(rawData));
    expect(res[0]).toEqual({
      "tag": "tag",
      "protocol": "trojan",
      "transport": {
        "address": "address",
        "port": 1234,
        "tls_type": "none",
        "tls": {},
        "protocol": "ws",
        "setting": {
          'path': '/path',
          "headers": {
            "Host": "uif.org"
          }
        },
      },
      "setting": {
        "password": "password"
      },
    })
  });

  it('trojan with grpc', () => {
    var rawData = {
      "outbounds": [{
        "protocol": "trojan",
        "tag": "tag",
        "streamSettings": {
          'network': 'grpc',
          'grpcSettings': {
            "serviceName": "name",
            "multiMode": false,
            "user_agent": "custom user agent",
            "idle_timeout": 60,
            "health_check_timeout": 20,
            "permit_without_stream": false,
            "initial_windows_size": 0
          }
        },
        "settings": {
          "servers": [{
            "address": "address",
            "port": 1234,
            "password": "password",
            "email": "love@xray.com",
            "level": 0
          }]
        },
        "mux": {}
      }]
    }
    var res = Xray2UIF(JSON.stringify(rawData));
    expect(res[0]).toEqual({
      "tag": "tag",
      "protocol": "trojan",
      "transport": {
        "address": "address",
        "port": 1234,
        "tls_type": "none",
        "tls": {},
        "protocol": "grpc",
        "setting": {
          "service_name": "name",
          "idle_timeout": 60
        },
      },
      "setting": {
        "password": "password"
      },
    })
  });

  it('vmess with ws', () => {
    var rawData = {
      "outbounds": [{
        "protocol": "vmess",
        "tag": "tag",
        "streamSettings": {
          'network': 'ws',
          'wsSettings': {
            "acceptProxyProtocol": false,
            "path": "/path",
            "headers": {
              "Host": "uif.org"
            }
          }
        },
        "settings": {
          "vnext": [{
            "address": "127.0.0.1",
            "port": 37192,
            "users": [{
              "id": "5783a3e7-e373-51cd-8642-c83782b807c5",
              "security": "auto",
              "level": 0,
              "experiments": ""
            }]
          }]
        },
        "mux": {}
      }]
    }
    var res = Xray2UIF(JSON.stringify(rawData));
    expect(res[0]).toEqual({
      "tag": "tag",
      "protocol": "vmess",
      "transport": {
        "address": "127.0.0.1",
        "port": 37192,
        "tls_type": "none",
        "tls": {},
        "protocol": "ws",
        "setting": {
          'path': '/path',
          "headers": {
            "Host": "uif.org"
          }
        },
      },
      "setting": {
        "uuid": "5783a3e7-e373-51cd-8642-c83782b807c5",
        "security": "auto",
      },
    })
  });

  it('shadowsocks with ws', () => {
    var rawData = {
      "outbounds": [{
        "protocol": "shadowsocks",
        "tag": "tag",
        "streamSettings": {
          'network': 'ws',
          'wsSettings': {
            "acceptProxyProtocol": false,
            "path": "/path",
            "headers": {
              "Host": "uif.org"
            }
          }
        },
        "settings": {
          "servers": [{
            "email": "love@xray.com",
            "address": "127.0.0.1",
            "port": 1234,
            "method": "加密方式",
            "password": "密码",
            "uot": true,
            "UoTVersion": 2,
            "level": 0
          }]
        },
        "mux": {}
      }]
    }
    var res = Xray2UIF(JSON.stringify(rawData));
    expect(res[0]).toEqual({
      "tag": "tag",
      "protocol": "shadowsocks",
      "transport": {
        "address": "127.0.0.1",
        "port": 1234,
        "tls_type": "none",
        "tls": {},
        "protocol": "ws",
        "setting": {
          'path': '/path',
          "headers": {
            "Host": "uif.org"
          }
        },
      },
      "setting": {
        "method": "加密方式",
        "password": "密码",
      },
    })
  });

  it('tls ss', () => {
    var rawData = {
      "outbounds": [{
        "protocol": "shadowsocks",
        "tag": "tag",
        "streamSettings": {
          'network': 'ws',
          "security": "tls",
          'wsSettings': {
            "acceptProxyProtocol": false,
            "path": "/path",
            "headers": {
              "Host": "uif.org"
            }
          },
          "tlsSettings": {
            "serverName": "uif.com",
            "allowInsecure": true,
            "alpn": ["h2", "http/1.1"],
          },
        },
        "settings": {
          "servers": [{
            "email": "love@xray.com",
            "address": "127.0.0.1",
            "port": 1234,
            "method": "加密方式",
            "password": "密码",
            "uot": true,
            "UoTVersion": 2,
            "level": 0
          }]
        },
        "mux": {}
      }]
    }
    var res = Xray2UIF(JSON.stringify(rawData));
    expect(res[0]).toEqual({
      "tag": "tag",
      "protocol": "shadowsocks",
      "transport": {
        "address": "127.0.0.1",
        "port": 1234,
        "tls_type": "tls",
        "tls": {
          'enabled': true,
          'insecure': true,
          'server_name': 'uif.com',
          "alpn": ["h2", "http/1.1"]
        },
        "protocol": "ws",
        "setting": {
          'path': '/path',
          "headers": {
            "Host": "uif.org"
          }
        },
      },
      "setting": {
        "method": "加密方式",
        "password": "密码",
      },
    })
  });
})
