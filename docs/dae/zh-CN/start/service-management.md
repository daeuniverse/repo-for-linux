# 服务管理

请先完成 dae 配置，再选择系统使用的服务管理器。页面默认选中 sudo 标签。

| 安装方式 | 服务管理器 | 配置文件／前提 |
| --- | --- | --- |
| Arch Linux | systemd | `/etc/dae/config.dae` |
| Debian | systemd | `/etc/dae/config.dae` |
| Ubuntu | systemd | `/etc/dae/config.dae` |
| Fedora | systemd | `/etc/dae/config.dae` |
| RHEL | systemd | `/etc/dae/config.dae` |
| openSUSE | systemd | `/etc/dae/config.dae` |
| Gentoo | systemd 或 OpenRC | `/etc/dae/config.dae` |
| NixOS | systemd | 开机启动由 [NixOS 模块](/zh-CN/dae/installation/nix) 管理 |
| Alpine（dae-installer） | OpenRC | `/usr/local/etc/dae/config.dae` |
| 手动安装 | 取决于安装的服务 | 需先安装对应的服务文件 |
| Docker | 不适用本页命令 | 请参阅对应平台教程 |
| macOS 主机 | 不适用本页命令 | 请参阅对应平台教程 |

按需选择以下操作，无需依次执行。

<!-- shared-service-actions:start -->
## 立即启动并设为开机启动

::: code-group

```shell [systemd · sudo]
sudo systemctl enable --now dae
```

```shell [systemd · root]
systemctl enable --now dae
```

```shell [OpenRC · sudo]
sudo rc-service dae start
sudo rc-update add dae default
```

```shell [OpenRC · root]
rc-service dae start
rc-update add dae default
```

:::

## 立即启动

::: code-group

```shell [systemd · sudo]
sudo systemctl start dae
```

```shell [systemd · root]
systemctl start dae
```

```shell [OpenRC · sudo]
sudo rc-service dae start
```

```shell [OpenRC · root]
rc-service dae start
```

:::

## 开机启动

设置开机启动不会立即启动服务。

::: code-group

```shell [systemd · sudo]
sudo systemctl enable dae
```

```shell [systemd · root]
systemctl enable dae
```

```shell [OpenRC · sudo]
sudo rc-update add dae default
```

```shell [OpenRC · root]
rc-update add dae default
```

:::

## 重载配置

修改配置文件后，重载正在运行的 dae 服务。

OpenRC 服务脚本未定义 reload 动作。服务运行时，使用 dae 自带的重载命令。

::: code-group

```shell [systemd · sudo]
sudo systemctl reload dae
```

```shell [systemd · root]
systemctl reload dae
```

```shell [OpenRC · sudo]
sudo dae reload
```

```shell [OpenRC · root]
dae reload
```

:::

## 重新启动服务

重新启动会停止并再次启动 dae，中断现有连接。应用配置变更时，可使用上方的重载命令。

::: code-group

```shell [systemd · sudo]
sudo systemctl restart dae
```

```shell [systemd · root]
systemctl restart dae
```

```shell [OpenRC · sudo]
sudo rc-service dae restart
```

```shell [OpenRC · root]
rc-service dae restart
```

:::
<!-- shared-service-actions:end -->

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
