# Debian / Ubuntu

Configure the repository once for all packages. If it is already configured, skip to package selection. Use the sudo tab if sudo is configured for your account; use the root tab in a root shell.

## 1. Install `curl`

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-1.md-->

## 2. Add the repository

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-2.md-->

## 3. Import the GPG key

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-3.md-->

## 4. Select software

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
sudo apt update
sudo apt install PACKAGE
```

```sh [root]
apt update
apt install PACKAGE
```

:::
