---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 標準版與 doona lite {#editions}

標準版用於管理組態與觀測流量。需要流量儀表板、連線控制、日誌、進階路由追蹤或多組態來源編輯時，應選擇標準版。

doona lite 用於設定節點、訂閱、策略群組、路由、DNS 與全域設定。需要任務專用表單、手動節點分享與組態草稿確認流程，且無需流量頁面時，可選擇 lite。

honk 也提供 Clash 相容 API，供 zashboard 等 Clash 儀表板使用；doona 不使用此 API（見 honk 的[最小組態](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#最小配置)）。


## 功能比較 {#editions-compare}

功能取決於 honk 宣告的資源與權限；切換版本無法啟用後端未提供的能力。

| 功能 | 標準版 | doona lite |
| --- | --- | --- |
| 流量監控 | 活動、系統狀態、連線、分流、日誌與事件 | 無流量頁面 |
| 小工具 | 活動小工具，以及懸浮或嵌入側邊欄的小工具 | 不提供 |
| 關閉連線；匯出事件 | 支援 | 不提供 |
| 路由測試 | 規則 → 追蹤模擬，含進階流量欄位與解析選項 | 路由 → 測試規則，顯示命中規則與出站；使用相同的路由追蹤 API |
| DNS 查詢、解析記錄、統計與快取 | 支援 | 無獨立查詢或觀測頁面；路由測試會使用 DNS 解析 |
| 節點、訂閱與策略群組選擇 | 支援；策略群組位於策略頁面 | 支援；節點、訂閱與策略群組各有獨立頁面 |
| 多行分享連結匯入 | 支援 | 支援，入口為新增節點 → 貼上連結 |
| 分享連結與 QR code | 無專用分享對話框 | 可分享手動節點與訂閱連結；無法分享訂閱節點 |
| 重新命名訂閱 | 支援，可選擇同步更新策略群組參照 | 不支援；名稱建立後固定 |
| 策略群組編輯 | 策略群組表單與完整組態來源編輯器 | 策略群組表單、策略群組文字編輯器、建立策略群組副本及跨群組複製成員 |
| 路由與 DNS 規則 | 表單與完整組態來源編輯器 | 表單、排序控制項與頁面內的視覺化／文字模式 |
| DNS 上游預設 | 在組態來源編輯器中修改上游；無預設表單 | 自訂上游，以及阿里 DNS、DNSPod 與 Cloudflare 預設 |
| 全域設定 | 組態 → 全域設定 | 設定對話框；需重新啟動的值為唯讀，並提供複製按鈕 |
| 組態來源 | 選擇與編輯 main/include 組態來源，建立組態來源並檢視診斷 | 僅編輯 main；無完整組態來源編輯器 |
| 匯出組態 | 匯出選定的組態來源 | 匯出已套用的 main，或目前頁面尚未儲存的草稿 |
| 後端管理 | 多後端連線、登出、暫時執行時覆寫與地理資料管理 | 無對應管理介面 |
| 伺服器組態備份與修訂 | honk 宣告 x-honk 擴充時可用 | 不提供 |
| 佈景主題與登入 | 淺色／深色佈景主題及配色；管理員憑證或權杖 | 淺色、深色或跟隨系統，無配色選擇器；使用相同的 honk 憑證 |


## 後端要求 {#backend-requirements}

請使用[執行要求](requirements.md#honk-version)指定的原生 API honk 建置。兩個版本均透過 `GET /api` 取得認證方式，並讀取 `GET /api/v1/capabilities`。密碼模式使用 `POST /api/v1/auth/setup` 或 `POST /api/v1/auth/login`。其餘端點按功能需要呼叫，並非每次連線都需要支援。下表路徑均以 `/api/v1` 開頭。

| 功能 | honk 資源與端點 | 版本 |
| --- | --- | --- |
| 組態編輯 | 可讀寫的 `config`、`config_validate` 與 `operations`；`GET /config`、`POST /config/validate`、`PUT /config/sources/{source_id}`、`GET /operations/{operation_id}` | 兩者均使用；lite 要求 `full` 驗證，以及完整、雜湊一致且可寫入的 main 內容。後端支援時，標準版會驗證組態來源的修改。lite 的分享連結匯入還需要 `syntax` 驗證。 |
| 節點、訂閱與策略群組 | `nodes`、`providers`、`groups`；`GET /nodes`、`GET /providers`、`GET /groups`、`GET /groups/{group_id}`、`POST /providers/{provider_id}/refresh`、`PUT`/`DELETE /groups/{group_id}/selection`；`probes` 使用 `POST /probes` | 兩者均使用；lite 透過替換 main 組態來源編輯宣告。標準版還使用節點／訂閱的建立、刪除及策略群組組態端點。 |
| 狀態與服務命令 | `runtime`、`operations`，以及後端宣告的 `reload`/`suspend`/`resume` 能力；`GET /runtime`、`GET /version`（僅標準版）、`POST /operations/reload`、`/operations/suspend`、`/operations/resume`，以及操作狀態查詢 | 兩者均使用；lite 在介面頂欄顯示狀態，無流量儀表板。 |
| 路由測試 | `routing_trace` 使用 `POST /routing/trace`；`rules` 使用 `GET /rules`；需要解析網域時，`dns_query` 使用 `POST /dns/query` | 兩者均使用；可用測試取決於 honk 的解析模式。 |
| 流量與 DNS 觀測 | `traffic_history`、`memory_history`、`runtime_memory`、`runtime_outbounds`、`datapath`、`connections`、`flows`、`events`、`logs`、`dns_log`、`dns_cache`、`dns_query`；`GET /runtime/traffic/history`、`/runtime/memory/history`、`/runtime/memory`、`/runtime/outbounds`、`/datapath`、`/connections`、`/flows`、`/events`、`/logs`、`/dns/log`、`/dns/cache`、`/dns/rules`，以及 `POST /dns/query` 與允許寫入時的連線／快取刪除端點 | 標準版 |
| 組態來源與後端管理 | `POST /config/sources`；`geodata` 使用 `GET /geodata` 與 `POST /geodata/update`；`runtime_settings` 使用 `GET`/`PATCH /runtime/settings`；`POST /auth/logout` | 標準版 |
| 伺服器備份與修訂 | 後端宣告的 `x-honk` 組態匯出／匯入／修訂擴充，位於 `/x-honk/config/` 下 | 標準版；除基本契約外，還須支援這些擴充 |

lite 重用標準版的 `src/api/client.ts`，以及基於產生的 `src/api/types.ts` 的模型；介面與狀態獨立。[OpenAPI 契約](https://github.com/Zakkaus/doona/blob/main/contract/api-standardize/openapi.yaml)定義端點結構。編輯前需滿足的條件見 [lite 常見操作](lite-tasks.md)。


## 安裝與切換 {#editions-switch}

內嵌標準版請見[快速入門](quick-start.md)，切換至 lite 請見 [doona lite](lite.md#lite-install)，使用獨立目錄請見[單獨安裝介面檔案](install.md)。

honk 的 `/ui/` 一次只提供一個版本。透過 `experimental.native_api.ui` 選擇內嵌介面或目錄，再[重新啟動 honk，僅重新載入不足以生效](what-doona-can-change.md#restart-native)。[手動安裝指南](install-manual.md)為兩個版本使用不同的壓縮檔與目錄，安裝其中一個不會覆寫另一個。

若要同時使用兩個版本，讓 honk 提供其中一個，再用靜態伺服器提供另一個目錄。按[主機名稱與來源存取](install.md#other-origin)允許第二個來源。

## 獨立的瀏覽器設定 {#獨立的瀏覽器設定}

兩個版本使用相同的 honk 原生 API 與組態。組態修改由兩者共享，但各自儲存瀏覽器設定。

## 線上示範 {#線上示範}

體驗[標準版示範](https://demo.daeuniverse.org/)或 [doona lite 示範](https://demo.daeuniverse.org/lite/)。

</div>

---

來源：[doona-docs](https://github.com/Zakkaus/doona-docs)，採用 [CC BY 4.0 授權條款](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
