# honk <Badge type="warning" text="Experimental" />

honk is a Linux transparent proxy engine written in Rust, combining a dae-style eBPF datapath with user-space proxy protocols and routing. It uses the same `dae0` interface and `daens` network namespace as dae and attaches to the same interfaces, so it cannot run at the same time as dae.

::: warning Not yet stable
honk is experimental. Its interfaces, configuration and features may change; it is not recommended for production.
:::

This manual shows **v0.1.0-beta.5** and is fetched from the pinned upstream release under GPL-3.0-only.

- [Install honk](./installation/)
- [Configuration](./configuration.md)
- [CLI reference](./reference/cli.md)
- [Configuration dialect reference](./reference/dialect.md)
