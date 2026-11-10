---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 疑難排解 {#troubleshooting}

依症狀查找 doona 連接 honk 時的連線、編輯、記錄或地理資料故障，按對應步驟檢查。

| 症狀 | 從哪裡開始 |
| --- | --- |
| 控制項消失或無法操作 | [功能控制項](#控制項消失或無法操作) |
| 檔案唯讀或套用失敗 | [組態寫入](#read-only) |
| 登入失敗 | [登入](#sign-in) |
| 沒有原生 API，或 `/ui/` 回傳 404 | [API 與介面存取](#no-native-api) |
| 地理資料更新失敗 | [更新錯誤](#geodata-update) |
| 缺少地理資料來源或排程控制項 | [地理資料設定](#geodata-sources) |
| 監控頁面為空 | [記錄與可見範圍](#連線或規則頁保持空白) |

## 控制項消失或無法操作 {#控制項消失或無法操作}

開啟**系統狀態**，閱讀**未開啟的功能**。doona 依後端宣告的能力，以及目前來源檔案或記錄狀態，決定提供哪些操作。

| 受影響的操作 | 檢查與處理 |
| --- | --- |
| 編輯檔案、規則或出站模式 | 依[組態條件](feature-requirements.md#req-config-edit)檢查；來源檔案的標記見[唯讀檔案](#read-only)。 |
| 新增節點或訂閱 | 依[節點管理條件](feature-requirements.md#req-nodes)檢查。 |
| 重新整理訂閱或測量延遲 | 檢查[重新整理條件](feature-requirements.md#req-subscription-refresh)或[探測條件](feature-requirements.md#req-probes)。 |
| 選擇群組內成員或編輯群組 | 兩種操作分別受[選擇條件](feature-requirements.md#req-group-selection)和[編輯條件](feature-requirements.md#req-group-edit)限制。 |
| 記錄功能或其設定 | 檢查[執行期覆寫條件](feature-requirements.md#req-runtime-options)及對應的[記錄條件](#連線或規則頁保持空白)。 |
| 目前組建未提供的功能 | 對照[支援的 honk 組建](requirements.md#honk-version)，檢查已安裝的引擎。 |


## 檔案唯讀或寫入被拒絕 {#read-only}

開啟**組態** → **設定檔**，檢查來源檔案的標記或診斷。完整的權限與檔案系統規則見 [doona 可以修改什麼](what-doona-can-change.md)及[組態條件](feature-requirements.md#req-config-edit)。

| 回報的原因 | 處理方法 |
| --- | --- |
| `writes_disabled` | 依上述組態條件啟用經過身分驗證的寫入。 |
| `configuration_unavailable` | 檢查 honk 啟動日誌，待組態載入完成後再編輯。 |
| `listener_secret_source` | 在磁碟上編輯含密鑰的檔案。將監聽密鑰放在單獨的引入檔案中，讓其他檔案保持可編輯。 |
| `listener_secret_in_content` | 檢查內容或路徑是否包含監聽密鑰值。在 doona 外更換與其他內容重複的密鑰，完成變更後重新登入。 |
| `listener_settings_changed` 或要求重新啟動的診斷 | 在 doona 外編輯設定，並依[重新啟動規則](what-doona-can-change.md)處理。 |
| `credential_sources_changed` | 在外部修改憑證來源檔案後重載 honk，再重新開啟來源檔案進行編輯。 |
| `unsafe_path` | 使用允許的組態目錄內的普通檔案，並檢查[檔案系統條件](what-doona-can-change.md)。 |
| 其他編輯操作後出現 `stale_revision` 或 `state_conflict` | 先處理[已變更的檔案](common-tasks.md#changed-on-disk)，再重新套用。 |
| `import_entry_changed` | 匯入伺服器檔案前，以 `-c` 指向目前作用中的組態入口啟動 honk。 |

結果未知時，先檢查目前來源內容，再決定是否重新寫入。已受理的匯入或復原操作，可在**備份與修訂**中重新開啟該操作。若對話框仍提示結果未知，按其中的**重新整理**查詢原操作。未收到回應不代表寫入失敗。


## 套用時顯示未寫入，並列出 `global.nfqueue_enable` 需要重新啟動 {#nfqueue-restart}

核心不支援 NFQUEUE 時，honk 啟動時會關閉 NFQUEUE，並在日誌記錄 `NFQUEUE is unavailable at startup`。honk 0.1.0-beta.4 及更早版本之後會拿每次寫入與預設值 `nfqueue_enable: true` 比較，因此套用時一律顯示**未寫入**，並把 `global.nfqueue_enable` 列為需要重新啟動的設定，重新啟動後也一樣。在 `global` 區塊寫入這個值，再[重新啟動 honk](service-management.md)：

```dae
global {
    nfqueue_enable: false
}
```

之後即可正常套用。

doona 0.1.0-rc.6 及更新版本在已載入的檔案都沒有寫出這些設定時，提示文字不同：會說明 honk 拒絕寫入所指的設定不在設定檔裡，請在設定檔明寫這些值並重新啟動 honk 一次。這段文字適用於所有只在重新啟動後生效的設定，不只是 `nfqueue_enable`。


## 套用時提示依賴檔案無法使用 {#offline-dependency}

honk 寫入前會驗證本機相依項目。檢查診斷和組態參照的檔案。

診斷不會列出相依檔案的名稱。訂閱或節點報錯時，檢查訂閱快取內容和各節點的 `ech_config_path`；DNS 報錯時，檢查 `use_host` 指定的檔案。復原缺少的檔案，或重新整理格式錯誤的訂閱內容，再重新套用。

| 代碼 | 原因與處理 |
| --- | --- |
| `missing-offline-dependency` | 復原缺少的相依檔案。地理資料安裝見[安裝說明](install.md#directories-and-geodata)或 [OpenWrt 地理資料安裝](install-openwrt.md#install-geodata)。 |
| `offline-dependency-denied` | 將相依檔案放入允許的組態目錄或資料目錄，並允許服務使用者讀取。 |
| `invalid-offline-dependency` | 替換格式錯誤的內容，或重新整理受影響的訂閱。 |
| `unreadable-offline-dependency` | 查看服務日誌中的檔案或儲存錯誤。 |

**立即更新**用於更新已載入的資料，不能安裝缺少的初始檔案。再次套用前，先檢查[地理資料條件](feature-requirements.md#req-geodata)。


## 登入失敗 {#sign-in}

先檢查[登入條件](feature-requirements.md#req-sign-in)，再依下表對照回應。

| 症狀或代碼 | 原因與處理 |
| --- | --- |
| `setup_required` | 依[首次登入](first-sign-in.md)完成管理員設定。 |
| `setup_already_completed` | 管理員已存在，使用該帳號登入。 |
| `invalid_credentials` | 重新輸入帳號憑證。忘記密碼時，依下方步驟重設。 |
| `authentication_required` | 使用該後端設定的身分驗證方式重新登入。 |
| 設定管理員時出現 `permission_denied` | 檢查[設定條件](feature-requirements.md#req-sign-in)允許的用戶端位址。 |
| 透過主機名稱或其他來源存取時出現網路錯誤或 HTTP 403 | 先檢查是否能連線，再依[主機名稱與來源存取](install.md#other-origin)檢查。 |
| API 可存取，但受保護操作被拒絕 | 檢查該操作的[功能條件](feature-requirements.md)，包括憑證與寫入權限。 |

### 重設遺忘的管理員密碼 {#重設遺忘的管理員密碼}

在閘道上[停止 honk](service-management.md)，以服務使用者身分執行已安裝的 `honk-core`。將 `/var/lib/honk` 替換為[組態](configuration.md#config)中的資料目錄：

不確定應傳入哪個目錄時，先依[資料目錄檢查](#state-unsafe)確認。

```sh
honk-core --data-dir /var/lib/honk admin reset
```

指令會刪除管理員記錄，並回報是否存在該記錄。重新啟動 honk，再依[首次登入](first-sign-in.md)建立管理員。


## 無法存取原生 API 或介面 {#no-native-api}

從本次服務啟動的日誌確認正在運作的組建與監聽位址，再檢查[相容組建](requirements.md#honk-version)及 [API 組態](configuration.md#config)。

| 症狀 | 原因與處理 |
| --- | --- |
| 無法連接監聽位址 | 確認 honk 正在運作，且已啟用的 API 監聽於所存取的位址。見[服務檢查](service-management.md)。 |
| `native API listener bind failed` | 確認 `listen` 指定的位址屬於此閘道器，且連接埠未被其他程序占用。 |
| `Subscription HTTP client creation failed`，隨後出現 `subscription network startup failed` | 閱讀底層 TLS 錯誤並檢查系統 CA 憑證庫。安裝發行版的憑證套件，如 `ca-certificates` 或 OpenWrt 的 `ca-bundle`。 |
| `command not found` 或找不到執行檔 | 按對應平台的[安裝說明](install.md)核對 honk-core 路徑。 |
| `/api` 回傳 404，或登入頁顯示**此 honk 建置沒有提供原生 API** | 確認位址指向 honk，再安裝提供原生 API 的組建。 |
| 只有 `/ui/` 回傳 404 | 檢查組態中的介面路徑及該目錄內的檔案，依[介面安裝](install.md#doona)處理。 |
| 啟動回報 `failed to inspect native UI directory`、`failed to inspect native UI index.html` 或 `native UI index.html must be a regular file` | 修正介面目錄或解壓介面檔案，使其中的 `index.html` 是可讀取的普通檔案。 |
| 操作回傳 `capability_not_supported` | 在[系統狀態](observe.md#overview)檢查該項功能。僅憑此代碼不能判斷整個 API 不存在。 |


## honk 啟動時拒絕原生 API 設定 {#unknown-setting}

`native API setting belongs inside native_api { }` 表示欄位被直接放在 `experimental` 下。對照[原生 API 組態](configuration.md#config)，將欄位移入巢狀區塊。

`enabled` 和 `secret` 可用於多個實驗性區塊。將它們直接放在 `experimental` 下，會產生 `unknown experimental setting`，且不會提示唯一的目標區塊。原生 API 的欄位應移入 `native_api { }`。

`unknown experimental setting` 也可能表示正在運作的組建不支援該設定。`native-api feature is required` 表示組建缺少已啟用的原生 API 功能。對照 [honk 要求](requirements.md#honk-version)檢查組建。

身分驗證組合導致啟動被拒絕時，依據具體啟動錯誤，檢查[登入條件](feature-requirements.md#req-sign-in)和[組態參考](configuration.md#config)。


## 地理資料更新失敗 {#geodata-update}

開啟**設定** → **地理資料**，閱讀失敗操作的階段。**立即更新**缺少或停用時，先檢查[更新條件](feature-requirements.md#req-geodata-update)。

| 階段 | 檢查或修改什麼 |
| --- | --- |
| `checksum_unavailable` | 檢查碼請求失敗。檢查鏡像的檢查碼 URL，或更換來源。 |
| `checksum_mismatch` | 下載內容與檢查碼不符。從來源取得相符的檔案與檢查碼。 |
| `download_timeout` | 檢查下載路由和來源；逾時限制見[下載期限](feature-requirements.md#req-geodata-update)。 |
| `http_status_rejected` | 檢查伺服器回傳的狀態，使用最終 URL，避免重新導向。 |
| `http_not_found` | 修正檔案 URL。 |
| `connection_failed` | 檢查所選路由和節點；依主機名稱直連下載時，檢查[更新條件](feature-requirements.md#req-geodata-update)中的解析器要求。 |
| `tls_failed` | 檢查閘道時間、伺服器憑證及主機名稱。 |
| `group_unavailable` | 在**策略**檢查所選群組是否有可用節點。 |
| `route_blocked` | 修正將此下載送往 `block` 的路由規則。 |
| `asset_too_large` | 檢查 URL 是否提供預期的地理資料檔案。 |
| `invalid_source` | 修正來源 URL。 |
| `replacement_failed` 或 `directory_sync_failed` | 重試前檢查各檔案的結果和目標檔案系統，依[替換條件](feature-requirements.md#req-geodata-update)處理。 |

檢查碼請求回傳 404 時的處理、驗證規則及部分寫入行為見[更新條件](feature-requirements.md#req-geodata-update)。


## 無法編輯地理資料來源或更新排程 {#geodata-sources}

在**系統狀態** → **資料路徑**檢查持久儲存警告。降級代碼 `persistence_unavailable` 表示狀態資料庫無法使用；依其 `reason` 執行[資料庫檢查](#state-db)。

恢復[地理資料設定條件](feature-requirements.md#req-geodata-settings)後，重新開啟地理資料卡片。手動下載有[單獨的條件](feature-requirements.md#req-geodata-update)，能下載不代表能儲存設定。


## honk 回報狀態資料庫故障 {#state-db}

在[服務日誌](service-management.md)中查看最近一次啟動錯誤。密碼驗證需要資料庫，無法開啟時會停止啟動。使用檔案組態的 Token 模式遇到部分故障時，可繼續運作但不儲存狀態；見[持久儲存條件](feature-requirements.md#req-persistence)。

| 訊息或原因 | 下一步 |
| --- | --- |
| `unavailable` | 檢查服務使用者能否建立和存取組態指定的資料目錄及其中的狀態目錄。 |
| `unsafe` | 依[不安全路徑檢查](#state-unsafe)處理。 |
| 被 `honk-core admin reset` 鎖定 | 等待該指令結束後再啟動 honk。 |
| 另一個 honk-core 已開啟資料庫 | 先停止衝突執行個體，再啟動目前執行個體。 |
| 外部應用程式 ID 或較新的資料庫結構 | 使用擁有此資料庫的 honk 組建，不要用舊組建覆蓋。 |
| `corrupt` | 在檔案儲存的 Token 模式下，honk 將損壞的資料庫移至資料目錄內的 `state/honk.db.corrupt`，再建立新資料庫。它不會覆蓋既有的損壞副本，包括 `state/honk.db.corrupt-wal`。若這些副本阻止復原，先將其儲存到其他位置，再重新啟動。 |

修復存取問題後，[重新啟動服務](service-management.md)，檢查持久儲存警告是否消失。


## 持久化警告的原因是 `unsafe` {#state-unsafe}

服務日誌會顯示拒絕的路徑、規則及建議的修復方法。配合[資料目錄組態](configuration.md#config)檢查該路徑，不要假定所有安裝都使用同一目錄。

檔案模式下，執行期資料目錄由 `global.data_dir` 決定，`--data-dir` 不會覆寫該目錄。執行 `admin reset` 時，須透過 `--data-dir` 指定同一目錄。OpenWrt 的 [`/var` 內容在重新啟動後遺失](https://openwrt.org/docs/techref/filesystems)，請使用[手動安裝的持久儲存目錄](install-openwrt.md#install-geodata)。

狀態目錄與資料庫須歸 honk 服務使用者所有，且不能向群組或其他使用者開放權限。符號連結或錯誤的檔案類型也會被拒絕。只修正日誌所指路徑的所有權、權限或類型，再重新啟動 honk。不要遞迴修改整個組態目錄的權限。

## 停止 OpenWrt 防火牆後流量異常 {#停止-openwrt-防火牆後流量異常}

如果停止防火牆時刪除了 honk 的 nftables 表，先重新啟動防火牆，再在閘道執行 `/etc/init.d/honk-core restart`。honk 運作期間，防火牆管理器不得修改 `inet honk_nfqueue` 及其 `udp_decision` 鏈。

## 安裝其他套件時 apk 回報 `breaks: world[…]` {#安裝其他套件時-apk-回報-breaks-world}

從檔案安裝的套件（如下載的 doona 或 honk `.apk`）會在 `/etc/apk/world` 中鎖定為該檔案。軟體源出現其他版本後，任何 `apk add` 都會失敗，即使安裝的是無關工具，錯誤類似 `honk-0.1.0_beta2-r1: breaks: world[honk><Q1…]`。若要改為跟隨 [daeuniverse 軟體源](/zh-TW/openwrt/)，請執行 `apk add honk@daeuniverse`，其他套件可寫在同一行命令中。若要保留本機建置，請在同一行 `apk add` 命令中再次指定該檔案。

## 固定 BPF map 時出現 Invalid argument {#固定-bpf-map-時出現-invalid-argument}

檢查 `/sys/fs/bpf` 是否掛載為 bpffs，具體步驟見[核心與檔案系統要求](requirements.md#requirements)。

## honk 拒絕目前核心或編譯路由失敗 {#honk-拒絕目前核心或編譯路由失敗}

依[執行要求](requirements.md#requirements)檢查最低核心版本及 BPF/BTF 支援。報告 verifier 失敗時，保留完整的 verifier 日誌。

## LAN 流量沒有按預期路由 {#lan-流量沒有按預期路由}

依[LAN 介面說明](configuration.md#介面與核心)檢查橋接器名稱，以及旁路由用戶端的閘道器與 DNS 設定。

## 連線或規則頁保持空白 {#連線或規則頁保持空白}

| 空白檢視 | 原因與下一項檢查 |
| --- | --- |
| **連線** | 清除篩選，閱讀可見範圍或截斷提示。檢查[連線涵蓋範圍](feature-requirements.md#req-connections)；缺少記錄不能證明流量已停止。 |
| **分流**或規則命中記錄 | 檢查[流程記錄](feature-requirements.md#req-flows)。 |
| **解析記錄**或 DNS 統計 | 檢查 [DNS 記錄](feature-requirements.md#req-dns-log)。 |
| **日誌** | 檢查[日誌記錄](feature-requirements.md#req-logs)。記錄開始前的啟動訊息不會補錄，須從服務日誌查看。 |
| **事件** | 檢查[事件可用條件](feature-requirements.md#req-events)和目前種類篩選。 |

**日誌記錄**預設為**依日誌需求**。依需求模式下，用戶端請求某類資料時，對應的已獲准記錄器開始記錄；需求結束後仍有 60 秒寬限期。連線、規則和分流頁面開啟時都會請求流程記錄。

各檢視如何使用資料，見[觀測流量](observe.md)。

## 升級後，已開啟的分頁仍顯示舊版本 {#升級後已開啟的分頁仍顯示舊版本}

升級後重新載入頁面。doona 提示新版本已就緒時，按**重新載入**。使用 `ui: embedded` 時，內嵌介面來自已安裝的 honk 二進位檔案；介面設定見[組態參考](configuration.md#config)。


## doona lite 無法開啟或顯示了另一版本 {#lite-trouble}

對照 [lite 安裝](lite.md#lite-install)檢查目錄與解壓後的檔案。修改介面設定後，依[原生 API 重新啟動規則](what-doona-can-change.md#restart-native)操作，再重新載入瀏覽器頁面。HTTP 403 或來源錯誤見[登入檢查](#sign-in)。

## 收集報告所需的錯誤資訊 {#收集報告所需的錯誤資訊}

按失敗提示中的**複製錯誤**，或在**設定** → **關於**按**複製最近錯誤**。報告中註明嘗試的操作及正在運作的引擎和介面版本。重新載入頁面會清空記憶體中的錯誤歷史，請先複製錯誤。

歷史最多保留 20 筆錯誤。複製內容包括可用的請求方法與路徑、狀態、錯誤代碼及請求 ID。請求本文和組態文字不會保留，識別出的秘密欄位會被遮蔽。複製入口見[關於](config-and-settings.md#settings-page)。

</div>
