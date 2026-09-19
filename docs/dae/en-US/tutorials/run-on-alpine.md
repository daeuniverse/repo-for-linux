---
title: "Alpine Linux"
---

<div v-pre lang="en-US">

# Run on Alpine Linux

This tutorial covers Alpine Linux 3.20 and later.

- Alpine Linux 3.18 and later have full eBPF support out of the box. Earlier versions require a custom kernel build.
- Starting with Alpine Linux 3.20, some features required by dae are disabled for cross-architecture compatibility. Only `linux-virt` runs dae by default; `linux-lts` and `linux-edge` require a custom kernel build.

## Enable Community Repo

Run `setup-apkrepos` to open this menu:

::: code-group

```shell [sudo]
sudo setup-apkrepos
```

```shell [root]
setup-apkrepos
```

:::

```
 (f)    Find and use fastest mirror
 (s)    Show mirrorlist
 (r)    Use random mirror
 (e)    Edit /etc/apk/repositories with text editor
 (c)    Community repo enable
 (skip) Skip setting up apk repositories
```

Enter `c` to enable the community repository.

## Enable CGroups

Enable the `cgroups` service:

::: code-group

```sh [sudo]
sudo rc-update add cgroups boot
```

```sh [root]
rc-update add cgroups boot
```

:::

## Mount BPF

Edit `/etc/init.d/sysfs`:

::: code-group

```sh [sudo]
sudo vi /etc/init.d/sysfs
```

```sh [root]
vi /etc/init.d/sysfs
```

:::

Add the following to the `mount_misc` section:

```sh
        # Setup Kernel Support for bpf file system
        if [ -d /sys/fs/bpf ] && ! mountinfo -q /sys/fs/bpf; then
                if grep -qs bpf /proc/filesystems; then
                ebegin "Mounting eBPF filesystem"
                mount -n -t bpf -o ${sysfs_opts} bpffs /sys/fs/bpf
                eend $?
                fi
        fi
```

Check the syntax in `/etc/init.d/sysfs`. Errors will cause the `sysfs` service to fail.

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

## Install dae

Use [dae-installer](https://github.com/daeuniverse/dae-installer), which provides
an OpenRC service script. After installation, create
`/usr/local/etc/dae/config.dae` and set its permissions to 600 or 640:

::: code-group

```sh [sudo]
sudo chmod 640 /usr/local/etc/dae/config.dae
```

```sh [root]
chmod 640 /usr/local/etc/dae/config.dae
```

:::

Once the configuration is ready, start dae:

See [Start now](/dae/start/service-management#start-now).

## Start dae at Boot

Use `rc-update` to enable the dae service:

See [Enable at boot](/dae/start/service-management#enable-at-boot).

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/tutorials/run-on-alpine.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
