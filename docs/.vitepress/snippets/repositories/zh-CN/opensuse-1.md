如果系统尚未安装 `curl`，先安装它。

::: code-group

```sh [sudo]
sudo zypper install curl
```

```sh [root]
zypper install curl
```

:::

软件源配置文件包含 GPG 密钥地址。
Zypper 首次使用该软件源时会询问是否信任密钥。

::: code-group

```sh [sudo]
sudo curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

```sh [root]
curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

:::
