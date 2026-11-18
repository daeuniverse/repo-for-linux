---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 服务管理 {#title-服务管理}

按[快速入门](quick-start.md)或[独立界面设置](install.md)配置 honk。服务脚本、启动标记、日志命令和重载结果见 honk 的[使用 systemd 运行](/zh-CN/honk/how-to-start#使用-systemd-运行)、[使用 OpenWrt procd 运行](/zh-CN/honk/how-to-start#使用-openwrt-procd-运行)、[读取服务日志](/zh-CN/honk/how-to-start#读取服务日志)和[热 reload 和停止](/zh-CN/honk/how-to-start#热-reload-和停止)。使用 OpenWrt 软件源时，按[软件源指南](/zh-CN/openwrt/)操作其服务，不要创建第二个服务。

doona 需要 `/ui/` 监听和可写的配置来源；[快速入门](quick-start.md)会同时设置两者。重载或重启前先查 [doona 可以修改什么](what-doona-can-change.md)，修改 `experimental.native_api` 块后重启 honk，再重新载入 doona 页面。

</div>
