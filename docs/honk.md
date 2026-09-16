# honk <Badge type="warning" text="Experimental" />

honk is a Linux transparent proxy engine written in Rust. Its kernel path follows dae's eBPF datapath and `dae0`/`daens` model. Its outbound groups, multi-protocol dialers and Clash-compatible API follow sing-box.

honk combines both designs in one process rather than porting either project line for line. It is released under GPL-3.0-only.

::: warning Not yet stable
Upstream marks honk as experimental and does not recommend it for production. It is in the `v0.0.1-alpha` series. Its interfaces, configuration and features can change without notice.
:::

This site has no honk installation or configuration guide. See upstream for supported features, the configuration format and current progress:

[honk project page](https://github.com/daeuniverse/honk)
