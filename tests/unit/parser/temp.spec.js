import {
  V2rayN2UIF
} from '@/store/uif/parser/v2rayn2uif.js'

describe('parser:parse to uif config', () => {
  it('ss with no encode', () => {
    var rawData = 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNToxcTdSTkthSWsyd1lPOGZFUG1FWDB2V1E3VmErUVJUQQ==@91.192.81.21:8388#🇸🇬SG | 🟢 | ss | @OutlineVpnOfficial | 4'
    var url = new URL(rawData)
    console.log(url)

    var res = V2rayN2UIF(rawData);
    expect(res[0]).toEqual({
      "tag": "🇸🇬SG | 🟢 | ss | @OutlineVpnOfficial | 4",
      "protocol": "shadowsocks",
      "transport": {
        "address": "91.192.81.21",
        "port": 8388,
        "tls_type": "none",
        "setting": {},
        "tls": {},
        "protocol": "tcp",
      },
      "setting": {
        "password": "0a28bc10-1454-4d45-af23-65c1be96028f",
        "method": "aes-256-gcm",
      },
    })
  });
})
