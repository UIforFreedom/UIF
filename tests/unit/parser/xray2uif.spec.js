import Xray2UIF from '@/store/uif/xray2uif.js'

describe('parser:parse to uif config', () => {
  it('trojan with tcp', () => {
    var rawData = {
      "outbounds": [{
        "sendThrough": "0.0.0.0",
        "protocol": "trojan",
        "settings": {},
        "tag": "tag",
        "streamSettings": {},
        "proxySettings": {
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
})
