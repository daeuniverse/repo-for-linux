# Arch Linux / Manjaro <Badge type="info" text="社群維護" />

Dae Universe 套件來源不提供 Arch 套件。下列軟體來自 Arch 官方套件庫、[AUR](https://aur.archlinux.org) 與 [archlinuxcn](https://github.com/archlinuxcn/repo)。

各來源的套件由各自的維護者打包，其版本與[套件列表](/zh-TW/guide/packages)中的版本各自獨立。

| 軟體 | 來源 | 套件 |
| --- | --- | --- |
| v2ray | 官方 `extra` | `v2ray` |
| Xray | AUR、archlinuxcn | `xray` |
| v2rayA | AUR、archlinuxcn | `v2raya`、`v2raya-bin` |
| Juicity | AUR | `juicity-server`、`juicity-client` |
| dae | 官方 `extra`、AUR、archlinuxcn | `dae`、`dae-avx2-bin`、`dae-git` |
| daed | AUR、archlinuxcn | `daed`、`daed-avx2-bin`、`daed-git` |
| v2ray-rules-dat | AUR、archlinuxcn | `v2ray-rules-dat` |

官方套件庫與 archlinuxcn 的安裝命令使用 sudo；已進入 root shell 時，請移除命令中的 `sudo`。AUR 命令使用 yay 或 paru。

## 從官方套件庫安裝

`dae` 與 `v2ray` 位於官方 `extra` 套件庫，不需 AUR 助手。

::: code-group

```sh [dae]
sudo pacman -S dae
```

```sh [v2ray]
sudo pacman -S v2ray
```

:::

## 從 AUR 安裝

其餘軟體由 AUR 助手建置。

使用 yay：

::: code-group

```sh [Xray]
yay -S xray
```

```sh [v2rayA]
yay -S v2raya
```

```sh [v2rayA（預先建置）]
yay -S v2raya-bin
```

```sh [Juicity 伺服端]
yay -S juicity-server
```

```sh [Juicity 用戶端]
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

```sh [v2rayA（預先建置）]
paru -S v2raya-bin
```

```sh [Juicity 伺服端]
paru -S juicity-server
```

```sh [Juicity 用戶端]
paru -S juicity-client
```

```sh [v2ray-rules-dat]
paru -S v2ray-rules-dat
```

:::

## 從 archlinuxcn 安裝

已啟用 archlinuxcn 時，這些套件直接從套件來源安裝，不需建置。archlinuxcn 沒有 juicity，也沒有穩定版 `dae`，該版本位於官方 `extra` 套件庫。

::: code-group

```sh [dae（AVX2 二進位）]
sudo pacman -S dae-avx2-bin
```

```sh [dae（Git）]
sudo pacman -S dae-git
```

```sh [daed]
sudo pacman -S daed
```

```sh [daed（AVX2 二進位）]
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

dae 與 daed 的完整安裝、設定與服務步驟見 [dae](/zh-TW/dae/installation/arch) 與 [daed](/zh-TW/daed/installation/arch)。
