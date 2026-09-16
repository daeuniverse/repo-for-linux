### openSUSE

使用 <https://daeuniverse.pages.dev> 提供的 Dae Universe 套件庫。
以下命令假定已為當前帳戶設定 sudo。

#### 1. 新增 Zypper 套件庫

<!--@include: @/.vitepress/snippets/repositories/zh-TW/opensuse-1.md-->

#### 2. 安裝 dae

::: code-group

```sh [sudo]
sudo zypper install dae
```

```sh [root]
zypper install dae
```

:::

套件包含 systemd 服務和範例檔案 `/etc/dae/example.dae`。
將設定儲存為 `/etc/dae/config.dae`。
完成[最小設定](/zh-TW/dae/start/minimal-configuration#最小設定)後，參見[服務管理](/zh-TW/dae/start/service-management#服務管理)。

