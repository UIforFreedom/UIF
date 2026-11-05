---
sidebar_position: 3
---

# 软路由

支持 OpenWrt、iStoreOS、ImmortalWrt 等软路由系统，只要是 Linux 的都支持。

** 👉️ > 安装 **

跟 [UIF 的 Linux 安装](./linux.md) 是一模一样的。通过连接上 SSH 等方式使用命令行，然后自行选择合适你自己的方式安装即可。我们暂时没有提供 `ipk 包`。

** 👉️ > 运行 **

还是跟 [UIF 的 Linux 安装](./linux.md) 一模一样。你可以使用 procd、systemd、Docker 等控制 UIF 启用或关闭。

** 👉️ > 透明代理 **

安装好后，直接启用 `Tun VPN` 入站就可以实现透明代理！推荐直接使用 docker 安装 UIF，否则你需要额外的操作：

① 检查是否开启了 `路由转发` 并设置好防火墙允许流量进入，通常在 OpenWrt 上已经默认设置好了:

```bash
sysctl -w net.ipv4.ip_forward=1 # 临时开启 IPv4 路由转发（重启设备后失效）
ufw disable # 关闭防火墙，你也可以选择创建指定防火墙规则，放行 UIF 的端口
```

② 还需要确保已安装了 `kmod-tun` 和 `iptable` 依赖，否则内核将无法创建虚拟网卡。

如果想局域网内的设备连上就可以翻墙，建议使用旁路由的方案，连上软路由的设备只需手动修改 IP 和 DNS 即可；参考 [透明代理视频教程](../inbound/tun.md)。
