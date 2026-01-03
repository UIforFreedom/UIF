import {
  DeepCopy,
  DeleteKeyFromDict
} from "./utils.js";

function Bound(uif_config) {
  var singBoxStyle = DeepCopy(uif_config['setting']);
  var transport = uif_config['transport']
  var proxyProtocol = uif_config['protocol']
  var transportProtocol = transport['protocol'];

  singBoxStyle['type'] = proxyProtocol;
  singBoxStyle['tag'] = uif_config['tag'];

  if (transportProtocol != 'tcp' && transportProtocol != '') {
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

  if (proxyProtocol == 'hysteria2') {
    if (singBoxStyle['obfs'] != undefined && singBoxStyle['obfs']['type'] == '') {
      delete singBoxStyle['obfs']
    }
  }

  if ('dial' in uif_config && 'detour' in uif_config['dial'] &&
    uif_config['dial']['detour']['tag'] != '') {
    singBoxStyle['detour'] = uif_config['dial']['detour']['tag']
  }

  if ('dial' in uif_config && ["trojan", "vmess", "vless", "shadowsocks"].includes(uif_config['protocol'])) {
    if ('tcp_fast_open' in uif_config['dial'] && uif_config['dial']['tcp_fast_open']) {
      singBoxStyle['tcp_fast_open'] = true
    }
    if ('tcp_multi_path' in uif_config['dial'] && uif_config['dial']['tcp_multi_path']) {
      singBoxStyle['tcp_multi_path'] = true
    }
  }
  return singBoxStyle
}

export function Inbound(uifConfig) {
  var singConfig = Bound(uifConfig)
  singConfig['listen'] = uifConfig['transport']['address'];
  singConfig['listen_port'] = parseInt(uifConfig['transport']['port']);
  // singConfig['sniff'] = true;

  if ('multiplex' in singConfig) {
    if ('protocol' in singConfig['multiplex']) {
      delete singConfig['multiplex']['protocol']
    }

    if ('max_streams' in singConfig['multiplex']) {
      delete singConfig['multiplex']['max_streams']
    }
  }
  if ('tls' in singConfig && 'reality' in singConfig['tls']) {
    DeleteKeyFromDict('public_key', singConfig['tls']['reality'])
  }
  return singConfig
}

export function ParseSSPluginOpts(pluginOpts) {
  var res = []
  for (var item in pluginOpts) {
    res.push(item + '=' + String(pluginOpts[item]))
  }
  return res.join(';')
}

export function Outbound(uif_config) {
  var singBoxStyle = Bound(uif_config)
  var protocol = singBoxStyle['type']
  if (protocol == 'freedom') {
    singBoxStyle['type'] = 'direct'
  } else if (protocol != 'block') {
    singBoxStyle['server'] = uif_config['transport']['address'];
    singBoxStyle['server_port'] = parseInt(uif_config['transport']['port']);

    if (singBoxStyle['tls'] && singBoxStyle['tls']['reality'] && singBoxStyle['tls']['reality']['enabled']) {
      if (!singBoxStyle['tls']['utls']) {
        singBoxStyle['tls']['utls'] = {enabled: true, fingerprint: 'random'}
      }
      singBoxStyle['tls']['utls']['enabled'] = true
      if (!singBoxStyle['tls']['utls']['fingerprint']) {
        singBoxStyle['tls']['utls']['fingerprint'] = 'random'
      }
    }
  }

  if (protocol == 'wireguard') {
    var ep = {
      "type": "wireguard",
      "tag": singBoxStyle['tag'],
      "system": singBoxStyle['system_interface'],
      "name": singBoxStyle['interface_name'],
      "mtu": singBoxStyle['mtu'],
      "address": singBoxStyle['local_address'],
      "private_key": singBoxStyle['private_key'],
      // "listen_port": 10000,
      "peers": [
        {
          "address": singBoxStyle['server'],
          "port": singBoxStyle['server_port'],
          "public_key": singBoxStyle['peer_public_key'],
          "pre_shared_key": singBoxStyle['pre_shared_key'],
          "allowed_ips": [
            "0.0.0.0/0"
          ],
          // "persistent_keepalive_interval": 30,
          "reserved": singBoxStyle['reserved']
        }
      ]
    }
    return ep
  } else if (protocol == 'shadowsocks') {
    if ('plugin' in singBoxStyle) {
      if (singBoxStyle['plugin'] == '') {
        singBoxStyle['plugin_opts'] = ''
      } else {
        singBoxStyle['plugin_opts'] = ParseSSPluginOpts(singBoxStyle['plugin_opts'])
      }
    }
  }

  return singBoxStyle
}
