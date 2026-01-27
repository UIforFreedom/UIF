---
sidebar_position: 2
---

# 自定义路由 和 DNS

UIF 有强大的路由规则。

## 定义规则

比如说你想要 x.com 网站走 `直连`，到 [路由页面](https://uiforfreedom.github.io/#/route/my)，点击右上角 `添加` 按钮，选择 `域名规则` -> `完全匹配` -> 填入 x.com。

那么此时只要访问 x.com 都会走 `直连`

一些规则的功能：

- `完全匹配`： 一模一样
- `后缀匹配`： 后缀一样
- `关键字匹配`： 存在该关键字
- `正则匹配`： 使用正则

## 使用 GeoSite 和 GeoIP

假如你想 openai 旗下全部产品都走某个节点，当然你可以用域名`关键字匹配`，只有域名中包含 'openai' 关键字就走某个节点，但是这样是不完整的，因为 openai 旗下也有 chatgpt.com 这个域名，所以你需要收集整理，避免漏了。

但是已有许多好事人，提前收集整理好了许多规则，个人无需重复劳动；直接使用即可，这便是 GeoSite 和 GeoIP：

- GeoSite 的精度不高，而且规则繁杂（超过 1000 条）。这里仅展示一些常用的：

```bash
cn # 中国大陆
!cn # 非中国大陆
category-ads # 广告规则
category-porn # 看片儿

openai # 包含 chatgpt 等
google # 包含 Youtube 等谷歌产品
google-scholar # 谷歌学术专用
netflix # 奈飞
telegram # 电报
github
microsoft # 微软
```

如有需要，请查看 [完整的列表](https://github.com/v2fly/domain-list-community/tree/master/data)（一个文件名代表一个种分类）

- GeoIP 精度很高，包含所有主要国家和地区的 Code。这里仅展示一些常用的：

```bash
cn # 中国大陆
us # 美利坚
private # 局域网
```
