# Gentoo / Calculate <Badge type="info" text="社群維護" />

Gentoo 使用者可透過 [gentoo-zh overlay](https://github.com/gentoo-zh/overlay/tree/master/net-proxy/daed) 安裝 `net-proxy/daed`。此套件由 Gentoo 社群維護，使用 Portage 管理。本網站的 APT/RPM 版本表對應另一個套件來源。

::: info 執行身分與架構
測試關鍵字範例適用於 amd64 系統。
:::

已設定 sudo 的一般使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。

## 1. 新增並同步 overlay

<!--@include: @/.vitepress/snippets/repositories/zh-TW/gentoo-1.md-->

## 2. 接受測試關鍵字

使用穩定關鍵字的 amd64 系統需要在 `package.accept_keywords` 中新增以下設定。如果 `/etc/portage/package.accept_keywords` 是目錄，可寫入其中的 `/etc/portage/package.accept_keywords/daed` 檔案；如果它是檔案，則直接在該檔案中新增。

```text
net-proxy/daed::gentoo-zh ~amd64
```

已全域接受 `~amd64` 的系統可略過此步驟。其他架構需先檢查所選 ebuild 的 `KEYWORDS`，再選擇對應的關鍵字。

## 3. 安裝 daed

::: code-group

```sh [sudo]
sudo emerge --ask net-proxy/daed::gentoo-zh
```

```sh [root]
emerge --ask net-proxy/daed::gentoo-zh
```

:::

檢查 Portage 提供的核心設定提示。`webui` USE 旗標預設啟用；本頁介紹的 daed 程式與服務要求保留該旗標。停用後安裝的是 dae-wing。

設定方法請見[上游說明](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md)。

### 選用：鏡像與二進位套件

::: details 鏡像與二進位套件
Distfiles 鏡像、binhost 頻道與簽章驗證的設定方法請見 [gentoo-zh overlay 文件](https://gentoozh.org/overlay/)。可用的二進位套件以[套件列表](https://distfiles.gentoozh.org/packages)為準；沒有合適的二進位套件時，Portage 可以從原始碼編譯。
:::

ebuild 提供 systemd 與 OpenRC 服務檔。使用 OpenRC 時，請先依安裝後的提示設定 `rc.conf` 與 `sysfs`，並重新啟動系統。接著參閱[服務管理](/zh-TW/daed/service-management)。

---

[gentoo-zh: daed ebuild](https://github.com/gentoo-zh/overlay/blob/master/net-proxy/daed/daed-1.27.0-r1.ebuild) · [OpenRC](https://github.com/gentoo-zh/overlay/blob/master/net-proxy/daed/files/daed.initd)
