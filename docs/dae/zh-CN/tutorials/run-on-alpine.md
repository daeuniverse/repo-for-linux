---
title: "Alpine Linux"
---

<div v-pre lang="zh-CN">

# 在 Alpine Linux 上运行

本教程适用于 Alpine Linux 3.20 及更新版本。内核要求如下：

| Alpine Linux 版本 | eBPF 支持与内核要求 |
| --- | --- |
| 早于 3.18 | 需要自行构建内核 |
| 3.18 及更新版本 | 默认完整支持 eBPF，但 3.20 起有下述限制 |
| 3.20 及更新版本 | 为兼容不同 CPU 架构，禁用了 dae 所需的部分功能；默认仅 `linux-virt` 可运行 dae，使用 `linux-lts` 或 `linux-edge` 时需自行构建内核 |

## 启用 Community 仓库

执行 `setup-apkrepos` 后，会显示以下菜单：

::: code-group

```shell [sudo]
sudo setup-apkrepos
```

```shell [root]
setup-apkrepos
```

:::

```
 (f)    Find and use fastest mirror
 (s)    Show mirrorlist
 (r)    Use random mirror
 (e)    Edit /etc/apk/repositories with text editor
 (c)    Community repo enable
 (skip) Skip setting up apk repositories
```

输入 `c` 以启用 Community 仓库。

## 启用 CGroups

启用 `cgroups` 服务：

::: code-group

```sh [sudo]
sudo rc-update add cgroups boot
```

```sh [root]
rc-update add cgroups boot
```

:::

## 挂载 bpf

编辑 `/etc/init.d/sysfs`：

::: code-group

```sh [sudo]
sudo vi /etc/init.d/sysfs
```

```sh [root]
vi /etc/init.d/sysfs
```

:::

在 `mount_misc` 部分添加以下内容：

```sh
        # Setup Kernel Support for bpf file system
        if [ -d /sys/fs/bpf ] && ! mountinfo -q /sys/fs/bpf; then
                if grep -qs bpf /proc/filesystems; then
                ebegin "Mounting eBPF filesystem"
                mount -n -t bpf -o ${sysfs_opts} bpffs /sys/fs/bpf
                eend $?
                fi
        fi
```

确保 `/etc/init.d/sysfs` 的脚本格式正确，否则 `sysfs` 服务会失败。

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

## 安装 dae

安装程序：<https://github.com/daeuniverse/dae-installer>。

该安装程序提供 dae 的 OpenRC 服务脚本。安装后，在 `/usr/local/etc/dae/config.dae` 添加配置文件，再将其权限设为 600 或 640：

::: code-group

```sh [sudo]
sudo chmod 640 /usr/local/etc/dae/config.dae
```

```sh [root]
chmod 640 /usr/local/etc/dae/config.dae
```

:::

配置文件准备好后，启动 dae 服务：

参见[立即启动](/zh-CN/dae/start/service-management#立即启动)。

## 开机启动 dae

使用 `rc-update` 启用 dae 服务：

参见[开机启动](/zh-CN/dae/start/service-management#开机启动)。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/tutorials/run-on-alpine.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
