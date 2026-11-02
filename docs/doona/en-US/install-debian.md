---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Install on Debian or Ubuntu {#title-install-on-debian-or-ubuntu}

Install the standard edition of doona with APT from the Dae Universe package repository. For doona lite, use the [archive instructions](install-manual.md).

Use the sudo tab if sudo is configured for your account; use the root tab in a root shell. Check the [honk prerequisites](install.md#install) before installing the backend.

## 1. Install curl {#1-install-curl}

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-1.md-->

## 2. Add the repository {#2-add-the-repository}

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-2.md-->

## 3. Import the GPG key {#3-import-the-gpg-key}

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-3.md-->

## 4. Install the web files {#4-install-the-web-files}

::: code-group

```sh [sudo]
sudo apt update
sudo apt install doona-web
ls -l /usr/share/doona-web/index.html
```

```sh [root]
apt update
apt install doona-web
ls -l /usr/share/doona-web/index.html
```

:::

The last command must list `index.html`. Use that directory in the [separate UI configuration](install.md).

Use the Debian package `doona-web`. Do not substitute `apt install doona`: that name belongs to a different package in Debian and Ubuntu.

### Recover a UI replaced by Debian’s doona package {#recover-a-ui-replaced-by-debians-doona-package}

If `apt upgrade` replaced an older `doona` web package with the unrelated network fuzzer and the UI disappeared:

1. Install `doona-web` using the steps above, and `doona-web-fonts` below if needed. These packages replace or conflict with the old web packages below version 1.0.
2. Change the existing [`ui` setting](configuration.md#config) to `/usr/share/doona-web`, then [restart honk](service-management.md) and reload the browser page.
3. If the unrelated `doona` remains installed, run `sudo apt remove doona`. This leaves `doona-web` installed.

### Optional packages {#optional-packages}

See [optional assets](install.md#doona) to choose fonts or precompressed files.

| Asset | Package |
| --- | --- |
| Fonts | `doona-web-fonts` |
| Precompressed files | `doona-web-precompressed` |

Install the chosen package. The example selects fonts.

::: code-group

```sh [sudo]
sudo apt install doona-web-fonts
```

```sh [root]
apt install doona-web-fonts
```

:::

## 5. Install the backend {#5-install-the-backend}

If you already have a compatible honk, keep it. Otherwise, follow [Install honk](install.md#install), then return here.

Apply the [separate UI configuration](install.md), [start honk](service-management.md), then follow [First sign-in](first-sign-in.md).

</div>
