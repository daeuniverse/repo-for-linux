# Arch Linux / Manjaro <Badge type="info" text="社区维护" />

Dae Universe 软件源不提供 Arch 软件包。此页软件来自 Arch 官方仓库、[AUR](https://aur.archlinux.org) 与 [archlinuxcn](https://github.com/archlinuxcn/repo)。

软件包由各自的维护者打包。其版本与[软件包列表](/zh-CN/guide/packages)中的软件源版本相互独立。

| 软件 | 来源 | 软件包 |
| --- | --- | --- |
| v2ray | 官方 `extra` | `v2ray` |
| Xray | AUR、archlinuxcn | `xray` |
| v2rayA | AUR、archlinuxcn | `v2raya`、`v2raya-bin` |
| Juicity | AUR | `juicity-server`、`juicity-client` |
| dae | 官方 `extra`、AUR、archlinuxcn | `dae`、`dae-avx2-bin`、`dae-git` |
| daed | AUR、archlinuxcn | `daed`、`daed-avx2-bin`、`daed-git` |
| v2ray-rules-dat | AUR、archlinuxcn | `v2ray-rules-dat` |

`pacman` 命令使用 sudo，已进入 root shell 时去掉 `sudo`。

## 从官方仓库安装

`dae` 与 `v2ray` 在官方 `extra` 仓库中，无需 AUR 助手。

::: code-group

```sh [dae]
sudo pacman -S dae
```

```sh [v2ray]
sudo pacman -S v2ray
```

:::

## 从 AUR 安装

其余软件由 AUR 助手构建。

使用 yay：

::: code-group

```sh [Xray]
yay -S xray
```

```sh [v2rayA]
yay -S v2raya
```

```sh [v2rayA（预编译）]
yay -S v2raya-bin
```

```sh [Juicity 服务端]
yay -S juicity-server
```

```sh [Juicity 客户端]
yay -S juicity-client
```

```sh [v2ray-rules-dat]
yay -S v2ray-rules-dat
```

:::

使用 paru：

::: code-group

```sh [Xray]
paru -S xray
```

```sh [v2rayA]
paru -S v2raya
```

```sh [v2rayA（预编译）]
paru -S v2raya-bin
```

```sh [Juicity 服务端]
paru -S juicity-server
```

```sh [Juicity 客户端]
paru -S juicity-client
```

```sh [v2ray-rules-dat]
paru -S v2ray-rules-dat
```

:::

## 从 archlinuxcn 安装

已启用 archlinuxcn 时，这些软件包直接从软件源安装，无需构建。archlinuxcn 没有 juicity，也没有稳定版 `dae`，该版本在官方 `extra` 仓库中。

::: code-group

```sh [dae（AVX2 二进制）]
sudo pacman -S dae-avx2-bin
```

```sh [dae（Git）]
sudo pacman -S dae-git
```

```sh [daed]
sudo pacman -S daed
```

```sh [daed（AVX2 二进制）]
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

dae 与 daed 的完整安装、配置与服务步骤见 [dae](/zh-CN/dae/installation/arch) 与 [daed](/zh-CN/daed/installation/arch)。
