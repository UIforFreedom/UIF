import {
  Sing2UIF
} from '@/store/uif/parser/sing2uif.js'

describe('parser:Sing2UIF', () => {
  it('trojan ws tls', () => {
    var rawData = {
      outbounds: [{
        "password": "password",

        "type": "trojan",
        "tag": "tag",
        "transport": {
          "path": "/path",
          "headers": {
            "Host": "host"
          },
          "type": "ws",
        },
        "tls": {
          "enabled": true,
          "insecure": false,
          "certificate": "",
          "alpn": [],
          "utls": {
            "enabled": false,
            "fingerprint": "random"
          },
          "disable_sni": false,
          "server_name": "server_name"
        },
        "server": "server",
        "server_port": 443
      }]
    }

    var res = Sing2UIF(JSON.stringify(rawData));
    expect(res).toHaveLength(1)
    expect(res[0]).toEqual({
      "transport": {
        "setting": {
          "path": "/path",
          "headers": {
            "Host": "host"
          },
        },
        "protocol": "ws",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "insecure": false,
          "certificate": "",
          "alpn": [],
          "utls": {
            "enabled": false,
            "fingerprint": "random"
          },
          "disable_sni": false,
          "server_name": "server_name"
        },
        "address": "server",
        "port": 443
      },
      "tag": "tag",
      "protocol": "trojan",
      "setting": {
        "password": "password",
      }
    })
  });

  it('trojan tcp', () => {
    var rawData = {
      outbounds: [{
        "security": "auto",
        "alter_id": 64,
        "uuid": "6fa560d4-35c5-4968-adfc-812c52878b84",
        "type": "vmess",
        "tag": "tag",
        "server": "45.199.138.198",
        "server_port": 58336
      }]
    }

    var res = Sing2UIF(JSON.stringify(rawData));
    expect(res).toHaveLength(1)
    expect(res[0]).toEqual({
      "tag": "tag",
      "protocol": "vmess",
      "transport": {
        "address": "45.199.138.198",
        "port": 58336,
        "tls_type": "none",
        "protocol": "tcp",
      },
      "setting": {
        "uuid": "6fa560d4-35c5-4968-adfc-812c52878b84",
        "security": "auto",
        "alter_id": 64
      },
    })
  });
})
