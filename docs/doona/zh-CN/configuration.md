---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 配置参考 {#config}

doona 使用下列 honk DAE 设置。各表列出默认值及生效方式。配置语法请查阅 honk 的[节点](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/nodes.md)、[订阅](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/subscription.md)、[组](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/groups.md)、[路由](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/routing.md)和 [DNS](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/dns.md) 参考。初次使用请从[快速入门](quick-start.md)开始，或按[为第一条连接设置路由](tutorial.md)操作。

表中默认值对应 honk `1b95e2e`，示例会覆写其中部分值。生效方式列链接到 [doona 可以修改什么](what-doona-can-change.md)中对应的写入权限或重启条目。

## 原生 API 与认证 {#原生-api-与认证}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `experimental.native_api.enabled` | `false` | 启用 doona 使用的原生 API。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.listen` | `127.0.0.1:9527` | API 监听地址。须使用数字 IP 和非零端口。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.password_auth` | `false` | 启用管理员登录；不能与 `secret` 或匿名回环访问并用。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.secret` | `''` | Token 登录。只接受不含空白或逗号的可见 ASCII。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.allow_anonymous_loopback` | `false` | 允许无凭证的回环访问；不授予受保护的写入权限。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.config_write` | `false` | 配合凭证允许写入配置来源及更新地理数据。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.ui` | `''` | 在 `/ui/` 提供 doona：填写含 `index.html` 的目录，或在启用 `native-ui` 的构建中使用 `embedded`／`embedded-lite`。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.allow_origins` | `[]` | 额外允许的浏览器来源，如 `https://panel.example`。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.allowed_hosts` | `[]` | 额外允许的 HTTP 主机名及端口，如 `panel.example`。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |

## 数据目录与状态数据库 {#数据目录与状态数据库}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `global.data_dir` | `/var/lib/honk` | 运行数据根目录；状态数据库位于其下的 `state/honk.db`。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.store_subscribe` | `true` | 保存订阅内容供离线启动使用；订阅条目的 `cache` 也须允许缓存。 | [重启](what-doona-can-change.md#restart-global) | [subscription](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/subscription.md) |
| `experimental.cache_file.enabled` | 未设置 | 未设置时保留 Selector 选择和延迟样本；`false` 关闭此缓存；`true` 还保存 Clash 模式并允许持久保存 DNS。 | [重启](what-doona-can-change.md#restart-cache) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.cache_file.store_dns` | `false` | 在 `enabled: true` 时保存 DNS 应答。 | [重启](what-doona-can-change.md#restart-cache) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |

状态数据库还保存管理员凭证和地理数据设置。`--store db` 选择数据库配置修订存储；这是启动选项，不是 DAE 键。见[修订功能条件](feature-requirements.md#req-revisions)。

## 资源与订阅默认值 {#资源与订阅默认值}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `assets.route` | 空；遵循路由规则 | 默认下载路由：`routing`、`direct` 或组名。地理数据、界面和订阅继承此值。 | [重启](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.geodata.geosite` | `''`；有状态数据库时使用内置 URL | 已加载域名分类的 HTTP(S) 来源。 | [重启](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.geodata.geoip` | `''`；有状态数据库时使用内置 URL | 已加载 IP 分类的 HTTP(S) 来源。 | [重启](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.geodata.route` | 继承 `assets.route` | 数据与校验和的下载路由。未设置时保留已存储的覆写值。 | [重启](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.ui.url` | [zashboard dist.zip](https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip) | Clash 仪表板下载地址，与 doona 目录无关。`HONK_UI_DOWNLOAD_URL` 优先。 | [重启](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.ui.route` | 继承 `assets.route` | Clash 仪表板下载路由；也接受节点标签。 | [重启](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.subscription.ua` | `honk/<version>` | 默认订阅 User-Agent；订阅条目可覆写。 | [重载](what-doona-can-change.md#change-sources) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.subscription.interval` | `86400s` | 默认刷新间隔；`0` 关闭定时刷新。 | [重载](what-doona-can-change.md#change-sources) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.subscription.cache` | `true` | 默认缓存订阅内容，受 `global.store_subscribe` 限制。 | [重载](what-doona-can-change.md#change-sources) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |

订阅条目选项优先于默认值，子区块路由优先于 `assets.route`。更改若影响继承后的地理数据或界面设置，需要重启；仅影响订阅时可重载。启动配置中明确指定的地理数据 URL 和路由会替换已存储的覆写值。声明 URL 不会加载资源。见[地理数据更新条件](feature-requirements.md#req-geodata-update)。

## 记录权限 {#记录权限}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `experimental.native_api.record_traffic` | `true` | 流量历史图表。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.record_memory` | `true` | 内存历史图表。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.record_flows` | `true` | 允许记录分流及规则命中信息。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.record_logs` | `true` | 允许记录日志页内容。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.record_dns_log` | `true` | 允许记录 DNS 解析日志。 | [重启](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |

这些文件键授予记录权限。流、日志和 DNS 日志以按需模式启动；运行时开关不能覆写配置中的禁用设置。连接页单独列出活动的用户空间连接，不依赖流记录器。见[连接条件](feature-requirements.md#req-connections)、[流记录条件](feature-requirements.md#req-flows)和[运行时覆盖条件](feature-requirements.md#req-runtime-options)。

## 健康检查 {#健康检查}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `global.tcp_check_url` | `https://www.gstatic.com/generate_204` | 全局 HTTP 探测目标列表；健康检查使用第一个 URL。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tcp_check_http_method` | `HEAD` | 全局 HTTP 健康检查方法。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.udp_check_dns` | `dns.google:53`, `8.8.8.8`, `2001:4860:4860::8888` | UDP 探测目标；第一个 IP 地址优先于域名。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.check_interval` | `30s` | 全局健康检查间隔。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.check_tolerance` | `50ms` | URLTest 切换成员所需的默认延迟改善量。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |

## 日志 {#日志}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `global.log_level` | `info` | 启动日志过滤级别。有效的 `RUST_LOG` 优先，其次为 `--debug`。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.log_file` | `''` | 可选日志文件。相对路径基于 `data_dir`；`--log-file` 优先。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |

## 接口与内核 {#接口与内核}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `global.lan_interface` | `[]` | 转发流量的 LAN 接口；为空时不挂接 LAN。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.wan_interface` | `[]` | 本机流量的接口；`auto` 跟随度量值最低的 IPv4 默认路由。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tproxy_port` | `12345` | 透明 TCP/UDP 监听端口。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.so_mark_from_dae` | `0` | 为零时实际标记为 `0x100`；否则使用配置的套接字绕过标记。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.nfqueue_enable` | `true` | 请求对路由尚未确定的 LAN 转发 UDP 使用 NFQUEUE 暂存。需要真实 eBPF 后端。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |

要处理 LAN 客户端流量，将 `global.lan_interface` 设为连接这些客户端的接口：

- 主路由使用 LAN 网桥，通常为 `br-lan`；客户端已将此路由器设为网关。
- 使用旁路由时，还须将客户端的网关与 DNS 设为旁路由的 LAN 地址，可逐台设置，也可通过主路由的 DHCP 设置下发。

不要假定 `lan_interface: auto` 会选择 LAN。它选择度量值最低的 IPv4 默认路由所在接口，在主路由上通常是 WAN 接口。

## 连接与预热 {#连接与预热}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `global.dial_mode` | `domain` | 域名识别与路由重评估模式：`ip`、`domain`、`domain+`、`domain++`。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.bootstrap_resolver` | `''` | 节点域名及控制平面连接的解析器。按域名直连下载地理数据需要此项。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tls_implementation` | `tls` | 选择常规 TLS 或 `utls` ClientHello 模拟。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.max_concurrent_dials` | `64` | 代理物理连接与握手的请求上限；资源预算可能降低此值。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.udp_warm_node_count` | `0` | UDP 预热候选节点数；零表示关闭。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.preconnect_node_count` | `auto` | 仅在启动时预热 TCP；`auto` 最多选择八个合格节点。重载不会再次预热。 | [重启后预热](what-doona-can-change.md#startup-preconnect) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |

## 接受但没有运行效果的字段 {#接受但没有运行效果的字段}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `global.tproxy_port_protect` | `true` | 仅保存；不控制端口保护。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.pprof_port` | `0` | 仅保存；不会启动 pprof 服务。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.auto_config_kernel_parameter` | `false` | 仅保存；不控制数据路径固定的 sysctl 设置。 | [重启](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.disable_waiting_network` | `false` | 仅保存；不改变启动等待行为。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.allow_insecure` | `false` | 仅保存；不会全局关闭证书验证。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.sniffing_timeout` | `30ms` | 仅保存；不设置实际嗅探超时。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.mptcp` | `false` | 仅保存；不启用 MPTCP。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.fallback_resolver` | `8.8.8.8:53` | 仅保存；不选择备用解析器。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tls_fragment` | `false` | 仅保存；不启用 TLS 分片。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tls_fragment_length` | `''` | 仅保存；不设置分片长度。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tls_fragment_interval` | `''` | 仅保存；不设置分片间隔。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.bandwidth_max_tx` | `''` | 仅保存；不限制发送带宽。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.bandwidth_max_rx` | `''` | 仅保存；不限制接收带宽。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.utls_imitate` | `chrome_auto` | 接受指纹名称，但不会改变唯一支持的 Chrome 配置。 | [重载](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |

## DNS 监听与 Clash 兼容设置 {#dns-监听与-clash-兼容设置}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `dns.bind` | `''` | 独立 DNS 监听地址；为空时关闭。须在 doona 之外编辑。 | [重启](what-doona-can-change.md#restart-dns) | [dns](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/dns.md) |
| `experimental.clash_api.external_controller` | `''` | Clash API 监听地址；为空时关闭。 | [重启](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.clash_api.external_ui` | `''` | Clash 仪表板目录。 | [重启](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.clash_api.secret` | `''` | Clash Token；含此声明的来源在 doona 中只读。 | [重启](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.clash_api.default_mode` | `Rule` | 初始 Clash 模式：`Rule`、`Global` 或 `Direct`。 | [重启](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |

## 运行时 API 字段，不是 DAE 键 {#运行时-api-字段不是-dae-键}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `record_flows`, `record_logs`, `record_dns_log` | `auto` | 按需记录模式：`auto`、`on`、`off`；仍受配置禁用条件限制。 | [即时](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `log.level` | 来自 `global.log_level` | 即时日志过滤级别；覆写后也影响控制台和文件输出。 | [即时](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `log.buffered_records` | `512` | 日志缓冲容量；`64`–`512`。 | [即时](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `dns_log.max_records` | `512` | DNS 日志容量；`64`–`512`。 | [即时](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `flows.max_flows` | `1024` | 流记录容量；`64`–`1024`。 | [即时](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `flows.retention_seconds` | `300` | 已结束流的保留时间；`1`–`300` 秒。 | [即时](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |

在设置页修改这些字段，不要写入 DAE 文件。成功启用配置或重启会重置这些值。见[运行时覆盖条件](feature-requirements.md#req-runtime-options)。

## 持久保存的地理数据设置，不是 DAE 键 {#持久保存的地理数据设置不是-dae-键}

| 键 | 默认值 | doona 如何使用 | 生效方式 | honk 参考 |
| --- | --- | --- | --- | --- |
| `geodata.geosite.urls`, `geodata.geoip.urls` | [GitHub](https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geosite.dat) + [jsDelivr](https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat)；GeoIP 使用 `geoip.dat` | 已存储的 URL 列表；启动配置中的 URL 优先。 | [即时，持久保存](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `geodata.download` | 路由规则 | 下载路由及可选的 `group_id`；启动配置中的路由优先。 | [即时，持久保存](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `geodata.verify_checksum` | `true` | 下载校验和验证。 | [即时，持久保存](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `geodata.auto_update.enabled` | `true` | 启用定时更新检查。 | [即时，持久保存](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `geodata.auto_update.interval_hours` | `24` | 定时检查间隔，单位为小时。 | [即时，持久保存](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |

在设置页修改这些字段需要凭据和可用的状态数据库。保存设置不会启用新的资源文件。见[地理数据设置条件](feature-requirements.md#req-geodata-settings)。

## 别名与迁移键 {#别名与迁移键}

| 旧名称 | 当前名称 |
| --- | --- |
| `experimental.native_api.geosite_download_url` | `assets.geodata.geosite` |
| `experimental.native_api.geoip_download_url` | `assets.geodata.geoip` |
| `experimental.native_api.geodata_download_detour` | `assets.geodata.route` |
| `experimental.clash_api.external_ui_download_url` | `assets.ui.url` |
| `experimental.clash_api.external_ui_download_detour` | `assets.ui.route` |
| `experimental.udp_nfqueue.enabled` | `global.nfqueue_enable` |

新文件请使用当前名称。资源别名会产生 `legacy-assets-key` 警告；非空旧值与对应新键并用会报 `conflicting-assets-setting`。旧 NFQUEUE 区块会产生迁移警告，仅在未设置 `global.nfqueue_enable` 时提供该值。`experimental.cache_file.path` 和 `cache_id` 仅用于旧数据导入，不指定当前数据库位置。`store_fakeip` 没有效果。

## 完整注释示例 {#完整注释示例}

此主文件包含教程所用的订阅、组、域名规则、DNS 规则和下载默认值。启动 honk 前，请替换订阅 URL。

将 API 凭证与节点页修改的主文件分开。见[配置来源写入条件](feature-requirements.md#req-config-edit)。

### 主文件 {#主文件}

```dae
# /etc/honk/config.dae
# 将 API 凭证保存在单独的引入文件中。
include {
    config.d/*.dae
}

# 本机流量、存储、检查与连接设置。
global {
    wan_interface: auto
    # 如需处理 LAN 客户端流量，取消注释并填写其网关接口。
    # lan_interface: br-lan
    data_dir: '/var/lib/honk'
    store_subscribe: true
    log_level: info
    # 可选的追加日志文件，路径相对于 data_dir。
    # log_file: 'honk.log'
    tproxy_port: 12345
    so_mark_from_dae: 0
    nfqueue_enable: true
    tcp_check_url: 'https://www.gstatic.com/generate_204'
    tcp_check_http_method: HEAD
    udp_check_dns: 'dns.google:53', '8.8.8.8', '2001:4860:4860::8888'
    check_interval: 30s
    check_tolerance: 50ms
    dial_mode: domain
    bootstrap_resolver: '1.1.1.1:53'
    tls_implementation: tls
    max_concurrent_dials: 64
    preconnect_node_count: auto
    udp_warm_node_count: 0
}

# 将占位地址替换为供应商的订阅 URL。
subscription {
    harbor: 'https://subscription.example/sub'
}

# 可选静态节点；填写真实节点信息后再取消注释。
node {
    # backup: 'socks5://192.0.2.2:1080'
}

# 根据移动平均延迟选择 harbor 的节点。
group {
    # 流量规则和 DNS 上游共用此组。
    proxy {
        filter: subtag('harbor')
        policy: min_moving_avg
    }
}

# 仅将教程域名送入此组。
routing {
    domain(full: example.com) -> proxy
    fallback: direct
}

# 通过同一组解析教程域名。
dns {
    # 使用 IP 地址的 HTTPS 端点，避免依赖其域名的初始解析。
    upstream {
        remote_dns: 'https://1.1.1.1/dns-query' -> proxy
    }
    # 其他 DNS 请求保留原目标。
    routing {
        # 匹配与流量规则相同的完整域名。
        request {
            qname(full: example.com) -> remote_dns
            fallback: asis
        }
        # 保留所选上游的应答。
        response {
            fallback: accept
        }
    }
}

# 下载默认值；仅设置这些 URL 不会加载地理数据资源。
assets {
    route: routing
    # 路由规则加载对应资源后的更新来源。
    geodata {
        geosite: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geosite.dat'
        geoip: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geoip.dat'
        route: direct
    }
    # 仅用于单独配置的 Clash 仪表板，不用于 doona。
    ui {
        url: 'https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip'
        route: direct
    }
    # 各订阅条目的选项可以覆写这些默认值。
    subscription {
        interval: 86400s
        cache: true
        # ua: 'clash.meta'
    }
}
```

### API 文件 {#api-文件}

将[快速入门](quick-start.md)中的 API 块写入 `/etc/honk/config.d/api.dae`；使用独立界面文件时，改用[独立界面配置](install.md)。

然后[重启 honk](service-management.md)。对应的界面操作见[为第一条连接设置路由](tutorial.md)。

</div>

---

来源：[doona-docs](https://github.com/Zakkaus/doona-docs)，采用 [CC BY 4.0 许可证](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
