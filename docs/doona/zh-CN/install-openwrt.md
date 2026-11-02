---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 在 OpenWrt 上安装 {#title-在-openwrt-上安装}

在 OpenWrt 路由器上安装 doona v0.1.0-rc.4 和 honk。所有命令均在路由器的 root shell 中执行，安装期间保持同一 shell。

## 从 daeuniverse 软件源快速安装 {#从-daeuniverse-软件源快速安装}

支持的 64 位 OpenWrt 或 ImmortalWrt 25.12 路由器可从 [daeuniverse 软件源](/zh-CN/openwrt/)安装 honk，再按[快速入门](quick-start.md)配置内嵌的 doona。下文是从压缩包手动安装的备选方式，适用于软件源不支持的路由器。软件源包与手动安装使用不同的服务名称和数据目录，请择一使用。

## 1. 检查路由器并准备工具 {#1-检查路由器并准备工具}

下载前先检查[后端前提条件](install.md#install)，包括内核、BTF、cgroup 和 CPU 要求。有对应的 doona 软件包，不代表路由器可以运行 honk。检查安装文件与下载目录所需的空间：

```sh
uname -r
uname -m
df -h / /tmp
```

OpenWrt 25.12 使用 apk-tools 3；OpenWrt 24.10 及更早版本使用 opkg 和 ipk 软件包。官方 OpenWrt 24.10 使用 [Linux 6.6](https://github.com/openwrt/openwrt/blob/openwrt-24.10/target/linux/x86/Makefile)，低于上文链接中 honk 的最低内核要求。安装格式匹配的 UI 软件包不能解决这一兼容性问题。

按路由器的包管理器选择命令。OpenWrt 提供 [veth 模块](https://github.com/openwrt/openwrt/blob/openwrt-25.12/package/kernel/linux/modules/netsupport.mk)与 [NFQUEUE 模块](https://github.com/openwrt/openwrt/blob/openwrt-25.12/package/kernel/linux/modules/netfilter.mk)软件包：

::: code-group

```sh [apk]
apk update
apk add curl ca-bundle kmod-veth kmod-nft-queue
```

```sh [opkg]
opkg update
opkg install curl ca-bundle kmod-veth kmod-nft-queue
```

:::

启用 NFQUEUE 但缺少必要条件时，honk 可能继续运行，同时停用 NFQUEUE staging 并输出启动警告。检查[服务日志](service-management.md)；服务启动成功不代表 NFQUEUE staging 已启用。


## 2. 下载并校验 doona {#openwrt-packages}

以下软件包安装标准版。lite 请使用[手动安装](install-manual.md)中的压缩包方式，省略 `sudo`，然后返回第 4 步。

下载到 `/tmp/doona`，按固件使用的格式选择软件包。OpenWrt apk 软件包与 Alpine 软件包不同。

`/tmp` 使用内存，重启后会清空。下载 honk 时，必须预留同时存放压缩包与解压目录的空间。

```sh
mkdir -p /tmp/doona
cd /tmp/doona
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.4
```

::: code-group

```sh [apk]
FILE=doona-0.1.0_rc4-r1.apk
curl -fL -O "$BASE/$FILE" -O "$BASE/doona-openwrt.adb" \
  -O "$BASE/doona-openwrt.pem" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-openwrt.adb"' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-openwrt.pem"' SHA256SUMS | sha256sum -c -
```

```sh [opkg]
FILE=doona_0.1.0-rc.4-1_all.ipk
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
| `doona-fonts` | `doona-fonts-0.1.0_rc4-r1.apk` | `doona-fonts_0.1.0-rc.4-1_all.ipk` |
| `doona-precompressed` | `doona-precompressed-0.1.0_rc4-r1.apk` | `doona-precompressed_0.1.0-rc.4-1_all.ipk` |

使用 apk 时，将安装命令中的 `doona` 改为所选软件包名后执行。使用 opkg 时，将 `FILE` 设为所选文件名，再执行安装命令。

## 4. 安装 honk {#4-安装-honk}

在另一个下载目录中按[安装 honk](install.md#install)操作，避免后端的 `SHA256SUMS` 覆盖 doona 的文件。选择 musl 构建和 OpenWrt 安装标签页，将可执行文件安装到 `/usr/bin/honk-core`，再返回本页。

确认已安装的可执行文件正常后，使用绝对路径删除其下载压缩包和解压目录。选定的可选 UI 软件包全部安装完成后，再使用绝对路径删除 `/tmp/doona` 中下载的软件包、索引、公钥副本与校验和文件。保留仍需用于安装的下载文件。


## 5. 准备数据目录 {#install-geodata}

手动安装时，须在 [honk 配置](configuration.md#config)中将 `global.data_dir` 设为 `/etc/honk/data`，再创建持久化目录：

```sh
mkdir -p /etc/honk/config.d /etc/honk/data
chmod 0700 /etc/honk /etc/honk/config.d /etc/honk/data
```

仅在规则需要时下载 geodata，具体条件见 [geodata 要求](feature-requirements.md#req-geodata)。采用上述目录时执行：

```sh
curl -fL --retry 3 -o /etc/honk/data/geosite.dat \
  https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geosite.dat
curl -fL --retry 3 -o /etc/honk/data/geoip.dat \
  https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geoip.dat
```

也可以安装发行版提供的 [v2ray geodata 软件包](https://github.com/openwrt/packages/blob/openwrt-25.12/net/v2ray-geodata/Makefile)，替代上面的直接下载方式：

::: code-group

```sh [apk]
apk add v2ray-geosite v2ray-geoip
```

```sh [opkg]
opkg install v2ray-geosite v2ray-geoip
```

:::

honk 会搜索 `/usr/share/dae`，不会直接搜索 `/usr/share/v2ray`。先检查 `/usr/share/dae` 中已有的文件或链接，仅创建缺少的链接：

```sh
mkdir -p /usr/share/dae
ln -s ../v2ray/geosite.dat /usr/share/dae/geosite.dat
ln -s ../v2ray/geoip.dat /usr/share/dae/geoip.dat
```

已配置的数据目录中若存在同名文件，honk 会优先使用这些文件。

请使用[服务管理](service-management.md)中的 OpenWrt 服务，而非软件源服务。

## 在 sysupgrade 后保留配置 {#在-sysupgrade-后保留配置}

执行保留配置的普通 sysupgrade 前，将尚未列出的以下路径加入 `/etc/sysupgrade.conf`，再检查[备份清单](https://github.com/openwrt/openwrt/blob/openwrt-25.12/package/base-files/files/sbin/sysupgrade)：

```sh
printf '%s\n' '/etc/honk/' '/etc/init.d/honk-core' >> /etc/sysupgrade.conf
sysupgrade -l
```

确认清单包含 honk 配置、数据文件与 init 脚本。这份配置备份不会恢复已安装的内核模块、`/usr/bin/honk-core` 或 `/usr/share/doona`。

升级后重复第 1–4 步，重新安装工具、内核模块、UI 软件包和 honk 可执行文件。若选用发行版的 geodata 软件包，再按第 5 步重装并重新创建链接。保留已恢复的配置与数据，再[启用并启动服务](service-management.md)。

检查[服务日志](service-management.md)，再按[首次登录](first-sign-in.md)操作。

</div>

---

来源：[doona-docs](https://github.com/Zakkaus/doona-docs)，采用 [CC BY 4.0 许可证](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
