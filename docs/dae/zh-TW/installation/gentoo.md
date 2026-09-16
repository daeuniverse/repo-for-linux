# Gentoo / Calculate <Badge type="info" text="社群維護" />

Gentoo 使用者可透過 [gentoo-zh overlay](https://github.com/gentoo-zh/overlay/tree/master/net-proxy/dae) 安裝 `net-proxy/dae`。該套件由 Gentoo 社群維護，使用 Portage 管理。本網站的 APT/RPM 版本表對應另一個套件庫。

::: info 適用架構
測試關鍵字範例適用於 amd64 系統。
:::

已設定 sudo 的普通使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。

## 1. 新增並同步 overlay

<!--@include: @/.vitepress/snippets/repositories/zh-TW/gentoo-1.md-->

## 2. 接受測試關鍵字

使用穩定關鍵字的 amd64 系統需要在 `package.accept_keywords` 中新增以下設定。如果 `/etc/portage/package.accept_keywords` 是目錄，可寫入其中的 `dae` 檔案。如果它是檔案，則直接在該檔案中新增。

```text
net-proxy/dae::gentoo-zh ~amd64
```

已全域接受 `~amd64` 的系統可跳過此步驟。其他架構需先檢查所選 ebuild 的 `KEYWORDS`，再選擇對應的關鍵字。

## 3. 安裝 dae

::: code-group

```sh [sudo]
sudo emerge --ask net-proxy/dae::gentoo-zh
```

```sh [root]
emerge --ask net-proxy/dae::gentoo-zh
```

:::

檢查 Portage 給出的核心設定提示。設定範例位於 `/usr/share/dae/config.dae.example`。啟動前，請參考[最小設定](/zh-TW/dae/start/minimal-configuration)，完成 `/etc/dae/config.dae` 的設定。

### 可選：鏡像站與二進位套件

::: details 鏡像站與二進位套件
Distfiles 鏡像站、binhost 頻道和簽章驗證的設定方法見 [gentoo-zh overlay 文件](https://gentoozh.org/overlay/)。可用的二進位套件以[二進位套件清單](https://distfiles.gentoozh.org/packages)為準。沒有合適的二進位套件時，Portage 可以從原始碼編譯。
:::

完成[最小設定](/zh-TW/dae/start/minimal-configuration)後，請參閱[服務管理](/zh-TW/dae/start/service-management)，啟動 dae、設定開機啟動、重新載入或重新啟動服務。

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
