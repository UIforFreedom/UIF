package uif

import (
	"errors"
	"fmt"
	"io"
	"math/rand"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
	"syscall"
	"time"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
var MyPublicIP string
var MyIp net.IP
var isDocker int

func randString(n int) string {
	rand.NewSource(time.Now().UnixNano())
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func GetOSVersion() string {
	switch runtime.GOOS {
	case "windows":
		return os.Getenv("OS")
	case "linux":
		content, err := os.ReadFile("/etc/os-release")
		if err != nil {
			return ""
		}
		return string(content)
	case "darwin":
		content, err := os.ReadFile("/System/Library/CoreServices/SystemVersion.plist")
		if err != nil {
			return ""
		}
		return string(content)
	default:
		return ""
	}
}

func InitPath(filePath string) error {
	dir := filepath.Dir(filePath)

	// Ensure all parent directories exist
	err := os.MkdirAll(dir, os.ModePerm)
	if err != nil {
		return err
	}
	return nil
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

func getLocalIP() (string, error) {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return "", err
	}
	for _, addr := range addrs {
		// 判断地址类型是IP地址，并且是IPv4，排除IPv6和Loopback地址
		if ipNet, ok := addr.(*net.IPNet); ok && !ipNet.IP.IsLoopback() && ipNet.IP.To4() != nil {
			return ipNet.IP.String(), nil
		}
	}
	return "", fmt.Errorf("no local IP address found")
}

func GetOutboundIP() string {
	if MyIp == nil {
		conn, err := net.Dial("udp", "114.114.114.114:53")

		if err == nil {
			defer conn.Close()
			localAddr := conn.LocalAddr().(*net.UDPAddr)
			MyIp = localAddr.IP
		} else {
			WriteLog(err.Error())
			MyIp = net.ParseIP("0.0.0.0")
		}
	}
	return MyIp.String()
}

func IsFileExists(path string) bool {
	_, err := os.Stat(path)
	return !os.IsNotExist(err)
}

func ReadFile(path string) string {
	file, err := os.Open(path)
	if err != nil {
		return ""
	}
	defer file.Close()
	content, err := io.ReadAll(file)
	return string(content)
}

func DeleteFile(path string) error {
	return os.Remove(path)
}

func DownloadFile(filepath string, downloadURL string) (error, int) {
	port := GetHttpApiPort()
	proxyUrl, err := url.Parse("http://127.0.0.1:" + port)
	if err != nil {
		return err, 0
	}

	client := &http.Client{Transport: &http.Transport{Proxy: http.ProxyURL(proxyUrl)}, Timeout: 100 * time.Second}
	req, err := http.NewRequest("GET", downloadURL, nil)
	if err != nil {
		return err, 0
	}

	resp, err := client.Do(req)
	if err != nil {
		return err, 0
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return errors.New("status not ok."), 0
	}

	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return err, 0
	}
	defer out.Close()

	// Write the body to file
	n, err := io.Copy(out, resp.Body)
	return err, int(n)
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

func IsWindows() bool {
	return runtime.GOOS == "windows"
}

func IsLinux() bool {
	return runtime.GOOS == "linux"
}

func IsMacos() bool {
	return runtime.GOOS == "darwin"
}

func NormalOpenWeb() error {
	return OpenBrowser("http://" + GetWebAddress())
}

var shutdownSignal = make(chan os.Signal, 1)

func WaitQuitSnignal() {
	signal.Notify(shutdownSignal, os.Interrupt, syscall.SIGTERM, syscall.SIGINT, syscall.SIGKILL)
	s := <-shutdownSignal
	WriteLog("Recieved signal: " + s.String())
}

func getMacosActiveNetworkService() (string, error) {
	cmd := exec.Command("networksetup", "-listallhardwareports")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("获取网络硬件端口列表失败: %v, 输出: %s", err, output)
	}

	// 使用正则表达式匹配硬件端口和设备
	re := regexp.MustCompile(`Hardware Port: (.+?)\nDevice: (.+?)\n`)
	matches := re.FindAllStringSubmatch(string(output), -1)

	// 查找连接状态为 "Connected" 的设备
	cmdState := exec.Command("networksetup", "-gethardwareports")
	outputState, errState := cmdState.CombinedOutput()
	if errState != nil {
		return "", fmt.Errorf("获取硬件端口连接状态失败:%v,输出:%s", errState, outputState)
	}
	reState := regexp.MustCompile(`Hardware Port: (.+?)\nDevice: (.+?)\nEthernet Address: (.+?)\n` +
		`IP Address: (.+?)\nSubnet Mask: (.+?)\nRouter: (.+?)\n\(.+?\)\n`)

	matchesState := reState.FindAllStringSubmatch(string(outputState), -1)

	for _, match := range matches {
		for _, matchState := range matchesState {
			if match[1] == matchState[1] {
				return match[1], nil
			}
		}

	}

	return "", fmt.Errorf("未找到活跃的网络服务")
}

// clearDNS 清除指定网络服务的 DNS 设置
func clearMacosDNS(networkService string) error {
	cmd := exec.Command("networksetup", "-setdnsservers", networkService, "empty")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("清除 DNS 失败: %v, 输出: %s", err, output)
	}
	return nil
}

// setDNS 为指定网络服务设置 DNS 服务器
func setMacosDNS(networkService string, dnsServers []string) error {
	if len(dnsServers) == 0 {
		return clearMacosDNS(networkService)
	}

	var args []string
	args = append(args, "-setdnsservers", networkService)
	args = append(args, strings.Join(dnsServers, " "))

	cmd := exec.Command("networksetup", args...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("设置 DNS 失败: %v, 输出: %s", err, output)
	}
	return nil
}

func SetOsDNS(isClear bool, ipAddress string) error {
	if ipAddress == "" {
		ipAddress = "8.8.8.8"
	}

	if IsMacos() {
		networkService, err := getMacosActiveNetworkService()
		if err != nil {
			return err
		}
		if isClear {
			err = clearMacosDNS(networkService)
			if err != nil {
				return err
			}
		} else {
			dnsServers := []string{ipAddress}
			err = setMacosDNS(networkService, dnsServers)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
