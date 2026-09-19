# Service management

Complete the dae configuration first, then choose your service manager. The sudo tab is selected by default.

| Installation | Service manager | Configuration file / requirement |
| --- | --- | --- |
| Arch Linux | systemd | `/etc/dae/config.dae` |
| Debian | systemd | `/etc/dae/config.dae` |
| Ubuntu | systemd | `/etc/dae/config.dae` |
| Fedora | systemd | `/etc/dae/config.dae` |
| RHEL | systemd | `/etc/dae/config.dae` |
| openSUSE | systemd | `/etc/dae/config.dae` |
| Gentoo | systemd or OpenRC | `/etc/dae/config.dae` |
| NixOS | systemd | Boot enablement is managed by the [NixOS module](/dae/installation/nix) |
| Alpine (dae-installer) | OpenRC | `/usr/local/etc/dae/config.dae` |
| Manual installation | Depends on the installed service | Install the corresponding service file first |
| Docker | Not covered here | Follow the platform tutorial |
| macOS host | Not covered here | Follow the platform tutorial |

Choose the action you need; these are not sequential steps.

<!-- shared-service-actions:start -->
## Start now and enable at boot

::: code-group

```shell [systemd · sudo]
sudo systemctl enable --now dae
```

```shell [systemd · root]
systemctl enable --now dae
```

```shell [OpenRC · sudo]
sudo rc-service dae start
sudo rc-update add dae default
```

```shell [OpenRC · root]
rc-service dae start
rc-update add dae default
```

:::

## Start now

::: code-group

```shell [systemd · sudo]
sudo systemctl start dae
```

```shell [systemd · root]
systemctl start dae
```

```shell [OpenRC · sudo]
sudo rc-service dae start
```

```shell [OpenRC · root]
rc-service dae start
```

:::

## Enable at boot

Enabling the service at boot does not start it immediately.

::: code-group

```shell [systemd · sudo]
sudo systemctl enable dae
```

```shell [systemd · root]
systemctl enable dae
```

```shell [OpenRC · sudo]
sudo rc-update add dae default
```

```shell [OpenRC · root]
rc-update add dae default
```

:::

## Reload configuration

After editing the configuration file, reload the running dae service.

The OpenRC service script does not define a reload action. Use dae’s built-in reload command while the service is running.

::: code-group

```shell [systemd · sudo]
sudo systemctl reload dae
```

```shell [systemd · root]
systemctl reload dae
```

```shell [OpenRC · sudo]
sudo dae reload
```

```shell [OpenRC · root]
dae reload
```

:::

## Restart the service

Restart stops and starts dae, interrupting existing connections. To apply configuration changes, use reload above.

::: code-group

```shell [systemd · sudo]
sudo systemctl restart dae
```

```shell [systemd · root]
systemctl restart dae
```

```shell [OpenRC · sudo]
sudo rc-service dae restart
```

```shell [OpenRC · root]
rc-service dae restart
```

:::
<!-- shared-service-actions:end -->

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
