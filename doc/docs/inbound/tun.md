---
sidebar_position: 2
---

# TUN 方式

该方式侵入式很强，会接管系统所有流量，且开启时需要管理员权限，不建议非程序员使用。

:::tip
目前支持 Windows 自动启动并提权
:::

## 开启/关闭

到 [入站页面](https://uiforfreedom.github.io/#/in/my)，选择 `Tun` 点击 `启用` 即可开启或关闭。

## 开机启动

## 设置 IP 路由

TUN 会帮你设置一个网卡，需要设置你的操作系统，使所有的 IP 流量都转发到你的网卡。

UIF 会默认帮你设置好 IP 路由；

在 Windows 中使用 `route print`，在 Linux 中使用 `iptable` 即可查看。

如果你不想自动设置好 IP 路由，到 [入站页面](https://uiforfreedom.github.io/#/in/my)；选择 `Tun` 点击 `详情` -> `代理设置` -> `自动配置`。
