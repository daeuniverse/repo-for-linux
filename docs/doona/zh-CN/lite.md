---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# doona lite {#lite}

doona lite 通过表单编辑 honk 配置，目前是测试中的预览版。为网关选择界面前，请先阅读[版本比较](editions.md)。

使用**节点**、**订阅**、**策略组**、**路由**和 **DNS** 管理资源，通过**设置**修改全局设置。先[连接 doona lite](lite-connect.md)，再按[常用任务](lite-tasks.md)操作。

![节点](/doona/images/lite-nodes-light.webp)


## 安装 doona lite {#lite-install}

自 honk v0.1.0-beta.4 起，honk 内嵌 doona lite。按[快速入门](quick-start.md)安装 honk，再将以下块加入 honk 配置，替换原有的 `native_api` 块：

```dae
experimental {
    native_api {
        enabled: true
        listen: '127.0.0.1:9527'
        password_auth: true
        config_write: true
        ui: 'embedded-lite'
    }
}
```

若要单独安装，请使用[手动安装](install-manual.md)中的 lite 压缩包；lite 尚无发行版软件包。

选择任一方式后，按 [UI 重启规则](what-doona-can-change.md#restart-native)应用更改，打开[快速入门](quick-start.md)中的地址，再[连接 doona lite](lite-connect.md)。


## 切换到标准版 {#lite-switch}

按[安装与切换版本](editions.md#editions-switch)选择标准版文件或内嵌界面。

</div>

---

来源：[doona-docs](https://github.com/Zakkaus/doona-docs)，采用 [CC BY 4.0 许可证](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
