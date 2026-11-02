---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 在 Gentoo 上安裝 {#title-在-gentoo-上安裝}

將儲存庫中的 ebuild 加入本機 Portage 儲存庫，安裝 doona v0.1.0-rc.4。doona lite 請使用[手動安裝](install-manual.md)。

在閘道器上開啟終端機，進入新建的下載目錄，並在同一 shell 中完成各步。使用 root shell 時省略 `sudo`。安裝後端前先檢查 [honk 的前提條件](install.md#install)。

缺少 `net-misc/curl` 或 `app-misc/ca-certificates` 時，先安裝。下列命令使用 sudo 寫入系統目錄。

```sh
sudo emerge --ask net-misc/curl app-misc/ca-certificates
```

## 1. 準備本機儲存庫 {#1-準備本機儲存庫}

已有本機儲存庫時，將 `REPO` 設為其絕對路徑，並跳過建立命令。否則，建立名為 `doona-local` 的新儲存庫：

```sh
REPO=/var/db/repos/doona-local
sudo mkdir -p "$REPO/metadata" "$REPO/profiles" /etc/portage/repos.conf
printf '%s
' doona-local | sudo tee "$REPO/profiles/repo_name"
printf 'masters = gentoo
auto-sync = false
' | sudo tee "$REPO/metadata/layout.conf"
printf '[doona-local]
location = %s
' "$REPO" | sudo tee /etc/portage/repos.conf/doona-local.conf
portageq get_repos /
```

確認最後一條命令的輸出包含該儲存庫名稱。

## 2. 新增 ebuild {#2-新增-ebuild}

```sh
VERSION=0.1.0-rc.4
PV=0.1.0_rc4
RAW=https://raw.githubusercontent.com/Zakkaus/doona/v${VERSION}/install/gentoo/net-proxy/doona
sudo mkdir -p "$REPO/net-proxy/doona"
sudo curl -fL -o "$REPO/net-proxy/doona/doona-$PV.ebuild" "$RAW/doona-$PV.ebuild"
sudo curl -fL -o "$REPO/net-proxy/doona/metadata.xml" "$RAW/metadata.xml"
```

## 3. 驗證發行壓縮檔 {#3-驗證發行壓縮檔}

ebuild 使用程式壓縮檔，並預設啟用 `fonts` USE 旗標。在下載目錄中下載並驗證兩個壓縮檔：

```sh
BASE=https://github.com/Zakkaus/doona/releases/download/v$VERSION
curl -fL -O "$BASE/doona-${VERSION}.tar.gz" -O "$BASE/doona-fonts-${VERSION}.tar.gz" -O "$BASE/SHA256SUMS"
awk -v file="doona-${VERSION}.tar.gz" '$2 == file' SHA256SUMS | sha256sum -c -
awk -v file="doona-fonts-${VERSION}.tar.gz" '$2 == file' SHA256SUMS | sha256sum -c -
```

所有選定檔案都顯示 `OK` 後才能繼續。如果驗證失敗或找不到檢查碼項目，先核對檔名並重新下載，再安裝。

下載或執行檔出錯時，見[安裝故障](install.md#安裝故障)。

將已驗證的檔案依 ebuild 使用的名稱放入 Portage distfiles 目錄，再產生 Manifest：

```sh
DISTDIR=$(portageq distdir)
sudo install -m 0644 "$PWD/doona-${VERSION}.tar.gz" "$DISTDIR/doona-$PV.tar.gz"
sudo install -m 0644 "$PWD/doona-fonts-${VERSION}.tar.gz" "$DISTDIR/doona-$PV-fonts.tar.gz"
sudo ebuild "$REPO/net-proxy/doona/doona-$PV.ebuild" manifest
```

## 4. 接受測試關鍵字並安裝 {#4-接受測試關鍵字並安裝}

將 `=net-proxy/doona-0.1.0_rc4 ~amd64` 新增至 `package.accept_keywords` 設定，將 `~amd64` 替換為目前架構的測試關鍵字，例如 `~arm64`。如果該設定是目錄，則寫入其中的檔案。

不需要字型時，在安裝前將 `net-proxy/doona -fonts` 新增至 `package.use`。

```sh
sudo emerge --ask =net-proxy/doona-0.1.0_rc4
ls -l /usr/share/doona/index.html
```

確認最後一條命令列出 `index.html`。在[獨立介面組態](install.md)中使用該目錄。

### Portage 故障 {#portage-故障}

| 錯誤 | 檢查方式 |
| --- | --- |
| Portage 找不到 `net-proxy/doona` | 執行 `portageq get_repos /`，確認輸出列出本機儲存庫。確認 ebuild 位於該儲存庫的 `net-proxy/doona/` 目錄；儲存庫未註冊時依照第 1 步修正。 |
| 套件被 testing keyword 遮罩 | 檢查第 4 步的 `package.accept_keywords` 項目是否使用目前架構的關鍵字，例如 `~amd64` 或 `~arm64`。 |

## 5. 安裝後端 {#5-安裝後端}

依照[安裝 honk](install.md#install)安裝後端後返回本頁。已有相容的 honk 時無需重複安裝。

systemd 主機使用[服務管理](service-management.md)中的 systemd 步驟。OpenRC 主機可使用該頁的前景命令完成首次連線。

套用[獨立介面組態](install.md)，[啟動 honk](service-management.md)，再按[首次登入](first-sign-in.md)操作。

</div>

---

來源：[doona-docs](https://github.com/Zakkaus/doona-docs)，採用 [CC BY 4.0 授權條款](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
