### Debian / Ubuntu

Debian、Ubuntu 及其他使用 APT 的發行版可使用 <https://daeuniverse.pages.dev> 提供的 Dae Universe 套件庫。
以下命令假定已為當前帳戶設定 sudo。

#### 1. 安裝 curl

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-1.md-->

#### 2. 新增 APT 套件庫

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-2.md-->

#### 3. 匯入 GPG 金鑰

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-3.md-->

#### 4. 安裝 dae

::: code-group

```sh [sudo]
sudo apt update
sudo apt install dae
```

```sh [root]
apt update
apt install dae
```

:::

套件包含 systemd 服務和範例檔案 `/etc/dae/example.dae`。
將設定儲存為 `/etc/dae/config.dae`。
完成[最小設定](/zh-TW/dae/start/minimal-configuration#最小設定)後，參見[服務管理](/zh-TW/dae/start/service-management#服務管理)。

