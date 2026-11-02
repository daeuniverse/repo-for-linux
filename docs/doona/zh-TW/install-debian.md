---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 在 Debian 或 Ubuntu 上安裝 {#title-在-debian-或-ubuntu-上安裝}

透過 APT 從 Dae Universe 套件來源安裝 doona 標準版。doona lite 請依照[壓縮檔安裝說明](install-manual.md)操作。

已設定 sudo 的一般使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。安裝後端前先檢查 [honk 的前提條件](install.md#install)。

## 1. 安裝 curl {#1-安裝-curl}

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-1.md-->

## 2. 新增套件來源 {#2-新增套件來源}

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-2.md-->

## 3. 匯入 GPG 公鑰 {#3-匯入-gpg-公鑰}

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-3.md-->

## 4. 安裝網頁檔案 {#4-安裝網頁檔案}

::: code-group

```sh [sudo]
sudo apt update
sudo apt install doona-web
ls -l /usr/share/doona-web/index.html
```

```sh [root]
apt update
apt install doona-web
ls -l /usr/share/doona-web/index.html
```

:::

確認最後一條命令列出 `index.html`。在[獨立介面組態](install.md)中使用該目錄。

Debian 套件名為 `doona-web`。不要改用 `apt install doona`，Debian 和 Ubuntu 中的這個名稱屬於另一個套件。

### 復原被 Debian 同名套件替換的 UI {#復原被-debian-同名套件替換的-ui}

如果 `apt upgrade` 將舊 `doona` 網頁套件替換成無關的網路模糊測試工具，導致 UI 消失：

1. 依照上文安裝 `doona-web`，需要字型時再依照下文安裝 `doona-web-fonts`。新套件宣告替換或衝突的舊網頁套件版本範圍為低於 1.0。
2. 將現有 [`ui` 設定項目](configuration.md#config)改為 `/usr/share/doona-web`，再[重新啟動 honk](service-management.md)並重新載入瀏覽器頁面。
3. 如果仍安裝了無關的 `doona`，執行 `sudo apt remove doona`。這會保留 `doona-web`。

### 選用套件 {#選用套件}

字型與預先壓縮檔案的用途見[選用資源](install.md#doona)。

| 資源 | 套件 |
| --- | --- |
| 字型 | `doona-web-fonts` |
| 預先壓縮的檔案 | `doona-web-precompressed` |

安裝所選套件；範例使用字型套件。

::: code-group

```sh [sudo]
sudo apt install doona-web-fonts
```

```sh [root]
apt install doona-web-fonts
```

:::

## 5. 安裝後端 {#5-安裝後端}

依照[安裝 honk](install.md#install)安裝後端後返回本頁。已有相容的 honk 時無需重複安裝。

套用[獨立介面組態](install.md)，[啟動 honk](service-management.md)，再按[首次登入](first-sign-in.md)操作。

</div>
