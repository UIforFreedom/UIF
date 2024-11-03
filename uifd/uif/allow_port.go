package uif

import (
	"errors"
	"fmt"
	"os/exec"
	"strings"
)

func checkLinuxFirewallTool() (string, error) {
	// 检查firewalld是否安装并运行
	cmd := exec.Command("systemctl", "is-active", "firewalld")
	output, err := cmd.CombinedOutput()
	if err == nil && strings.TrimSpace(string(output)) == "active" {
		return "firewalld", nil
	}

	// 检查iptables是否安装
	_, err = exec.LookPath("iptables")
	if err == nil {
		return "iptables", nil
	}

	return "", fmt.Errorf("no supported firewall tool found")
}

// allowPort 使用适当的防火墙工具放行端口
func AllowLinuxPort(port string, network string) error {
	if !IsLinux() {
		return errors.New("linux only")
	}

	tool, err := checkLinuxFirewallTool()
	if err != nil {
		return fmt.Errorf("failed to detect firewall tool: %w", err)
	}

	switch tool {
	case "firewalld":
		// 使用firewalld放行端口
		cmd := exec.Command("sudo", "firewall-cmd", "--permanent", "--add-port="+port+"/"+network)
		if err := cmd.Run(); err != nil {
			return fmt.Errorf("failed to run firewall-cmd command: %w", err)
		}

		// 重新加载firewalld规则
		cmdReload := exec.Command("sudo", "firewall-cmd", "--reload")
		if err := cmdReload.Run(); err != nil {
			return fmt.Errorf("failed to reload firewall rules: %w", err)
		}

	case "iptables":
		// 使用iptables放行端口
		cmd := exec.Command("sudo", "iptables", "-A", "INPUT", "-p", network, "--dport", port, "-j", "ACCEPT")
		if err := cmd.Run(); err != nil {
			return fmt.Errorf("failed to run iptables command: %w", err)
		}

	default:
		return fmt.Errorf("unsupported firewall tool")
	}

	return nil
}

func AllowWindowsPort(port string, network string) error {
	if !IsWindows() {
		return errors.New("windows only")
	}

	network = strings.ToUpper(network)
	script := fmt.Sprintf(`
    New-NetFirewallRule -DisplayName "Allow Port %s" -Direction Inbound -LocalPort %s -Protocol %s -Action Allow
    `, port, port, network)

	cmd := exec.Command("powershell", "-Command", script)
	output, err := cmd.CombinedOutput()
	WriteLog(string(output))
	return err
}

func AllowMacosPort(port string, network string) error {
	if !IsMacos() {
		return errors.New("macos only")
	}

	command := fmt.Sprintf(`echo "pass in proto %s from any to any port %s" | sudo pfctl -a myrules -f -`, network, port)

	// 执行 shell 命令
	cmd := exec.Command("sh", "-c", command)
	output, err := cmd.CombinedOutput()
	fmt.Printf("Output: %s\n", output)
	if err != nil {
		fmt.Printf("Error: %s\n", err)
		return err
	}

	return nil
}

func AllowPort(port string, network string) error {
	var err error
	if IsLinux() {
		err = AllowLinuxPort(port, network)
	} else if IsMacos() {
		err = AllowMacosPort(port, network)
	} else {
		err = AllowWindowsPort(port, network)
	}

	if err == nil {
		WriteLog("open port:" + port)
	} else {
		WriteLog(err.Error())
	}
	return err
}
