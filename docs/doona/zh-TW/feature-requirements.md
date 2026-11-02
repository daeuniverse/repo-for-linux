---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 功能啟用條件 {#title-功能啟用條件}

在表中找到要使用的標準版功能，按對應章節檢查條件並啟用。修改組態前，先將列出的能力與**系統狀態 → 後端能力**對照。

| 功能 | 主要條件 | 章節連結 |
| --- | --- | --- |
| 登入與管理員初始化 | 原生 API 與認證 | [啟用條件](#req-sign-in) |
| 組態來源、表單與出站模式 | 可寫的組態來源 | [啟用條件](#req-config-edit) |
| 組態驗證 | 完整驗證能力 | [啟用條件](#req-validation) |
| 匯出、匯入與修訂 | 對應操作的能力 | [啟用條件](#req-revisions) |
| 系統狀態與即時指標 | 後端提供執行期指標 | [啟用條件](#req-runtime-status) |
| 流量與記憶體歷史 | 啟用啟動記錄器 | [啟用條件](#req-traffic-history) |
| 節點與訂閱宣告 | 所屬組態來源可寫 | [啟用條件](#req-nodes) |
| 訂閱更新 | 可更新的訂閱 | [啟用條件](#req-subscription-refresh) |
| 群組列表、選擇與固定 | 群組選擇能力 | [啟用條件](#req-group-selection) |
| 群組建立、編輯與檢查設定 | 完整可寫的宣告 | [啟用條件](#req-group-edit) |
| 延遲探測 | 相容的探測選項 | [啟用條件](#req-probes) |
| 連線與關閉流量 | 關閉需使用者空間傳輸 | [啟用條件](#req-connections) |
| 流程與已記錄的規則命中 | 正在記錄的流程記錄器 | [啟用條件](#req-flows) |
| 路由規則、DNS 規則與範本 | 可寫的規則來源 | [啟用條件](#req-rules) |
| 路由追蹤 | 路由追蹤能力 | [啟用條件](#req-routing-trace) |
| 事件 | 事件能力 | [啟用條件](#req-events) |
| 日誌 | 正在記錄的日誌記錄器 | [啟用條件](#req-logs) |
| DNS 查詢與上游選擇 | DNS 查詢能力 | [啟用條件](#req-dns-query) |
| DNS 快取操作 | 對應的快取操作能力 | [啟用條件](#req-dns-cache) |
| DNS 日誌與統計 | 正在記錄的 DNS 記錄器 | [啟用條件](#req-dns-log) |
| 執行期覆寫 | 後端提供對應欄位 | [啟用條件](#req-runtime-options) |
| 地理資料可用性 | 已載入的資源一致 | [啟用條件](#req-geodata) |
| 手動更新地理資料 | 已載入資源有可用 URL | [啟用條件](#req-geodata-update) |
| 地理資料設定與重置 | 可用的狀態資料庫 | [啟用條件](#req-geodata-settings) |
| 操作、重載、暫停與恢復 | 後端支援對應操作 | [啟用條件](#req-reload-suspend) |
| 程序名稱路由與 UDP 追蹤詳細資料 | 所需的核心掛鉤 | [啟用條件](#req-process-routing) |
| 保留選擇與探測歷史 | 可用的狀態快取 | [啟用條件](#req-persistence) |
| 外觀與瀏覽器儲存 | 瀏覽器支援且儲存可用 | [啟用條件](#req-browser-settings) |

能力名稱指原生 API 的 `resources` 物件。缺少資源就表示該資源不可用，僅安裝新版介面無法補充。**設定 → 暫時執行期覆寫**只能修改後端宣告支援的欄位。儲存與啟用規則見 [doona 可以修改什麼](what-doona-can-change.md)。

錯誤碼用於識別 API 失敗，與唯讀原因、執行期降級碼和地理資料操作階段不同。停用的按鈕可能直接說明本機缺少的條件，不會傳送請求或產生 API 錯誤。


## 登入與管理員初始化 {#req-sign-in}

**所需條件**

- [相容的 honk 建置](requirements.md#honk-version)、已啟用的原生 API，以及已設定的登入方式。
- 在 `experimental.native_api` 中，密碼模式需要 `password_auth: true` 和可用的狀態資料庫；Token 模式使用 `secret`。
- 管理員初始化僅接受來自迴環、私有或連結本機位址的連線。

**在 doona 中檢查**

- 登入頁顯示需要初始化、密碼還是 Token。
- 系統狀態顯示引擎與後端能力。

**啟用步驟**

1. 在 doona 之外編輯 `experimental.native_api`，設定 `enabled: true` 和登入方式。使用主機名稱存取時，設定允許的主機和瀏覽器來源，再重新啟動 honk。
2. 從閘道器或區域網路按[首次登入](first-sign-in.md)操作。
3. 在系統狀態中檢查引擎與後端能力。

**錯誤**

- [登入失敗](troubleshooting.md#sign-in)：[`setup_required`](troubleshooting.md#sign-in)、[`setup_already_completed`](troubleshooting.md#sign-in)、[`invalid_credentials`](troubleshooting.md#sign-in)、[`authentication_required`](troubleshooting.md#sign-in)、[`permission_denied`](troubleshooting.md#sign-in)。
- 如果沒有 API，見[缺少原生 API](troubleshooting.md#no-native-api)。


## 組態來源、表單與出站模式 {#req-config-edit}

**所需條件**

- 讀取需要 `config.available`，且已載入的組態來源集合不能超出後端的位元組數和組態來源數量限制。
- 編輯需要 `config.writable`、`experimental.native_api` 中的 `config_write: true`、憑證、完整的組態來源內容，以及可寫的所屬組態來源。
- 建立需要 `config.create`，且路徑必須由引入模式載入。
- 全域設定和模組表單需要偵測到的引擎支援。honk 出站模式控制項修改主組態來源；全域模式還需要出站目標。

**在 doona 中檢查**

- 組態頁顯示組態來源標記、診斷和操作被停用的原因。
- 活動頁顯示 honk 出站模式控制項。

**啟用步驟**

1. 在 doona 之外為 `experimental.native_api` 啟用 `config_write: true` 並設定憑證，再重新啟動 honk。
2. 解決組態來源唯讀的原因。將監聽器金鑰放在單獨的檔案中。
3. 套用更改，確認操作成功，並重新讀取組態來源核對內容。

**錯誤**

- [寫入失敗](troubleshooting.md#read-only)：[`stale_revision`](troubleshooting.md#read-only)、[`state_conflict`](troubleshooting.md#read-only)、[`permission_denied`](troubleshooting.md#sign-in)。
- [拒絕原因](troubleshooting.md#read-only)：[`writes_disabled`](troubleshooting.md#read-only)、[`configuration_unavailable`](troubleshooting.md#read-only)、[`listener_secret_source`](troubleshooting.md#read-only)、[`listener_secret_in_content`](troubleshooting.md#read-only)、[`listener_settings_changed`](troubleshooting.md#read-only)、[`unsafe_path`](troubleshooting.md#read-only)。
- 缺少本機相依項目時，見[離線相依項目](troubleshooting.md#offline-dependency)。

**詳細說明**

- 外部編輯可能使待處理寫入所用的修訂失效。
- 出站模式屬於組態更改，不是獨立的執行期開關。


## 組態驗證 {#req-validation}

**所需條件**

- `config_validate.available`、後端宣告支援的 `full` 模式，以及獲准的控制請求。
- 完整的有效組態來源集合必須符合驗證限制，包括在本機解析的引入檔案。主組態來源和引入組態來源均可驗證。

**在 doona 中檢查**

- 檢視編輯器的驗證按鈕和組態頁診斷。

**啟用步驟**

1. 如果缺少完整驗證能力，使用實作該能力的後端。
2. 恢復缺少的引入檔案或地理資料依賴，再次選擇驗證。
3. 確認結果沒有錯誤診斷。驗證不會套用草稿。

**錯誤**

- 請求錯誤：`request_too_large`、`invalid_request`。
- 離線依賴診斷見[依賴失敗](troubleshooting.md#offline-dependency)。


## 匯出、匯入與修訂 {#req-revisions}

**所需條件**

- 匯出：`config_export.available`。匯入：`config_import.available`，並遵守 `replace_required`。
- 列出修訂：`config_revisions.available`。恢復：還需要 `can_activate`。
- honk 的匯入和修訂需要 `--store db`；檔案模式仍可匯出。匯入需要可編輯的組態儲存。

**在 doona 中檢查**

- 組態 → 備份與修訂顯示各項 `x-honk` 能力對應的控制項。

**啟用步驟**

1. 啟動時選擇所需的儲存模式，再重新整理備份與修訂。
2. 匯入或恢復後，等待操作完成，並驗證生效組態。
3. 如果結果未知，先重新整理原操作的狀態，再決定是否重試。

**錯誤**

- 可能出現 [`import_entry_changed`](troubleshooting.md#read-only) 拒絕原因和組態驗證失敗。見[寫入被拒絕](troubleshooting.md#read-only)。

**詳細說明**

- 修訂記錄失敗而阻止一般寫入時，只要具備組態寫入權限，仍可復原已記錄的最新修訂。


## 系統狀態與即時指標 {#req-runtime-status}

**所需條件**

- 系統狀態：`runtime`。記憶體：`runtime_memory` 及各項後端宣告支援的指標。
- 出站計數器：`runtime_outbounds`。資料路徑詳細資料：`datapath` 及後端宣告支援的詳細資料類型。

**在 doona 中檢查**

- 檢視系統狀態中的引擎、記憶體、資料路徑和後端能力卡片。

**啟用步驟**

1. 使用相容的後端，解決對應卡片顯示的降級原因。
2. 重新整理後檢查預期讀數是否出現。不能將缺失的指標視為零。

**錯誤**

- 計數器讀取：`temporarily_unavailable`。見[原生 API 存取](troubleshooting.md#no-native-api)和[狀態資料庫失敗](troubleshooting.md#state-db)。
- 認證失敗使用[通用登入錯誤碼](troubleshooting.md#sign-in)。

**詳細說明**

- 後端可以提供基本執行期狀態，同時缺少部分測量值。


## 流量與記憶體歷史 {#req-traffic-history}

**所需條件**

- 流量歷史：`traffic_history.available`，以及 `experimental.native_api` 中的 `record_traffic: true`。
- 記憶體歷史：`memory_history.available`，以及 `experimental.native_api` 中的 `record_memory: true`。

**在 doona 中檢查**

- 檢視活動和系統狀態中的流量、記憶體圖表，以及後端能力中的對應項目。

**啟用步驟**

1. 在 doona 之外為 `experimental.native_api` 啟用對應記錄器，再重新啟動 honk。
2. 等待採樣累積，確認圖表新增樣本。

**錯誤**

- 歷史端點不可用時回傳 [`capability_not_supported`](troubleshooting.md#no-native-api)。見[後端相容性](troubleshooting.md#no-native-api)。

**詳細說明**

- 兩個記錄器是獨立的啟動設定，不是執行期開關。
- 後端宣告最大時間視窗和樣本數。有容量限制的環形緩衝區可能無法保留整個最大時間視窗。


## 節點與訂閱宣告 {#req-nodes}

**所需條件**

- 列表：`nodes.available` 和 `providers.available`。受管建立與刪除：對應的 `can_manage` 及可寫的主組態來源。
- 訂閱編輯：唯一的宣告、honk 組態語法，以及完整且可寫的所屬組態來源。
- 更新間隔、User-Agent 和快取等建立選項必須出現在 `providers.create_options` 中。

**在 doona 中檢查**

- 在節點頁檢視新增、編輯和刪除操作的說明。

**啟用步驟**

1. 解決[組態來源權限](what-doona-can-change.md)。需要寫入權限時，在 doona 之外為 `experimental.native_api` 啟用 `config_write: true` 並設定憑證，再重新啟動 honk。
2. 套用更改，並核對產生的項目。
3. 更新新建的 honk 訂閱源以載入節點；新建時尚未取得訂閱。

**錯誤**

- [`capability_not_supported`](troubleshooting.md#no-native-api)、[`state_conflict`](troubleshooting.md#read-only)、`unsupported_value`。節點與訂閱的寫入限制見[寫入被拒絕](troubleshooting.md#read-only)。

**詳細說明**

- 受管刪除不適用於內建節點、訂閱源產生的節點和引入檔案中的宣告。
- 群組最終出站所引用的節點，也不能透過受管刪除移除。


## 訂閱更新 {#req-subscription-refresh}

**所需條件**

- `providers.can_refresh`、`operations.available`，以及可更新的訂閱源。
- honk 需要正在運作的訂閱管理器和已啟用的訂閱。接受操作時，後端必須處於運作狀態。

**在 doona 中檢查**

- 節點頁顯示更新操作、訂閱源狀態、節點數和最近一次錯誤。

**啟用步驟**

1. 啟用訂閱，檢查 URL 和下載路由。
2. 更新訂閱，等待操作完成，確認更新後的狀態和節點。

**錯誤**

- [`capability_not_supported`](troubleshooting.md#no-native-api)、[`state_conflict`](troubleshooting.md#read-only)、`temporarily_unavailable`、`resource_not_found`。後端不可用時，見[原生 API 存取](troubleshooting.md#no-native-api)。
- 訂閱源錯誤 `route_unavailable`：所選路由沒有可用節點。
- 啟用時的依賴失敗見[離線依賴](troubleshooting.md#offline-dependency)。

**詳細說明**

- 內建的內聯節點源不是可下載的訂閱。


## 群組列表、選擇與固定 {#req-group-selection}

**所需條件**

- 策略頁：`groups.available`。選擇成員：群組選擇能力和 `can_select`。
- 固定或清除自動策略的覆寫選擇：`can_override`。
- 後端運作中。這些操作不需要 `config_write`，也不編輯組態來源。

**在 doona 中檢查**

- 檢視策略頁中的群組控制項。

**啟用步驟**

1. 選擇允許手動選擇的群組，或允許覆寫的策略。
2. 選擇或清除成員，並檢查所選成員或覆寫標記。

**錯誤**

- [`state_conflict`](troubleshooting.md#read-only)、`resource_not_found`。API 存取失敗時，見[登入失敗](troubleshooting.md#sign-in)。
- 重新啟動後選擇丟失時，檢查[持久儲存條件](#req-persistence)。


## 群組建立、編輯與檢查設定 {#req-group-edit}

**所需條件**

- 建立：完整且可寫的主組態來源。編輯：組態已載入，且完整、可寫的組態來源中只有一處對應宣告。
- 宣告缺失、重複或不完整時，即使已啟用組態寫入，編輯仍會停用。
- 群組檢查設定：`groups.config_patch`，且 `mutable_config` 中包含所需欄位。欄位列表見 [doona 可以修改什麼](what-doona-can-change.md)。

**在 doona 中檢查**

- 策略頁會說明編輯或某個欄位不可用的原因。

**啟用步驟**

1. 在群組編輯器之外解決重複宣告，或恢復完整的組態來源讀取內容。
2. 如果寫入已停用，在 doona 之外為 `experimental.native_api` 啟用 `config_write: true` 並設定憑證，再重新啟動 honk。
3. 套用更改，啟用後核對群組組態。

**錯誤**

- 修訂衝突：[`stale_revision`](troubleshooting.md#read-only)、[`state_conflict`](troubleshooting.md#read-only)。組態來源拒絕原因見[唯讀組態來源](troubleshooting.md#read-only)。

**詳細說明**

- 組態來源編輯與受限的群組 PATCH 控制項所需條件不同。


## 延遲探測 {#req-probes}

**所需條件**

- `probes.available`，且後端提供的目標類型、探測種類、傳輸協定和 IP 位址族存在相容的交集。
- 群組必須支援所有請求的傳輸協定。每個所選節點的協定都必須支援探測種類和傳輸協定，混合選擇也不例外。

**在 doona 中檢查**

- 檢視設定 → 延遲探測，以及節點或策略頁的探測控制項。

**啟用步驟**

1. 選擇介面提供的探測和 IP 位址族。
2. 執行探測，檢視各類探測的結果。

**錯誤**

- 請求被拒絕：`unsupported_value`、`rate_limited`、`temporarily_unavailable`。傳輸失敗顯示在探測結果中。
- 缺少探測支援時，見[原生 API 相容性](troubleshooting.md#no-native-api)。

**詳細說明**

- 已儲存的選擇不再適合目標時，doona 優先選擇 HTTP；不可用時選擇第一個相容選項。
- 交集為空時，doona 無法提供探測。


## 連線與關閉流量 {#req-connections}

**所需條件**

- 列表：`connections.available`。關閉：`can_close`、獲准的控制請求，以及在使用者空間傳輸的連線。
- 批次關閉不能超出後端宣告的最大相符項目數。

**在 doona 中檢查**

- 檢視連線頁和關閉操作的說明。

**啟用步驟**

1. 透過已設定的介面產生流量，確認出現連線項目。
2. 關閉符合條件的連線，確認它從即時列表中消失。

**錯誤**

- [`state_conflict`](troubleshooting.md#read-only)、`resource_not_found`、`request_too_large`。
- 見[連線或規則頁保持空白](troubleshooting.md#連線或規則頁保持空白)。

**詳細說明**

- 清單顯示 honk 在使用者空間處理的連線。核心直接轉送的流量不會出現，例如 `direct` 流量。


## 流程與已記錄的規則命中 {#req-flows}

**所需條件**

- `flows.available`、`experimental.native_api` 中的 `record_flows: true`，以及正在記錄的策略。
- 檢查執行期設定中的 `recording.flows.active`。能力可用不代表正在採集。

**在 doona 中檢查**

- 檢視分流頁、規則頁中已記錄的命中，以及設定 → 暫時執行期覆寫。

**啟用步驟**

1. 如果組態禁止記錄，在 doona 之外為 `experimental.native_api` 啟用 `record_flows: true`，再重新啟動 honk。
2. 選擇介面提供的執行期模式。
3. 產生新流量，確認出現流程記錄。已有流量不代表記錄器已擷取到該流量。

**錯誤**

- 讀取：`snapshot_expired`、`snapshot_unavailable`、`flow_expired`。重新整理頁面以取得新快照。
- 頁面為空時，見[連線與規則列表為空](troubleshooting.md#troubleshooting)。

**詳細說明**

- 關閉不記錄；常開記錄支援的範圍；自動按用戶端需求記錄；抽樣記錄僅記錄一部分。


## 路由規則、DNS 規則與模板 {#req-rules}

**所需條件**

- 列表：`rules.available` 或 `dns_rules.available`。新增、編輯或暫存規則：組態來源權限，以及可定位的規則或插入位置。
- 路由範本：honk 語法、完整可寫的目標、路由僅位於一個組態來源中、有效的參照群組和本機地理資料相依項目。
- 服務規則：`rules.available`、`config.available`，以及可寫入的 fallback 規則。新規則寫入 fallback 所在的檔案。

**在 doona 中檢查**

- 規則和 DNS 規則顯示不可用的操作與依賴說明。

**啟用步驟**

1. 解決所屬組態來源的問題。如果寫入已停用，在 doona 之外為 `experimental.native_api` 啟用 `config_write: true` 並設定憑證，再重新啟動 honk。
2. 套用範本前，將路由集中到單一組態來源。
3. 啟用後檢查規則列表，並對相符的目標執行追蹤。

**錯誤**

- 組態來源寫入被拒絕：見[唯讀組態來源](troubleshooting.md#read-only)。
- 依賴診斷：[`missing-offline-dependency`](troubleshooting.md#offline-dependency)、[`unreadable-offline-dependency`](troubleshooting.md#offline-dependency)、[`invalid-offline-dependency`](troubleshooting.md#offline-dependency)。見[離線依賴](troubleshooting.md#offline-dependency)。


## 路由追蹤 {#req-routing-trace}

**所需條件**

- `routing_trace.available`、受支援的解析模式，以及有效的查詢輸入。
- 即時解析必須在 `resolve_modes` 中宣告。追蹤必須符合後端的請求和時間限制。

**在 doona 中檢查**

- 在規則頁開啟追蹤面板。

**啟用步驟**

1. 缺少追蹤能力時，安裝相容的後端。
2. 選擇介面提供的解析模式，填寫目標及其他必填欄位。
3. 執行追蹤，檢查相符步驟與最終出站。

**錯誤**

- `invalid_request`、`unsupported_value`、`request_too_large`、`temporarily_unavailable`。
- 缺少後端支援時，見[原生 API 相容性](troubleshooting.md#no-native-api)。


## 事件 {#req-events}

**所需條件**

- `events.available`。

**在 doona 中檢查**

- 檢視事件頁及其連線狀態。

**啟用步驟**

1. 連線到宣告支援該資源的後端。
2. 執行重載等操作，確認對應事件出現。

**錯誤**

- 過期的續傳遊標可能回傳 [`event_cursor_expired`](troubleshooting.md#troubleshooting)。見[缺少啟動訊息](troubleshooting.md#troubleshooting)。

**詳細說明**

- 後端宣告事件類型、保留範圍和用戶端限制。事件流僅提供仍保留的事件。
- 重新連線無法恢復已從緩衝區淘汰的事件。


## 日誌 {#req-logs}

**所需條件**

- `logs.available`、`experimental.native_api` 中的 `record_logs: true`、正在記錄的模式，以及包含所需訊息的日誌等級。
- 篩選條件必須由後端宣告支援。

**在 doona 中檢查**

- 檢視日誌頁和設定 → 暫時執行期覆寫。

**啟用步驟**

1. 必要時，在 doona 之外為 `experimental.native_api` 啟用 `record_logs: true`，再重新啟動 honk。
2. 選擇介面提供的記錄模式和等級。
3. 產生該等級的新事件，確認出現對應日誌。

**錯誤**

- [`capability_not_supported`](troubleshooting.md#no-native-api)、`unsupported_value`、[`event_cursor_expired`](troubleshooting.md#troubleshooting)。見[啟動訊息與記錄器限制](troubleshooting.md#troubleshooting)。

**詳細說明**

- 緩衝區容量和保留範圍會限制重放。
- API 記錄器安裝前產生的訊息，需要檢視服務日誌。


## DNS 查詢與上游選擇 {#req-dns-query}

**所需條件**

- `dns_query.available` 和後端宣告支援的記錄類型。
- 選擇指定名稱的上游，還需要可讀取的組態中包含該上游。

**在 doona 中檢查**

- DNS → 查詢顯示可選的類型和上游。

**啟用步驟**

1. 如果需要明確選擇上游，在 `dns` 組態區塊中定義它，套用後重新開啟查詢。
2. 選擇介面提供的類型和上游，執行查詢，檢查回應和報告的結果。

**錯誤**

- 無效或不支援的請求：`invalid_request`、`unsupported_value`。
- 存取失敗時，見[原生 API 存取](troubleshooting.md#no-native-api)。

**詳細說明**

- 所選上游缺失或已移除時，doona 會將選擇恢復為自動。


## DNS 快取操作 {#req-dns-cache}

**所需條件**

- 列表：`dns_cache.available` 和 `read`。
- 刪除單條記錄、按名稱刪除和清空分別需要 `delete_entry`、`delete_name` 和 `flush`。這些能力相互獨立。

**在 doona 中檢查**

- DNS → 快取顯示受支援的控制項。

**啟用步驟**

1. 使用宣告支援所需操作的後端。啟用 DNS 日誌不會啟用快取操作。
2. 刪除或清空後，重新整理列表並檢查結果。新的 DNS 流量可能再次填充快取。

**錯誤**

- 讀取：`snapshot_expired`、`snapshot_unavailable`。格式錯誤的請求：`invalid_request`。
- 相容性與存取問題見[原生 API 存取](troubleshooting.md#no-native-api)。


## DNS 日誌與統計 {#req-dns-log}

**所需條件**

- `dns_log.available`、`experimental.native_api` 中的 `record_dns_log: true`，以及正在記錄的模式。
- 查詢與快取能力相互獨立。

**在 doona 中檢查**

- 檢視 DNS → 日誌和統計，以及設定 → 暫時執行期覆寫。

**啟用步驟**

1. 組態禁止 DNS 記錄時，在 doona 之外為 `experimental.native_api` 啟用 `record_dns_log: true`，再重新啟動 honk。
2. 選擇介面提供的模式，產生 DNS 流量，確認新增日誌和統計。

**錯誤**

- [`capability_not_supported`](troubleshooting.md#no-native-api)、`temporarily_unavailable`。見[記錄與啟動訊息](troubleshooting.md#troubleshooting)。

**詳細說明**

- 允許記錄但未開始記錄的記錄器不會產生新樣本。


## 執行期覆寫 {#req-runtime-options}

**所需條件**

- `runtime_settings.available`，且 `fields` 包含所需欄位。不需要 `config_write`。
- 即使後端宣告支援記錄器模式欄位，所選值仍必須符合記錄權限和取值限制。

**在 doona 中檢查**

- 設定 → 暫時執行期覆寫顯示可用控制項和記錄狀態。

**啟用步驟**

1. 必要時，在 doona 之外為 `experimental.native_api` 啟用對應的啟動記錄器，再重新啟動 honk。
2. 調整執行期值，核對回傳的設定。

**錯誤**

- 無效值：`invalid_request`。未宣告支援或被禁止的值：`unsupported_value`。
- 見[寫入範圍](what-doona-can-change.md)和[後端存取失敗](troubleshooting.md#sign-in)。

**詳細說明**

- 重新啟動或已接受的組態啟用會重置這些覆寫值。


## 地理資料可用性 {#req-geodata}

**所需條件**

- `geodata.available`，且流量路由器和 DNS 路由器載入的資源集合一致。

**在 doona 中檢查**

- 設定 → 地理資料顯示已載入的資源和狀態。資源不一致可能使該能力不可用。

**啟用步驟**

1. 安裝規則需要的資源。
2. 重載或重新啟動 honk，再檢查列表。

**錯誤**

- 已載入的資源集合不可用時，可能回傳 [`capability_not_supported`](troubleshooting.md#no-native-api)。見[離線依賴失敗](troubleshooting.md#offline-dependency)。

**詳細說明**

- 立即更新只更新已載入的資源，不會安裝缺少的依賴。


## 手動更新地理資料 {#req-geodata-update}

**所需條件**

- `geodata.can_update`、組態寫入權限、憑證，以及至少一個已載入資源。
- 每個已載入資源都需要磁碟路徑和可用 URL。使用最終的 HTTP 或 HTTPS URL；重新導向會被拒絕。
- 服務使用者必須能在目標位置暫存、替換並同步檔案。

**在 doona 中檢查**

- 設定 → 地理資料顯示立即更新、資源詳細資料和操作結果。
- 地理資料狀態載入完畢且目前操作結束後，立即更新才會啟用。

**啟用步驟**

1. 必要時，在 doona 之外為 `experimental.native_api` 啟用 `config_write: true` 並設定憑證。
2. 為已載入資源設定 `assets.geodata` 中的 `geosite` 和 `geoip`。有可用的狀態資料庫時，也可以透過設定頁指定來源。
3. 按需設定 `assets.geodata` 中的 `route`；未設定時繼承 `assets.route`。直連下載主機名稱 URL 時，在 `global` 中設定可用的 `bootstrap_resolver`。修改這些啟動設定後，重新啟動 honk。
4. 在設定 → 地理資料中選擇立即更新，等待完成，再檢查資源詳細資料和操作結果。

**錯誤**

- [下載階段](troubleshooting.md#geodata-update)：[`download_timeout`](troubleshooting.md#geodata-update)、[`checksum_unavailable`](troubleshooting.md#geodata-update)、[`checksum_mismatch`](troubleshooting.md#geodata-update)、[`http_status_rejected`](troubleshooting.md#geodata-update)、[`http_not_found`](troubleshooting.md#geodata-update)、[`connection_failed`](troubleshooting.md#geodata-update)、[`tls_failed`](troubleshooting.md#geodata-update)、[`group_unavailable`](troubleshooting.md#geodata-update)、[`route_blocked`](troubleshooting.md#geodata-update)、[`asset_too_large`](troubleshooting.md#geodata-update)、[`invalid_source`](troubleshooting.md#geodata-update)。
- [替換階段](troubleshooting.md#geodata-update)：[`replacement_failed`](troubleshooting.md#geodata-update) 表示替換失敗；[`directory_sync_failed`](troubleshooting.md#geodata-update) 表示尚未確認持久寫入，此時檔案可能已替換。
- 重試前，在失敗通知中按**複製錯誤**。複製內容的 `details.assets` 列出每個資源的 `written` 和 `durability_confirmed` 值，設定中的資源詳情不顯示這兩個值。請檢查這些值及目標檔案系統。

**詳細說明**

- 組態為每個已載入資源提供 URL 時，手動更新不需要狀態資料庫。沒有資料庫時，honk 無法使用已儲存或內建的 URL 列表。
- 每次 URL 嘗試都使用選定路由。群組或路由決策失敗時，不會回退到直連。
- 資源查詢順序是 `DAE_LOCATION_ASSET`、`global.data_dir`、舊版位置、工作目錄和共享目錄。
- 套件中的資源會在資料目錄中產生替代檔案，並優先於套件副本使用。已位於資料目錄或明確指定資源目錄中的檔案，則在原位置替換。
- 每次檔案下載最多允許 30 秒無進度，總時限為 10 分鐘。檢查碼請求有獨立的 10 秒時限，並在 URL 路徑後附加 `.sha256sum`。
- 檢查碼請求回傳 404 時，資源保持未驗證狀態。因其他原因無法取得檢查碼時，會拒絕本次嘗試。
- 操作失敗不代表所有檔案都未改變。


## 地理資料來源、路由、校驗和、排程與重置 {#req-geodata-settings}

**所需條件**

- 每次設定寫入都需要憑證和可用的狀態資料庫，包括來源 URL 清單、下載路由、檢查碼驗證、自動更新排程及重置。不需要 `config_write`。
- `geodata.configurable_sources`，且 `runtime_settings.fields` 中包含 `geodata`。
- 路由和檢查碼控制項還需要後端回傳對應設定。選擇群組路由需要群組資源和目前存在的群組。
- 自動下載仍需滿足[更新前提](#req-geodata-update)。

**在 doona 中檢查**

- 檢視設定 → 地理資料。沒有來源和排程控制項時，檢視系統狀態中的持久儲存警告。

**啟用步驟**

1. 修復[狀態資料庫存取](troubleshooting.md#state-db)，重新啟動 honk，確認控制項出現。
2. 儲存更改，核對回傳的設定。
3. 修改來源 URL 且更新可用時，檢查 doona 儲存後另行啟動的更新操作。

**錯誤**

- 設定失敗：[`permission_denied`](troubleshooting.md#sign-in)、[`capability_not_supported`](troubleshooting.md#no-native-api)；群組已失效時為 [`state_conflict`](troubleshooting.md#read-only)；儲存失敗時為 `temporarily_unavailable`。
- 見[地理資料控制項不可用](troubleshooting.md#geodata-sources)和[不安全的資料庫路徑](troubleshooting.md#state-unsafe)。

**詳細說明**

- 設定請求只儲存值。重置同樣是資料庫寫入，不會編輯設定檔。
- 覆寫值會保留在資料庫中，但啟動時，組態中明確指定的地理資料 URL 和下載路由會再次覆寫已儲存的值。


## 操作、重載、暫停與恢復 {#req-reload-suspend}

**所需條件**

- 追蹤已接受的操作：`operations.available`。重新載入：還需要 `reload.available`。
- 暫停：`suspend.available` 且後端運作中。恢復：`resume.available` 且後端已暫停。
- 已檢查的 honk 修訂宣告暫停和恢復不可用，無法透過組態開關啟用。

**在 doona 中檢查**

- 檢視設定中的後端操作，以及操作進度或失敗通知。

**啟用步驟**

1. 使用相容後端支援的操作，或按[服務管理](service-management.md)控制程序。
2. 重載後，檢查已接受的組態和執行期狀態。

**錯誤**

- 操作失敗：[`state_conflict`](troubleshooting.md#read-only)、組態診斷、`temporarily_unavailable`。見[寫入與操作失敗](troubleshooting.md#read-only)。

**詳細說明**

- 請求被接受，不代表操作成功。
- 結果未知時，先重新讀取結果，再執行其他寫入。


## 程序名稱路由與 UDP 追蹤詳細資料 {#req-process-routing}

**所需條件**

- 程序名稱路由：cgroup v2 通訊端身分擷取。完整名稱：由核心擷取程序參數。
- UDP 追蹤詳細資料另需核心追蹤支援。

**在 doona 中檢查**

- 系統狀態 → 資料路徑顯示支援受限的原因。

**啟用步驟**

1. 使用支援所需掛鉤的核心與 cgroup 組態。見[核心要求](requirements.md#requirements)。
2. 重新啟動 honk，確認對應警告消失。介面設定無法補充缺少的核心掛鉤。

**錯誤**

- 執行期降級碼：[`pname_routing_reduced`](troubleshooting.md#troubleshooting)、[`pname_routing_disabled`](troubleshooting.md#troubleshooting)、[`udp_trace_unavailable`](troubleshooting.md#troubleshooting)。見[核心失敗](troubleshooting.md#troubleshooting)。
- 這些代碼表示支援受限，不是組態寫入錯誤。

**詳細說明**

- 核心無法擷取程序參數時，honk 會回退到執行緒的 `comm` 名稱，而不是使用從參數取得的名稱。


## 保留選擇與探測歷史 {#req-persistence}

**所需條件**

- 要在重新啟動後保留 Selector 選擇和延遲歷史，需要可用的狀態快取，且 `experimental.cache_file` 中的 `enabled` 不能設為 `false`。
- 此 honk 修訂使用狀態資料庫持久儲存資料。密碼認證在啟動時也需要該資料庫。

**在 doona 中檢查**

- 檢視系統狀態中的持久儲存說明。

**啟用步驟**

1. 將 `experimental.cache_file` 中的 `enabled` 保持未設定，以保留 Selector 選擇和延遲樣本。
2. 按[狀態資料庫問題](troubleshooting.md#state-db)解決所有權、權限、不安全路徑、鎖或損壞問題。
3. 重新啟動 honk，確認警告消失後，再依賴已儲存的狀態。

**錯誤**

- 執行期降級碼：介面識別 [`state_cache_unavailable`](troubleshooting.md#state-db)；honk 在沒有資料庫而繼續運作時，報告 [`persistence_unavailable`](troubleshooting.md#state-db) 並附原因。見[狀態資料庫失敗](troubleshooting.md#state-db)。


## 外觀與瀏覽器儲存 {#req-browser-settings}

**所需條件**

- 瀏覽器設定不需要組態寫入權限。
- 液態玻璃需要支援基於 SVG 的 `backdrop-filter` 的 Chromium。
- 持久儲存背景圖片需要可用的 IndexedDB。旗幟覆寫要求節點名稱中沒有內嵌旗幟。

**在 doona 中檢查**

- 檢視設定 → 外觀和旗幟選擇器。

**啟用步驟**

1. 使用支援液態玻璃的瀏覽器，並允許瀏覽器持久儲存資料。
2. 選擇背景圖片，重新開啟頁面，確認圖片已儲存。
3. 要更改內嵌旗幟，需修改節點的實際名稱。瀏覽器覆寫無法替換它。

**錯誤**

- 瀏覽器儲存失敗顯示本機說明，不使用 honk API 錯誤碼。
- 升級後仍顯示舊介面資源時，見[重新整理瀏覽器](troubleshooting.md#troubleshooting)。

**詳細說明**

- 無法持久儲存時，doona 仍可在目前工作階段中保留背景圖片。

</div>

---

來源：[doona-docs](https://github.com/Zakkaus/doona-docs)，採用 [CC BY 4.0 授權條款](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
