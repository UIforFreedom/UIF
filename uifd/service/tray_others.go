//go:build !windows
// +build !windows

package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/uif/uifd/uif"
)

func TrayInit() {
	WaitQuitSnignal()
}

func SetQuicLink() error {
	// TODO
	return nil
	// 定义 .desktop 文件的内容
	desktopContent := `[Desktop Entry]
Name=sing-box
Exec=appPath %u
Type=Application
NoDisplay=true
MimeType=x-scheme-handler/uif;
`
	appPath := uif.GetWorkSpace() + "/uif.exe"
	desktopContent = strings.ReplaceAll(desktopContent, "appPath", appPath)

	// 获取用户本地的 .desktop 目录路径
	desktopDir := filepath.Join(os.Getenv("HOME"), ".local", "share", "applications")
	err := os.MkdirAll(desktopDir, os.ModePerm)
	if err != nil {
		fmt.Println("Failed to create desktop directory:", err)
		return err
	}

	// 定义 .desktop 文件的路径
	desktopFilePath := filepath.Join(desktopDir, "uif.desktop")

	// 创建并写入 .desktop 文件
	file, err := os.Create(desktopFilePath)
	if err != nil {
		fmt.Println("Failed to create .desktop file:", err)
		return err
	}
	defer file.Close()

	_, err = file.WriteString(desktopContent)
	if err != nil {
		fmt.Println("Failed to write to .desktop file:", err)
		return err
	}

	fmt.Println(".desktop file created successfully at:", desktopFilePath)

	// 更新 MIME 数据库
	err = exec.Command("update-desktop-database", desktopDir).Run()
	if err != nil {
		fmt.Println("Failed to update desktop database:", err)
		return err
	}

	fmt.Println("Desktop database updated successfully.")

	// 注册 MIME 类型
	err = exec.Command("xdg-mime", "default", "uif.desktop", "x-scheme-handler/uif").Run()
	if err != nil {
		fmt.Println("Failed to register MIME type:", err)
		return err
	}

	fmt.Println("MIME type registered successfully.")
	return nil
}
