<div v-pre lang="en-US">

<!-- quick-start-requirements:start -->
## Linux Kernel Requirements

### Kernel Version

Use `uname -r` to check the kernel version on your machine.

```shell
uname -r
```

> **Note**
> If your kernel version is below 5.17, follow the [Upgrade Guide](/dae/user-guide/kernel-upgrade) to reach the minimum required version.

| Use case | Minimum kernel version | Traffic affected |
| --- | --- | --- |
| Bind to LAN | 5.17 | Traffic from LAN devices when dae acts as an intermediate device; local programs are unaffected if only LAN is bound. |
| Bind to WAN | 5.17 | Traffic from local programs; traffic arriving on other interfaces is unaffected if only WAN is bound. |
| Run `dae trace` | 5.15 | Network connectivity troubleshooting. |

The `trace` build tag is unavailable for `arm`, `mips`, `mips64`, `mips64le`,
`mipsle`, and `s390x` builds, so these builds do not include `dae trace`.
See the [Build Guide](/dae/user-guide/build-by-yourself#trace-support-per-architecture).

### Kernel Configurations

Mainstream desktop distributions usually enable the required options.
Distributions for embedded devices, such as OpenWrt and Armbian, disable some
of them by default to reduce kernel size.

Show your machine's kernel configuration:

```shell
zcat /proc/config.gz || cat /boot/{config,config-$(uname -r)}
```

dae requires:

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

Check the required options with the following commands.

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


> **Note**: Armbian users can follow the [Upgrade Guide](/dae/user-guide/kernel-upgrade) to meet the kernel configuration requirements.
>
> Arch Linux ARM users can use [`linux-aarch64-7ji`](https://github.com/7Ji-PKGBUILDs/linux-aarch64-7ji), which meets dae's kernel configuration requirements.
<!-- quick-start-requirements:end -->

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
