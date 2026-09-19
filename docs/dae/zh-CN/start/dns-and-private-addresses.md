---
title: DNS 与保留地址
---

# DNS 与保留地址

## dae 如何拦截 DNS

dae 只处理两类数据包：经它路由的包（LAN 接口 ingress）和从本机发出的包（WAN 接口 egress）。其中目的端口为 53 的 UDP 和 TCP 流量，先标记为 DNS 查询，再经过 routing 规则。除了命中 `must_direct` 的流量，其余都交给 DNS 模块。仅写 `direct` 不能让 DNS 绕过 dae，随附配置里保留地址的 `dip(geoip:private) -> direct` 也不能。

两种流量不会进入 DNS 模块：

- 命中 `must_direct` 的流量。局域网客户端发往 dae 主机自身 socket 的查询（例如本机监听 53 端口的 dnsmasq）也和其它报文一样走路由，UDP 与 TCP 都会进入 DNS 模块；要让本机解析器直接应答，用 `l4proto(udp) && dport(53) && dip(<dae 主机地址>) -> must_direct` 显式表达。
- 经 loopback 接口的查询。dae 只挂在 LAN 和 WAN 接口上。

dae 不重组 IP 分片。它只处理数据报的第一个分片，后续分片原样放行，因此被分片的 UDP DNS 报文无法被正确拦截。

## `dns` 段决定查询去向

拦截后的查询按 `dns.routing.request` 选择上游。命中的上游负责应答，原目的地址收不到这条查询。只有内置出站 `asis` 会向原请求的目的地址查询，而且总是用 UDP，即使客户端是用 TCP 发起的。

收到截断响应（`TC=1`）时，`udp://` 和 `tcp+udp://` 上游会通过 TCP 重试。`asis` 不重试：dae 丢弃服务器的响应，改为回复一条 ID 和问题相同、`TC=1`、Answer 段为空的响应，由客户端决定是否通过 TCP 重试。

因为 dae 会接管所有经它路由的 DNS 查询，所以局域网设备的 DNS 服务器填任意地址即可，填 dae 主机自身也可以。使用 `asis` 时，不要让局域网设备把 dae 自身的 53 端口当作 DNS 服务器，否则查询会在 dae 与自身之间形成环路。设置 `dns.bind`（例如 `'127.0.0.1:5353'`）后，dae 还会在该地址监听 DNS 查询。

`domain()` 路由规则依赖 dae 看到的 DNS 应答。如果为局域网客户端应答的解析器自己的上游查询走了 `must_direct`，dae 看不到这些应答，也就学不到返回 IP 对应的域名，`domain()` 规则不会匹配客户端的流量。

## `bootstrap_resolver`

三类查询由 dae 直接发往 `global.bootstrap_resolver`，不经过代理：

- `dns.upstream` 中非 IP 字面量的主机名。
- `dial_mode: domain`（默认值）对嗅探到的域名执行的后台真实域名探测。
- 启用内部 DNS 路由后，没有被 `sub()`、`node()` 或 `subnode()` 规则指定上游的订阅和节点主机名。

未设置时，dae 先使用 `119.29.29.29:53`，再使用 `223.5.5.5:53`。设置该选项会替换这两个默认值，上游示例如下：

```shell
global {
  bootstrap_resolver: '9.9.9.9:53'
}
```

## 保留地址默认直连

随附的 `example.dae` 与上游最小配置都包含以下规则，让发往保留地址的流量直连。内置集合 `geoip:private` 包含 RFC 1918 私有地址、环回地址和链路本地地址等。

```shell
dip(geoip:private) -> direct
```

这是随附配置的默认行为，不是 eBPF 数据面或控制平面中硬编码的排除逻辑。删除这条规则后，这些地址便不再保证直连，流量会按其余路由规则处理，可能进入代理。这条规则也不影响 DNS：发往保留地址 53 端口的查询仍会交给 DNS 模块。

详细设置请参阅 [DNS 配置](/zh-CN/dae/configuration/dns)与[路由配置](/zh-CN/dae/configuration/routing)。
