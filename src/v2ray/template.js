var default_template = {
  "uif_template_version": 1,
  "log": {},
  "api": {
    "tag": "api",
    "services": [
      "HandlerService",
      "StatsService"
    ]
  },
  "dns": {},

  "routing": { //{{{
    "domainStrategy": "IPIfNonMatch",
    "domainMatcher": "mph",
    "rules": [{
      "domainMatcher": "mph",
      "type": "field",
      "uif_rules_type": "domains",
      "is_user": true,
      "domains": [
        "https://github.com/UIFV2ray/UIFV2ray",
      ],
      "ip": [],
      "network": "tcp,udp",
      "outboundTag": "直连",
      "outbound_name": ["内置", "直连"]
    }, {
      "type": "field",
      "inboundTag": [
        "api"
      ],
      "outboundTag": "api"
    }, {
      "domainMatcher": "mph",
      "type": "field",
      "ip": [
        "geoip:private"
      ],
      "outboundTag": "直连"
    }, {
      "domainMatcher": "mph",
      "type": "field",
      "domains": [
        "geosite:gfw"
      ],
      "inboundTag": [
        "http_gfw",
        "socks_gfw",
      ],
      "outboundTag": "main_proxy"
    }, {
      "domainMatcher": "mph",
      "type": "field",
      "inboundTag": [
        "http_gfw",
        "socks_gfw",
      ],
      "outboundTag": "直连"
    }, {
      "domainMatcher": "mph",
      "type": "field",
      "domains": [
        "geosite:cn"
      ],
      "inboundTag": [
        "http_cn",
        "socks_cn",
      ],
      "outboundTag": "直连"
    }, {
      "domainMatcher": "mph",
      "inboundTag": [
        "http_cn",
        "socks_cn",
        "http_all",
        "socks_all"
      ],
      "type": "field",
      "outboundTag": "main_proxy"
    }],
    "balancers": []
  },
  //}}}

  "policy": {},

  "inbounds": [{ //{{{
    "tag": "socks_cn",
    "port": 9521,
    "listen": "127.0.0.1",
    "protocol": "socks",
    "sniffing": {
      "enabled": true,
      "destOverride": [
        "http",
        "tls"
      ]
    },
    "settings": {
      "udp": true
    }
  }, {
    "tag": "socks_all",
    "port": 9522,
    "listen": "127.0.0.1",
    "protocol": "socks",
    "sniffing": {
      "enabled": true,
      "destOverride": [
        "http",
        "tls"
      ]
    },
    "settings": {
      "udp": true
    }
  }, {
    "tag": "http_cn",
    "port": 9525,
    "listen": "127.0.0.1",
    "protocol": "http",
    "sniffing": {
      "enabled": true,
      "destOverride": [
        "http",
        "tls"
      ]
    },
    "settings": {
      "userLevel": 0
    }
  }, {
    "tag": "http_all",
    "port": 9526,
    "listen": "127.0.0.1",
    "protocol": "http",
    "sniffing": {
      "enabled": true,
      "destOverride": [
        "http",
        "tls"
      ]
    },
    "settings": {
      "userLevel": 0
    }
  }], //}}}

  "outbounds": [{ //{{{
      "tag": "直连",
      'is_default': true,
      "protocol": "freedom",
      "settings": {}
    },
    {
      "tag": "屏蔽",
      'is_default': true,
      "protocol": "blackhole",
      "settings": {
        "response": {
          "type": "http"
        }
      }
    }, {
      "tag": "main_proxy",
      'is_default': true,
      "protocol": "vmess",
      "settings": {
        "vnext": [{
          "address": "uif01.xyz",
          "port": 443,
          "users": [{
            "id": "a831381d-6324-4d53-ad4f-9cda48b30648",
            "alterId": 0,
            "email": "t@t.tt",
            "security": "auto"
          }]
        }]
      },
      "streamSettings": {
        "network": "ws",
        "security": "tls",
        "tlsSettings": {
          "allowInsecure": false,
          "serverName": "uif01.xyz"
        },
        "wsSettings": {
          "path": "/uif",
          "headers": {
            "Host": "uif01.xyz"
          }
        }
      },
      "mux": {
        "enabled": false,
        "concurrency": -1
      }
    }
  ], //}}}

  "transport": {},
  "stats": {},
  "reverse": {},
  "fakedns": [],
  "browserForwarder": {},
  "observatory": {}
}

export default {
  default_template
}
