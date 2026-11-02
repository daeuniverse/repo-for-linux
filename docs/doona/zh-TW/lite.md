---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# doona lite {#lite}

doona lite 透過表單編輯 honk 組態，目前是測試中的預覽版。為閘道器選擇介面前，請先閱讀[版本比較](editions.md)。

使用**節點**、**訂閱**、**策略群組**、**路由**和 **DNS** 管理資源，透過**設定**修改全域設定。先[連線至 doona lite](lite-connect.md)，再按[常用任務](lite-tasks.md)操作。

![節點](/doona/images/lite-nodes-light.webp)


## 安裝 doona lite {#lite-install}

自 honk v0.1.0-beta.4 起，honk 內嵌 doona lite。按[快速入門](quick-start.md)安裝 honk，再將以下區塊加入 honk 組態，取代原有的 `native_api` 區塊：

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

若要單獨安裝，請使用[手動安裝](install-manual.md)中的 lite 壓縮檔；lite 尚無發行版套件。

選擇任一方式後，按 [UI 重新啟動規則](what-doona-can-change.md#restart-native)套用變更，開啟[快速入門](quick-start.md)中的位址，再[連線至 doona lite](lite-connect.md)。


## 切換至標準版 {#lite-switch}

按[安裝與切換版本](editions.md#editions-switch)選擇標準版檔案或內嵌介面。

</div>

---

來源：[doona-docs](https://github.com/Zakkaus/doona-docs)，採用 [CC BY 4.0 授權條款](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
