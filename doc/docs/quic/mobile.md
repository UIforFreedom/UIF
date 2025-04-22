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

:::tip
移动端（Android、IOS）只能直接使用配置，若想要用 UIF 图形化 Web 面板修改配置内容，可以通过电脑端修改后分享到移动端使用。
:::

## 从电脑端导入到移动端

**出于安全考虑，想要分享配置就必须要设置公网可见并设置密码。** 参考 [设置公网可见](../setting.md)

- 到 [设置](https://ui4freedom.org/#/settings/uif) 点击复制 `分享链接`，在移动端添加 `Profile`，类型选择 `Remote`，粘贴从电脑端复制的 `分享链接`。完成后，移动端即可跟电脑端一样使用相同的翻墙节点

- 到 [设置](https://ui4freedom.org/#/settings/uif) 点击 `快速导入`，如果移动端已安装，那么会跳转到 APP，只需点击一下即可快速导入配置
