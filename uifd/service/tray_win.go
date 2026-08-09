//go:build windows
// +build windows

package main

import (
	"fmt"
	"syscall"

	"github.com/getlantern/systray"
	"github.com/uif/uifd/icon"
	"github.com/uif/uifd/uif"
	"golang.org/x/sys/windows/registry"
)

func SetProcessDPIAware() error {
	var (
		moduser32              = syscall.NewLazyDLL("user32.dll")
		procSetProcessDPIAware = moduser32.NewProc("SetProcessDPIAware")
	)
	status, r, err := procSetProcessDPIAware.Call()
	if status == 0 {
		return fmt.Errorf("SetProcessDPIAware failed %d: %v %v", status, r, err)
	}
	return nil
}

func TrayInit() {
	SetProcessDPIAware()
	systray.Run(onReady, onExit)
}

var SystrayCore *systray.MenuItem
var coreOp *systray.MenuItem

func UpdateSysTrayCore() {
	if uif.GetCoreStatus() == 0 {
		SystrayCore.Check()
		SystrayCore.SetTitle("内核运行中")
		coreOp.SetTitle("关闭内核")
	} else {
		SystrayCore.Uncheck()
		SystrayCore.SetTitle("内核未运行")
		coreOp.SetTitle("运行内核")
	}
}

func onReady() {
	systray.SetTemplateIcon(icon.Data, icon.Data)
	systray.SetTitle("UIF")
	systray.SetTooltip("ui4freedom")

	// We can manipulate the systray in other goroutines
	go func() {
		systray.SetTemplateIcon(icon.Data, icon.Data)
		systray.SetTitle("UIF")
		systray.SetTooltip("UI for freedom")

		SystrayCore = systray.AddMenuItemCheckbox("-", "Core Status", false)
		SystrayCore.Disable()

		coreOp = systray.AddMenuItem("关闭内核", "Close Core")
		systray.AddSeparator()

		mUrl := systray.AddMenuItem("打开面板", "Open my home")

		systray.AddSeparator()
		mQuit := systray.AddMenuItem("退出 UIF", "Quit the whole app")

		for {
			UpdateSysTrayCore()
			select {
			case <-SystrayCore.ClickedCh:
				if SystrayCore.Checked() {
					SystrayCore.Uncheck()
					SystrayCore.SetTitle("内核未运行")
				} else {
					SystrayCore.Check()
					SystrayCore.SetTitle("内核运行中")
				}
			case <-mQuit.ClickedCh:
				uif.CloseCore()
				systray.Quit()
			case <-coreOp.ClickedCh:
				if uif.GetCoreStatus() == 0 {
					uif.CloseCore()
				} else {
					uif.RunCore()
				}
			case <-mUrl.ClickedCh:
				uif.NormalOpenWeb()
			}
		}
	}()
}

func onExit() {
	CleanAndQuit()
}

func setQuicLink(k registry.Key, regPath string, protocol string, appPath string) error {
	// 打开 HKEY_CLASSES_ROOT 注册表键
	key, _, err := registry.CreateKey(k, regPath+protocol, registry.SET_VALUE)
	if err != nil {
		return err
	}
	defer key.Close()

	// 设置协议显示名称
	if err := key.SetStringValue("", "UIF"); err != nil {
		return err
	}

	// 设置 URL Protocol 值
	if err := key.SetStringValue("URL Protocol", ""); err != nil {
		return err
	}

	// 创建 command 键
	commandKey, _, err := registry.CreateKey(k, regPath+protocol+`\shell\open\command`, registry.SET_VALUE)
	if err != nil {
		return err
	}
	defer commandKey.Close()

	// 设置 command 键的默认值
	commandValue := fmt.Sprintf(`"%s" "%%1"`, appPath)
	if err := commandKey.SetStringValue("", commandValue); err != nil {
		return err
	}

	fmt.Println("Custom protocol registered successfully.")
	return nil
}

func SetQuicLink() error {
	protocol := []string{
		"sing-box",
		"clash",
	}
	appPath := uif.GetWorkSpace() + "/uif.exe"

	for _, v := range protocol {
		setQuicLink(registry.CLASSES_ROOT, "", v, appPath)
		setQuicLink(registry.LOCAL_MACHINE, `SOFTWARE\Classes\`, v, appPath)
		setQuicLink(registry.CURRENT_USER, `SOFTWARE\Classes\`, v, appPath)
	}
	return nil
}
