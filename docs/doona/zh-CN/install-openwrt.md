---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 在 OpenWrt 上安装 {#title-在-openwrt-上安装}

在 OpenWrt 路由器上安装 doona v0.1.0-rc.6 和 honk。所有命令均在路由器的 root shell 中执行，安装期间保持同一 shell。

## 从 daeuniverse 软件源快速安装 {#从-daeuniverse-软件源快速安装}

支持的 64 位 OpenWrt 或 ImmortalWrt 25.12 路由器可从 [daeuniverse 软件源](/zh-CN/openwrt/)安装 honk；软件源的软件包和服务见 honk 的 [OpenWrt 安装](/zh-CN/honk/how-to-start#openwrt)。再按[快速入门](quick-start.md)配置内嵌的 doona。下文是从压缩包手动安装的备选方式，适用于软件源不支持的路由器，请择一使用。

## 1. 检查路由器并准备工具 {#1-检查路由器并准备工具}

检查安装文件与下载目录所需的空间：

```sh
df -h / /tmp
```

OpenWrt 25.12 使用 apk-tools 3；OpenWrt 24.10 及更早版本使用 opkg 和 ipk 软件包。按路由器的包管理器安装下载工具：

::: code-group

```sh [apk]
apk update
apk add curl ca-bundle
```

```sh [opkg]
opkg update
opkg install curl ca-bundle
```

:::

内核、BTF、cgroup 和内核模块要求见 honk 的 [Linux 内核要求](/zh-CN/honk/how-to-start#linux-内核要求)和 [OpenWrt 安装](/zh-CN/honk/how-to-start#openwrt)。有对应的 doona 软件包，不代表路由器可以运行 honk。

## 2. 下载并校验 doona {#openwrt-packages}

以下软件包安装标准版。lite 请使用[手动安装](install-manual.md)中的压缩包方式，省略 `sudo`，然后返回第 4 步。

下载到 `/tmp/doona`，按固件使用的格式选择软件包。OpenWrt apk 软件包与 Alpine 软件包不同。

`/tmp` 使用内存，重启后会清空。下载 honk 时，必须预留同时存放压缩包与解压目录的空间。

```sh
mkdir -p /tmp/doona
cd /tmp/doona
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.6
```

::: code-group

```sh [apk]
FILE=doona-0.1.0_rc6-r1.apk
curl -fL -O "$BASE/$FILE" -O "$BASE/doona-openwrt.adb" \
  -O "$BASE/doona-openwrt.pem" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-openwrt.adb"' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-openwrt.pem"' SHA256SUMS | sha256sum -c -
```

```sh [opkg]
FILE=doona_0.1.0-rc.6-1_all.ipk
curl -fL -O "$BASE/$FILE" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
```

:::

所有选定文件都显示 `OK` 后才能继续。如果校验失败或找不到校验和条目，先核对文件名并重新下载，再安装。

下载或执行文件出错时，见[安装故障](install.md#安装故障)。

## 3. 安装软件包 {#3-安装软件包}

使用 apk 时，安装已校验的公钥，并通过已签名的索引安装。索引与软件包文件应放在同一目录。

::: code-group

```sh [apk]
mkdir -p /etc/apk/keys
cp /tmp/doona/doona-openwrt.pem /etc/apk/keys/doona-openwrt.pem
apk add -X /tmp/doona/doona-openwrt.adb doona
```

```sh [opkg]
opkg install "/tmp/doona/$FILE"
```

:::

没有发布公钥和索引时，可以直接安装已校验的本地 apk：

```sh
apk add --allow-untrusted "/tmp/doona/$FILE"
```

此方式跳过签名信任检查，因此使用前必须校验软件包对应的 SHA-256 条目。

```sh
ls -l /usr/share/doona/index.html
```

确认最后一条命令列出 `index.html`。在[独立界面配置](install.md)中使用此目录。

### 可选软件包 {#可选软件包}

按需选择[可选资源](install.md#doona)。将选定文件下载到 `/tmp/doona`，并像第 2 步那样使用 `SHA256SUMS` 中对应的条目校验。

| 软件包 | apk 文件名 | opkg 文件名 |
| --- | --- | --- |
| `doona-fonts` | `doona-fonts-0.1.0_rc6-r1.apk` | `doona-fonts_0.1.0-rc.6-1_all.ipk` |
| `doona-precompressed` | `doona-precompressed-0.1.0_rc6-r1.apk` | `doona-precompressed_0.1.0-rc.6-1_all.ipk` |

使用 apk 时，将安装命令中的 `doona` 改为所选软件包名后执行。使用 opkg 时，将 `FILE` 设为所选文件名，再执行安装命令。

## 4. 安装 honk {#4-安装-honk}

手动方式请按 honk 的 [OpenWrt 安装](/zh-CN/honk/how-to-start#openwrt)将 musl 构建安装到 `/usr/bin/honk-core`，再返回本页。使用软件源时，按其中的 `apk add honk@daeuniverse` 操作。

确认已安装的可执行文件正常后，使用绝对路径删除其下载压缩包和解压目录。选定的可选 UI 软件包全部安装完成后，再使用绝对路径删除 `/tmp/doona` 中下载的软件包、索引、公钥副本与校验和文件。保留仍需用于安装的下载文件。

## 5. 准备数据目录 {#install-geodata}

在 honk 配置中将 `global.data_dir` 设为 `/etc/honk/data`，并按 honk 的 [GeoIP 和 Geosite](/zh-CN/honk/how-to-start#geoip-和-geosite)安装 geodata。仅在规则需要时下载，具体条件见 [geodata 要求](feature-requirements.md#req-geodata)。

## 在 sysupgrade 后保留配置 {#在-sysupgrade-后保留配置}

按 honk 的[使用 OpenWrt procd 运行](/zh-CN/honk/how-to-start#使用-openwrt-procd-运行)将 `/etc/honk/` 和 init 脚本加入 sysupgrade 备份清单。

升级后重复第 1–3 步，重新安装下载工具和 UI 软件包，再按第 4 步重装 honk。保留已恢复的配置与数据，再[启用并启动服务](service-management.md)。

检查 honk 的[读取服务日志](/zh-CN/honk/how-to-start#读取服务日志)，再按[首次登录](first-sign-in.md)操作。

</div>
