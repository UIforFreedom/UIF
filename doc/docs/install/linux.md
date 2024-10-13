---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReactPlayer from 'react-player'

# Linux

支持各种发行版，比如说 Ubuntu、Debian、CentOS、Armbian 等；只要是 Linux 都可用。

<Tabs>
<TabItem value="bash" label="一键脚本">

一键脚本依赖：bash、tar、curl；必须要有 systemd 或 procd 作为启动服务。若无法自行解决依赖问题，请使用 Docker。

** > 安装 **

打开 Shell，复制粘贴，回车运行即可：

```bash
# 运行前确保具有 sudo 权限
curl -L -O "https://fastly.jsdelivr.net/gh/UIforFreedom/UIF@master/uifd/linux_install.sh" && chmod 755 ./linux_install.sh && bash ./linux_install.sh
```

执行完毕后，如无意外，会出现本机监听的 `Web Address`、`API Address` 和 `Password`：

```bash
# 举例：
...

Web Address:   http://1.2.3.4:1234
API Address:   http://1.2.3.4:4321
Password:      123-123123-123123-123123
```

若忘记了密码和端口，可以使用如下命令查看：

```bash
cat /usr/bin/uif/uif_key.txt # Password
cat /usr/bin/uif/uif_api_address.txt # API Address
cat /usr/bin/uif/uif_web_address.txt # Web Address
```

** > 运行 **

成功执行完一键脚本后，UIF 会在后台运行着，下列命令供用户按实际情况使用：

```bash
# systemd
systemctl restart ui4freedom # 运行
systemctl stop ui4freedom # 关闭
systemctl enable ui4freedom # 开机自启
systemctl disable ui4freedom # 取消开机自启

# procd
/etc/init.d/ui4freedom.sh start # 运行
/etc/init.d/ui4freedom.sh stop # 关闭
/etc/init.d/ui4freedom.sh enable # 开机自启
/etc/init.d/ui4freedom.sh disable # 取消开机自启
```

:::tip
如果你需要用 Tun 作为透明代理，你还需要确保已安装了 `kmod-tun` 依赖，否则内核将无法创建虚拟网卡。如果不知道如何安装，推荐直接使用 docker，没有依赖问题。
:::

</TabItem>

<TabItem value="docker" label="Docker">

首先要确保你已安装了 Docker，具体安装 Docker 的教程请自行谷歌搜索。

** > 下载 **

Docker Hub 已被屏蔽，选择最合适你的方法安装镜像：

- 若你能直接使用 Docker Hub 就最好了

```bash
docker pull ui4freedom/uif:latest # 拉取最新镜像
```

- 通过镜像站，参考 [Docker 的源站设置](https://gist.github.com/y0ngb1n/7e8f16af3242c7815e7ca2f0833d3ea6)

```bash
# 举例
docker pull dockerproxy.net/ui4freedom/uif:latest && docker tag dockerproxy.net/ui4freedom/uif:latest ui4freedom/uif:latest && docker rmi dockerproxy.net/ui4freedom/uif:latest
```

<!-- - 下载 Image tar，然后加载 -->

<!-- ```bash -->
<!-- # 下载到本地 -->
<!-- curl -O https://ui4freedom.org/UIF_help/assets/release/uif-docker-part_aa && curl -O https://ui4freedom.org/UIF_help/assets/release/uif-docker-part_ab && cat uif-docker-part_* > uif-docker-latest.tar && rm ./uif-docker-part_* -->
<!-- # 加载到 Docker Image 里 -->
<!-- docker load -i uif-docker-latest.tar -->
<!-- ``` -->

** > 运行 **

首次运行（创建容器）：

```bash
# 网络模式必须是要 host
# -d 设置为后台运行
# 容器名字预设值为 'uif'
# privileged 是必须的，如果你要用 tun
# unless-stopped 设置为开机自启
docker run --network host --name uif --privileged --restart unless-stopped -d ui4freedom/uif:latest
```

再次运行（复用容器）：

```bash
docker start uif
```

** > 查看 `Password`、`Web Address` 和 `API Address` **

```bash
docker logs -f uif
```

会出现如下类似内容，主要是为了查看密码和端口：

```bash
Password: 92c204a9-3934-4976-96f2-7bbcb338ccf0
Web Address: 0.0.0.0:9527
API Address: 0.0.0.0:9413
```

** > 停止运行 **

```bash
docker stop uif
```

** > 透明代理 **

如果你要启用 Tun 作透明代理，你需要检查是否开启了 `路由转发` 并设置好防火墙允许流量进入。通常在 OpenWrt 上已经默认设置好了。

```bash
sysctl -w net.ipv4.ip_forward=1 # 临时开启 IPV4 路由转发（重启失效）
ufw disable # 关闭防火墙，你也可以选择清除防火墙规则
```

</TabItem>

<TabItem value="custom" label="自定义安装">

:::tip
如果你的 Linux 是没有图像界面，为了方便你需要将 UIF 的 API 和 Web 的端口暴露出来。一键脚本和 docker 都会自动初始化密码和端口，自定义安装时，你必须要自行设置这些。
:::

** > 下载 **

- [uif-linux-amd64.tar.gz](/assets/release/uif-linux-amd64.tar.gz) (x64) (常见)
- [uif-linux-arm64.tar.gz](/assets/release/uif-linux-arm64.tar.gz)
- [uif-linux-armv7.tar.gz](/assets/release/uif-linux-armv7.tar.gz)
- [Github 通道](https://github.com/UIforFreedom/UIF/releases) （可能被屏蔽了打不开）

先确定你机器的架构，比如说是 `arm64`，那么可以使用 `curl` 或者 `wget`（先确保已安装了） 根据包名`uif-linux-arm64.tar.gz` 下载；去 [这里](https://github.com/UIforFreedom/UIF/releases) 查看全部已编译好可用的架构，如果没有你对应机器的架构，请移步到 [讨论区](https://github.com/UIforFreedom/UIF/issues)。

```bash
# 举例：
curl -L -O https://github.com/UIforFreedom/UIF/releases/latest/download/uif-linux-arm64.tar.gz
```

Github 可能被屏蔽了，可以选择另一个下载地址：

```bash
curl -L -O https://ui4freedom.org/UIF_help/assets/release/uif-linux-arm64.tar.gz
```

** > 解压 **

先确保 `tar` 是正常使用的。你可以解压到任意地方。

```bash
# 举例：
tar -xzf "./uif-linux-arm64.tar.gz"
```

** > 设置 `Web Address` 和 `API Address` **

在 UIF 的目录里新建一个名叫 `uif_api_address.txt` 的文本文件，往里面写入你想要使用的端口。

```bash
# 举例：
# 必须设置为 0.0.0.0，意味着公网可见
echo "0.0.0.0:1234" | tee "./uif_api_address.txt" > /dev/null
echo "0.0.0.0:8888" | tee "./uif_web_address.txt" > /dev/null
```

** > 运行 **

确保 UIF 目录下具有全部权限：

```bash
# 举例 ./uif_dir 是你的解压目录：
chmod -R 755 ./uif_dir
```

你可以使用 `nohup` 命令或者写一个系统服务，让启动关闭更加简单。

```bash
# UIF 目录里有一个名叫 uif 的可执行文件，直接运行即可
# 举例：
nohup ./uif_dir/uif
```

** > 查看 `Password` **

如果你忘记了密码，使用命令查看 UIF 自动生成的密码：

```bash
# 成功运行后，UIF 目录里有一个名叫 uif_key.txt 的文件
# 在终端中输入：
cat ./uif_dir/uif_key.txt
```

</TabItem>

</Tabs>

** > 打开 UI **

成功安装并确保在后台已运行 UIF 后，可以打开 UIF 的 Web 界面，进行各种操作了。

若你的 Linux 无图像界面，那必须要在另外的设备上打开一个浏览器，例如说手机、Windows。

浏览器输入 `Web Address` 的网址，如无意外即可看到的 Web 界面。

然后，点击添加接口，把 `API Address` 和 `Password` 填进去。点击`切换`，此时就会自动连接上 UIF 后端。

UI 中右上角显示 "连接成功" 即可操作 UIF 的全部功能。
