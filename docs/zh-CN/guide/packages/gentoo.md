# Gentoo / Calculate <Badge type="info" text="社区维护" />

Dae Universe 软件源不提供 Gentoo 软件包。Gentoo 与 Calculate 用户通过 [gentoo-zh overlay](https://github.com/gentoo-zh/overlay) 安装。

软件包由 Gentoo 社区维护，使用 Portage 管理，版本与[软件包列表](/zh-CN/guide/packages)中的软件源版本相互独立。

::: info 适用架构
测试关键字示例适用于 amd64 系统。
:::

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。

## 1. 添加并同步 overlay

<!--@include: @/.vitepress/snippets/repositories/zh-CN/gentoo-1.md-->

## 2. 接受测试关键字

overlay 中的这些软件包只有测试关键字。安装前，需要在 `package.accept_keywords` 中写入所选软件的条目。

如果 `/etc/portage/package.accept_keywords` 是目录，可写入其中的单独文件。如果它是文件，则直接在该文件中添加。

::: code-group

```text [v2rayA]
net-proxy/v2rayA::gentoo-zh ~amd64
```

```text [v2ray]
net-proxy/v2ray::gentoo-zh ~amd64
```

```text [Xray]
net-proxy/Xray::gentoo-zh ~amd64
```

```text [Juicity]
net-proxy/juicity::gentoo-zh ~amd64
```

```text [v2ray-rules-dat]
dev-libs/v2ray-rules-dat-bin::gentoo-zh ~amd64
```

:::

已全局接受 `~amd64` 的系统可跳过此步骤。其他架构需先检查所选 ebuild 的 `KEYWORDS`，再选择对应的关键字。

## 3. 选择软件

::: code-group

```sh [v2rayA]
sudo emerge --ask net-proxy/v2rayA::gentoo-zh
```

```sh [v2ray]
sudo emerge --ask net-proxy/v2ray::gentoo-zh
```

```sh [Xray]
sudo emerge --ask net-proxy/Xray::gentoo-zh
```

```sh [Juicity]
sudo emerge --ask net-proxy/juicity::gentoo-zh
```

```sh [v2ray-rules-dat]
sudo emerge --ask dev-libs/v2ray-rules-dat-bin::gentoo-zh
```

:::

已进入 root shell 时去掉命令中的 `sudo`。

## 软件包差异

| 软件包 | 说明 |
| --- | --- |
| `net-proxy/juicity` | 默认只构建服务端；需要客户端时启用 `client` USE 标志 |
| `dev-libs/v2ray-rules-dat-bin` | 安装预编译的规则数据文件，`geosite` 与 `geoip` USE 标志默认启用 |
| Juicity-rs | overlay 没有对应的 ebuild |

dae 与 daed 的安装步骤见 [dae](/zh-CN/dae/installation/gentoo) 与 [daed](/zh-CN/daed/installation/gentoo)。

### 可选：镜像与二进制包

::: details 镜像与二进制包
Distfiles 镜像、binhost 频道和签名验证的配置方法见 [gentoo-zh overlay 文档](https://gentoozh.org/overlay/)。可用的二进制包以[二进制包列表](https://distfiles.gentoozh.org/packages)为准；没有合适的二进制包时，Portage 可以从源代码编译。
:::
