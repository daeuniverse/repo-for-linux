# Gentoo / Calculate <Badge type="info" text="Community maintained" />

The Dae Universe repository provides no Gentoo packages. Gentoo and Calculate users install from the [gentoo-zh overlay](https://github.com/gentoo-zh/overlay).

The Gentoo community maintains these packages in Portage. Their versions are independent of those in the [package list](/guide/packages).

::: info User and architecture
The keyword example applies to amd64 systems.
:::

Use the sudo tab if sudo is configured for your account; use the root tab when already in a root shell.

## 1. Add and synchronize the overlay

<!--@include: @/.vitepress/snippets/repositories/en-US/gentoo-1.md-->

## 2. Accept the testing keyword

These overlay packages carry only testing keywords. Before installing, add an entry for the selected software to `package.accept_keywords`.

If `/etc/portage/package.accept_keywords` is a directory, use a separate file inside it. If it is a file, add the entry there.

::: code-group

```text [v2rayA]
net-proxy/v2rayA::gentoo-zh ~amd64
```

```text [v2ray]
net-proxy/v2ray::gentoo-zh ~amd64
```

```text [Xray]
net-proxy/Xray::gentoo-zh ~amd64
```

```text [Juicity]
net-proxy/juicity::gentoo-zh ~amd64
```

```text [v2ray-rules-dat]
dev-libs/v2ray-rules-dat-bin::gentoo-zh ~amd64
```

:::

Systems already using `~amd64` globally can skip this step. For other architectures, check the selected ebuild's `KEYWORDS` before choosing a keyword.

## 3. Select the software

::: code-group

```sh [v2rayA]
sudo emerge --ask net-proxy/v2rayA::gentoo-zh
```

```sh [v2ray]
sudo emerge --ask net-proxy/v2ray::gentoo-zh
```

```sh [Xray]
sudo emerge --ask net-proxy/Xray::gentoo-zh
```

```sh [Juicity]
sudo emerge --ask net-proxy/juicity::gentoo-zh
```

```sh [v2ray-rules-dat]
sudo emerge --ask dev-libs/v2ray-rules-dat-bin::gentoo-zh
```

:::

Drop `sudo` from the command when already in a root shell.

## Package differences

| Package | Notes |
| --- | --- |
| `net-proxy/juicity` | Builds only the server by default; enable the `client` USE flag if you need a client |
| `dev-libs/v2ray-rules-dat-bin` | Installs prebuilt rule data; `geosite` and `geoip` are enabled by default |
| Juicity-rs | No ebuild in the overlay |

For dae and daed, see [dae](/dae/installation/gentoo) and [daed](/daed/installation/gentoo).

### Optional: mirrors and binary packages

::: details Mirrors and binary packages
Follow the [gentoo-zh overlay guide](https://gentoozh.org/overlay/) for Distfiles mirrors, binhost channels and signature verification. Check the [binary package list](https://distfiles.gentoozh.org/packages) for availability; Portage can build from source when no suitable binary package exists.
:::
