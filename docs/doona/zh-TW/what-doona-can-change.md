---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# doona 可以修改什麼 {#title-doona-可以修改什麼}

doona 透過不同的控制項修改組態來源、執行期狀態、持久儲存的地理資料設定和瀏覽器偏好。關閉 `experimental.native_api.config_write` 會停用組態寫入，但不會停用所有操作。

## 更改儲存在哪裡 {#更改儲存在哪裡}

下表中的**組態來源權限**指 `experimental.native_api.config_write: true`、Token 或密碼認證、可用的組態協調器，以及完整且可寫的組態來源。資料庫組態儲存被阻止寫入時，也無法進行一般的組態來源編輯。引入檔案與主設定檔遵循相同的組態來源規則。

**即時生效**表示無需重新載入組態。**重載**表示寫入必須通過驗證並完成啟用操作。**重新啟動**表示必須在 doona 之外編輯組態，再重新啟動 honk。

| 更改 | 條件 | 儲存與生效方式 |
| --- | --- | --- |
| <a name="change-sources"></a><span id="change-sources"></span>組態來源文字：`node`、`subscription`、`group`、`routing`、`dns` 中除 `bind` 之外的欄位、可重載的 `global` 欄位，以及 `assets.subscription` | 組態來源權限、目前修訂、所需的本機相依項目可用 | 檔案模式替換檔案；`--store db` 模式儲存修訂。寫入後重載。 |
| 新增或刪除受管節點和訂閱源 | 可寫的主組態來源及對應的 `can_manage` 能力 | 寫入後重載。受管刪除不適用於內建節點、訂閱源產生的節點或引入檔案中的宣告。 |
| 編輯訂閱宣告 | 包含該宣告的組態來源完整且可寫 | 寫入組態來源後重載。 |
| <a name="change-groups"></a><span id="change-groups"></span>群組欄位：`policy`、`default`、`final`、`tolerance`、`idle_timeout`、`interrupt_connections`、`check_url` | 所屬組態來源可寫，支援 `groups.config_patch`，且群組的 `mutable_config` 包含該欄位 | 寫入後重載。支援可寫的引入檔案。API 將 `default` 和 `final` 分別命名為 `default_member_id` 和 `final_outbound`。 |
| <a name="change-runtime"></a><span id="change-runtime"></span>執行期 `record_flows`、`record_logs`、`record_dns_log`、`log.level`、`log.buffered_records`、`dns_log.max_records`、`flows.max_flows`、`flows.retention_seconds` | API 請求獲准、後端宣告支援該欄位、組態允許記錄且值未超出限制 | 即時生效。不需要 `config_write`。重新啟動或已接受的組態啟用會重置這些覆寫值。 |
| <a name="change-geodata"></a><span id="change-geodata"></span>地理資料 URL 清單、下載路由、檢查碼驗證、自動更新排程及重置 | 憑證、可用的狀態資料庫，以及後端宣告支援的對應設定 | 即時生效，儲存在狀態資料庫中。設定請求不下載或啟用檔案，也不需要 `config_write`。更新可用時，doona 在儲存來源 URL 後另行啟動更新。 |
| 更新地理資料檔案 | 組態寫入權限、憑證、已載入且具備路徑和 URL 的資源 | 下載、替換檔案，然後啟用。見[地理資料更新條件](feature-requirements.md#req-geodata-update)。 |
| 選擇群組成員、固定自動策略的成員或取消固定 | 後端運作中、群組選擇能力，以及群組的 `can_select` 或 `can_override` | 即時生效的執行期操作。不寫入組態來源，也不需要 `config_write`。Selector 的持久儲存依賴狀態快取，且 `experimental.cache_file.enabled` 不能為 `false`。 |
| 外觀、語言、版面配置、旗幟覆寫和探測偏好 | 瀏覽器支援及儲存可用 | 在目前瀏覽器中即時生效，不修改 honk 組態。背景圖片透過 IndexedDB 持久儲存。 |

honk 啟動時，啟動組態中明確指定的地理資料 URL 和下載路由會替換對應的已儲存覆寫值。組態來源編輯若改變了解析後的原生 API 設定，就需要重新啟動。見[地理資料設定](feature-requirements.md#req-geodata-settings)。

## 必須重新啟動的設定 {#必須重新啟動的設定}

API 會在寫入前拒絕以下實際生效值的更改。請使用外部編輯器修改，再[重新啟動 honk](service-management.md)。編輯器可能顯示需要重新啟動的診斷或 `listener_settings_changed`；見[寫入被拒絕](troubleshooting.md#read-only)。

| 區塊 | 只能透過重新啟動生效的設定 |
| --- | --- |
| <a name="restart-dns"></a><span id="restart-dns"></span>`dns` | [`bind`](/zh-TW/honk/reference/dns#獨立-listener-bind) |
| <a name="restart-global"></a><span id="restart-global"></span>`global` | [全域欄位](/zh-TW/honk/reference/global#欄位) |
| <a name="restart-native"></a><span id="restart-native"></span>`experimental.native_api` | [`native_api`](/zh-TW/honk/reference/experimental#native-api) |
| <a name="restart-clash"></a><span id="restart-clash"></span>`experimental.clash_api` | [`clash_api`](/zh-TW/honk/reference/experimental#clash-api) |
| <a name="restart-cache"></a><span id="restart-cache"></span>`experimental.cache_file` | [`cache_file`](/zh-TW/honk/reference/experimental#cache-file) |
| <a name="restart-assets"></a><span id="restart-assets"></span>`assets` | [重啟與 reload](/zh-TW/honk/reference/assets#重啟與-reload) |

## 組態來源為何唯讀 {#組態來源為何唯讀}

檢視**組態**頁的組態來源標記。已停用 `config_write` 或缺少憑證、宣告了原生 API 或 Clash API 監聽器金鑰、文字中含有已遮罩的監聽器金鑰值，或資料庫無法記錄生效修訂時，組態來源會變成唯讀。完整的來源信任邊界和拒絕代碼見 honk 的[設定來源、驗證與操作](/zh-TW/honk/reference/api#設定來源、驗證與操作)。

組態來源集合或寫入協調器不可用時，組態操作也不可用。doona 拒絕不完整的組態來源內容。寫入不能引入監聽器金鑰、改變包含憑證的組態來源集合，或修改監聽器設定。

將監聽器金鑰放在單獨的引入檔案中，並在 doona 之外編輯該檔案。重新啟動 honk 後，重新開啟組態頁，檢查其他組態來源的標記。如果其他組態來源含有相同的已遮罩金鑰值，僅拆分金鑰宣告仍無法解除唯讀。見[唯讀組態來源與寫入被拒絕](troubleshooting.md#read-only)。

## 檔案系統要求 {#檔案系統要求}

可寫標記不代表檔案系統允許替換檔案。在檔案模式下，honk 必須讀取原檔案，在同一目錄建立並同步暫存檔，再將暫存檔重新命名以替換原檔案，最後同步目錄。服務使用者須能存取所在目錄，並有權在其中建立和替換目錄項目。

組態寫入會拒絕來源路徑中的符號連結和非一般檔案。替換操作修改的是目錄項目，因此僅檢查來源檔案的寫入權限位元，無法判斷能否寫入。同時修改檔案也可能導致寫入遭拒。套用後，確認操作成功，再重新讀取組態來源核對修改。

地理資料更新有單獨的目標位置規則：套件中的資源通常由資料目錄中的檔案替代。見[地理資料位置](feature-requirements.md#req-geodata-update)。

## 已接受但沒有預期即時效果的欄位 {#已接受但沒有預期即時效果的欄位}

部分相容欄位會被接受並儲存，但不會改變流量。見 honk 的[全域欄位](/zh-TW/honk/reference/global#欄位)和[非 DAE 格式](/zh-TW/honk/reference/assets#非-dae-格式)。

| 欄位 | 實際行為 |
| --- | --- |
| <a name="startup-preconnect"></a><span id="startup-preconnect"></span>`global.preconnect_node_count` | 供啟動預熱使用。接受組態來源編輯不會再次執行預熱。重新啟動 honk 後，啟動預熱才會使用新值。 |

編輯被接受只表示操作已開始。操作狀態變為 `succeeded` 後變更才生效，請重新讀取來源確認。

</div>
