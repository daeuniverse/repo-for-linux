# Arch Linux / Manjaro <Badge type="info" text="Community maintained" />

The Dae Universe repository provides no Arch packages. Use the official Arch repositories, the [AUR](https://aur.archlinux.org) or [archlinuxcn](https://github.com/archlinuxcn/repo).

Each source has its own package maintainers. Its versions are independent of those in the [package list](/guide/packages).

## Official repositories

These packages are in the `extra` repository and need no AUR helper.

| Software | Package name |
| --- | --- |
| dae | `dae` |
| v2ray | `v2ray` |

## AUR

| Software | Package name |
| --- | --- |
| dae | `dae-avx2-bin`, `dae-git` |
| [daed](/daed/) (archived; do not use it for new installations) | `daed`, `daed-avx2-bin`, `daed-git` |
| Xray | `xray` |
| v2rayA | `v2raya`, `v2raya-bin` |
| Juicity | `juicity-server`, `juicity-client` |
| v2ray-rules-dat | `v2ray-rules-dat` |

## archlinuxcn

With archlinuxcn enabled, these packages install without a local build. archlinuxcn has no Juicity package or stable `dae` package. Stable `dae` is in the official `extra` repository.

| Software | Package name |
| --- | --- |
| dae | `dae-avx2-bin`, `dae-git` |
| [daed](/daed/) (archived; do not use it for new installations) | `daed`, `daed-avx2-bin` |
| Xray | `xray` |
| v2rayA | `v2raya` |
| v2ray-rules-dat | `v2ray-rules-dat` |

## Install

Replace `PACKAGE` with a name from the tables above.

`yay` and `paru` install from every source above; `pacman` installs only from the official repositories and archlinuxcn. The `pacman` command uses sudo; omit `sudo` when already in a root shell.

::: code-group

```sh [yay]
yay -S PACKAGE
```

```sh [paru]
paru -S PACKAGE
```

```sh [pacman]
sudo pacman -S PACKAGE
```

:::

For the complete dae and daed installation, configuration and service steps, see [dae](/dae/installation/arch) and [daed](/daed/installation/arch).
