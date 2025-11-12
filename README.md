# UIF

**是一个具有 代理功能 和 订阅管理 的全平台开源 UI 面板，** 可以作为 Clash For Windows、V2rayN、Shadowrocket、X-UI、Openclash、Homeproxy、Passwall 的替代品。

唯一官网 **[ui4freedom.org](https://www.ui4freedom.org)**

[[快速上手使用]](http://ui4freedom.org/UIF_help/docs/category/%E5%BF%AB%E9%80%9F%E4%BD%BF%E7%94%A8) [[下载地址]](https://github.com/UIforFreedom/UIF/releases)

---

**打开 [https://uiforfreedom.github.io](https://uiforfreedom.github.io) 预览全部功能** （需要下载后端才能正常使用）

## TODO

- 优化接口管理
- 接口类型不相容时（HTTPS 中使用 HTTP），显示提示
- 默认不使用域名分流（不兼容的破坏性更新）
- reality 强制使用 utls

## ChangeLog

### v25.11.11

- 适配最新内核配置。**不兼容更新，可能需要重新安装 UIF**
- 更新内核
- 添加刷新 connection
- 添加刷新 dns
- 默认拒绝所有 ipv6
- 默认使用 ipv4_only
- 移除测延迟和测全部延迟
- 添加 Web 版本检查
- “添加订阅”变成浮动按钮
- log 不再显示时间
- 修复 new URL() 兼容性问题
