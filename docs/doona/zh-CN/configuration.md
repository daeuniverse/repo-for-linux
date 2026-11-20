---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 配置参考 {#config}

doona 通过原生 API 读写 honk 配置。键、默认值和语法见 honk 的[全局](/zh-CN/honk/reference/global)、[experimental](/zh-CN/honk/reference/experimental)、[assets](/zh-CN/honk/reference/assets)、[DNS](/zh-CN/honk/reference/dns)、[路由](/zh-CN/honk/reference/routing)、[组](/zh-CN/honk/reference/groups)和[订阅](/zh-CN/honk/reference/subscription)参考。初次使用请从[快速入门](quick-start.md)开始，或按[为第一条连接设置路由](tutorial.md)操作。

以下小节按 doona 依赖的设置分组，并链接 honk 中对应的字段契约。修改何时生效见 [doona 可以修改什么](what-doona-can-change.md)。

## 原生 API 与认证 {#原生-api-与认证}

doona 需要 `experimental.native_api.enabled: true`、`listen` 地址，以及 `password_auth: true` 或 `secret`；要让 doona 写入配置，还需 `config_write: true`。全部字段与认证组合见 honk 的 [`native_api`](/zh-CN/honk/reference/experimental#native-api)。

## 数据目录与状态数据库 {#数据目录与状态数据库}

`global.data_dir` 选择运行数据根目录。管理员账号和已存储的地理数据设置位于其下的状态数据库；见 honk 的[数据目录与资源路径](/zh-CN/honk/reference/global#数据目录与资源路径)和[配置数据库](/zh-CN/honk/reference/api#配置数据库-store-db)。

## 资源与订阅默认值 {#资源与订阅默认值}

这些键设置下载路由和订阅默认值。见 honk 的 [assets 字段](/zh-CN/honk/reference/assets#字段)和[订阅字段](/zh-CN/honk/reference/subscription#字段)。

## 记录权限 {#记录权限}

`record_traffic` 和 `record_memory` 提供活动与系统状态页的流量和内存图表。`record_flows` 提供路由日志和规则命中记录，`record_logs` 提供日志页，`record_dns_log` 提供 DNS 解析日志。记录权限与按需语义见 honk 的[共用采样与可选历史](/zh-CN/honk/reference/experimental#共用采样与可选历史)。

## 健康检查 {#健康检查}

`tcp_check_url`、`tcp_check_http_method`、`udp_check_dns`、`check_interval` 和 `check_tolerance` 见 honk 的[全局字段](/zh-CN/honk/reference/global#字段)。

## 日志 {#日志}

见 honk 的 [`log_level`](/zh-CN/honk/reference/global#log-level) 和 [`log_file`](/zh-CN/honk/reference/global#log-file)。

## 接口与内核 {#接口与内核}

doona 在系统状态中显示已绑定接口和数据面详情，具体语义由 honk 定义。见 honk 的[网卡语义](/zh-CN/honk/reference/global#网卡语义)、[`nfqueue_enable`](/zh-CN/honk/reference/global#nfqueue-enable)和[独立 LAN 接口的旁路由](/zh-CN/honk/how-to-start#独立-lan-接口的旁路由)。

## 连接与预热 {#连接与预热}

见 honk 的[全局字段](/zh-CN/honk/reference/global#字段)和[预热与拨号预算](/zh-CN/honk/configuration#预热与拨号预算)。

## 接受但没有运行效果的字段 {#接受但没有运行效果的字段}

honk 接受部分兼容字段，但它们没有运行时消费者。见 honk 的[全局字段](/zh-CN/honk/reference/global#字段)。

## DNS 监听与 Clash 兼容设置 {#dns-监听与-clash-兼容设置}

见 honk 的[独立 DNS 监听](/zh-CN/honk/reference/dns#独立-listener-bind)和 [`clash_api`](/zh-CN/honk/reference/experimental#clash-api)。声明 Clash API 密钥会使对应来源在 doona 中变为只读。

## 运行时 API 字段，不是 DAE 键 {#运行时-api-字段不是-dae-键}

这些字段通过**设置 → 临时运行时覆写**修改，不写入 DAE 文件；接受配置激活或重启后会被重置。字段范围与重置行为见 honk 的[原生日志与运行时设置](/zh-CN/honk/reference/api#原生日志与运行时设置)。

## 持久保存的地理数据设置，不是 DAE 键 {#持久保存的地理数据设置不是-dae-键}

这些设置通过**设置 → 地理数据**修改，需要凭证和可用的状态数据库；保存设置不会激活新文件。见 honk 的 [geodata 来源与自动更新](/zh-CN/honk/reference/api#geodata-来源与自动更新)和[主文件条目与 geodata 管理](/zh-CN/honk/reference/api#主文件条目与-geodata-管理)。

## 别名与迁移键 {#别名与迁移键}

新文件请使用当前名称。honk 的[旧版字段](/zh-CN/honk/reference/experimental#旧版字段)列出旧名称和迁移警告。

## 完整注释示例 {#完整注释示例}

将以上小节合在一起的注释示例见 honk 的[完整配置](/zh-CN/honk/configuration#完整配置)。doona 的[教程](tutorial.md)通过界面构建同一份配置。

</div>
