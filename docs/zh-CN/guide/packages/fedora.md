# Fedora / RHEL

所有软件包共用软件源配置。已添加软件源时，请直接跳到第 2 步选择软件。已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。

## 1. 添加软件源

<!--@include: @/.vitepress/snippets/repositories/zh-CN/fedora-1.md-->

## 2. 选择软件

| 软件 | 软件包名称 |
| --- | --- |
| dae | `dae` |
| [daed](/zh-CN/daed/)（已归档，请勿用于新安装） | `daed` |
| v2rayA | `v2raya` |
| v2ray | `v2ray` |
| Xray | `xray` |
| Juicity | `juicity` |
| Juicity-rs | `juicity-rs` |
| v2ray-rules-dat | `v2ray-rules-dat` |

将命令中的 `PACKAGE` 替换为表中的软件包名称。

::: code-group

```sh [sudo]
sudo dnf install PACKAGE
```

```sh [root]
dnf install PACKAGE
```

:::
