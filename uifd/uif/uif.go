package uif

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
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
	"github.com/kardianos/service"
	"github.com/pkg/browser"
	"github.com/prometheus-community/pro-bing"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/host"
	"github.com/shirou/gopsutil/v3/mem"
)

var root string
var PrivateKey string
var CoreProcess *exec.Cmd
var IsCoreRunning bool
var CoreWG sync.WaitGroup
var AppStartTime int64
var CoreLog string
var Version string
var logMux sync.Mutex
var closeCoreMux sync.Mutex
var DefaultWebServerPort = "9527"
var DefaultAPIServerPort = "9413"
var CoreAutoRestartTicker *time.Ticker
var Uif_service service.Service
var SystemCPUInfo []cpu.InfoStat
var HostInfo *host.InfoStat
var IsFirstTimeRun = 0

func SetCoreAutoRestartTicker() {
	if CoreAutoRestartTicker != nil {
		CoreAutoRestartTicker.Stop()
		CoreAutoRestartTicker = nil
	}
	config, err := ReadUIFConfigJson()
	if err != nil {
		WriteLog(err.Error())
		return
	}

	var ok bool
	var callbackTime any
	if callbackTime, ok = config["coreAutoRestart"]; !ok {
		WriteLog("can not read restart time.")
		return
	}
	if _, ok = callbackTime.(string); !ok { // check type of coreAutoRestart.
		WriteLog("coreAutoRestart type check failed.")
		return
	}
	t, err := strconv.Atoi(callbackTime.(string))
	if err != nil || t <= 0 {
		if err != nil {
			WriteLog(err.Error())
		}
		return
	}
	CoreAutoRestartTicker = time.NewTicker(time.Duration(t) * time.Hour)
	go func(t *time.Ticker) {
		for range t.C {
			WriteLog("core restarting")
			RunCore()
		}
	}(CoreAutoRestartTicker)
	WriteLog("set auto restart core after: " + callbackTime.(string))
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
	res = strings.ReplaceAll(res, "\r\n", "")
	res = strings.ReplaceAll(res, "\n", "")
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

func SetAutoStartup(enable bool) string {
	res := ReqInfo{Status: 0}
	var err error
	if IsWindows() {
		err = AutoStartup(enable)
	} else if IsMacos() {
		// if enable {
		// 	err = Uif_service.Install()
		// } else {
		// 	err = Uif_service.Uninstall()
		// }
		res.Status = 3
		res.Res = "Macos is not supported yet."
	} else {
		res.Status = 3
		res.Res = "Linux need to use 'systemd'"
	}
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
	WriteLog("Working at: " + root)
	return root
}

func ReadCoreConfig() string {
	_, err := os.Stat(GetCoreConfigPath())
	config := "{}"
	if os.IsNotExist(err) {
		SaveCoreConfig(config)
	}
	file, err := os.Open(GetCoreConfigPath())
	if err != nil {
		ShowMsgBox("请尝试使用管理员运行，或者不要把 UIF 安装在 C 盘等无读写权限的位置。", "运行失败！无法读取配置文件！")
		panic(err)
	}
	defer file.Close()
	content, err := io.ReadAll(file)
	if err == nil && string(content) != "" {
		config = string(content)
	}
	return config
}

func SaveUIFConfig(config string) {
	if config == "" {
		config = "{}"
	}
	os.WriteFile(GetUIFConfigPath(), []byte(config), 0644) // Create new if it is not exist
}

func SaveShareConfig(config string) {
	if config == "" {
		config = "{}"
	}
	os.WriteFile(GetUIFShareConfigPath(), []byte(config), 0644) // Create new if it is not exist
}

func GetAPIPortPath() string {
	return GetWorkSpace() + "/api_port.json"
}

func GetUIFConfigPath() string {
	return GetWorkSpace() + "/uif.json"
}

func GetUIFShareConfigPath() string {
	return GetWorkSpace() + "/share.json"
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

func GetActionPath() string {
	return GetWorkSpace() + "/uif_action"
}

func SaveCoreConfig(config string) error {
	if config == "" {
		config = "{}"
	}
	config = strings.Replace(config, "\"UIFAPIPort\"", GetHttpApiPort(), 1)
	config = strings.Replace(config, "\"UIFAPIPortDirect\"", GetHttpApiPortDirect(), 1)
	return os.WriteFile(GetCoreConfigPath(), []byte(config), 0644) // Create new if it is not exist
}

func ReadUIFConfig() string {
	path := GetUIFConfigPath()
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

func ReadUIFShareConfig() string {
	path := GetUIFShareConfigPath()
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		SaveShareConfig("{}")
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
	res2, ok := res["uif"].(map[string]any)
	if !ok {
		return nil, errors.New("failed to parse uif")
	}
	return res2, nil
}

func IsKeyExists() bool {
	return IsFileExists(GetKeyPath())
}

func IsUseSimplified() bool {
	return IsFileExists(GetWorkSpace() + "/useSimplified")
}

func HasFlutter() bool {
	return IsFileExists(GetWorkSpace() + "/useFlutter")
}

func IsActionExists() bool {
	return IsFileExists(GetActionPath())
}

func GetKey() string {
	if PrivateKey != "" {
		return PrivateKey
	}
	if !IsKeyExists() {
		os.WriteFile(GetKeyPath(), []byte(uuid.New().String()), 0644) // Create one
	}
	PrivateKey = ReadFileOneLine(GetKeyPath())
	return PrivateKey
}

func IsNeedKey() bool {
	return !strings.Contains(GetAPIAddress(), "127.0.0.1:")
}

func UnixChmod() {
	if !IsWindows() {
		cmd := exec.Command("chmod", "-R", "755", GetWorkSpace())
		err := cmd.Run()
		if err != nil {
			WriteLog("Error running chmod command:" + err.Error())
		}
	}
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

type Cert struct {
	Domain string `json:"domain,omitempty"`
	Public string `json:"public,omitempty"`
	Key    string `json:"key,omitempty"`
}

type SystemInfo struct {
	Memory   mem.VirtualMemoryStat `json:"memory,omitempty"`
	CPUInfo  []cpu.InfoStat        `json:"cpu_info,omitempty"`
	HostInfo *host.InfoStat        `json:"host_info,omitempty"`
	CpuUsage []float64             `json:"cpu_usage,omitempty"`
	OS       string                `json:"os,omitempty"`
}

type ConnectInfo struct {
	Ip            string       `json:"ip,omitempty"`
	Path          string       `json:"path,omitempty"`
	Cert          *Cert        `json:"cert"`
	Version       string       `json:"version,omitempty"`
	CoreLog       string       `json:"coreLog,omitempty"`
	StartTime     int64        `json:"startTime,string,omitempty"`
	CoreStatus    int64        `json:"coreStatus"`
	SystemInfo    *SystemInfo  `json:"system_info"`
	CoreVersion   string       `json:"coreVersion,omitempty"`
	IsFirstTime   bool         `json:"isFirstTime"`
	TrafficData   *TrafficData `json:"traffic_data"`
	UseSimplified bool         `json:"useSimplified"`
	OsType        string       `json:"osType"`
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
var Certificate *Cert

func TryFixTunFileExists() {
	if TryOnce {
		return
	}
	TryOnce = true
	WriteLog("Tun file exists. Tring to delete it and run again.")
	RunCore() // rerun core.
}

func GetCert() *Cert {
	if Certificate == nil {
		domain := randString(16) + ".com"
		p, k, _ := GenerateCertificateAndKey(domain)
		Certificate = &Cert{Domain: domain, Public: p, Key: k}
	}
	return Certificate
}

func TryFixDNSLoop() {
	if !IsUseTun() {
		return
	}
	CloseCore()
	WriteLog("Missing network interface, core is closed.")
}

func GetCoreStatus() int64 {
	if CoreProcess == nil {
		return 2 // not event started
	}
	if IsCoreRunning {
		return 0 // running
	}
	return 1 // closed
}

var OSInfo string

func GetSystemInfo() *SystemInfo {
	res := &SystemInfo{}
	if SystemCPUInfo == nil {
		SystemCPUInfo, _ = cpu.Info()
	}
	res.CpuUsage, _ = cpu.Percent(0, false)
	res.CPUInfo = SystemCPUInfo
	if OSInfo == "" {
		OSInfo = runtime.GOOS + "(" + runtime.GOARCH + ") " + GetOSVersion()
	}
	if HostInfo == nil {
		HostInfo, _ = host.Info()
	}
	res.HostInfo = HostInfo
	res.OS = OSInfo
	m, _ := mem.VirtualMemory()
	res.Memory = *m
	return res
}

func GetInfo() string {
	m := ConnectInfo{Path: GetWorkSpace(), Cert: GetCert()}
	if AppStartTime == 0 {
		AppStartTime = time.Now().Unix()
	}

	m.StartTime = AppStartTime
	m.CoreLog = ReadLog()
	m.Version = GetCurrentUIFVersion()
	m.CoreVersion = GetCurrentCoreVersion()
	m.IsFirstTime = IsFirstTime()
	m.Ip = GetOutboundIP()
	m.SystemInfo = GetSystemInfo()
	m.CoreStatus = GetCoreStatus()
	m.TrafficData = &AllTraffic
	m.UseSimplified = IsUseSimplified()
	m.OsType = runtime.GOOS

	res, err := json.Marshal(m)
	if err != nil {
		WriteLog(err.Error())
	}
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
			// TryFixDNSLoop() // maybe fix
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

func OpenBrowser(url string) error {
	return browser.OpenURL(url)
}

func IsOpenBrowser() bool {
	if IsLinux() || HasFlutter() {
		return false
	}
	temp := ReadUIFConfig()
	if temp == "{}" {
		return true
	}
	return strings.Contains(temp, "\"popupWeb\":true") || strings.Contains(temp, "\"popupWeb\": true")
}

func IsUseTun() bool {
	temp := ReadCoreConfig()
	return strings.Contains(temp, `"type": "tun"`)
}

func IsFirstTime() bool {
	if IsFirstTimeRun == 1 {
		return false
	}
	temp := ReadCoreConfig()
	if temp == "{}" {
		return true
	}
	IsFirstTimeRun = 1
	return false
}

func IsNeedAdmin() bool {
	if IsUseTun() {
		WriteLog("Need Admin Root.")
		return true
	}
	return false
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
	err = CoreProcess.Start()
	if err != nil {
		return err
	}

	IsCoreRunning = true
	CoreWG.Add(1)
	go func() {
		defer CoreWG.Done()
		err := CoreProcess.Wait()
		IsCoreRunning = false
		if err != nil {
			WriteLog("core err: " + err.Error())
		} else {
			WriteLog("core closed.")
		}
	}()

	go SaveLog(pipe)
	AppStartTime = time.Now().Unix() // update run time.
	StartClashStatus()
	return nil
}

func GetAppPath() string {
	exe, _ := os.Executable()
	return exe
}

func CloseCore() {
	closeCoreMux.Lock()
	defer closeCoreMux.Unlock()

	if CoreProcess == nil || !IsCoreRunning {
		return
	}
	IsCoreRunning = false

	err := ProcessClose(CoreProcess)
	if err != nil {
		WriteLog(err.Error())
		return
	}
	WriteLog("signal core to close.")

	CoreWG.Wait()
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
		return false, err
	}
	l.Close()

	l, err = net.Listen("tcp", fmt.Sprintf("127.0.0.1:%s", port))
	if err != nil {
		return false, err
	}
	l.Close()
	return true, nil
}
