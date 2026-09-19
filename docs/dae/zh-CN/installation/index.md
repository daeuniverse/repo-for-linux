# 安装指南

按系统选择安装入口。安装前请检查[内核要求](/zh-CN/dae/start/requirements)；仅安装软件包并不等于完成代理配置。

## Dae Universe APT／RPM 软件源

| 系统 | 包管理器 | 安装入口 |
| --- | --- | --- |
| Debian | APT | [安装 dae](/zh-CN/dae/installation/debian) |
| Ubuntu | APT | [安装 dae](/zh-CN/dae/installation/debian) |
| Fedora | DNF | [安装 dae](/zh-CN/dae/installation/fedora) |
| RHEL | DNF | [安装 dae](/zh-CN/dae/installation/fedora) |
| openSUSE | Zypper | [安装 dae](/zh-CN/dae/installation/opensuse) |

## 发行版与社区安装方式

| 系统 | 安装来源 | 安装入口 |
| --- | --- | --- |
| Arch Linux | 官方仓库、AUR、archlinuxcn | [安装说明](/zh-CN/dae/installation/arch) |
| Manjaro | AUR / archlinuxcn | [安装说明](/zh-CN/dae/installation/arch) |
| Gentoo | gentoo-zh overlay | [安装说明](/zh-CN/dae/installation/gentoo) |
| Calculate | gentoo-zh overlay | [安装说明](/zh-CN/dae/installation/gentoo) |
| NixOS | daeuniverse/flake.nix | [安装说明](/zh-CN/dae/installation/nix) |

Fedora 另有 [Copr](/zh-CN/dae/installation/fedora) 安装方式。

## 容器与手动安装

- [Docker](/zh-CN/dae/installation/docker)
- [手动安装](/zh-CN/dae/installation/manual-installation)
- [OPNsense](/zh-CN/dae/tutorials/dae-with-opnsense)
- [CentOS 7](/zh-CN/dae/tutorials/run-on-centos7)

CentOS 7 与 macOS 教程包含历史依赖，请先阅读对应页面的说明，再使用其中的命令。

<!-- installation-5:start -->
## Alpine

参见[在 Alpine 上运行](/zh-CN/dae/tutorials/run-on-alpine)。
<!-- installation-5:end -->

<!-- installation-6:start -->
## macOS

可通过变通方案在 macOS 上运行 dae，参见[在 macOS 上运行](/zh-CN/dae/tutorials/run-on-macos)。
<!-- installation-6:end -->

## 安装之后

[最小配置](/zh-CN/dae/start/minimal-configuration) → [服务管理](/zh-CN/dae/start/service-management) → [故障排查](/zh-CN/dae/troubleshooting)

## 其他可用软件包

本站以 dae 文档为主。软件源还提供 daed、v2rayA 等软件包，完整列表如下。

版本号来自软件源构建结果；单独构建文档时，从 [status 分支](https://github.com/daeuniverse/repo-for-linux/tree/status)补充版本数据。

| 软件 | 版本 | 项目 | 许可证 |
| --- | --- | --- | --- |
<!--@include: @/.vitepress/generated/package-rows.md-->

### 安装软件

<!--@include: @/.vitepress/snippets/packages/zh-CN/install.md-->

daed 的安装步骤见 [daed](/zh-CN/daed/)；软件源软件包的说明见[其他可用软件包](/zh-CN/guide/packages)。


---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
