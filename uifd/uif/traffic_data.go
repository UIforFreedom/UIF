package uif

import (
	"encoding/json"
	"io"
	"net/http"
	"net/netip"
	"time"
)

type ConnectionInfo struct {
	ID            string   `json:"id"`
	Metadata      Metadata `json:"metadata"`
	UploadTotal   uint64   `json:"upload"`
	DownloadTotal uint64   `json:"download"`
	Chain         []string `json:"chains"`
	Rule          string   `json:"rule"`
}

type Metadata struct {
	Inbound string `json:"type"`

	NetWork     string `json:"network"`
	SrcPort     string `json:"sourcePort"`
	DstPort     string `json:"destinationPort"`
	Host        string `json:"host"`
	DNSMode     string `json:"dnsMode"`
	ProcessPath string `json:"processPath"`

	SrcIP  netip.Addr `json:"sourceIP"`
	DestIP netip.Addr `json:"destinationIP"`
}

type Traffic struct {
	Upload   uint64 `json:"upload,omitempty"`
	Download uint64 `json:"download,omitempty"`
	Frequent uint64 `json:"frequent,omitempty"`
}

type DestInfo struct {
	TCPTraffic *Traffic `json:"tcp_traffic,omitempty"`
	UDPTraffic *Traffic `json:"udp_traffic,omitempty"`
}

type TrafficData struct {
	Inbound  map[string]*DestInfo `json:"inbound,omitempty"`
	Outbound map[string]*DestInfo `json:"outbound,omitempty"`
	Dest     map[string]*DestInfo `json:"dest,omitempty"`
}

var AllTraffic TrafficData

var Links []ConnectionInfo
var ClashLoop bool
var ClashLoopData bool

func UpdateTraffic(v *DestInfo, conn *ConnectionInfo) {
	d := v.TCPTraffic
	if conn.Metadata.NetWork == "udp" {
		d = v.UDPTraffic
	}
	d.Download += conn.DownloadTotal
	d.Upload += conn.UploadTotal
	d.Frequent += 1
}

func ParseBound(conn *ConnectionInfo) {
	inbound := conn.Metadata.Inbound
	if inbound != "" {
		v, ok := AllTraffic.Inbound[inbound]
		if !ok {
			v = &DestInfo{TCPTraffic: &Traffic{}, UDPTraffic: &Traffic{}}
			AllTraffic.Inbound[inbound] = v
		}
		UpdateTraffic(v, conn)
	}

	if len(conn.Chain) <= 0 {
		return
	}
	outbound := conn.Chain[0]
	if outbound != "" {
		v, ok := AllTraffic.Outbound[outbound]
		if !ok {
			v = &DestInfo{TCPTraffic: &Traffic{}, UDPTraffic: &Traffic{}}
			AllTraffic.Outbound[outbound] = v
		}
		UpdateTraffic(v, conn)
	}
}

func ParseDest(conn *ConnectionInfo) {
	m := conn.Metadata
	dst := m.Host
	if dst == "" {
		dst = m.DestIP.String()
	}
	if dst == "" {
		return
	}
	v, ok := AllTraffic.Dest[dst]
	if !ok {
		v = &DestInfo{TCPTraffic: &Traffic{}, UDPTraffic: &Traffic{}}
		AllTraffic.Dest[dst] = v
	}
	UpdateTraffic(v, conn)
}

func ParseMetaData(conn *ConnectionInfo) {
	ParseBound(conn)
	ParseDest(conn)
}

func InitParsing() {
	if !ClashLoopData {
		ClashLoopData = true
		AllTraffic.Dest = make(map[string]*DestInfo)
		AllTraffic.Inbound = make(map[string]*DestInfo)
		AllTraffic.Outbound = make(map[string]*DestInfo)
		Links = make([]ConnectionInfo, 0)
	}
}

func FindInOtherConnection(c1 []ConnectionInfo, c2 *ConnectionInfo) bool {
	for _, v := range c1 {
		if v.ID == c2.ID {
			return true
		}
	}
	return false
}

type Connections struct {
	Connections []ConnectionInfo `json:"connections"`
}

func IsUseClash() bool {
	return false // TODO
	// check enabled first
	config, err := ReadUIFConfigJson()
	var ok bool
	var clash any
	if clash, ok = config["clash"]; !ok || err != nil {
		return false
	}
	temp := clash.(map[string]any)
	var clashEnabled bool
	if clashEnabled, ok = temp["enabled"].(bool); !ok {
		return false
	}
	if !clashEnabled {
		return false
	}
	return true
}

func StartClashStatus() {
	if !IsUseClash() {
		ClashLoop = false
		return
	} else if ClashLoop {
		// running
		return
	}
	ClashLoop = true

	InitParsing()

	WriteLog("Listening Clash API.")
	go func() {
		var res Connections
		for ClashLoop {
			time.Sleep(1 * time.Second)

			url := "http://127.0.0.1:9181/connections"
			resp, err := http.Get(url)
			if err != nil {
				WriteLog(err.Error())
				continue
			}
			defer resp.Body.Close()
			// Read the response body
			body, err := io.ReadAll(resp.Body)
			if err != nil {
				WriteLog(err.Error())
				continue
			}
			err = json.Unmarshal(body, &res)
			if err != nil {
				WriteLog(err.Error())
				continue
			}

			for _, v := range Links {
				if !FindInOtherConnection(res.Connections, &v) {
					ParseMetaData(&v)
				}
			}
			Links = res.Connections
		}
		WriteLog("TrafficData closed reading.")
	}()
}
