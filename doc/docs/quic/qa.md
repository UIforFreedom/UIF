---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 常见问题

### 1 翻不了墙

回答：首先可以去到 [首页](http://ui4freedom.org/#/home) 的可用检测，点击开始测试；如果全部的网址都能打开，那么意味 UIF 的配置是没问题的。极有可能是你没开启入站，也就是 UIF 没接管系统的流量，请到 [入站](https://www.url.com)，点击开启 `HTTP` 入站。

如果可用检测只显示百度之类的国内网站的延迟，那么就是意味着你的翻墙服务器无法正常工作。这时你需要去到 [出站](https://www.url.com) 添加一个可用的翻墙服务器。

如果可用检查显示所有网站的延迟都是-1，这时你需要确保后端是显示 `√运行中`。如果显示的是 `×未运行`，那么你需要查看后端日志中显示什么错误。大部分情况下，都是一些配置的错误，比如说 Hysteria2 强制要求配置 TLS，你却没配置、运行 Tun VPN 需要管理员权限，你没开启也没重启之类的。

**当你无法解决时，可以去 [讨论区](https://github.com/UIforFreedom/UIF/issues) 找一找有没有其他人也遇到同样的问题，你也可以自己开一个 issue。**

### 2 开着的时候好好的，关了 UIF 就无法正常上网，什么网站都打不开

回答：因为翻墙时，是需要 UIF 接管操作系统的流量。开启 HTTP 入站时，操作系统的代理配置，会被设置成 UIF 的指定入口，关闭 UIF 后，操作系统的代理配置依然存在，操作系统依然会把浏览转发到 UIF，然而 UIF 已停止工作了，你就无法上网，所以需要你手动去操作系统的网络配置处关闭 HTTP 代理。

### 3 我导入了多个翻墙服务器到 UIF，如何让 UIF 自动选择速度最快的那个？

回答：你只需点击启用即可，UIF 会自动定期测延迟，并选择延迟最低的那个；当某一个服务器挂掉了，也会自动选择其他的可用服务器。所以说，你只需导入并点击启用，UIF 有自己的一套策略，让用户达到最佳的体验。

### 4 手机使用时，会自动关闭APP，要手动再点击打开才能恢复正常翻墙

回答：这是正常现象，为了省电和优化内存的原因，手机的系统会把 APP 也当做垃圾程序回收掉了。

### 5 没有翻墙服务器（出站），应该要怎么办？

回答：UIF 并不提供翻墙的服务器，你可以去自行去购买一些机场的订阅，推荐最好[使用自己搭建](../outbound/myself.md)。

### 6 用哪些翻墙协议比较好？Trojan？Shadowsocks？Vless？

回答：最好是使用 Hysteria2，如果你想使用 TCP 的话，使用 Trojan （需要开启 TLS）即可，只有当你使用 CDN 的时候才需要去使用 Websocks。

### 7 翻墙服务器被封了怎么办？

回答：你需要搞清楚是封了全部端口还是封了部分的端口，一般建议使用一些常见的端口，例如说 443 和 80，别搞那些乱七八糟的端口。被封后，联系 VPS 供应商更换 IP。

### 8 Linux 后端无法运行，显示"bind: cannot assign requested address"

回答：这是由于你 Linux 中没正确配置回环地址(127.0.0.1）。可以使用如下命令，检查是否存在 127.0.0.1

```bash
ip addr show lo
```

如果存在的话，你应该看到类似以下的输出：

```plaintext
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever

```

如果 lo 接口未配置或未启动，可以使用以下命令启动它：

```bash
sudo ip link set lo up
sudo ip addr add 127.0.0.1/8 dev lo
```

有时需要重启网络服务以应用更改：

```bash
sudo systemctl restart networking
```

执行以下命令，确保 127.0.0.1 已正确配置并在系统中生效：

```bash
ping 127.0.0.1
```

你应该看到类似以下的输出，表示本地环回地址已正确配置：

```bash
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.041 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.041 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.041 ms
```
