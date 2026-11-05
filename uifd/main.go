package main

import (
	"fmt"
	"os"
	"os/exec"
	"syscall"

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
	if uif.IsWindows() {
		process = exec.Command(servicePath)
	} else if uif.IsMacos() && uif.IsNeedAdmin() {
		process = exec.Command("sudo", servicePath)
	} else {
		process = exec.Command(servicePath)
	}

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
	CleanAndQuit()
}

func parseURL() {
	if len(os.Args) < 2 {
		return
	}
	rawURL := os.Args[1]
	uif.WriteOrRemove(true, uif.GetActionPath(), rawURL)
}

func CleanAndQuit() {
	if process != nil && !uif.IsWindows() {
		if process.Process != nil {
			uif.WriteLog("try to kill service.")
			err := process.Process.Signal(syscall.SIGTERM)
			if err != nil {
				uif.WriteLog("Failed to kill service process: " + err.Error())
			} else {
				process.Wait() // 确保子进程已退出
			}
		}
	}
	uif.WriteLog("UIF bootloader exited.")
	os.Exit(0)
}

func main() {
	parseURL()
	Run()
}
