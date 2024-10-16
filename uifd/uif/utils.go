package uif

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand"
	"net"
	"os"
	"path/filepath"
	"runtime"
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

// call before core run.
func GetPublicIP() string {
	if MyPublicIP == "" {
		resp, _, err := HTTPGetDirect("https://api.ipify.org?format=json")
		if err != nil {
			MyPublicIP = "0.0.0.0"
		} else {
			if err != nil {
				MyPublicIP = "0.0.0.0"
			} else {
				var res map[string]any
				err := json.Unmarshal([]byte(resp), &res)
				if err != nil {
					MyPublicIP = "0.0.0.0"
				} else {
					MyPublicIP = res["ip"].(string)
				}
			}
		}
	}
	return MyPublicIP
}

// failed on tun mode.
func GetOutboundIP() string {
	if MyIp != nil {
		return MyIp.String()
	}
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		WriteLog(err.Error())
		return "127.0.0.1"
	}
	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)
	MyIp = localAddr.IP
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
