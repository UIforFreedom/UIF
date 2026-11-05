package uif

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseTrafficData(t *testing.T) {
	var c ConnectionInfo
	s := `
  {
    "chains": [
      "freedom"
    ],
    "download": 100,
    "id": "cc688c3f-00e4-47de-8041-1fd497d69fe5",
    "metadata": {
      "network": "tcp",
      "type": "inbound",
      "sourceIP": "127.0.0.1",
      "destinationIP": "172.19.0.1",
      "sourcePort": "58157",
      "destinationPort": "9528",
      "host": "172.19.0.1",
      "dnsMode": "normal",
      "processPath": ""
    },
    "rule": "geosite=private geoip=private => freedom",
    "rulePayload": "",
    "start": "2024-03-10T22:32:25.5606591+08:00",
    "upload": 200
  }
	`
	assert.NoError(t, json.Unmarshal([]byte(s), &c))

	InitParsing()
	fmt.Println(c.Metadata.Inbound)
	ParseMetaData(&c)

	assert.Equal(t, 1, len(AllTraffic.Inbound))
	assert.Equal(t, 1, int(AllTraffic.Inbound["inbound"].TCPTraffic.Frequent))
	assert.Equal(t, 100, int(AllTraffic.Inbound["inbound"].TCPTraffic.Download))
	assert.Equal(t, 200, int(AllTraffic.Inbound["inbound"].TCPTraffic.Upload))

	assert.Equal(t, 1, len(AllTraffic.Dest))
	assert.Equal(t, 1, int(AllTraffic.Dest["172.19.0.1"].TCPTraffic.Frequent))
	assert.Equal(t, 100, int(AllTraffic.Dest["172.19.0.1"].TCPTraffic.Download))
	assert.Equal(t, 200, int(AllTraffic.Dest["172.19.0.1"].TCPTraffic.Upload))

	assert.Equal(t, 1, len(AllTraffic.Outbound))
	assert.Equal(t, 1, int(AllTraffic.Outbound["freedom"].TCPTraffic.Frequent))
	assert.Equal(t, 100, int(AllTraffic.Outbound["freedom"].TCPTraffic.Download))
	assert.Equal(t, 200, int(AllTraffic.Outbound["freedom"].TCPTraffic.Upload))

}
