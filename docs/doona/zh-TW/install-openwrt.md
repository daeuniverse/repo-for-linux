---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 在 OpenWrt 上安裝 {#title-在-openwrt-上安裝}

在 OpenWrt 路由器上安裝 doona v0.1.0-rc.4 和 honk。所有命令均在路由器的 root shell 中執行，安裝期間保持同一 shell。

## 從 daeuniverse 軟體源快速安裝 {#從-daeuniverse-軟體源快速安裝}

支援的 64 位元 OpenWrt 或 ImmortalWrt 25.12 路由器可從 [daeuniverse 軟體源](/zh-TW/openwrt/)安裝 honk，再按[快速入門](quick-start.md)設定內嵌的 doona。下文是從壓縮檔手動安裝的備選方式，適用於軟體源不支援的路由器。軟體源套件與手動安裝使用不同的服務名稱和資料目錄，請擇一使用。

## 1. 檢查路由器並準備工具 {#1-檢查路由器並準備工具}

下載前先檢查[後端前提條件](install.md#install)，包括核心、BTF、cgroup 和 CPU 要求。有對應的 doona 套件，不代表路由器可以執行 honk。檢查安裝檔案與下載目錄所需的空間：

```sh
uname -r
uname -m
df -h / /tmp
```

OpenWrt 25.12 使用 apk-tools 3；OpenWrt 24.10 及更早版本使用 opkg 和 ipk 套件。官方 OpenWrt 24.10 使用 [Linux 6.6](https://github.com/openwrt/openwrt/blob/openwrt-24.10/target/linux/x86/Makefile)，低於上文連結中 honk 的最低核心要求。安裝格式相符的 UI 套件不能解決這項相容性問題。

依路由器的套件管理員選擇命令。OpenWrt 提供 [veth 模組](https://github.com/openwrt/openwrt/blob/openwrt-25.12/package/kernel/linux/modules/netsupport.mk)與 [NFQUEUE 模組](https://github.com/openwrt/openwrt/blob/openwrt-25.12/package/kernel/linux/modules/netfilter.mk)套件：

::: code-group

```sh [apk]
apk update
apk add curl ca-bundle kmod-veth kmod-nft-queue
```

```sh [opkg]
opkg update
opkg install curl ca-bundle kmod-veth kmod-nft-queue
```

:::

啟用 NFQUEUE 但缺少必要條件時，honk 可能繼續運作，同時停用 NFQUEUE staging 並輸出啟動警告。檢查[服務日誌](service-management.md)；服務啟動成功不代表 NFQUEUE staging 已啟用。


## 2. 下載並驗證 doona {#openwrt-packages}

以下套件安裝標準版。lite 請使用[手動安裝](install-manual.md)中的壓縮檔方式，省略 `sudo`，然後返回第 4 步。

下載至 `/tmp/doona`，依韌體使用的格式選擇套件。OpenWrt apk 套件與 Alpine 套件不同。

`/tmp` 使用記憶體，重新啟動後會清空。下載 honk 時，必須預留同時存放壓縮檔與解壓縮目錄的空間。

```sh
mkdir -p /tmp/doona
cd /tmp/doona
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.4
```

::: code-group

```sh [apk]
FILE=doona-0.1.0_rc4-r1.apk
curl -fL -O "$BASE/$FILE" -O "$BASE/doona-openwrt.adb" \
  -O "$BASE/doona-openwrt.pem" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-openwrt.adb"' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-openwrt.pem"' SHA256SUMS | sha256sum -c -
```

```sh [opkg]
FILE=doona_0.1.0-rc.4-1_all.ipk
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
| `doona-fonts` | `doona-fonts-0.1.0_rc4-r1.apk` | `doona-fonts_0.1.0-rc.4-1_all.ipk` |
| `doona-precompressed` | `doona-precompressed-0.1.0_rc4-r1.apk` | `doona-precompressed_0.1.0-rc.4-1_all.ipk` |

使用 apk 時，將安裝命令中的 `doona` 改為所選套件名後執行。使用 opkg 時，將 `FILE` 設為所選檔名，再執行安裝命令。

## 4. 安裝 honk {#4-安裝-honk}

在另一個下載目錄中依照[安裝 honk](install.md#install)操作，避免後端的 `SHA256SUMS` 覆蓋 doona 的檔案。選擇 musl 建置版本和 OpenWrt 安裝分頁，將執行檔安裝至 `/usr/bin/honk-core`，再返回本頁。

確認已安裝的執行檔正常後，使用絕對路徑刪除其下載壓縮檔和解壓縮目錄。選定的選用 UI 套件全部安裝完成後，再使用絕對路徑刪除 `/tmp/doona` 中下載的套件、索引、公鑰副本與檢查碼檔案。保留仍需用於安裝的下載檔案。


## 5. 準備資料目錄 {#install-geodata}

手動安裝時，須在 [honk 組態](configuration.md#config)中將 `global.data_dir` 設為 `/etc/honk/data`，再建立持久儲存目錄：

```sh
mkdir -p /etc/honk/config.d /etc/honk/data
chmod 0700 /etc/honk /etc/honk/config.d /etc/honk/data
```

僅在規則需要時下載 geodata，具體條件見 [geodata 要求](feature-requirements.md#req-geodata)。採用上述目錄時執行：

```sh
curl -fL --retry 3 -o /etc/honk/data/geosite.dat \
  https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geosite.dat
curl -fL --retry 3 -o /etc/honk/data/geoip.dat \
  https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geoip.dat
```

也可以安裝發行版提供的 [v2ray geodata 套件](https://github.com/openwrt/packages/blob/openwrt-25.12/net/v2ray-geodata/Makefile)，替代上面的直接下載方式：

::: code-group

```sh [apk]
apk add v2ray-geosite v2ray-geoip
```

```sh [opkg]
opkg install v2ray-geosite v2ray-geoip
```

:::

honk 會搜尋 `/usr/share/dae`，不會直接搜尋 `/usr/share/v2ray`。先檢查 `/usr/share/dae` 中已有的檔案或連結，僅建立缺少的連結：

```sh
mkdir -p /usr/share/dae
ln -s ../v2ray/geosite.dat /usr/share/dae/geosite.dat
ln -s ../v2ray/geoip.dat /usr/share/dae/geoip.dat
```

已設定的資料目錄中若存在同名檔案，honk 會優先使用這些檔案。

請使用[服務管理](service-management.md)中的 OpenWrt 服務，而非軟體源服務。

## 在 sysupgrade 後保留設定 {#在-sysupgrade-後保留設定}

執行保留設定的一般 sysupgrade 前，將尚未列出的以下路徑加入 `/etc/sysupgrade.conf`，再檢查[備份清單](https://github.com/openwrt/openwrt/blob/openwrt-25.12/package/base-files/files/sbin/sysupgrade)：

```sh
printf '%s\n' '/etc/honk/' '/etc/init.d/honk-core' >> /etc/sysupgrade.conf
sysupgrade -l
```

確認清單包含 honk 設定、資料檔案與 init 指令稿。這份設定備份不會復原已安裝的核心模組、`/usr/bin/honk-core` 或 `/usr/share/doona`。

升級後重複第 1–4 步，重新安裝工具、核心模組、UI 套件和 honk 執行檔。若選用發行版的 geodata 套件，再按第 5 步重裝並重新建立連結。保留已復原的組態與資料，再[啟用並啟動服務](service-management.md)。

檢查[服務日誌](service-management.md)，再按[首次登入](first-sign-in.md)操作。

</div>

---

來源：[doona-docs](https://github.com/Zakkaus/doona-docs)，採用 [CC BY 4.0 授權條款](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
