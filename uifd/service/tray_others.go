//go:build !windows
// +build !windows

package main

import (
	"github.com/uif/uifd/uif"
)

func TrayInit() {
	uif.WaitQuitSnignal()
}

func SetQuicLink() error {
	return nil
}
