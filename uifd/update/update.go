package main

import (
	"fmt"
	"os"

	"github.com/uif/uifd/uif"
)

func main() {
	archURL := "https://github.com/SagerNet/sing-box/releases/download/"
	version := uif.GetCurrentCoreVersion()
	osType := []string{"windows", "linux", "darwin"}
	arche := []string{"amd64", "arm64"}

	for o := range osType {
		for a := range arche {
			name := "sing-box-" + version + "-" + osType[o] + "-" + arche[a]
			substr := ".tar.gz"
			if osType[o] == "windows" {
				substr = ".zip"
			}
			url := archURL + "v" + version + "/" + name + substr
			downloadPath := uif.GetWorkSpace() + "/" + name + substr
			fmt.Println(url)
			fmt.Println(downloadPath)
			if err := uif.DownloadFile(downloadPath, url); err != nil {
				panic(err)
			}
			decompressPath := uif.GetWorkSpace() + "/cores/" + osType[o] + "/" + arche[a] + "/"
			if err := uif.Decompress(downloadPath, decompressPath); err != nil {
				panic(err)
			}
			if err := os.Rename(decompressPath+name, decompressPath+version); err != nil {
				panic(err)
			}
			os.WriteFile(decompressPath+"tag.txt", []byte(version), 0644) // Create new if it is not exist
			os.Remove(downloadPath)
		}
	}
}
