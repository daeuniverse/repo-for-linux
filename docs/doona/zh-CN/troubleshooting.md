---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 故障排除 {#troubleshooting}

按症状查找 doona 连接 honk 时的连接、编辑、记录或地理数据故障，按对应步骤检查。

| 症状 | 从哪里开始 |
| --- | --- |
| 控件消失或无法操作 | [功能控件](#控件消失或无法操作) |
| 文件只读或应用失败 | [配置写入](#read-only) |
| 登录失败 | [登录](#sign-in) |
| 没有原生 API，或 `/ui/` 返回 404 | [API 与界面访问](#no-native-api) |
| 地理数据更新失败 | [更新错误](#geodata-update) |
| 缺少地理数据来源或计划控件 | [地理数据设置](#geodata-sources) |
| 监控页面为空 | [记录与可见范围](#连接或规则页一直为空) |

## 控件消失或无法操作 {#控件消失或无法操作}

打开**系统状态**，阅读**未开启的功能**。doona 根据后端声明的能力，以及当前来源文件或记录状态，决定提供哪些操作。

| 受影响的操作 | 检查与处理 |
| --- | --- |
| 编辑文件、规则或出站模式 | 按[配置条件](feature-requirements.md#req-config-edit)检查；来源文件的标记见[只读文件](#read-only)。 |
| 添加节点或订阅 | 按[节点管理条件](feature-requirements.md#req-nodes)检查。 |
| 刷新订阅或测量延迟 | 检查[刷新条件](feature-requirements.md#req-subscription-refresh)或[探测条件](feature-requirements.md#req-probes)。 |
| 选择组内成员或编辑组 | 两种操作分别受[选择条件](feature-requirements.md#req-group-selection)和[编辑条件](feature-requirements.md#req-group-edit)限制。 |
| 记录功能或其设置 | 检查[运行时覆盖条件](feature-requirements.md#req-runtime-options)及对应的[记录条件](#连接或规则页一直为空)。 |
| 当前构建未提供的功能 | 对照[支持的 honk 构建](requirements.md#honk-version)，检查已安装的引擎。 |


## 文件只读或写入被拒绝 {#read-only}

打开**配置** → **配置文件**，检查来源文件的标记或诊断。完整的权限与文件系统规则见 [doona 可以修改什么](what-doona-can-change.md)及[配置条件](feature-requirements.md#req-config-edit)。

完整的拒绝代码及各自保护的内容见 honk 的[配置来源、校验与操作](/zh-CN/honk/reference/api#配置来源、校验与操作)。

结果未知时，先检查当前来源内容，再决定是否重新写入。已受理的导入或恢复操作，可在**备份与修订**中重新打开该操作。若对话框仍提示结果未知，点击其中的**刷新**查询原操作。未收到响应不代表写入失败。


## 应用时显示未写入，并列出 `global.nfqueue_enable` 需要重启 {#nfqueue-restart}

当没有任何已加载文件写出 honk 拒绝写入所涉及的设置时，doona 0.1.0-rc.6 及更新版本会提示这些设置不在配置文件中，请在配置中明写并重启一次。该措辞适用于所有只能通过重启生效的设置，不只是 `nfqueue_enable`。启动时的 NFQUEUE 降级及更早版本的行为见 honk 的 [`nfqueue_enable`](/zh-CN/honk/reference/global#nfqueue-enable)。

## 应用时提示依赖文件不可用 {#offline-dependency}

honk 写入前会校验本地依赖。检查诊断和配置引用的文件。

诊断不会列出依赖文件的名称。订阅或节点报错时，检查订阅缓存内容和各节点的 `ech_config_path`；DNS 报错时，检查 `use_host` 指定的文件。恢复缺失文件，或刷新格式错误的订阅内容，再重新应用。

honk 的[配置管理的信任边界](/zh-CN/honk/reference/experimental#配置管理的信任边界)定义了 `missing-offline-dependency`、`offline-dependency-denied`、`invalid-offline-dependency` 和 `unreadable-offline-dependency`。

**立即更新**用于更新已加载的数据，不能安装缺失的初始文件。再次应用前，先检查[地理数据条件](feature-requirements.md#req-geodata)。


## 登录失败 {#sign-in}

先检查[登录条件](feature-requirements.md#req-sign-in)，再按下表匹配响应。

| 症状或代码 | 原因与处理 |
| --- | --- |
| `setup_required` | 按[首次登录](first-sign-in.md)完成管理员设置。 |
| `setup_already_completed` | 管理员已存在，使用该账号登录。 |
| `invalid_credentials` | 重新输入账号凭据。忘记密码时，按下方步骤重置。 |
| `authentication_required` | 使用该后端配置的身份验证方式重新登录。 |
| 设置管理员时出现 `permission_denied` | 检查[设置条件](feature-requirements.md#req-sign-in)允许的客户端地址。 |
| 通过主机名或其他来源访问时出现网络错误或 HTTP 403 | 先检查是否能连接，再按[主机名与来源访问](install.md#other-origin)检查。 |
| API 可访问，但受保护操作被拒绝 | 检查该操作的[功能条件](feature-requirements.md)，包括凭据和写入权限。 |

### 重置遗忘的管理员密码 {#重置遗忘的管理员密码}

在网关上[停止 honk](service-management.md)，以服务用户身份执行已安装的 `honk-core`。将 `/var/lib/honk` 替换为[配置](configuration.md#config)中的数据目录：

不确定应传入哪个目录时，先按[数据目录检查](#state-unsafe)确认。

```sh
honk-core --data-dir /var/lib/honk admin reset
```

命令会删除管理员记录，并报告是否存在该记录。重新启动 honk，再按[首次登录](first-sign-in.md)创建管理员。


## 无法访问原生 API 或界面 {#no-native-api}

检查[兼容构建](requirements.md#honk-version)和 [API 配置](configuration.md#config)。监听器和启动日志诊断见 honk 的 [`native_api`](/zh-CN/honk/reference/experimental#native-api)与[检查运行状态](/zh-CN/honk/how-to-start#检查运行状态)。

| 症状 | 原因与处理 |
| --- | --- |
| `/api` 返回 404，或登录页显示**此 honk 构建未提供原生 API** | 确认地址指向 honk，再安装提供原生 API 的构建。 |
| 只有 `/ui/` 返回 404 | 检查配置中的界面路径及该目录内的文件，按[界面安装](install.md#doona)处理。 |
| 启动报告 `failed to inspect native UI directory`、`failed to inspect native UI index.html` 或 `native UI index.html must be a regular file` | 修正界面目录或解压界面文件，使其中的 `index.html` 是可读取的普通文件。 |
| 操作返回 `capability_not_supported` | 在[系统状态](observe.md#overview)检查该项功能。仅凭此代码不能判断整个 API 不存在。 |

## honk 启动时拒绝原生 API 设置 {#unknown-setting}

启动诊断（包括 `native API setting belongs inside native_api { }`、`unknown experimental setting` 和 `native-api feature is required`）以及被拒绝的认证组合见 honk 的 [`native_api`](/zh-CN/honk/reference/experimental#native-api)。

## 地理数据更新失败 {#geodata-update}

在**设置** → **地理数据**阅读失败操作的阶段。honk 的[主文件条目与 geodata 管理](/zh-CN/honk/reference/api#主文件条目与-geodata-管理)列出每个阶段及修复方法。**立即更新**何时可用、如何读取复制的错误详情，见[更新条件](feature-requirements.md#req-geodata-update)。

## 无法编辑地理数据来源或更新计划 {#geodata-sources}

在**系统状态** → **数据路径**检查持久化警告。降级代码 `persistence_unavailable` 表示状态数据库不可用；按其 `reason` 执行[数据库检查](#state-db)。已存储设置的行为见 honk 的[持久化的状态](/zh-CN/honk/reference/experimental#持久化的状态)。

恢复[地理数据设置条件](feature-requirements.md#req-geodata-settings)后，重新打开地理数据卡片。手动下载有[单独的条件](feature-requirements.md#req-geodata-update)，能下载不代表能保存设置。

## honk 报告状态数据库故障 {#state-db}

在[服务日志](service-management.md)中查看最近一次启动错误。honk 的[持久化的状态](/zh-CN/honk/reference/experimental#持久化的状态)说明数据库、故障原因及损坏文件的处理方式。

## 持久化警告的原因是 `unsafe` {#state-unsafe}

服务日志会显示拒绝的路径、规则及建议的修复方法。所需的所有权、权限和文件类型见 honk 的[持久化的状态](/zh-CN/honk/reference/experimental#持久化的状态)，`global.data_dir` 见[数据目录与资源路径](/zh-CN/honk/reference/global#数据目录与资源路径)。OpenWrt 的 `/var` 在重启后丢失，请使用 honk [OpenWrt 安装](/zh-CN/honk/how-to-start#openwrt)中的持久目录。

## 停止 OpenWrt 防火墙后流量异常 {#停止-openwrt-防火墙后流量异常}

见 honk 疑难排查表中的[停止 OpenWrt 防火墙后流量异常](/zh-CN/honk/how-to-start#常见问题)。honk 运行期间，防火墙管理器不得修改 `inet honk_nfqueue` 及其 `udp_decision` 链。

## 安装其他软件包时 apk 报告 `breaks: world[…]` {#安装其他软件包时-apk-报告-breaks-world}

从文件安装的软件包会在 `/etc/apk/world` 中锁定为该文件；软件源出现其他版本后，任何 `apk add` 都会失败。如需保留本地 doona 构建，请在同一条 `apk add` 命令中再次指定该文件。honk 软件包请按 honk 的 [OpenWrt 安装](/zh-CN/honk/how-to-start#openwrt)处理。

## 固定 BPF map 时出现 Invalid argument {#固定-bpf-map-时出现-invalid-argument}

见 honk 的[常见问题](/zh-CN/honk/how-to-start#常见问题)；原因是 `/sys/fs/bpf` 没有挂载为 bpffs。

## honk 拒绝当前内核或编译路由失败 {#honk-拒绝当前内核或编译路由失败}

检查 honk 的 [Linux 内核要求](/zh-CN/honk/how-to-start#linux-内核要求)和[常见问题](/zh-CN/honk/how-to-start#常见问题)。报告 verifier 失败时，保留完整的 verifier 日志。

## LAN 流量没有按预期路由 {#lan-流量没有按预期路由}

见 honk 的[常见问题](/zh-CN/honk/how-to-start#常见问题)和[选择接口](/zh-CN/honk/configuration#选择接口)，包括旁路由客户端的网关与 DNS 设置。

## 连接或规则页一直为空 {#连接或规则页一直为空}

| 空白视图 | 原因与下一项检查 |
| --- | --- |
| **连接** | 清除筛选，阅读可见范围或截断提示。检查[连接覆盖范围](feature-requirements.md#req-connections)；缺少记录不能证明流量已停止。 |
| **分流**或规则命中记录 | 检查[流程记录](feature-requirements.md#req-flows)。 |
| **解析记录**或 DNS 统计 | 检查 [DNS 记录](feature-requirements.md#req-dns-log)。 |
| **日志** | 检查[日志记录](feature-requirements.md#req-logs)。记录开始前的启动消息不会补录，须从服务日志查看。 |
| **事件** | 检查[事件可用条件](feature-requirements.md#req-events)和当前种类筛选。 |

**日志记录**默认为**按日志需求**。按需模式下，客户端请求某类数据时，对应的已获准记录器开始记录；需求结束后仍有 60 秒宽限期。连接、规则和分流页面打开时都会请求流程记录。

各视图如何使用数据，见[观测流量](observe.md)。

## 升级后，已打开的标签页仍显示旧版本 {#升级后已打开的标签页仍显示旧版本}

升级后重新加载页面。doona 提示新版本已就绪时，点击**重新加载**。使用 `ui: embedded` 时，内嵌界面来自已安装的 honk 二进制文件；界面设置见[配置参考](configuration.md#config)。


## doona lite 无法打开或显示了另一版本 {#lite-trouble}

对照 [lite 安装](lite.md#lite-install)检查目录与解压后的文件。修改界面设置后，按[原生 API 重启规则](what-doona-can-change.md#restart-native)操作，再重新加载浏览器页面。HTTP 403 或来源错误见[登录检查](#sign-in)。

## 收集报告所需的错误信息 {#收集报告所需的错误信息}

点击失败提示中的**复制错误**，或在**设置** → **关于**点击**复制最近错误**。报告中注明尝试的操作及正在运行的引擎和界面版本。重新加载页面会清空内存中的错误历史，请先复制错误。

历史最多保留 20 条错误。复制内容包括可用的请求方法与路径、状态、错误代码及请求 ID。请求正文和配置文本不会保留，识别出的秘密字段会被遮蔽。复制入口见[关于](config-and-settings.md#settings-page)。

</div>
