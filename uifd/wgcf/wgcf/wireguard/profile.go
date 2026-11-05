package wireguard

import (
	"bytes"
	"encoding/json"
	"errors"
	"net"
	"os"
	"text/template"
)

var profileTemplate = `[Interface]
PrivateKey = {{ .PrivateKey }}
Address = {{ .Address1 }}/32
Address = {{ .Address2 }}/128
DNS = 1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001
MTU = 1280
[Peer]
PublicKey = {{ .PublicKey }}
AllowedIPs = 0.0.0.0/0
AllowedIPs = ::/0
Endpoint = {{ .Endpoint }}
`

type Profile struct {
	profileString string
}

type ProfileData struct {
	PrivateKey string `json:"PrivateKey"`
	Address1   string `json:"Address1"`
	Address2   string `json:"Address2"`
	PublicKey  string `json:"PublicKey"`
	Endpoint   string `json:"Endpoint"`
	ClientID   []int  `json:"ClientID"`

	EndpointAddress string `json:"EndpointAddress"`
	EndpointPort    string `json:"EndpointPort"`
}

func NewProfile(data *ProfileData) (*Profile, error) {
	profileString, err := generateProfile(data)
	if err != nil {
		return nil, err
	}
	return &Profile{profileString: profileString}, nil
}

func generateProfile(data *ProfileData) (string, error) {
	t, err := template.New("").Parse(profileTemplate)
	if err != nil {
		return "", err
	}
	var result bytes.Buffer
	if err := t.Execute(&result, data); err != nil {
		return "", err
	}
	return result.String(), nil
}

func (p *Profile) Save(profileFile string) error {
	return os.WriteFile(profileFile, []byte(p.profileString), 0600)
}

func SaveJson(profileFilePath string, data *ProfileData) error {
	host, port, err := net.SplitHostPort(data.Endpoint)
	if err != nil {
		return err
	}
	data.EndpointAddress = host
	data.EndpointPort = port

	d, err := json.Marshal(data)
	if err != nil {
		return err
	}
	return os.WriteFile(profileFilePath, []byte(d), 0600)
}

func ProfileExists(profileFilePath string) error {
	_, err := os.Stat(profileFilePath)
	if os.IsNotExist(err) {
		return errors.New("not exists")
	}
	return nil
}

func ReadProfile(profileFilePath string) (*ProfileData, error) {
	err := ProfileExists(profileFilePath)
	if err != nil {
		return nil, err
	}
	data, err := os.ReadFile(profileFilePath)
	if err != nil {
		return nil, err
	}
	res := &ProfileData{}
	err = json.Unmarshal(data, res)
	if err != nil {
		return nil, err
	}
	return res, nil
}
