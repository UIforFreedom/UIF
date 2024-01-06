import In2Out from '@/store/uif/uif_in_2_out'

import {
  Base64
} from 'js-base64';

describe('parser:parse to uif in struct to out struct.', () => {
  it('trojan', () => {
    var rawData = {
      "transport": {
        "setting": {},
        "protocol": "tcp",
        "tls_type": "none",
        "tls": {},
        "address": "127.0.0.1",
        "port": 443
      },
      "tag": "trojan",
      "protocol": "trojan",
      "enabled": true,
      "setting": {
        "ss": "ss",
        "users": [{
          "name": "uif",
          "password": "password"
        }],
        "fallback": {
          "server": "uif.org",
          "server_port": 443
        }
      }
    }

    var res = In2Out(rawData);
    expect(res['tag']).toBe('trojan')
    expect(res['enabled']).toBe(false)
    expect(res['protocol']).toBe('trojan')
    expect(res['setting']['password']).toBe('password')
    expect(res['setting']['ss']).toBe('ss')
    expect(res['setting']['fallback']).toBe(undefined)
    expect(res['setting']['name']).toBe(undefined)
    expect(res['setting']['users']).toBe(undefined)

    var transport = res['transport']
    expect(transport['tls_type']).toBe('none')
    expect(transport['address']).toBe('127.0.0.1')
    expect(transport['port']).toBe(443)
    expect(transport['protocol']).toBe('tcp')
  });

  it('vmess', () => {
    var rawData = {
      "transport": {},
      "protocol": "vmess",
      "setting": {
        "ss": "ss",
        "users": [{
          "uuid": "password",
          "alterId": "id",
          "name": "password",
        }]
      }
    }

    var res = In2Out(rawData);
    expect(res['protocol']).toBe('vmess')
    expect(res['setting']['uuid']).toBe('password')
    expect(res['setting']['alter_id']).toBe('id')
    expect(res['setting']['ss']).toBe('ss')
    expect(res['setting']['users']).toBe(undefined)
    expect(res['setting']['alterId']).toBe(undefined)
    expect(res['setting']['name']).toBe(undefined)
  });

  it('shadowTLS', () => {
    var rawData = {
      "transport": {},
      "protocol": "shadowtls",
      "setting": {
        version: 3,
        password: 'password1',
        strict_mode: false,
        users: [{
          password: 'password2',
        }, ],
        handshake: {
          server: "github.com",
          server_port: 443,
        },
      }
    }

    var res = In2Out(rawData);
    expect(res['protocol']).toBe('shadowtls')
    expect(res['setting']['password']).toBe('password2')
    expect(res['setting']['version']).toBe(3)
    expect(res['setting']['strict_mode']).toBe(undefined)
    expect(res['setting']['handshake']).toBe(undefined)
    expect(res['setting']['users']).toBe(undefined)
    expect(res['setting']['alterId']).toBe(undefined)
    expect(res['setting']['name']).toBe(undefined)
  });

  it('vless', () => {
    var rawData = {
      "transport": {},
      "protocol": "vless",
      "setting": {
        users: [{
          uuid: 'uuid',
          flow: "xtls-rprx-vision",
        }, ],
      }
    }

    var res = In2Out(rawData);
    expect(res['protocol']).toBe('vless')
    expect(res['setting']['uuid']).toBe('uuid')
    expect(res['setting']['flow']).toBe('xtls-rprx-vision')
  });

  it('not supported', () => {
    var rawData = {
      "transport": {},
      "protocol": "tun",
      "setting": {}
    }

    try {
      In2Out(rawData)
      throw ''
    } catch (e) {
      /* handle error */
    }
  });

  it('tls setting', () => {
    var rawData = {
      "transport": {
        'tls': {
          enabled: true,
          server_name: "s",
          alpn: ['h2'],
          certificate: 'certificate',
          key: 'key',
        }
      },
      "protocol": "trojan",
      "setting": {}
    }

    var res = In2Out(rawData);
    expect(res['transport']['tls']).toEqual({
      enabled: true,
      server_name: "s",
      certificate: 'certificate',
      alpn: ['h2'],
    })
  });

  it('tuic', () => {
    var rawData = {
      "protocol": "tuic",
      "transport": {},
      "setting": {
        users: [{
          uuid: 'uuid',
          password: 'password',
        }, ],
        congestion_control: "cubic",
        zero_rtt_handshake: false,
        auth_timeout: "3s",
        heartbeat: "10s",
      }
    }

    var res = In2Out(rawData);
    expect(res['setting']).toEqual({
      uuid: 'uuid',
      password: 'password',
      congestion_control: "cubic",
      zero_rtt_handshake: false,
      heartbeat: "10s",
    })
  });

  it('vmess ws', () => {
    var rawData = {
      "protocol": "vmess",
      "transport": {
        "setting": {
          path: "/",
          headers: {
            Host: ""
          },
        },
        "protocol": "ws",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "server_name": "buxiangshuohua",
          "alpn": ['d'],
        },
        "address": "fuck",
        "port": 44
      },
      "setting": {
        users: [{
          uuid: 'uuid',
          alterId: 1
        }],
      }
    }

    var res = In2Out(rawData);
    expect(res['setting']).toEqual({
      uuid: 'uuid',
      alter_id: 1,
    })

    expect(res['transport']).toEqual({
      "setting": {
        path: "/",
        headers: {
          Host: ""
        },
      },
      "protocol": "ws",
      "tls_type": "tls",
      "tls": {
        "enabled": true,
        "server_name": "buxiangshuohua",
        "alpn": ['d'],
      },
      "address": "fuck",
      "port": 44
    })
  });
})
