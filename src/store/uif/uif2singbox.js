import {
  DeepCopy
} from "@/utils";

function Bound(uif_config) {
  var singBoxStyle = DeepCopy(uif_config['setting']);
  var transport = uif_config['transport']
  singBoxStyle['type'] = uif_config['protocol'];
  singBoxStyle['tag'] = uif_config['tag'];

  var transportProtocol = transport['protocol'];
  if (transportProtocol != 'tcp') {
    var transportSetting = uif_config['transport']['setting']
    transportSetting['type'] = transportProtocol
    singBoxStyle['transport'] = transportSetting
  }

  if (transportProtocol == 'ws' && 'transport' in singBoxStyle &&
    'headers' in singBoxStyle['transport'] &&
    singBoxStyle['transport']['headers']['Host'] == "") {
    delete singBoxStyle['transport']['headers']
  }

  if ('multiplex' in transport) {
    singBoxStyle['multiplex'] = transport['multiplex']
  }

  if (transport['tls_type'] != 'none') {
    singBoxStyle['tls'] = transport['tls']
  }

  return singBoxStyle
}

function Inbound(uif_config) {
  var singBoxStyle = Bound(uif_config)
  singBoxStyle['listen'] = uif_config['transport']['address'];
  singBoxStyle['listen_port'] = parseInt(uif_config['transport']['port']);
  singBoxStyle['sniff'] = true;
  return singBoxStyle
}

function Outbound(uif_config) {
  var singBoxStyle = Bound(uif_config)
  var protocol = singBoxStyle['type']
  if (protocol == 'freedom') {
    singBoxStyle['type'] = 'direct'
  } else if (protocol != 'block') {
    singBoxStyle['server'] = uif_config['transport']['address'];
    singBoxStyle['server_port'] = parseInt(uif_config['transport']['port']);
  }

  if (protocol == 'hysteria2') {
    if (singBoxStyle['obfs'] != undefined && singBoxStyle['obfs']['type'] == '') {
      delete singBoxStyle['obfs']
    }
  } else if (protocol == 'wireguard') {
    if ('pre_shared_key' in singBoxStyle && singBoxStyle['pre_shared_key'] == "") {
      delete singBoxStyle['pre_shared_key']
    }
  }

  return singBoxStyle
}

export {
  Inbound,
  Outbound
}
