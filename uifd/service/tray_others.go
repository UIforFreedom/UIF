//go:build !windows
// +build !windows

package main

func TrayInit() {
	WaitQuitSnignal()
}
