---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 快速入門 {#title-快速入門}

使用 honk 內嵌的 doona，無需另行下載介面檔案。

先檢查[閘道器需求](requirements.md)。全新後端須先按 honk 的[最小組態](/zh-TW/honk/how-to-start#最小設定)準備組態，再啟用 API。

## 1. 安裝 honk {#1-安裝-honk}

按 [honk 安裝指南](/zh-TW/honk/installation/)安裝 honk；在 OpenWrt 上可直接使用 [daeuniverse 軟體源](/zh-TW/openwrt/)。內嵌 doona 需要 `full` 建置。

## 2. 設定 honk {#2-設定-honk}

在 honk 組態加入 `native_api` 區塊，設定 `enabled: true`、`listen` 位址、`password_auth: true` 和 `config_write: true`。完整區塊（含 `ui: 'embedded'`）見 honk 的[網頁介面與 API](/zh-TW/honk/how-to-start#網頁介面與-api)；改用 doona lite 時，按 [doona lite](lite.md) 設定 `ui: 'embedded-lite'`。

[啟動或重新啟動 honk](service-management.md) 後生效。

## 3. 開啟 doona {#3-開啟-doona}

在執行 honk 的機器上開啟 <http://127.0.0.1:9527/>。

使用 OpenWrt 軟體源的預設組態時，在區域網路內的電腦上開啟 `http://<路由器 LAN IP>:9527/`，例如 <http://192.168.1.1:9527/>。請使用 IP 位址，honk 會拒絕 `openwrt.lan` 等主機名稱。

其他監聽 `127.0.0.1` 的路由器，請在電腦執行以下命令。將 `<router>` 替換為路由器的 SSH 位址，並保持連線：

```sh
ssh -L 9527:127.0.0.1:9527 root@<router>
```

在電腦開啟相同網址。首次造訪會建立管理員，詳見[首次登入](first-sign-in.md)。

</div>
