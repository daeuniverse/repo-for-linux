---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 首次登录 {#title-首次登录}

将标准版连接到已启动的 honk，按需创建管理员，并检查后端状态。先完成[服务管理](service-management.md)中的启动步骤；lite 用户请阅读[连接 doona lite](lite-connect.md)。

## 1. 打开界面 {#1-打开界面}

在网关或局域网设备上打开 `http://192.168.1.1:9527/ui/`，将地址替换为网关的 API 监听地址。使用主机名或独立托管的界面时，先配置[主机名与来源访问](install.md#other-origin)。

首次使用且未保存后端配置方案时，界面会在托管地址发现 API。如果表单指向错误的后端，选择**更改后端网址**。找不到 API 或无法使用认证功能时，查看[登录要求](feature-requirements.md#req-sign-in)。

登录前，可用右上角的控件切换语言、配色和明暗模式。

## 2. 按当前表单登录 {#2-按当前表单登录}

| 表单 | 操作 |
| --- | --- |
| **创建管理员** | 输入**用户名**、**密码**和**确认密码**，选择**创建并登录**。 |
| **登录** | 输入已有管理员的**用户名**与**密码**，选择**登录**。 |
| **需要 Token** | 在 **Token** 中输入后端配置的密钥，选择**连接**。 |

创建账号时，用户名须为 1 至 64 个 ASCII 英文字母、数字、下划线、句点或连字符。密码须为 8 至 128 个字符，且两次输入必须相同。

使用 Token 登录时，可通过 **Token** 字段的显示／隐藏控件，在连接前核对输入的密钥。

![创建管理员](https://doona.daeuniverse.org/screenshots/zh-CN/login-setup.webp)

## 3. 检查后端 {#3-检查后端}

1. 打开**系统状态**。在手机上，先选择底栏的**活动**。
2. 查看生命周期状态和**引擎**卡片，确认引擎为 honk，版本与安装的构建一致。
3. 查看**后端能力**，通过[功能要求](feature-requirements.md)判断操作不可用的原因。

继续阅读[路由你的第一条连接](tutorial.md)，添加订阅并验证代理路由；查找页面可用[界面导览](tour.md)。

## 登录失败时 {#登录失败时}

| 现象 | 下一步 |
| --- | --- |
| 浏览器无法打开页面 | 在网关执行 `curl http://192.168.1.1:9527/api`，替换示例 IP。如果网关本机可达，但局域网浏览器无法连接，检查网关防火墙是否阻止访问 9527 端口。如果本机也失败，按[服务管理](service-management.md)检查服务与监听地址。 |
| 表单提示没有原生 API | 查看 [honk 版本](requirements.md#honk-version)。 |
| 管理员创建请求被拒绝 | 核对[登录要求](feature-requirements.md#req-sign-in)中的客户端地址条件。 |
| 凭据被拒绝或忘记密码 | 按[登录故障排查](troubleshooting.md#sign-in)处理。 |

认证配置项见[配置参考](configuration.md)。不要在截图或问题报告中包含密码或 Token。

</div>

---

来源：[doona-docs](https://github.com/Zakkaus/doona-docs)，采用 [CC BY 4.0 许可证](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
