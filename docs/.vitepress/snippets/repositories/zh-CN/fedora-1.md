如果系统尚未安装 `curl`，先安装它。

::: code-group

```sh [sudo]
sudo dnf install curl
```

```sh [root]
dnf install curl
```

:::

软件源配置文件包含 GPG 密钥地址。
DNF 首次使用该软件源时会询问是否导入密钥。

::: code-group

```sh [sudo]
sudo curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

```sh [root]
curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

:::
