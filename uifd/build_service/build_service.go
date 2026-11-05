package main

import (
	"os"

	"github.com/uif/uifd/uif"
)

func GetServiceDir() string {
	return uif.GetWorkSpace() + "/service/dist/"
}

func BuildWeb() {
	newPath := uif.GetWorkSpace() + "/webs_dist/"
	if err := os.MkdirAll(newPath, os.ModePerm); err != nil {
		panic(err)
	}
	if err := os.Rename(uif.GetWorkSpace()+"/web_dist/", newPath+uif.GetCurrentUIFVersion()); err != nil {
		panic(err)
	}
	os.WriteFile(uif.GetWorkSpace()+"/webs_dist/tag.txt", []byte(uif.GetCurrentUIFVersion()), 0644) // Create new if it is not exist
}

func main() {
	BuildWeb()

	arch := []string{"amd64_v1", "arm64", "arm_7"}
	osType := []string{"windows", "linux", "darwin"}
	for o := range osType {
		for a := range arch {
			if osType[o] != "linux" && arch[a] == "arm_7" {
				continue
			}
			distPath := GetServiceDir() + ""
			if osType[o] == "windows" {
				distPath += "uif2_"
			} else {
				distPath += "uif1_"
			}
			distPath += osType[o] + "_" + arch[a]
			newPath := uif.GetWorkSpace() + "/uifd_dist/" + osType[o]
			if arch[a] == "amd64_v1" {
				newPath += "/amd64/"
			} else if arch[a] == "arm_7" {
				newPath += "/arm/"
			} else {
				newPath += "/" + arch[a] + "/"
			}
			if err := os.MkdirAll(newPath, os.ModePerm); err != nil {
				panic(err)
			}
			if err := os.Rename(distPath, newPath+uif.GetCurrentUIFVersion()+"/"); err != nil {
				panic(err)
			}
			os.WriteFile(newPath+"tag.txt", []byte(uif.GetCurrentUIFVersion()), 0644) // Create new if it is not exist
		}
	}

}
