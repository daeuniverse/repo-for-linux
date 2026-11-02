---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 连接 doona lite {#lite-connect}

将已安装或独立托管的 lite 页面连接到 honk 原生 API。尚未安装时，先阅读 [doona lite](lite.md#lite-install)。

## 1. 选择后端 {#1-选择后端}

打开 lite 页面；由 honk 托管时，使用其 `/ui/` 地址。未保存连接时，lite 会自动检测同源的 honk。如果 honk 允许匿名访问，lite 会直接连接；否则会打开相应的登录表单。若要连接其他后端，选择**使用其他后端**。

未检测到 honk 或选择其他后端时：

1. 在 **honk native API 根地址**中输入服务器根地址，例如 `http://192.168.1.1:9527`；如有反向代理前缀，也应一并填写。不要加 `/ui/` 或 `/api/v1`，也不要填写代理节点地址。
2. 选择**继续**，发现登录方式。

使用独立托管的页面或主机名时，先配置[主机名与来源访问](install.md#other-origin)。发现失败时，查看[登录要求](feature-requirements.md#req-sign-in)。

## 2. 登录 {#2-登录}

| 表单 | 操作 |
| --- | --- |
| **设置管理员** | 输入**用户名**、**密码**和**确认密码**，选择**创建并登录**。账号格式见[首次登录](first-sign-in.md)，创建条件见[登录要求](feature-requirements.md#req-sign-in)。 |
| **登录** | 输入已有 honk 管理员的**用户名**和**密码**，选择**登录**。 |
| 令牌字段 | 在**令牌**中输入已配置的密钥；如果 honk 允许匿名访问，可以留空。然后选择**连接后端**。 |

连接后，继续阅读 [doona lite 常用任务](lite-tasks.md)。凭据被拒绝时，查看[登录故障排查](troubleshooting.md#sign-in)。

## 不连接后端体验界面 {#不连接后端体验界面}

打开 [doona lite 演示站点](https://demo.daeuniverse.org/lite/)，使用示例数据体验界面，无需连接后端。重新加载页面会重置对示例数据的修改。lite 的发布版本只能连接 honk，不提供试用演示按钮。

</div>

---

来源：[doona-docs](https://github.com/Zakkaus/doona-docs)，采用 [CC BY 4.0 许可证](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
