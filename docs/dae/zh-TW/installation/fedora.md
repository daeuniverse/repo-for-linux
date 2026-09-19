### Fedora / RHEL

#### Dae Universe RPM 套件庫

Fedora 和 RHEL 可使用 <https://daeuniverse.pages.dev> 提供的 Dae Universe 套件庫。
以下命令假定已為當前帳戶設定 sudo。

##### 1. 新增 DNF 套件庫

<!--@include: @/.vitepress/snippets/repositories/zh-TW/fedora-1.md-->

##### 2. 安裝 dae

::: code-group

```sh [sudo]
sudo dnf install dae
```

```sh [root]
dnf install dae
```

:::

套件包含 systemd 服務和範例檔案 `/etc/dae/example.dae`。
將設定儲存為 `/etc/dae/config.dae`。
完成[最小設定](/zh-TW/dae/start/minimal-configuration#最小設定)後，參見[服務管理](/zh-TW/dae/start/service-management#服務管理)。

<div v-pre lang="zh-TW">

<!-- installation-4:start -->
#### Fedora Copr

dae 已釋出於 [Fedora Copr](https://copr.fedorainfracloud.org/coprs/zhullyb/v2rayA/package/dae)。
此方式僅適用於 Fedora，可替代 Dae Universe 套件庫。
`zhullyb/v2rayA` 是 Copr 專案名，安裝的套件為 `dae`。

::: code-group

```shell [sudo]
sudo dnf copr enable zhullyb/v2rayA
sudo dnf install dae
```

```shell [root]
dnf copr enable zhullyb/v2rayA
dnf install dae
```

:::
<!-- installation-4:end -->

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
