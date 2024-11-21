package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/uif/uifd/uif"
)

var process *exec.Cmd

func GetServicePath() string {
	res := uif.GetWorkSpace() + "/uifd/" + uif.GetCurrentUIFVersion() + "/uif_service"
	if uif.IsWindows() {
		res += ".exe"
	}
	return res
}

func StartService() {
	servicePath := GetServicePath()
	fmt.Println(servicePath)

	if !uif.IsWindows() {
		exec.Command("chmod", "-R", "755", uif.GetWorkSpace()).Run()
	}

	// 创建命令
	process := exec.Command(servicePath)

	// 将子程序的输入输出重定向到父进程
	process.Stdin = os.Stdin
	process.Stdout = os.Stdout
	process.Stderr = os.Stderr

	// 启动并等待子进程完成
	err := process.Start()
	if err != nil {
		fmt.Println("Error starting process:", err)
		return
	}

	err = process.Wait()
	if err != nil {
		fmt.Println("Process exited with error:", err)
	}
}

func parseURL() {
	if len(os.Args) < 2 {
		return
	}
	rawURL := os.Args[1]
	uif.WriteOrRemove(true, uif.GetActionPath(), rawURL)
}

func main() {
	parseURL()
	StartService()
}
