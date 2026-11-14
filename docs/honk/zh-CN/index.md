# honk <Badge type="warning" text="实验性" />

honk 是 Linux 上用 Rust 编写的实验性 eBPF 透明代理引擎，把 dae 风格的 eBPF 数据路径与用户态代理协议、路由整合在一起。它创建 `dae0` 网卡和 `daens` 网络命名空间，并与 dae 挂接到同一批网卡上，因此不能与 dae 同时运行。

::: warning 尚未稳定
honk 仍处于 alpha 阶段，不建议用于生产环境。真实模式会加载 eBPF、挂接 TC/cgroup hook、创建 `dae0`/`daens`、调整 sysctl，默认还占用 NFQUEUE 320；首次部署时保留一条带外管理通道。
:::

本手册跟随 honk `main` 的提交 `226830e`，比软件包中的 v0.1.0-beta.6 新；这里写到的功能可能要到下一个版本才进入软件包。内容从上游抓取，采用 GPL-3.0-only 许可证。

- [安装 honk](./installation/)
- [配置指南](./configuration.md)
- [CLI 参考](./reference/cli.md)
- [配置方言参考](./reference/dialect.md)
