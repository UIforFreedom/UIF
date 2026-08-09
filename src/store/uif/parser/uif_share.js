import {
  Base64
} from 'js-base64';

export function UIFRaw(rawData) {
  var res = []
  rawData = rawData.split('\n')
  for (var item in rawData) {
    item = rawData[item]
    if (item.substring(0, 6) != 'uif://') {
      continue
    }
    item = JSON.parse(Base64.decode(item.substring(6)))
    if ('dial' in item) {
      delete item['dial']
    }
    res.push(item)
  }
  return res
}
