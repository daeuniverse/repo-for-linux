# 首次執行

在 [Debian / Ubuntu](./debian.md)、[Fedora / RHEL](./fedora.md) 或 [openSUSE](./opensuse.md) 上安裝 honk 套件後，依本頁設定並啟動服務。

已設定 sudo 的一般使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。

## 1. 設定 honk

首次安裝時，將以下僅直連設定儲存為目前目錄下的 `config.dae`。把 `br-lan` 替換為接收用戶端流量的 LAN 介面；只處理本機流量時，刪除 `lan_interface`。`wan_interface: auto` 跟隨 IPv4 預設路由。

```dae
global {
    wan_interface: auto
    lan_interface: br-lan
    data_dir: '/var/lib/honk'
    log_level: info
    dial_mode: domain
    auto_config_kernel_parameter: true
}

routing {
    fallback: direct
}
```

若 `/etc/honk/config.dae` 已存在，請保留並略過此步驟；否則以限制存取的權限安裝設定檔：

::: code-group

```sh [sudo]
sudo install -d -m 0700 /etc/honk /var/lib/honk
sudo install -m 0600 ./config.dae /etc/honk/config.dae
```

```sh [root]
install -d -m 0700 /etc/honk /var/lib/honk
install -m 0600 ./config.dae /etc/honk/config.dae
```

:::

請依實際網路環境編輯 `/etc/honk/config.dae`，再啟動服務。[如何開始](../how-to-start.md)列出核心需求與最小設定。

套件內含 doona。請在設定檔加入以下內容以啟用網頁介面；若已有 `experimental` 區段，將內容併入該區段：

```dae
experimental {
    native_api {
        enabled: true
        listen: '127.0.0.1:9527'
        password_auth: true
        config_write: true
        ui: 'embedded'
    }
}
```

## 2. 啟動服務

若已安裝 dae，請先停止服務並停用開機啟動，再啟動 honk：

::: code-group

```sh [sudo]
sudo systemctl disable --now dae.service
```

```sh [root]
systemctl disable --now dae.service
```

:::

::: code-group

```sh [sudo]
sudo systemctl enable --now honk.service
```

```sh [root]
systemctl enable --now honk.service
```

:::

檢查服務是否正在執行，輸出應顯示 `active (running)`：

::: code-group

```sh [sudo]
sudo systemctl status honk.service --no-pager
```

```sh [root]
systemctl status honk.service --no-pager
```

:::

若未執行，查看本次開機的最近 50 行日誌：

::: code-group

```sh [sudo]
sudo journalctl -u honk.service -b -n 50 --no-pager
```

```sh [root]
journalctl -u honk.service -b -n 50 --no-pager
```

:::

在執行 honk 的主機上開啟 <http://127.0.0.1:9527/ui/>，並於首次存取時建立管理員帳號。

## 下一步

- [首次登入](/zh-TW/doona/first-sign-in)：開啟 <http://127.0.0.1:9527/ui/>，建立管理員帳號。
- [管理節點、策略群組和規則](/zh-TW/doona/routing)：新增節點或訂閱和路由規則；在此之前所有流量直接連線。
- [疑難排解](/zh-TW/doona/troubleshooting)：無法正常運作時的檢查項目。
