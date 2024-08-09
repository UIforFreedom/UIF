---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Mobile from './mobile.mp4';
import ReactPlayer from 'react-player'

# 移动端

** 本文 4K 高清视频已上传到 [Youtube](https://www.youtube.com/watch?v=J4IFKoUUGWM&t=5s)**

<ReactPlayer controls url={Mobile}  width="100%" height="100%" />

---

## 1 安装

下载安装对应客户端:

<Tabs groupId="operating-systems">
<TabItem value="android" label="安卓 Android">

不同的渠道，选择其一能够下载安装即可：

- [SFA-1.8.8-universal.apk](pathname:///assets/release/SFA-universal.apk) （常用）
- [Github 通道](https://github.com/SagerNet/sing-box/releases/latest)（可能打不开）
- 在 Google Play 直接搜索 [sing-box](https://play.google.com/store/apps/details?id=io.nekohasekai.sfa)（国产手机不适用）

</TabItem>

<TabItem value="ios" label="苹果 iPhone、iPad">

只有一种方法。直接到 `应用商店(App Store)` 搜索 [sing-box](https://apps.apple.com/us/app/sing-box/id6451272673) 并安装即可。但请先确保你登录的 Apple ID 的地区不属于中国大陆，否则将无法搜索出来。

</TabItem>

</Tabs>

## 2 添加订阅

目前在移动端（包括安卓、苹果）上是生成不了订阅配置的，你需要事先准备好 `订阅链接`（通常由机场、VPN 商家提供的），如果你希望自建翻墙服务器，可以参考 [最简单的又安全的方法](../outbound/myself.md)。

最后在手机上点击添加类型为 `remote` 的 `Profile` 即可（参考视频中的做法）。
