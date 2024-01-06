---
sidebar_position: 1
---

# 用 UIF 搭建

请先确保你有属于自己的，并且能访问国外网站的 VPS 服务器。

一般该 VPS 服务器都是 Linux 操作系统

## 安装 UIF

支持 Ubuntu 和 Centos 一键安装：

```bash
bash <(curl https://raw.githubusercontent.com/UIforFreedom/UIF/master/uifd/linux_install.sh)
```

安装好后，使用下面命令启动 UIF。

```bash
systemctl start uif
```

还有一些常见命令：

- `systemctl status uif` 查看 UIF 的状态
- `systemctl stop uif` 关闭 UIF

## 查看密码

使用命令查看 UIF 自动生成的密码

```bash
cat /usr/bin/uif/uif_key.txt
```

使用上面命令，应该会输出 UIF 的密码；如果显示的是该文件不存在，那么就意味着 UIF 未启动或未正确安装。

## 开放端口

打开 Linux 防火墙，让 UIF 流量通过。

```bash
apt install ufw # 确保已安装 ufw
ufw enable # 确保已启用
ufw allow 9413/tcp # 放行API端口
ufw allow 9527/tcp # 放行 Web 端口
```

## 访问 Web

假设你的 VPS 服务器的 IP 是 `172.28.234.34`，打开 UIF 的 Web 界面

二选其一：

① [http://127.0.0.1:9527](http://127.0.0.1:9527)

② [https://uiforfreedom.github.io](https://uiforfreedom.github.io)

到 `主页`，把设置 `UIF 接口地址` 成 `http://服务器的IP:9413`，

用上面的例子，就是`http://172.28.234.34:9413`，

填入 `密码`，点击右上角的 `连接后端` 即可。密码会缓存在本机浏览器的 cookie，首次访问才需要填入。

## 设置入站

到 [入站页面](https://uiforfreedom.github.io/#/in/my)，点击右上角 `添加`，选择你喜欢的 `代理协议`，这里以 `vmess`，作为演示。

## 复制并导入

到 [入站页面](https://uiforfreedom.github.io/#/in/my)，点击 `操作` -> `分享` 复制分享数据。到 [我的订阅](https://uiforfreedom.github.io/#/out/subscribe)，点击 `添加订阅` 按钮，粘贴数据即可。

## 安全风险

由于 UIF 需要开启 Web 端口，容易被探测到，而且不是 HTTPS，UIF 秘钥可能会被具有流量挟持的攻击者获得。
