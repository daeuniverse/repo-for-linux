# Fedora / RHEL

Configure the repository once for all packages. If it is already configured, skip to package selection. Use the sudo tab if sudo is configured for your account; use the root tab in a root shell.

## 1. Add the repository

<!--@include: @/.vitepress/snippets/repositories/en-US/fedora-1.md-->

## 2. Select software

| Software | Package name |
| --- | --- |
| dae | `dae` |
| [daed](/daed/) (archived; do not use it for new installations) | `daed` |
| v2rayA | `v2raya` |
| v2ray | `v2ray` |
| Xray | `xray` |
| Juicity | `juicity` |
| Juicity-rs | `juicity-rs` |
| v2ray-rules-dat | `v2ray-rules-dat` |

Replace `PACKAGE` with a name from the table.

::: code-group

```sh [sudo]
sudo dnf install PACKAGE
```

```sh [root]
dnf install PACKAGE
```

:::
