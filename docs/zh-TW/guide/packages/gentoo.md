# Gentoo / Calculate <Badge type="info" text="社群維護" />

Dae Universe 套件來源不提供 Gentoo 套件。Gentoo 與 Calculate 使用者可透過 [gentoo-zh overlay](https://github.com/gentoo-zh/overlay) 安裝。

套件由 Gentoo 社群維護，使用 Portage 管理。其版本與[套件列表](/zh-TW/guide/packages)中的版本各自獨立。

::: info 執行身分與架構
測試關鍵字範例適用於 amd64 系統。
:::

已設定 sudo 的一般使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。

## 1. 新增並同步 overlay

<!--@include: @/.vitepress/snippets/repositories/zh-TW/gentoo-1.md-->

## 2. 接受測試關鍵字

overlay 中的這些套件只有測試關鍵字，安裝前需要在 `package.accept_keywords` 中寫入所選軟體的設定。

如果 `/etc/portage/package.accept_keywords` 是目錄，可寫入其中的單獨檔案；如果它是檔案，則直接在該檔案中新增。

::: code-group

```text [v2rayA]
net-proxy/v2rayA::gentoo-zh ~amd64
```

```text [v2ray]
net-proxy/v2ray::gentoo-zh ~amd64
```

```text [Xray]
net-proxy/Xray::gentoo-zh ~amd64
```

```text [Juicity]
net-proxy/juicity::gentoo-zh ~amd64
```

```text [v2ray-rules-dat]
dev-libs/v2ray-rules-dat-bin::gentoo-zh ~amd64
```

:::

已全域接受 `~amd64` 的系統可略過此步驟。其他架構需先檢查所選 ebuild 的 `KEYWORDS`，再選擇對應的關鍵字。

## 3. 選擇軟體

::: code-group

```sh [v2rayA]
sudo emerge --ask net-proxy/v2rayA::gentoo-zh
```

```sh [v2ray]
sudo emerge --ask net-proxy/v2ray::gentoo-zh
```

```sh [Xray]
sudo emerge --ask net-proxy/Xray::gentoo-zh
```

```sh [Juicity]
sudo emerge --ask net-proxy/juicity::gentoo-zh
```

```sh [v2ray-rules-dat]
sudo emerge --ask dev-libs/v2ray-rules-dat-bin::gentoo-zh
```

:::

已進入 root shell 時去掉指令中的 `sudo`。

## 套件差異

| 套件 | 差異 |
| --- | --- |
| `net-proxy/juicity` | 預設只建置伺服端；需要用戶端時，啟用 `client` USE 旗標 |
| `dev-libs/v2ray-rules-dat-bin` | 安裝預先建置的規則資料檔案；`geosite` 與 `geoip` USE 旗標預設啟用 |
| Juicity-rs | overlay 未提供 ebuild |

dae 與 daed 的安裝步驟見 [dae](/zh-TW/dae/installation/gentoo) 與 [daed](/zh-TW/daed/installation/gentoo)。

### 選用：鏡像與二進位套件

::: details 鏡像與二進位套件
Distfiles 鏡像、binhost 頻道與簽章驗證的設定方法請見 [gentoo-zh overlay 文件](https://gentoozh.org/overlay/)。可用的二進位套件以[二進位套件列表](https://distfiles.gentoozh.org/packages)為準；沒有合適的二進位套件時，Portage 可以從原始碼編譯。
:::
