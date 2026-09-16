---
title: DNS 與保留位址
---

# DNS 與保留位址

## dae 如何攔截 DNS

dae 只處理兩類封包：經它路由的包（LAN 介面 ingress）和從本機發出的包（WAN 介面 egress）。其中目的地連接埠為 53 的 UDP 和 TCP 流量，先標記為 DNS 查詢，再經過 routing 規則。除了命中 `must_direct` 的流量，其餘都交給 DNS 模組。僅寫 `direct` 不能讓 DNS 繞過 dae，隨附設定裡保留位址的 `dip(geoip:private) -> direct` 也不能。

三種流量不會進入 DNS 模組：

- 命中 `must_direct` 的流量。
- 區域網路用戶端發往 dae 主機自身 socket 的 UDP 查詢，例如本機監聽連接埠 53 的 dnsmasq。這類查詢在路由之前就交給該 socket。發往同一 socket 的 TCP 查詢沒有這個例外，仍會經過路由。
- 經 loopback 介面的查詢。dae 只掛在 LAN 和 WAN 介面上。

dae 不重組 IP 分片。它只處理封包的第一個分片，後續分片原樣放行，因此被分片的 UDP DNS 報文無法被正確攔截。

## `dns` 段決定查詢去向

攔截後的查詢按 `dns.routing.request` 選擇上游。命中的上游負責應答，原目的位址收不到這條查詢。只有內建出站 `asis` 會向原請求的目的位址查詢，而且總是用 UDP，即使用戶端是用 TCP 發起的。

收到截斷回應（`TC=1`）時，`udp://` 和 `tcp+udp://` 上游會透過 TCP 重試。`asis` 不重試：dae 丟棄伺服器的回應，改為回覆一條 ID 和問題相同、`TC=1`、Answer 段為空的回應，由用戶端決定是否通過 TCP 重試。

因為 dae 會接管所有經它路由出去的 DNS 查詢，所以區域網路裝置的 DNS 伺服器填任意公網位址即可。使用 `asis` 時，不要讓區域網路裝置把 dae 自身的連接埠 53 當作 DNS 伺服器，否則查詢會在 dae 與自身之間形成環路。設定 `dns.bind`（例如 `'127.0.0.1:5353'`）後，dae 還會在該位址監聽 DNS 查詢。

`domain()` 路由規則依賴 dae 看到的 DNS 應答。如果為區域網路用戶端應答的解析器自己的上游查詢走了 `must_direct`，dae 看不到這些應答，也就學不到返回 IP 對應的網域，`domain()` 規則不會匹配用戶端的流量。

## `bootstrap_resolver`

三類查詢由 dae 直接發往 `global.bootstrap_resolver`，不經過代理：

- `dns.upstream` 中非 IP 字面量的主機名稱。
- `dial_mode: domain`（預設值）對嗅探到的網域執行的後臺真實網域探測。
- 啟用內部 DNS 路由後，沒有被 `sub()`、`node()` 或 `subnode()` 規則指定上游的訂閱和節點主機名稱。

未設定時，dae 先使用 `119.29.29.29:53`，再使用 `223.5.5.5:53`。設定該選項會替換這兩個預設值，上游範例如下：

```shell
global {
  bootstrap_resolver: '9.9.9.9:53'
}
```

## 保留位址預設直連

隨附的 `example.dae` 與上游最小設定都包含以下規則，讓發往保留位址的流量直連。內建集合 `geoip:private` 包含 RFC 1918 私有位址、環回位址和連結本機位址等。

```shell
dip(geoip:private) -> direct
```

這是隨附設定的預設行為，不是 eBPF 資料面或控制平面中硬編碼的排除邏輯。刪除這條規則後，這些位址便不再保證直連，流量會按其餘路由規則處理，可能進入代理。這條規則也不影響 DNS：發往保留位址連接埠 53 的查詢仍會交給 DNS 模組。

詳細設定請參閱 [DNS 設定](/zh-TW/dae/configuration/dns)與[路由設定](/zh-TW/dae/configuration/routing)。
