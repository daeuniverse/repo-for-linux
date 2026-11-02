---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 通过压缩包或在 Alpine 上安装 {#title-通过压缩包或在-alpine-上安装}

系统没有对应软件包时，可通过压缩包安装 doona v0.1.0-rc.4。Alpine 用户也可选择[已签名的软件包](#install-alpine)。

在网关上打开终端，进入新建的下载目录，并在同一 shell 中完成各步。使用 root shell 时省略 `sudo`。安装后端前先检查 [honk 的前提条件](install.md#install)。

准备好 `curl`、CA 证书、`tar` 和 `sha256sum`。Alpine 用户以 root 执行 `apk add curl ca-certificates`。

## 1. 选择版本 {#1-选择版本}

选择一个标签页。版本差异见[版本比较](editions.md)。

::: code-group

```sh [标准版]
FILE=doona-0.1.0-rc.4.tar.gz
UI_DIR=/usr/share/doona
```

```sh [Lite]
FILE=doona-lite-0.1.0-rc.4.tar.gz
UI_DIR=/usr/share/doona-lite
```

:::

## 2. 下载并校验 {#2-下载并校验}

```sh
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.4
curl -fL -O "$BASE/$FILE" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
```

所有选定文件都显示 `OK` 后才能继续。如果校验失败或找不到校验和条目，先核对文件名并重新下载，再安装。

下载或执行文件出错时，见[安装故障](install.md#安装故障)。

## 3. 解压网页文件 {#3-解压网页文件}

```sh
sudo mkdir -p "$UI_DIR"
sudo tar -xzf "$FILE" -C "$UI_DIR"
ls -l "$UI_DIR/index.html"
```

确认目录中存在 `index.html`，再在[独立界面配置](install.md)中使用该目录。

### 标准版可选资源 {#标准版可选资源}

标准版的[可选资源](install.md#doona)如下。将 `FILE` 设为所选文件名，为每个所需压缩包各执行一次下列命令。lite 使用独立目录。

| 资源 | 文件名 |
| --- | --- |
| 字体 | `doona-fonts-0.1.0-rc.4.tar.gz` |
| 预压缩文件 | `doona-precompressed-0.1.0-rc.4.tar.gz` |

```sh
FILE=doona-fonts-0.1.0-rc.4.tar.gz
curl -fL -O "$BASE/$FILE"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c - &&
  sudo tar -xzf "$FILE" -C /usr/share/doona
```

通过压缩包安装后，跳过 Alpine 部分，继续安装后端。


## Alpine 软件包安装方式 {#install-alpine}

此方式安装标准版。准备好前述工具后，在新的下载目录中操作。选择名称以 `.alpine.apk` 结尾的 Alpine 资源；OpenWrt 的 apk 文件格式不同。

```sh
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.4
FILE=doona-0.1.0-rc.4-r0.alpine.apk
curl -fL -O "$BASE/$FILE" -O "$BASE/doona-alpine.rsa.pub" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-alpine.rsa.pub"' SHA256SUMS | sha256sum -c -
```

两项校验都显示 `OK` 后，以 root 安装已校验的密钥和软件包。保留密钥文件名；每次发布使用各自的密钥。

```sh
mkdir -p /etc/apk/keys
cp "$PWD/doona-alpine.rsa.pub" /etc/apk/keys/doona-alpine.rsa.pub
apk add "./$FILE"
ls -l /usr/share/doona/index.html
```

确认最后一条命令列出 `index.html`。可选软件包为 `doona-fonts-0.1.0-rc.4-r0.alpine.apk` 和 `doona-precompressed-0.1.0-rc.4-r0.alpine.apk`。安装时修改 `FILE`，按前述方式下载并校验，再以 root 执行 `apk add "./$FILE"`。

不添加发布公钥而直接安装时，先按上文校验下载的软件包，再以 root 执行：

```sh
apk add --allow-untrusted "./$FILE"
```

此方式跳过签名信任检查，因此必须保留 SHA-256 校验步骤。

安装可选软件包时，沿用主包所选的公钥验证或直接安装方式。

## 安装后端 {#安装后端}

按[安装 honk](install.md#install)安装后端后返回本页。已有兼容的 honk 时无需重复安装。

OpenRC 系统可使用[服务管理](service-management.md)中的前台命令完成首次连接；该页不配置 OpenRC 服务。

应用[独立界面配置](install.md)，[启动 honk](service-management.md)，再按[首次登录](first-sign-in.md)操作。

</div>
