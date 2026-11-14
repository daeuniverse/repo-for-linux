# honk <Badge type="warning" text="Experimental" />

honk is a Linux transparent proxy engine written in Rust. It combines a dae-style eBPF datapath with userspace proxy protocols and routing. It creates the same `dae0` interface and `daens` network namespace as dae and attaches to the same interfaces. honk and dae therefore cannot run at the same time.

::: warning Not yet stable
honk is an alpha release. Its interfaces, configuration and features may change; it is not recommended for production.
:::

This manual follows honk `main` at commit `6db2c39`, which is newer than the packaged v0.1.0-beta.6; features documented here may reach the packages in the next release. It is fetched from upstream under GPL-3.0-only.

- [Install honk](./installation/)
- [Configuration guide](./configuration.md)
- [CLI reference](./reference/cli.md)
- [Configuration dialect reference](./reference/dialect.md)
