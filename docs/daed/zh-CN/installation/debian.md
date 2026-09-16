# Debian / Ubuntu

从 Dae Universe 软件源安装 daed。适用于 Debian、Ubuntu 及其他使用 APT 的发行版。

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。

## 1. 安装 `curl`

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-1.md-->

## 2. 添加软件源

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-2.md-->

## 3. 导入 GPG 公钥

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-3.md-->

## 4. 安装 daed

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

软件包提供 `daed.service`，配置目录为 `/etc/daed/`。

[上游配置说明](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md) · [服务管理](/zh-CN/daed/service-management)
