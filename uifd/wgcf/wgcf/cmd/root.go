package cmd

import (
	"errors"
	"log"

	"github.com/ViRb3/wgcf/cmd/generate"
	"github.com/ViRb3/wgcf/cmd/register"
	. "github.com/ViRb3/wgcf/cmd/shared"
	"github.com/ViRb3/wgcf/cmd/status"
	"github.com/ViRb3/wgcf/cmd/trace"
	"github.com/ViRb3/wgcf/cmd/update"
	"github.com/ViRb3/wgcf/config"
	"github.com/ViRb3/wgcf/util"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var CfgFile = "wgcf-account.toml"

var RootCmd = &cobra.Command{
	Use:   "wgcf",
	Short: "WireGuard Cloudflare Warp utility",
	Long: FormatMessage("", `
wgcf is a utility for Cloudflare Warp that allows you to create and
manage accounts, assign license keys, and generate WireGuard profiles.
Made by Victor (@ViRb3). Project website: https://github.com/ViRb3/wgcf`),
	Run: func(cmd *cobra.Command, args []string) {
		if err := cmd.Help(); err != nil {
			log.Fatal(util.GetErrorMessage(err))
		}
	},
}

func Execute() error {
	return RootCmd.Execute()
}

func init() {
	cobra.OnInitialize(InitConfig)
	RootCmd.PersistentFlags().StringVar(&CfgFile, "config", "wgcf-account.toml", "Configuration file")
	RootCmd.AddCommand(register.Cmd)
	RootCmd.AddCommand(update.Cmd)
	RootCmd.AddCommand(generate.Cmd)
	RootCmd.AddCommand(status.Cmd)
	RootCmd.AddCommand(trace.Cmd)
}

var unsupportedConfigError viper.UnsupportedConfigError

func InitConfig() {
	initConfigDefaults()
	viper.SetConfigFile(CfgFile)
	viper.SetEnvPrefix("WGCF")
	viper.AutomaticEnv()
	if err := viper.ReadInConfig(); errors.As(err, &unsupportedConfigError) {
		log.Fatal(err)
	} else {
		log.Println("Using config file:", viper.ConfigFileUsed())
	}
}

func initConfigDefaults() {
	viper.SetDefault(config.DeviceId, "")
	viper.SetDefault(config.AccessToken, "")
	viper.SetDefault(config.PrivateKey, "")
	viper.SetDefault(config.LicenseKey, "")
}
