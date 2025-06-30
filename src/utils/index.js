import uif from '@/store/uif/uif'

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}


// var headers = {
//   "Connection": [
//     "keep-alive"
//   ],
//   "Abc": ['1', '2']
// }

// var res = 'Connection: keep-alive\nAbc: 1;2'
export function TranslateHeader(headers) {
  var res = "";
  var input_type = typeof headers;
  for (var item in headers) {
    var type_of = typeof headers[item];
    if (!Array.isArray(headers)) {
      res += item;
      res += ": ";
    }
    if (type_of == "string") {
      res += headers[item];
    } else if (type_of == "object") {
      var temp2 = "";
      var i = 0;
      for (var item2 in headers[item]) {
        temp2 += headers[item][item2];
        i += 1
        if (i < headers[item].length) {
          temp2 += "; ";
        }
      }
      res += temp2;
    }
    res += "\n";
  }
  return res;
}

// var headers = {
//   "Connection": [
//     "keep-alive"
//   ],
//   "Abc": ['1', '2']
// }

// var res = 'Connection: keep-alive\nAbc: 1;2'
export function RevertHeader(headers_string) {
  var res = {};
  var items = headers_string.toString().split('\n')
  var key, value;
  for (var item in items) {
    item = items[item].toString()
    var temp = item.split(': ')
    key = temp[0]
    value = temp[1].toString().split(';')
    res[key] = value
  }
  return res;
}

export function InitSetting(input, defaultValue) {
  defaultValue = DeepCopy(defaultValue)
  for (let item in input) {
    if (defaultValue[item] == undefined || typeof defaultValue[item] != typeof input[item]) {
      continue
    }
    if (IsObject(defaultValue[item]) && !IsArray(defaultValue[item])) {
      defaultValue[item] = InitSetting(input[item], defaultValue[item])
    } else {
      defaultValue[item] = input[item]
    }
  }
  return defaultValue
}

export function IsArray(input) {
  return input instanceof Array
}

export function IsObject(input) {
  return input instanceof Object
}

export function DeepCopy(input) {
  return JSON.parse(JSON.stringify(input))
}

export function InsertArray(toInsertList, startIndex, insertArray) {
  toInsertList.splice.apply(toInsertList, [startIndex, 0].concat(insertArray));
}

export var rawData = 'dHJvamFuOi8vYzY4ZTNjMjAtZGE3My00NzkxLWI0ZDgtNzAxMWE5OGJhMDZiQGtiYXdzc2cxLmFpb3Blbi5jZmQ6NDQzP3BlZXI9NC0xOTMtMTA1LTE0MS5uaG9zdC4wMGNkbi5jb20mdGZvPTEjJUU3JUJFJThFJUU1JTlCJUJEKyVFOSVCQSVCQiVFNyU5QyU4MSVFNyU5MCU4NiVFNSVCNyVBNSVFNSVBRCVBNiVFOSU5OSVBMgpzczovL1lXVnpMVEkxTmkxblkyMDZZMlJDU1VSV05ESkVRM2R1WmtsT0AzOC4xMjEuNDMuNzE6ODExOSMlRTclQkUlOEUlRTUlOUIlQkQrJUU1JThEJThFJUU3JTlCJTlCJUU5JUExJUJGQ29nZW50JUU5JTgwJTlBJUU0JUJGJUExJUU1JTg1JUFDJUU1JThGJUI4CnZtZXNzOi8vZXlKMklqb2dJaklpTENBaWNITWlPaUFpWEhVM1pqaGxYSFUxTm1aa0lGWXlRMUpQVTFNdVEwOU5JaXdnSW1Ga1pDSTZJQ0l4TURndU1UZzJMakU1TWk0eU16QWlMQ0FpY0c5eWRDSTZJQ0kwTlRVd01pSXNJQ0owZVhCbElqb2dJbTV2Ym1VaUxDQWlhV1FpT2lBaU5ERTRNRFE0WVdZdFlUSTVNeTAwWWprNUxUbGlNR010T1RoallUTTFPREJrWkRJMElpd2dJbUZwWkNJNklDSTJOQ0lzSUNKdVpYUWlPaUFpZEdOd0lpd2dJbkJoZEdnaU9pQWlMM0JoZEdndk1UWTRPVEUxTnpBNE1UZzFPQ0lzSUNKb2IzTjBJam9nSWlJc0lDSjBiSE1pT2lBaUluMD0Kdm1lc3M6Ly9leUpoWkdRaU9pQWlhbkF1Yld4NFp5NXZjbWNpTENBaWRpSTZJQ0l5SWl3Z0luQnpJam9nSWx4MU4yWTRaVngxTlRabVpDQkRiRzkxWkVac1lYSmxYSFU0TWpneVhIVTNNR0k1SWl3Z0luQnZjblFpT2lBNE1Dd2dJbWxrSWpvZ0ltTTNORFF5T0RVeUxUVmhORGd0TkRRMU5pMDROemd6TFdJM1lqaGxaV0ppWTJFMll5SXNJQ0poYVdRaU9pQWlNQ0lzSUNKdVpYUWlPaUFpZDNNaUxDQWlkSGx3WlNJNklDSWlMQ0FpYUc5emRDSTZJQ0pxY0RJdWJXeDRaeTV2Y21jaUxDQWljR0YwYUNJNklDSXZJaXdnSW5Sc2N5STZJQ0lpZlE9PQp2bWVzczovL2V5SmhaR1FpT2lBaU1UVTJMakl5TlM0Mk55NHhNRE1pTENBaWRpSTZJQ0l5SWl3Z0luQnpJam9nSWx4MU5UTTFOMXgxT1RjMVpTQldNa05TVDFOVExrTlBUU0lzSUNKd2IzSjBJam9nTkRjM09USXNJQ0pwWkNJNklDSTBNVGd3TkRoaFppMWhNamt6TFRSaU9Ua3RPV0l3WXkwNU9HTmhNelU0TUdSa01qUWlMQ0FpWVdsa0lqb2dJalkwSWl3Z0ltNWxkQ0k2SUNKMFkzQWlMQ0FpZEhsd1pTSTZJQ0lpTENBaWFHOXpkQ0k2SUNJaUxDQWljR0YwYUNJNklDSXZJaXdnSW5Sc2N5STZJQ0lpZlE9PQp2bWVzczovL2V5SjJJam9nSWpJaUxDQWljSE1pT2lBaVhIVTNaamhsWEhVMU5tWmtJRU5zYjNWa1JteGhjbVZjZFRneU9ESmNkVGN3WWpraUxDQWlZV1JrSWpvZ0luZDNkeTV1YjJsalpTNXBaQ0lzSUNKd2IzSjBJam9nSWpRME15SXNJQ0pwWkNJNklDSTNPREUyTXpnMFppMDFaRFUyTFRSaU1URXRPRFEwTmkxbFlqbGlNVE13Tm1KbVpEVWlMQ0FpWVdsa0lqb2dJakFpTENBaWMyTjVJam9nSW1GMWRHOGlMQ0FpYm1WMElqb2dJbmR6SWl3Z0luUjVjR1VpT2lBaWJtOXVaU0lzSUNKb2IzTjBJam9nSW5ObmJYZHpMbTFoYVc1emMyZ3VlSGw2SWl3Z0luQmhkR2dpT2lBaUwzWnRaWE56SWl3Z0luUnNjeUk2SUNKMGJITWlMQ0FpYzI1cElqb2dJaUo5CnRyb2phbjovL2M2OGUzYzIwLWRhNzMtNDc5MS1iNGQ4LTcwMTFhOThiYTA2YkBrYmF3c3NnMi5haW9wZW4uY2ZkOjQ0Mz9wZWVyPTQtMTkzLTEwNS0xNDEubmhvc3QuMDBjZG4uY29tJnRmbz0xIyVFNiU5NiVCMCVFNSU4QSVBMCVFNSU5RCVBMStBbWF6b24lRTYlOTUlQjAlRTYlOEQlQUUlRTQlQjglQUQlRTUlQkYlODMKdm1lc3M6Ly9leUoySWpvZ0lqSWlMQ0FpY0hNaU9pQWlYSFUzWmpobFhIVTFObVprSUVOc2IzVmtSbXhoY21WY2RUZ3lPREpjZFRjd1lqa2lMQ0FpWVdSa0lqb2dJbU5tTFd4MExuTm9ZWEpsWTJWdWRISmxMbTl1YkdsdVpTSXNJQ0p3YjNKMElqb2dJamd3T0RBaUxDQWlhV1FpT2lBaVpHUTROMlF6TmpJdFpHSmhNUzAwT1dGaExUbGpOek10T0Rkak9ESTRaak0zTW1RMklpd2dJbUZwWkNJNklDSXdJaXdnSW5OamVTSTZJQ0poZFhSdklpd2dJbTVsZENJNklDSjNjeUlzSUNKMGVYQmxJam9nSW01dmJtVWlMQ0FpYUc5emRDSTZJQ0p6YzNKemRXSXVkakF6TG5OemNuTjFZaTVqYjIwaUxDQWljR0YwYUNJNklDSXZZWEJwTDNZekwyUnZkMjVzYjJGa0xtZGxkRVpwYkdVaUxDQWlkR3h6SWpvZ0lpSXNJQ0p6Ym1raU9pQWlJaXdnSW1Gc2NHNGlPaUFpSW4wPQp2bWVzczovL2V5SmhaR1FpT2lBaU1UQTRMakU0Tmk0eE9USXVNak16SWl3Z0luWWlPaUFpTWlJc0lDSndjeUk2SUNKY2RUZG1PR1ZjZFRVMlptUWdWakpEVWs5VFV5NURUMDBpTENBaWNHOXlkQ0k2SURRMU5UQXlMQ0FpYVdRaU9pQWlOREU0TURRNFlXWXRZVEk1TXkwMFlqazVMVGxpTUdNdE9UaGpZVE0xT0RCa1pESTBJaXdnSW1GcFpDSTZJQ0kyTkNJc0lDSnVaWFFpT2lBaWRHTndJaXdnSW5SNWNHVWlPaUFpSWl3Z0ltaHZjM1FpT2lBaUlpd2dJbkJoZEdnaU9pQWlMeUlzSUNKMGJITWlPaUFpSW4wPQp2bWVzczovL2V5SjJJam9nSWpJaUxDQWljSE1pT2lBaVhIVTNaamhsWEhVMU5tWmtJRU5zYjNWa1JteGhjbVZjZFRVeE5tTmNkVFV6WmpoRFJFNWNkVGd5T0RKY2RUY3dZamtvYzJodmNHbG1lU2tpTENBaVlXUmtJam9nSW1SdmJtZDBZV2wzWVc1bk15NWpiMjBpTENBaWNHOXlkQ0k2SUNJME5ETWlMQ0FpYVdRaU9pQWlObVJsWkdSaU4yWXRaVFUxTnkwME1tUmlMV0ptWVRBdFkyWTBNR0l6Tm1JeU4yVXlJaXdnSW1GcFpDSTZJQ0l3SWl3Z0luTmplU0k2SUNKaGRYUnZJaXdnSW01bGRDSTZJQ0ozY3lJc0lDSjBlWEJsSWpvZ0ltNXZibVVpTENBaWFHOXpkQ0k2SUNKa0xtWnlaV1ZvTVM1NGVYb2lMQ0FpY0dGMGFDSTZJQ0l2Wkc5dVozUmhhWGRoYm1jdVkyOXRJaXdnSW5Sc2N5STZJQ0owYkhNaUxDQWljMjVwSWpvZ0lpSjkKdm1lc3M6Ly9leUpoWkdRaU9pQWlNVFUyTGpJME9TNHhPQzR4TWpjaUxDQWlkaUk2SUNJeUlpd2dJbkJ6SWpvZ0lseDFOVE0xTjF4MU9UYzFaVngxT0dNMllWeDFOelkzWWx4MU56Y3dNVngxTjJWaE5seDFOMlptTUZ4MU5URTROVngxTmpWaFpseDFOVGd5TVNCRGJHOTFaR2x1Ym05MllYUnBiMjVjZFRZMU56QmNkVFl6Tm1WY2RUUmxNbVJjZFRWbVl6TWlMQ0FpY0c5eWRDSTZJRFE0TVRBd0xDQWlhV1FpT2lBaU1URXhNVGRrTkdNdE0ySTJZUzAwWlRjMkxUaGlZMk10TW1JME1XSXpaVGxqWVRreklpd2dJbUZwWkNJNklDSTJOQ0lzSUNKdVpYUWlPaUFpZEdOd0lpd2dJblI1Y0dVaU9pQWlJaXdnSW1odmMzUWlPaUFpSWl3Z0luQmhkR2dpT2lBaUx5SXNJQ0owYkhNaU9pQWlJbjA9'

import axios from 'axios'
import Cookies from 'js-cookie'

const TokenKey = 'uif_user_token'
const APIAddress = 'uif_api_address'
const LoginSession = 'uif_session'
const Lang = 'uif_lang'
const SimpleStyle = 'uif_simple_style'
const UIFActions = 'uif_actions'

export function GetKey() {
  var c = Cookies.get(TokenKey)
  if (c == 'undefined' || c == undefined) {
    return ''
  }
  return c
}

export function GetLang() {
  var c = Cookies.get(Lang)
  if (c == 'undefined' || c == undefined) {
    return 'cn'
  }
  return c
}

export function GetSimpleStyle() {
  var c = Cookies.get(SimpleStyle)
  if (c == 'undefined' || c == undefined || c == 'false' || c == '') {
    return false
  }
  return true
}

export function GetUIFActions() {
  var c = Cookies.get(UIFActions)
  if (c == 'undefined' || c == undefined || c == '') {
    return null
  }
  return JSON.parse(c)
}

export function Translator(i) {
  return i[GetLang()];
}

export function GetAllSession() {
  var c = Cookies.get(LoginSession)
  if (c == 'undefined' || c == undefined) {
    return []
  }
  return JSON.parse(c)
}

export function SetSession(content) {
  var allSession = GetAllSession()
  var exist = false
  var index = content
  for (var item in allSession) {
    item = allSession[item]
    if (item['value'] == content['value']) {
      index = item
      exist = true
      break
    }
  }
  if (!exist) {
    allSession.push(index)
  }
  index['password'] = content['password']
  index['lastUsedDate'] = moment().unix()
  console.log(allSession)
  SaveSession(JSON.stringify(allSession))
}

export function SaveSession(content) {
  return Cookies.set(LoginSession, content, {
    expires: 30
  })
}

export function GetAPIAddress() {
  var c = Cookies.get(APIAddress)
  if (c == 'undefined' || c == undefined) {
    return ''
  }
  return c
}

export function SetAPIAddress(content) {
  return Cookies.set(APIAddress, content, {
    expires: 30
  })
}

export function SetKey(token) {
  return Cookies.set(TokenKey, token, {
    expires: 30
  })
}

export function SetLang(token) {
  return Cookies.set(Lang, token, {
    expires: 30
  })
}

export function SetUIFAction(token) {
  if (token != '') {
    token = JSON.stringify(token)
  }
  return Cookies.set(UIFActions, token, {
    expires: 30
  })
}

export function SetSimpleStyle(token) {
  if (token) {
    token = 'true'
  } else {
    token = 'false'
  }
  return Cookies.set(SimpleStyle, token, {
    expires: 30
  })
}


export function MyGet(address, param) {
  param['key'] = GetKey()
  return axios.get(address, {
    params: param,
    headers: {
      'Authorization': 'Bearer ' + uif.state.config.clash.apiKey
    }
  })
}

export var DELAY_TIMEOUT = 20000

export function MyPost(address, param) {
  var dataList = []
  param['key'] = GetKey()
  for (var item in param) {
    if (typeof param[item] == "object") {
      param[item] = JSON.stringify(param[item], null, 2)
    }
    var decodedItem = encodeURIComponent(param[item])
    dataList.push(`${item}=${decodedItem}`)
  }
  var data = dataList.join("&")

  return new Promise((resolve, reject) => {
    var isDone = false
    setTimeout(() => {
      if (!isDone) {
        isDone = true
        reject(new Error('Request timed out'));
      }
    }, DELAY_TIMEOUT);

    axios.post(address, data, {
      timeout: DELAY_TIMEOUT
    }).then(response => {
      if (!isDone) {
        isDone = true
        resolve(response);
      }
    })
      .catch(error => {
        if (!isDone) {
          isDone = true
          reject(error);
        }
      });
  });
}

export function MyWS(address, param, resolve, reject) {
  var url = new URL(address)
  var wsURL = `${url.protocol == 'https:' ? 'wss' : 'ws'}://${url.host}${url.pathname}?key=${encodeURIComponent(GetKey())}`

  const socket = new WebSocket(wsURL);

  socket.onopen = function () {
    socket.send(JSON.stringify(param));
  };

  socket.onmessage = function (event) {
    resolve(event);
  };

  socket.onclose = function () {
    socket.close()
    console.log("ws 连接已关闭");
  };

  socket.onerror = function (error) {
    console.log(error)
    reject(error);
  };
}

export function ObjEqual(obj1, obj2) {
  return JSON.stringify(obj1) == JSON.stringify(obj2)
}

import {
  Base64
} from 'js-base64';
import moment from 'moment'

export function JsonStringWithBase(res) {
  return Base64.encode(JSON.stringify(res))
}

export function ParseTraffic(trafficInBytes) {
  var G = 1000;
  G = 1024;
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let unitIndex = 0;

  // 检查是否为负数
  const isNegative = trafficInBytes < 0;
  trafficInBytes = Math.abs(trafficInBytes); // 取绝对值进行计算

  while (trafficInBytes >= G && unitIndex < units.length - 1) {
    trafficInBytes /= G;
    unitIndex++;
  }

  // 如果是负数，添加负号
  const result = `${trafficInBytes.toFixed(2)} ${units[unitIndex]}`;
  return isNegative ? `-${result}` : result;
}

export function ParseTraffic1024(input) {
  var level = ["B", "KB", "MB", "GB", "TB"];
  var i = 0;
  for (; i < level.length; i++) {
    var temp = Math.floor(input / 1024); // float to int
    if (temp <= 0) {
      break;
    }
    input = temp;
  }
  return input.toString() + level[i];
}

export function ParseURL(url) {
  url = new URL(url)
  return url.origin
}

export function IsLAN(ip) {
  // 将输入的IP地址字符串分割成数组
  const parts = ip.split('.').map(part => parseInt(part, 10));

  // 检查IP地址格式是否有效
  if (parts.length !== 4 || parts.some(part => isNaN(part) || part < 0 || part > 255)) {
    return false; // 不是有效的IP地址
  }

  // 检查是否为10.x.x.x
  if (parts[0] === 10) {
    return true;
  }

  // 检查是否为172.16.x.x到172.31.x.x
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
    return true;
  }

  // 检查是否为192.168.x.x
  if (parts[0] === 192 && parts[1] === 168) {
    return true;
  }

  // 不属于任何一个内网IP地址范围
  return false;
}

export function IdentifyNetworkAddress(input) {
  // 正则表达式匹配IPv4地址
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // 正则表达式匹配IPv6地址
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/;
  // 正则表达式匹配域名
  const domainPattern = /^(?:(?:[a-zA-Z0-9-]{0,63}\.)*(?:[a-zA-Z0-9-]{0,63}\.))?(?:[a-zA-Z]{2,63})$/;

  // 检查IPv4地址
  if (ipv4Pattern.test(input)) {
    return 'IPv4';
  }
  // 检查IPv6地址
  else if (ipv6Pattern.test(input)) {
    return 'IPv6';
  }
  // 检查域名
  else if (domainPattern.test(input)) {
    return 'domain';
  }
  // 未知格式
  else {
    return 'unknown';
  }
}

export function DeleteKeyFromDict(key, dict) {
  if (key in dict) {
    delete dict[key]
  }
}

export function ToLowerCaseIfNot(str) {
  if (typeof str !== "string") {
    return str
  }

  // 使用正则检查字符串是否包含非小写英文字母
  const containsUpperCase = /[A-Z]/.test(str);

  return containsUpperCase ? str.toLowerCase() : str;
}
