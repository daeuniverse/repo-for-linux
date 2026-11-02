---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Requirements {#requirements}

Check the gateway and browser before installing doona and honk. For an individual page or action, use [Feature requirements](feature-requirements.md).

## Gateway {#gateway}

Follow honk’s [Linux kernel requirements](https://github.com/daeuniverse/honk/blob/main/doc/en/how-to-start.md#linux-kernel-requirements) and [bpffs setup](https://github.com/daeuniverse/honk/blob/main/doc/en/how-to-start.md#bpffs) before starting the backend.

| Component | Requirement |
| --- | --- |
| Operating system | Linux; run the real transparent-proxy backend as root. |
| Kernel | Linux 6.12 or later; the real eBPF backend rejects older kernels. |
| cgroup | cgroup v2 with BPF support; the required socket hooks must attach. |
| Kernel type information | Raw BTF matching the running kernel, not an ELF debug image. |
| BPF filesystem | bpffs mounted at `/sys/fs/bpf` for the default pin directory. |
| HTTPS downloads | A system CA certificate store from your distribution. |

Keep console access or another way into the gateway for the first real start: honk changes its networking.

Check these kernel options using the commands in the linked honk guide:

- The real backend needs `CONFIG_BPF=y`, `CONFIG_BPF_SYSCALL=y`, `CONFIG_BPF_JIT=y`, `CONFIG_CGROUP_BPF=y`, `CONFIG_NET_SCHED=y`, `CONFIG_NET_CLS_ACT=y`, `CONFIG_NET_XGRESS=y` and `CONFIG_NET_NS=y`.
- `CONFIG_NET_CLS_ACT` selects `CONFIG_NET_XGRESS`. The TCX backend does not require the legacy `CONFIG_NET_CLS_BPF` or `CONFIG_NET_SCH_INGRESS` options.
- The default held-first-packet UDP path also needs `CONFIG_NF_TABLES`, `CONFIG_NF_TABLES_INET`, `CONFIG_NFT_CT`, `CONFIG_NFT_QUEUE` and `CONFIG_NETFILTER_NETLINK_QUEUE`, each set to `y` or `m`.

honk reads raw BTF from `HONK_VMLINUX_BTF` if set. Otherwise it tries `/sys/kernel/btf/vmlinux`, then `/usr/lib/debug/boot/vmlinux`; OpenWrt's `vmlinux-btf` package supplies the latter.

Confirm that `/sys/fs/bpf` is a bpffs mountpoint, not just a directory. If the system does not mount it automatically, use the `/etc/fstab` entry in honk's bpffs instructions above.


## honk version {#honk-version}

Use a honk build that implements doona's native API contract and includes the `native-api` build feature. A version number alone does not establish compatibility. Without that feature, a build cannot serve the API even with its configuration block.

Choose a compatible honk-core archive using the [installation guide](install.md). The app's [contract pin](https://github.com/Zakkaus/doona/blob/main/contract/api-standardize/SOURCE.md) identifies the API it expects.

On the gateway, run:

```sh
honk-core --version
```

After signing in, compare the running engine version on **System status** with the installed binary. For a missing API or a rejected build, see [native API troubleshooting](troubleshooting.md#no-native-api).

## Browser and source builds {#browser-and-source-builds}

| Component | Requirement |
| --- | --- |
| Browser | Standard-edition build targets: Chrome or Edge 120, Firefox 121, Safari 17 or later; JavaScript target ES2022. |
| Build the app | Node `^22.13.0 \|\| ^24.0.0 \|\| >=26.0.0` and pnpm 11.15.1. |
| Build this documentation site | Node `^22.18.0 \|\| ^24.0.0 \|\| >=26.0.0` and pnpm 11.15.1. |

Node and pnpm are only needed for [development](development.md), not to serve a prebuilt interface. Process-name routing has additional [feature requirements](feature-requirements.md#req-process-routing).

</div>

---

Source: [doona-docs](https://github.com/Zakkaus/doona-docs), licensed under [CC BY 4.0](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt).
