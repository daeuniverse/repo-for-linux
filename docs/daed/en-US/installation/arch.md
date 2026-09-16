# Arch Linux / Manjaro <Badge type="info" text="Community maintained" />

daed is not in the official repositories. Install it from the [AUR](https://aur.archlinux.org/packages/daed) or [archlinuxcn](https://github.com/archlinuxcn/repo).

Both sources are community-maintained and independent of the APT/RPM repository described on this site.

## AUR

| Package | Build |
| --- | --- |
| `daed` | Builds from source |
| `daed-avx2-bin` | Prebuilt for x86-64-v3 / AVX2; no compilation needed |
| `daed-git` | Follows the main branch |

::: code-group

```shell [yay]
yay -S daed
```

```shell [paru]
paru -S daed
```

:::

## archlinuxcn

With archlinuxcn enabled, install from the repository without building.

::: code-group

```shell [sudo]
sudo pacman -S daed
```

```shell [root]
pacman -S daed
```

:::

`daed-avx2-bin` and `daed-git` are available from archlinuxcn as well.

## Start the service

The package ships a systemd unit. After installation, see [service management](/daed/service-management) to start daed and enable it at boot. For configuration, see the [upstream guide](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md).
