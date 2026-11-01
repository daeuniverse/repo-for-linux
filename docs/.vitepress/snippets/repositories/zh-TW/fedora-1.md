如果系統尚未安裝 `curl`，先安裝它。

::: code-group

```sh [sudo]
sudo dnf install curl
```

```sh [root]
dnf install curl
```

:::

套件庫設定檔包含 GPG 金鑰位址。
DNF 首次使用該套件庫時會詢問是否匯入金鑰。

::: code-group

```sh [sudo]
sudo curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

```sh [root]
curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

:::
