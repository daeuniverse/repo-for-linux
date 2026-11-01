如果系統尚未安裝 `curl`，先安裝它。

::: code-group

```sh [sudo]
sudo zypper install curl
```

```sh [root]
zypper install curl
```

:::

套件庫設定檔包含 GPG 金鑰位址。
Zypper 首次使用該套件庫時會詢問是否信任金鑰。

::: code-group

```sh [sudo]
sudo curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

```sh [root]
curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

:::
