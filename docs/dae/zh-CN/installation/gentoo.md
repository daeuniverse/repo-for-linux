# Gentoo / Calculate <Badge type="info" text="社区维护" />

Gentoo 用户可通过 [gentoo-zh overlay](https://github.com/gentoo-zh/overlay/tree/master/net-proxy/dae) 安装 `net-proxy/dae`。该软件包由 Gentoo 社区维护，使用 Portage 管理。本网站的 APT/RPM 版本表对应另一个软件源。

::: info 适用架构
测试关键字示例适用于 amd64 系统。
:::

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。

## 1. 添加并同步 overlay

<!--@include: @/.vitepress/snippets/repositories/zh-CN/gentoo-1.md-->

## 2. 接受测试关键字

使用稳定关键字的 amd64 系统需要在 `package.accept_keywords` 中添加以下配置。如果 `/etc/portage/package.accept_keywords` 是目录，可写入其中的 `dae` 文件。如果它是文件，则直接在该文件中添加。

```text
net-proxy/dae::gentoo-zh ~amd64
```

已全局接受 `~amd64` 的系统可跳过此步骤。其他架构需先检查所选 ebuild 的 `KEYWORDS`，再选择对应的关键字。

## 3. 安装 dae

::: code-group

```sh [sudo]
sudo emerge --ask net-proxy/dae::gentoo-zh
```

```sh [root]
emerge --ask net-proxy/dae::gentoo-zh
```

:::

检查 Portage 给出的内核配置提示。配置示例位于 `/usr/share/dae/config.dae.example`。启动前，请参考[最小配置](/zh-CN/dae/start/minimal-configuration)，完成 `/etc/dae/config.dae` 的配置。

### 可选：镜像与二进制包

::: details 镜像与二进制包
Distfiles 镜像、binhost 频道和签名验证的配置方法见 [gentoo-zh overlay 文档](https://gentoozh.org/overlay/)。可用的二进制包以[二进制包列表](https://distfiles.gentoozh.org/packages)为准。没有合适的二进制包时，Portage 可以从源代码编译。
:::

完成[最小配置](/zh-CN/dae/start/minimal-configuration)后，请参阅[服务管理](/zh-CN/dae/start/service-management)，启动 dae、设置开机启动、重载或重新启动服务。

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
