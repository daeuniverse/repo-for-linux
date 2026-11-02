---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 运行要求 {#requirements}

安装 doona 和 honk 前，先检查网关与浏览器。具体页面或操作的条件见[功能要求](feature-requirements.md)。

## 网关 {#网关}

启动后端前，请按 honk 的 [Linux 内核要求](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#linux-内核要求)与 [bpffs 设置](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#bpffs)检查网关。

| 组件 | 要求 |
| --- | --- |
| 操作系统 | Linux；实际透明代理后端须以 root 身份运行。 |
| 内核 | Linux 6.12 或更新版本；实际 eBPF 后端会拒绝更早的内核。 |
| cgroup | 支持 BPF 的 cgroup v2；必需的套接字钩子须成功挂载。 |
| 内核类型信息 | 与当前内核匹配的原始 BTF，不是 ELF 调试镜像。 |
| BPF 文件系统 | 默认固定目录要求在 `/sys/fs/bpf` 挂载 bpffs。 |
| HTTPS 下载 | 发行版提供的系统 CA 证书库。 |

首次启动实际后端时，保留控制台或其他连接网关的方式，因为 honk 会修改网关的网络配置。

使用上述 honk 指南中的命令检查内核选项：

- 实际后端需要 `CONFIG_BPF=y`、`CONFIG_BPF_SYSCALL=y`、`CONFIG_BPF_JIT=y`、`CONFIG_CGROUP_BPF=y`、`CONFIG_NET_SCHED=y`、`CONFIG_NET_CLS_ACT=y`、`CONFIG_NET_XGRESS=y` 和 `CONFIG_NET_NS=y`。
- `CONFIG_NET_CLS_ACT` 会选中 `CONFIG_NET_XGRESS`。TCX 后端不要求旧的 `CONFIG_NET_CLS_BPF` 或 `CONFIG_NET_SCH_INGRESS` 选项。
- 默认的 UDP 首包暂存处理还需要 `CONFIG_NF_TABLES`、`CONFIG_NF_TABLES_INET`、`CONFIG_NFT_CT`、`CONFIG_NFT_QUEUE` 和 `CONFIG_NETFILTER_NETLINK_QUEUE`，各项须设为 `y` 或 `m`。

设置了 `HONK_VMLINUX_BTF` 时，honk 从该路径读取原始 BTF。否则依次尝试 `/sys/kernel/btf/vmlinux` 和 `/usr/lib/debug/boot/vmlinux`；OpenWrt 的 `vmlinux-btf` 软件包提供后者。

确认 `/sys/fs/bpf` 是 bpffs 挂载点，而不只是目录。系统不会自动挂载时，使用上述 honk bpffs 说明中的 `/etc/fstab` 条目。


## honk 版本 {#honk-version}

使用实现 doona 原生 API 契约且启用 `native-api` 构建特性的 honk。仅凭版本号无法判断兼容性。缺少该构建特性的程序，即使添加 API 配置也无法提供 API。

按[安装指南](install.md)选择兼容的 honk-core 压缩包。应用的[契约版本记录](https://github.com/Zakkaus/doona/blob/main/contract/api-standardize/SOURCE.md)列出预期的 API。

在网关上执行：

```sh
honk-core --version
```

登录后，在**系统状态**中核对正在运行的引擎版本是否与已安装的程序一致。API 缺失或构建被拒绝时，查看[原生 API 故障排查](troubleshooting.md#no-native-api)。

## 浏览器与源码构建 {#浏览器与源码构建}

| 组件 | 要求 |
| --- | --- |
| 浏览器 | 标准版构建目标：Chrome 或 Edge 120、Firefox 121、Safari 17 或更新版本；JavaScript 目标为 ES2022。 |
| 构建应用 | Node `^22.13.0 \|\| ^24.0.0 \|\| >=26.0.0`，pnpm 11.15.1。 |
| 构建本文档站点 | Node `^22.18.0 \|\| ^24.0.0 \|\| >=26.0.0`，pnpm 11.15.1。 |

只有[开发](development.md)时才需要 Node 和 pnpm，托管已构建的界面不需要。按进程名路由的额外条件见[功能要求](feature-requirements.md#req-process-routing)。

</div>
