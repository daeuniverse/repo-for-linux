---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 在 Debian 或 Ubuntu 上安装 {#title-在-debian-或-ubuntu-上安装}

使用系统包管理器安装 doona v0.1.0-rc.4 标准版。doona lite 请按[压缩包安装说明](install-manual.md)操作。

在网关上打开终端，进入新建的下载目录，并在同一 shell 中完成各步。使用 root shell 时省略 `sudo`。安装后端前先检查 [honk 的前提条件](install.md#install)。

## 1. 准备下载工具 {#1-准备下载工具}

::: code-group

```sh [sudo]
sudo apt update
sudo apt install curl ca-certificates
```

```sh [root]
apt update
apt install curl ca-certificates
```

:::

## 2. 下载并校验软件包 {#2-下载并校验软件包}

从 [v0.1.0-rc.4 发布页](https://github.com/Zakkaus/doona/releases/tag/v0.1.0-rc.4)下载：

```sh
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.4
FILE=doona-web_0.1.0-rc.4-1_all.deb
curl -fL -O "$BASE/$FILE" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
```

所有选定文件都显示 `OK` 后才能继续。如果校验失败或找不到校验和条目，先核对文件名并重新下载，再安装。

下载或执行文件出错时，见[安装故障](install.md#安装故障)。

## 3. 安装网页文件 {#3-安装网页文件}

```sh
sudo apt install "./$FILE"
ls -l /usr/share/doona-web/index.html
```

确认最后一条命令列出 `index.html`。在[独立界面配置](install.md)中使用该目录。

Debian 软件包名为 `doona-web`。不要改用 `apt install doona`，Debian 和 Ubuntu 中的这个名称属于另一个软件包。

### 恢复被 Debian 同名软件包替换的 UI {#恢复被-debian-同名软件包替换的-ui}

如果 `apt upgrade` 将旧 `doona` 网页软件包替换成无关的网络模糊测试工具，导致 UI 消失：

1. 按上文安装已校验的 `doona-web`，需要字体时再按下文安装 `doona-web-fonts`。新软件包声明替换或冲突的旧网页软件包版本范围为低于 1.0。
2. 将现有 [`ui` 配置项](configuration.md#config)改为 `/usr/share/doona-web`，再[重启 honk](service-management.md)并重新加载浏览器页面。
3. 如果仍安装了无关的 `doona`，执行 `sudo apt remove doona`。这会保留 `doona-web`。

### 可选软件包 {#可选软件包}

字体与预压缩文件的用途见[可选资源](install.md#doona)。在下列命令中将 `FILE` 设为表中对应的文件名；示例使用字体包。

| 资源 | 文件名 |
| --- | --- |
| 字体 | `doona-web-fonts_0.1.0-rc.4-1_all.deb` |
| 预压缩文件 | `doona-web-precompressed_0.1.0-rc.4-1_all.deb` |

```sh
FILE=doona-web-fonts_0.1.0-rc.4-1_all.deb
curl -fL -O "$BASE/$FILE"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c - &&
  sudo apt install "./$FILE"
```

## 4. 安装后端 {#4-安装后端}

按[安装 honk](install.md#install)安装后端后返回本页。已有兼容的 honk 时无需重复安装。

应用[独立界面配置](install.md)，[启动 honk](service-management.md)，再按[首次登录](first-sign-in.md)操作。

</div>

---

来源：[doona-docs](https://github.com/Zakkaus/doona-docs)，采用 [CC BY 4.0 许可证](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
