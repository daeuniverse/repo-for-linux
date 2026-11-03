---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 透過壓縮檔或在 Alpine 上安裝 {#title-透過壓縮檔或在-alpine-上安裝}

系統沒有對應套件時，可透過壓縮檔安裝 doona v0.1.0-rc.5。Alpine 使用者也可選擇[已簽署的套件](#install-alpine)。

在閘道器上開啟終端機，進入新建的下載目錄，並在同一 shell 中完成各步。使用 root shell 時省略 `sudo`。安裝後端前先檢查 [honk 的前提條件](install.md#install)。

準備好 `curl`、CA 憑證、`tar` 和 `sha256sum`。Alpine 使用者以 root 執行 `apk add curl ca-certificates`。

## 1. 選擇版本 {#1-選擇版本}

選擇一個分頁。版本差異見[版本比較](editions.md)。

::: code-group

```sh [標準版]
FILE=doona-0.1.0-rc.5.tar.gz
UI_DIR=/usr/share/doona
```

```sh [Lite]
FILE=doona-lite-0.1.0-rc.5.tar.gz
UI_DIR=/usr/share/doona-lite
```

:::

## 2. 下載並驗證 {#2-下載並驗證}

```sh
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.5
curl -fL -O "$BASE/$FILE" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
```

所有選定檔案都顯示 `OK` 後才能繼續。如果驗證失敗或找不到檢查碼項目，先核對檔名並重新下載，再安裝。

下載或執行檔出錯時，見[安裝故障](install.md#安裝故障)。

## 3. 解壓縮網頁檔案 {#3-解壓縮網頁檔案}

```sh
sudo mkdir -p "$UI_DIR"
sudo tar -xzf "$FILE" -C "$UI_DIR"
ls -l "$UI_DIR/index.html"
```

確認目錄中存在 `index.html`，再於[獨立介面組態](install.md)中使用該目錄。

### 標準版選用資源 {#標準版選用資源}

標準版的[選用資源](install.md#doona)如下。將 `FILE` 設為所選檔名，為每個所需壓縮檔各執行一次下列命令。lite 使用獨立目錄。

| 資源 | 檔名 |
| --- | --- |
| 字型 | `doona-fonts-0.1.0-rc.5.tar.gz` |
| 預先壓縮的檔案 | `doona-precompressed-0.1.0-rc.5.tar.gz` |

```sh
FILE=doona-fonts-0.1.0-rc.5.tar.gz
curl -fL -O "$BASE/$FILE"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c - &&
  sudo tar -xzf "$FILE" -C /usr/share/doona
```

透過壓縮檔安裝後，跳過 Alpine 部分，繼續安裝後端。


## Alpine 套件安裝方式 {#install-alpine}

此方式安裝標準版。準備好前述工具後，在新的下載目錄中操作。選擇名稱以 `.alpine.apk` 結尾的 Alpine 資源；OpenWrt 的 apk 檔案格式不同。

```sh
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.5
FILE=doona-0.1.0-rc.5-r0.alpine.apk
curl -fL -O "$BASE/$FILE" -O "$BASE/doona-alpine.rsa.pub" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-alpine.rsa.pub"' SHA256SUMS | sha256sum -c -
```

兩項驗證都顯示 `OK` 後，以 root 安裝已驗證的金鑰和套件。保留金鑰檔名；每次發行使用各自的金鑰。

```sh
mkdir -p /etc/apk/keys
cp "$PWD/doona-alpine.rsa.pub" /etc/apk/keys/doona-alpine.rsa.pub
apk add "./$FILE"
ls -l /usr/share/doona/index.html
```

確認最後一條命令列出 `index.html`。選用套件為 `doona-fonts-0.1.0-rc.5-r0.alpine.apk` 和 `doona-precompressed-0.1.0-rc.5-r0.alpine.apk`。安裝時修改 `FILE`，依照前述方式下載並驗證，再以 root 執行 `apk add "./$FILE"`。

不新增發行公鑰而直接安裝時，先依照上文驗證下載的套件，再以 root 執行：

```sh
apk add --allow-untrusted "./$FILE"
```

此方式跳過簽章信任檢查，因此必須保留 SHA-256 驗證步驟。

安裝選用套件時，沿用主套件所選的公鑰驗證或直接安裝方式。

## 安裝後端 {#安裝後端}

依照[安裝 honk](install.md#install)安裝後端後返回本頁。已有相容的 honk 時無需重複安裝。

OpenRC 系統可使用[服務管理](service-management.md)中的前景命令完成首次連線；該頁不設定 OpenRC 服務。

套用[獨立介面組態](install.md)，[啟動 honk](service-management.md)，再按[首次登入](first-sign-in.md)操作。

</div>
