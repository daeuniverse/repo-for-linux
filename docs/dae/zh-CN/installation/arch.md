<div v-pre lang="zh-CN">

<!-- installation-0:start -->
### Arch Linux / Manjaro

可以直接从官方仓库安装 dae，也可从 [AUR](https://aur.archlinux.org) 或 [archlinuxcn](https://github.com/archlinuxcn/repo) 获取最新的 AVX2 优化二进制软件包或最新 Git 版本。

| 来源 | 软件包 |
| --- | --- |
| 官方仓库 | dae |
| [AUR](https://aur.archlinux.org) | 最新的 AVX2 优化二进制软件包或最新 Git 版本 |
| [archlinuxcn](https://github.com/archlinuxcn/repo) | 最新的 AVX2 优化二进制软件包或最新 Git 版本 |

#### 官方仓库

::: code-group

```shell [sudo]
sudo pacman -S dae
```

```shell [root]
pacman -S dae
```

:::

#### AUR

##### 最新发行版（针对 x86-64 v3 / AVX2 优化）

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

##### 最新发行版（针对 x86-64 v3 / AVX2 优化）

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

安装后，使用 `systemctl` 管理服务：
<!-- installation-0:end -->

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
