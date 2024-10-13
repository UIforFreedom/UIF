package uif

import (
	"errors"
	"io"
	"math/rand"
	"net"
	"os"
	"path/filepath"
	"runtime"
	"time"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")

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
