package uif

import (
	"encoding/json"
	"errors"

	"github.com/ViRb3/wgcf/cmd"
	"github.com/ViRb3/wgcf/cmd/generate"
	"github.com/ViRb3/wgcf/cmd/register"
	"github.com/ViRb3/wgcf/cmd/shared"
	"github.com/ViRb3/wgcf/wireguard"
)

var WGProfilePath string
var WarpAccount string

func BuildWgcf() (*wireguard.ProfileData, error) {
	WGProfilePath = GetWorkSpace() + "/wgcf/profile.json"
	WarpAccount = GetWorkSpace() + "/wgcf/account.toml"
	InitPath(WGProfilePath)
	InitPath(WarpAccount)

	cmd.CfgFile = WarpAccount
	cmd.InitConfig()

	if !shared.IsConfigValidAccount() {
		err := register.RegisterAccount()
		if err != nil {
			return nil, err
		}
		if !shared.IsConfigValidAccount() {
			return nil, errors.New("Failed to new account")
		}
	}

	err := generate.GenerateProfile(WGProfilePath)
	if err != nil {
		return nil, err
	}
	return wireguard.ReadProfile(WGProfilePath)
}

type WgcfRes struct {
	Status int                    `json:"status"`
	Res    *wireguard.ProfileData `json:"res"`
	Msg    string                 `json:"msg"`
}

func BuildWgcfRes() string {
	var err error
	res := &WgcfRes{}

	d, err := BuildWgcf()
	if err != nil {
		res.Status = 1
		res.Msg = err.Error()
	} else {
		res.Res = d
	}
	b, _ := json.Marshal(res)
	return string(b)
}
