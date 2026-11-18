---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 在 OpenWrt 上安裝 {#title-在-openwrt-上安裝}

在 OpenWrt 路由器上安裝 doona v0.1.0-rc.6 和 honk。所有命令均在路由器的 root shell 中執行，安裝期間保持同一 shell。

## 從 daeuniverse 軟體源快速安裝 {#從-daeuniverse-軟體源快速安裝}

支援的 64 位元 OpenWrt 或 ImmortalWrt 25.12 路由器可從 [daeuniverse 軟體源](/zh-TW/openwrt/)安裝 honk；軟體源的套件和服務見 honk 的 [OpenWrt 安裝](/zh-TW/honk/how-to-start#openwrt)。再按[快速入門](quick-start.md)設定內嵌的 doona。下文是從壓縮檔手動安裝的備選方式，適用於軟體源不支援的路由器，請擇一使用。

## 1. 檢查路由器並準備工具 {#1-檢查路由器並準備工具}

檢查安裝檔案與下載目錄所需的空間：

```sh
df -h / /tmp
```

OpenWrt 25.12 使用 apk-tools 3；OpenWrt 24.10 及更早版本使用 opkg 和 ipk 套件。依路由器的套件管理員安裝下載工具：

::: code-group

```sh [apk]
apk update
apk add curl ca-bundle
```

```sh [opkg]
opkg update
opkg install curl ca-bundle
```

:::

核心、BTF、cgroup 和核心模組要求見 honk 的 [Linux 核心要求](/zh-TW/honk/how-to-start#linux-核心要求)和 [OpenWrt 安裝](/zh-TW/honk/how-to-start#openwrt)。有對應的 doona 套件，不代表路由器可以執行 honk。

## 2. 下載並驗證 doona {#openwrt-packages}

以下套件安裝標準版。lite 請使用[手動安裝](install-manual.md)中的壓縮檔方式，省略 `sudo`，然後返回第 4 步。

下載至 `/tmp/doona`，依韌體使用的格式選擇套件。OpenWrt apk 套件與 Alpine 套件不同。

`/tmp` 使用記憶體，重新啟動後會清空。下載 honk 時，必須預留同時存放壓縮檔與解壓縮目錄的空間。

```sh
mkdir -p /tmp/doona
cd /tmp/doona
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.6
```

::: code-group

```sh [apk]
FILE=doona-0.1.0_rc6-r1.apk
curl -fL -O "$BASE/$FILE" -O "$BASE/doona-openwrt.adb" \
  -O "$BASE/doona-openwrt.pem" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-openwrt.adb"' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-openwrt.pem"' SHA256SUMS | sha256sum -c -
```

```sh [opkg]
FILE=doona_0.1.0-rc.6-1_all.ipk
curl -fL -O "$BASE/$FILE" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
```

:::

所有選定檔案都顯示 `OK` 後才能繼續。如果驗證失敗或找不到檢查碼項目，先核對檔名並重新下載，再安裝。

下載或執行檔出錯時，見[安裝故障](install.md#安裝故障)。

## 3. 安裝套件 {#3-安裝套件}

使用 apk 時，安裝已驗證的公開金鑰，並透過已簽署的索引安裝。索引與套件檔案應放在同一目錄。

::: code-group

```sh [apk]
mkdir -p /etc/apk/keys
cp /tmp/doona/doona-openwrt.pem /etc/apk/keys/doona-openwrt.pem
apk add -X /tmp/doona/doona-openwrt.adb doona
```

```sh [opkg]
opkg install "/tmp/doona/$FILE"
```

:::

沒有發行公鑰和索引時，可以直接安裝已驗證的本機 apk：

```sh
apk add --allow-untrusted "/tmp/doona/$FILE"
```

此方式跳過簽章信任檢查，因此使用前必須驗證套件對應的 SHA-256 項目。

```sh
ls -l /usr/share/doona/index.html
```

確認最後一條命令列出 `index.html`。在[獨立介面組態](install.md)中使用此目錄。

### 選用套件 {#選用套件}

依需要選擇[選用資源](install.md#doona)。將選定檔案下載至 `/tmp/doona`，並如第 2 步使用 `SHA256SUMS` 中對應的項目驗證。

| 套件 | apk 檔名 | opkg 檔名 |
| --- | --- | --- |
| `doona-fonts` | `doona-fonts-0.1.0_rc6-r1.apk` | `doona-fonts_0.1.0-rc.6-1_all.ipk` |
| `doona-precompressed` | `doona-precompressed-0.1.0_rc6-r1.apk` | `doona-precompressed_0.1.0-rc.6-1_all.ipk` |

使用 apk 時，將安裝命令中的 `doona` 改為所選套件名後執行。使用 opkg 時，將 `FILE` 設為所選檔名，再執行安裝命令。

## 4. 安裝 honk {#4-安裝-honk}

手動方式請依 honk 的 [OpenWrt 安裝](/zh-TW/honk/how-to-start#openwrt)將 musl 建置版本安裝至 `/usr/bin/honk-core`，再返回本頁。使用軟體源時，依其中的 `apk add honk@daeuniverse` 操作。

確認已安裝的執行檔正常後，使用絕對路徑刪除其下載壓縮檔和解壓縮目錄。選定的選用 UI 套件全部安裝完成後，再使用絕對路徑刪除 `/tmp/doona` 中下載的套件、索引、公鑰副本與檢查碼檔案。保留仍需用於安裝的下載檔案。

## 5. 準備資料目錄 {#install-geodata}

在 honk 組態中將 `global.data_dir` 設為 `/etc/honk/data`，並依 honk 的 [GeoIP 和 Geosite](/zh-TW/honk/how-to-start#geoip-和-geosite)安裝 geodata。僅在規則需要時下載，具體條件見 [geodata 要求](feature-requirements.md#req-geodata)。

## 在 sysupgrade 後保留設定 {#在-sysupgrade-後保留設定}

依 honk 的[使用 OpenWrt procd 執行](/zh-TW/honk/how-to-start#使用-openwrt-procd-執行)將 `/etc/honk/` 和 init 指令稿加入 sysupgrade 備份清單。

升級後重複第 1–3 步，重新安裝下載工具和 UI 套件，再按第 4 步重裝 honk。保留已復原的組態與資料，再[啟用並啟動服務](service-management.md)。

檢查 honk 的[讀取服務日誌](/zh-TW/honk/how-to-start#讀取服務日誌)，再按[首次登入](first-sign-in.md)操作。

</div>
