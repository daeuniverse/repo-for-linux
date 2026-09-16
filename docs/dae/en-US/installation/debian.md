### Debian / Ubuntu

For Debian, Ubuntu, and other APT-based distributions, use the Dae Universe
repository at <https://daeuniverse.pages.dev>.
The commands below assume sudo is configured for your account.

#### 1. Install curl

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-1.md-->

#### 2. Add the APT Repository

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-2.md-->

#### 3. Import the GPG Key

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-3.md-->

#### 4. Install dae

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

The package includes a systemd service and an example at `/etc/dae/example.dae`.
Save your configuration as `/etc/dae/config.dae`.
Complete [Minimal Configuration](/dae/start/minimal-configuration#minimal-configuration), then see
[Service Management](/dae/start/service-management#service-management).
