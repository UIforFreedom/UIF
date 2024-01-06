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

export var clashRawData = `
dns:
  enabled: true
  nameserver:
    - 119.29.29.29
    - 223.5.5.5
  fallback:
    - 8.8.8.8
    - 8.8.4.4
    - tls://1.0.0.1:853
    - tls://dns.google:853

proxies:
  - {"name":"🇨🇳_CN_中国_1","type":"vmess","server":"14.116.151.100","port":63093,"cipher":"auto","uuid":"311f3c4b-90a1-3c5c-a4fe-215cc7c90d02","alterId":0,"tls":true,"skip-cert-verify":true,"network":"tcp"}
  - {"name":"🇫🇷_FR_法国_1","type":"ss","server":"54.36.174.181","port":8000,"password":"KixLvKzwjekG00rm","cipher":"aes-256-gcm"}
  - {"name":"🇫🇷_FR_法国_2","type":"ss","server":"54.36.174.181","port":5600,"password":"Y6R9pAtvxxzmGC","cipher":"aes-256-gcm"}
  - {"name":"🇳🇱_NL_荷兰_1","type":"ss","server":"172.99.188.99","port":5003,"password":"g5MeD6Ft3CWlJId","cipher":"aes-256-gcm"}
  - {"name":"🇳🇱_NL_荷兰_2","type":"ss","server":"172.99.188.99","port":5004,"password":"g5MeD6Ft3CWlJId","cipher":"aes-256-gcm"}
  - {"name":"🇳🇱_NL_荷兰_3","type":"ss","server":"172.99.188.99","port":6379,"password":"zDNVedRFPQexG9v","cipher":"aes-256-gcm"}
  - {"name":"🇳🇱_NL_荷兰_4","type":"ss","server":"ak1663.www.outline.network.fr8678825324247b8176d59f83c30bd94d23d2e3ac5cd4a743bkwqeikvdyufr.cyou","port":5000,"password":"Y6R9pAtvxxzmGC","cipher":"aes-256-gcm"}
  - {"name":"🇳🇱_NL_荷兰_5","type":"ss","server":"172.99.188.99","port":8888,"password":"Y6R9pAtvxxzmGC","cipher":"aes-256-gcm"}
  - {"name":"🇳🇱_NL_荷兰_6","type":"ss","server":"172.99.188.99","port":8882,"password":"kDWvXYZoTBcGkC4","cipher":"aes-256-gcm"}
  - {"name":"🇳🇱_NL_荷兰_7","type":"ss","server":"172.99.188.99","port":5001,"password":"Y6R9pAtvxxzmGC","cipher":"aes-256-gcm"}
  - {"name":"🇳🇱_NL_荷兰_8","type":"ss","server":"172.99.188.99","port":2375,"password":"faBAoD54k87UJG7","cipher":"aes-256-gcm"}
  - {"name":"🇳🇱_NL_荷兰_9","type":"ss","server":"ak1643.www.outline.network.fr8678825324247b8176d59f83c30bd94d23d2e3ac5cd4a743bkwqeikvdyufr.cyou","port":8888,"password":"Y6R9pAtvxxzmGC","cipher":"aes-256-gcm"}
  - {"name":"🇨🇳_CN_中国_2","type":"vmess","server":"123.249.101.15","port":19709,"cipher":"auto","uuid":"2f278a45-940a-46c1-c886-77f3b2d33987","alterId":0,"tls":false,"skip-cert-verify":true,"network":"ws"}
  - {"name":"🇺🇸_US_美国_1","type":"vmess","server":"vde2.0bad.com","port":443,"cipher":"auto","uuid":"927094d3-d678-4763-8591-e240d0bcae87","alterId":0,"tls":true,"skip-cert-verify":true,"network":"ws","ws-opts":{"path":"/chat"}}
  - {"name":"🇨🇳_CN_中国->🇹🇼_TW_台湾","type":"ss","server":"14.29.124.168","port":24001,"password":"QazEdcTgb159@$*","cipher":"aes-128-cfb"}
  - {"name":"🇰🇷_KR_韩国","type":"ssr","server":"kr1.vfun.icu","port":443,"password":"vyunme","cipher":"aes-256-cfb","obfs":"plain","protocol":"auth_aes128_sha1","obfs-param":"ab93117422.jd.hk","protocol-param":"17422:TTp0SX"}
  - {"name":"🇸🇬_SG_新加坡_1","type":"trojan","server":"li1hkv2b.559xp5.cn","port":443,"udp":true,"password":"659bb4b2-8d8d-4bd5-8db9-16ec53b71201","skip-cert-verify":true,"network":"tcp"}
  - {"name":"🇸🇬_SG_新加坡_2","type":"trojan","server":"bacmlwrkoph.559xp5.cn","port":443,"udp":true,"password":"808841b0-6730-458c-b11f-d6c33011d605","skip-cert-verify":true,"network":"tcp"}
  - {"name":"🇸🇬_SG_新加坡->🇯🇵_JP_日本","type":"trojan","server":"nsaghhfhintt100tw.559xp5.cn","port":443,"udp":true,"password":"659bb4b2-8d8d-4bd5-8db9-16ec53b71201","skip-cert-verify":true,"network":"tcp"}
  - {"name":"🇯🇵_JP_日本","type":"vmess","server":"vjp1.0bad.com","port":443,"cipher":"auto","uuid":"927094d3-d678-4763-8591-e240d0bcae87","alterId":0,"tls":true,"skip-cert-verify":true,"servername":"vjp1.0bad.com","network":"ws","ws-opts":{"path":"/chat"}}
  - {"name":"🇺🇸_US_美国_2","type":"vmess","server":"vus3.0bad.com","port":443,"cipher":"auto","uuid":"927094d3-d678-4763-8591-e240d0bcae87","alterId":0,"tls":true,"skip-cert-verify":true,"servername":"vus3.0bad.com","network":"ws","ws-opts":{"path":"/chat"}}
  - {"name":"🇫🇷_FR_法国->🇦🇹_AT_奥地利","type":"ss","server":"135.125.244.103","port":989,"password":"f8f7aCzcPKbsF8p3","cipher":"aes-256-cfb"}
  - {"name":"🇸🇬_SG_新加坡->🇦🇪_AE_阿联酋","type":"trojan","server":"nsafhijklggsddadawscae.559xp5.cn","port":443,"udp":true,"password":"2ba8ac92-1a83-4961-8acb-03156628aa8f","skip-cert-verify":true,"network":"tcp"}
  - {"name":"🇸🇬_SG_新加坡_3","type":"trojan","server":"nsafchjhtijntht.559xp5.cn","port":443,"udp":true,"password":"c519d477-7bde-430a-9667-c02b46c31d6d","skip-cert-verify":true,"network":"tcp"}
  - {"name":"🇸🇬_SG_新加坡_4","type":"trojan","server":"li1faiubsvdnasjp2.559xp5.cn","port":443,"udp":true,"password":"f0e93980-419f-4d05-ad92-bd9859c2dbed","skip-cert-verify":true,"network":"tcp"}
`

export var rawData = 'dHJvamFuOi8vYzY4ZTNjMjAtZGE3My00NzkxLWI0ZDgtNzAxMWE5OGJhMDZiQGtiYXdzc2cxLmFpb3Blbi5jZmQ6NDQzP3BlZXI9NC0xOTMtMTA1LTE0MS5uaG9zdC4wMGNkbi5jb20mdGZvPTEjJUU3JUJFJThFJUU1JTlCJUJEKyVFOSVCQSVCQiVFNyU5QyU4MSVFNyU5MCU4NiVFNSVCNyVBNSVFNSVBRCVBNiVFOSU5OSVBMgpzczovL1lXVnpMVEkxTmkxblkyMDZZMlJDU1VSV05ESkVRM2R1WmtsT0AzOC4xMjEuNDMuNzE6ODExOSMlRTclQkUlOEUlRTUlOUIlQkQrJUU1JThEJThFJUU3JTlCJTlCJUU5JUExJUJGQ29nZW50JUU5JTgwJTlBJUU0JUJGJUExJUU1JTg1JUFDJUU1JThGJUI4CnZtZXNzOi8vZXlKMklqb2dJaklpTENBaWNITWlPaUFpWEhVM1pqaGxYSFUxTm1aa0lGWXlRMUpQVTFNdVEwOU5JaXdnSW1Ga1pDSTZJQ0l4TURndU1UZzJMakU1TWk0eU16QWlMQ0FpY0c5eWRDSTZJQ0kwTlRVd01pSXNJQ0owZVhCbElqb2dJbTV2Ym1VaUxDQWlhV1FpT2lBaU5ERTRNRFE0WVdZdFlUSTVNeTAwWWprNUxUbGlNR010T1RoallUTTFPREJrWkRJMElpd2dJbUZwWkNJNklDSTJOQ0lzSUNKdVpYUWlPaUFpZEdOd0lpd2dJbkJoZEdnaU9pQWlMM0JoZEdndk1UWTRPVEUxTnpBNE1UZzFPQ0lzSUNKb2IzTjBJam9nSWlJc0lDSjBiSE1pT2lBaUluMD0Kdm1lc3M6Ly9leUpoWkdRaU9pQWlhbkF1Yld4NFp5NXZjbWNpTENBaWRpSTZJQ0l5SWl3Z0luQnpJam9nSWx4MU4yWTRaVngxTlRabVpDQkRiRzkxWkVac1lYSmxYSFU0TWpneVhIVTNNR0k1SWl3Z0luQnZjblFpT2lBNE1Dd2dJbWxrSWpvZ0ltTTNORFF5T0RVeUxUVmhORGd0TkRRMU5pMDROemd6TFdJM1lqaGxaV0ppWTJFMll5SXNJQ0poYVdRaU9pQWlNQ0lzSUNKdVpYUWlPaUFpZDNNaUxDQWlkSGx3WlNJNklDSWlMQ0FpYUc5emRDSTZJQ0pxY0RJdWJXeDRaeTV2Y21jaUxDQWljR0YwYUNJNklDSXZJaXdnSW5Sc2N5STZJQ0lpZlE9PQp2bWVzczovL2V5SmhaR1FpT2lBaU1UVTJMakl5TlM0Mk55NHhNRE1pTENBaWRpSTZJQ0l5SWl3Z0luQnpJam9nSWx4MU5UTTFOMXgxT1RjMVpTQldNa05TVDFOVExrTlBUU0lzSUNKd2IzSjBJam9nTkRjM09USXNJQ0pwWkNJNklDSTBNVGd3TkRoaFppMWhNamt6TFRSaU9Ua3RPV0l3WXkwNU9HTmhNelU0TUdSa01qUWlMQ0FpWVdsa0lqb2dJalkwSWl3Z0ltNWxkQ0k2SUNKMFkzQWlMQ0FpZEhsd1pTSTZJQ0lpTENBaWFHOXpkQ0k2SUNJaUxDQWljR0YwYUNJNklDSXZJaXdnSW5Sc2N5STZJQ0lpZlE9PQp2bWVzczovL2V5SjJJam9nSWpJaUxDQWljSE1pT2lBaVhIVTNaamhsWEhVMU5tWmtJRU5zYjNWa1JteGhjbVZjZFRneU9ESmNkVGN3WWpraUxDQWlZV1JrSWpvZ0luZDNkeTV1YjJsalpTNXBaQ0lzSUNKd2IzSjBJam9nSWpRME15SXNJQ0pwWkNJNklDSTNPREUyTXpnMFppMDFaRFUyTFRSaU1URXRPRFEwTmkxbFlqbGlNVE13Tm1KbVpEVWlMQ0FpWVdsa0lqb2dJakFpTENBaWMyTjVJam9nSW1GMWRHOGlMQ0FpYm1WMElqb2dJbmR6SWl3Z0luUjVjR1VpT2lBaWJtOXVaU0lzSUNKb2IzTjBJam9nSW5ObmJYZHpMbTFoYVc1emMyZ3VlSGw2SWl3Z0luQmhkR2dpT2lBaUwzWnRaWE56SWl3Z0luUnNjeUk2SUNKMGJITWlMQ0FpYzI1cElqb2dJaUo5CnRyb2phbjovL2M2OGUzYzIwLWRhNzMtNDc5MS1iNGQ4LTcwMTFhOThiYTA2YkBrYmF3c3NnMi5haW9wZW4uY2ZkOjQ0Mz9wZWVyPTQtMTkzLTEwNS0xNDEubmhvc3QuMDBjZG4uY29tJnRmbz0xIyVFNiU5NiVCMCVFNSU4QSVBMCVFNSU5RCVBMStBbWF6b24lRTYlOTUlQjAlRTYlOEQlQUUlRTQlQjglQUQlRTUlQkYlODMKdm1lc3M6Ly9leUoySWpvZ0lqSWlMQ0FpY0hNaU9pQWlYSFUzWmpobFhIVTFObVprSUVOc2IzVmtSbXhoY21WY2RUZ3lPREpjZFRjd1lqa2lMQ0FpWVdSa0lqb2dJbU5tTFd4MExuTm9ZWEpsWTJWdWRISmxMbTl1YkdsdVpTSXNJQ0p3YjNKMElqb2dJamd3T0RBaUxDQWlhV1FpT2lBaVpHUTROMlF6TmpJdFpHSmhNUzAwT1dGaExUbGpOek10T0Rkak9ESTRaak0zTW1RMklpd2dJbUZwWkNJNklDSXdJaXdnSW5OamVTSTZJQ0poZFhSdklpd2dJbTVsZENJNklDSjNjeUlzSUNKMGVYQmxJam9nSW01dmJtVWlMQ0FpYUc5emRDSTZJQ0p6YzNKemRXSXVkakF6TG5OemNuTjFZaTVqYjIwaUxDQWljR0YwYUNJNklDSXZZWEJwTDNZekwyUnZkMjVzYjJGa0xtZGxkRVpwYkdVaUxDQWlkR3h6SWpvZ0lpSXNJQ0p6Ym1raU9pQWlJaXdnSW1Gc2NHNGlPaUFpSW4wPQp2bWVzczovL2V5SmhaR1FpT2lBaU1UQTRMakU0Tmk0eE9USXVNak16SWl3Z0luWWlPaUFpTWlJc0lDSndjeUk2SUNKY2RUZG1PR1ZjZFRVMlptUWdWakpEVWs5VFV5NURUMDBpTENBaWNHOXlkQ0k2SURRMU5UQXlMQ0FpYVdRaU9pQWlOREU0TURRNFlXWXRZVEk1TXkwMFlqazVMVGxpTUdNdE9UaGpZVE0xT0RCa1pESTBJaXdnSW1GcFpDSTZJQ0kyTkNJc0lDSnVaWFFpT2lBaWRHTndJaXdnSW5SNWNHVWlPaUFpSWl3Z0ltaHZjM1FpT2lBaUlpd2dJbkJoZEdnaU9pQWlMeUlzSUNKMGJITWlPaUFpSW4wPQp2bWVzczovL2V5SjJJam9nSWpJaUxDQWljSE1pT2lBaVhIVTNaamhsWEhVMU5tWmtJRU5zYjNWa1JteGhjbVZjZFRVeE5tTmNkVFV6WmpoRFJFNWNkVGd5T0RKY2RUY3dZamtvYzJodmNHbG1lU2tpTENBaVlXUmtJam9nSW1SdmJtZDBZV2wzWVc1bk15NWpiMjBpTENBaWNHOXlkQ0k2SUNJME5ETWlMQ0FpYVdRaU9pQWlObVJsWkdSaU4yWXRaVFUxTnkwME1tUmlMV0ptWVRBdFkyWTBNR0l6Tm1JeU4yVXlJaXdnSW1GcFpDSTZJQ0l3SWl3Z0luTmplU0k2SUNKaGRYUnZJaXdnSW01bGRDSTZJQ0ozY3lJc0lDSjBlWEJsSWpvZ0ltNXZibVVpTENBaWFHOXpkQ0k2SUNKa0xtWnlaV1ZvTVM1NGVYb2lMQ0FpY0dGMGFDSTZJQ0l2Wkc5dVozUmhhWGRoYm1jdVkyOXRJaXdnSW5Sc2N5STZJQ0owYkhNaUxDQWljMjVwSWpvZ0lpSjkKdm1lc3M6Ly9leUpoWkdRaU9pQWlNVFUyTGpJME9TNHhPQzR4TWpjaUxDQWlkaUk2SUNJeUlpd2dJbkJ6SWpvZ0lseDFOVE0xTjF4MU9UYzFaVngxT0dNMllWeDFOelkzWWx4MU56Y3dNVngxTjJWaE5seDFOMlptTUZ4MU5URTROVngxTmpWaFpseDFOVGd5TVNCRGJHOTFaR2x1Ym05MllYUnBiMjVjZFRZMU56QmNkVFl6Tm1WY2RUUmxNbVJjZFRWbVl6TWlMQ0FpY0c5eWRDSTZJRFE0TVRBd0xDQWlhV1FpT2lBaU1URXhNVGRrTkdNdE0ySTJZUzAwWlRjMkxUaGlZMk10TW1JME1XSXpaVGxqWVRreklpd2dJbUZwWkNJNklDSTJOQ0lzSUNKdVpYUWlPaUFpZEdOd0lpd2dJblI1Y0dVaU9pQWlJaXdnSW1odmMzUWlPaUFpSWl3Z0luQmhkR2dpT2lBaUx5SXNJQ0owYkhNaU9pQWlJbjA9'

import axios from 'axios'
import Qs from 'qs'
import Cookies from 'js-cookie'

const TokenKey = 'uif_user_token'
const APIAddress = 'uif_api_address'
export function GetKey() {
  var c = Cookies.get(TokenKey)
  if (c == 'undefined' || c == undefined) {
    return ''
  }
  return c
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

export function MyGet(address, param) {
  param['key'] = GetKey()
  return axios.get(address, {
    params: param
  })
}

export function MyPost(address, param) {
  for (var item in param) {
    if (typeof param[item] == "object") {
      param[item] = JSON.stringify(param[item], null, 2)
    }
  }
  param['key'] = GetKey()
  var data = Qs.stringify(param)
  return axios.post(address, data)
}

export function ObjEqual(obj1, obj2) {
  return JSON.stringify(obj1) == JSON.stringify(obj2)
}

import {
  Base64
} from 'js-base64';
export function JsonStringWithBase(res) {
  return Base64.encode(JSON.stringify(res))
}

export function ParseTraffic(input) {
  var level = ["B", "KB", "MB", "GB", "TB"];
  var i = 0;
  for (; i < level.length; i++) {
    var temp = Math.floor(input / 1000); // float to int
    if (temp <= 0) {
      break;
    }
    input = temp;
  }
  return input.toString() + level[i];
}
