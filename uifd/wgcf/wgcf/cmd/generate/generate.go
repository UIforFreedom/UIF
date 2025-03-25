package generate

import (
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"log"
	"strconv"

	"github.com/ViRb3/wgcf/cloudflare"
	. "github.com/ViRb3/wgcf/cmd/shared"
	"github.com/ViRb3/wgcf/config"
	"github.com/ViRb3/wgcf/util"
	"github.com/ViRb3/wgcf/wireguard"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var profileFile string
var shortMsg = "Generates a WireGuard profile from the current Cloudflare Warp account"

var Cmd = &cobra.Command{
	Use:   "generate",
	Short: shortMsg,
	Long:  FormatMessage(shortMsg, ``),
	Run: func(cmd *cobra.Command, args []string) {
		if err := GenerateProfile(profileFile); err != nil {
			log.Fatal(util.GetErrorMessage(err))
		}
	},
}

func init() {
	Cmd.PersistentFlags().StringVarP(&profileFile, "profile", "p", "wgcf-profile.conf", "WireGuard profile file")
}

func DecodeClientID(clientID string) ([]int, error) {
	decoded, err := base64.StdEncoding.DecodeString(clientID)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	hexString := hex.EncodeToString(decoded)

	var decValues []string
	for i := 0; i < len(hexString); i += 2 {
		hexByte := hexString[i : i+2]
		decValue, _ := strconv.ParseInt(hexByte, 16, 64)
		decValues = append(decValues, fmt.Sprintf("%d%d%d", decValue/100, (decValue/10)%10, decValue%10))
	}

	reserved := []int{}
	for i := 0; i < len(hexString); i += 2 {
		hexByte := hexString[i : i+2]
		decValue, _ := strconv.ParseInt(hexByte, 16, 64)
		reserved = append(reserved, int(decValue))
	}
	return reserved, nil
}

func GenerateProfile(profileFilePath string) error {
	if !IsConfigValidAccount() {
		return errors.New("no account detected")
	}

	ctx := CreateContext()
	thisDevice, err := cloudflare.GetSourceDevice(ctx)
	if err != nil {
		return err
	}
	_, err = cloudflare.GetSourceBoundDevice(ctx)
	if err != nil {
		return err
	}

	c, err := DecodeClientID(thisDevice.Config.ClientId)
	if err != nil {
		return err
	}
	pd := &wireguard.ProfileData{
		PrivateKey: viper.GetString(config.PrivateKey),
		Address1:   thisDevice.Config.Interface.Addresses.V4,
		Address2:   thisDevice.Config.Interface.Addresses.V6,
		PublicKey:  thisDevice.Config.Peers[0].PublicKey,
		Endpoint:   thisDevice.Config.Peers[0].Endpoint.Host,
		ClientID:   c,
	}

	// profile, err := wireguard.NewProfile(pd)
	// if err != nil {
	// 	return err
	// }
	// if err := profile.Save(profileFilePath); err != nil {
	// 	return err
	// }
	if err := wireguard.SaveJson(profileFilePath, pd); err != nil {
		return err
	}

	// PrintDeviceData(thisDevice, boundDevice)
	// log.Println("Successfully generated WireGuard profile:", profileFile)
	return nil
}
