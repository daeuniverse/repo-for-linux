# First run

Configure and start honk after installing the package on [Debian / Ubuntu](./debian.md), [Fedora / RHEL](./fedora.md) or [openSUSE](./opensuse.md).

Use the sudo tab if sudo is configured for your account. Use the root tab when already in a root shell.

## 1. Configure honk

For a new installation, save the following direct-only configuration as `config.dae` in your current directory. Replace `br-lan` with the LAN interface receiving client traffic; remove `lan_interface` to intercept only traffic from this host. `wan_interface: auto` follows the IPv4 default route.

```dae
global {
    wan_interface: auto
    lan_interface: br-lan
    data_dir: '/var/lib/honk'
    log_level: info
    dial_mode: domain
    auto_config_kernel_parameter: true
}

routing {
    fallback: direct
}
```

If `/etc/honk/config.dae` already exists, keep it and skip this step. Otherwise install the configuration with restricted permissions:

::: code-group

```sh [sudo]
sudo install -d -m 0700 /etc/honk /var/lib/honk
sudo install -m 0600 ./config.dae /etc/honk/config.dae
```

```sh [root]
install -d -m 0700 /etc/honk /var/lib/honk
install -m 0600 ./config.dae /etc/honk/config.dae
```

:::

Edit `/etc/honk/config.dae` for your network before starting the service. See [How to start](../how-to-start.md) for kernel requirements and minimal configuration.

The package embeds doona. To enable it, add this block to your configuration, or merge it into an existing `experimental` block:

```dae
experimental {
    native_api {
        enabled: true
        listen: '127.0.0.1:9527'
        password_auth: true
        config_write: true
        ui: 'embedded'
    }
}
```

## 2. Start the service

If dae is installed, stop it and disable its startup at boot before starting honk:

::: code-group

```sh [sudo]
sudo systemctl disable --now dae.service
```

```sh [root]
systemctl disable --now dae.service
```

:::

::: code-group

```sh [sudo]
sudo systemctl enable --now honk.service
```

```sh [root]
systemctl enable --now honk.service
```

:::

Check that the service is running. The output should show `active (running)`:

::: code-group

```sh [sudo]
sudo systemctl status honk.service --no-pager
```

```sh [root]
systemctl status honk.service --no-pager
```

:::

If it is not running, read the last 50 journal lines of this boot:

::: code-group

```sh [sudo]
sudo journalctl -u honk.service -b -n 50 --no-pager
```

```sh [root]
journalctl -u honk.service -b -n 50 --no-pager
```

:::

On the honk host, open <http://127.0.0.1:9527/ui/> and create the administrator account on first access.

## Next steps

- [First sign-in](/doona/first-sign-in): open <http://127.0.0.1:9527/ui/> and create the administrator account.
- [Manage nodes, groups and rules](/doona/routing): add nodes or subscriptions and routing rules; until then all traffic goes direct.
- [Troubleshooting](/doona/troubleshooting): what to check when something does not work.
