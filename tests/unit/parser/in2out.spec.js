import {
  In2Out
} from '@/store/uif/parser/uif_in_2_out'

describe('parser:parse to uif inbounds struct to outbounds struct.', () => {
  it('trojan ws tls path', () => {
    var rawData = {
      "transport": {
        "setting": {
          "path": "/",
          "headers": {
            "Host": ""
          }
        },
        "protocol": "tcp",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "acme": {
            "domain": [],
            "email": "uiforfreedom@gmail.com",
            "provider": "letsencrypt"
          },
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c",
          "key": "k"
        },
        "address": "0.0.0.0",
        "port": 443
      },
      "tag": "test",
      "protocol": "trojan",
      "enabled": true,
      "delay": "",
      "core_tag": "",
      "setting": {
        "users": [{
          "name": "uif",
          "password": "b4499453-f787-46d0-b944-8361759f66cd"
        }],
        "fallback": {
          "server": "uif.org",
          "server_port": 443
        }
      }
    }

    var res = In2Out(rawData);
    expect(res).toEqual({
      "transport": {
        "setting": {
          "path": "/",
          "headers": {
            "Host": ""
          }
        },
        "protocol": "tcp",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c"
        },
        "address": "127.0.0.1",
        "port": 443
      },
      "tag": "test",
      "protocol": "trojan",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "password": "b4499453-f787-46d0-b944-8361759f66cd"
      }
    })
  });

  it('vmess no tls', () => {
    var rawData = {
      "transport": {
        "setting": {
          "path": "/",
          "headers": {
            "Host": ""
          }
        },
        "protocol": "tcp",
        "tls_type": "none",
        "tls": {
          "enabled": true,
          "acme": {
            "domain": [],
            "email": "uiforfreedom@gmail.com",
            "provider": "letsencrypt"
          },
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c",
          "key": "k"
        },
        "address": "0.0.0.0",
        "port": 443
      },
      "tag": "test",
      "protocol": "vmess",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "users": [{
          "uuid": "10f4f638-fcf3-4535-8afc-cf283b962008",
          "alterId": 0
        }]
      }
    }

    var res = In2Out(rawData);
    expect(res).toEqual({
      "transport": {
        "setting": {
          "path": "/",
          "headers": {
            "Host": ""
          }
        },
        "protocol": "tcp",
        "tls_type": "none",
        "tls": {
          "enabled": true,
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c",
        },
        "address": "127.0.0.1",
        "port": 443
      },
      "tag": "test",
      "protocol": "vmess",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "uuid": "10f4f638-fcf3-4535-8afc-cf283b962008",
        "alter_id": 0
      }
    })
  });

  it('tuic', () => {
    var rawData = {
      "transport": {
        "setting": {
          "path": "/",
          "headers": {
            "Host": ""
          }
        },
        "protocol": "tcp",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "acme": {
            "domain": [],
            "email": "uiforfreedom@gmail.com",
            "provider": "letsencrypt"
          },
          "server_name": "qq.com",
          "alpn": [
            "h2",
            "h3"
          ],
          "certificate": "c",
          "key": "k"
        },
        "address": "0.0.0.0",
        "port": 443
      },
      "tag": "test",
      "protocol": "tuic",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "users": [{
          "uuid": "2a4d9b00-7386-4feb-b4ce-cbb27036b683",
          "password": "f353a800-e417-464b-bc15-921c4a44d341"
        }],
        "congestion_control": "cubic",
        "zero_rtt_handshake": false,
        "auth_timeout": "3s",
        "heartbeat": "10s"
      }
    }

    var res = In2Out(rawData);
    expect(res).toEqual({
      "transport": {
        "setting": {
          "path": "/",
          "headers": {
            "Host": ""
          }
        },
        "protocol": "tcp",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "server_name": "qq.com",
          "alpn": [
            "h2",
            "h3"
          ],
          "certificate": "c",
        },
        "address": "127.0.0.1",
        "port": 443
      },
      "tag": "test",
      "protocol": "tuic",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "uuid": "2a4d9b00-7386-4feb-b4ce-cbb27036b683",
        "password": "f353a800-e417-464b-bc15-921c4a44d341",
        "congestion_control": "cubic",
        "zero_rtt_handshake": false,
        "heartbeat": "10s"
      }
    })
  });

  it('vmess ws', () => {
    var rawData = {
      "transport": {
        "setting": {
          "path": "/abc",
          "headers": {
            "Host": "test.cn"
          }
        },
        "protocol": "ws",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "acme": {
            "domain": [],
            "email": "uiforfreedom@gmail.com",
            "provider": "letsencrypt"
          },
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c",
          "key": "k"
        },
        "address": "0.0.0.0",
        "port": 443
      },
      "tag": "test",
      "protocol": "vmess",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "users": [{
          "uuid": "02a5e51f-584c-4458-a35f-50d2de25e9f6",
          "alterId": 0
        }]
      }
    }

    var res = In2Out(rawData);
    expect(res).toEqual({
      "transport": {
        "setting": {
          "path": "/abc",
          "headers": {
            "Host": "test.cn"
          }
        },
        "protocol": "ws",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c",
        },
        "address": "127.0.0.1",
        "port": 443
      },
      "tag": "test",
      "protocol": "vmess",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "uuid": "02a5e51f-584c-4458-a35f-50d2de25e9f6",
        "alter_id": 0
      }
    })
  });

  it('hysteria2', () => {
    var rawData = {
      "transport": {
        "setting": {
          "path": "/",
          "headers": {
            "Host": ""
          }
        },
        "protocol": "tcp",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "acme": {
            "domain": [],
            "email": "uiforfreedom@gmail.com",
            "provider": "letsencrypt"
          },
          "server_name": "qq.com",
          "alpn": [
            "h2",
            "h3"
          ],
          "certificate": "c",
          "key": "k"
        },
        "address": "0.0.0.0",
        "port": 443
      },
      "tag": "test",
      "protocol": "hysteria2",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "up_mbps": 100,
        "down_mbps": 100,
        "obfs": {
          "type": "",
          "password": "bceb0bd8-df0d-4c8f-8f05-f47d4939b64b"
        },
        "users": [{
          "password": "287c4d2b-bb97-4c9c-add8-78799b1876a2"
        }],
        "ignore_client_bandwidth": false,
        "masquerade": "http://127.0.0.1:8080"
      }
    }

    var res = In2Out(rawData);
    expect(res).toEqual({
      "transport": {
        "setting": {
          "path": "/",
          "headers": {
            "Host": ""
          }
        },
        "protocol": "tcp",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "server_name": "qq.com",
          "alpn": [
            "h2",
            "h3"
          ],
          "certificate": "c",
        },
        "address": "127.0.0.1",
        "port": 443
      },
      "tag": "test",
      "protocol": "hysteria2",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "up_mbps": 100,
        "down_mbps": 100,
        "obfs": {
          "type": "",
          "password": "bceb0bd8-df0d-4c8f-8f05-f47d4939b64b"
        },
        "password": "287c4d2b-bb97-4c9c-add8-78799b1876a2"
      }
    })
  });

  it('ss', () => {
    var rawData = {
      "transport": {
        "setting": {
          "path": "/abc",
          "headers": {
            "Host": "test.cn"
          }
        },
        "protocol": "tcp",
        "tls_type": "none",
        "tls": {
          "enabled": true,
          "acme": {
            "domain": [],
            "email": "uiforfreedom@gmail.com",
            "provider": "letsencrypt"
          },
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c",
          "key": "k"
        },
        "address": "0.0.0.0",
        "port": 443
      },
      "tag": "test",
      "protocol": "shadowsocks",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "method": "2022-blake3-aes-128-gcm",
        "password": "N2YyOWMzMjktOWM1NS00MWFlLTgwNzQtMWE2YTExNDMxNjg3",
        "plugin": "",
        "plugin_opts": {
          "host": "uif.org",
          "mode": "http",
          "tls": false,
          "path": "/",
          "obfs-host": ""
        }
      }
    }

    var res = In2Out(rawData);
    expect(res).toEqual({
      "transport": {
        "setting": {
          "path": "/abc",
          "headers": {
            "Host": "test.cn"
          }
        },
        "protocol": "tcp",
        "tls_type": "none",
        "tls": {
          "enabled": true,
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c",
        },
        "address": "127.0.0.1",
        "port": 443
      },
      "tag": "test",
      "protocol": "shadowsocks",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "method": "2022-blake3-aes-128-gcm",
        "password": "N2YyOWMzMjktOWM1NS00MWFlLTgwNzQtMWE2YTExNDMxNjg3",
        "plugin": "",
        "plugin_opts": {
          "host": "uif.org",
          "mode": "http",
          "tls": false,
          "path": "/",
          "obfs-host": ""
        }
      }
    })
  });

  it('ss domain', () => {
    var rawData = {
      "transport": {
        "setting": {
          "path": "/abc",
          "headers": {
            "Host": "test.cn"
          }
        },
        "protocol": "tcp",
        "domain": "ui4freedom.org",
        "tls_type": "none",
        "tls": {
          "enabled": true,
          "acme": {
            "domain": [],
            "email": "uiforfreedom@gmail.com",
            "provider": "letsencrypt"
          },
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c",
          "key": "k"
        },
        "address": "0.0.0.0",
        "port": 443
      },
      "tag": "test",
      "protocol": "shadowsocks",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "method": "2022-blake3-aes-128-gcm",
        "password": "N2YyOWMzMjktOWM1NS00MWFlLTgwNzQtMWE2YTExNDMxNjg3",
        "plugin": "",
        "plugin_opts": {
          "host": "uif.org",
          "mode": "http",
          "tls": false,
          "path": "/",
          "obfs-host": ""
        }
      }
    }

    var res = In2Out(rawData);
    expect(res).toEqual({
      "transport": {
        "setting": {
          "path": "/abc",
          "headers": {
            "Host": "test.cn"
          }
        },
        "protocol": "tcp",
        "tls_type": "none",
        "tls": {
          "enabled": true,
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c",
        },
        "address": "ui4freedom.org",
        "port": 443
      },
      "tag": "test",
      "protocol": "shadowsocks",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "method": "2022-blake3-aes-128-gcm",
        "password": "N2YyOWMzMjktOWM1NS00MWFlLTgwNzQtMWE2YTExNDMxNjg3",
        "plugin": "",
        "plugin_opts": {
          "host": "uif.org",
          "mode": "http",
          "tls": false,
          "path": "/",
          "obfs-host": ""
        }
      }
    })
  });

  it('ss domain empty', () => {
    var rawData = {
      "transport": {
        "setting": {
          "path": "/abc",
          "headers": {
            "Host": "test.cn"
          }
        },
        "protocol": "tcp",
        "domain": "",
        "tls_type": "none",
        "tls": {
          "enabled": true,
          "acme": {
            "domain": [],
            "email": "uiforfreedom@gmail.com",
            "provider": "letsencrypt"
          },
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c",
          "key": "k"
        },
        "address": "0.0.0.0",
        "port": 443
      },
      "tag": "test",
      "protocol": "shadowsocks",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "method": "2022-blake3-aes-128-gcm",
        "password": "N2YyOWMzMjktOWM1NS00MWFlLTgwNzQtMWE2YTExNDMxNjg3",
        "plugin": "",
        "plugin_opts": {
          "host": "uif.org",
          "mode": "http",
          "tls": false,
          "path": "/",
          "obfs-host": ""
        }
      }
    }

    var res = In2Out(rawData);
    expect(res).toEqual({
      "transport": {
        "setting": {
          "path": "/abc",
          "headers": {
            "Host": "test.cn"
          }
        },
        "protocol": "tcp",
        "tls_type": "none",
        "tls": {
          "enabled": true,
          "server_name": "qq.com",
          "alpn": [
            "h2"
          ],
          "certificate": "c",
        },
        "address": "127.0.0.1",
        "port": 443
      },
      "tag": "test",
      "protocol": "shadowsocks",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "method": "2022-blake3-aes-128-gcm",
        "password": "N2YyOWMzMjktOWM1NS00MWFlLTgwNzQtMWE2YTExNDMxNjg3",
        "plugin": "",
        "plugin_opts": {
          "host": "uif.org",
          "mode": "http",
          "tls": false,
          "path": "/",
          "obfs-host": ""
        }
      }
    })
  });

  it('vless', () => {
    var rawData = {
      "transport": {
        "setting": {},
        "protocol": "tcp",
        "certSignType": "self",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "acme": {
            "domain": [],
            "provider": "letsencrypt"
          },
          "server_name": "IruixjUvQwSUT043.com",
          "alpn": [],
          "certificate": "c",
          "key": "k"
        },
        "address": "0.0.0.0",
        "port": 443
      },
      "tag": "tag",
      "protocol": "vless",
      "enabled": true,
      "delay": "",
      "core_tag": "",
      "setting": {
        "users": [{
          "uuid": "4dfb77fe-da58-49bf-af08-7a21992ffa32",
          "flow": "xtls-rprx-vision"
        }]
      }
    }

    var res = In2Out(rawData);
    expect(res).toEqual({
      "transport": {
        "setting": {},
        "protocol": "tcp",
        "certSignType": "self",
        "tls_type": "tls",
        "tls": {
          "enabled": true,
          "server_name": "IruixjUvQwSUT043.com",
          "alpn": [],
          "certificate": "c",
        },
        "address": "127.0.0.1",
        "port": 443
      },
      "tag": "tag",
      "protocol": "vless",
      "enabled": false,
      "delay": "",
      "core_tag": "",
      "setting": {
        "uuid": "4dfb77fe-da58-49bf-af08-7a21992ffa32",
        "flow": "xtls-rprx-vision",
      }
    })
  });
})
