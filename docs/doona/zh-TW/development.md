---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 開發 {#title-開發}

使用以下命令在本機建置與檢查 doona。應用程式位於 [Zakkaus/doona](https://github.com/Zakkaus/doona)，本文件及其網站位於 [daeuniverse/repo-for-linux](https://github.com/daeuniverse/repo-for-linux)。

提交改動前，閱讀應用程式的 [CONTRIBUTING.md](https://github.com/Zakkaus/doona/blob/main/CONTRIBUTING.md)。工具版本見[執行需求](requirements.md)。

## 建置標準版 {#建置標準版}

在 doona 應用程式儲存庫根目錄執行：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

開發伺服器使用模擬後端。停止開發伺服器後，執行建置與檢查：

```sh
pnpm build
pnpm check
pnpm check:size
```

建置產物位於 `dist/`。`check` 執行型別、lint、翻譯、格式、單元測試和產生的 API 檢查；`check:size` 測量建置產物。


## 建置 doona lite {#doona-lite}

安裝根目錄相依套件後，在同一應用程式儲存庫根目錄執行：

```sh
pnpm --dir apps/lite install --frozen-lockfile
pnpm --dir apps/lite build
pnpm --dir apps/lite check
```

建置產物位於 `apps/lite/dist/`。使用 `pnpm --dir apps/lite dev` 啟動開發伺服器。

## 執行瀏覽器測試 {#執行瀏覽器測試}

在應用程式儲存庫根目錄執行：

```sh
pnpm e2e:install --with-deps
pnpm e2e
```

第一條命令安裝瀏覽器與系統相依套件，第二條重新建置標準版並執行 Playwright 測試。

測試實際後端時，將 `DOONA_API` 設為伺服器根位址；如需驗證身分，透過 shell 環境提供 `DOONA_TOKEN`，再執行 `pnpm e2e:live`。該命令執行無障礙、手機與鍵盤測試。不要將憑證寫入命令歷史或報告。

實際後端測試禁止在 fixture 儲存資料中覆寫後端設定，並阻止包括 DNS 查詢在內的控制請求。一般的 `pnpm e2e` 會拒絕 `DOONA_API`，除非同時設定 `DOONA_LIVE_OBSERVE=1`；測試實際後端應使用 `pnpm e2e:live`。

## 擷取畫面與 API 檢查 {#擷取畫面與-api-檢查}

安裝應用程式相依套件後，在應用程式儲存庫根目錄執行以下工具。

- 擷取畫面：先安裝 Playwright 的 Chromium、`cwebp` 和 `img2webp`，再啟動使用模擬後端的預覽。執行 `node tools/screenshots.mjs <url> docs/screenshots`，將 `<url>` 替換為預覽位址。工具會產生本地化頁面、配色總覽、英文主題圖庫、手機長圖、頁面導覽靜態圖與路由動畫，格式均為 WebP。
- API 契約：執行 `node tools/conformance.mjs http://router:9527`，將位址替換為後端伺服器根位址。工具按儲存庫內的契約檢查服務探索、能力與唯讀回應，並跳過修改操作。需要身分驗證時，透過 `--token "$DOONA_TOKEN"` 從 shell 環境傳入 Token。

## 封裝兩個版本 {#封裝兩個版本}

先建置兩個版本。安裝 GNU tar、gzip、Brotli 和 sha256sum，然後在應用程式儲存庫根目錄執行：

```sh
pnpm package
```

`release/` 目錄包含標準版、lite、字型和預壓縮檔案的封存檔，以及 `SHA256SUMS`。封存檔名稱使用 `package.json` 中的版本；`pnpm package --git-version` 使用 `git describe --tags --always` 的結果，並去掉開頭的 `v`。

封存檔時間戳使用 `SOURCE_DATE_EPOCH`；未設定時，使用 HEAD 提交時間。

## 更新 API 型別 {#更新-api-型別}

[契約來源記錄](https://github.com/Zakkaus/doona/blob/main/contract/api-standardize/SOURCE.md)列出儲存庫內 API 契約的版本。更新契約後，在應用程式儲存庫根目錄執行：

```sh
pnpm gen:api
pnpm check
```

產生的型別寫入 `src/api/types.ts`。

## 檢查文件網站 {#檢查文件網站}

在文件儲存庫根目錄安裝相依套件。將 `DOONA_DIR` 設為應用程式儲存庫路徑，供檢查器核對應用程式的文件連結：

```sh
pnpm install --frozen-lockfile
DOONA_DIR=/path/to/doona pnpm -s docs:check
DOONA_DIR=/path/to/doona pnpm -s test
pnpm docs:build
```

網站建置產物位於 `dist-docs/`。

## 查找原始碼檔案 {#查找原始碼檔案}

以下路徑均相對於應用程式儲存庫根目錄。

| 路徑 | 用途 |
| --- | --- |
| `src/features/` | 頁面、功能 hooks 與訊息 |
| `src/shell/` | 應用程式外殼、導覽與搜尋 |
| `src/ui/` | 共用元件、主題與圖示 |
| `src/api/` | 用戶端、後端連線設定檔、轉接器與產生的型別 |
| `mock/` | 示範、預覽與測試後端 |
| `src/store/` | 資源監視、快取讀取與操作 hooks |
| `src/i18n/` | 翻譯與地區設定輔助函式 |
| `contract/` | 儲存庫內的 OpenAPI 契約及其固定版本 |
| `public/` | 靜態圖示、manifest 與 service worker |
| `e2e/` | 瀏覽器測試 |
| `tools/` | 建置、封裝、契約檢查與畫面擷取工具 |
| `install/` | 發行版封裝與安裝設定 |
| `docs/` | 應用程式側參考文件，包括國旗與字型說明 |
| `node_modules/@fontsource-variable/` | 安裝相依套件後供 Vite 封裝的 Noto Sans TC/SC 字型來源檔案 |

發布記錄見 [CHANGELOG.md](https://github.com/Zakkaus/doona/blob/main/CHANGELOG.md)。

</div>
