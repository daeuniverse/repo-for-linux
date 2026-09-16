# Arch Linux / Manjaro <Badge type="info" text="Community maintained" />

The Dae Universe repository provides no Arch packages. Use the official Arch repositories, the [AUR](https://aur.archlinux.org) or [archlinuxcn](https://github.com/archlinuxcn/repo).

Each source has its own package maintainers. Its versions are independent of those in the [package list](/guide/packages).

| Software | Source | Package |
| --- | --- | --- |
| v2ray | official `extra` | `v2ray` |
| Xray | AUR, archlinuxcn | `xray` |
| v2rayA | AUR, archlinuxcn | `v2raya`, `v2raya-bin` |
| Juicity | AUR | `juicity-server`, `juicity-client` |
| dae | official `extra`, AUR, archlinuxcn | `dae`, `dae-avx2-bin`, `dae-git` |
| daed | AUR, archlinuxcn | `daed`, `daed-avx2-bin`, `daed-git` |
| v2ray-rules-dat | AUR, archlinuxcn | `v2ray-rules-dat` |

The `pacman` commands below use sudo. Omit `sudo` when already in a root shell.

## Install from the official repositories

`dae` and `v2ray` are in the official `extra` repository and need no AUR helper.

::: code-group

```sh [dae]
sudo pacman -S dae
```

```sh [v2ray]
sudo pacman -S v2ray
```

:::

## Install from the AUR

Use an AUR helper to install the remaining software.

With yay:

::: code-group

```sh [Xray]
yay -S xray
```

```sh [v2rayA]
yay -S v2raya
```

```sh [v2rayA (prebuilt)]
yay -S v2raya-bin
```

```sh [Juicity server]
yay -S juicity-server
```

```sh [Juicity client]
yay -S juicity-client
```

```sh [v2ray-rules-dat]
yay -S v2ray-rules-dat
```

:::

With paru:

::: code-group

```sh [Xray]
paru -S xray
```

```sh [v2rayA]
paru -S v2raya
```

```sh [v2rayA (prebuilt)]
paru -S v2raya-bin
```

```sh [Juicity server]
paru -S juicity-server
```

```sh [Juicity client]
paru -S juicity-client
```

```sh [v2ray-rules-dat]
paru -S v2ray-rules-dat
```

:::

## Install from archlinuxcn

With archlinuxcn enabled, install these packages without building them locally. archlinuxcn has no Juicity package or stable `dae` package. Stable `dae` is in the official `extra` repository.

::: code-group

```sh [dae (AVX2 binary)]
sudo pacman -S dae-avx2-bin
```

```sh [dae (Git)]
sudo pacman -S dae-git
```

```sh [daed]
sudo pacman -S daed
```

```sh [daed (AVX2 binary)]
sudo pacman -S daed-avx2-bin
```

```sh [Xray]
sudo pacman -S xray
```

```sh [v2rayA]
sudo pacman -S v2raya
```

```sh [v2ray-rules-dat]
sudo pacman -S v2ray-rules-dat
```

:::

For the complete dae and daed installation, configuration and service steps, see [dae](/dae/installation/arch) and [daed](/daed/installation/arch).
