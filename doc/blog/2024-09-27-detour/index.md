---
slug: detour
title: 如何使用链式代理？全平台支持！最全最先进
authors: [uif]
tags:
  [
    如何使用链式代理,
    如何使用detour,
    什么是链式代理,
    链式代理需要什么,
    怎么链式代理HTTP,
    如何使用节点中转,
    节点中转链式代理,
    安卓上使用链式代理,
    外贸链式代理,
    IOS 上使用链式代理,
    苹果手机上使用链式代理,
    sing box 链式代理,
    clash 链式代理,
    sing box 中转,
    clash 中转,
  ]
---

import Detour from './1.mp4';
import ReactPlayer from 'react-player'

** 本文 4K 高清视频已上传到 [Youtube](https://www.youtube.com/watch?v=go-8AiiNVZM)**

<ReactPlayer controls url={Detour}  width="100%" height="100%" />

---

什么是链式代理（detour）？假设现在有两个节点 A 和 B，他们分别有不同的 IP 和网络环境，而且最重要的是他们都提供代理功能，假设 A 提供 Vmess 入站，B 提供 HTTP 入站。

如果要访问 google.com，我们想将内容先发送给 A 节点，然后再由 A 节点，发送给 B 节点，最终由 B 节点发起 google 请求，此时 google 识别到的 IP 也是 B 节点的。

## 使用场景

外贸企业通常会用到这种方法来使用住宅 IP，因为 B 节点（也就是落地节点）通常无法在国内直连的，所以需要先连接到 A 节点。

链式代理也可以用来作为中转服务提高速度或减少延迟，因为即使 B 节点在国内能连接上，连接线路可能会绕圈，经过大半个地球后才能连上 B 节点，用 A 节点作为中转，用户仅需关注你和 A 节点之间的网络情况，A 节点甚至可以部署在国内，从而减少延迟，提高可用性。


## 如何实现链式代理？有什么限制？

首先就得要本机的翻墙工具具有链式代理的功能，也就是内核必须要支持 A 和 B 的出站方式。

相比于传统的中转服务，**链式代理并不需要 A 和 B 节点做什么特殊的设置**，因为用户通常也修改不了 A 和 B 节点。用户仅需在客户端添加 A 和 B 出站，然后修改一下 B 的 detour 即可。

## 在桌面系统（Windows、Linux、Macos） 上如何使用？

首先你要下载好 UIF，参考 [UIF 的安装教程](https://ui4freedom.org/UIF_help/docs/category/%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85)。然后添加 A 和 B 节点并启用这两个节点，你可以添加很多个节点，为了简化，这里仅演示两个而已，因为也至少要有两个，而且 A 节点是必须要在国内可用的。

添加好并启用好入站之后，选中 B 节点 -> 点击 `操作` 按钮 -> `配置` -> `拨号设置` -> 在 `链式代理` 中选中 A 节点 -> 点击 `保存`。

设置好后，B 节点就可用了。最后如果你需要全部流量都走 B 节点，需要设置路由让所有流量走 B 节点，或者选择 `简化版`选中 B 节点即可。

## 在手机上（IOS、安卓） 上如何使用？

首先你需要在电脑上设置好，然后去到 [设置](https://ui4freedom.org/#/settings/uif) 点击 `复制分享链接`，把订阅分享到手机上即可。