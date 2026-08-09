// go:build darwin

package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/driver/desktop"
	"github.com/uif/uifd/uif"
)

var fyenApp fyne.App

func Run() {
	if uif.HasFlutter() {
		StartService()
		return
	} else {
		go StartService()
	}

	fyenApp = app.New()
	if desk, ok := fyenApp.(desktop.App); ok {
		m := fyne.NewMenu("UIF",
			fyne.NewMenuItem("Open Web", func() {
				uif.NormalOpenWeb()
			}))
		desk.SetSystemTrayMenu(m)
	}
	fyenApp.Run()
	CleanAndQuit()
}
