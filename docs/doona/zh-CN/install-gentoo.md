---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 在 Gentoo 上安装 {#title-在-gentoo-上安装}

将仓库中的 ebuild 加入本地 Portage 仓库，安装 doona v0.1.0-rc.4。doona lite 请使用[手动安装](install-manual.md)。

在网关上打开终端，进入新建的下载目录，并在同一 shell 中完成各步。使用 root shell 时省略 `sudo`。安装后端前先检查 [honk 的前提条件](install.md#install)。

缺少 `net-misc/curl` 或 `app-misc/ca-certificates` 时，先安装。下列命令使用 sudo 写入系统目录。

```sh
sudo emerge --ask net-misc/curl app-misc/ca-certificates
```

## 1. 准备本地仓库 {#1-准备本地仓库}

已有本地仓库时，将 `REPO` 设为其绝对路径，并跳过创建命令。否则，创建名为 `doona-local` 的新仓库：

```sh
REPO=/var/db/repos/doona-local
sudo mkdir -p "$REPO/metadata" "$REPO/profiles" /etc/portage/repos.conf
printf '%s
' doona-local | sudo tee "$REPO/profiles/repo_name"
printf 'masters = gentoo
auto-sync = false
' | sudo tee "$REPO/metadata/layout.conf"
printf '[doona-local]
location = %s
' "$REPO" | sudo tee /etc/portage/repos.conf/doona-local.conf
portageq get_repos /
```

确认最后一条命令的输出包含该仓库名称。

## 2. 添加 ebuild {#2-添加-ebuild}

```sh
VERSION=0.1.0-rc.4
PV=0.1.0_rc4
RAW=https://raw.githubusercontent.com/Zakkaus/doona/v${VERSION}/install/gentoo/net-proxy/doona
sudo mkdir -p "$REPO/net-proxy/doona"
sudo curl -fL -o "$REPO/net-proxy/doona/doona-$PV.ebuild" "$RAW/doona-$PV.ebuild"
sudo curl -fL -o "$REPO/net-proxy/doona/metadata.xml" "$RAW/metadata.xml"
```

## 3. 校验发布压缩包 {#3-校验发布压缩包}

ebuild 使用程序压缩包，并默认启用 `fonts` USE 标志。在下载目录中下载并校验两个压缩包：

```sh
BASE=https://github.com/Zakkaus/doona/releases/download/v$VERSION
curl -fL -O "$BASE/doona-${VERSION}.tar.gz" -O "$BASE/doona-fonts-${VERSION}.tar.gz" -O "$BASE/SHA256SUMS"
awk -v file="doona-${VERSION}.tar.gz" '$2 == file' SHA256SUMS | sha256sum -c -
awk -v file="doona-fonts-${VERSION}.tar.gz" '$2 == file' SHA256SUMS | sha256sum -c -
```

所有选定文件都显示 `OK` 后才能继续。如果校验失败或找不到校验和条目，先核对文件名并重新下载，再安装。

下载或执行文件出错时，见[安装故障](install.md#安装故障)。

将已校验的文件按 ebuild 使用的名称放入 Portage distfiles 目录，再生成 Manifest：

```sh
DISTDIR=$(portageq distdir)
sudo install -m 0644 "$PWD/doona-${VERSION}.tar.gz" "$DISTDIR/doona-$PV.tar.gz"
sudo install -m 0644 "$PWD/doona-fonts-${VERSION}.tar.gz" "$DISTDIR/doona-$PV-fonts.tar.gz"
sudo ebuild "$REPO/net-proxy/doona/doona-$PV.ebuild" manifest
```

## 4. 接受测试关键字并安装 {#4-接受测试关键字并安装}

将 `=net-proxy/doona-0.1.0_rc4 ~amd64` 添加到 `package.accept_keywords` 配置中，将 `~amd64` 替换为当前架构的测试关键字，例如 `~arm64`。如果该配置是目录，则写入其中的文件。

不需要字体时，在安装前将 `net-proxy/doona -fonts` 添加到 `package.use`。

```sh
sudo emerge --ask =net-proxy/doona-0.1.0_rc4
ls -l /usr/share/doona/index.html
```

确认最后一条命令列出 `index.html`。在[独立界面配置](install.md)中使用该目录。

### Portage 故障 {#portage-故障}

| 错误 | 检查方法 |
| --- | --- |
| Portage 找不到 `net-proxy/doona` | 执行 `portageq get_repos /`，确认输出列出本地仓库。确认 ebuild 位于该仓库的 `net-proxy/doona/` 目录；仓库未注册时按第 1 步修正。 |
| 软件包被 testing keyword 屏蔽 | 检查第 4 步的 `package.accept_keywords` 条目是否使用当前架构的关键字，例如 `~amd64` 或 `~arm64`。 |

## 5. 安装后端 {#5-安装后端}

按[安装 honk](install.md#install)安装后端后返回本页。已有兼容的 honk 时无需重复安装。

systemd 主机使用[服务管理](service-management.md)中的 systemd 步骤。OpenRC 主机可使用该页的前台命令完成首次连接。

应用[独立界面配置](install.md)，[启动 honk](service-management.md)，再按[首次登录](first-sign-in.md)操作。

</div>

---

来源：[doona-docs](https://github.com/Zakkaus/doona-docs)，采用 [CC BY 4.0 许可证](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
