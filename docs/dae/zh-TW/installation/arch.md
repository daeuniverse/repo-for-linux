<div v-pre lang="zh-TW">

<!-- installation-0:start -->
### Arch Linux / Manjaro

可以直接從官方套件庫安裝 dae，也可從 [AUR](https://aur.archlinux.org) 或 [archlinuxcn](https://github.com/archlinuxcn/repo) 獲取最新的 AVX2 最佳化二進位套件或最新 Git 版本。

| 來源 | 套件 |
| --- | --- |
| 官方套件庫 | dae |
| [AUR](https://aur.archlinux.org) | 最新的 AVX2 最佳化二進位套件或最新 Git 版本 |
| [archlinuxcn](https://github.com/archlinuxcn/repo) | 最新的 AVX2 最佳化二進位套件或最新 Git 版本 |

#### 官方套件庫

::: code-group

```shell [sudo]
sudo pacman -S dae
```

```shell [root]
pacman -S dae
```

:::

#### AUR

##### 最新發行版（針對 x86-64 v3 / AVX2 最佳化）

::: code-group

```shell [yay]
yay -S dae-avx2-bin
```

```shell [paru]
paru -S dae-avx2-bin
```

:::

##### 最新 Git 版本

::: code-group

```shell [yay]
yay -S dae-git
```

```shell [paru]
paru -S dae-git
```

:::

#### archlinuxcn

##### 最新發行版（針對 x86-64 v3 / AVX2 最佳化）

::: code-group

```shell [sudo]
sudo pacman -S dae-avx2-bin
```

```shell [root]
pacman -S dae-avx2-bin
```

:::

##### 最新 Git 版本

::: code-group

```shell [sudo]
sudo pacman -S dae-git
```

```shell [root]
pacman -S dae-git
```

:::

安裝後，使用 `systemctl` 管理服務：
<!-- installation-0:end -->

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
