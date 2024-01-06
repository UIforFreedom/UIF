import setting from './setting'

class Proxy {
  constructor(tag, protocol, address, port, password, outStream, sni = "") {
    this.tag = tag;
    this.protocol = protocol;
    this.address = address;
    this.port = port;
    this.password = password;
    this.outStream = outStream;
    this.sni = sni;
  }
}

class Outbound extends Proxy {
  constructor(tag, protocol, address, port, password, outStream, sni = "") {
    super(tag, protocol, address, port, password, outStream, sni)
    this.speed = ''
  }

  testSpeed() {

  }
}

class Inbound extends Proxy {
  constructor(tag, protocol, address, port, password, outStream) {
    super(tag, protocol, address, port, password, outStream, '')
  }
}

class TLS {
  constructor(enable, pubKey = "", secretKey = "") {
    this.enable = enable;
    this.pubKey = pubKey;
    this.secretKey = secretKey;
  }
}

class Transport {
  constructor(tag, protocol, tls) {
    this.tag = tag;
    this.protocol = protocol;
    this.tls = tls;
  }
}


class Client extends Transport {
  constructor(tag, protocol, tls) {
    super(tag, protocol, tls)
  }
}

class Server extends Transport {
  constructor(tag, protocol, tls) {
    super(tag, protocol, tls)
  }
}

class DNS {
  constructor(tag, protocol, address) {
    this.tag = tag
    this.protocol = protocol
    this.address = address // 'https://doh.pub.com'
  }
}

class Rules {
  constructor(tag, protocol, tls, outbound, domain = [], ip = [], dns = "") {
    this.tag = tag;
    this.protocol = protocol;
    this.tls = tls;
    this.outbounds = outbound;
    this.domain = domain;
    this.ip = ip;
    this.dns = dns;
  }
}

var config = {
  outbounds: {
    block: Outbound('block', 'block', '', '', '', ''),
    freedom: Outbound('freedom', 'freedom', '', '', '', ''),
  },
  inbounds: {
    defaultHttp: Inbound('defaultHttp', setting.defaultHttpAddress, setting.defaultHttpPort)
  },
  outStream: {
    tcp: Client('tcp', 'tcp', TLS('default', false)),
    tcpTLS: Client('tcpTLS', 'tcp', TLS('default', true))
  },
  inStream: {
    tcp: Server('tcp', 'tcp', TLS('default', false)),
    tcpTLS: Server('tcpTLS', 'tcp', TLS('default', true))
  }, dns: {
    default: DNS('defaultDNS', 'doh', '')
  }
}

export default config
