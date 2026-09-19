<div v-pre lang="zh-TW">

<!-- quick-start-requirements:start -->
## Linux 核心要求

### 核心版本

使用 `uname -r` 檢查電腦上的核心版本。

```shell
uname -r
```

> **注意**：核心版本低於 `5.17` 時，請按照[升級指南](/zh-TW/dae/user-guide/kernel-upgrade)升級到最低要求版本。

| 使用方式 | 最低核心版本 | 用途與影響範圍 |
| --- | --- | --- |
| 繫結到 LAN | `5.17` | 作為中間裝置為 LAN 提供網路服務。僅繫結 LAN 時，只處理來自 LAN 的流量，不影響本地程式。 |
| 繫結到 WAN | `5.17` | 為本地程式提供網路服務。僅繫結 WAN 時，不影響從其他介面進入的流量。 |
| `dae trace` | `5.15` | 排查網路連通性問題。 |

`arm`、`mips`、`mips64`、`mips64le`、`mipsle` 和 `s390x` 架構的建置不支援 `trace` 建置標籤，因此不提供 `dae trace` 命令。詳見[建置指南](/zh-TW/dae/user-guide/build-by-yourself#各架構的-trace-支援)。

### 核心設定

主流桌面發行版通常會啟用所需設定項。OpenWRT、Armbian 等嵌入式裝置發行版為了減小核心體積，預設會關閉部分設定項。

使用以下命令檢視電腦上的核心設定：

```shell
zcat /proc/config.gz || cat /boot/{config,config-$(uname -r)}
```

dae 需要以下設定項：

```
CONFIG_BPF=y
CONFIG_BPF_SYSCALL=y
CONFIG_BPF_JIT=y
CONFIG_CGROUPS=y
CONFIG_KPROBES=y
CONFIG_NET_INGRESS=y
CONFIG_NET_EGRESS=y
CONFIG_NET_SCH_INGRESS=m
CONFIG_NET_CLS_BPF=m
CONFIG_NET_CLS_ACT=y
CONFIG_BPF_STREAM_PARSER=y
CONFIG_DEBUG_INFO=y
# CONFIG_DEBUG_INFO_REDUCED is not set
CONFIG_DEBUG_INFO_BTF=y
CONFIG_KPROBE_EVENTS=y
CONFIG_BPF_EVENTS=y
```

使用以下命令檢查這些設定項。

Bash 和其他相容 POSIX 的 shell：

fish shell：

::: code-group

```shell [Bash / Zsh]
(zcat /proc/config.gz || cat /boot/config "/boot/config-$(uname -r)") |
  grep -E \
    -e 'CONFIG_(DEBUG_INFO|DEBUG_INFO_BTF|KPROBES|KPROBE_EVENTS)=' \
    -e 'CONFIG_(BPF|BPF_SYSCALL|BPF_JIT|BPF_STREAM_PARSER|BPF_EVENTS)=' \
    -e 'CONFIG_(NET_CLS_ACT|NET_SCH_INGRESS|NET_INGRESS|NET_EGRESS)=' \
    -e 'CONFIG_(NET_CLS_BPF|CGROUPS)=' \
    -e '# CONFIG_DEBUG_INFO_REDUCED is not set'
```

```fish [fish]
begin
  zcat /proc/config.gz || cat /boot/config "/boot/config-"(uname -r)
end | grep -E \
  -e 'CONFIG_(DEBUG_INFO|DEBUG_INFO_BTF|KPROBES|KPROBE_EVENTS)=' \
  -e 'CONFIG_(BPF|BPF_SYSCALL|BPF_JIT|BPF_STREAM_PARSER|BPF_EVENTS)=' \
  -e 'CONFIG_(NET_CLS_ACT|NET_SCH_INGRESS|NET_INGRESS|NET_EGRESS)=' \
  -e 'CONFIG_(NET_CLS_BPF|CGROUPS)=' \
  -e '# CONFIG_DEBUG_INFO_REDUCED is not set'
```

:::

> **注意**：Armbian 使用者可按照[升級指南](/zh-TW/dae/user-guide/kernel-upgrade)升級核心，以滿足設定要求。
>
> Arch Linux ARM 使用者可使用滿足 dae 核心設定要求的 [`linux-aarch64-7ji`](https://github.com/7Ji-PKGBUILDs/linux-aarch64-7ji)。
<!-- quick-start-requirements:end -->

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
