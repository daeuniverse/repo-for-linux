---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 按任務尋找頁面 {#features}

在下表查找 doona 標準版功能及使用條件。首次設定請從[快速入門](quick-start.md)和[首次連線教學](tutorial.md)開始；精簡介面請參閱 [doona lite](lite.md)。

請在真實 LAN 用戶端上使用可用節點驗證路由，測試直連和代理的 TCP、UDP 及 DNS。`honk-core is running`、`dae0` 鏈路存在或 API 可存取，都不能證明流量實際通過。


## 頁面 {#pages}

| 頁面 | 可以完成的任務 | 使用條件 |
| --- | --- | --- |
| [活動](observe.md#activity) | 在儀表板查看流量、記憶體、連線和節點健康狀態。 | [即時指標](feature-requirements.md#req-runtime-status)、[歷史資料](feature-requirements.md#req-traffic-history) |
| [系統狀態](observe.md#overview) | 檢查引擎、資料路徑和功能受限的原因。 | [運作狀態](feature-requirements.md#req-runtime-status) |
| [連線](observe.md#connections) | 查看即時連線的路由和流量，關閉連線或開啟其符合的規則。 | [連線操作](feature-requirements.md#req-connections) |
| [分流](observe.md#flows) | 查看已記錄的流量紀錄和路由圖，了解先前的路由結果。 | [流量記錄](feature-requirements.md#req-flows) |
| [DNS](observe.md#dns) | 查詢網域，檢查回答和快取項目，查看解析日誌。 | [查詢](feature-requirements.md#req-dns-query)、[快取](feature-requirements.md#req-dns-cache)、[日誌](feature-requirements.md#req-dns-log) |
| [節點](routing.md#nodes) | 新增訂閱或節點連結，更新來源並測試節點。 | [節點管理](feature-requirements.md#req-nodes)、[訂閱更新](feature-requirements.md#req-subscription-refresh)、[探測](feature-requirements.md#req-probes) |
| [策略](routing.md#policies) | 選擇群組成員，或編輯群組的選擇方式和成員範圍。 | [成員選擇](feature-requirements.md#req-group-selection)、[編輯群組](feature-requirements.md#req-group-edit) |
| [規則](routing.md#rules) | 套用路由範本，編輯路由或 DNS 規則，模擬路由結果。 | [規則與範本](feature-requirements.md#req-rules)、[追蹤](feature-requirements.md#req-routing-trace) |
| [組態](config-and-settings.md#config-page) | 開啟組態模組，編輯檔案或全域設定，管理備份與修訂。 | [編輯](feature-requirements.md#req-config-edit)、[驗證](feature-requirements.md#req-validation)、[修訂](feature-requirements.md#req-revisions) |
| [事件](observe.md#events) | 查看後端事件。 | [事件串流](feature-requirements.md#req-events) |
| [日誌](observe.md#logs) | 查看、篩選、暫停顯示和匯出引擎日誌。 | [日誌記錄](feature-requirements.md#req-logs) |
| [設定](config-and-settings.md#settings-page) | 管理後端連線設定檔、暫時覆寫、地理資料、探測偏好和外觀。 | 無後端也能開啟此頁。各項控制項的條件見[執行期覆寫](feature-requirements.md#req-runtime-options)、[地理資料](feature-requirements.md#req-geodata)和[瀏覽器設定](feature-requirements.md#req-browser-settings)。 |


## 頁面或操作無法使用時 {#still-missing}

後端無法提供資料的頁面仍會保留在導覽中。開啟**系統狀態**查看功能限制，或開啟停用操作旁的說明。修改後端前，先閱讀表中對應的使用條件。

編輯遭拒時，參閱[唯讀來源](troubleshooting.md#read-only)；登入失敗時，參閱[登入疑難排解](troubleshooting.md#sign-in)。


## 儀表板與浮動面板 {#widgets}

活動頁與浮動面板共用元件庫，可選擇流量、記憶體、節點可用性、DNS 延遲或訂閱配額等卡片。儀表板操作見[活動頁指南](observe.md#activity)，浮動面板排列方式見[面板指南](tour.md#panels)。

### 檢視配額和記憶體 {#檢視配額和記憶體}

預設版面不包含 **訂閱額度**。加入後可檢視到期時間和配額用量條；沒有配額時顯示用量。

**記憶體** 預設使用圖表，**迷你折線圖** 提供數值卡片。浮動面板的中尺寸顯示常駐記憶體，以及 cgroup 用量與上限；大尺寸才顯示圖表。用量條使用 cgroup 用量，上限為零或缺失時不顯示。介面區分未回報上限和未設定上限，**鍵值清單** 會指出已回報的 OOM 終止次數。

### 選擇尺寸 {#選擇尺寸}

儀表板寬度從五分之一到全寬。累計流量、DNS 和網路分布最多占半寬；群組切換器最多占三分之二。已儲存但不支援的尺寸會調整為最接近的可用尺寸。面板的指標元件不提供內容重複的大尺寸。

較大的卡片顯示更多細節：圖表和寬指標清單在三分之二寬時顯示峰值及平均值，至少四列的寬清單分為兩欄，節點延遲在半寬時增加範圍。大環圈圖擴大圓環並縮窄圖例，大尺寸面板環圈圖顯示全部項目。窄圖例保留名稱、數值和占比。小尺寸面板通知占整列，小尺寸節點延遲顯示名稱及數值。

長名稱會換行，通知高度隨內容增長，DNS 和網路分布顯示全部類別。窄面積圖隱藏重疊的時間標籤。迷你圖在第二個樣本到達前顯示基線。

<a id="主題與配色"></a>


## 瀏覽器中儲存的設定 {#theme-gallery}

查看[配色圖集](/doona/screenshots/palettes.webp)，再調整[外觀設定](config-and-settings.md#appearance)。

語言、外觀、日期與時間格式、啟動頁面和探測偏好都在[設定](config-and-settings.md#settings-page)中調整。瀏覽器偏好、已儲存組態和後端暫時變更的區別見[變更的儲存位置](what-doona-can-change.md)。

本站的 `localStorage` 儲存連線設定檔、權杖、偏好和版面配置。清除瀏覽器資料會刪除這些瀏覽器內的值，不會刪除 honk 設定。`sessionStorage` 儲存每個分頁的狀態，例如各分區最後開啟的頁面。權杖透過 `Authorization` 請求標頭傳送；配對連結 URL 片段中的權杖會在載入時移除。

透過 HTTPS 或 localhost 存取時，service worker 會快取應用程式介面、字型和圖示，供離線開啟介面及安裝為應用程式。API 回應不會快取。已儲存的主題和語言在首次繪製前生效。驗證前不會下載其他頁面，安裝更新會重用頁面已有的檔案。

安全漏洞回報方式見 [SECURITY.md](https://github.com/Zakkaus/doona/blob/main/.github/SECURITY.md)。

</div>
