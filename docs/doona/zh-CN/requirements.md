---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 运行要求 {#requirements}

安装 doona 和 honk 前，先检查网关与浏览器。具体页面或操作的条件见[功能要求](feature-requirements.md)。

## 网关 {#网关}

启动后端前，按 honk 的 [Linux 内核要求](/zh-CN/honk/how-to-start#linux-内核要求)和 [bpffs 设置](/zh-CN/honk/how-to-start#bpffs)操作。首次启动实际后端时，保留控制台或其他连接网关的方式，因为 honk 会修改网关的网络配置。

## honk 版本 {#honk-version}

使用实现 doona 原生 API 契约且启用 `native-api` 构建特性的 honk。仅凭版本号无法判断兼容性。缺少该构建特性的程序，即使添加 API 配置也无法提供 API。

按[安装指南](install.md)选择兼容的 honk-core 压缩包。应用的[契约版本记录](https://github.com/Zakkaus/doona/blob/main/contract/api-standardize/SOURCE.md)列出预期的 API。

在网关上执行：

```sh
honk-core --version
```

登录后，在**系统状态**中核对正在运行的引擎版本是否与已安装的程序一致。API 缺失或构建被拒绝时，查看[原生 API 故障排查](troubleshooting.md#no-native-api)。

## 浏览器与源码构建 {#浏览器与源码构建}

| 组件 | 要求 |
| --- | --- |
| 浏览器 | 标准版构建目标：Chrome 或 Edge 120、Firefox 121、Safari 17 或更新版本；JavaScript 目标为 ES2022。 |
| 构建应用 | Node `^22.13.0 \|\| ^24.0.0 \|\| >=26.0.0`，pnpm 11.15.1。 |
| 构建本文档站点 | Node `^22.18.0 \|\| ^24.0.0 \|\| >=26.0.0`，pnpm 11.15.1。 |

只有[开发](development.md)时才需要 Node 和 pnpm，托管已构建的界面不需要。按进程名路由的额外条件见[功能要求](feature-requirements.md#req-process-routing)。

</div>
