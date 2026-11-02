---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 按任务查找页面 {#features}

在下表查找 doona 标准版功能及使用条件。首次设置请从[快速入门](quick-start.md)和[首次连接教程](tutorial.md)开始；精简界面请参阅 [doona lite](lite.md)。

请在真实 LAN 客户端上使用可用节点验证路由，测试直连和代理的 TCP、UDP 及 DNS。`honk-core is running`、`dae0` 链路存在或 API 可访问，都不能证明流量实际通过。


## 页面 {#pages}

| 页面 | 可以完成的任务 | 使用条件 |
| --- | --- | --- |
| [活动](observe.md#activity) | 在仪表盘查看流量、内存、连接和节点健康状态。 | [实时指标](feature-requirements.md#req-runtime-status)、[历史数据](feature-requirements.md#req-traffic-history) |
| [系统状态](observe.md#overview) | 检查引擎、数据路径和功能受限的原因。 | [运行状态](feature-requirements.md#req-runtime-status) |
| [连接](observe.md#connections) | 查看实时连接的路由和流量，关闭连接或打开其匹配规则。 | [连接操作](feature-requirements.md#req-connections) |
| [分流](observe.md#flows) | 查看已记录的流和路由图，了解之前的路由结果。 | [流记录](feature-requirements.md#req-flows) |
| [DNS](observe.md#dns) | 查询域名，检查应答和缓存条目，查看解析日志。 | [查询](feature-requirements.md#req-dns-query)、[缓存](feature-requirements.md#req-dns-cache)、[日志](feature-requirements.md#req-dns-log) |
| [节点](routing.md#nodes) | 添加订阅或节点链接，更新来源并测试节点。 | [节点管理](feature-requirements.md#req-nodes)、[订阅更新](feature-requirements.md#req-subscription-refresh)、[探测](feature-requirements.md#req-probes) |
| [策略](routing.md#policies) | 选择组成员，或编辑组的选择方式和成员范围。 | [成员选择](feature-requirements.md#req-group-selection)、[编辑组](feature-requirements.md#req-group-edit) |
| [规则](routing.md#rules) | 应用路由模板，编辑路由或 DNS 规则，模拟路由结果。 | [规则与模板](feature-requirements.md#req-rules)、[追踪](feature-requirements.md#req-routing-trace) |
| [配置](config-and-settings.md#config-page) | 打开配置模块，编辑文件或全局设置，管理备份与修订。 | [编辑](feature-requirements.md#req-config-edit)、[校验](feature-requirements.md#req-validation)、[修订](feature-requirements.md#req-revisions) |
| [事件](observe.md#events) | 查看后端事件。 | [事件流](feature-requirements.md#req-events) |
| [日志](observe.md#logs) | 查看、筛选、暂停显示和导出引擎日志。 | [日志记录](feature-requirements.md#req-logs) |
| [设置](config-and-settings.md#settings-page) | 管理后端配置方案、临时覆盖、地理数据、探测偏好和外观。 | 无后端也能打开此页。各项控件的条件见[运行时覆盖](feature-requirements.md#req-runtime-options)、[地理数据](feature-requirements.md#req-geodata)和[浏览器设置](feature-requirements.md#req-browser-settings)。 |


## 页面或操作不可用时 {#still-missing}

后端无法提供数据的页面仍会保留在导航中。打开**系统状态**查看功能限制，或打开禁用操作旁的帮助。修改后端前，先阅读表中对应的使用条件。

编辑被拒绝时，参阅[只读来源](troubleshooting.md#read-only)；登录失败时，参阅[登录故障排查](troubleshooting.md#sign-in)。


## 仪表盘与浮动面板 {#widgets}

活动页与浮动面板共用组件库，可选择流量、内存、节点可用性、DNS 延迟或订阅配额等卡片。仪表盘操作见[活动页指南](observe.md#activity)，浮动面板排列方式见[面板指南](tour.md#panels)。

### 查看配额和内存 {#查看配额和内存}

默认布局不包含 **订阅额度**。添加后可查看到期时间和配额用量条；没有配额时显示用量。

**内存** 默认使用图表，**迷你折线图** 提供数值卡片。浮动面板的中尺寸显示常驻内存，以及 cgroup 用量与上限；大尺寸才显示图表。用量条使用 cgroup 用量，上限为零或缺失时不显示。界面区分未报告上限和未设置上限，**键值列表** 会指出已报告的 OOM 终止次数。

### 选择尺寸 {#选择尺寸}

仪表盘宽度从五分之一到全宽。累计流量、DNS 和网络分布最多占半宽；组切换器最多占三分之二。已保存但不支持的尺寸会调整为最接近的可用尺寸。面板的指标组件不提供内容重复的大尺寸。

较大的卡片显示更多细节：图表和宽指标列表在三分之二宽时显示峰值及平均值，至少四行的宽列表分为两列，节点延迟在半宽时增加范围。大环形图扩大圆环并缩窄图例，大尺寸面板环形图显示全部条目。窄图例保留名称、数值和占比。小尺寸面板通知占整行，小尺寸节点延迟显示名称及数值。

长名称会换行，通知高度随内容增长，DNS 和网络分布显示全部类别。窄面积图隐藏重叠的时间标签。迷你图在第二个样本到达前显示基线。

<a id="主题与配色"></a>


## 浏览器中保存的设置 {#theme-gallery}

查看[配色图集](https://doona.daeuniverse.org/screenshots/palettes.webp)，再调整[外观设置](config-and-settings.md#appearance)。

语言、外观、日期与时间格式、启动页面和探测偏好都在[设置](config-and-settings.md#settings-page)中调整。浏览器偏好、已保存配置和后端临时更改的区别见[更改的存储位置](what-doona-can-change.md)。

本站点的 `localStorage` 保存连接配置、令牌、偏好和布局。清除浏览器数据会删除这些浏览器内的值，不会删除 honk 配置。`sessionStorage` 保存每个标签页的状态，例如各分区最后打开的页面。令牌通过 `Authorization` 请求头发送；配对链接 URL 片段中的令牌会在加载时移除。

通过 HTTPS 或 localhost 访问时，service worker 会缓存应用界面、字体和图标，供离线打开界面及安装为应用。API 响应不会缓存。已保存的主题和语言在首次绘制前生效。认证前不会下载其他页面，安装更新会复用页面已有的文件。

安全漏洞报告方式见 [SECURITY.md](https://github.com/Zakkaus/doona/blob/main/.github/SECURITY.md)。

</div>

---

来源：[doona-docs](https://github.com/Zakkaus/doona-docs)，采用 [CC BY 4.0 许可证](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
