# openSUSE

在 openSUSE 上，从 Dae Universe 软件源安装 daed。

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。

## 1. 添加软件源

<!--@include: @/.vitepress/snippets/repositories/zh-CN/opensuse-1.md-->

## 2. 安装 daed

::: code-group

```sh [sudo]
sudo zypper install daed
```

```sh [root]
zypper install daed
```

:::

软件包提供 `daed.service`，配置目录为 `/etc/daed/`。

[上游配置说明](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md) · [服务管理](/zh-CN/daed/service-management)
