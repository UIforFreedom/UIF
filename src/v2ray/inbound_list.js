var pwd = 'abc'

var inbound_list = [{
  listen: "127.0.0.1",
  tag: "uif_socks",
  port: 9527,
  protocol: "socks",
  settings: {
    udp: true,
    ip: "127.0.0.1"
  },
  sniffing: {
    enabled: true,
    destOverride: ["http", "tls"],
    metadataOnly: false,
  },
}, {
  listen: "127.0.0.1",
  tag: "uif_http",
  port: 9528,
  protocol: "http",
  settings: {
    allowTransparent: false
  }
}]

function ReadInboundList() {
  return inbound_list
}

export default {
  ReadInboundList // can not change
}
