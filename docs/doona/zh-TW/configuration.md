---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 組態參考 {#config}

doona 使用下列 honk DAE 設定。各表列出預設值及生效方式。組態語法請查閱 honk 的[節點](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/nodes.md)、[訂閱](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/subscription.md)、[群組](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/groups.md)、[路由](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/routing.md)和 [DNS](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/dns.md) 參考。初次使用請從[快速入門](quick-start.md)開始，或依[為第一條連線設定路由](tutorial.md)操作。

表中預設值對應 honk `1b95e2e`，範例會覆寫其中部分值。生效方式欄連結至 [doona 可以修改什麼](what-doona-can-change.md)中對應的寫入權限或重新啟動項目。

## 原生 API 與認證 {#原生-api-與認證}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `experimental.native_api.enabled` | `false` | 啟用 doona 使用的原生 API。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.listen` | `127.0.0.1:9527` | API 監聽位址。須使用數字 IP 和非零連接埠。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.password_auth` | `false` | 啟用管理員登入；不能與 `secret` 或匿名回環存取並用。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.secret` | `''` | Token 登入。只接受不含空白或逗號的可見 ASCII。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.allow_anonymous_loopback` | `false` | 允許無憑證的回環存取；不授予受保護的寫入權限。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.config_write` | `false` | 配合憑證允許寫入組態來源及更新地理資料。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.ui` | `''` | 在 `/ui/` 提供 doona：填寫含 `index.html` 的目錄，或在啟用 `native-ui` 的建置中使用 `embedded`／`embedded-lite`。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.allow_origins` | `[]` | 額外允許的瀏覽器來源，如 `https://panel.example`。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.allowed_hosts` | `[]` | 額外允許的 HTTP 主機名稱及連接埠，如 `panel.example`。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |

## 資料目錄與狀態資料庫 {#資料目錄與狀態資料庫}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `global.data_dir` | `/var/lib/honk` | 執行資料根目錄；狀態資料庫位於其下的 `state/honk.db`。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.store_subscribe` | `true` | 儲存訂閱內容供離線啟動使用；訂閱項目的 `cache` 也須允許快取。 | [重新啟動](what-doona-can-change.md#restart-global) | [subscription](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/subscription.md) |
| `experimental.cache_file.enabled` | 未設定 | 未設定時保留 Selector 選擇和延遲樣本；`false` 關閉此快取；`true` 還儲存 Clash 模式並允許持久儲存 DNS。 | [重新啟動](what-doona-can-change.md#restart-cache) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.cache_file.store_dns` | `false` | 在 `enabled: true` 時儲存 DNS 回答。 | [重新啟動](what-doona-can-change.md#restart-cache) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |

狀態資料庫還儲存管理員憑證和地理資料設定。`--store db` 選擇資料庫組態修訂儲存；這是啟動選項，不是 DAE 鍵。見[修訂功能條件](feature-requirements.md#req-revisions)。

## 資源與訂閱預設值 {#資源與訂閱預設值}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `assets.route` | 空；遵循路由規則 | 預設下載路由：`routing`、`direct` 或群組名稱。地理資料、介面和訂閱繼承此值。 | [重新啟動](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.geodata.geosite` | `''`；有狀態資料庫時使用內建 URL | 已載入網域分類的 HTTP(S) 來源。 | [重新啟動](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.geodata.geoip` | `''`；有狀態資料庫時使用內建 URL | 已載入 IP 分類的 HTTP(S) 來源。 | [重新啟動](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.geodata.route` | 繼承 `assets.route` | 資料與檢查碼的下載路由。未設定時保留已儲存的覆寫值。 | [重新啟動](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.ui.url` | [zashboard dist.zip](https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip) | Clash 儀表板下載位址，與 doona 目錄無關。`HONK_UI_DOWNLOAD_URL` 優先。 | [重新啟動](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.ui.route` | 繼承 `assets.route` | Clash 儀表板下載路由；也接受節點標籤。 | [重新啟動](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.subscription.ua` | `honk/<version>` | 預設訂閱 User-Agent；訂閱項目可覆寫。 | [重載](what-doona-can-change.md#change-sources) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.subscription.interval` | `86400s` | 預設更新間隔；`0` 關閉定時更新。 | [重載](what-doona-can-change.md#change-sources) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |
| `assets.subscription.cache` | `true` | 預設快取訂閱內容，受 `global.store_subscribe` 限制。 | [重載](what-doona-can-change.md#change-sources) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/assets.md) |

訂閱項目選項優先於預設值，子區塊路由優先於 `assets.route`。變更若影響繼承後的地理資料或介面設定，需要重新啟動；僅影響訂閱時可重載。啟動組態中明確指定的地理資料 URL 和路由會替換已儲存的覆寫值。宣告 URL 不會載入資源。見[地理資料更新條件](feature-requirements.md#req-geodata-update)。

## 記錄權限 {#記錄權限}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `experimental.native_api.record_traffic` | `true` | 流量歷史圖表。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.record_memory` | `true` | 記憶體歷史圖表。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.record_flows` | `true` | 允許記錄分流及規則命中資訊。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.record_logs` | `true` | 允許記錄日誌頁內容。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.native_api.record_dns_log` | `true` | 允許記錄 DNS 解析日誌。 | [重新啟動](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |

這些檔案鍵授予記錄權限。流、日誌和 DNS 日誌以按需模式啟動；執行期開關不能覆寫組態中的停用設定。連線頁單獨列出活動的使用者空間連線，不依賴流記錄器。見[連線條件](feature-requirements.md#req-connections)、[流記錄條件](feature-requirements.md#req-flows)和[執行時覆寫條件](feature-requirements.md#req-runtime-options)。

## 健康檢查 {#健康檢查}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `global.tcp_check_url` | `https://www.gstatic.com/generate_204` | 全域 HTTP 探測目標清單；健康檢查使用第一個 URL。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tcp_check_http_method` | `HEAD` | 全域 HTTP 健康檢查方法。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.udp_check_dns` | `dns.google:53`, `8.8.8.8`, `2001:4860:4860::8888` | UDP 探測目標；第一個 IP 位址優先於網域名稱。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.check_interval` | `30s` | 全域健康檢查間隔。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.check_tolerance` | `50ms` | URLTest 切換成員所需的預設延遲改善量。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |

## 日誌 {#日誌}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `global.log_level` | `info` | 啟動日誌篩選等級。有效的 `RUST_LOG` 優先，其次為 `--debug`。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.log_file` | `''` | 可選日誌檔案。相對路徑以 `data_dir` 為基準；`--log-file` 優先。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |

## 介面與核心 {#介面與核心}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `global.lan_interface` | `[]` | 轉送流量的 LAN 介面；為空時不掛接 LAN。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.wan_interface` | `[]` | 本機流量的介面；`auto` 跟隨度量值最低的 IPv4 預設路由。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tproxy_port` | `12345` | 透明 TCP/UDP 監聽連接埠。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.so_mark_from_dae` | `0` | 為零時實際標記為 `0x100`；否則使用設定的通訊端繞過標記。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.nfqueue_enable` | `true` | 請求對路由尚未確定的 LAN 轉送 UDP 使用 NFQUEUE 暫存。需要真實 eBPF 後端。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |

要處理 LAN 用戶端流量，將 `global.lan_interface` 設為連接這些用戶端的介面：

- 主路由使用 LAN 橋接器，通常為 `br-lan`；用戶端已將此路由器設為閘道器。
- 使用旁路由時，還須將用戶端的閘道器與 DNS 設為旁路由的 LAN 位址，可逐台設定，也可透過主路由的 DHCP 設定派送。

不要假定 `lan_interface: auto` 會選擇 LAN。它選擇度量值最低的 IPv4 預設路由所在介面，在主路由上通常是 WAN 介面。

## 連線與預熱 {#連線與預熱}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `global.dial_mode` | `domain` | 網域識別與路由重新評估模式：`ip`、`domain`、`domain+`、`domain++`。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.bootstrap_resolver` | `''` | 節點網域及控制平面連線的解析器。依網域直連下載地理資料需要此項。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tls_implementation` | `tls` | 選擇一般 TLS 或 `utls` ClientHello 模擬。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.max_concurrent_dials` | `64` | 代理實體連線與交握的請求上限；資源預算可能降低此值。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.udp_warm_node_count` | `0` | UDP 預熱候選節點數；零表示關閉。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.preconnect_node_count` | `auto` | 僅在啟動時預熱 TCP；`auto` 最多選擇八個合格節點。重載不會再次預熱。 | [重新啟動後預熱](what-doona-can-change.md#startup-preconnect) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |

## 接受但沒有執行效果的欄位 {#接受但沒有執行效果的欄位}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `global.tproxy_port_protect` | `true` | 僅儲存；不控制連接埠保護。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.pprof_port` | `0` | 僅儲存；不會啟動 pprof 服務。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.auto_config_kernel_parameter` | `false` | 僅儲存；不控制資料路徑固定的 sysctl 設定。 | [重新啟動](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.disable_waiting_network` | `false` | 僅儲存；不改變啟動等待行為。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.allow_insecure` | `false` | 僅儲存；不會全域關閉憑證驗證。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.sniffing_timeout` | `30ms` | 僅儲存；不設定實際嗅探逾時。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.mptcp` | `false` | 僅儲存；不啟用 MPTCP。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.fallback_resolver` | `8.8.8.8:53` | 僅儲存；不選擇備援解析器。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tls_fragment` | `false` | 僅儲存；不啟用 TLS 分片。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tls_fragment_length` | `''` | 僅儲存；不設定分片長度。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.tls_fragment_interval` | `''` | 僅儲存；不設定分片間隔。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.bandwidth_max_tx` | `''` | 僅儲存；不限制傳送頻寬。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.bandwidth_max_rx` | `''` | 僅儲存；不限制接收頻寬。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |
| `global.utls_imitate` | `chrome_auto` | 接受指紋名稱，但不會改變唯一支援的 Chrome 設定。 | [重載](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/global.md) |

## DNS 監聽與 Clash 相容設定 {#dns-監聽與-clash-相容設定}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `dns.bind` | `''` | 獨立 DNS 監聽位址；為空時關閉。須在 doona 之外編輯。 | [重新啟動](what-doona-can-change.md#restart-dns) | [dns](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/dns.md) |
| `experimental.clash_api.external_controller` | `''` | Clash API 監聽位址；為空時關閉。 | [重新啟動](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.clash_api.external_ui` | `''` | Clash 儀表板目錄。 | [重新啟動](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.clash_api.secret` | `''` | Clash Token；含此宣告的來源在 doona 中唯讀。 | [重新啟動](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |
| `experimental.clash_api.default_mode` | `Rule` | 初始 Clash 模式：`Rule`、`Global` 或 `Direct`。 | [重新啟動](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/experimental.md) |

## 執行期 API 欄位，不是 DAE 鍵 {#執行期-api-欄位不是-dae-鍵}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `record_flows`, `record_logs`, `record_dns_log` | `auto` | 按需記錄模式：`auto`、`on`、`off`；仍受組態停用條件限制。 | [即時](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `log.level` | 來自 `global.log_level` | 即時日誌篩選等級；覆寫後也影響主控台和檔案輸出。 | [即時](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `log.buffered_records` | `512` | 日誌緩衝容量；`64`–`512`。 | [即時](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `dns_log.max_records` | `512` | DNS 日誌容量；`64`–`512`。 | [即時](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `flows.max_flows` | `1024` | 流記錄容量；`64`–`1024`。 | [即時](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `flows.retention_seconds` | `300` | 已結束流的保留時間；`1`–`300` 秒。 | [即時](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |

在設定頁修改這些欄位，不要寫入 DAE 檔案。成功啟用組態或重新啟動會重置這些值。見[執行期覆寫條件](feature-requirements.md#req-runtime-options)。

## 持久儲存的地理資料設定，不是 DAE 鍵 {#持久儲存的地理資料設定不是-dae-鍵}

| 鍵 | 預設值 | doona 如何使用 | 生效方式 | honk 參考 |
| --- | --- | --- | --- | --- |
| `geodata.geosite.urls`, `geodata.geoip.urls` | [GitHub](https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geosite.dat) + [jsDelivr](https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat)；GeoIP 使用 `geoip.dat` | 已儲存的 URL 清單；啟動組態中的 URL 優先。 | [即時，持久儲存](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `geodata.download` | 路由規則 | 下載路由及可選的 `group_id`；啟動組態中的路由優先。 | [即時，持久儲存](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `geodata.verify_checksum` | `true` | 下載檢查碼驗證。 | [即時，持久儲存](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `geodata.auto_update.enabled` | `true` | 啟用定時更新檢查。 | [即時，持久儲存](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |
| `geodata.auto_update.interval_hours` | `24` | 定時檢查間隔，單位為小時。 | [即時，持久儲存](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/api.md) |

在設定頁修改這些欄位需要憑證和可用的狀態資料庫。儲存設定不會啟用新的資源檔案。見[地理資料設定條件](feature-requirements.md#req-geodata-settings)。

## 別名與遷移鍵 {#別名與遷移鍵}

| 舊名稱 | 目前名稱 |
| --- | --- |
| `experimental.native_api.geosite_download_url` | `assets.geodata.geosite` |
| `experimental.native_api.geoip_download_url` | `assets.geodata.geoip` |
| `experimental.native_api.geodata_download_detour` | `assets.geodata.route` |
| `experimental.clash_api.external_ui_download_url` | `assets.ui.url` |
| `experimental.clash_api.external_ui_download_detour` | `assets.ui.route` |
| `experimental.udp_nfqueue.enabled` | `global.nfqueue_enable` |

新檔案請使用目前名稱。資源別名會產生 `legacy-assets-key` 警告；非空舊值與對應新鍵並用會報 `conflicting-assets-setting`。舊 NFQUEUE 區塊會產生遷移警告，僅在未設定 `global.nfqueue_enable` 時提供該值。`experimental.cache_file.path` 和 `cache_id` 僅用於舊資料匯入，不指定目前資料庫位置。`store_fakeip` 沒有效果。

## 完整註解範例 {#完整註解範例}

此主檔案包含教學所用的訂閱、群組、網域規則、DNS 規則和下載預設值。啟動 honk 前，請替換訂閱 URL。

將 API 憑證與節點頁修改的主檔案分開。見[組態來源寫入條件](feature-requirements.md#req-config-edit)。

### 主檔案 {#主檔案}

```dae
# /etc/honk/config.dae
# 將 API 憑證儲存在獨立的引入檔案中。
include {
    config.d/*.dae
}

# 本機流量、儲存、檢查與連線設定。
global {
    wan_interface: auto
    # 如需處理 LAN 用戶端流量，取消註解並填寫其閘道器介面。
    # lan_interface: br-lan
    data_dir: '/var/lib/honk'
    store_subscribe: true
    log_level: info
    # 可選的附加日誌檔案，路徑相對於 data_dir。
    # log_file: 'honk.log'
    tproxy_port: 12345
    so_mark_from_dae: 0
    nfqueue_enable: true
    tcp_check_url: 'https://www.gstatic.com/generate_204'
    tcp_check_http_method: HEAD
    udp_check_dns: 'dns.google:53', '8.8.8.8', '2001:4860:4860::8888'
    check_interval: 30s
    check_tolerance: 50ms
    dial_mode: domain
    bootstrap_resolver: '1.1.1.1:53'
    tls_implementation: tls
    max_concurrent_dials: 64
    preconnect_node_count: auto
    udp_warm_node_count: 0
}

# 將佔位位址替換為供應商的訂閱 URL。
subscription {
    harbor: 'https://subscription.example/sub'
}

# 可選靜態節點；填寫真實節點資訊後再取消註解。
node {
    # backup: 'socks5://192.0.2.2:1080'
}

# 依移動平均延遲選擇 harbor 的節點。
group {
    # 流量規則和 DNS 上游共用此群組。
    proxy {
        filter: subtag('harbor')
        policy: min_moving_avg
    }
}

# 僅將教學網域送入此群組。
routing {
    domain(full: example.com) -> proxy
    fallback: direct
}

# 透過同一群組解析教學網域。
dns {
    # 使用 IP 位址的 HTTPS 端點，避免依賴其網域的初始解析。
    upstream {
        remote_dns: 'https://1.1.1.1/dns-query' -> proxy
    }
    # 其他 DNS 請求保留原目的地。
    routing {
        # 比對與流量規則相同的完整網域。
        request {
            qname(full: example.com) -> remote_dns
            fallback: asis
        }
        # 保留所選上游的回答。
        response {
            fallback: accept
        }
    }
}

# 下載預設值；僅設定這些 URL 不會載入地理資料資源。
assets {
    route: routing
    # 路由規則載入對應資源後的更新來源。
    geodata {
        geosite: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geosite.dat'
        geoip: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geoip.dat'
        route: direct
    }
    # 僅用於獨立設定的 Clash 儀表板，不用於 doona。
    ui {
        url: 'https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip'
        route: direct
    }
    # 各訂閱項目的選項可以覆寫這些預設值。
    subscription {
        interval: 86400s
        cache: true
        # ua: 'clash.meta'
    }
}
```

### API 檔案 {#api-檔案}

將[快速入門](quick-start.md)中的 API 區塊寫入 `/etc/honk/config.d/api.dae`；使用獨立介面檔案時，改用[獨立介面組態](install.md)。

然後[重新啟動 honk](service-management.md)。對應的介面操作見[為第一條連線設定路由](tutorial.md)。

</div>
