import V2rayN2UIF from '@/store/uif/v2rayn2uif.js'
import {
  Base64
} from 'js-base64';

describe('parser:parse to uif config', () => {
  it('trojan with ws', () => {
    var rawData = Base64.encode('trojan://f@uck.me/?sni=microsoft.com&type=ws&path=%2Fgo&encryption=ss%3Baes-256-gcm%3Afuckgfw&host=uif.org#abcdd')

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('abcdd')
    expect(res['protocol']).toBe('trojan')
    expect(res['setting']['password']).toBe('f')

    var transport = res['transport']
    expect(transport['tls_type']).toBe('tls')
    expect(transport['address']).toBe('uck.me')
    expect(transport['port']).toBe(443)
    expect(transport['protocol']).toBe('ws')

    expect(transport['setting']['path']).toBe('/go')
    expect(transport['setting']['headers']['Host']).toBe('uif.org')
  });

  it('hysteria', () => {
    var rawData = Base64.encode('hysteria2://password@domain.com/?insecure=1&obfs=salamander&obfs-password=gawrgura&pinSHA256=deadbeef&sni=real.example.com')

    var res = V2rayN2UIF(rawData);
    expect(res[0]).toEqual({
      "tag": "",
      "protocol": "hysteria2",
      "transport": {
        "address": "domain.com",
        "port": 443,
        "tls_type": "tls",
        "tls": {
          'enabled': true,
          'server_name': 'real.example.com',
          'insecure': true,
        },
        "protocol": "tcp",
        "setting": {},
      },
      "setting": {
        "password": "password",
        "obfs": {
          'type': 'salamander',
          'password': 'gawrgura'
        },
      },
    })
  });

  it('hysteria port', () => {
    var rawData = Base64.encode('hysteria2://password@domain.com:1443/?insecure=0#tag')

    var res = V2rayN2UIF(rawData);
    expect(res[0]).toEqual({
      "tag": "tag",
      "protocol": "hysteria2",
      "transport": {
        "address": "domain.com",
        "port": 1443,
        "tls_type": "tls",
        "tls": {
          'enabled': true,
        },
        "protocol": "tcp",
        "setting": {},
      },
      "setting": {
        "password": "password",
      },
    })
  });

  it('trojan normal', () => {
    var rawData = Base64.encode('trojan://password@address:80/?#abcdd')

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('abcdd')
    expect(res['protocol']).toBe('trojan')
    expect(res['setting']['password']).toBe('password')

    var transport = res['transport']
    expect(transport['tls_type']).toBe('tls')
    expect(transport['address']).toBe('address')
    expect(transport['port']).toBe(80)
    expect(transport['protocol']).toBe('tcp')
  });

  it('trojan normal', () => {
    var rawData = Base64.encode('trojan://password@address/?#abcdd')

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('abcdd')
    expect(res['protocol']).toBe('trojan')
    expect(res['setting']['password']).toBe('password')

    var transport = res['transport']
    expect(transport['tls_type']).toBe('tls')
    expect(transport['address']).toBe('address')
    expect(transport['port']).toBe(443)
    expect(transport['protocol']).toBe('tcp')
  });

  it('trojan ip ws host', () => {
    var rawData = Base64.encode('trojan://password@127.0.0.1:800/?&type=ws&path=%2Fgoole&host=abc.com#abcdd')

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('abcdd')
    expect(res['protocol']).toBe('trojan')
    expect(res['setting']['password']).toBe('password')

    var transport = res['transport']
    expect(transport['tls_type']).toBe('tls')
    expect(transport['address']).toBe('127.0.0.1')
    expect(transport['port']).toBe(800)
    expect(transport['protocol']).toBe('ws')

    expect(transport['setting']['path']).toBe('/goole')
    expect(transport['setting']['headers']['Host']).toBe('abc.com')
  });

  it('ss ip', () => {
    var rawData = Base64.encode('ss://YWVzLTI1Ni1nY206Y2RCSURWNDJEQ3duZklO@8.21.3.1:8119#abcd')

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('abcd')
    expect(res['protocol']).toBe('shadowsocks')
    expect(res['setting']['password']).toBe('cdBIDV42DCwnfIN')
    expect(res['setting']['method']).toBe('aes-256-gcm')

    var transport = res['transport']
    expect(transport['tls_type']).toBe('none')
    expect(transport['address']).toBe('8.21.3.1')
    expect(transport['port']).toBe(8119)
    expect(transport['protocol']).toBe('tcp')
  });

  it('vmess ws', () => {
    var config = {
      "v": "2",
      "ps": "备注或别名",
      "add": "111.111.111.111",
      "port": "32000",
      "id": "1386f85e-657b-4d6e-9d56-78badb75e1fd",
      "aid": "100",
      "scy": "zero",
      "net": "tcp",
      "type": "none",
      "host": "www.bbb.com",
      "path": "/",
      "tls": "tls",
      "sni": "www.ccc.com",
      "alpn": "h2",
      "fp": "chrome"
    }
    var rawData = Base64.encode('vmess://' + Base64.encode(JSON.stringify(config)))

    var res = V2rayN2UIF(rawData);
    res = res[0]
    console.log(res)
    expect(res['tag']).toBe('备注或别名')
    expect(res['protocol']).toBe('vmess')
    expect(res['setting']['uuid']).toBe('1386f85e-657b-4d6e-9d56-78badb75e1fd')
    expect(res['setting']['security']).toBe('zero')
    expect(res['setting']['alter_id']).toBe(100)

    var transport = res['transport']
    expect(transport['tls_type']).toBe('tls')
    expect(transport['tls']['server_name']).toBe('www.ccc.com')
    expect(transport['tls']['utls']['enabled']).toBe(true)
    expect(transport['tls']['utls']['fingerprint']).toBe('chrome')
    expect(transport['tls']['alpn']).toStrictEqual(['h2'])
    expect(transport['address']).toBe('111.111.111.111')
    expect(transport['port']).toBe(32000)
    expect(transport['protocol']).toBe('tcp')
  });

})
