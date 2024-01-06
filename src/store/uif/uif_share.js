import {
  Base64
} from 'js-base64';

export default function UIFRaw(rawData) {
  var res = []
  rawData = rawData.split('\n')
  console.log(rawData)
  for (var item in rawData) {
    item = rawData[item]
    if (item.substring(0, 6) != 'uif://') {
      continue
    }
    item = JSON.parse(Base64.decode(item.substring(6)))
    res.push(item)
  }
  return res
}
