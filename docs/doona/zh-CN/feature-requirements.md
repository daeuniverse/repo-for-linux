---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 功能启用条件 {#title-功能启用条件}

在表中找到要使用的标准版功能，按对应章节检查条件并启用。修改配置前，先将列出的能力与**系统状态 → 后端能力**对照。

| 功能 | 主要条件 | 章节链接 |
| --- | --- | --- |
| 登录与管理员初始化 | 原生 API 与认证 | [启用条件](#req-sign-in) |
| 配置源、表单与出站模式 | 可写的配置源 | [启用条件](#req-config-edit) |
| 配置校验 | 完整校验能力 | [启用条件](#req-validation) |
| 导出、导入与修订 | 对应操作的能力 | [启用条件](#req-revisions) |
| 系统状态与实时指标 | 后端提供运行时指标 | [启用条件](#req-runtime-status) |
| 流量与内存历史 | 启用启动记录器 | [启用条件](#req-traffic-history) |
| 节点与订阅声明 | 所属配置源可写 | [启用条件](#req-nodes) |
| 订阅更新 | 可更新的订阅 | [启用条件](#req-subscription-refresh) |
| 组列表、选择与固定 | 组选择能力 | [启用条件](#req-group-selection) |
| 组创建、编辑与检查设置 | 完整可写的声明 | [启用条件](#req-group-edit) |
| 延迟探测 | 兼容的探测选项 | [启用条件](#req-probes) |
| 连接与关闭流量 | 关闭要求用户空间传输 | [启用条件](#req-connections) |
| 流程与已记录的规则命中 | 正在记录的流程记录器 | [启用条件](#req-flows) |
| 路由规则、DNS 规则与模板 | 可写的规则源 | [启用条件](#req-rules) |
| 路由追踪 | 路由追踪能力 | [启用条件](#req-routing-trace) |
| 事件 | 事件能力 | [启用条件](#req-events) |
| 日志 | 正在记录的日志记录器 | [启用条件](#req-logs) |
| DNS 查询与上游选择 | DNS 查询能力 | [启用条件](#req-dns-query) |
| DNS 缓存操作 | 对应的缓存操作能力 | [启用条件](#req-dns-cache) |
| DNS 日志与统计 | 正在记录的 DNS 记录器 | [启用条件](#req-dns-log) |
| 运行时覆盖 | 后端提供对应字段 | [启用条件](#req-runtime-options) |
| 地理数据可用性 | 已加载的资源一致 | [启用条件](#req-geodata) |
| 手动更新地理数据 | 已加载资源有可用 URL | [启用条件](#req-geodata-update) |
| 地理数据设置与重置 | 可用的状态数据库 | [启用条件](#req-geodata-settings) |
| 操作、重载、暂停与恢复 | 后端支持对应操作 | [启用条件](#req-reload-suspend) |
| 进程名路由与 UDP 追踪详情 | 所需的内核钩子 | [启用条件](#req-process-routing) |
| 保留选择与探测历史 | 可用的状态缓存 | [启用条件](#req-persistence) |
| 外观与浏览器存储 | 浏览器支持且存储可用 | [启用条件](#req-browser-settings) |

能力名称指原生 API 的 `resources` 对象。缺少资源就表示该资源不可用，仅安装新版界面无法补充。**设置 → 临时运行时覆盖**只能修改后端声明支持的字段。保存与激活规则见 [doona 可以修改什么](what-doona-can-change.md)。

错误码用于识别 API 失败，与只读原因、运行时降级码和地理数据操作阶段不同。禁用的按钮可能直接说明本地缺少的条件，不会发送请求或产生 API 错误。


## 登录与管理员初始化 {#req-sign-in}

**所需条件**

- [兼容的 honk 构建](requirements.md#honk-version)、已启用的原生 API，以及配置的登录方式。
- 在 `experimental.native_api` 中，密码模式需要 `password_auth: true` 和可用的状态数据库；Token 模式使用 `secret`。
- 管理员初始化仅接受来自回环、私有或链路本地地址的连接。

**在 doona 中检查**

- 登录页显示需要初始化、密码还是 Token。
- 系统状态显示引擎与后端能力。

**启用步骤**

1. 在 doona 之外编辑 `experimental.native_api`，设置 `enabled: true` 和登录方式。使用主机名访问时，配置允许的主机和浏览器来源，再重启 honk。
2. 从网关或局域网按[首次登录](first-sign-in.md)操作。
3. 在系统状态中检查引擎与后端能力。

**错误**

- [登录失败](troubleshooting.md#sign-in)：[`setup_required`](troubleshooting.md#sign-in)、[`setup_already_completed`](troubleshooting.md#sign-in)、[`invalid_credentials`](troubleshooting.md#sign-in)、[`authentication_required`](troubleshooting.md#sign-in)、[`permission_denied`](troubleshooting.md#sign-in)。
- 如果没有 API，见[缺少原生 API](troubleshooting.md#no-native-api)。


## 配置源、表单与出站模式 {#req-config-edit}

**所需条件**

- 读取需要 `config.available`，且已加载的配置源集合不能超出后端的字节数和配置源数量限制。
- 编辑需要 `config.writable`、`experimental.native_api` 中的 `config_write: true`、凭据、完整的配置源内容，以及可写的所属配置源。
- 创建需要 `config.create`，且路径必须由引入模式加载。
- 全局设置和模块表单需要检测到的引擎支持。honk 出站模式控制项修改主配置源；全局模式还需要出站目标。

**在 doona 中检查**

- 配置页显示配置源标记、诊断和操作被禁用的原因。
- 活动页显示 honk 出站模式控制项。

**启用步骤**

1. 在 doona 之外为 `experimental.native_api` 启用 `config_write: true` 并设置凭据，再重启 honk。
2. 解决配置源只读的原因。将监听器密钥放在单独的文件中。
3. 应用更改，确认操作成功，并重新读取配置源核对内容。

**错误**

- [写入失败](troubleshooting.md#read-only)：[`stale_revision`](troubleshooting.md#read-only)、[`state_conflict`](troubleshooting.md#read-only)、[`permission_denied`](troubleshooting.md#sign-in)。
- [拒绝原因](troubleshooting.md#read-only)：[`writes_disabled`](troubleshooting.md#read-only)、[`configuration_unavailable`](troubleshooting.md#read-only)、[`listener_secret_source`](troubleshooting.md#read-only)、[`listener_secret_in_content`](troubleshooting.md#read-only)、[`listener_settings_changed`](troubleshooting.md#read-only)、[`unsafe_path`](troubleshooting.md#read-only)。
- 缺少本地依赖时，见[离线依赖](troubleshooting.md#offline-dependency)。

**详细说明**

- 外部编辑可能使待处理写入所用的修订失效。
- 出站模式属于配置更改，不是独立的运行时开关。


## 配置校验 {#req-validation}

**所需条件**

- `config_validate.available`、后端声明支持的 `full` 模式，以及获准的控制请求。
- 完整的有效配置源集合必须符合校验限制，包括在本地解析的引入文件。主配置源和引入配置源均可校验。

**在 doona 中检查**

- 查看编辑器的校验按钮和配置页诊断。

**启用步骤**

1. 如果缺少完整校验能力，使用实现该能力的后端。
2. 恢复缺少的引入文件或地理数据依赖，再次选择校验。
3. 确认结果没有错误诊断。校验不会应用草稿。

**错误**

- 请求错误：`request_too_large`、`invalid_request`。
- 离线依赖诊断见[依赖失败](troubleshooting.md#offline-dependency)。


## 导出、导入与修订 {#req-revisions}

**所需条件**

- 导出：`config_export.available`。导入：`config_import.available`，并遵守 `replace_required`。
- 列出修订：`config_revisions.available`。恢复：还需要 `can_activate`。
- honk 的导入和修订需要 `--store db`；文件模式仍可导出。导入需要可编辑的配置存储。

**在 doona 中检查**

- 配置 → 备份与修订显示各项 `x-honk` 能力对应的控制项。

**启用步骤**

1. 启动时选择所需的存储模式，再刷新备份与修订。
2. 导入或恢复后，等待操作完成，并验证活动配置。
3. 如果结果未知，先刷新原操作的状态，再决定是否重试。

**错误**

- 可能出现 [`import_entry_changed`](troubleshooting.md#read-only) 拒绝原因和配置校验失败。见[写入被拒绝](troubleshooting.md#read-only)。

**详细说明**

- 修订记录失败而阻止普通写入时，只要具备配置写入权限，仍可恢复已记录的最新修订。


## 系统状态与实时指标 {#req-runtime-status}

**所需条件**

- 系统状态：`runtime`。内存：`runtime_memory` 及各项后端声明支持的指标。
- 出站计数器：`runtime_outbounds`。数据路径详情：`datapath` 及后端声明支持的详情类型。

**在 doona 中检查**

- 查看系统状态中的引擎、内存、数据路径和后端能力卡片。

**启用步骤**

1. 使用兼容的后端，解决对应卡片显示的降级原因。
2. 刷新后检查预期读数是否出现。不能将缺失的指标视为零。

**错误**

- 计数器读取：`temporarily_unavailable`。见[原生 API 访问](troubleshooting.md#no-native-api)和[状态数据库失败](troubleshooting.md#state-db)。
- 认证失败使用[通用登录错误码](troubleshooting.md#sign-in)。

**详细说明**

- 后端可以提供基本运行时状态，同时缺少部分测量值。


## 流量与内存历史 {#req-traffic-history}

**所需条件**

- 流量历史：`traffic_history.available`，以及 `experimental.native_api` 中的 `record_traffic: true`。
- 内存历史：`memory_history.available`，以及 `experimental.native_api` 中的 `record_memory: true`。

**在 doona 中检查**

- 查看活动和系统状态中的流量、内存图表，以及后端能力中的对应条目。

**启用步骤**

1. 在 doona 之外为 `experimental.native_api` 启用对应记录器，再重启 honk。
2. 等待采样累积，确认图表新增样本。

**错误**

- 历史端点不可用时返回 [`capability_not_supported`](troubleshooting.md#no-native-api)。见[后端兼容性](troubleshooting.md#no-native-api)。

**详细说明**

- 两个记录器是独立的启动设置，不是运行时开关。
- 后端声明最大时间窗口和样本数。有容量限制的环形缓冲区可能无法保留整个最大时间窗口。


## 节点与订阅声明 {#req-nodes}

**所需条件**

- 列表：`nodes.available` 和 `providers.available`。受管创建与删除：对应的 `can_manage` 及可写的主配置源。
- 订阅编辑：唯一的声明、honk 配置语法，以及完整且可写的所属配置源。
- 更新间隔、User-Agent 和缓存等创建选项必须出现在 `providers.create_options` 中。

**在 doona 中检查**

- 在节点页查看添加、编辑和删除操作的说明。

**启用步骤**

1. 解决[配置源权限](what-doona-can-change.md)。需要写入权限时，在 doona 之外为 `experimental.native_api` 启用 `config_write: true` 并设置凭据，再重启 honk。
2. 应用更改，并核对生成的条目。
3. 更新新建的 honk 订阅源以加载节点；新建时尚未获取订阅。

**错误**

- [`capability_not_supported`](troubleshooting.md#no-native-api)、[`state_conflict`](troubleshooting.md#read-only)、`unsupported_value`。节点与订阅的写入限制见[写入被拒绝](troubleshooting.md#read-only)。

**详细说明**

- 受管删除不适用于内置节点、订阅源生成的节点和引入文件中的声明。
- 组最终出站所引用的节点，也不能通过受管删除移除。


## 订阅更新 {#req-subscription-refresh}

**所需条件**

- `providers.can_refresh`、`operations.available`，以及可更新的订阅源。
- honk 需要正在运行的订阅管理器和已启用的订阅。接受操作时，后端必须处于运行状态。

**在 doona 中检查**

- 节点页显示更新操作、订阅源状态、节点数和最近一次错误。

**启用步骤**

1. 启用订阅，检查 URL 和下载路由。
2. 更新订阅，等待操作完成，确认更新后的状态和节点。

**错误**

- [`capability_not_supported`](troubleshooting.md#no-native-api)、[`state_conflict`](troubleshooting.md#read-only)、`temporarily_unavailable`、`resource_not_found`。后端不可用时，见[原生 API 访问](troubleshooting.md#no-native-api)。
- 订阅源错误 `route_unavailable`：所选路由没有可用节点。
- 激活时的依赖失败见[离线依赖](troubleshooting.md#offline-dependency)。

**详细说明**

- 内置的内联节点源不是可下载的订阅。


## 组列表、选择与固定 {#req-group-selection}

**所需条件**

- 策略页：`groups.available`。选择成员：组选择能力和 `can_select`。
- 固定或清除自动策略的覆盖选择：`can_override`。
- 后端运行中。这些操作不需要 `config_write`，也不编辑配置源。

**在 doona 中检查**

- 查看策略页中的组控制项。

**启用步骤**

1. 选择允许手动选择的组，或允许覆盖的策略。
2. 选择或清除成员，并检查所选成员或覆盖标记。

**错误**

- [`state_conflict`](troubleshooting.md#read-only)、`resource_not_found`。API 访问失败时，见[登录失败](troubleshooting.md#sign-in)。
- 重启后选择丢失时，检查[持久保存条件](#req-persistence)。


## 组创建、编辑与检查设置 {#req-group-edit}

**所需条件**

- 创建：完整且可写的主配置源。编辑：配置已加载，且完整、可写的配置源中只有一处对应声明。
- 声明缺失、重复或不完整时，即使已启用配置写入，编辑仍会禁用。
- 组检查设置：`groups.config_patch`，且 `mutable_config` 中包含所需字段。字段列表见 [doona 可以修改什么](what-doona-can-change.md)。

**在 doona 中检查**

- 策略页会说明编辑或某个字段不可用的原因。

**启用步骤**

1. 在组编辑器之外解决重复声明，或恢复完整的配置源读取内容。
2. 如果写入已禁用，在 doona 之外为 `experimental.native_api` 启用 `config_write: true` 并设置凭据，再重启 honk。
3. 应用更改，激活后核对组配置。

**错误**

- 修订冲突：[`stale_revision`](troubleshooting.md#read-only)、[`state_conflict`](troubleshooting.md#read-only)。配置源拒绝原因见[只读配置源](troubleshooting.md#read-only)。

**详细说明**

- 配置源编辑与受限的组 PATCH 控件所需条件不同。


## 延迟探测 {#req-probes}

**所需条件**

- `probes.available`，且后端提供的目标类型、探测种类、传输协议和 IP 地址族存在兼容的交集。
- 组必须支持所有请求的传输协议。每个所选节点的协议都必须支持探测种类和传输协议，混合选择也不例外。

**在 doona 中检查**

- 查看设置 → 延迟探测，以及节点或策略页的探测控制项。

**启用步骤**

1. 选择界面提供的探测和 IP 地址族。
2. 执行探测，查看各类探测的结果。

**错误**

- 请求被拒绝：`unsupported_value`、`rate_limited`、`temporarily_unavailable`。传输失败显示在探测结果中。
- 缺少探测支持时，见[原生 API 兼容性](troubleshooting.md#no-native-api)。

**详细说明**

- 已保存的选择不再适合目标时，doona 优先选择 HTTP；不可用时选择第一个兼容选项。
- 交集为空时，doona 无法提供探测。


## 连接与关闭流量 {#req-connections}

**所需条件**

- 列表：`connections.available`。关闭：`can_close`、获准的控制请求，以及在用户空间传输的连接。
- 批量关闭不能超出后端声明的最大匹配条目数。

**在 doona 中检查**

- 查看连接页和关闭操作的说明。

**启用步骤**

1. 通过已配置的接口产生流量，确认出现连接条目。
2. 关闭符合条件的连接，确认它从实时列表中消失。

**错误**

- [`state_conflict`](troubleshooting.md#read-only)、`resource_not_found`、`request_too_large`。
- 见[连接或规则页一直为空](troubleshooting.md#连接或规则页一直为空)。

**详细说明**

- 列表显示 honk 在用户空间处理的连接。内核直接转发的流量不会出现，例如 `direct` 流量。


## 流程与已记录的规则命中 {#req-flows}

**所需条件**

- `flows.available`、`experimental.native_api` 中的 `record_flows: true`，以及正在记录的策略。
- 检查运行时设置中的 `recording.flows.active`。能力可用不代表正在采集。

**在 doona 中检查**

- 查看分流页、规则页中已记录的命中，以及设置 → 临时运行时覆盖。
- **系统状态** → **未开启的功能** 会说明具体状态：按需记录时显示**流程记录只在查看时记录**，模式为关闭时显示**流程记录在设置中设为关闭**，配置禁止记录时显示**流程记录当前关闭**。

**启用步骤**

1. 如果配置禁止记录，在 doona 之外为 `experimental.native_api` 启用 `record_flows: true`，再重启 honk。
2. 选择界面提供的运行时模式。
3. 产生新流量，确认出现流程记录。已有流量不代表记录器已捕获到该流量。

**错误**

- 读取：`snapshot_expired`、`snapshot_unavailable`、`flow_expired`。刷新视图以获取新快照。
- 视图为空时，见[连接与规则列表为空](troubleshooting.md#troubleshooting)。

**详细说明**

- **关闭**不记录；**常开**记录支持的范围；**按流程需求**在客户端请求流程时记录；抽样模式只记录一部分。
- **按流程需求**是默认值。有客户端请求流程时才开始记录，宽限期过后停止，因此打开页面之前的流程不会保留。连接页、规则页和分流页在打开时会请求流程。
- 要在没有客户端时也记录，在设置 → **临时运行时覆盖**把**流程记录**设为**常开**。配置无法固定这个模式：其中的 `record_flows` 只决定是否允许记录，而重启或一次被接受的配置激活会把模式恢复为**按流程需求**。


## 路由规则、DNS 规则与模板 {#req-rules}

**所需条件**

- 列表：`rules.available` 或 `dns_rules.available`。添加、编辑或暂存规则：配置源权限，以及可定位的规则或插入位置。
- 路由模板：honk 语法、完整可写的目标、路由仅位于一个配置源中、有效的引用组和本地地理数据依赖。
- 服务规则：`rules.available`、`config.available`，以及可写入的 fallback 规则。新规则写入 fallback 所在的文件。

**在 doona 中检查**

- 规则和 DNS 规则显示不可用的操作与依赖说明。

**启用步骤**

1. 解决所属配置源的问题。如果写入已禁用，在 doona 之外为 `experimental.native_api` 启用 `config_write: true` 并设置凭据，再重启 honk。
2. 应用模板前，将路由集中到单个配置源。
3. 激活后检查规则列表，并对匹配的目标执行追踪。

**错误**

- 配置源写入被拒绝：见[只读配置源](troubleshooting.md#read-only)。
- 依赖诊断：[`missing-offline-dependency`](troubleshooting.md#offline-dependency)、[`unreadable-offline-dependency`](troubleshooting.md#offline-dependency)、[`invalid-offline-dependency`](troubleshooting.md#offline-dependency)。见[离线依赖](troubleshooting.md#offline-dependency)。


## 路由追踪 {#req-routing-trace}

**所需条件**

- `routing_trace.available`、受支持的解析模式，以及有效的查询输入。
- 实时解析必须在 `resolve_modes` 中声明。追踪必须符合后端的请求和时间限制。

**在 doona 中检查**

- 在规则页打开追踪面板。

**启用步骤**

1. 缺少追踪能力时，安装兼容的后端。
2. 选择界面提供的解析模式，填写目标及其他必填字段。
3. 执行追踪，检查匹配步骤与最终出站。

**错误**

- `invalid_request`、`unsupported_value`、`request_too_large`、`temporarily_unavailable`。
- 缺少后端支持时，见[原生 API 兼容性](troubleshooting.md#no-native-api)。


## 事件 {#req-events}

**所需条件**

- `events.available`。

**在 doona 中检查**

- 查看事件页及其连接状态。

**启用步骤**

1. 连接到声明支持该资源的后端。
2. 执行重载等操作，确认对应事件出现。

**错误**

- 过期的续传游标可能返回 [`event_cursor_expired`](troubleshooting.md#troubleshooting)。见[缺少启动消息](troubleshooting.md#troubleshooting)。

**详细说明**

- 后端声明事件类型、保留范围和客户端限制。事件流仅提供仍保留的事件。
- 重新连接无法恢复已从缓冲区淘汰的事件。


## 日志 {#req-logs}

**所需条件**

- `logs.available`、`experimental.native_api` 中的 `record_logs: true`、正在记录的模式，以及包含所需消息的日志级别。
- 筛选条件必须由后端声明支持。

**在 doona 中检查**

- 查看日志页和设置 → 临时运行时覆盖。

**启用步骤**

1. 必要时，在 doona 之外为 `experimental.native_api` 启用 `record_logs: true`，再重启 honk。
2. 选择界面提供的记录模式和级别。
3. 产生该级别的新事件，确认出现对应日志。

**错误**

- [`capability_not_supported`](troubleshooting.md#no-native-api)、`unsupported_value`、[`event_cursor_expired`](troubleshooting.md#troubleshooting)。见[启动消息与记录器限制](troubleshooting.md#troubleshooting)。

**详细说明**

- 缓冲区容量和保留范围会限制重放。
- API 记录器安装前产生的消息，需要查看服务日志。


## DNS 查询与上游选择 {#req-dns-query}

**所需条件**

- `dns_query.available` 和后端声明支持的记录类型。
- 选择指定名称的上游，还需要可读取的配置中包含该上游。

**在 doona 中检查**

- DNS → 查询显示可选的类型和上游。

**启用步骤**

1. 如果需要明确选择上游，在 `dns` 配置区块中定义它，应用后重新打开查询。
2. 选择界面提供的类型和上游，执行查询，检查响应和报告的结果。

**错误**

- 无效或不支持的请求：`invalid_request`、`unsupported_value`。
- 访问失败时，见[原生 API 访问](troubleshooting.md#no-native-api)。

**详细说明**

- 所选上游缺失或已移除时，doona 会将选择恢复为自动。


## DNS 缓存操作 {#req-dns-cache}

**所需条件**

- 列表：`dns_cache.available` 和 `read`。
- 删除单条记录、按名称删除和清空分别需要 `delete_entry`、`delete_name` 和 `flush`。这些能力相互独立。

**在 doona 中检查**

- DNS → 缓存显示受支持的控制项。

**启用步骤**

1. 使用声明支持所需操作的后端。启用 DNS 日志不会启用缓存操作。
2. 删除或清空后，刷新列表并检查结果。新的 DNS 流量可能再次填充缓存。

**错误**

- 读取：`snapshot_expired`、`snapshot_unavailable`。格式错误的请求：`invalid_request`。
- 兼容性与访问问题见[原生 API 访问](troubleshooting.md#no-native-api)。


## DNS 日志与统计 {#req-dns-log}

**所需条件**

- `dns_log.available`、`experimental.native_api` 中的 `record_dns_log: true`，以及正在记录的模式。
- 查询与缓存能力相互独立。

**在 doona 中检查**

- 查看 DNS → 日志和统计，以及设置 → 临时运行时覆盖。

**启用步骤**

1. 配置禁止 DNS 记录时，在 doona 之外为 `experimental.native_api` 启用 `record_dns_log: true`，再重启 honk。
2. 选择界面提供的模式，产生 DNS 流量，确认新增日志和统计。

**错误**

- [`capability_not_supported`](troubleshooting.md#no-native-api)、`temporarily_unavailable`。见[记录与启动消息](troubleshooting.md#troubleshooting)。

**详细说明**

- 允许记录但未开始记录的记录器不会产生新样本。


## 运行时覆盖 {#req-runtime-options}

**所需条件**

- `runtime_settings.available`，且 `fields` 包含所需字段。不需要 `config_write`。
- 即使后端声明支持记录器模式字段，所选值仍必须符合记录权限和取值限制。

**在 doona 中检查**

- 设置 → 临时运行时覆盖显示可用控制项和记录状态。

**启用步骤**

1. 必要时，在 doona 之外为 `experimental.native_api` 启用对应的启动记录器，再重启 honk。
2. 调整运行时值，核对返回的设置。

**错误**

- 无效值：`invalid_request`。未声明支持或被禁止的值：`unsupported_value`。
- 见[写入范围](what-doona-can-change.md)和[后端访问失败](troubleshooting.md#sign-in)。

**详细说明**

- 重启或已接受的配置激活会重置这些覆盖值。


## 地理数据可用性 {#req-geodata}

**所需条件**

- `geodata.available`，且流量路由器和 DNS 路由器加载的资源集合一致。

**在 doona 中检查**

- 设置 → 地理数据显示已加载的资源和状态。资源不一致可能使该能力不可用。

**启用步骤**

1. 安装规则需要的资源。
2. 重载或重启 honk，再检查列表。

**错误**

- 已加载的资源集合不可用时，可能返回 [`capability_not_supported`](troubleshooting.md#no-native-api)。见[离线依赖失败](troubleshooting.md#offline-dependency)。

**详细说明**

- 立即更新只更新已加载的资源，不会安装缺少的依赖。


## 手动更新地理数据 {#req-geodata-update}

**所需条件**

- `geodata.can_update`、配置写入权限、凭据，以及至少一个已加载资源。
- 每个已加载资源都需要磁盘路径和可用 URL。使用最终的 HTTP 或 HTTPS URL；重定向会被拒绝。
- 服务用户必须能在目标位置暂存、替换并同步文件。

**在 doona 中检查**

- 设置 → 地理数据显示立即更新、资源详情和操作结果。
- 地理数据状态加载完毕且当前操作结束后，立即更新才会启用。

**启用步骤**

1. 必要时，在 doona 之外为 `experimental.native_api` 启用 `config_write: true` 并设置凭据。
2. 为已加载资源设置 `assets.geodata` 中的 `geosite` 和 `geoip`。有可用的状态数据库时，也可以通过设置页指定来源。
3. 按需设置 `assets.geodata` 中的 `route`；未设置时继承 `assets.route`。直连下载主机名 URL 时，在 `global` 中配置可用的 `bootstrap_resolver`。修改这些启动设置后，重启 honk。
4. 在设置 → 地理数据中选择立即更新，等待完成，再检查资源详情和操作结果。

**错误**

- [下载阶段](troubleshooting.md#geodata-update)：[`download_timeout`](troubleshooting.md#geodata-update)、[`checksum_unavailable`](troubleshooting.md#geodata-update)、[`checksum_mismatch`](troubleshooting.md#geodata-update)、[`http_status_rejected`](troubleshooting.md#geodata-update)、[`http_not_found`](troubleshooting.md#geodata-update)、[`connection_failed`](troubleshooting.md#geodata-update)、[`tls_failed`](troubleshooting.md#geodata-update)、[`group_unavailable`](troubleshooting.md#geodata-update)、[`route_blocked`](troubleshooting.md#geodata-update)、[`asset_too_large`](troubleshooting.md#geodata-update)、[`invalid_source`](troubleshooting.md#geodata-update)。
- [替换阶段](troubleshooting.md#geodata-update)：[`replacement_failed`](troubleshooting.md#geodata-update) 表示替换失败；[`directory_sync_failed`](troubleshooting.md#geodata-update) 表示尚未确认持久写入，此时文件可能已替换。
- 重试前，在失败通知中点击**复制错误**。复制内容的 `details.assets` 列出每个资源的 `written` 和 `durability_confirmed` 值，设置中的资源详情不显示这两个值。请检查这些值及目标文件系统。

**详细说明**

- 配置为每个已加载资源提供 URL 时，手动更新不需要状态数据库。没有数据库时，honk 无法使用已存储或内置的 URL 列表。
- 每次 URL 尝试都使用选定路由。组或路由决策失败时，不会回退到直连。
- 资源查找顺序是 `DAE_LOCATION_ASSET`、`global.data_dir`、旧版位置、工作目录和共享目录。
- 软件包中的资源会在数据目录中生成替代文件，并优先于软件包副本使用。已位于数据目录或明确指定资源目录中的文件，则在原位置替换。
- 每次文件下载最多允许 30 秒无进度，总时限为 10 分钟。校验和请求有独立的 10 秒时限，并在 URL 路径后追加 `.sha256sum`。
- 校验和请求返回 404 时，资源保持未验证状态。因其他原因无法获取校验和时，会拒绝本次尝试。
- 操作失败不代表所有文件都未改变。


## 地理数据来源、路由、校验和、计划与重置 {#req-geodata-settings}

**所需条件**

- 每次设置写入都需要凭据和可用的状态数据库，包括来源 URL 列表、下载路由、校验和验证、自动更新计划及重置。不需要 `config_write`。
- `geodata.configurable_sources`，且 `runtime_settings.fields` 中包含 `geodata`。
- 路由和校验和控件还需要后端返回对应设置。选择组路由需要组资源和当前存在的组。
- 自动下载仍需满足[更新前提](#req-geodata-update)。

**在 doona 中检查**

- 查看设置 → 地理数据。没有来源和计划控制项时，查看系统状态中的持久保存警告。

**启用步骤**

1. 修复[状态数据库访问](troubleshooting.md#state-db)，重启 honk，确认控制项出现。
2. 保存更改，核对返回的设置。
3. 修改来源 URL 且更新可用时，检查 doona 保存后另行启动的更新操作。

**错误**

- 设置失败：[`permission_denied`](troubleshooting.md#sign-in)、[`capability_not_supported`](troubleshooting.md#no-native-api)；组已失效时为 [`state_conflict`](troubleshooting.md#read-only)；存储失败时为 `temporarily_unavailable`。
- 见[地理数据控制项不可用](troubleshooting.md#geodata-sources)和[不安全的数据库路径](troubleshooting.md#state-unsafe)。

**详细说明**

- 设置请求只保存值。重置同样是数据库写入，不会编辑配置文件。
- 覆盖值会保留在数据库中，但启动时，配置中明确指定的地理数据 URL 和下载路由会再次覆盖已存储的值。


## 操作、重载、暂停与恢复 {#req-reload-suspend}

**所需条件**

- 跟踪已接受的操作：`operations.available`。重载：还需要 `reload.available`。
- 暂停：`suspend.available` 且后端运行中。恢复：`resume.available` 且后端已暂停。
- 已检查的 honk 修订声明暂停和恢复不可用，无法通过配置开关启用。

**在 doona 中检查**

- 查看设置中的后端操作，以及操作进度或失败通知。

**启用步骤**

1. 使用兼容后端支持的操作，或按[服务管理](service-management.md)控制进程。
2. 重载后，检查已接受的配置和运行时状态。

**错误**

- 操作失败：[`state_conflict`](troubleshooting.md#read-only)、配置诊断、`temporarily_unavailable`。见[写入与操作失败](troubleshooting.md#read-only)。

**详细说明**

- 请求被接受，不代表操作成功。
- 结果未知时，先重新读取结果，再执行其他写入。


## 进程名路由与 UDP 追踪详情 {#req-process-routing}

**所需条件**

- 进程名路由：cgroup v2 套接字身份捕获。完整名称：由内核捕获进程参数。
- UDP 追踪详情另需内核追踪支持。

**在 doona 中检查**

- 系统状态 → 数据路径显示支持受限的原因。

**启用步骤**

1. 使用支持所需钩子的内核与 cgroup 配置。见[内核要求](requirements.md#requirements)。
2. 重启 honk，确认对应警告消失。界面设置无法补充缺少的内核钩子。

**错误**

- 运行时降级码：[`pname_routing_reduced`](troubleshooting.md#troubleshooting)、[`pname_routing_disabled`](troubleshooting.md#troubleshooting)、[`udp_trace_unavailable`](troubleshooting.md#troubleshooting)。见[内核失败](troubleshooting.md#troubleshooting)。
- 这些代码表示支持受限，不是配置写入错误。

**详细说明**

- 内核无法捕获进程参数时，honk 会回退到线程的 `comm` 名称，而不是使用从参数取得的名称。


## 保留选择与探测历史 {#req-persistence}

**所需条件**

- 要在重启后保留 Selector 选择和延迟历史，需要可用的状态缓存，且 `experimental.cache_file` 中的 `enabled` 不能设为 `false`。
- 此 honk 修订使用状态数据库持久保存数据。密码认证在启动时也需要该数据库。

**在 doona 中检查**

- 查看系统状态中的持久保存说明。

**启用步骤**

1. 将 `experimental.cache_file` 中的 `enabled` 保持未设置，以保留 Selector 选择和延迟样本。
2. 按[状态数据库问题](troubleshooting.md#state-db)解决所有权、权限、不安全路径、锁或损坏问题。
3. 重启 honk，确认警告消失后，再依赖已保存的状态。

**错误**

- 运行时降级码：界面识别 [`state_cache_unavailable`](troubleshooting.md#state-db)；honk 在没有数据库而继续运行时，报告 [`persistence_unavailable`](troubleshooting.md#state-db) 并附原因。见[状态数据库失败](troubleshooting.md#state-db)。


## 外观与浏览器存储 {#req-browser-settings}

**所需条件**

- 浏览器设置不需要配置写入权限。
- 液态玻璃需要支持基于 SVG 的 `backdrop-filter` 的 Chromium。
- 持久保存背景图片需要可用的 IndexedDB。旗帜覆盖要求节点名称中没有内嵌旗帜。

**在 doona 中检查**

- 查看设置 → 外观和旗帜选择器。

**启用步骤**

1. 使用支持液态玻璃的浏览器，并允许浏览器持久保存数据。
2. 选择背景图片，重新打开页面，确认图片已保存。
3. 要更改内嵌旗帜，需修改节点的实际名称。浏览器覆盖无法替换它。

**错误**

- 浏览器存储失败显示本地说明，不使用 honk API 错误码。
- 升级后仍显示旧界面资源时，见[刷新浏览器](troubleshooting.md#troubleshooting)。

**详细说明**

- 无法持久保存时，doona 仍可在当前会话中保留背景图片。

</div>
