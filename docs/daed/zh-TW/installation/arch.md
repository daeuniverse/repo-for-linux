# Arch Linux / Manjaro <Badge type="info" text="社群維護" />

官方套件庫沒有 daed，可從 [AUR](https://aur.archlinux.org/packages/daed) 或 [archlinuxcn](https://github.com/archlinuxcn/repo) 安裝。

兩處的套件均由社群維護，與本站的 APT/RPM 套件來源無關。

## AUR

| 套件 | 建置方式與版本 |
| --- | --- |
| `daed` | 從原始碼建置 |
| `daed-avx2-bin` | 針對 x86-64-v3 / AVX2 最佳化的二進位套件，不需編譯 |
| `daed-git` | 跟隨主分支 |

::: code-group

```shell [yay]
yay -S daed
```

```shell [paru]
paru -S daed
```

:::

## archlinuxcn

已啟用 archlinuxcn 時，直接從套件來源安裝，不需建置。

::: code-group

```shell [sudo]
sudo pacman -S daed
```

```shell [root]
pacman -S daed
```

:::

`daed-avx2-bin` 與 `daed-git` 在 archlinuxcn 中同樣可用。

## 啟動服務

套件提供 systemd 服務檔案。安裝後請參閱[服務管理](/zh-TW/daed/service-management)，啟動 daed 並設定開機啟動。設定方法見[上游說明](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md)。
