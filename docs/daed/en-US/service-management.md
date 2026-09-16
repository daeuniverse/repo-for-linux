# daed: service management

daed from the Dae Universe DEB/RPM repository uses `/etc/daed/` as its configuration directory.

The systemd unit conflicts with `dae.service`; choose one service. It has no reload action, so do not use `systemctl reload daed`.

Gentoo with the default `webui` USE flag also provides this systemd service.

## systemd

### Start now and enable at boot

::: code-group

```shell [sudo]
sudo systemctl enable --now daed
```

```shell [root]
systemctl enable --now daed
```

:::

### Start now

::: code-group

```shell [sudo]
sudo systemctl start daed
```

```shell [root]
systemctl start daed
```

:::

### Enable at boot

::: code-group

```shell [sudo]
sudo systemctl enable daed
```

```shell [root]
systemctl enable daed
```

:::

### Restart

::: code-group

```shell [sudo]
sudo systemctl restart daed
```

```shell [root]
systemctl restart daed
```

:::

Restart interrupts existing connections.

## OpenRC (Gentoo)

Use these commands after completing the OpenRC prerequisites in the [Gentoo installation guide](./installation/gentoo). The init script defines no reload action.

### Start now and enable at boot

::: code-group

```shell [sudo]
sudo rc-service daed start
sudo rc-update add daed default
```

```shell [root]
rc-service daed start
rc-update add daed default
```

:::

### Start now

::: code-group

```shell [sudo]
sudo rc-service daed start
```

```shell [root]
rc-service daed start
```

:::

### Enable at boot

::: code-group

```shell [sudo]
sudo rc-update add daed default
```

```shell [root]
rc-update add daed default
```

:::

### Restart

::: code-group

```shell [sudo]
sudo rc-service daed restart
```

```shell [root]
rc-service daed restart
```

:::
