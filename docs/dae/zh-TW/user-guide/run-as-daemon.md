---
title: "作為服務執行"
---

<div v-pre lang="zh-TW">

# 作為常駐程式執行

在使用 [systemd](https://wiki.debian.org/systemd) 管理服務的發行版上，dae 可以作為常駐程式執行，並設定為開機自動啟動。

## 前提條件

### 可選的 Geo 資料檔案

為便於流量分流，dae 使用 [geoip.dat](https://github.com/v2fly/geoip/releases/latest) 和 [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest) 資料。

::: code-group

```shell [sudo]
sudo mkdir -p /usr/local/share/dae/
pushd /usr/local/share/dae/
sudo curl -L -o geoip.dat https://github.com/v2fly/geoip/releases/latest/download/geoip.dat
sudo curl -L -o geosite.dat https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat
popd
```

```shell [root]
mkdir -p /usr/local/share/dae/
pushd /usr/local/share/dae/
curl -L -o geoip.dat https://github.com/v2fly/geoip/releases/latest/download/geoip.dat
curl -L -o geosite.dat https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat
popd
```

:::

### 設定檔

> **注意**：建議將設定檔儲存在 `/etc/dae` 下。

下載範例設定檔：

::: code-group

```shell [sudo]
sudo mkdir -p /etc/dae
sudo curl -L -o /etc/dae/config.dae https://github.com/daeuniverse/dae/raw/main/example.dae
sudo chmod 600 /etc/dae/config.dae
```

```shell [root]
mkdir -p /etc/dae
curl -L -o /etc/dae/config.dae https://github.com/daeuniverse/dae/raw/main/example.dae
chmod 600 /etc/dae/config.dae
```

:::

## 下載預編譯二進位檔案

釋出版本位於 <https://github.com/daeuniverse/dae/releases>。

> **注意**：如需體驗新功能，可使用夜間（最新）建置。新變更通常透過 PR 提出，GitHub Actions 建置工作流程會提供跨平臺可執行二進位檔案。新功能有時存在缺陷，使用者需自行承擔風險。測試最新建置有助於分析功能穩定性並修復潛在問題。

夜間建置位於 <https://github.com/daeuniverse/dae/actions/workflows/build-nightly.yml>。

::: code-group

```shell [sudo]
sudo chmod +x ./dae
sudo install -Dm755 dae /usr/bin/
```

```shell [root]
chmod +x ./dae
install -Dm755 dae /usr/bin/
```

:::

```shell
# helper
dae --help
# check version
dae version
```

## 安裝服務

::: code-group

```shell [sudo]
# download the sample systemd.service
sudo curl -L -o /etc/systemd/system/dae.service https://github.com/daeuniverse/dae/raw/main/install/dae.service
```

```shell [root]
# download the sample systemd.service
curl -L -o /etc/systemd/system/dae.service https://github.com/daeuniverse/dae/raw/main/install/dae.service
```

:::

::: code-group

```shell [sudo]
sudo systemctl daemon-reload
sudo systemctl enable dae --now
sudo systemctl status dae
```

```shell [root]
systemctl daemon-reload
systemctl enable dae --now
systemctl status dae
```

:::

## 記憶體與 THP

`GOMEMLIMIT` 根據行程的 cgroup 上限計算，而不是根據服務單元的設定計算。計算時僅使用 `memory.max`，軟限制為該上限的 90%。顯式設定的 `GOMEMLIMIT` 環境變數始終優先。

隨附的服務單元已不再設定 `MemoryHigh`，因為執行期無法將其識別為記憶體上限。

如果主機將 THP（transparent huge pages）設為 `always`，即使 Go 堆中的存活物件佔用沒有增加，核心也可能使 dae 的駐留記憶體增大。

dae 在每次啟動、重新載入和復原時，都會以當前的 `disable_thp` 值為自身行程呼叫 `prctl(PR_SET_THP_DISABLE)`。`true` 傳入 1，為該行程停用 THP。預設值 `false` 傳入 0，清除該行程已有的 THP 停用狀態（包括從父行程繼承的），因此 dae 遵循系統級的 THP 設定。兩個值都不會修改 `/sys/kernel/mm/transparent_hugepage`：

```shell
global {
  disable_thp: true
}
```

## 檢查系統日誌

::: code-group

```shell [sudo]
sudo journalctl -xefu dae
```

```shell [root]
journalctl -xefu dae
```

:::

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/user-guide/run-as-daemon.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
