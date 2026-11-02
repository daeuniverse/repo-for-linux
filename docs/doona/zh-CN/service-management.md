---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 服务管理 {#title-服务管理}

按[快速入门](quick-start.md)或[独立界面设置](install.md)配置 honk，再按本页管理手动安装的服务及查看日志。若从软件源安装，请改用[软件源的服务说明](/zh-CN/openwrt/)，不要创建第二个服务。

## 1. 创建服务 {#1-创建服务}

选择当前服务管理器对应的部分。已有 honk 服务时，替换前先检查可执行文件与配置路径。以下示例使用本站安装指南中的路径。

### systemd {#systemd}

在网关上执行。使用 root shell 时省略 `sudo`。此单元使用 `/usr/local/bin/honk-core` 和 `/etc/honk/config.dae`。

```sh
sudo install -d -m 0700 /var/lib/honk
sudo tee /etc/systemd/system/honk-core.service > /dev/null <<'EOF'
[Unit]
Description=honk transparent proxy engine
Wants=network-online.target
After=network-online.target

[Service]
Type=notify
User=root
WorkingDirectory=/var/lib/honk
ExecStart=/usr/local/bin/honk-core --config /etc/honk/config.dae --disable-timestamp
ExecReload=/usr/local/bin/honk-core reload
Restart=on-failure
RestartSec=2s
TimeoutStopSec=30s
LimitNOFILE=1048576
LimitMEMLOCK=infinity
UMask=0077

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
```

此单元依据 [honk 的 systemd 示例](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#使用-systemd-运行)。为服务添加权限限制前，先检查该指南。

### OpenWrt procd {#openwrt-procd}

在路由器上以 root 执行。此脚本使用 `/usr/bin/honk-core`，以及 [OpenWrt 安装](install-openwrt.md#install-geodata)中准备的数据目录。

```sh
cat > /etc/init.d/honk-core <<'EOF'
#!/bin/sh /etc/rc.common

START=99
STOP=10
USE_PROCD=1

start_service() {
    procd_open_instance
    procd_set_param command /usr/bin/honk-core --config /etc/honk/config.dae --data-dir /etc/honk/data --disable-timestamp
    procd_set_param limits nofile="1048576 1048576"
    procd_set_param env MIMALLOC_PURGE_DELAY=0
    procd_set_param respawn
    procd_set_param stdout 1
    procd_set_param stderr 1
    procd_close_instance
}

reload_service() {
    /usr/bin/honk-core reload
}
EOF
chmod 0755 /etc/init.d/honk-core
```

`MIMALLOC_PURGE_DELAY=0` 要求 mimalloc 立即回收释放的内存页。说明见 [honk CLI 参考](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/cli.md)。

## 2. 启用并启动 honk {#2-启用并启动-honk}

::: code-group

```sh [systemd]
sudo systemctl enable --now honk-core
sudo systemctl status honk-core
```

```sh [OpenWrt]
/etc/init.d/honk-core enable
/etc/init.d/honk-core start
/etc/init.d/honk-core status
```

:::

systemd 状态应显示 `active (running)`；OpenWrt 状态应显示 `running`。按[快速入门](quick-start.md)打开 doona，确认监听地址可以访问。

在本次启动日志中确认 `native API listener ready` 和 `honk-core is running`。访问 API 监听地址的 `/api` 路径时，若 JSON 响应的 `auth` 对象中 `setup_required` 为 `true`，表示 API 可访问且尚未创建管理员。仅能访问 API，不代表实际 eBPF 后端能够路由流量。

即使 honk 启动成功，也须阅读启动诊断：解析器会对 `global` 中未知的标量键发出警告并忽略它们。

## 查看日志 {#查看日志}

::: code-group

```sh [systemd]
sudo journalctl -u honk-core -e
```

```sh [OpenWrt]
logread -e honk-core
```

:::

持续查看新消息时，systemd 使用 `sudo journalctl -u honk-core -f`，OpenWrt 使用 `logread -f -e honk-core`。按 Ctrl+C 停止跟踪。启动失败时，根据日志中的错误查阅[故障排查](troubleshooting.md#troubleshooting)。

journal 包含历次服务运行的日志。排查本次启动时，从最新的 `honk-core … starting` 消息开始查看；该消息也会显示引擎版本。

## 重新加载、重启或停止 {#重新加载重启或停止}

选择重新加载或重启前，先查[doona 可以更改什么](what-doona-can-change.md)。执行后查看日志，确认结果。

| 操作 | systemd | OpenWrt |
| --- | --- | --- |
| 启动 | `sudo systemctl start honk-core` | `/etc/init.d/honk-core start` |
| 重新加载配置 | `sudo systemctl reload honk-core` | `/etc/init.d/honk-core reload` |
| 重启 | `sudo systemctl restart honk-core` | `/etc/init.d/honk-core restart` |
| 停止 | `sudo systemctl stop honk-core` | `/etc/init.d/honk-core stop` |
| 禁用开机启动 | `sudo systemctl disable honk-core` | `/etc/init.d/honk-core disable` |

禁用开机启动不会停止正在运行的服务。若要让 honk 在重启机器后保持停止状态，须执行停止和禁用两项操作。

## 服务与重新加载故障 {#服务与重新加载故障}

| 现象或日志消息 | 含义与处理方法 |
| --- | --- |
| systemd 找不到 `honk-core.service` | 按第 1 步创建服务单元并执行 `sudo systemctl daemon-reload`，再按第 2 步启动。 |
| 重新加载时报 `no running honk-core instance` | 没有实际实例持有进程锁。使用 `--mock-ebpf` 的前台进程不会持有该锁；按第 2 步启动要使用的实际服务。 |
| `SIGHUP reload applied` | 新配置已应用。 |
| `SIGHUP reload rejected` | 结合 `stage` 和同时出现的错误，判断新配置是否已应用；若被拒绝是因为需要重启，在主机上编辑列出的设置后[重启 honk](what-doona-can-change.md)。 |
| `SIGHUP reload committed with degraded datapath` | 配置已提交，但数据路径已降级。先检查同时出现的错误，再判断服务是否正常。 |

重新加载命令成功退出，不代表新配置已应用；须查看服务日志中的结果。

## OpenRC 或前台测试 {#openrc-或前台测试}

本页不提供 OpenRC 服务脚本。配置 honk 后，先停止已有实例，再从终端启动它以完成首次登录：

```sh
sudo /usr/local/bin/honk-core --config /etc/honk/config.dae
```

保持终端打开，按[快速入门](quick-start.md)中的浏览器步骤操作。日志显示在终端中，按 Ctrl+C 停止 honk。此命令不会启用开机启动。

启动服务前，先停止前台进程。使用 `--mock-ebpf` 检查启动时，不会测试实际 eBPF 挂载或路由。若原因是 `the mock eBPF backend was selected`，出现 `NFQUEUE is unavailable at startup; continuing with NFQUEUE staging disabled` 警告属于预期行为。

</div>

---

来源：[doona-docs](https://github.com/Zakkaus/doona-docs)，采用 [CC BY 4.0 许可证](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
