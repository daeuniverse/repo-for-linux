---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 单独安装 doona {#title-单独安装-doona}

不使用 honk 内嵌的 doona 时，可单独安装界面文件。内嵌界面的操作见[快速入门](quick-start.md)。

## 选择系统 {#选择系统}

| 系统 | 指南 |
| --- | --- |
| Debian 或 Ubuntu | [使用 APT 安装](install-debian.md) |
| Fedora 或 RHEL | [使用 DNF 安装](install-fedora.md) |
| Arch Linux | [通过 pacman 安装](install-arch.md) |
| Gentoo | [通过 Portage 安装](install-gentoo.md) |
| OpenWrt | [在路由器上手动安装](install-openwrt.md) |
| Alpine 或其他 Linux 发行版 | [安装压缩包或 Alpine 软件包](install-manual.md) |

这些软件包只安装静态网页文件。请另行安装、配置并启动后端。版本选择见[标准版与 lite](editions.md)。

安装界面文件与兼容的 honk 后，将以下块加入 honk 配置，替换原有的 `native_api` 块：

```dae
experimental {
    native_api {
        enabled: true
        listen: '127.0.0.1:9527'
        password_auth: true
        config_write: true
        ui: '/usr/share/doona'
    }
}
```

请使用软件包中包含 `index.html` 的目录；Debian 与 Ubuntu 使用 `/usr/share/doona-web`。手动解压时，请改用解压目录。详见[界面文件](#doona)、[其他 API 选项](configuration.md#config)及[其他来源与反向代理](#other-origin)。


## 安装 honk {#install}

Debian 或 Ubuntu 上执行 `sudo apt install honk`；其他系统和构建版本见 honk 的[安装指南](/zh-CN/honk/installation/)。请选择 `full` 或 `native-api` 构建，`clash-api` 版本无法提供 doona 所需的原生 API。

## 安装故障 {#安装故障}

| 错误 | 处理方法 |
| --- | --- |
| 下载时返回 HTTP 404 | 核对发布标签和完整文件名。从对应发布页复制下载链接，不要自行拼接未经核实的文件名。 |
| BusyBox 拒绝 `--ignore-missing` | BusyBox `sha256sum` 不支持该选项。使用这些安装指南中的逐文件 `awk` 和 `sha256sum -c -` 命令，确认选定文件显示 `OK`。 |

`GLIBC_*` 错误请按 honk 的[安装指南](/zh-CN/honk/installation/)改用 musl 构建。内核功能缺失或启动失败见[运行要求](requirements.md#网关)和 honk 的[常见问题](/zh-CN/honk/how-to-start#常见问题)。


## 按规则需要安装 geodata {#directories-and-geodata}

添加 Geo 规则前，先检查 [geodata 要求](feature-requirements.md#req-geodata)。按 honk 的 [GeoIP 和 Geosite](/zh-CN/honk/how-to-start#geoip-和-geosite)将文件安装到 `global.data_dir` 指定的目录。


## 安装 UI 文件 {#doona}

按本页列出的发行版指南或[手动安装](install-manual.md)操作。将包含 `index.html` 的目录用于 [`ui` 配置项](configuration.md#config)：

| 安装方式 | UI 目录 |
| --- | --- |
| Debian 或 Ubuntu 软件包 | `/usr/share/doona-web` |
| 其他软件包或标准版压缩包安装步骤 | `/usr/share/doona` |
| lite 压缩包安装步骤 | `/usr/share/doona-lite` |

### 可选资源 {#可选资源}

| 资源 | 用途 |
| --- | --- |
| `doona-fonts` | 标准版使用的 Noto Sans TC 和 SC 字体。 |
| `doona-precompressed` | 在标准版文件旁添加 `.br` 和 `.gz` 副本，供支持预压缩资源的服务器使用。版本应与主包一致。 |

Debian 的软件包名称为 `doona-web-fonts` 和 `doona-web-precompressed`。软件包文件名见各发行版页面；压缩包安装步骤见[手动安装](install-manual.md)。

预压缩资源会额外占用磁盘空间，存储空间有限的路由器可不安装。未安装可选字体压缩包时，doona 使用后备字体，不加载可选字体文件。但仍会请求 `fonts/README`，检测是否已安装字体压缩包。

### 本地构建与打包文件 {#本地构建与打包文件}

仓库提供 [OpenWrt、Alpine、Gentoo 和 Nix 打包文件](https://github.com/Zakkaus/doona/blob/main/install/README.md)，尚未提交到这些发行版的仓库。AUR 的 `doona-bin` 打包文件在独立仓库中维护。

需要安装到暂存目录时，先完成[本地构建](development.md)，再从 doona 仓库根目录执行以下命令，将 `/absolute/staging/path` 替换为暂存目录。两个目标都支持 `DESTDIR` 和 `PREFIX`；不需要字体时省略第二条命令。

```sh
make install DESTDIR=/absolute/staging/path PREFIX=/usr
make install-fonts DESTDIR=/absolute/staging/path PREFIX=/usr
```

UI 文件会安装到暂存目录下的 `usr/share/doona`。


## 通过其他地址提供 UI {#other-origin}

监听地址、UI 目录、Host 和 Origin 的配置见[原生 API 设置](configuration.md#config)。使用主机名或反向代理前，检查[登录要求](feature-requirements.md#req-sign-in)。

### 主机名与静态资源 403 错误 {#主机名与静态资源-403-错误}

主机名或其他来源被拒绝时，按 honk 的 [Host 与 Origin 检查](/zh-CN/honk/reference/experimental#host-与-origin-检查)设置 `allowed_hosts` 和 `allow_origins`。修改后[重启 honk](what-doona-can-change.md#restart-native)，再重新加载页面。

如果 HTML 能打开，但 JavaScript 或 CSS 返回 403，在浏览器开发者工具的网络面板中检查失败的请求。将 Host、Origin 及其端口与允许列表逐项比较。

### 静态服务器与反向代理 {#静态服务器与反向代理}

静态服务器可以在网站根目录或 `/ui/` 等路径前缀下提供解压后的 UI 文件。doona 使用 `/ui/#/activity` 这样的 hash 路由，无需配置 SPA 重写规则。

反向代理必须将精确路径 `/api` 的 discovery 请求和 `/api/` 下的请求都转发到 honk 监听地址。只转发 `/api/` 会遗漏 discovery，导致无法连接。

如果连接地址带有 `/gateway` 等代理前缀，将 `/gateway/api` 转发到 honk 的 `/api`，将 `/gateway/api/…` 转发到 `/api/…`。两个路由必须采用相同的前缀映射。


## 维护安装 {#operation}


### 重新加载或重启 {#reload-and-restart}

先查 [doona 可以更改什么](what-doona-can-change.md)，确定修改如何生效，再按 honk 的[热 reload 和停止](/zh-CN/honk/how-to-start#热-reload-和停止)操作。

### 更新 UI {#更新-ui}

使用外部 UI 目录时，沿用原安装方式安装新版软件包或压缩包。在已配置的目录中替换文件后，只需重新加载浏览器页面。

使用 `ui: embedded` 时，安装独立 UI 软件包不会替换嵌入式界面。可以按[安装 honk](#install)更新到包含新版 UI 的 honk 构建，也可以单独安装 UI 文件，再将 [`ui`](configuration.md#config) 改为对应目录。两种方式都需要重启 honk，然后重新加载浏览器页面。

安装界面文件后，应用本页开头的配置，[重启 honk](service-management.md)，再按[首次登录](first-sign-in.md)操作。

</div>
