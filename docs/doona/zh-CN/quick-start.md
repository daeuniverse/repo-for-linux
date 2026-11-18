---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 快速入门 {#title-快速入门}

使用 honk 内嵌的 doona，无需另行下载界面文件。

先检查[网关要求](requirements.md)。全新后端须先按 honk 的[最小配置](/zh-CN/honk/how-to-start#最小配置)准备配置，再启用 API。

## 1. 安装 honk {#1-安装-honk}

按 [honk 安装指南](/zh-CN/honk/installation/)安装 honk；在 OpenWrt 上可直接使用 [daeuniverse 软件源](/zh-CN/openwrt/)。内嵌 doona 需要 `full` 构建。

## 2. 配置 honk {#2-配置-honk}

在 honk 配置中加入 `native_api` 块，设置 `enabled: true`、`listen` 地址、`password_auth: true` 和 `config_write: true`。完整块（含 `ui: 'embedded'`）见 honk 的[网页界面与 API](/zh-CN/honk/how-to-start#网页界面与-api)；改用 doona lite 时，按 [doona lite](lite.md) 设置 `ui: 'embedded-lite'`。

[启动或重启 honk](service-management.md) 后生效。

## 3. 打开 doona {#3-打开-doona}

在运行 honk 的机器上打开 <http://127.0.0.1:9527/>。

使用 OpenWrt 软件源的默认配置时，在局域网内的电脑上打开 `http://<路由器 LAN IP>:9527/`，例如 <http://192.168.1.1:9527/>。请使用 IP 地址，honk 会拒绝 `openwrt.lan` 等主机名。

其他监听 `127.0.0.1` 的路由器，请在电脑执行以下命令。将 `<router>` 替换为路由器的 SSH 地址，并保持连接：

```sh
ssh -L 9527:127.0.0.1:9527 root@<router>
```

在电脑打开相同网址。首次访问会创建管理员，详见[首次登录](first-sign-in.md)。

</div>
