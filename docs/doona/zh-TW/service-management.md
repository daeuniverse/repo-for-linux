---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 服務管理 {#title-服務管理}

按[快速入門](quick-start.md)或[獨立介面設定](install.md)設定 honk。服務指令碼、啟動標記、日誌命令和重新載入結果見 honk 的[使用 systemd 執行](/zh-TW/honk/how-to-start#使用-systemd-執行)、[使用 OpenWrt procd 執行](/zh-TW/honk/how-to-start#使用-openwrt-procd-執行)、[讀取服務日誌](/zh-TW/honk/how-to-start#讀取服務日誌)和 [reload 與停止](/zh-TW/honk/how-to-start#reload-與停止)。使用 OpenWrt 軟體源時，按[軟體源指南](/zh-TW/openwrt/)操作其服務，不要建立第二個服務。

doona 需要 `/ui/` 監聽和可寫入的組態來源；[快速入門](quick-start.md)會同時設定兩者。重新載入或重新啟動前先查 [doona 可以變更什麼](what-doona-can-change.md)，修改 `experimental.native_api` 區塊後重新啟動 honk，再重新載入 doona 頁面。

</div>
