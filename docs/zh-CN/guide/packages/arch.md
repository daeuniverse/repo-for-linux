# Arch Linux / Manjaro <Badge type="info" text="社区维护" />

Dae Universe 软件源不提供 Arch 软件包。此页软件来自 Arch 官方仓库、[AUR](https://aur.archlinux.org) 与 [archlinuxcn](https://github.com/archlinuxcn/repo)。

软件包由各自的维护者打包。其版本与[软件包列表](/zh-CN/guide/packages)中的软件源版本相互独立。

## 官方仓库

这些软件包在官方 `extra` 仓库中，无需 AUR 助手。

| 软件 | 软件包名称 |
| --- | --- |
| dae | `dae` |
| v2ray | `v2ray` |

## AUR

| 软件 | 软件包名称 |
| --- | --- |
| dae | `dae-avx2-bin`、`dae-git` |
| [daed](/zh-CN/daed/)（已归档，请勿用于新安装） | `daed`、`daed-avx2-bin`、`daed-git` |
| Xray | `xray` |
| v2rayA | `v2raya`、`v2raya-bin` |
| Juicity | `juicity-server`、`juicity-client` |
| v2ray-rules-dat | `v2ray-rules-dat` |

## archlinuxcn

已启用 archlinuxcn 时，这些软件包直接从软件源安装，无需构建。archlinuxcn 没有 juicity，也没有稳定版 `dae`，该版本在官方 `extra` 仓库中。

| 软件 | 软件包名称 |
| --- | --- |
| dae | `dae-avx2-bin`、`dae-git` |
| [daed](/zh-CN/daed/)（已归档，请勿用于新安装） | `daed`、`daed-avx2-bin` |
| Xray | `xray` |
| v2rayA | `v2raya` |
| v2ray-rules-dat | `v2ray-rules-dat` |

## 安装

将命令中的 `PACKAGE` 替换为上方表格中的软件包名称。

`yay` 与 `paru` 可从上方所有来源安装；`pacman` 只能从官方仓库和 archlinuxcn 安装，并使用 sudo，已进入 root shell 时去掉 `sudo`。

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

dae 与 daed 的完整安装、配置与服务步骤见 [dae](/zh-CN/dae/installation/arch) 与 [daed](/zh-CN/daed/installation/arch)。
