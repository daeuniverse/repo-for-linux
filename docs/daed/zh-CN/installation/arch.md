# Arch Linux / Manjaro <Badge type="info" text="社区维护" />

官方仓库没有 daed，可从 [AUR](https://aur.archlinux.org/packages/daed) 或 [archlinuxcn](https://github.com/archlinuxcn/repo) 安装。

两处的软件包均由社区维护，与本站的 APT/RPM 软件源无关。

## AUR

| 软件包 | 构建方式 |
| --- | --- |
| `daed` | 从源代码构建 |
| `daed-avx2-bin` | 针对 x86-64-v3 / AVX2 优化的二进制包，无需编译 |
| `daed-git` | 跟随主分支 |

::: code-group

```shell [yay]
yay -S daed
```

```shell [paru]
paru -S daed
```

:::

## archlinuxcn

已启用 archlinuxcn 时，直接从软件源安装，无需构建。

::: code-group

```shell [sudo]
sudo pacman -S daed
```

```shell [root]
pacman -S daed
```

:::

`daed-avx2-bin` 与 `daed-git` 在 archlinuxcn 中同样可用。

## 启动服务

软件包提供 systemd 服务文件。安装后参阅[服务管理](/zh-CN/daed/service-management)，启动 daed 并设置开机启动。配置方法见[上游说明](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md)。
