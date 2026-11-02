---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Install on Fedora or RHEL {#title-install-on-fedora-or-rhel}

Install the standard edition of doona with DNF from the Dae Universe package repository. For doona lite, use the [archive instructions](install-manual.md).

Use the sudo tab if sudo is configured for your account; use the root tab in a root shell. Check the [honk prerequisites](install.md#install) before installing the backend.

## 1. Add the repository {#1-add-the-repository}

<!--@include: @/.vitepress/snippets/repositories/en-US/fedora-1.md-->

## 2. Install the web files {#2-install-the-web-files}

::: code-group

```sh [sudo]
sudo dnf install doona
ls -l /usr/share/doona/index.html
```

```sh [root]
dnf install doona
ls -l /usr/share/doona/index.html
```

:::

The last command must list `index.html`. Use that directory in the [separate UI configuration](install.md).

### Optional packages {#optional-packages}

See [optional assets](install.md#doona) to choose fonts or precompressed files.

| Asset | Package |
| --- | --- |
| Fonts | `doona-fonts` |
| Precompressed files | `doona-precompressed` |

Install the chosen package. The example selects fonts.

::: code-group

```sh [sudo]
sudo dnf install doona-fonts
```

```sh [root]
dnf install doona-fonts
```

:::

## 3. Install the backend {#3-install-the-backend}

If you already have a compatible honk, keep it. Otherwise, follow [Install honk](install.md#install), then return here.

Apply the [separate UI configuration](install.md), [start honk](service-management.md), then follow [First sign-in](first-sign-in.md).

</div>
