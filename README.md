# UIF

**是一个具有 代理功能 和 订阅管理 的 UI 面板**

[[在线文档]](https://uiforfreedom.github.io/UIF_help/) [[下载地址]](https://github.com/UIforFreedom/UIF/releases)

---

## 支持的协议

- Vmess
- Trojan
- Vless
- Shadowsocks
- Socks
- Http
- Tun（透明代理）
- Tuic
- Hysteria
- Hysteria2
- Wireguard

**打开 https://uiforfreedom.github.io 预览全部功能** （需要下载后端才能正常使用）

## 支持的一键订阅

- Clash
- Clash-Meta
- V2rayN
- Sing-Box

---

## ChangeLog

### 2024-01-05 (v0.3.1)

- 优化 Shadowsocks Plugin 配置识别问题
- 优化一键启用所有订阅
- 修复 strict_route 配置错误
- Tun 增加 MTU 设置
- 更新内核版本到 1.8.0

### 2024-01-01 (v0.3.0)

**元旦快乐**

- 更新内核版本
- 增加 hysteria2 订阅
- 增加 Xray 配置导入

### 2023-12-29 (v0.2.7)

- 优化 wireguard 配置
- 更新内核版本
- 修复初始 Tun 配置错误
- 优化 Tun 配置
- 优化 address 读取

### 2023-12-25 (v0.2.6)

- 修复定时重启 Core 功能

### 2023-12-25 (v0.2.5)

- 修复重复生成 Key 的 Bug

### 2023-12-18 (v0.2.4)

- 修复 Websock 中 Host 默认值的 Bug

### 2023-12-5 (v0.2.3)

- 修复 GRPC 无法配置 Bug
- 修复配置数组类型初始化 Bug
- 更新内核版本到 v1.7.1
- 添加内核定时自动重启，减少内存，回收垃圾

### 2023-12-3 (v0.2.2)

- 修复第一次运行时无法添加订阅的 Bug
- 优化 NTP 服务器选择
- 更新 Golang 版本，不依赖 CGO
- 更新文档

### 2023-11-26 (v0.2.1)

- 默认内网监听，可以不需要密码

### 2023-11-14 (v0.1.11)

- 增加 Clash Meta 订阅
- 更新内核版本
- 修复订阅出错

### 2023-11-11 (v0.1.10)

- 修复网页配置类型 Bug

### 2023-11-06 (v0.1.9)

- 修复内核配置生成 Bug
- 更新内核数据库
- 默认关闭 Tun 的 ipv6

### 2023-10-26 (v0.1.6)

- 优化内核配置生成逻辑
- 更新内核版本到 `1.5.4`

### 2023-10-03 (v0.1.5)

- 添加 Sing-Box 订阅，配置无缝接入
- 添加 Clash 流量统计
- 优化配置生成逻辑
- 添加 Hysteria2

### 2023-10-01 (v0.1.4)

**重大更新**

- 重构自动更新
- 添加支持 Clash 路由
- 支持远程配置，方便分享到移动端
- 添加 NTP 自动时间校准
- 修复官网 API 请求缓慢 BUG
- 增加默认网站分流
