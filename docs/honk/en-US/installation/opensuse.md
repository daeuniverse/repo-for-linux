# openSUSE

Install honk from the Dae Universe repository.

Use the sudo tab if sudo is configured for your account. Use the root tab when already in a root shell.

These steps need systemd and Linux 6.12 or later. Check the kernel version with `uname -r`; the [kernel requirements](../how-to-start.md#linux-kernel-requirements) list the rest.

## 1. Add the repository

<!--@include: @/.vitepress/snippets/repositories/en-US/opensuse-1.md-->

## 2. Install honk

::: code-group

```sh [sudo]
sudo zypper install honk
```

```sh [root]
zypper install honk
```

:::

Continue with [First run](./first-run.md).

## Upgrade

Upgrade the package, then restart honk and check its status. The package hook only reloads systemd unit definitions; it does not restart the running process.

::: code-group

```sh [sudo]
sudo zypper update honk
sudo systemctl restart honk.service
sudo systemctl status honk.service --no-pager
```

```sh [root]
zypper update honk
systemctl restart honk.service
systemctl status honk.service --no-pager
```

:::

## Uninstall

::: code-group

```sh [sudo]
sudo systemctl disable --now honk.service
sudo zypper remove honk
```

```sh [root]
systemctl disable --now honk.service
zypper remove honk
```

:::

The configuration directory `/etc/honk` and runtime state directory `/var/lib/honk` remain on the host. If you changed `data_dir`, that directory also remains.
