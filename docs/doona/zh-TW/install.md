---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 單獨安裝 doona {#title-單獨安裝-doona}

不使用 honk 內嵌的 doona 時，可單獨安裝介面檔案。內嵌介面的操作見[快速入門](quick-start.md)。

## 選擇系統 {#選擇系統}

| 系統 | 指南 |
| --- | --- |
| Debian 或 Ubuntu | [使用 APT 安裝](install-debian.md) |
| Fedora 或 RHEL | [使用 DNF 安裝](install-fedora.md) |
| Arch Linux | [透過 pacman 安裝](install-arch.md) |
| Gentoo | [透過 Portage 安裝](install-gentoo.md) |
| OpenWrt | [在路由器上手動安裝](install-openwrt.md) |
| Alpine 或其他 Linux 發行版 | [安裝壓縮檔或 Alpine 套件](install-manual.md) |

這些套件只安裝靜態網頁檔案。請另行安裝、設定並啟動後端。版本選擇見[標準版與 lite](editions.md)。

安裝介面檔案與相容的 honk 後，將以下區塊加入 honk 組態，取代原有的 `native_api` 區塊：

```dae
experimental {
    native_api {
        enabled: true
        listen: '127.0.0.1:9527'
        password_auth: true
        config_write: true
        ui: '/usr/share/doona'
    }
}
```

請使用套件中包含 `index.html` 的目錄；Debian 與 Ubuntu 使用 `/usr/share/doona-web`。手動解壓縮時，請改用解壓縮目錄。詳見[介面檔案](#doona)、[其他 API 選項](configuration.md#config)及[其他來源與反向代理](#other-origin)。


## 安裝 honk {#install}

Debian 或 Ubuntu 上執行 `sudo apt install honk`；其他系統和建置版本見 honk 的[安裝指南](/zh-TW/honk/installation/)。請選擇 `full` 或 `native-api` 建置，`clash-api` 版本無法提供 doona 所需的原生 API。

## 安裝故障 {#安裝故障}

| 錯誤 | 處理方式 |
| --- | --- |
| 下載時傳回 HTTP 404 | 核對發行標籤和完整檔名。從對應發行頁複製下載連結，不要自行拼接未經核實的檔名。 |
| BusyBox 拒絕 `--ignore-missing` | BusyBox `sha256sum` 不支援該選項。使用這些安裝指南中的逐檔 `awk` 和 `sha256sum -c -` 命令，確認選定檔案顯示 `OK`。 |

`GLIBC_*` 錯誤請依 honk 的[安裝指南](/zh-TW/honk/installation/)改用 musl 建置。核心功能缺少或啟動失敗見[執行需求](requirements.md#閘道器)和 honk 的[常見問題](/zh-TW/honk/how-to-start#常見問題)。


## 依規則需要安裝 geodata {#directories-and-geodata}

新增 Geo 規則前，先檢查 [geodata 要求](feature-requirements.md#req-geodata)。依 honk 的 [GeoIP 和 Geosite](/zh-TW/honk/how-to-start#geoip-和-geosite)將檔案安裝到 `global.data_dir` 指定的目錄。


## 安裝 UI 檔案 {#doona}

依照本頁列出的發行版指南或[手動安裝](install-manual.md)操作。將包含 `index.html` 的目錄用於 [`ui` 設定項目](configuration.md#config)：

| 安裝方式 | UI 目錄 |
| --- | --- |
| Debian 或 Ubuntu 套件 | `/usr/share/doona-web` |
| 其他套件或標準版壓縮檔安裝步驟 | `/usr/share/doona` |
| lite 壓縮檔安裝步驟 | `/usr/share/doona-lite` |

### 選用資源 {#選用資源}

| 資源 | 用途 |
| --- | --- |
| `doona-fonts` | 標準版使用的 Noto Sans TC 和 SC 字型。 |
| `doona-precompressed` | 在標準版檔案旁新增 `.br` 和 `.gz` 副本，供支援預先壓縮資源的伺服器使用。版本應與主套件一致。 |

Debian 的套件名稱為 `doona-web-fonts` 和 `doona-web-precompressed`。套件檔名見各發行版頁面；壓縮檔安裝步驟見[手動安裝](install-manual.md)。

預先壓縮資源會額外占用磁碟空間，儲存空間有限的路由器可不安裝。未安裝選用字型壓縮檔時，doona 使用後備字型，不載入選用字型檔案。但仍會請求 `fonts/README`，偵測是否已安裝字型壓縮檔。

### 本機建置與打包檔案 {#本機建置與打包檔案}

儲存庫提供 [OpenWrt、Alpine、Gentoo 和 Nix 打包檔案](https://github.com/Zakkaus/doona/blob/main/install/README.md)，尚未提交到這些發行版的儲存庫。AUR 的 `doona-bin` 打包檔案在獨立儲存庫中維護。

需要安裝到暫存目錄時，先完成[本機建置](development.md)，再從 doona 儲存庫根目錄執行以下命令，將 `/absolute/staging/path` 替換為暫存目錄。兩個目標都支援 `DESTDIR` 和 `PREFIX`；不需要字型時省略第二條命令。

```sh
make install DESTDIR=/absolute/staging/path PREFIX=/usr
make install-fonts DESTDIR=/absolute/staging/path PREFIX=/usr
```

UI 檔案會安裝到暫存目錄下的 `usr/share/doona`。


## 透過其他位址提供 UI {#other-origin}

監聽位址、UI 目錄、Host 和 Origin 的設定見[原生 API 設定](configuration.md#config)。使用主機名稱或反向代理前，檢查[登入要求](feature-requirements.md#req-sign-in)。

### 主機名稱與靜態資源 403 錯誤 {#主機名稱與靜態資源-403-錯誤}

主機名稱或其他來源遭拒時，依 honk 的 [Host 與 Origin 檢查](/zh-TW/honk/reference/experimental#host-與-origin-檢查)設定 `allowed_hosts` 和 `allow_origins`。修改後[重新啟動 honk](what-doona-can-change.md#restart-native)，再重新載入頁面。

如果 HTML 能開啟，但 JavaScript 或 CSS 傳回 403，在瀏覽器開發者工具的網路面板中檢查失敗的請求。將 Host、Origin 及其連接埠與允許清單逐項比較。

### 靜態伺服器與反向代理 {#靜態伺服器與反向代理}

靜態伺服器可以在網站根目錄或 `/ui/` 等路徑前綴下提供解壓縮後的 UI 檔案。doona 使用 `/ui/#/activity` 這樣的 hash 路由，無需設定 SPA 重寫規則。

反向代理必須將精確路徑 `/api` 的 discovery 請求和 `/api/` 下的請求都轉送到 honk 監聽位址。只轉送 `/api/` 會遺漏 discovery，導致無法連線。

如果連線位址帶有 `/gateway` 等代理前綴，將 `/gateway/api` 轉送到 honk 的 `/api`，將 `/gateway/api/…` 轉送到 `/api/…`。兩個路由必須採用相同的前綴對應方式。


## 維護安裝 {#operation}


### 重新載入或重新啟動 {#reload-and-restart}

先查 [doona 可以變更什麼](what-doona-can-change.md)，確定修改如何生效，再依 honk 的 [reload 與停止](/zh-TW/honk/how-to-start#reload-與停止)操作。

### 更新 UI {#更新-ui}

使用外部 UI 目錄時，沿用原安裝方式安裝新版套件或壓縮檔。在已設定的目錄中替換檔案後，只需重新載入瀏覽器頁面。

使用 `ui: embedded` 時，安裝獨立 UI 套件不會替換內嵌介面。可以依照[安裝 honk](#install)更新到包含新版 UI 的 honk 建置版本，也可以單獨安裝 UI 檔案，再將 [`ui`](configuration.md#config) 改為對應目錄。兩種方式都需要重新啟動 honk，然後重新載入瀏覽器頁面。

安裝介面檔案後，套用本頁開頭的組態，[重新啟動 honk](service-management.md)，再按[首次登入](first-sign-in.md)操作。

</div>
