---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 在 Fedora 或 RHEL 上安裝 {#title-在-fedora-或-rhel-上安裝}

透過 DNF 從 Dae Universe 套件來源安裝 doona 標準版。doona lite 請依照[壓縮檔安裝說明](install-manual.md)操作。

已設定 sudo 的一般使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。安裝後端前先檢查 [honk 的前提條件](install.md#install)。

## 1. 新增套件來源 {#1-新增套件來源}

<!--@include: @/.vitepress/snippets/repositories/zh-TW/fedora-1.md-->

## 2. 安裝網頁檔案 {#2-安裝網頁檔案}

::: code-group

```sh [sudo]
sudo dnf install doona
ls -l /usr/share/doona/index.html
```

```sh [root]
dnf install doona
ls -l /usr/share/doona/index.html
```

:::

確認最後一條命令列出 `index.html`。在[獨立介面組態](install.md)中使用該目錄。

### 選用套件 {#選用套件}

字型與預先壓縮檔案的用途見[選用資源](install.md#doona)。

| 資源 | 套件 |
| --- | --- |
| 字型 | `doona-fonts` |
| 預先壓縮的檔案 | `doona-precompressed` |

安裝所選套件；範例使用字型套件。

::: code-group

```sh [sudo]
sudo dnf install doona-fonts
```

```sh [root]
dnf install doona-fonts
```

:::

## 3. 安裝後端 {#3-安裝後端}

依照[安裝 honk](install.md#install)安裝後端後返回本頁。已有相容的 honk 時無需重複安裝。

套用[獨立介面組態](install.md)，[啟動 honk](service-management.md)，再按[首次登入](first-sign-in.md)操作。

</div>
