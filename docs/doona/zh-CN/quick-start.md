---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 快速入门 {#title-快速入门}

使用 honk 内嵌的 doona，无需另行下载界面文件。

先检查[网关要求](requirements.md)。已有 honk 配置时请保留；全新后端须先准备 honk 的[最小配置](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#最小配置)，再加入下方 API 块。

## 1. 安装 honk {#1-安装-honk}

在 64 位 OpenWrt 或 ImmortalWrt 25.12 上，从 [daeuniverse 软件源](/zh-CN/openwrt/)安装 honk。

其他 Linux 系统请按[安装 honk](install.md#install)操作，从 [honk 发布页](https://github.com/daeuniverse/honk/releases)选择名称含 `full` 的压缩包。

## 2. 配置 honk {#2-配置-honk}

daeuniverse OpenWrt 软件源的默认配置已包含此块，且监听局域网而非 `127.0.0.1`，可直接跳到第 3 步。其他情况请将以下块写入 honk 配置，替换原有的 `native_api` 块：

```dae
experimental {
    native_api {
        enabled: true
        listen: '127.0.0.1:9527'
        password_auth: true
        config_write: true
        ui: 'embedded'
    }
}
```

若要改用 doona lite，设置 `ui: 'embedded-lite'`（自 honk v0.1.0-beta.4 起提供），详见 [doona lite](lite.md)。

其他选项见[配置参考](configuration.md)。[启动或重启 honk](service-management.md)后，更改才会生效。

## 3. 打开 doona {#3-打开-doona}

在运行 honk 的机器上打开 <http://127.0.0.1:9527/>。

使用 OpenWrt 软件源的默认配置时，在局域网内的电脑上打开 `http://<路由器 LAN IP>:9527/`，例如 <http://192.168.1.1:9527/>。请使用 IP 地址，honk 会拒绝 `openwrt.lan` 等主机名。

其他监听 `127.0.0.1` 的路由器，请在电脑执行以下命令。将 `<router>` 替换为路由器的 SSH 地址，并保持连接：

```sh
ssh -L 9527:127.0.0.1:9527 root@<router>
```

在电脑打开相同网址。首次访问会创建管理员，详见[首次登录](first-sign-in.md)。

</div>
