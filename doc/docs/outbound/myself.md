---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import MyVideoUrl from './myself.mp4';
import ReactPlayer from 'react-player'

# 快速搭建翻墙节点

** 本文 4K 高清视频已上传到 [Youtube](https://www.youtube.com/watch?v=w1AoAahpp6o)**

<ReactPlayer controls url={MyVideoUrl}  width="100%" height="100%" />

---

2024 年了，自建翻墙服务器的技术该更新更新。不要再使用 x-ui、V2rayN 等落后过时的东西。**跟着本文一步步学习有史以来最简单（傻瓜式）、最安全、最有效的一键自建翻墙 VPS 方法。** 破除封建迷信，其实你并不需要了解 GFW 防封伪装，更不需要购买域名才能搭建，** 我们会帮你选择出最佳最有性价比的方案**。

本文的最后，你会使用一键脚本搭建好一个 TLS 自签名证书的 [Hysteria2 服务器](https://hysteria.network/zh/)，并且拥有自己的专属订阅链接，不限制设备数量和上网人数，自己独享并完全控制属于自己的安全翻墙服务器。

**如遇到任何困难，请不用客气，随时可以去 [讨论区](https://github.com/UIforFreedom/UIF/issues) 寻求帮助，我们保证你的问题一定会得到回复。**

## 1 注册并购买搬瓦工 VPS

去到 [搬瓦工官网](https://bwh81.net/aff.php?aff=75590) 注册，邮箱和密码填对了就行，地址和电话可以随便填。如果你已有搬瓦工的账号，但也请注册一个新的，因为搬瓦工只支持账号注册 30 天内允许退款，为了权益最大化，不喜欢时随时可以退款。

### 1.1 选择购买 VPS 套餐

2024 年 8 月最新报价，可以使用支付宝购买：

| 线路         | 落地          | 价格                               | 时长       | 解锁                  | 链接                                                            |
| ------------ | ------------- | ---------------------------------- | ---------- | --------------------- | --------------------------------------------------------------- |
| 多人共享     | 美国          | 49.99 美元（约 29 人民币/月）      | 一年       | Chatgpt、 Netflix     | [购买](https://bwh81.net/aff.php?aff=75590&pid=44)              |
| **优先分配** | **美国/日本** | **49.99 美元（约 116 人民币/月）** | **3 个月** | **Chatgpt、 Netflix** | **[购买](https://bwh81.net/aff.php?aff=75590&pid=87) 👍 **      |
| **市面最强** | **香港**      | **89.99 美元（约 629 人民币/月）** | **1 个月** | **Chatgpt、 Netflix** | **[购买](https://bwh81.net/aff.php?aff=75590&pid=95) 😱 顶级 ** |

## 2 服务器安装 UIF

跟 Linux 的安装流程是一样的，建议[一键脚本](../install/linux.md)。安装完成后，往面板填入 `API Address` 和 `Password`，然后点击连接。

## 3 设置入站

确保成功连接到了后端，去 [入站页面](https://uiforfreedom.github.io/#/in/my)，点击右上角 `添加`，`代理协议` 选择 Hysteria2， 选择启用 TLS，点击保存。最后`启用`即可。

## 4 分享到其他设备

此时，一台翻墙服务器和订阅服务器已经生成好了。去到 [设置](https://uiforfreedom.github.io/#/setting) ，点击 `复制订阅链接`，然后导入到其他设备上就可以使用，参考 [移动端](../quic/mobile.md) 和 [电脑端](../quic/intro.md) 的安装使用教程，将自己的 `订阅链接` 分享到其他设备上使用。
