<div v-pre lang="en-US">

<!-- installation-0:start -->
### Arch Linux / Manjaro

Install dae from the official repository, or choose an alternative package:

| Source | Packages |
| --- | --- |
| Official repository | dae |
| [AUR](https://aur.archlinux.org) | Latest AVX2-optimized binary package or latest Git version |
| [archlinuxcn](https://github.com/archlinuxcn/repo) | Latest AVX2-optimized binary package or latest Git version |

#### Official Repository

::: code-group

```shell [sudo]
sudo pacman -S dae
```

```shell [root]
pacman -S dae
```

:::

#### AUR

##### Latest Release (Optimized Binary for x86-64 v3 / AVX2)

::: code-group

```shell [yay]
yay -S dae-avx2-bin
```

```shell [paru]
paru -S dae-avx2-bin
```

:::

##### Latest Git Version

::: code-group

```shell [yay]
yay -S dae-git
```

```shell [paru]
paru -S dae-git
```

:::

#### archlinuxcn

##### Latest Release (Optimized Binary for x86-64 v3 / AVX2)

::: code-group

```shell [sudo]
sudo pacman -S dae-avx2-bin
```

```shell [root]
pacman -S dae-avx2-bin
```

:::

##### Latest Git Version

::: code-group

```shell [sudo]
sudo pacman -S dae-git
```

```shell [root]
pacman -S dae-git
```

:::

After installation, manage dae with `systemctl`:

<!-- installation-0:end -->

See [Service Management](/dae/start/service-management).

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
