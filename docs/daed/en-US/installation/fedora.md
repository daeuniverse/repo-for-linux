# Fedora / RHEL

Install daed from the Dae Universe repository on Fedora or RHEL.

Use the sudo tab if sudo is configured for your account. Use the root tab when already in a root shell.

## 1. Add the repository

<!--@include: @/.vitepress/snippets/repositories/en-US/fedora-1.md-->

## 2. Install daed

::: code-group

```sh [sudo]
sudo dnf install daed
```

```sh [root]
dnf install daed
```

:::



The package provides `daed.service`; its configuration directory is `/etc/daed/`.

[Upstream setup guide](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md) · [Service management](/daed/service-management)
