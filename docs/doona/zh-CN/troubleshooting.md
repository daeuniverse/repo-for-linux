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

| 报告的原因 | 处理方法 |
| --- | --- |
| `writes_disabled` | 按上述配置条件启用经过身份验证的写入。 |
| `configuration_unavailable` | 检查 honk 启动日志，待配置加载完成后再编辑。 |
| `listener_secret_source` | 在磁盘上编辑含密钥的文件。将监听密钥放在单独的引入文件中，让其他文件保持可编辑。 |
| `listener_secret_in_content` | 检查内容或路径是否包含监听密钥值。在 doona 外更换与其他内容重复的密钥，完成变更后重新登录。 |
| `listener_settings_changed` 或要求重启的诊断 | 在 doona 外编辑设置，并按[重启规则](what-doona-can-change.md)处理。 |
| `credential_sources_changed` | 在外部修改凭据文件后重载 honk，再重新打开来源文件进行编辑。 |
| `unsafe_path` | 使用允许的配置目录内的普通文件，并检查[文件系统条件](what-doona-can-change.md)。 |
| 其他编辑操作后出现 `stale_revision` 或 `state_conflict` | 先处理[已变更的文件](common-tasks.md#changed-on-disk)，再重新应用。 |
| `import_entry_changed` | 导入服务器文件前，以 `-c` 指向当前活动的配置入口启动 honk。 |

结果未知时，先检查当前来源内容，再决定是否重新写入。已受理的导入或恢复操作，可在**备份与修订**中重新打开该操作。若对话框仍提示结果未知，点击其中的**刷新**查询原操作。未收到响应不代表写入失败。


## 应用时显示未写入，并列出 `global.nfqueue_enable` 需要重启 {#nfqueue-restart}

内核不支持 NFQUEUE 时，honk 启动时会关闭 NFQUEUE，并在日志中记录 `NFQUEUE is unavailable at startup`。honk 0.1.0-beta.4 及更早版本随后会拿每次写入与默认值 `nfqueue_enable: true` 比较，因此应用时总是显示**未写入**，并把 `global.nfqueue_enable` 列为需要重启的设置，重启后也一样。在 `global` 段写入这个值，再[重启 honk](service-management.md)：

```dae
global {
    nfqueue_enable: false
}
```

之后即可正常应用。


## 应用时提示依赖文件不可用 {#offline-dependency}

honk 写入前会校验本地依赖。检查诊断和配置引用的文件。

诊断不会列出依赖文件的名称。订阅或节点报错时，检查订阅缓存内容和各节点的 `ech_config_path`；DNS 报错时，检查 `use_host` 指定的文件。恢复缺失文件，或刷新格式错误的订阅内容，再重新应用。

| 代码 | 原因与处理 |
| --- | --- |
| `missing-offline-dependency` | 恢复缺失的依赖文件。地理数据安装见[安装说明](install.md#directories-and-geodata)或 [OpenWrt 地理数据安装](install-openwrt.md#install-geodata)。 |
| `offline-dependency-denied` | 将依赖文件放入允许的配置目录或数据目录，并允许服务用户读取。 |
| `invalid-offline-dependency` | 替换格式错误的内容，或刷新受影响的订阅。 |
| `unreadable-offline-dependency` | 查看服务日志中的文件或存储错误。 |

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

从本次服务启动的日志确认正在运行的构建和监听地址，再检查[兼容构建](requirements.md#honk-version)及 [API 配置](configuration.md#config)。

| 症状 | 原因与处理 |
| --- | --- |
| 无法连接监听地址 | 确认 honk 正在运行，且已启用的 API 监听在所访问的地址。见[服务检查](service-management.md)。 |
| `native API listener bind failed` | 确认 `listen` 指定的地址属于此网关，且端口未被其他进程占用。 |
| `Subscription HTTP client creation failed`，随后出现 `subscription network startup failed` | 阅读底层 TLS 错误并检查系统 CA 证书库。安装发行版的证书软件包，如 `ca-certificates` 或 OpenWrt 的 `ca-bundle`。 |
| `command not found` 或找不到可执行文件 | 按对应平台的[安装说明](install.md)核对 honk-core 路径。 |
| `/api` 返回 404，或登录页显示**此 honk 构建未提供原生 API** | 确认地址指向 honk，再安装提供原生 API 的构建。 |
| 只有 `/ui/` 返回 404 | 检查配置中的界面路径及该目录内的文件，按[界面安装](install.md#doona)处理。 |
| 启动报告 `failed to inspect native UI directory`、`failed to inspect native UI index.html` 或 `native UI index.html must be a regular file` | 修正界面目录或解压界面文件，使其中的 `index.html` 是可读取的普通文件。 |
| 操作返回 `capability_not_supported` | 在[系统状态](observe.md#overview)检查该项功能。仅凭此代码不能判断整个 API 不存在。 |


## honk 启动时拒绝原生 API 设置 {#unknown-setting}

`native API setting belongs inside native_api { }` 表示字段被直接放在了 `experimental` 下。对照[原生 API 配置](configuration.md#config)，将字段移入嵌套区块。

`enabled` 和 `secret` 可用于多个实验性区块。将它们直接放在 `experimental` 下，会产生 `unknown experimental setting`，且不会提示唯一的目标区块。原生 API 的字段应移入 `native_api { }`。

`unknown experimental setting` 也可能表示正在运行的构建不支持该设置。`native-api feature is required` 表示构建缺少已启用的原生 API 功能。对照 [honk 要求](requirements.md#honk-version)检查构建。

身份验证组合导致启动被拒绝时，依据具体启动错误，检查[登录条件](feature-requirements.md#req-sign-in)和[配置参考](configuration.md#config)。


## 地理数据更新失败 {#geodata-update}

打开**设置** → **地理数据**，阅读失败操作的阶段。**立即更新**缺失或禁用时，先检查[更新条件](feature-requirements.md#req-geodata-update)。

| 阶段 | 检查或修改什么 |
| --- | --- |
| `checksum_unavailable` | 校验和请求失败。检查镜像的校验和 URL，或更换来源。 |
| `checksum_mismatch` | 下载内容与校验和不符。从来源获取匹配的文件与校验和。 |
| `download_timeout` | 检查下载路由和来源；超时限制见[下载期限](feature-requirements.md#req-geodata-update)。 |
| `http_status_rejected` | 检查服务器返回的状态，使用最终 URL，避免重定向。 |
| `http_not_found` | 修正文件 URL。 |
| `connection_failed` | 检查所选路由和节点；按主机名直连下载时，检查[更新条件](feature-requirements.md#req-geodata-update)中的解析器要求。 |
| `tls_failed` | 检查网关时间、服务器证书及主机名。 |
| `group_unavailable` | 在**策略**检查所选组是否有可用节点。 |
| `route_blocked` | 修正将此下载发往 `block` 的路由规则。 |
| `asset_too_large` | 检查 URL 是否提供预期的地理数据文件。 |
| `invalid_source` | 修正来源 URL。 |
| `replacement_failed` 或 `directory_sync_failed` | 重试前检查各文件的结果和目标文件系统，按[替换条件](feature-requirements.md#req-geodata-update)处理。 |

校验和请求返回 404 时的处理、验证规则及部分写入行为见[更新条件](feature-requirements.md#req-geodata-update)。


## 无法编辑地理数据来源或更新计划 {#geodata-sources}

在**系统状态** → **数据路径**检查持久化警告。降级代码 `persistence_unavailable` 表示状态数据库不可用；按其 `reason` 执行[数据库检查](#state-db)。

恢复[地理数据设置条件](feature-requirements.md#req-geodata-settings)后，重新打开地理数据卡片。手动下载有[单独的条件](feature-requirements.md#req-geodata-update)，能下载不代表能保存设置。


## honk 报告状态数据库故障 {#state-db}

在[服务日志](service-management.md)中查看最近一次启动错误。密码验证需要数据库，无法打开时会停止启动。使用文件配置的 Token 模式遇到部分故障时，可继续运行但不保存状态；见[持久化条件](feature-requirements.md#req-persistence)。

| 消息或原因 | 下一步 |
| --- | --- |
| `unavailable` | 检查服务用户能否创建和访问配置指定的数据目录及其中的状态目录。 |
| `unsafe` | 按[不安全路径检查](#state-unsafe)处理。 |
| 被 `honk-core admin reset` 锁定 | 等待该命令结束后再启动 honk。 |
| 另一个 honk-core 已打开数据库 | 先停止冲突实例，再启动当前实例。 |
| 外部应用 ID 或较新的数据库结构 | 使用拥有此数据库的 honk 构建，不要用旧构建覆盖。 |
| `corrupt` | 在文件存储的 Token 模式下，honk 将损坏的数据库移至数据目录内的 `state/honk.db.corrupt`，再创建新数据库。它不会覆盖已有的损坏副本，包括 `state/honk.db.corrupt-wal`。若这些副本阻止恢复，先将其保存到其他位置，再重启。 |

修复访问问题后，[重新启动服务](service-management.md)，检查持久化警告是否消失。


## 持久化警告的原因是 `unsafe` {#state-unsafe}

服务日志会显示拒绝的路径、规则及建议的修复方法。结合[数据目录配置](configuration.md#config)检查该路径，不要假定所有安装都使用同一目录。

文件模式下，运行时数据目录由 `global.data_dir` 决定，`--data-dir` 不会覆盖该目录。执行 `admin reset` 时，须通过 `--data-dir` 指定同一目录。OpenWrt 的 [`/var` 内容在重启后丢失](https://openwrt.org/docs/techref/filesystems)，请使用[手动安装的持久化目录](install-openwrt.md#install-geodata)。

状态目录与数据库须归 honk 服务用户所有，且不能向组或其他用户开放权限。符号链接或错误的文件类型也会被拒绝。只修正日志所指路径的所有权、权限或类型，再重启 honk。不要递归修改整个配置目录的权限。

## 停止 OpenWrt 防火墙后流量异常 {#停止-openwrt-防火墙后流量异常}

如果停止防火墙时删除了 honk 的 nftables 表，先重新启动防火墙，再在网关执行 `/etc/init.d/honk-core restart`。honk 运行期间，防火墙管理器不得修改 `inet honk_nfqueue` 及其 `udp_decision` 链。

## 安装其他软件包时 apk 报告 `breaks: world[…]` {#安装其他软件包时-apk-报告-breaks-world}

从文件安装的软件包（如下载的 doona 或 honk `.apk`）会在 `/etc/apk/world` 中锁定为该文件。软件源出现其他版本后，任何 `apk add` 都会失败，即使安装的是无关工具，错误类似 `honk-0.1.0_beta2-r1: breaks: world[honk><Q1…]`。如需改为跟随 [daeuniverse 软件源](/zh-CN/openwrt/)，请执行 `apk add honk@daeuniverse`，其他软件包可写在同一条命令中。如需保留本地构建，请在同一条 `apk add` 命令中再次指定该文件。

## 固定 BPF map 时出现 Invalid argument {#固定-bpf-map-时出现-invalid-argument}

检查 `/sys/fs/bpf` 是否挂载为 bpffs，具体步骤见[内核与文件系统要求](requirements.md#requirements)。

## honk 拒绝当前内核或编译路由失败 {#honk-拒绝当前内核或编译路由失败}

按[运行要求](requirements.md#requirements)检查最低内核版本及 BPF/BTF 支持。报告 verifier 失败时，保留完整的 verifier 日志。

## LAN 流量没有按预期路由 {#lan-流量没有按预期路由}

按 [LAN 接口说明](configuration.md#接口与内核)检查网桥名称，以及旁路由客户端的网关与 DNS 设置。

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

---

来源：[doona-docs](https://github.com/Zakkaus/doona-docs)，采用 [CC BY 4.0 许可证](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
