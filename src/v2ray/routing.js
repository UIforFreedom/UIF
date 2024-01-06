function NewRules() {
  return {
    "domainMatcher": "mph",
    "type": "field",
    "uif_rules_type": "domains",
    "is_user": true,
    "domains": [
    ],
    "ip": [],
    "network": "tcp,udp",
    "protocol": [
      "http",
      "tls",
      "bittorrent"
    ],
    "outboundTag": "直连",
    "outbound_name": ["内置", "直连"]
  }
}

export default {
  NewRules
}
