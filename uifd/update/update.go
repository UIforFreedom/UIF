package main

import (
	"fmt"
	"os"

	"github.com/uif/uifd/uif"
)

func UpdateSingBoxCore() {
	archURL := "https://github.com/SagerNet/sing-box/releases/download/"
	version := uif.GetCurrentCoreVersion()
	osType := []string{"linux", "windows", "darwin"}
	arche := []string{"arm64", "amd64", "armv7", "mipsle"}

	for o := range osType {
		for a := range arche {
			saveArch := arche[a]
			saveOS := osType[o]
			if saveOS != "linux" && (saveArch == "armv7" || saveArch == "mipsle") {
				continue
			}

			name := "sing-box-" + version + "-" + saveOS + "-" + saveArch
			substr := ".tar.gz"
			if saveOS == "windows" {
				substr = ".zip"
			}
			url := archURL + "v" + version + "/" + name + substr
			downloadPath := uif.GetWorkSpace() + "/" + name + substr
			fmt.Println(url)
			if err, _ := uif.DownloadFile(downloadPath, url); err != nil {
				panic(err)
			}
			if saveArch == "armv7" {
				saveArch = "arm"
			}
			decompressPath := uif.GetWorkSpace() + "/cores/" + saveOS + "/" + saveArch + "/"
			if err := uif.Decompress(downloadPath, decompressPath); err != nil {
				panic(err)
			}
			err := os.Rename(decompressPath+name, decompressPath+version)
			if err != nil {
				fmt.Println(err)
				os.RemoveAll(decompressPath + name)
			}
			os.WriteFile(decompressPath+"tag.txt", []byte(version), 0644) // Create new if it is not exist
			os.Remove(downloadPath)
		}
	}
}

func UpdateFRPCore() {
	archURL := "https://github.com/fatedier/frp/releases/download/"
	version := "0.59.0"
	osType := []string{"linux", "windows", "darwin"}
	arche := []string{"arm64", "amd64", "armv7"}

	for o := range osType {
		for a := range arche {
			saveArch := arche[a]
			saveOS := osType[o]
			if saveArch == "armv7" {
				saveArch = "arm"
			}
			if saveOS != "linux" && saveArch == "arm" {
				continue
			}

			name := "frp_" + version + "_" + saveOS + "_" + saveArch
			substr := ".tar.gz"
			if saveOS == "windows" {
				substr = ".zip"
			}
			url := archURL + "v" + version + "/" + name + substr
			downloadPath := uif.GetWorkSpace() + "/" + name + substr
			fmt.Println(downloadPath)
			if err, _ := uif.DownloadFile(downloadPath, url); err != nil {
				panic(err)
			}
			decompressPath := uif.GetWorkSpace() + "/frp/" + saveOS + "/" + saveArch + "/"
			if err := uif.Decompress(downloadPath, decompressPath); err != nil {
				panic(err)
			}
			err := os.Rename(decompressPath+name, decompressPath+version)
			if err != nil {
				fmt.Println(err)
				os.RemoveAll(decompressPath + name)
			}
			os.WriteFile(decompressPath+"tag.txt", []byte(version), 0644) // Create new if it is not exist
			os.Remove(downloadPath)
		}
	}
}

func UpdateSetup() {
	version := uif.GetNewestUIFVersion()
	archURL := "https://github.com/UIforFreedom/UIF/releases/download/v" + version + "/uif-windows-amd64.zip"
	downloadPath := uif.GetWorkSpace() + "/uif-windows-amd64.zip"
	if err, _ := uif.DownloadFile(downloadPath, archURL); err != nil {
		panic(err)
	}
	if err := uif.Decompress(downloadPath, uif.GetWorkSpace()+"/saved"); err != nil {
		panic(err)
	}
}

func main() {
	uif.ApiPort = 9110
	UpdateSingBoxCore()
	// UpdateSetup()
	// UpdateFRPCore()
}
