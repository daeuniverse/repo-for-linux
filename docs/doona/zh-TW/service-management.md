---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 服務管理 {#title-服務管理}

按[快速入門](quick-start.md)或[獨立介面設定](install.md)設定 honk，再依本頁管理手動安裝的服務及查看日誌。若從軟體源安裝，請改用[軟體源的服務說明](/zh-TW/openwrt/)，不要建立第二個服務。

## 1. 建立服務 {#1-建立服務}

選擇目前服務管理員對應的部分。已有 honk 服務時，替換前先檢查執行檔與設定路徑。以下範例使用本站安裝指南中的路徑。

### systemd {#systemd}

在閘道器上執行。使用 root shell 時省略 `sudo`。此單元使用 `/usr/local/bin/honk-core` 和 `/etc/honk/config.dae`。

```sh
sudo install -d -m 0700 /var/lib/honk
sudo tee /etc/systemd/system/honk-core.service > /dev/null <<'EOF'
[Unit]
Description=honk transparent proxy engine
Wants=network-online.target
After=network-online.target

[Service]
Type=notify
User=root
WorkingDirectory=/var/lib/honk
ExecStart=/usr/local/bin/honk-core --config /etc/honk/config.dae --disable-timestamp
ExecReload=/usr/local/bin/honk-core reload
Restart=on-failure
RestartSec=2s
TimeoutStopSec=30s
LimitNOFILE=1048576
LimitMEMLOCK=infinity
UMask=0077

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
```

此單元依據 [honk 的 systemd 範例](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#使用-systemd-运行)。為服務新增權限限制前，先檢查該指南。

### OpenWrt procd {#openwrt-procd}

在路由器上以 root 執行。此指令稿使用 `/usr/bin/honk-core`，以及 [OpenWrt 安裝](install-openwrt.md#install-geodata)中準備的資料目錄。

```sh
cat > /etc/init.d/honk-core <<'EOF'
#!/bin/sh /etc/rc.common

START=99
STOP=10
USE_PROCD=1

start_service() {
    procd_open_instance
    procd_set_param command /usr/bin/honk-core --config /etc/honk/config.dae --data-dir /etc/honk/data --disable-timestamp
    procd_set_param limits nofile="1048576 1048576"
    procd_set_param env MIMALLOC_PURGE_DELAY=0
    procd_set_param respawn
    procd_set_param stdout 1
    procd_set_param stderr 1
    procd_close_instance
}

reload_service() {
    /usr/bin/honk-core reload
}
EOF
chmod 0755 /etc/init.d/honk-core
```

`MIMALLOC_PURGE_DELAY=0` 要求 mimalloc 立即回收釋放的記憶體頁。說明見 [honk CLI 參考](https://github.com/daeuniverse/honk/blob/main/doc/zh/reference/cli.md)。

## 2. 啟用並啟動 honk {#2-啟用並啟動-honk}

::: code-group

```sh [systemd]
sudo systemctl enable --now honk-core
sudo systemctl status honk-core
```

```sh [OpenWrt]
/etc/init.d/honk-core enable
/etc/init.d/honk-core start
/etc/init.d/honk-core status
```

:::

systemd 狀態應顯示 `active (running)`；OpenWrt 狀態應顯示 `running`。按[快速入門](quick-start.md)開啟 doona，確認監聽位址可以存取。

在本次啟動日誌中確認 `native API listener ready` 和 `honk-core is running`。存取 API 監聽位址的 `/api` 路徑時，若 JSON 回應的 `auth` 物件中 `setup_required` 為 `true`，表示 API 可存取且尚未建立管理員。僅能存取 API，不代表實際 eBPF 後端能夠路由流量。

即使 honk 啟動成功，也須閱讀啟動診斷：解析器會對 `global` 中未知的純量鍵發出警告並忽略它們。

## 查看日誌 {#查看日誌}

::: code-group

```sh [systemd]
sudo journalctl -u honk-core -e
```

```sh [OpenWrt]
logread -e honk-core
```

:::

持續查看新訊息時，systemd 使用 `sudo journalctl -u honk-core -f`，OpenWrt 使用 `logread -f -e honk-core`。按 Ctrl+C 停止追蹤。啟動失敗時，依據日誌中的錯誤查閱[疑難排解](troubleshooting.md#troubleshooting)。

journal 包含歷次服務運作的日誌。排查本次啟動時，從最新的 `honk-core … starting` 訊息開始查看；該訊息也會顯示引擎版本。

## 重新載入、重新啟動或停止 {#重新載入重新啟動或停止}

選擇重新載入或重新啟動前，先查[doona 可以變更什麼](what-doona-can-change.md)。執行後查看日誌，確認結果。

| 操作 | systemd | OpenWrt |
| --- | --- | --- |
| 啟動 | `sudo systemctl start honk-core` | `/etc/init.d/honk-core start` |
| 重新載入設定 | `sudo systemctl reload honk-core` | `/etc/init.d/honk-core reload` |
| 重新啟動 | `sudo systemctl restart honk-core` | `/etc/init.d/honk-core restart` |
| 停止 | `sudo systemctl stop honk-core` | `/etc/init.d/honk-core stop` |
| 停用開機啟動 | `sudo systemctl disable honk-core` | `/etc/init.d/honk-core disable` |

停用開機啟動不會停止正在運作的服務。若要讓 honk 在重新開機後保持停止狀態，須執行停止和停用兩項操作。

## 服務與重新載入故障 {#服務與重新載入故障}

| 現象或日誌訊息 | 含義與處理方式 |
| --- | --- |
| systemd 找不到 `honk-core.service` | 依照第 1 步建立服務單元並執行 `sudo systemctl daemon-reload`，再依照第 2 步啟動。 |
| 重新載入時報錯 `no running honk-core instance` | 沒有實際執行個體持有行程鎖。使用 `--mock-ebpf` 的前景行程不會持有該鎖；依照第 2 步啟動要使用的實際服務。 |
| `SIGHUP reload applied` | 新設定已套用。 |
| `SIGHUP reload rejected` | 結合 `stage` 和同時出現的錯誤，判斷新設定是否已套用；若被拒絕是因為需要重新啟動，在主機上編輯列出的設定後[重新啟動 honk](what-doona-can-change.md)。 |
| `SIGHUP reload committed with degraded datapath` | 設定已提交，但資料路徑已降級。先檢查同時出現的錯誤，再判斷服務是否正常。 |

重新載入命令成功結束，不代表新設定已套用；須查看服務日誌中的結果。

## OpenRC 或前景測試 {#openrc-或前景測試}

本頁不提供 OpenRC 服務指令稿。設定 honk 後，先停止既有執行個體，再從終端機啟動它以完成首次登入：

```sh
sudo /usr/local/bin/honk-core --config /etc/honk/config.dae
```

保持終端機開啟，依照[快速入門](quick-start.md)中的瀏覽器步驟操作。日誌顯示在終端機中，按 Ctrl+C 停止 honk。此命令不會啟用開機啟動。

啟動服務前，先停止前景程序。使用 `--mock-ebpf` 檢查啟動時，不會測試實際 eBPF 附加或路由。若原因是 `the mock eBPF backend was selected`，出現 `NFQUEUE is unavailable at startup; continuing with NFQUEUE staging disabled` 警告屬於預期行為。

</div>
