# Gentoo / Calculate <Badge type="info" text="Community maintained" />

Gentoo users can install `net-proxy/dae` from the [gentoo-zh overlay](https://github.com/gentoo-zh/overlay/tree/master/net-proxy/dae). This package is maintained by the Gentoo community and uses Portage. The APT/RPM version table on this site describes a separate repository.

::: info User and architecture
The keyword example applies to amd64 systems.
:::

Use the sudo tab if sudo is configured for your account; use the root tab when already in a root shell.

## 1. Add and synchronize the overlay

<!--@include: @/.vitepress/snippets/repositories/en-US/gentoo-1.md-->

## 2. Accept the testing keyword

On a stable amd64 system, add this entry to `package.accept_keywords`. If `/etc/portage/package.accept_keywords` is a directory, use a file inside it, such as `/etc/portage/package.accept_keywords/dae`. If it is a file, add the entry there.

```text
net-proxy/dae::gentoo-zh ~amd64
```

Systems already using `~amd64` globally can skip this step. For other architectures, check the selected ebuild's `KEYWORDS` before choosing a keyword.

## 3. Install dae

::: code-group

```sh [sudo]
sudo emerge --ask net-proxy/dae::gentoo-zh
```

```sh [root]
emerge --ask net-proxy/dae::gentoo-zh
```

:::

Review Portage's kernel configuration checks. The example configuration is at `/usr/share/dae/config.dae.example`. Before starting the service, configure `/etc/dae/config.dae` using the [minimal configuration guide](/dae/start/minimal-configuration).

### Optional: mirrors and binary packages

::: details Mirrors and binary packages
Follow the [gentoo-zh overlay guide](https://gentoozh.org/overlay/) for Distfiles mirrors, binhost channels and signature verification. Check the [binary package list](https://distfiles.gentoozh.org/packages) for availability; Portage can build from source when no suitable binary package exists.
:::

After completing [Minimal configuration](/dae/start/minimal-configuration), see [Service management](/dae/start/service-management) to start, enable, reload or restart dae.

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
