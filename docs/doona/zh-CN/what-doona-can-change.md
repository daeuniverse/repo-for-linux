---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# doona 可以修改什么 {#title-doona-可以修改什么}

doona 通过不同的控制项修改配置源、运行时状态、持久保存的地理数据设置和浏览器偏好。关闭 `experimental.native_api.config_write` 会禁用配置写入，但不会禁用所有操作。

## 更改保存在哪里 {#更改保存在哪里}

下表中的**配置源权限**指 `experimental.native_api.config_write: true`、Token 或密码认证、可用的配置协调器，以及完整且可写的配置源。数据库配置存储被阻止写入时，也无法进行普通的配置源编辑。引入文件与主文件遵循相同的配置源规则。

**即时生效**表示无需重载配置。**重载**表示写入必须通过校验并完成激活操作。**重启**表示必须在 doona 之外编辑配置，再重启 honk。

| 更改 | 条件 | 保存与生效方式 |
| --- | --- | --- |
| <a name="change-sources"></a><span id="change-sources"></span>配置源文本：`node`、`subscription`、`group`、`routing`、`dns` 中除 `bind` 之外的字段、可重载的 `global` 字段，以及 `assets.subscription` | 配置源权限、当前修订、所需的本地依赖可用 | 文件模式替换文件；`--store db` 模式保存修订。写入后重载。 |
| 添加或删除受管节点和订阅源 | 可写的主配置源及对应的 `can_manage` 能力 | 写入后重载。受管删除不适用于内置节点、订阅源生成的节点或引入文件中的声明。 |
| 编辑订阅声明 | 包含该声明的配置源完整且可写 | 写入配置源后重载。 |
| <a name="change-groups"></a><span id="change-groups"></span>组字段：`policy`、`default`、`final`、`tolerance`、`idle_timeout`、`interrupt_connections`、`check_url` | 所属配置源可写，支持 `groups.config_patch`，且组的 `mutable_config` 包含该字段 | 写入后重载。支持可写的引入文件。API 将 `default` 和 `final` 分别命名为 `default_member_id` 和 `final_outbound`。 |
| <a name="change-runtime"></a><span id="change-runtime"></span>运行时 `record_flows`、`record_logs`、`record_dns_log`、`log.level`、`log.buffered_records`、`dns_log.max_records`、`flows.max_flows`、`flows.retention_seconds` | API 请求获准、后端声明支持该字段、配置允许记录且值未超出限制 | 即时生效。不需要 `config_write`。重启或已接受的配置激活会重置这些覆盖值。 |
| <a name="change-geodata"></a><span id="change-geodata"></span>地理数据 URL 列表、下载路由、校验和验证、自动更新计划及重置 | 凭据、可用的状态数据库，以及后端声明支持的对应设置 | 即时生效，保存在状态数据库中。设置请求不下载或激活文件，也不需要 `config_write`。更新可用时，doona 在保存来源 URL 后另行启动更新。 |
| 更新地理数据文件 | 配置写入权限、凭据、已加载且具备路径和 URL 的资源 | 下载、替换文件，然后激活。见[地理数据更新条件](feature-requirements.md#req-geodata-update)。 |
| 选择组成员、固定自动策略的成员或取消固定 | 后端运行中、组选择能力，以及组的 `can_select` 或 `can_override` | 即时生效的运行时操作。不写入配置源，也不需要 `config_write`。Selector 的持久保存依赖状态缓存，且 `experimental.cache_file.enabled` 不能为 `false`。 |
| 外观、语言、布局、旗帜覆盖和探测偏好 | 浏览器支持及存储可用 | 在当前浏览器中即时生效，不修改 honk 配置。背景图片通过 IndexedDB 持久保存。 |

honk 启动时，启动配置中明确指定的地理数据 URL 和下载路由会替换对应的已存储覆盖值。配置源编辑若改变了解析后的原生 API 设置，就需要重启。见[地理数据设置](feature-requirements.md#req-geodata-settings)。

## 必须重启的设置 {#必须重启的设置}

API 会在写入前拒绝以下实际生效值的更改。请使用外部编辑器修改，再[重启 honk](service-management.md)。编辑器可能显示需要重启的诊断或 `listener_settings_changed`；见[写入被拒绝](troubleshooting.md#read-only)。

| 区块 | 只能通过重启生效的设置 |
| --- | --- |
| <a name="restart-dns"></a><span id="restart-dns"></span>`dns` | [`bind`](/zh-CN/honk/reference/dns#独立-listener-bind) |
| <a name="restart-global"></a><span id="restart-global"></span>`global` | [全局字段](/zh-CN/honk/reference/global#字段) |
| <a name="restart-native"></a><span id="restart-native"></span>`experimental.native_api` | [`native_api`](/zh-CN/honk/reference/experimental#native-api) |
| <a name="restart-clash"></a><span id="restart-clash"></span>`experimental.clash_api` | [`clash_api`](/zh-CN/honk/reference/experimental#clash-api) |
| <a name="restart-cache"></a><span id="restart-cache"></span>`experimental.cache_file` | [`cache_file`](/zh-CN/honk/reference/experimental#cache-file) |
| <a name="restart-assets"></a><span id="restart-assets"></span>`assets` | [重启与 reload](/zh-CN/honk/reference/assets#重启与-reload) |

## 配置源为何只读 {#配置源为何只读}

查看**配置**页的配置源标记。已禁用 `config_write` 或缺少凭据、声明了原生 API 或 Clash API 监听器密钥、文本中含有已掩码的监听器密钥值，或数据库无法记录活动修订时，配置源会变为只读。完整的来源信任边界和拒绝代码见 honk 的[配置来源、校验与操作](/zh-CN/honk/reference/api#配置来源、校验与操作)。

配置源集合或写入协调器不可用时，配置操作也不可用。doona 拒绝不完整的配置源内容。写入不能引入监听器密钥、改变包含凭据的配置源集合，或修改监听器设置。

将监听器密钥放在单独的引入文件中，并在 doona 之外编辑该文件。重启 honk 后，重新打开配置页，检查其他配置源的标记。如果其他配置源含有相同的已掩码密钥值，仅拆分密钥声明仍无法解除只读。见[只读配置源与写入被拒绝](troubleshooting.md#read-only)。

## 文件系统要求 {#文件系统要求}

可写标记不代表文件系统允许替换文件。在文件模式下，honk 必须读取原文件，在同一目录创建并同步临时文件，再将临时文件重命名以替换原文件，最后同步目录。服务用户须能访问所在目录，并有权在其中创建和替换目录项。

配置写入会拒绝源路径中的符号链接和非普通文件。替换操作修改的是目录项，因此仅检查源文件的写入权限位，无法判断能否写入。同时修改文件也可能导致写入被拒绝。应用后，确认操作成功，再重新读取配置源核对修改。

地理数据更新有单独的目标位置规则：软件包中的资源通常由数据目录中的文件替代。见[地理数据位置](feature-requirements.md#req-geodata-update)。

## 已接受但没有预期即时效果的字段 {#已接受但没有预期即时效果的字段}

部分兼容字段会被接受并保存，但不会改变流量。见 honk 的[全局字段](/zh-CN/honk/reference/global#字段)和[非 DAE 格式](/zh-CN/honk/reference/assets#非-dae-格式)。

| 字段 | 实际行为 |
| --- | --- |
| <a name="startup-preconnect"></a><span id="startup-preconnect"></span>`global.preconnect_node_count` | 供启动预热使用。接受配置源编辑不会再次执行预热。重启 honk 后，启动预热才会使用新值。 |

编辑被接受只表示操作已开始。操作状态变为 `succeeded` 后更改才生效，请重新读取来源确认。

</div>
