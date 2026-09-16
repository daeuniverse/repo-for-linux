---
title: "Alpine Linux"
---

<div v-pre lang="zh-TW">

# 在 Alpine Linux 上執行

本教學適用於 Alpine Linux 3.20 及更新版本。核心要求如下：

| Alpine Linux 版本 | eBPF 支援與核心要求 |
| --- | --- |
| 早於 3.18 | 需要自行建置核心 |
| 3.18 及更新版本 | 預設完整支援 eBPF，但 3.20 起有下述限制 |
| 3.20 及更新版本 | 為相容不同 CPU 架構，停用了 dae 所需的部分功能；預設僅 `linux-virt` 可執行 dae，使用 `linux-lts` 或 `linux-edge` 時需自行建置核心 |

## 啟用 Community 儲存庫

執行 `setup-apkrepos` 後，會顯示以下選單：

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

輸入 `c` 以啟用 Community 儲存庫。

## 啟用 CGroups

啟用 `cgroups` 服務：

::: code-group

```sh [sudo]
sudo rc-update add cgroups boot
```

```sh [root]
rc-update add cgroups boot
```

:::

## 掛載 bpf

編輯 `/etc/init.d/sysfs`：

::: code-group

```sh [sudo]
sudo vi /etc/init.d/sysfs
```

```sh [root]
vi /etc/init.d/sysfs
```

:::

在 `mount_misc` 部分新增以下內容：

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

確保 `/etc/init.d/sysfs` 的指令碼格式正確，否則 `sysfs` 服務會失敗。

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

## 安裝 dae

安裝程式：<https://github.com/daeuniverse/dae-installer>。

該安裝程式提供 dae 的 OpenRC 服務指令碼。安裝後，在 `/usr/local/etc/dae/config.dae` 新增設定檔，再將其權限設為 600 或 640：

::: code-group

```sh [sudo]
sudo chmod 640 /usr/local/etc/dae/config.dae
```

```sh [root]
chmod 640 /usr/local/etc/dae/config.dae
```

:::

設定檔準備好後，啟動 dae 服務：

參見[立即啟動](/zh-TW/dae/start/service-management#立即啟動)。

## 開機啟動 dae

使用 `rc-update` 啟用 dae 服務：

參見[開機啟動](/zh-TW/dae/start/service-management#開機啟動)。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/tutorials/run-on-alpine.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
