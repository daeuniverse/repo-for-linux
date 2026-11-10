# honk <Badge type="warning" text="实验性" />

honk 是用 Rust 编写的 Linux 透明代理引擎，将 dae 风格的 eBPF 数据路径与用户态代理协议、路由整合在一起。它使用与 dae 相同的 `dae0` 网卡和 `daens` 网络命名空间，并挂载在同一批网卡上，因此不能与 dae 同时运行。

::: warning 尚未稳定
honk 是实验性项目，接口、配置与功能可能变动，不建议用于生产环境。
:::

本手册对应 **v0.1.0-beta.6**，构建时从固定的上游版本获取，以 GPL-3.0-only 许可证发布。

- [安装 honk](./installation/)
- [配置指南](./configuration.md)
- [CLI 参考](./reference/cli.md)
- [配置方言参考](./reference/dialect.md)
