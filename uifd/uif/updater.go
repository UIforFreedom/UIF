package uif

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
)

func Update() string {
	res := ReqInfo{Status: 0}
	isNeedUpdate := CheckUpdate()
	if isNeedUpdate {
		if err := DownloadNewestUIF(); err != nil {
			res.Status = 2
			res.Res = err.Error()
		}
	} else {
		res.Status = 1
		res.Res = "No New Version To Update."
		CleanOldData()
	}
	temp, _ := json.Marshal(res)
	resString := string(temp)
	WriteLog(resString)
	return resString
}

func CleanOldData() {
	DeleteVersionDir(GetCurrentUIFVersion(), GetWorkSpace()+"/uifd/")
	DeleteVersionDir(GetCurrentUIFVersion(), GetWorkSpace()+"/webs/")

	DeleteVersionDir(GetCurrentCoreVersion(), GetWorkSpace()+"/cores/")
}

func DeleteVersionDir(usingVersion string, rootPath string) error {
	if usingVersion == "" {
		return fmt.Errorf("empty version")
	}
	files, err := os.ReadDir(rootPath)
	if err != nil {
		return err // Return error if reading directory fails
	}

	for _, file := range files {
		if file.IsDir() && usingVersion != file.Name() {
			dirPath := filepath.Join(rootPath, file.Name())
			if err := os.RemoveAll(dirPath); err != nil {
				return fmt.Errorf("failed to delete directory %s: %w", dirPath, err)
			}
			WriteLog(dirPath)
		}
	}
	return nil // No errors encountered
}

func CheckUpdate() bool {
	if CheckUIFIsNeedUpdate() == "" && CheckCoreIsNeedUpdate() == "" {
		return false
	}
	return true
}

func CheckUIFIsNeedUpdate() string {
	newestUIFVersion := GetNewestUIFVersion()
	if newestUIFVersion == "" {
		WriteLog("Failed To Check Newest UIF Version.")
		return ""
	}
	WriteLog("Current Using UIF Version: " + GetCurrentUIFVersion())
	WriteLog("Newest UIF Version: " + newestUIFVersion)
	newest := ParseVersion(newestUIFVersion)
	current := ParseVersion(GetCurrentUIFVersion())
	if newest > current {
		return newestUIFVersion
	}
	return ""
}

func DownloadNewestUIF() error {
	url := "https://github.com/UIforFreedom/UIF/releases/download/"
	newestVersion := GetNewestUIFVersion()
	url += "v" + newestVersion + "/"
	name := "uif-"
	if IsWindows() {
		name += "windows-"
	} else if IsLinux() {
		name += "linux-"
	} else {
		name += "darwin-"
	}
	name += runtime.GOARCH
	substr := ".tar.gz"
	if IsWindows() {
		substr = ".zip"
	}
	url += name + substr
	WriteLog(url)

	zipSavePath := GetWorkSpace() + "/cache/" + newestVersion + "/"
	if err := os.MkdirAll(zipSavePath, os.ModePerm); err != nil {
		return err
	}
	defer os.RemoveAll(GetWorkSpace() + "/cache/")

	zipSavePath += name + substr
	err, _ := DownloadFile(zipSavePath, url)
	if err != nil {
		return err
	}

	unzipDir := GetWorkSpace() + "/cache/" + newestVersion + "/unzip/"
	if err := Decompress(zipSavePath, unzipDir); err != nil {
		return err
	}
	if err := CoverUpdate(unzipDir + name); err != nil {
		return err
	}
	return nil
}

func OverrideFile(old string, newpath string) {
	_, err := os.Stat(old)
	if os.IsNotExist(err) {
		os.Rename(newpath, old)
	}
}

func CoverUpdate(unzipDir string) error {
	newUIFVersion := ReadFileOneLine(unzipDir + "/version/uif.txt")
	newCoreVerion := ReadFileOneLine(unzipDir + "/version/core.txt")
	if newUIFVersion == "" || newCoreVerion == "" {
		return errors.New("can not read version.")
	}

	OverrideFile(GetWorkSpace()+"/uifd/"+newUIFVersion, unzipDir+"/uifd/"+newUIFVersion)
	OverrideFile(GetWorkSpace()+"/webs/"+newUIFVersion, unzipDir+"/webs/"+newUIFVersion)
	OverrideFile(GetWorkSpace()+"/cores/"+newCoreVerion, unzipDir+"/cores/"+newCoreVerion)

	UpdateCoreVersion(newCoreVerion)
	UpdateUIFVersion(newUIFVersion)
	return nil
}

func CheckUpdateReq() string {
	res := ReqInfo{Status: 0}

	info := &UpdateInfo{}
	info.CurrentUIFVersion = GetCurrentUIFVersion()
	info.CurrentCoreVersion = GetCurrentCoreVersion()
	info.NewUIFVersion = CheckUIFIsNeedUpdate()
	info.NewCoreVersion = CheckCoreIsNeedUpdate()

	if info.NewCoreVersion != "" && info.NewUIFVersion != "" {
		temp, _ := json.Marshal(info)
		res.Res = string(temp)
	}
	temp, _ := json.Marshal(res)
	return string(temp)
}

func CheckCoreIsNeedUpdate() string {
	newestCoreVersion := GetNewestCoreVersion()
	if newestCoreVersion == "" {
		return ""
	}
	newest := ParseVersion(newestCoreVersion)
	current := ParseVersion(GetCurrentCoreVersion())
	if newest > current {
		return newestCoreVersion
	}
	return ""
}

func ParseVersion(stringVersion string) int {
	versionList := strings.Split(stringVersion, ".")
	if len(versionList) != 3 {
		return 0
	}
	res := 0
	l := 10000
	for v := range versionList {
		vi, _ := strconv.Atoi(versionList[v])
		res += vi * l
		l = l / 100
	}
	return res
}

func IsAutoUpdateUIF() bool {
	temp := ReadUIFConfig()
	return strings.Contains(temp, "\"autoUpdateUIF\":true") || strings.Contains(temp, "\"autoUpdateUIF\": true")
}

func UpdateUIFVersion(version string) {
	// currentUIFVersion = version
	os.WriteFile(GetWorkSpace()+"/version/uif.txt", []byte(version), 0644)
}

func UpdateCoreVersion(version string) {
	// currentCoreVersion = version
	os.WriteFile(GetWorkSpace()+"/version/core.txt", []byte(version), 0644)
}

func GetNewestCoreVersion() string {
	res, _, _ := HTTPGetProxy("https://raw.githubusercontent.com/UIforFreedom/UIF/master/uifd/version/core.txt")
	res = strings.Split(res, "\n")[0]
	return res
}

func GetNewestUIFVersion() string {
	res, _, _ := HTTPGetProxy("https://raw.githubusercontent.com/UIforFreedom/UIF/master/uifd/version/uif.txt")
	res = strings.Split(res, "\n")[0]
	return res
}
