---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 在 Debian 或 Ubuntu 上安装 {#title-在-debian-或-ubuntu-上安装}

通过 APT 从 Dae Universe 软件源安装 doona 标准版。doona lite 请按[压缩包安装说明](install-manual.md)操作。

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。安装后端前先检查 [honk 的前提条件](install.md#install)。

## 1. 安装 curl {#1-安装-curl}

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-1.md-->

## 2. 添加软件源 {#2-添加软件源}

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-2.md-->

## 3. 导入 GPG 公钥 {#3-导入-gpg-公钥}

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-3.md-->

## 4. 安装网页文件 {#4-安装网页文件}

::: code-group

```sh [sudo]
sudo apt update
sudo apt install doona-web
ls -l /usr/share/doona-web/index.html
```

```sh [root]
apt update
apt install doona-web
ls -l /usr/share/doona-web/index.html
```

:::

确认最后一条命令列出 `index.html`。在[独立界面配置](install.md)中使用该目录。

Debian 软件包名为 `doona-web`。不要改用 `apt install doona`，Debian 和 Ubuntu 中的这个名称属于另一个软件包。

### 恢复被 Debian 同名软件包替换的 UI {#恢复被-debian-同名软件包替换的-ui}

如果 `apt upgrade` 将旧 `doona` 网页软件包替换成无关的网络模糊测试工具，导致 UI 消失：

1. 按上文安装 `doona-web`，需要字体时再按下文安装 `doona-web-fonts`。新软件包声明替换或冲突的旧网页软件包版本范围为低于 1.0。
2. 将现有 [`ui` 配置项](configuration.md#config)改为 `/usr/share/doona-web`，再[重启 honk](service-management.md)并重新加载浏览器页面。
3. 如果仍安装了无关的 `doona`，执行 `sudo apt remove doona`。这会保留 `doona-web`。

### 可选软件包 {#可选软件包}

字体与预压缩文件的用途见[可选资源](install.md#doona)。

| 资源 | 软件包 |
| --- | --- |
| 字体 | `doona-web-fonts` |
| 预压缩文件 | `doona-web-precompressed` |

安装所选软件包；示例使用字体包。

::: code-group

```sh [sudo]
sudo apt install doona-web-fonts
```

```sh [root]
apt install doona-web-fonts
```

:::

## 5. 安装后端 {#5-安装后端}

按[安装 honk](install.md#install)安装后端后返回本页。已有兼容的 honk 时无需重复安装。

应用[独立界面配置](install.md)，[启动 honk](service-management.md)，再按[首次登录](first-sign-in.md)操作。

</div>
