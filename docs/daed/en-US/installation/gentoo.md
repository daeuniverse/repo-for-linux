# Gentoo / Calculate <Badge type="info" text="Community maintained" />

Gentoo users can install `net-proxy/daed` from the [gentoo-zh overlay](https://github.com/gentoo-zh/overlay/tree/master/net-proxy/daed). This package is maintained by the Gentoo community and uses Portage. The APT/RPM version table on this site describes a separate repository.

::: info User and architecture
The keyword example applies to amd64 systems.
:::

Use the sudo tab if sudo is configured for your account; use the root tab when already in a root shell.

## 1. Add and synchronize the overlay

<!--@include: @/.vitepress/snippets/repositories/en-US/gentoo-1.md-->

## 2. Accept the testing keyword

On a stable amd64 system, add this entry to `package.accept_keywords`. If `/etc/portage/package.accept_keywords` is a directory, use a file inside it, such as `/etc/portage/package.accept_keywords/daed`. If it is a file, add the entry there.

```text
net-proxy/daed::gentoo-zh ~amd64
```

Systems already using `~amd64` globally can skip this step. For other architectures, check the selected ebuild's `KEYWORDS` before choosing a keyword.

## 3. Install daed

::: code-group

```sh [sudo]
sudo emerge --ask net-proxy/daed::gentoo-zh
```

```sh [root]
emerge --ask net-proxy/daed::gentoo-zh
```

:::

Review Portage's kernel checks. Keep the default `webui` USE flag enabled for the daed binary and service described here. Disabling it installs dae-wing instead.

Follow the [upstream configuration guide](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md).

### Optional: mirrors and binary packages

::: details Mirrors and binary packages
Follow the [gentoo-zh overlay guide](https://gentoozh.org/overlay/) for Distfiles mirrors, binhost channels and signature verification. Check the [binary package list](https://distfiles.gentoozh.org/packages) for availability; Portage can build from source when no suitable binary package exists.
:::

The ebuild installs systemd and OpenRC service files. For OpenRC, first follow the ebuild’s post-install instructions for `rc.conf` and `sysfs`, then reboot. See [Service management](/daed/service-management).

---

[gentoo-zh: daed ebuild](https://github.com/gentoo-zh/overlay/blob/master/net-proxy/daed/daed-1.27.0-r1.ebuild) · [OpenRC](https://github.com/gentoo-zh/overlay/blob/master/net-proxy/daed/files/daed.initd)
