# 服務管理

請先完成 dae 設定，再選擇系統使用的服務管理器。頁面預設選中 sudo 標籤。

| 安裝方式 | 服務管理器 | 設定檔／前提 |
| --- | --- | --- |
| Arch Linux | systemd | `/etc/dae/config.dae` |
| Debian | systemd | `/etc/dae/config.dae` |
| Ubuntu | systemd | `/etc/dae/config.dae` |
| Fedora | systemd | `/etc/dae/config.dae` |
| RHEL | systemd | `/etc/dae/config.dae` |
| openSUSE | systemd | `/etc/dae/config.dae` |
| Gentoo | systemd 或 OpenRC | `/etc/dae/config.dae` |
| NixOS | systemd | 開機啟動由 [NixOS 模組](/zh-TW/dae/installation/nix) 管理 |
| Alpine（dae-installer） | OpenRC | `/usr/local/etc/dae/config.dae` |
| 手動安裝 | 取決於安裝的服務 | 需先安裝對應的服務檔案 |
| Docker | 不適用本頁命令 | 請參閱對應平臺教學 |
| macOS 主機 | 不適用本頁命令 | 請參閱對應平臺教學 |

按需選擇以下操作，無需依次執行。

<!-- shared-service-actions:start -->
## 立即啟動並設為開機啟動

::: code-group

```shell [systemd · sudo]
sudo systemctl enable --now dae
```

```shell [systemd · root]
systemctl enable --now dae
```

```shell [OpenRC · sudo]
sudo rc-service dae start
sudo rc-update add dae default
```

```shell [OpenRC · root]
rc-service dae start
rc-update add dae default
```

:::

## 立即啟動

::: code-group

```shell [systemd · sudo]
sudo systemctl start dae
```

```shell [systemd · root]
systemctl start dae
```

```shell [OpenRC · sudo]
sudo rc-service dae start
```

```shell [OpenRC · root]
rc-service dae start
```

:::

## 開機啟動

設定開機啟動不會立即啟動服務。

::: code-group

```shell [systemd · sudo]
sudo systemctl enable dae
```

```shell [systemd · root]
systemctl enable dae
```

```shell [OpenRC · sudo]
sudo rc-update add dae default
```

```shell [OpenRC · root]
rc-update add dae default
```

:::

## 重新載入設定

修改設定檔後，重新載入正在執行的 dae 服務。

OpenRC 服務指令碼未定義 reload 動作。服務執行時，使用 dae 自帶的重新載入命令。

::: code-group

```shell [systemd · sudo]
sudo systemctl reload dae
```

```shell [systemd · root]
systemctl reload dae
```

```shell [OpenRC · sudo]
sudo dae reload
```

```shell [OpenRC · root]
dae reload
```

:::

## 重新啟動服務

重新啟動會停止並再次啟動 dae，中斷現有連線。套用設定變更時，可使用上方的重新載入命令。

::: code-group

```shell [systemd · sudo]
sudo systemctl restart dae
```

```shell [systemd · root]
systemctl restart dae
```

```shell [OpenRC · sudo]
sudo rc-service dae restart
```

```shell [OpenRC · root]
rc-service dae restart
```

:::
<!-- shared-service-actions:end -->

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
