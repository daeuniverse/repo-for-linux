---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 組態參考 {#config}

doona 透過原生 API 讀寫 honk 組態。鍵、預設值和語法見 honk 的[全域](/zh-TW/honk/reference/global)、[experimental](/zh-TW/honk/reference/experimental)、[assets](/zh-TW/honk/reference/assets)、[DNS](/zh-TW/honk/reference/dns)、[路由](/zh-TW/honk/reference/routing)、[代理群組](/zh-TW/honk/reference/groups)和[訂閱](/zh-TW/honk/reference/subscription)參考。初次使用請從[快速入門](quick-start.md)開始，或依[為第一條連線設定路由](tutorial.md)操作。

以下小節按 doona 依賴的設定分組，並連結 honk 中對應的欄位契約。變更何時生效見 [doona 可以變更什麼](what-doona-can-change.md)。

## 原生 API 與認證 {#原生-api-與認證}

doona 需要 `experimental.native_api.enabled: true`、`listen` 位址，以及 `password_auth: true` 或 `secret`；若要讓 doona 寫入組態，還需 `config_write: true`。全部欄位與認證組合見 honk 的 [`native_api`](/zh-TW/honk/reference/experimental#native-api)。

## 資料目錄與狀態資料庫 {#資料目錄與狀態資料庫}

`global.data_dir` 選擇執行階段資料根目錄。管理員帳號和已儲存的地理資料設定位於其下的狀態資料庫；見 honk 的[資料目錄與資源路徑](/zh-TW/honk/reference/global#資料目錄與資源路徑)和[設定資料庫](/zh-TW/honk/reference/api#設定資料庫-store-db)。

## 資源與訂閱預設值 {#資源與訂閱預設值}

這些鍵設定下載路由和訂閱預設值。見 honk 的 [assets 欄位](/zh-TW/honk/reference/assets#欄位)和[訂閱欄位](/zh-TW/honk/reference/subscription#欄位)。

## 記錄權限 {#記錄權限}

`record_traffic` 和 `record_memory` 提供活動與系統狀態頁的流量和記憶體圖表。`record_flows` 提供路由日誌和規則命中記錄，`record_logs` 提供日誌頁，`record_dns_log` 提供 DNS 解析日誌。記錄權限與按需語義見 honk 的[共用取樣與可選歷史](/zh-TW/honk/reference/experimental#共用取樣與可選歷史)。

## 健康檢查 {#健康檢查}

`tcp_check_url`、`tcp_check_http_method`、`udp_check_dns`、`check_interval` 和 `check_tolerance` 見 honk 的[全域欄位](/zh-TW/honk/reference/global#欄位)。

## 日誌 {#日誌}

見 honk 的 [`log_level`](/zh-TW/honk/reference/global#log-level) 和 [`log_file`](/zh-TW/honk/reference/global#log-file)。

## 介面與核心 {#介面與核心}

doona 在系統狀態中顯示已繫結介面和資料面詳細資訊，具體語義由 honk 定義。見 honk 的[網卡語義](/zh-TW/honk/reference/global#網卡語義)、[`nfqueue_enable`](/zh-TW/honk/reference/global#nfqueue-enable)和[具獨立 LAN 介面的旁路由](/zh-TW/honk/how-to-start#具獨立-lan-介面的旁路由)。

## 連線與預熱 {#連線與預熱}

見 honk 的[全域欄位](/zh-TW/honk/reference/global#欄位)和[預熱與撥號預算](/zh-TW/honk/configuration#預熱與撥號預算)。

## 接受但沒有執行效果的欄位 {#接受但沒有執行效果的欄位}

honk 接受部分相容欄位，但它們沒有執行階段消費者。見 honk 的[全域欄位](/zh-TW/honk/reference/global#欄位)。

## DNS 監聽與 Clash 相容設定 {#dns-監聽與-clash-相容設定}

見 honk 的[獨立 DNS 監聽](/zh-TW/honk/reference/dns#獨立-listener-bind)和 [`clash_api`](/zh-TW/honk/reference/experimental#clash-api)。宣告 Clash API 密鑰會使對應來源在 doona 中變成唯讀。

## 執行期 API 欄位，不是 DAE 鍵 {#執行期-api-欄位不是-dae-鍵}

這些欄位透過**設定 → 臨時執行期覆寫**修改，不寫入 DAE 檔案；接受組態啟用或重新啟動後會被重設。欄位範圍與重設行為見 honk 的[原生日誌與執行時設定](/zh-TW/honk/reference/api#原生日誌與執行時設定)。

## 持久儲存的地理資料設定，不是 DAE 鍵 {#持久儲存的地理資料設定不是-dae-鍵}

這些設定透過**設定 → 地理資料**修改，需要憑證和可用的狀態資料庫；儲存設定不會啟用新檔案。見 honk 的 [geodata 來源與自動更新](/zh-TW/honk/reference/api#geodata-來源與自動更新)和[主檔案項目與 geodata 管理](/zh-TW/honk/reference/api#主檔案項目與-geodata-管理)。

## 別名與遷移鍵 {#別名與遷移鍵}

新檔案請使用目前名稱。honk 的[舊版欄位](/zh-TW/honk/reference/experimental#舊版欄位)列出舊名稱和遷移警告。

## 完整註解範例 {#完整註解範例}

將以上小節合在一起的註解範例見 honk 的[完整設定](/zh-TW/honk/configuration#完整設定)。doona 的[教學](tutorial.md)透過介面建置同一份組態。

</div>
