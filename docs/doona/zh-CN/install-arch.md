---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 在 Arch Linux 上安装 {#title-在-arch-linux-上安装}

使用系统包管理器安装 doona v0.1.0-rc.4 标准版。doona lite 请按[压缩包安装说明](install-manual.md)操作。

在网关上打开终端，进入新建的下载目录，并在同一 shell 中完成各步。使用 root shell 时省略 `sudo`。安装后端前先检查 [honk 的前提条件](install.md#install)。

## 1. 准备下载工具 {#1-准备下载工具}

::: code-group

```sh [sudo]
sudo pacman -Syu --needed curl ca-certificates
```

```sh [root]
pacman -Syu --needed curl ca-certificates
```

:::

## 2. 下载并校验软件包 {#2-下载并校验软件包}

从 [v0.1.0-rc.4 发布页](https://github.com/Zakkaus/doona/releases/tag/v0.1.0-rc.4)下载：

```sh
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.4
FILE=doona-0.1.0rc4-1-any.pkg.tar.zst
curl -fL -O "$BASE/$FILE" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
```

所有选定文件都显示 `OK` 后才能继续。如果校验失败或找不到校验和条目，先核对文件名并重新下载，再安装。

下载或执行文件出错时，见[安装故障](install.md#安装故障)。

## 3. 安装网页文件 {#3-安装网页文件}

```sh
sudo pacman -U "./$FILE"
ls -l /usr/share/doona/index.html
```

确认最后一条命令列出 `index.html`。在[独立界面配置](install.md)中使用该目录。

### 可选软件包 {#可选软件包}

字体与预压缩文件的用途见[可选资源](install.md#doona)。在下列命令中将 `FILE` 设为表中对应的文件名；示例使用字体包。

| 资源 | 文件名 |
| --- | --- |
| 字体 | `doona-fonts-0.1.0rc4-1-any.pkg.tar.zst` |
| 预压缩文件 | `doona-precompressed-0.1.0rc4-1-any.pkg.tar.zst` |

```sh
FILE=doona-fonts-0.1.0rc4-1-any.pkg.tar.zst
curl -fL -O "$BASE/$FILE"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c - &&
  sudo pacman -U "./$FILE"
```

## 4. 安装后端 {#4-安装后端}

按[安装 honk](install.md#install)安装后端后返回本页。已有兼容的 honk 时无需重复安装。

应用[独立界面配置](install.md)，[启动 honk](service-management.md)，再按[首次登录](first-sign-in.md)操作。

</div>
