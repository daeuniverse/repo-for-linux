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
| 訂閱更新因代理鏈或群組出口遭拒 | [遭拒的更新](#refresh-rejected) |
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

完整的拒絕代碼及各自保護的內容見 honk 的[設定來源、驗證與操作](/zh-TW/honk/reference/api#設定來源、驗證與操作)。

結果未知時，先檢查目前來源內容，再決定是否重新寫入。已受理的匯入或復原操作，可在**備份與修訂**中重新開啟該操作。若對話框仍提示結果未知，按其中的**重新整理**查詢原操作。未收到回應不代表寫入失敗。


## 套用時顯示未寫入，並列出 `global.nfqueue_enable` 需要重新啟動 {#nfqueue-restart}

當沒有任何已載入檔案寫出 honk 拒絕寫入所涉及的設定時，doona 0.1.0-rc.6 及更新版本會提示這些設定不在設定檔中，請在設定中明寫並重新啟動一次。這段文字適用於所有只能透過重新啟動生效的設定，不只是 `nfqueue_enable`。啟動時的 NFQUEUE 降級及更早版本的行為見 honk 的 [`nfqueue_enable`](/zh-TW/honk/reference/global#nfqueue-enable)。


## 套用時提示依賴檔案無法使用 {#offline-dependency}

honk 寫入前會驗證本機相依項目。檢查診斷和組態參照的檔案。

診斷不會列出相依檔案的名稱。訂閱或節點報錯時，檢查訂閱快取內容和各節點的 `ech_config_path`；DNS 報錯時，檢查 `use_host` 指定的檔案。復原缺少的檔案，或重新整理格式錯誤的訂閱內容，再重新套用。

honk 的[設定管理的信任邊界](/zh-TW/honk/reference/experimental#設定管理的信任邊界)定義了 `missing-offline-dependency`、`offline-dependency-denied`、`invalid-offline-dependency` 和 `unreadable-offline-dependency`。

**立即更新**用於更新已載入的資料，不能安裝缺少的初始檔案。再次套用前，先檢查[地理資料條件](feature-requirements.md#req-geodata)。


## 訂閱更新因代理鏈或群組出口遭拒 {#refresh-rejected}

訂閱卡片狀態旁的說明指出，代理鏈或群組出口引用的節點在此訂閱中已移除或重名。honk 已拒絕此次更新，仍沿用先前的節點。

將[代理鏈的跳點](routing.md#proxy-chain)或[群組的出口節點](routing.md#group-exit)改為名稱唯一的節點，或移除該引用，再重新更新訂閱。檢查規則見 honk 的[鏈式節點](/zh-TW/honk/reference/nodes#鏈式節點)。


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

檢查[相容組建](requirements.md#honk-version)和 [API 組態](configuration.md#config)。監聽器與啟動日誌診斷見 honk 的 [`native_api`](/zh-TW/honk/reference/experimental#native-api)與[檢查執行狀態](/zh-TW/honk/how-to-start#檢查執行狀態)。

| 症狀 | 原因與處理 |
| --- | --- |
| `/api` 回傳 404，或登入頁顯示**此 honk 建置沒有提供原生 API** | 確認位址指向 honk，再安裝提供原生 API 的組建。 |
| 只有 `/ui/` 回傳 404 | 檢查組態中的介面路徑及該目錄內的檔案，依[介面安裝](install.md#doona)處理。 |
| 啟動回報 `failed to inspect native UI directory`、`failed to inspect native UI index.html` 或 `native UI index.html must be a regular file` | 修正介面目錄或解壓介面檔案，使其中的 `index.html` 是可讀取的普通檔案。 |
| 操作回傳 `capability_not_supported` | 在[系統狀態](observe.md#overview)檢查該項功能。僅憑此代碼不能判斷整個 API 不存在。 |


## honk 啟動時拒絕原生 API 設定 {#unknown-setting}

啟動診斷（包括 `native API setting belongs inside native_api { }`、`unknown experimental setting` 和 `native-api feature is required`）以及遭拒的認證組合見 honk 的 [`native_api`](/zh-TW/honk/reference/experimental#native-api)。


## 地理資料更新失敗 {#geodata-update}

在**設定** → **地理資料**閱讀失敗操作的階段。honk 的[主檔案項目與 geodata 管理](/zh-TW/honk/reference/api#主檔案項目與-geodata-管理)列出每個階段及修復方法。**立即更新**何時可用、如何讀取複製的錯誤詳細資訊，見[更新條件](feature-requirements.md#req-geodata-update)。


## 無法編輯地理資料來源或更新排程 {#geodata-sources}

在**系統狀態** → **資料路徑**檢查持久儲存警告。降級代碼 `persistence_unavailable` 表示狀態資料庫無法使用；依其 `reason` 執行[資料庫檢查](#state-db)。已儲存設定的行為見 honk 的[持久化的狀態](/zh-TW/honk/reference/experimental#持久化的狀態)。

恢復[地理資料設定條件](feature-requirements.md#req-geodata-settings)後，重新開啟地理資料卡片。手動下載有[單獨的條件](feature-requirements.md#req-geodata-update)，能下載不代表能儲存設定。


## honk 回報狀態資料庫故障 {#state-db}

在[服務日誌](service-management.md)中查看最近一次啟動錯誤。honk 的[持久化的狀態](/zh-TW/honk/reference/experimental#持久化的狀態)說明資料庫、故障原因及損壞檔案的處理方式。


## 持久化警告的原因是 `unsafe` {#state-unsafe}

服務日誌會顯示拒絕的路徑、規則及建議的修復方法。所需的所有權、權限和檔案類型見 honk 的[持久化的狀態](/zh-TW/honk/reference/experimental#持久化的狀態)，`global.data_dir` 見[資料目錄與資源路徑](/zh-TW/honk/reference/global#資料目錄與資源路徑)。OpenWrt 的 `/var` 在重新啟動後遺失，請使用 honk [OpenWrt 安裝](/zh-TW/honk/how-to-start#openwrt)中的持久目錄。

## 停止 OpenWrt 防火牆後流量異常 {#停止-openwrt-防火牆後流量異常}

見 honk 疑難排解表中的[停止 OpenWrt 防火牆後流量異常](/zh-TW/honk/how-to-start#常見問題)。honk 運作期間，防火牆管理器不得修改 `inet honk_nfqueue` 及其 `udp_decision` 鏈。

## 安裝其他套件時 apk 回報 `breaks: world[…]` {#安裝其他套件時-apk-回報-breaks-world}

從檔案安裝的套件會在 `/etc/apk/world` 中鎖定為該檔案；軟體源出現其他版本後，任何 `apk add` 都會失敗。若要保留本機 doona 建置，請在同一行 `apk add` 命令中再次指定該檔案。honk 套件請依 honk 的 [OpenWrt 安裝](/zh-TW/honk/how-to-start#openwrt)處理。

## 固定 BPF map 時出現 Invalid argument {#固定-bpf-map-時出現-invalid-argument}

見 honk 的[常見問題](/zh-TW/honk/how-to-start#常見問題)；原因是 `/sys/fs/bpf` 沒有掛載為 bpffs。

## honk 拒絕目前核心或編譯路由失敗 {#honk-拒絕目前核心或編譯路由失敗}

檢查 honk 的 [Linux 核心要求](/zh-TW/honk/how-to-start#linux-核心要求)和[常見問題](/zh-TW/honk/how-to-start#常見問題)。報告 verifier 失敗時，保留完整的 verifier 日誌。

## LAN 流量沒有按預期路由 {#lan-流量沒有按預期路由}

見 honk 的[常見問題](/zh-TW/honk/how-to-start#常見問題)和[選擇介面](/zh-TW/honk/configuration#選擇介面)，包括旁路由用戶端的閘道器與 DNS 設定。

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
