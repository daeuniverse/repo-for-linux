# Gentoo / Calculate <Badge type="info" text="社区维护" />

Gentoo 用户可通过 [gentoo-zh overlay](https://github.com/gentoo-zh/overlay/tree/master/net-proxy/daed) 安装 `net-proxy/daed`。该软件包由 Gentoo 社区维护，使用 Portage 管理。本网站的 APT/RPM 版本表对应另一个软件源。

::: info 适用架构
测试关键字示例适用于 amd64 系统。
:::

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。

## 1. 添加并同步 overlay

<!--@include: @/.vitepress/snippets/repositories/zh-CN/gentoo-1.md-->

## 2. 接受测试关键字

使用稳定关键字的 amd64 系统需要在 `package.accept_keywords` 中添加以下配置。如果 `/etc/portage/package.accept_keywords` 是目录，可写入其中的 `daed` 文件。如果它是文件，则直接在该文件中添加。

```text
net-proxy/daed::gentoo-zh ~amd64
```

已全局接受 `~amd64` 的系统可跳过此步骤。其他架构需先检查所选 ebuild 的 `KEYWORDS`，再选择对应的关键字。

## 3. 安装 daed

::: code-group

```sh [sudo]
sudo emerge --ask net-proxy/daed::gentoo-zh
```

```sh [root]
emerge --ask net-proxy/daed::gentoo-zh
```

:::

检查 Portage 给出的内核配置提示。`webui` USE 标志默认启用；本页介绍的 daed 程序与服务要求保留该标志。禁用后安装的是 dae-wing。

配置方法见[上游说明](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md)。

### 可选：镜像与二进制包

::: details 镜像与二进制包
Distfiles 镜像、binhost 频道和签名验证的配置方法见 [gentoo-zh overlay 文档](https://gentoozh.org/overlay/)。可用的二进制包以[二进制包列表](https://distfiles.gentoozh.org/packages)为准。没有合适的二进制包时，Portage 可以从源代码编译。
:::

ebuild 提供 systemd 与 OpenRC 服务文件。使用 OpenRC 时，请先按照安装后的提示设置 `rc.conf` 与 `sysfs`，并重新启动系统。随后参阅[服务管理](/zh-CN/daed/service-management)。

---

[gentoo-zh: daed ebuild](https://github.com/gentoo-zh/overlay/blob/master/net-proxy/daed/daed-1.27.0-r1.ebuild) · [OpenRC](https://github.com/gentoo-zh/overlay/blob/master/net-proxy/daed/files/daed.initd)
