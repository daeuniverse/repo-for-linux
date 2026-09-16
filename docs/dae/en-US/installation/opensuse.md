### openSUSE

Use the Dae Universe repository at <https://daeuniverse.pages.dev>.
The commands below assume sudo is configured for your account.

#### 1. Add the Zypper Repository

<!--@include: @/.vitepress/snippets/repositories/en-US/opensuse-1.md-->

#### 2. Install dae

::: code-group

```sh [sudo]
sudo zypper install dae
```

```sh [root]
zypper install dae
```

:::

The package includes a systemd service and an example at `/etc/dae/example.dae`.
Save your configuration as `/etc/dae/config.dae`.
Complete [Minimal Configuration](/dae/start/minimal-configuration#minimal-configuration), then see
[Service Management](/dae/start/service-management#service-management).
