//go:build !windows
// +build !windows

package uif

import (
	"errors"
	"fmt"
	"os/exec"
	"os/user"
	"syscall"
)

func ProcessSet(p *exec.Cmd) {
}

func AutoStartUp() {
}

func IsAdmin() bool {
	return true
}

func SetAdmin() error {
	return nil
}

func ProcessClose(p *exec.Cmd) error {
	return p.Process.Signal(syscall.SIGINT)
}

const macListFile = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>UIforFreedom.uif</string>
	<key>ProgramArguments</key>
        <array>
        	<string>/Applications/uif.app/Contents/MacOS/uif</string>
        </array>
	<key>RunAtLoad</key>
	<true/>
	<key>WorkingDirectory</key>
	<string>/Applications/uif.app/Contents/MacOS</string>
	<key>StandardErrorPath</key>
	<string>/tmp/uif.err</string>
	<key>StandardOutPath</key>
	<string>/tmp/uif.out</string>
</dict>
</plist>
`

func AutoStartup(enable bool) error {
	if !IsMacos() {
		return errors.New("Linux use systemd.")
	}
	return errors.New("Macos use systemd.")
	current, err := user.Current()
	if err != nil {
		return err
	}
	path := fmt.Sprintf("%s/Library/LaunchAgents/uif.plist", current.HomeDir)
	return WriteOrRemove(enable, path, macListFile)
}

func ShowMsgBox(content string, title string) {
}

func ListenOSQuit() error {
	return nil
}
