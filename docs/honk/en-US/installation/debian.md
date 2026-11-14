# Debian / Ubuntu

Install honk from the Dae Universe repository on Debian, Ubuntu and other APT-based distributions.

If sudo is configured for your account, use the sudo tab. If you are already in a root shell, use the root tab.

These steps need systemd and Linux 6.12 or later. Check the kernel version with `uname -r`; the [kernel requirements](../how-to-start.md#linux-kernel-requirements) list the rest.

## 1. Install `curl`

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-1.md-->

## 2. Add the repository

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-2.md-->

## 3. Import the GPG key

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-3.md-->

## 4. Install honk

::: code-group

```sh [sudo]
sudo apt update
sudo apt install honk
```

```sh [root]
apt update
apt install honk
```

:::

Continue with [First run](./first-run.md).

## Upgrade

Upgrade the package, then restart honk and check its status. The package hook only reloads systemd unit definitions; it does not restart the running process.

::: code-group

```sh [sudo]
sudo apt update && sudo apt install --only-upgrade honk
sudo systemctl restart honk.service
sudo systemctl status honk.service --no-pager
```

```sh [root]
apt update && apt install --only-upgrade honk
systemctl restart honk.service
systemctl status honk.service --no-pager
```

:::

## Uninstall

::: code-group

```sh [sudo]
sudo systemctl disable --now honk.service
sudo apt remove honk
```

```sh [root]
systemctl disable --now honk.service
apt remove honk
```

:::

The configuration directory `/etc/honk` and runtime state directory `/var/lib/honk` remain on the host. If you changed `data_dir`, that directory also remains.
