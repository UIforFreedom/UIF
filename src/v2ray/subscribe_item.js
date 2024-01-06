function ReadSubscribedItem() {
  // return [{
  //   'nick_name': 'UIF 免费订阅',
  //   'last_update_time_stamp': new Date,
  //   'nodes': [],
  // }]

  return [{
    'nick_name': 'UIF 订阅',
    'subscribe_version': 1,
    'last_update_time_stamp': new Date,
    'nodes': [{
      'node_nick_name': '限速 500KB/s | 不限时',
      'node_uuid': 'node_uuid_3',
      'detail': '# 欢迎使用 UIF 内置节点',
      'delay': '100ms',
      'regine_chinese': '香港',
      'is_free': true,
      'rate_of_flow': '1.0',
      'v2ray_outbound': {},
    }, {
      'node_nick_name': '高速通道 01 | 不限速 | 不限时',
      'node_uuid': 'node_uuid_1',
      'delay': '10ms',
      'regine_chinese': '芝加哥',
      'is_free': false,
      'rate_of_flow': '1.0',
      'v2ray_outbound': {},
    }, {
      'node_nick_name': '高速通道 02 | 不限速 | 不限时',
      'node_uuid': 'node_uuid_2',
      'delay': '20ms',
      'regine_chinese': '芝加哥',
      'is_free': false,
      'rate_of_flow': '1.0',
      'v2ray_outbound': {},
    }],
  }]
}

export default {
  ReadSubscribedItem
}
