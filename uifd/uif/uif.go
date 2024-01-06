package uif

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/jackpal/gateway"
	"github.com/prometheus-community/pro-bing"
)

var root string
var PrivateKey string
var CoreProcess *exec.Cmd
var started = false // run app onece
var AppStartTime int64
var CoreLog string
var Version string
var ApiPort = 0
var MyIp net.IP
var logMux sync.Mutex
var DefaultWebServerPort = "9527"
var DefaultAPIServerPort = "9413"
var CoreAutoRestartTicker *time.Ticker

func Log(msg string) {
	fmt.Println(msg)
}

func SetCoreAutoRestartTicker() {
	if CoreAutoRestartTicker != nil {
		CoreAutoRestartTicker.Stop()
		CoreAutoRestartTicker = nil
	}
	config, err := ReadUIFConfigJson()
	if err != nil {
		return
	}

	var ok bool
	var callbackTime any
	if callbackTime, ok = config["coreAutoRestart"]; !ok {
		return
	}
	if _, ok = callbackTime.(string); !ok { // check type of coreAutoRestart.
		return
	}
	t, err := strconv.Atoi(callbackTime.(string))
	if err != nil || t <= 0 {
		return
	}
	CoreAutoRestartTicker = time.NewTicker(time.Duration(t) * time.Hour)
	go func(t *time.Ticker) {
		for range t.C {
			RunCore()
		}
	}(CoreAutoRestartTicker)
	WriteLog("set auto restart core after: " + callbackTime.(string))
}

func GetProxyHTTPUA() string {
	return "uif/sing-box/" + GetCurrentUIFVersion() + " (Prefer ClashMeta Format)"
}

func ProxyHTTP(dst string) (string, error) {
	proxyUrl, err := url.Parse("http://127.0.0.1:" + GetHttpApiPort())
	client := &http.Client{Transport: &http.Transport{Proxy: http.ProxyURL(proxyUrl)}}

	req, err := http.NewRequest("GET", dst, nil)
	if err != nil {
		return "", err
	}

	req.Header.Set("User-Agent", GetProxyHTTPUA())

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	return string(body), nil
}

// require sing-box is running.
func ProxyGet(dst string) string {
	res := ReqInfo{Status: 0}
	if dst == "" {
		res.Status = 2
		res.Res = "dst can not be empty."
	} else {
		var err error
		res.Res, err = ProxyHTTP(dst)
		if err != nil {
			res.Status = 1
			res.Res = err.Error()
		}
	}
	temp, _ := json.Marshal(res)
	return string(temp)
}

func GetNewestCoreVersion() string {
	res, _ := ProxyHTTP("https://raw.githubusercontent.com/UIforFreedom/UIF/master/uifd/version/core.txt")
	res = strings.Split(res, "\n")[0]
	return res
}

func GetNewestUIFVersion() string {
	res, _ := ProxyHTTP("https://raw.githubusercontent.com/UIforFreedom/UIF/master/uifd/version/uif.txt")
	res = strings.Split(res, "\n")[0]
	return res
}

func ReadFileOneLine(path string) string {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		// panic(errors.New("file not exists. " + path))
		return ""
	}
	file, err := os.Open(path)
	if err != nil {
		// panic(err)
		return ""
	}
	defer file.Close()
	content, err := io.ReadAll(file)
	res := string(content)
	res = strings.Split(res, "\n")[0]
	return res
}

var currentUIFVersion string
var currentCoreVersion string

func GetCurrentUIFVersion() string {
	if currentUIFVersion == "" {
		currentUIFVersion = ReadFileOneLine(GetWorkSpace() + "/version/uif.txt")
	}
	return currentUIFVersion
}

func GetCurrentCoreVersion() string {
	if currentCoreVersion == "" {
		currentCoreVersion = ReadFileOneLine(GetWorkSpace() + "/version/core.txt")
	}
	return currentCoreVersion
}

func UpdateUIFVersion(version string) {
	currentUIFVersion = version
	os.WriteFile(GetWorkSpace()+"/version/uif.txt", []byte(version), 0644)
}

func UpdateCoreVersion(version string) {
	currentCoreVersion = version
	os.WriteFile(GetWorkSpace()+"/version/core.txt", []byte(version), 0644)
}

func SetAutoStartup(enable bool) string {
	res := ReqInfo{Status: 0}
	err := AutoStartup(enable)
	if err != nil {
		res.Status = 2
		res.Res = err.Error()
	}
	temp, _ := json.Marshal(res)
	return string(temp)
}

func IsService() bool {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	fileName := filepath.Base(ex)
	return strings.Contains(fileName, "service") && !strings.Contains(fileName, "build")
}

func IsUpdate() bool {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	fileName := filepath.Base(ex)
	return strings.Contains(fileName, "update")
}

func GetWorkSpace() string {
	if root != "" {
		return root
	}
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	root = filepath.Dir(ex)
	if IsService() {
		root = filepath.Dir(root)
		root = filepath.Dir(root)
	}
	Log("Working at: " + root)
	return root
}

func ReadCoreConfig() string {
	_, err := os.Stat(GetCoreConfigPath())
	if os.IsNotExist(err) {
		os.WriteFile(GetUIFConfigPath(), []byte("{}"), 0644) // Create one
	}
	file, err := os.Open(GetCoreConfigPath())
	if err != nil {
		panic(err)
	}
	defer file.Close()
	content, err := io.ReadAll(file)
	config := string(content)
	if config == "" {
		config = "{}"
	}
	return config
}

func SaveUIFConfig(config string) {
	if config == "" {
		config = "{}"
	}
	os.WriteFile(GetUIFConfigPath(), []byte(config), 0644) // Create new if it is not exist
}

func GetAPIPortPath() string {
	return GetWorkSpace() + "/api_port.json"
}

func SaveUsingPort() {
	os.WriteFile(GetAPIPortPath(), []byte(GetHttpApiPort()), 0644) // Create new if it is not exist
}

func ReadLastUsedPort() string { // read saving port
	_, err := os.Stat(GetAPIPortPath())
	if os.IsNotExist(err) {
		SaveUsingPort() // new one
	}
	file, err := os.Open(GetAPIPortPath())
	if err != nil {
		panic(err)
	}
	defer file.Close()
	content, err := io.ReadAll(file)
	apiPort := string(content)
	apiPort = strings.Split(apiPort, "\n")[0]
	return apiPort
}

func GetUIFConfigPath() string {
	return GetWorkSpace() + "/uif.json"
}

func GetCoreConfigPath() string {
	return GetWorkSpace() + "/core_config.json"
}

func GetCorePath() string {
	var path string
	path = GetWorkSpace() + "/cores/" + GetCurrentCoreVersion() + "/sing-box"
	if IsWindows() {
		path += ".exe"
	}
	return path
}

func GetWebPath() string {
	return GetWorkSpace() + "/webs/" + GetCurrentUIFVersion() + "/"
}

func GetKeyPath() string {
	return GetWorkSpace() + "/uif_key.txt"
}

func GetOutboundIP() string {
	return "127.0.0.1"
	if MyIp != nil {
		return MyIp.String()
	}
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
		return "127.0.0.1"
	}
	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)
	MyIp = localAddr.IP
	return MyIp.String()
}

func SaveCoreConfig(config string) {
	if config == "" {
		config = "{}"
	}
	config = strings.Replace(config, "\"UIFAPIPort\"", GetHttpApiPort(), 1)
	os.WriteFile(GetCoreConfigPath(), []byte(config), 0644) // Create new if it is not exist
}

func ReadUIFConfig() string {
	path := GetWorkSpace() + "/uif.json"
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		SaveUIFConfig("{}")
	}
	file, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	content, err := io.ReadAll(file)
	return string(content)
}

func ReadUIFConfigJson() (map[string]any, error) {
	var res map[string]any
	temp := ReadUIFConfig()
	err := json.Unmarshal([]byte(temp), &res)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func IsKeyExists() bool {
	path := GetWorkSpace() + "/uif_key.txt"
	_, err := os.Stat(path)
	return !os.IsNotExist(err)
}

func GetKey() string {
	if PrivateKey != "" {
		return PrivateKey
	}
	if !IsKeyExists() {
		os.WriteFile(GetKeyPath(), []byte(uuid.New().String()), 0644) // Create one
	}
	PrivateKey = ReadFileOneLine(GetKeyPath())
	Log("Private Key: " + PrivateKey)
	return PrivateKey
}

func IsNeedKey() bool {
	return !strings.Contains(GetAPIAddress(), "127.0.0.1:")
}

func GetAddressPort(address string) (string, error) {
	_, port, err := net.SplitHostPort(address)
	if err != nil {
		return "", err
	}
	if port == "" {
		return "", errors.New("port can not be empty.")
	}
	return port, nil
}

func GetAPIAddressPort() (string, error) {
	return GetAddressPort(GetAPIAddress())
}

func GetWebAddressPort() (string, error) {
	return GetAddressPort(GetWebAddress())

}

var apiAddressCache = ""
var webAddressCache = ""

func GetAPIAddress() string {
	path := GetWorkSpace() + "/uif_api_address.txt"
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return "127.0.0.1:" + DefaultAPIServerPort
	}
	if apiAddressCache == "" {
		apiAddressCache = ReadFileOneLine(path)
	}
	return apiAddressCache
}

func GetWebAddress() string {
	path := GetWorkSpace() + "/uif_web_address.txt"
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return "127.0.0.1:" + DefaultWebServerPort
	}
	if webAddressCache == "" {
		webAddressCache = ReadFileOneLine(path)
	}
	return webAddressCache
}

type ConnectInfo struct {
	Path        string `json:"path,omitempty"`
	Version     string `json:"version,omitempty"`
	CoreLog     string `json:"coreLog,omitempty"`
	Ip          string `json:"ip,omitempty"`
	StartTime   int64  `json:"startTime,string,omitempty"`
	CoreVersion string `json:"coreVersion,omitempty"`
	IsFirstTime bool   `json:"isFirstTime"`
}

type ReqInfo struct {
	Status int    `json:"status"`
	Res    string `json:"res,omitempty"`
}
type UpdateInfo struct {
	CurrentCoreVersion string `json:"coreVersion"`
	NewCoreVersion     string `json:"newcoreVersion"`
	CurrentUIFVersion  string `json:"uifVersion"`
	NewUIFVersion      string `json:"newuifVersion"`
}

var TryOnce bool

func TryFixTunFileExists() {
	if TryOnce {
		return
	}
	TryOnce = true
	WriteLog("Tun file exists. Tring to delete it and run again.")
	RunCore() // rerun core.
}

func TryFixDNSLoop() {
	if !IsUseTun() {
		return
	}
	CloseCore()
	WriteLog("Missing network interface, core is closed.")
}

func GetInfo() string {
	m := ConnectInfo{Path: GetWorkSpace()}
	if AppStartTime == 0 {
		AppStartTime = time.Now().Unix()
	}
	m.StartTime = AppStartTime
	m.CoreLog = ReadLog()
	m.Version = GetCurrentUIFVersion()
	m.CoreVersion = GetCurrentCoreVersion()
	m.IsFirstTime = IsFirstTime()
	// m.Ip = GetOutboundIP()
	ip := GetDefaultInterface()
	if ip != nil {
		m.Ip = ip.String()
	} else {
		m.Ip = "127.0.0.1"
	}
	res, _ := json.Marshal(m)
	return string(res)
}

func SaveLog(pipe io.ReadCloser) {
	reader := bufio.NewReader(pipe)
	for true {
		line, err := reader.ReadString('\n')
		if err != nil {
			return
		}
		if len(CoreLog) > 100000 {
			CoreLog = ""
		}
		WriteLog(line)
		if strings.Contains(line, "configure tun interface: Cannot create a file when that file already exists") {
			TryFixTunFileExists()
		} else if strings.Contains(line, "missing default interface") {
			TryFixDNSLoop()
		}
	}
}

func WriteLog(line string) {
	fmt.Println(line)
	logMux.Lock()
	CoreLog += line + "\n"
	logMux.Unlock()
}

func ReadLog() string {
	logMux.Lock()
	defer logMux.Unlock()
	return CoreLog
}

func IsWindows() bool {
	if runtime.GOOS == "windows" {
		return true
	}
	return false
}

func IsLinux() bool {
	if runtime.GOOS == "linux" {
		return true
	}
	return false
}

func IsMacos() bool {
	if runtime.GOOS == "darwin" {
		return true
	}
	return false
}

func OpenBrowser(url string) error {
	var err error

	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	if err != nil {
		log.Fatal(err)
	}
	return err
}

func IsOpenBrowser() bool {
	if IsLinux() {
		return false
	}
	temp := ReadUIFConfig()
	if temp == "{}" {
		return true
	}
	return strings.Contains(temp, "\"popupWeb\":true") || strings.Contains(temp, "\"popupWeb\": true")
}

func IsUseTun() bool {
	temp := ReadUIFConfig()
	return strings.Contains(temp, "tun")
}

func IsFirstTime() bool {
	_, err := os.Stat(GetCoreConfigPath())
	return os.IsNotExist(err)
}

func IsAutoUpdateUIF() bool {
	temp := ReadUIFConfig()
	return strings.Contains(temp, "\"autoUpdateUIF\":true") || strings.Contains(temp, "\"autoUpdateUIF\": true")
}

func IsNeedAdmin() bool {
	return IsUseTun()
}

func RunCore() error {
	CloseCore()

	CoreProcess = exec.Command(GetCorePath(), "run", "-c", GetCoreConfigPath())
	CoreProcess.Dir = GetWorkSpace()
	ProcessSet(CoreProcess)

	pipe, err := CoreProcess.StderrPipe()
	if err != nil {
		return err
	}
	go SaveLog(pipe)

	err = CoreProcess.Start()
	if err != nil {
		return err
	}
	started = true
	AppStartTime = time.Now().Unix() // update run time.
	return nil
}

func GetAppPath() string {
	exe, _ := os.Executable()
	return exe
}

func CloseCore() {
	if !started {
		return
	}

	if CoreProcess.ProcessState.ExitCode() != -1 {
		return
	}

	err := ProcessClose(CoreProcess)
	if err != nil {
		log.Println(err)
		return
	}

	err = CoreProcess.Wait()
	if err != nil {
		log.Println(err)
	}

	log.Println("core closed.")
}

func GetHttpApiPort() (port string) {
	return "14454"
	if ApiPort == 0 {
		var err error
		ApiPort, err = GetUnusedPort()
		if err != nil {
			panic(err)
		}
		SaveUsingPort()
	}
	return strconv.Itoa(ApiPort)
}

func GetUnusedPort() (port int, err error) {
	var a *net.TCPAddr
	if a, err = net.ResolveTCPAddr("tcp", "localhost:0"); err == nil {
		var l *net.TCPListener
		if l, err = net.ListenTCP("tcp", a); err == nil {
			defer l.Close()
			return l.Addr().(*net.TCPAddr).Port, nil
		}
	}
	return 0, errors.New("failed to alloc.")
}

var DefaultInterface *net.IPAddr

func GetDefaultInterface() *net.IPAddr {
	if DefaultInterface == nil {
		ip, err := gateway.DiscoverInterface()
		if err != nil {
			return nil
		}
		DefaultInterface = &net.IPAddr{IP: ip}
	}
	return DefaultInterface
}

func Ping(addr string) string {
	if addr == "" {
		return ""
	}
	res := ReqInfo{Status: 0}
	pinger, err := probing.NewPinger(addr)
	pinger.SetPrivileged(true)
	pinger.Timeout = 3 * time.Second
	if err != nil {
		res.Status = 1
		res.Res = err.Error()
	} else {
		pinger.Count = 1
		err = pinger.Run() // Blocks until finished.
		if err != nil {
			res.Status = 2
			res.Res = err.Error()
		} else {
			stats := pinger.Statistics() // get send/receive/duplicate/rtt stats
			rtt := strconv.FormatInt(stats.AvgRtt.Milliseconds(), 10)
			res.Res = rtt
		}
	}
	temp, _ := json.Marshal(res)
	return string(temp)
}

func WriteOrRemove(isWrite bool, path, content string) error {
	var err error
	if isWrite {
		stat, _ := os.Stat(path)
		if stat == nil {
			err = os.WriteFile(path, []byte(content), 0644)
		}
	} else {
		err = os.Remove(path)
	}
	return err
}

func CheckNetwork() bool {
	return false
}

func GetUIFPath() string {
	path := GetWorkSpace() + "/uif"
	if IsWindows() {
		path += ".exe"
	}
	return path
}

// check local port in used.
func TCPPortCheck(port string) (bool, error) {
	l, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		return false, nil
	}

	defer l.Close()
	return true, nil
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

func CheckUpdate() bool {
	if CheckUIFIsNeedUpdate() == "" && CheckCoreIsNeedUpdate() == "" {
		return false
	}
	return true
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
	nstring := GetNewestCoreVersion()
	newest := ParseVersion(nstring)
	current := ParseVersion(GetCurrentCoreVersion())
	if newest > current || nstring == "" {
		return nstring
	}
	return ""
}

func CheckUIFIsNeedUpdate() string {
	nstring := GetNewestUIFVersion()
	newest := ParseVersion(nstring)
	current := ParseVersion(GetCurrentUIFVersion())
	if newest > current || nstring == "" {
		return nstring
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
	fmt.Println(url)

	zipSavePath := GetWorkSpace() + "/cache/" + newestVersion + "/"
	if err := os.MkdirAll(zipSavePath, os.ModePerm); err != nil {
		return err
	}
	zipSavePath += name + substr

	if err := DownloadFile(zipSavePath, url); err != nil {
		return err
	}

	unzipDir := GetWorkSpace() + "/cache/" + newestVersion + "/unzip/"
	if err := Decompress(zipSavePath, unzipDir); err != nil {
		return err
	}
	if err := CoverUpdate(unzipDir + name); err != nil {
		return err
	}
	os.RemoveAll(GetWorkSpace() + "/cache/")
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
		res.Res = "no new version"
	}
	temp, _ := json.Marshal(res)
	resString := string(temp)
	WriteLog(resString)
	return resString
}

func DownloadFile(filepath string, downloadURL string) error {
	port := GetHttpApiPort()
	_, err := TCPPortCheck(port)
	if err != nil {
		return err
	}
	proxyUrl, err := url.Parse("http://127.0.0.1:" + port)
	if err != nil {
		return err
	}
	http.DefaultTransport = &http.Transport{Proxy: http.ProxyURL(proxyUrl)}
	resp, err := http.Get(downloadURL)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	// Write the body to file
	_, err = io.Copy(out, resp.Body)
	return err
}
