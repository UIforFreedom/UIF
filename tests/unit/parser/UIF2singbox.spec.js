import {
  Inbound,
  Outbound
} from '@/store/uif/uif2singbox.js'

describe('parser:parse to singBoxStyle config', () => {
  it('trojan tcp no tls inbound', () => {
    var rawData = {
      protocol: "trojan",
      tag: "1",
      transport: {
        setting: {},
        protocol: 'tcp',
        tls_type: 'none',
        tls: {},
        address: '127.0.0.1',
        port: 443,
      },
      setting: {
        users: [{
          name: "uif",
          password: '1'
        }],
        fallback: {
          server: "uif.org",
          server_port: 443
        },
      },
    }

    var res = Inbound(rawData);
    expect(res['tag']).toBe('1')
    expect(res['type']).toBe('trojan')
    expect(res['tls']).toBe(undefined)
    expect(res['listen']).toBe('127.0.0.1')
    expect(res['listen_port']).toBe(443)

    expect(res['users'][0]['password']).toBe('1')
    expect(res['fallback']['server']).toBe('uif.org')

  });

  it('freedom', () => {
    var rawData = {
      protocol: "freedom",
      tag: "1",
      transport: {
        setting: {},
        protocol: 'tcp',
        tls_type: 'none',
        tls: {},
        address: '127.0.0.1',
        port: 443,
      },
      setting: {
        users: [{
          name: "uif",
          password: '1'
        }],
        fallback: {
          server: "uif.org",
          server_port: 443
        },
      },
    }

    var res = Outbound(rawData);
    expect(res['tag']).toBe('1')
    expect(res['type']).toBe('direct')
  });

  it('trojan ws', () => {
    var rawData = {
      protocol: "trojan",
      tag: "1",
      transport: {
        protocol: 'ws',
        setting: {
          "path": "/p",
          "headers": {
            "host": "uif.org"
          }
        },
        tls_type: 'tls',
        tls: {
          enabled: true,
          server_name: "uif.org"
        },
        address: '127.0.0.1',
        port: 443,
      },
      setting: {},
    }

    var res = Inbound(rawData);
    expect(res).toEqual({
      "tag": "1",
      "type": "trojan",
      "listen": '127.0.0.1',
      "listen_port": 443,
      "sniff": true,
      "tls": {
        "enabled": true,
        "server_name": "uif.org"
      },
      "transport": {
        "type": "ws",
        "path": "/p",
        "headers": {
          "host": "uif.org"
        },
      }
    })
  });

  it('multiplex', () => {
    var rawData = {
      protocol: "trojan",
      tag: "1",
      transport: {
        protocol: 'tcp',
        tls_type: 'tls',
        tls: {
          enabled: true,
          server_name: "uif.org"
        },
        address: '127.0.0.1',
        port: 443,
        multiplex: {
          "enabled": true,
          "protocol": "smux",
          "max_connections": 4,
          "min_streams": 4,
          "max_streams": 0,
          "padding": false,
          "brutal": {}
        },
      },
      setting: {},
    }

    var res = Inbound(rawData);
    expect(res).toEqual({
      "tag": "1",
      "type": "trojan",
      "listen": '127.0.0.1',
      "listen_port": 443,
      "sniff": true,
      "tls": {
        "enabled": true,
        "server_name": "uif.org"
      },
      "multiplex": {
        "enabled": true,
        "protocol": "smux",
        "max_connections": 4,
        "min_streams": 4,
        "max_streams": 0,
        "padding": false,
        "brutal": {}
      },
    })
  });

})
