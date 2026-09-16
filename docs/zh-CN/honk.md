# honk <Badge type="warning" text="实验性" />

honk 是用 Rust 编写的 Linux 透明代理引擎。其内核路径沿用 dae 的 eBPF 数据面与 `dae0`／`daens` 模型，用户态的出站分组、多协议 dialer 与 Clash 兼容 API 借鉴 sing-box。

honk 不是任一项目的逐行移植，而是将两者的设计整合到一个进程中，以 GPL-3.0-only 许可证发布。

::: warning 尚未稳定
上游将 honk 标注为实验性项目，版本仍处于 `v0.0.1-alpha` 阶段。接口、配置与功能随时可能变动，不建议用于生产环境。
:::

本站不提供 honk 的安装与配置说明。功能范围、配置格式与当前进度以上游为准：

[honk 项目主页](https://github.com/daeuniverse/honk)
