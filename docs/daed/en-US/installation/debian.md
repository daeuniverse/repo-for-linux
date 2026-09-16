# Debian / Ubuntu

Install daed from the Dae Universe repository on Debian, Ubuntu and other APT-based distributions.

Use the sudo tab if sudo is configured for your account. Use the root tab when already in a root shell.

## 1. Install `curl`

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-1.md-->

## 2. Add the repository

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-2.md-->

## 3. Import the GPG key

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-3.md-->

## 4. Install daed

::: code-group

```sh [sudo]
sudo apt update
sudo apt install daed
```

```sh [root]
apt update
apt install daed
```

:::

The package provides `daed.service`; its configuration directory is `/etc/daed/`.

[Upstream setup guide](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md) · [Service management](/daed/service-management)
