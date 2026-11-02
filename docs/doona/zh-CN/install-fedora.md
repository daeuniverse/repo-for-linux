---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 在 Fedora 或 RHEL 上安装 {#title-在-fedora-或-rhel-上安装}

通过 DNF 从 Dae Universe 软件源安装 doona 标准版。doona lite 请按[压缩包安装说明](install-manual.md)操作。

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。安装后端前先检查 [honk 的前提条件](install.md#install)。

## 1. 添加软件源 {#1-添加软件源}

<!--@include: @/.vitepress/snippets/repositories/zh-CN/fedora-1.md-->

## 2. 安装网页文件 {#2-安装网页文件}

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

确认最后一条命令列出 `index.html`。在[独立界面配置](install.md)中使用该目录。

### 可选软件包 {#可选软件包}

字体与预压缩文件的用途见[可选资源](install.md#doona)。

| 资源 | 软件包 |
| --- | --- |
| 字体 | `doona-fonts` |
| 预压缩文件 | `doona-precompressed` |

安装所选软件包；示例使用字体包。

::: code-group

```sh [sudo]
sudo dnf install doona-fonts
```

```sh [root]
dnf install doona-fonts
```

:::

## 3. 安装后端 {#3-安装后端}

按[安装 honk](install.md#install)安装后端后返回本页。已有兼容的 honk 时无需重复安装。

应用[独立界面配置](install.md)，[启动 honk](service-management.md)，再按[首次登录](first-sign-in.md)操作。

</div>
