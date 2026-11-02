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

先檢查 [honk 指南中的核心與主機要求](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#linux-内核要求)。首次啟動時保留主控台存取方式。下載前準備好 `curl`、CA 憑證、`tar` 和 `sha256sum`。

### 1. 選擇並下載後端建置版本 {#1-選擇並下載後端建置版本}

開啟 [honk 發行頁](https://github.com/daeuniverse/honk/releases)，選擇適合閘道器的 `full` 或 `native-api` 壓縮檔，並複製下載連結。`clash-api` 版本無法提供 doona 所需的原生 API。後端有獨立的版本號，不要用 doona 的版本號拼接 honk 下載位址。

```sh
uname -m
```

| 選項 | 選擇方式 |
| --- | --- |
| CPU | 依照 `uname -m` 的結果選擇 `x86_64` 或 `aarch64`。 |
| C 函式庫 | 閘道器使用靜態連結的 `musl` 建置版本，包括 OpenWrt 和 Alpine。 |
| API 版本 | `full` 包含原生 API 和內嵌 UI；`native-api` 可提供單獨安裝的 UI 檔案。 |
| 記憶體配置器 | `-stock` 使用系統配置器；不帶此後綴的建置版本使用 mimalloc。 |

在閘道器上的新下載目錄中執行以下命令，並在提示後貼上壓縮檔的下載連結：

```sh
printf 'honk archive URL: '
read -r HONK_URL
```

在同一 shell 中下載壓縮檔與該次發行的檢查碼檔案：

```sh
HONK_ARCHIVE=${HONK_URL##*/}
curl -fL -O "$HONK_URL" -O "${HONK_URL%/*}/SHA256SUMS"
```

### 2. 驗證並解壓縮 {#2-驗證並解壓縮}

```sh
awk -v file="$HONK_ARCHIVE" '$2 == file' SHA256SUMS | sha256sum -c -
```

所有選定檔案都顯示 `OK` 後才能繼續。如果驗證失敗或找不到檢查碼項目，先核對檔名並重新下載，再安裝。

```sh
tar -xzf "$HONK_ARCHIVE"
HONK_PACKAGE=${HONK_ARCHIVE%.tar.gz}
```

### 3. 安裝執行檔 {#3-安裝執行檔}

首次安裝時選擇適合目前 shell 的分頁。更新現有安裝時，先依照[服務管理](service-management.md)停止服務，再替換執行檔。

::: code-group

```sh [sudo]
sudo install -d /usr/local/bin
sudo install -m 0755 "$HONK_PACKAGE/honk-core" /usr/local/bin/honk-core
/usr/local/bin/honk-core --version
```

```sh [root]
install -d /usr/local/bin
install -m 0755 "$HONK_PACKAGE/honk-core" /usr/local/bin/honk-core
/usr/local/bin/honk-core --version
```

```sh [OpenWrt]
cp "$PWD/$HONK_PACKAGE/honk-core" /usr/bin/honk-core
chmod 0755 /usr/bin/honk-core
/usr/bin/honk-core --version
```

:::

確認版本命令成功執行。保留下載的發行版本名稱，供日後核對。

更新時保留現有組態，並[重新啟動服務](service-management.md)。確認啟動日誌顯示已安裝的引擎版本。

從發行版指南進入本節的讀者，請返回原頁繼續。

### 改用原始碼建置 {#改用原始碼建置}

先依照 [honk 原始碼建置指南](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#从源码构建)準備工具鏈、建置 eBPF 並檢查 BTF。在 honk 儲存庫根目錄，將最後的 honk-core 建置命令替換為：

```sh
cargo build --release -p honk-core --features ebpf,native-api
```

`ebpf` 提供實際資料路徑，`native-api` 提供 doona 所需的 API。將 `target/release/honk-core` 安裝到上文的執行檔路徑。發行的執行檔已嵌入 eBPF 物件，無需單獨安裝物件檔案。

## 安裝故障 {#安裝故障}

| 錯誤 | 處理方式 |
| --- | --- |
| 下載時傳回 HTTP 404 | 核對發行標籤和完整檔名。從對應發行頁複製下載連結，不要自行拼接未經核實的檔名。 |
| 啟動 honk 時出現 `GLIBC_* not found` | 所選 gnu 建置版本需要更新的 glibc。改用 honk 發行頁中對應的靜態 musl 建置版本。 |
| BusyBox 拒絕 `--ignore-missing` | BusyBox `sha256sum` 不支援該選項。使用這些安裝指南中的逐檔 `awk` 和 `sha256sum -c -` 命令，確認選定檔案顯示 `OK`。 |


## 依規則需要安裝 geodata {#directories-and-geodata}

新增 Geo 規則前，先檢查 [geodata 要求](feature-requirements.md#req-geodata)。

使用[設定](configuration.md#config)中指定的資料目錄。採用 systemd 指南中的 `/var/lib/honk` 目錄時，執行：

```sh
sudo install -d -m 0700 /var/lib/honk
sudo curl -fL --retry 3 -o /var/lib/honk/geosite.dat \
  https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geosite.dat
sudo curl -fL --retry 3 -o /var/lib/honk/geoip.dat \
  https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geoip.dat
```

使用 root shell 時省略 `sudo`。OpenWrt 請使用[對應的 geodata 步驟](install-openwrt.md#install-geodata)。後續更新及其條件見 [geodata 更新](feature-requirements.md#req-geodata-update)。


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

使用 `http://owrt.lan:9527/ui/` 時，在現有 `experimental.native_api` 區塊內新增以下項目，保留其他設定與允許清單項目：

```dae
allowed_hosts: 'owrt.lan:9527'
allow_origins: 'http://owrt.lan:9527'
```

`allowed_hosts` 填主機名稱和連接埠，不帶協定或路徑。`allow_origins` 填協定、主機名稱和連接埠，不帶路徑或末尾斜線。多個項目分別加引號，再用逗號分隔，例如 `allowed_hosts: 'owrt.lan:9527', 'router.lan:9527'`。不要使用 JSON 方括號，也不要用一對引號包住整份清單。允許 Host 不會自動允許其 Origin。

如果 HTML 能開啟，但 JavaScript 或 CSS 傳回 403，在瀏覽器開發者工具的網路面板中檢查失敗的請求。將 Host、Origin 及其連接埠與允許清單逐項比較。修改後[重新啟動 honk](what-doona-can-change.md#restart-native)，再重新載入頁面。

### 靜態伺服器與反向代理 {#靜態伺服器與反向代理}

靜態伺服器可以在網站根目錄或 `/ui/` 等路徑前綴下提供解壓縮後的 UI 檔案。doona 使用 `/ui/#/activity` 這樣的 hash 路由，無需設定 SPA 重寫規則。

反向代理必須將精確路徑 `/api` 的 discovery 請求和 `/api/` 下的請求都轉送到 honk 監聽位址。只轉送 `/api/` 會遺漏 discovery，導致無法連線。

如果連線位址帶有 `/gateway` 等代理前綴，將 `/gateway/api` 轉送到 honk 的 `/api`，將 `/gateway/api/…` 轉送到 `/api/…`。兩個路由必須採用相同的前綴對應方式。


## 維護安裝 {#operation}


### 重新載入或重新啟動 {#reload-and-restart}

先查[doona 可以變更什麼](what-doona-can-change.md)，確定修改如何生效，再執行[服務管理](service-management.md)中的命令。

### 更新 UI {#更新-ui}

使用外部 UI 目錄時，沿用原安裝方式安裝新版套件或壓縮檔。在已設定的目錄中替換檔案後，只需重新載入瀏覽器頁面。

使用 `ui: embedded` 時，安裝獨立 UI 套件不會替換內嵌介面。可以依照[安裝 honk](#install)更新到包含新版 UI 的 honk 建置版本，也可以單獨安裝 UI 檔案，再將 [`ui`](configuration.md#config) 改為對應目錄。兩種方式都需要重新啟動 honk，然後重新載入瀏覽器頁面。

安裝介面檔案後，套用本頁開頭的組態，[重新啟動 honk](service-management.md)，再按[首次登入](first-sign-in.md)操作。

</div>
