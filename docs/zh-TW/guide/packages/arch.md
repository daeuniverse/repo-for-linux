# Arch Linux / Manjaro <Badge type="info" text="社群維護" />

Dae Universe 套件來源不提供 Arch 套件。下列軟體來自 Arch 官方套件庫、[AUR](https://aur.archlinux.org) 與 [archlinuxcn](https://github.com/archlinuxcn/repo)。

各來源的套件由各自的維護者打包，其版本與[套件列表](/zh-TW/guide/packages)中的版本各自獨立。

## 官方套件庫

這些套件位於官方 `extra` 套件庫，不需 AUR 助手。

| 軟體 | 套件名稱 |
| --- | --- |
| dae | `dae` |
| v2ray | `v2ray` |

## AUR

| 軟體 | 套件名稱 |
| --- | --- |
| dae | `dae-avx2-bin`、`dae-git` |
| [daed](/zh-TW/daed/)（已歸檔，請勿用於新安裝） | `daed`、`daed-avx2-bin`、`daed-git` |
| Xray | `xray` |
| v2rayA | `v2raya`、`v2raya-bin` |
| Juicity | `juicity-server`、`juicity-client` |
| v2ray-rules-dat | `v2ray-rules-dat` |

## archlinuxcn

已啟用 archlinuxcn 時，這些套件直接從套件來源安裝，不需建置。archlinuxcn 沒有 juicity，也沒有穩定版 `dae`，該版本位於官方 `extra` 套件庫。

| 軟體 | 套件名稱 |
| --- | --- |
| dae | `dae-avx2-bin`、`dae-git` |
| [daed](/zh-TW/daed/)（已歸檔，請勿用於新安裝） | `daed`、`daed-avx2-bin` |
| Xray | `xray` |
| v2rayA | `v2raya` |
| v2ray-rules-dat | `v2ray-rules-dat` |

## 安裝

將指令中的 `PACKAGE` 替換為上方表格中的套件名稱。

`yay` 與 `paru` 可從上方所有來源安裝；`pacman` 只能從官方套件庫與 archlinuxcn 安裝，並使用 sudo；已進入 root shell 時，請移除指令中的 `sudo`。

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

dae 與 daed 的完整安裝、設定與服務步驟見 [dae](/zh-TW/dae/installation/arch) 與 [daed](/zh-TW/daed/installation/arch)。
