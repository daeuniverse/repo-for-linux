---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 連線至 doona lite {#lite-connect}

將已安裝或獨立託管的 lite 頁面連接到 honk 原生 API。尚未安裝時，先閱讀 [doona lite](lite.md#lite-install)。

## 1. 選擇後端 {#1-選擇後端}

開啟 lite 頁面；由 honk 託管時，使用其 `/ui/` 位址。未儲存連線時，lite 會自動偵測同源的 honk。若 honk 允許匿名存取，lite 會直接連線；否則會開啟對應的登入表單。若要連接其他後端，選取**使用其他後端**。

未偵測到 honk 或選擇其他後端時：

1. 在 **honk native API 根網址**輸入伺服器根位址，例如 `http://192.168.1.1:9527`；有反向代理前綴時一併填入。不要加 `/ui/` 或 `/api/v1`，也不要填入代理節點網址。
2. 選取**繼續**，探索登入方式。

使用獨立託管的頁面或主機名稱時，先設定[主機名稱與來源存取](install.md#other-origin)。探索失敗時，查看[登入需求](feature-requirements.md#req-sign-in)。

## 2. 登入 {#2-登入}

| 表單 | 操作 |
| --- | --- |
| **設定管理員** | 輸入**使用者名稱**、**密碼**和**確認密碼**，選取**建立並登入**。帳號格式見[首次登入](first-sign-in.md)，建立條件見[登入需求](feature-requirements.md#req-sign-in)。 |
| **登入** | 輸入既有 honk 管理員的**使用者名稱**和**密碼**，選取**登入**。 |
| 權杖欄位 | 在**權杖**中輸入已設定的密鑰；若 honk 允許匿名存取，可留空。接著選取**連線至後端**。 |

連線後，繼續閱讀 [doona lite 常用任務](lite-tasks.md)。憑證遭拒時，查看[登入疑難排解](troubleshooting.md#sign-in)。

## 不連接後端體驗介面 {#不連接後端體驗介面}

開啟 [doona lite 示範網站](https://demo.daeuniverse.org/lite/)，使用範例資料體驗介面，無需連接後端。重新載入頁面會重設範例資料中的修改。lite 的發布版本只能連接 honk，不提供試用示範按鈕。

</div>
