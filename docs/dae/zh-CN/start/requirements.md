<div v-pre lang="zh-CN">

<!-- quick-start-requirements:start -->
## Linux 内核要求

### 内核版本

使用 `uname -r` 检查计算机上的内核版本。

```shell
uname -r
```

> **注意**：内核版本低于 `5.17` 时，请按照[升级指南](/zh-CN/dae/user-guide/kernel-upgrade)升级到最低要求版本。

| 使用方式 | 最低内核版本 | 用途与影响范围 |
| --- | --- | --- |
| 绑定到 LAN | `5.17` | 作为中间设备为 LAN 提供网络服务。仅绑定 LAN 时，只处理来自 LAN 的流量，不影响本地程序。 |
| 绑定到 WAN | `5.17` | 为本地程序提供网络服务。仅绑定 WAN 时，不影响从其他接口进入的流量。 |
| `dae trace` | `5.15` | 排查网络连通性问题。 |

`arm`、`mips`、`mips64`、`mips64le`、`mipsle` 和 `s390x` 架构的构建不支持 `trace` 构建标签，因此不提供 `dae trace` 命令。详见[构建指南](/zh-CN/dae/user-guide/build-by-yourself#各架构的-trace-支持)。

### 内核配置

主流桌面发行版通常会启用所需配置项。OpenWRT、Armbian 等嵌入式设备发行版为了减小内核体积，默认会关闭部分配置项。

使用以下命令查看计算机上的内核配置：

```shell
zcat /proc/config.gz || cat /boot/{config,config-$(uname -r)}
```

dae 需要以下配置项：

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

使用以下命令检查这些配置项。

Bash 和其他兼容 POSIX 的 shell：

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

> **注意**：Armbian 用户可按照[升级指南](/zh-CN/dae/user-guide/kernel-upgrade)升级内核，以满足配置要求。
>
> Arch Linux ARM 用户可使用满足 dae 内核配置要求的 [`linux-aarch64-7ji`](https://github.com/7Ji-PKGBUILDs/linux-aarch64-7ji)。
<!-- quick-start-requirements:end -->

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
