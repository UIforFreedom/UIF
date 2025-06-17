# UIF

**是一个具有 代理功能 和 订阅管理 的全平台开源 UI 面板，** 可以作为 Clash For Windows、V2rayN、Shadowrocket、X-UI、Openclash、Homeproxy、Passwall 的替代品。

唯一官网 **[ui4freedom.org](https://www.ui4freedom.org)**

[[快速上手使用]](http://ui4freedom.org/UIF_help/docs/category/%E5%BF%AB%E9%80%9F%E4%BD%BF%E7%94%A8) [[下载地址]](https://github.com/UIforFreedom/UIF/releases)

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

**打开 [https://uiforfreedom.github.io](https://uiforfreedom.github.io) 预览全部功能** （需要下载后端才能正常使用）

## 支持的一键订阅

- Clash
- Clash-Meta
- V2rayN
- Sing-Box
- V2ray(V4)、Xray

---

## TODO

- 接口类型不相容时（HTTPS 中使用 HTTP），显示提示
- 默认不使用域名分流（不兼容的破坏性更新）
- reality 强制使用 utls

## ChangeLog

### v25.05.24

- 修复 httpGet 的 bug
- 修复 disableProxy

### v25.05.19

- 监听 Windows 退出事件
- 更新内核版本
- Linux 一律不启用自动配置系统代理
- 添加 source_ip_cidr、auth_user
- 合并 PR
- 添加 idle_timeout
- 添加订阅展开
- 添加入站用户路由
- 添加 mips 发行版
- 优化分享选项

### v25.01.10

- 添加热力图
- 优化提示
- 移除 geosite
- 优化首页连接状态
- 修复路由规则中类型转换错误

<details>
<summary>更多</summary>

### v25.01.06

- 修复 Clash Mode Bug
- 添加 cache.db
- 优化连不上提示
- 更新内核版本
- 优化 docker 运行脚本
- 优化获取本机 IP
- 优化添加 API 地址解析错误
- 添加 source_ip_cidr
- 修复 GetOutboundIP 的 Bug

### v24.12.25

- 修复循环读取 Bug
- 优化默认安装目录
- 添加对话框
- 添加 Macos dmg
- 优化构建效率

### v24.12.11

- 更新 domain_regex 例子
- 优化 macOS
- 修复订阅获取逻辑错误
- 更新内核版本
- 移除 Rules::CN
- 添加 zashboard 面板
- 优化打开外部面板逻辑
- Macos 使用 Tun 时，自动修改 DNS

### v24.12.07

- 更新 Tun 入站配置
- 移除 geoip 和 geosite
- 添加节点选择
- 默认开启 Clash API
- 优化更新逻辑，自动删除过时版本
- 优化提权逻辑
- 修复提权错误
- 修复错误删除数据
- 修复 adguard 错误

### v24.11.24

- 修复 HTTPWithProxyPort 的 Bug
- 修复 Tun 模式下 DNS 回环
- 优化 HTTP 入站逻辑（Linux 不自动设置系统代理）

### v24.11.21

- 用转发的方式调用 clash api
- 修复 Safari 兼容性 Bug
- 修复 cf 兼容性

### v24.11.12

- 添加 IP 策略
- 修复测速错误 Bug
- 减少 TUIC 无用选项
- 优化订阅读取，减少等待时间

### v24.11.07

- 使用新的版本格式
- 减少 API 接口特征
- 优化拉取订阅逻辑
- 修复 Clash Web 打开逻辑
- 启动时不修改防火墙
- 更改 srs 订阅文件下载时所使用的出站
- 修改默认使用的 DNS
- 添加 IP 使用策略
- 修复简化版 clash api 的 Bug
- 优化 NTP 启用逻辑

### 2024-10-17 (v0.3.23)

- 更新内核版本
- 修复 Reality 转换 Bug
- 优化检测 IP 代码
- 优化 Route 的 UI
- 简化版允许多入站
- Docker 版默认不自动设置系统代理
- 移除 Socks 入站的错误配置
- 优化文档

### 2024-10-14 (v0.3.22)

- 刷新 CDN
- 修复订阅获取失败
- 更新内核版本
- 优化 HTTP/Socks5 出站
- 优化 Docker 防火墙逻辑

### 2024-09-19 (v0.3.21)

- 添加 Docker Image
- 更新文档
- 修复路由规则显示 Bug
- 修复 Reality 转换 Bug
- 修复原始数据转换 Bug
- 优化内核状态检测
- 修复自动优选保存错误

### 2024-09-10 (v0.3.20)

**重大更新，可能不兼容旧版**

- 更新文档，添加视频演示
- 增加 Clash Web
- 增加 tcp_multi_path
- 优化分流配置生成
- 使用 RDRC 分流
- 添加 clash_mode
- 更新内核版本
- 添加简化版
- 使用 interrupt_exist_connections
- 操作按钮添加图标
- 修复 Hysteria 的 Clash 订阅错误
- 切换简化版需要自动启用入站
- 切换简化版有 BUG
- 切换简化版需要启用 Clash API
- 简化版添加订阅时默认启用了全部
- 修复国旗图标不显示
- 添加快速打开
- 添加 setup.exe 和构建脚本
- 优化接口管理界面
- 修复 vless 订阅

### 2024-07-17 (v0.3.19)

- 添加入站端口绑定
- 优化 Linux 安装脚本
- 修复切换接口时用旧配置
- 添加更多预设 Geosite
- 优化文档
- 移动端优先使用入站 tun
- 优化入站 Bind
- 添加 armv7
- 优化放行端口逻辑
- TUIC 默认使用 bbr
- 增加自动生成 Warp
- Windows 添加高清托盘菜单
- 添加 tcp_fast_open
- 使用随机的 API 端口
- 统一使用 UTF8 编码
- 更新 DB

### 2024-06-29 (v0.3.18)

- 保存排序的结果
- 更新安卓版本
- 添加 Subnet
- 添加远程 DNS 和本地 DNS
- 修复重启后自签证书会变化
- 优化 Sing-Box 订阅
- 用 API 读取 Clash API
- APIAddress 改为选择框（支持删除）

### 2024-06-16 (v0.3.17)

- 提高 V2rayn 订阅健壮性
- 修复存储密码 Bug
- 修复多重启动 Bug
- 增加英语版
- 修复域名测试
- 更新内核版本
- 默认不分享 WG
- TUN 默认使用 gvisor
- 添加移动端 Tun 模式选项

### 2024-05-26 (v0.3.16)

- 增加允许跨越的域名
- 修复 CI 测试
- 更新文档
- 更新内核版本
- 修复更新订阅时不能 V2rayN 解析错误
- 去掉多路复用选项
- 调整订阅更新的请求先后顺序
- 修复 proxy 失效后，无法更新订阅
- 优化 connect 不会超时的问题

### 2024-05-08 (v0.3.15)

- 修复有 detour 时无法测速
- 更换图标
- 更新内核版本
- 修复 log.fatal 退出
- 添加多路复用
- 添加系统托盘（为了迎合小白）
- 入站添加域名
- 优化文档

### 2024-04-27 (v0.3.14)

- 优化手机版的配置生成
- 测速时，使用用户 DNS
- 测速时，使用 default network interface
- 内核更新失败时，造成死锁
- 优化 SEO
- 更改默认 DNS 服务器
- 修复关闭 UIF 出错
- 更新文档，添加 CDN 下载信道
- 修复初始化运行的 Bug
- 更新内核版本
- 优化 V2rayN 的订阅解析

### 2024-04-23 (v0.3.13)

- 更新文档
- 修复 connect 时，不会超时
- 优化分享配置生成（Android 不能使用 dhcp://auto）
- 优化网页可用检测
- 优化 Connect 时钟
- 修复 ReadCoreConfig()
- 出站被禁用时，路由默认使用 Proxy
- 尝试修复息屏时，UIF 退出 Core 却没退出
- 优化分享的 UI
- 优化测延迟
- 添加 httpUpgrade
- 优化跨越，只使用 Post
- 显示操作系统参数

### 2024-03-26 (v0.3.12)

- 修复 CPU 使用率显示错误
- 修复 路由出站名字显示错误
- 修复 MacOS 自启动失败
- 修复 IsNeedAdmin() 判断失误
- 添加 detour
- 主程序增加自动 Chmod
- Tun 的 interface_name 默认为空
- 优化 Clash API 显示，显示 CPU 和 内存
- 修复缓存 Bug
- 添加 detour
- 优化 路由规则表格布局
- 更新内核版本

### 2024-03-02 (v0.3.11)

- SEO 优化
- "启用" 增加排序按钮
- 更新内核版本

### 2024-02-28 (v0.3.10)

**重大更新，可能不兼容旧版**

- 修复修改 route 时的 bug
- 更新文档
- 更新 Linux 安装脚本
- rules 自选出口
- 优化 V2ray（V4）订阅
- 增加获取系统参数

### 2024-02-18 (v0.3.9)

- APIAddress 直连
- 优化 Tun 逻辑
- 检查内核是否运行
- 优化 Linux 安装脚本
- 优化 V2ray v4 订阅
- 添加登录 session

### 2024-02-13 (v0.3.8)

- 初始化密码
- Linux 自动提权
- Linux 入站开放端口
- 更多的 Linux 安装测试
- TLS 优化
- 入站自动更新 TLS 证书
- Server 端支持自生成证书
- 入站修改时不影响实际值
- 修复 share meta 数据时的错误
- 提示重复端口
- 更新文档
- 优化 V2rayN 订阅

### 2024-02-10 (v0.3.7)

**春节快乐**

- 修复定期重启
- 修复 hysteria2 入站配置错误
- 入站不显示传输层
- 优化 In2Out 测试用例
- 更新文档
- 增加“分享”按钮
- 修复 Linux 安装脚本
- 修复 hysteria2 unknown obfs type
- 输入框限制使用空格
- shadowsocks 密码长度必须为 16
- 修复 shadowsocks 入站 unknown plugin
- 分享时转换成公网 IP
- 入站加域名选项
- 优化 grpc 路径显示 undefined
- 修复分享配置错误

### 2024-02-07 (v0.3.6)

- 修复网络检测
- 更新内核版本
- 更新订阅时并发

### 2024-02-01 (v0.3.5)

- 重构测延迟
- 优化 Xray 订阅
- 优化 hysteria2 配置，默认使用 BBR，不要求用户配置网速
- 优化 V2rayN 订阅解析
- 修复 CloseCore 锁
- 使用 QUIC 时不显示传输协议

### 2024-01-31 (v0.3.4)

- 优化界面

### 2024-01-27 (v0.3.4)

- 修复网络检测 Bug
- 优化界面
- 更新内核版本
- 修复重复 Tag bug

### 2024-01-14 (v0.3.3)

- 优化自动更新
- 更新内核版本

### 2024-01-10 (v0.3.2)

- 优化 Windows 提权
- 增加 MacOS 提权
- 优化 Window，MacOS 开机启动
- 修复 Shadowsocks Plugin Options 配置 Bug

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
</details>
