---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReactPlayer from 'react-player'

# Windows

在微软操作系统上安装使用 UIF；建议使用 Windows 10 及以上版本（Win7/8 不再被支持）。

<Tabs groupId="operating-systems">
<TabItem value="exe" label="安装包（推荐）">

:::tip
Windows 安装包默认使用是 `简化版`，如果你需要复杂的功能，在 `主页` 切换回 `专业版` 即可。安装包与压缩包安装没有本质区别
:::

** 👉️ > 下载 **

直接选择下载即可：

- [uif-windows-amd64-setup.exe](/assets/release/uif-windows-amd64-setup.exe) (x64)

** 👉️ > 安装 **

下载完 `uif-windows-amd64-setup.exe` 后，双击运行，根据安装指引，存放到你喜欢的位置即可。**但不建议安装在 C 盘！**

** 👉️ > 运行 **

使用 `uif-windows-amd64-setup.exe` 安装完后，桌面上如无意外，会出现 UIF 的图标。双击快捷方式即可运行。

</TabItem>

<TabItem value="zip" label="压缩包">

** 👉️ > 下载 **

选择任一能打开的通道下载即可：

- [uif-windows-amd64.zip](/assets/release/uif-windows-amd64.zip) (x64)
<!-- - [uif-windows-arm64.zip](/assets/release/uif-windows-arm64.zip) -->
- [Github 通道](https://github.com/UIforFreedom/UIF/releases) （可能被屏蔽了打不开）

** 👉️ > 安装 **

你需要先有压缩包软件，例如说 WinRAR、 [7-Zip](https://www.7-zip.org/)，然后把 ZIP 解压出来。

** 👉️ > 运行 **

解压到任意目录后。会看到类似如下目录：

```bash
/cores/     # 内核目录
/webs/      # 网页源码
/service/   # 主服务
/version/   # 版本管理
geoip.db    # IP 数据库
geosite.db  # 域名 数据库

uif_key.txt # 首次运行自动生成
UIF         # 主程序
```

双击运行 `uif.exe` （主程序）即可运行。

</TabItem>

</Tabs>
