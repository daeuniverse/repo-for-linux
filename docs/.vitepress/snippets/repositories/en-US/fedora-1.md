Install `curl` if the system does not have it yet.

::: code-group

```sh [sudo]
sudo dnf install curl
```

```sh [root]
dnf install curl
```

:::

The repository configuration file includes the GPG key address.
DNF asks to import the key the first time it is used.

::: code-group

```sh [sudo]
sudo curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

```sh [root]
curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

:::
