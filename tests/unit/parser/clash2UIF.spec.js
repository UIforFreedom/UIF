import {
  Clash2UIF
} from '@/store/uif/parser/clash2uif.js'

describe('parser:parse clash config', () => {
  it('trojan grpc', () => {
    var rawData = ` 
proxies:
- name: trojan-grpc
  type: trojan
  interface-name: eth0
  routing-mark: 1234
  server: 127.0.0.1
  port: 443
  password: "pwd"
  network: grpc
  sni: example.com
  skip-cert-verify: true
  udp: true
  grpc-opts:
    grpc-service-name: "example"
`;
    var res = Clash2UIF(rawData);
    expect(res).toHaveLength(1)
    var trojan = res[0];
    expect(trojan).toHaveProperty('protocol')
    expect(trojan['protocol']).toBe('trojan')
    expect(trojan).toHaveProperty('tag')
    expect(trojan['tag']).toBe('trojan-grpc')
    expect(trojan['setting']['password']).toBe('pwd')

    var transport = trojan['transport'];
    expect(transport['tls_type']).toBe('tls')
    expect(transport['tls']['insecure']).toBe(true)
    expect(transport['tls']['server_name']).toBe('example.com')
    expect(transport['address']).toBe('127.0.0.1')
    expect(transport['port']).toBe(443)

    var transportSettings = trojan['transport']['setting'];
    expect(transport['protocol']).toBe('grpc')
    expect(transportSettings['service_name']).toBe('example')
  });

  it('trojan ws with path cdn', () => {
    var rawData = ` 
proxies:
  - {name: uif, server: uif.org, port: 443, type: trojan, password: '1234', skip-cert-verify: false}
`;
    var res = Clash2UIF(rawData);
    expect(res).toHaveLength(1)
    var trojan = res[0];
    expect(trojan).toHaveProperty('protocol')
    expect(trojan['protocol']).toBe('trojan')
    expect(trojan).toHaveProperty('tag')
    expect(trojan['tag']).toBe('uif')
    expect(trojan['setting']['password']).toBe('1234')

    var transport = trojan['transport'];
    expect(transport['tls_type']).toBe('tls')
    expect(transport['tls']['insecure']).toBe(false)
    expect(transport['tls']['server_name']).toBe(undefined)
    expect(transport['address']).toBe('uif.org')
    expect(transport['port']).toBe(443)
  });

  it('trojan ws', () => {
    var rawData = ` 
proxies:
- name: trojan-ws
  type: trojan
  # interface-name: eth0
  # routing-mark: 1234
  server: server
  port: 443
  password: "example"
  network: ws
  sni: example.com
  skip-cert-verify: true
  udp: true
  ws-opts:
    path: /path
    headers:
      Host: example1.com
`;
    var res = Clash2UIF(rawData);
    expect(res).toHaveLength(1)
    var trojan = res[0];

    var transport = trojan['transport'];
    expect(transport['protocol']).toBe('ws')

    expect(transport['tls_type']).toBe('tls')
    expect(transport['tls']['insecure']).toBe(true)
    expect(transport['tls']['server_name']).toBe('example.com')
    expect(transport['address']).toBe('server')
    expect(transport['port']).toBe(443)

    var transportSettings = trojan['transport']['setting'];
    expect(transportSettings['path']).toBe('/path')
    expect(transportSettings['headers']['Host']).toBe('example1.com')
  });

  it('trojan tcp', () => {
    var rawData = ` 
proxies:
- name: trojan-tcp
  type: trojan
  server: server2
  port: 443
  password: "example"
  skip-cert-verify: false
  alpn:
    - h2
    - http/1.1
`;
    var res = Clash2UIF(rawData);
    expect(res).toHaveLength(1)
    var trojan = res[0];

    var transport = trojan['transport'];
    expect(transport['protocol']).toBe('tcp')

    console.log(trojan)
    expect(transport['tls_type']).toBe('tls')
    expect(transport['tls']['insecure']).toBe(false)
    expect(transport['tls']['alpn']).toStrictEqual(['h2', 'http/1.1'])
    expect(transport['address']).toBe('server2')
    expect(transport['port']).toBe(443)

    var transportSettings = trojan['transport']['setting'];
    expect(transportSettings).toStrictEqual({})
  });

  it('vmess tcp', () => {
    var rawData = ` 
proxies:
- name: "vmess"
  type: vmess
  server: server
  port: 443
  uuid: uuid
  alterId: 32
  cipher: auto
  udp: true
  tls: true
  skip-cert-verify: true
  # servername: example.com # priority over wss host
  # network: ws
  # ws-opts:
  #   path: /path
  #   headers:
  #     Host: v2ray.com
  #   max-early-data: 2048
  #   early-data-header-name: Sec-WebSocket-Protocol
`;
    var res = Clash2UIF(rawData);
    expect(res).toHaveLength(1)
    var vmess = res[0];

    var transport = vmess['transport'];
    expect(transport['protocol']).toBe('tcp')

    expect(transport['tls_type']).toBe('tls')
    expect(transport['tls']['insecure']).toBe(true)
    expect(transport['address']).toBe('server')
    expect(transport['port']).toBe(443)

    var vmessSetting = vmess['setting'];
    expect(vmessSetting['security']).toBe('auto')
    expect(vmessSetting['alter_id']).toBe(32)
    expect(vmessSetting['uuid']).toBe('uuid')
  });

  it('vmess tcp', () => {
    var rawData = ` 
proxies:
- name: "vmess"
  type: vmess
  server: server
  port: 443
  uuid: uuid
  alterId: 32
  cipher: auto
  udp: true
  tls: true
  skip-cert-verify: true
  servername: example.com # priority over wss host
  network: ws
  ws-opts:
    path: /path
    headers:
      Host: v2ray.com
    max-early-data: 2048
    early-data-header-name: Sec-WebSocket-Protocol
`;
    var res = Clash2UIF(rawData);
    expect(res).toHaveLength(1)
    var vmess = res[0];

    var transport = vmess['transport'];
    expect(transport['protocol']).toBe('ws')

    var transportSettings = transport['setting'];
    expect(transportSettings['path']).toBe('/path')
    expect(transportSettings['headers']['Host']).toBe('v2ray.com')
  });

  it('ss tcp', () => {
    var rawData = ` 
proxies:
- name: "ss1"
  type: ss
  # interface-name: eth0
  # routing-mark: 1234
  server: server
  port: 443
  cipher: chacha20-ietf-poly1305
  password: "password"
  # udp: true
`;
    var res = Clash2UIF(rawData);
    expect(res).toHaveLength(1)
    var ss = res[0];

    var transport = ss['transport'];
    expect(transport['protocol']).toBe('tcp')
    expect(transport['tls_type']).toBe('none')

    var protocolSetting = ss['setting']
    expect(protocolSetting['method']).toBe('chacha20-ietf-poly1305')
    expect(protocolSetting['password']).toBe('password')
  });

  it('ss tcp tls', () => {
    var rawData = ` 
proxies:
- name: "ss2"
  type: ss
  # interface-name: eth0
  # routing-mark: 1234
  server: server
  port: 443
  cipher: chacha20-ietf-poly1305
  password: "password"
  plugin: obfs
  plugin-opts:
    mode: tls # or http
    host: bing.com
`;
    var res = Clash2UIF(rawData);
    expect(res[0]).toEqual({
      "tag": "ss2",
      "protocol": "shadowsocks",
      "transport": {
        "address": "server",
        "port": 443,
        "tls_type": "none",
        "tls": {},
        "protocol": "tcp",
        "setting": {},
      },
      "setting": {
        "method": "chacha20-ietf-poly1305",
        "password": "password",
        'plugin': 'obfs-local',
        'plugin_opts': {
          mode: 'tls',
          'obfs-host': 'bing.com'
        }
      },
    })
  });

  it('ss ws tls', () => {
    var rawData = ` 
proxies:
- name: "ss3"
  type: ss
  # interface-name: eth0
  # routing-mark: 1234
  server: server
  port: 443
  cipher: chacha20-ietf-poly1305
  password: "password"
  plugin: v2ray-plugin
  plugin-opts:
    mode: websocket # no QUIC now
    tls: true # wss
    skip-cert-verify: false
    host: bing.com
    path: "/"
    headers:
      custom: value
`;
    var res = Clash2UIF(rawData);
    expect(res[0]).toEqual({
      "tag": "ss3",
      "protocol": "shadowsocks",
      "transport": {
        "address": "server",
        "port": 443,
        "tls_type": "none",
        "tls": {},
        "protocol": "tcp",
        "setting": {},
      },
      "setting": {
        "method": "chacha20-ietf-poly1305",
        "password": "password",
        'plugin': 'v2ray-plugin',
        'plugin_opts': {
          mode: 'websocket',
          tls: true,
          'skip-cert-verify': false,
          host: 'bing.com',
          path: "/",
          headers: {
            custom: 'value'
          },
        }
      },
    })
  });

  it('hy and hy2', () => {
    var rawData = ` 
proxies:
  - name: "hysteria2"
    type: hysteria2
    server: server.com
    port: 443
    #  up和down均不写或为0则使用BBR流控
    up: "30 Mbps" # 若不写单位，默认为 Mbps
    down: "200 Mbps" # 若不写单位，默认为 Mbps
    password: yourpassword
    # obfs: salamander # 默认为空，如果填写则开启obfs，目前仅支持salamander
    # obfs-password: yourpassword
    sni: server.com
    # skip-cert-verify: false
    # fingerprint: xxxx
    alpn:
      - h3
    # ca: "./my.ca"
    # ca-str: "xyz"
`;
    var res = Clash2UIF(rawData);
    expect(res).toHaveLength(1)
    expect(res[0]).toEqual({
      "tag": "hysteria2",
      "protocol": "hysteria2",
      "transport": {
        "address": "server.com",
        "port": 443,
        "tls_type": "tls",
        "tls": {
          'enabled': true,
          'server_name': 'server.com',
          'alpn': ['h3']
        },
        "protocol": "tcp",
        "setting": {},
      },
      "setting": {
        "password": "yourpassword",
        "up_mbps": 30,
        "down_mbps": 200,
      },
    })
  });

  it('tuic', () => {
    var rawData = ` 
proxies:
  - name: tuic
    server: www.example.com
    port: 10443
    type: tuic
    uuid: 00000000-0000-0000-0000-000000000001
    password: PASSWORD_1
    alpn: [h3]
    reduce-rtt: true
    request-timeout: 8000
    udp-relay-mode: quic
    congestion-controller: cubic
    skip-cert-verify: true
    sni: example.com
`;
    var res = Clash2UIF(rawData);
    expect(res).toHaveLength(1)
    expect(res[0]).toEqual({
      "tag": "tuic",
      "protocol": "tuic",
      "transport": {
        "address": "www.example.com",
        "port": 10443,
        "tls_type": "tls",
        "tls": {
          'enabled': true,
          'server_name': 'example.com',
          'insecure': true,
          'alpn': ['h3']
        },
        "protocol": "tcp",
        "setting": {},
      },
      "setting": {
        "password": "PASSWORD_1",
        "udp_relay_mode": 'quic',
        "uuid": '00000000-0000-0000-0000-000000000001',
        "zero_rtt_handshake": true,
        "congestion_control": 'cubic',
      },
    })
  });
})
