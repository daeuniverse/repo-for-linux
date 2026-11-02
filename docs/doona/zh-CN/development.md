---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 开发 {#title-开发}

使用以下命令在本地构建和检查 doona。应用位于 [Zakkaus/doona](https://github.com/Zakkaus/doona)，本文档及其站点位于 [Zakkaus/doona-docs](https://github.com/Zakkaus/doona-docs)。

提交改动前，阅读应用的 [CONTRIBUTING.md](https://github.com/Zakkaus/doona/blob/main/CONTRIBUTING.md)。工具版本见[运行要求](requirements.md)。

## 构建标准版 {#构建标准版}

在 doona 应用仓库根目录执行：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

开发服务器使用模拟后端。停止开发服务器后，执行构建和检查：

```sh
pnpm build
pnpm check
pnpm check:size
```

构建产物位于 `dist/`。`check` 执行类型、lint、翻译、格式、单元测试和生成的 API 检查；`check:size` 测量构建产物。


## 构建 doona lite {#doona-lite}

安装根目录依赖后，在同一应用仓库根目录执行：

```sh
pnpm --dir apps/lite install --frozen-lockfile
pnpm --dir apps/lite build
pnpm --dir apps/lite check
```

构建产物位于 `apps/lite/dist/`。使用 `pnpm --dir apps/lite dev` 启动开发服务器。

## 执行浏览器测试 {#执行浏览器测试}

在应用仓库根目录执行：

```sh
pnpm e2e:install --with-deps
pnpm e2e
```

第一条命令安装浏览器和系统依赖，第二条重新构建标准版并执行 Playwright 测试。

测试实际后端时，将 `DOONA_API` 设为服务器根地址；如需认证，通过 shell 环境提供 `DOONA_TOKEN`，再执行 `pnpm e2e:live`。该命令执行无障碍、手机和键盘测试。不要将凭据写入命令历史或报告。

实际后端测试禁止在 fixture 存储中覆盖后端设置，并阻止包括 DNS 查询在内的控制请求。普通 `pnpm e2e` 会拒绝 `DOONA_API`，除非同时设置 `DOONA_LIVE_OBSERVE=1`；测试实际后端应使用 `pnpm e2e:live`。

## 截图与 API 检查 {#截图与-api-检查}

安装应用依赖后，在应用仓库根目录执行以下工具。

- 截图：先安装 Playwright 的 Chromium、`cwebp` 和 `img2webp`，再启动使用模拟后端的预览。执行 `node tools/screenshots.mjs <url> docs/screenshots`，将 `<url>` 替换为预览地址。工具会生成本地化页面、配色总览、英文主题图库、手机长图、页面导览静态图与路由动画，格式均为 WebP。
- API 契约：执行 `node tools/conformance.mjs http://router:9527`，将地址替换为后端服务器根地址。工具按仓库内的契约检查服务发现、能力与只读响应，并跳过修改操作。需要认证时，通过 `--token "$DOONA_TOKEN"` 从 shell 环境传入 Token。

## 打包两个版本 {#打包两个版本}

先构建两个版本。安装 GNU tar、gzip、Brotli 和 sha256sum，然后在应用仓库根目录执行：

```sh
pnpm package
```

`release/` 目录包含标准版、lite、字体和预压缩文件的归档，以及 `SHA256SUMS`。归档名称使用 `package.json` 中的版本；`pnpm package --git-version` 使用 `git describe --tags --always` 的结果，并去掉开头的 `v`。

归档时间戳使用 `SOURCE_DATE_EPOCH`；未设置时，使用 HEAD 提交时间。

## 更新 API 类型 {#更新-api-类型}

[契约来源记录](https://github.com/Zakkaus/doona/blob/main/contract/api-standardize/SOURCE.md)列出仓库内 API 契约的版本。更新契约后，在应用仓库根目录执行：

```sh
pnpm gen:api
pnpm check
```

生成的类型写入 `src/api/types.ts`。

## 检查文档站点 {#检查文档站点}

在文档仓库根目录安装依赖。将 `DOONA_DIR` 设为应用仓库路径，供检查器核对应用的文档链接：

```sh
pnpm install --frozen-lockfile
DOONA_DIR=/path/to/doona pnpm -s docs:check
DOONA_DIR=/path/to/doona pnpm -s test
pnpm docs:build
```

站点构建产物位于 `dist-docs/`。

## 查找源文件 {#查找源文件}

以下路径均相对于应用仓库根目录。

| 路径 | 用途 |
| --- | --- |
| `src/features/` | 页面、功能 hooks 与消息 |
| `src/shell/` | 应用外壳、导航与搜索 |
| `src/ui/` | 共享组件、主题与图标 |
| `src/api/` | 客户端、后端配置方案、适配器与生成的类型 |
| `mock/` | 演示、预览与测试后端 |
| `src/store/` | 资源监视、缓存读取与操作 hooks |
| `src/i18n/` | 翻译与区域设置辅助函数 |
| `contract/` | 仓库内的 OpenAPI 契约及其固定版本 |
| `public/` | 静态图标、manifest 与 service worker |
| `e2e/` | 浏览器测试 |
| `tools/` | 构建、打包、契约检查与截图工具 |
| `install/` | 发行版打包与安装配置 |
| `docs/` | 应用侧参考文档，包括国旗与字体说明 |
| `node_modules/@fontsource-variable/` | 安装依赖后供 Vite 打包的 Noto Sans TC/SC 字体源文件 |

发布记录见 [CHANGELOG.md](https://github.com/Zakkaus/doona/blob/main/CHANGELOG.md)。

</div>
