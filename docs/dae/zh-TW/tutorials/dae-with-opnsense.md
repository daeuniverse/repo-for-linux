---
title: "OPNsense"
---

<div v-pre lang="zh-TW">

# OPNsense

dae 可在另一臺 Linux 系統上以旁路方式配合 OPNsense 使用。兩者透過乙太網路相連，可採用實體連線、Linux 橋接器或 SR-IOV。

## 介面

dae 與 OPN 之間的介面位址應與 OPN LAN 位於不同子網路。以下將該介面命名為 `wan_proxy`：

```
OPN LAN: 192.168.1.1/24
OPN wan_proxy: 192.168.2.2 Gateway Auto Detect
dae enp1s0: 192.168.2.1 Gateway 192.168.2.2
```

## 流量分流

1. 設定 GeoIP 清單

   > 在 `Firewall: Aliases: GeoIP Settings` 中新增；請參閱 [OPN 文件](https://docs.opnsense.org/manual/how-tos/maxmind_geo_ip.html)。

2. 設定 GeoIP 別名

   在 `Firewall: Aliases: Aliases` 中新增名為 `proxyip` 的別名，型別選擇 GeoIP。在 Asia 區域選擇 China，或選擇自己的國家。

3. 新增額外 IP 位址清單（可選）

   在 `Firewall: Aliases: Aliases` 中新增名為 `proxyip_ex` 的別名，型別選擇 URL Table。可新增他人維護的 IP 清單連結。清單檔案應每行包含一個以 CIDR 表示的 IP 位址。

4. 設定保留位址別名

   在 `Firewall: Aliases: Aliases` 中新增名為 `__private_network` 的別名，型別選擇 Network。新增所有保留位址，或僅添加當前網路使用的保留位址。參閱[保留 IP 位址](https://www.wikiwand.com/zh-hant/保留IP位址)。

5. 聚合上述別名

   在 `Firewall: Aliases: Aliases` 中新增名為 `proxyroute` 的別名，型別選擇 Network group。將以下別名加入該組：

   - `proxyip`
   - `proxyip_ex`（如有）
   - `__private_network`
   - 系統內建的 `__lo0_network`

6. 新增閘道

   在 `System: Gateways: Single` 中新增名為 `proxy` 的閘道：

   | 項目 | 設定 |
   | --- | --- |
   | 介面 | 與 dae 相連的 `wan_proxy` |
   | IP 位址 | dae 的 IP，按前面的範例為 `192.168.2.1` |
   | 優先順序 | 低於預設閘道；例如預設閘道為 `254` 時，此處設為 `255` |

7. 流量分流規則

   > 在 `Firewall: Rules: Floating` 中新增規則，設定如下：

   | 項目 | 設定 |
   | - | - |
   | 操作 | Pass |
   | Quick | √ |
   | 介面 | LAN |
   | 方向 | in |
   | TCP/IP 版本 | IPv4 |
   | 協定 | TCP/UDP |
   | 目的地/反轉 | √ |
   | 目的地 | proxyroute |
   | 閘道 | proxy |

   > 此外，可透過 Source/Invert 排除 LAN 裝置，使其流量不會經過 dae。

8. 允許 dae 流量進入 OPN

   > 在 `Firewall: Rules: wan_proxy` 中新建規則，保留所有預設值並儲存。

9. OPN 自身的代理（可選）

   如需代理 OPN 自身的部分流量，例如將設定備份到 Google Drive，建議在 `System: Routes: Configuration` 中新增靜態路由規則。將需代理 IP 段的閘道設為 `proxy`。不建議在浮動規則中處理 WAN 流量，否則可能形成環路。

## dae 相關設定

本節說明如何讓 DNS 請求經過 dae，以及如何排查代理正常但直連失敗的問題，不涉及 dae 設定檔的內容。`domain`、`ip` 模式，以及 `dns`、`routing` 規則的設定方法，請參閱 dae 文件。

| 模式 | DNS 與網域分流要求 |
| --- | --- |
| `domain` | DNS 請求必須經過 dae，核心側的 `domain()` 規則才會命中。DNS 請求無法經過 dae 時，對核心已發往代理出站的連線，dae 仍會用嗅探到的網域重新匹配分流規則，但要先確認該網域。確認依據是 dae 的 DNS 快取，或經 `bootstrap_resolver`（預設 `119.29.29.29:53` 和 `223.5.5.5:53`）的後臺探測。到未知網域的第一條連線沿用核心按 IP 的判定，dae 只為後續連線重新匹配分流規則 |
| `domain+` | DNS 請求必須經過 dae，核心側的 `domain()` 規則才會命中；從不重新匹配分流規則 |
| `domain++` | DNS 請求不經過 dae 時使用；用每個嗅探到的網域重新匹配分流規則，不做確認，效能不如 `domain` 模式 |
| `ip` | 不需要按網域分流時使用 |

dae 預設不開啟 DNS 監聽器，所以把 DNS 伺服器設為 dae 位址不起作用。要讓 dae 充當 DNS 伺服器，設定 `dns { bind: '192.168.2.1:53' }`。只寫 `ip:port` 僅監聽 UDP；寫 `tcp+udp://192.168.2.1:53` 則同時監聽 TCP 和 UDP。該監聽器收到的查詢使用同一套 `dns` 規則和快取。

任何模式都不會為核心已發往 `direct` 或 `block` 的連線重新匹配分流規則。使用 `domain++`，或無需按網域分流而使用 `ip` 時，可忽略以下設定。

1. DNS 轉送設定

   在 `Services: Unbound DNS: Query Forwarding` 中，將 DNS 請求轉送至指定伺服器，例如 OpenDNS 的 `208.67.222.222`。

   下一步會將該位址的閘道設為 dae，因此不要選擇上游下發的 DNS。這樣排查 DNS 問題時，仍可用 `dig` 或 `nslookup` 直接查詢上游下發的 DNS 伺服器進行測試。

2. 靜態路由設定
   > 在 `System: Routes: Configuration` 新增靜態路由規則，將網路設為 208.67.222.222/32，並將閘道設為 proxy。

完成設定後，DNS 請求會經過 dae，由 dae 劫持處理。此處設定的 DNS 伺服器不是最終查詢伺服器。dae 會按設定中的 `dns` 規則重寫目標伺服器，再發送查詢。

Unbound 轉送用戶端 DNS 請求時會附加 EDNS 參數。dae 用 65536 位元組的緩衝區讀取上游 UDP 回應，所以較大的 EDNS 回應能完整收到。對 `udp://` 和 `tcp+udp://` 上游，收到 TC=1 的回應時，dae 會改經 TCP 重試該查詢。返回給用戶端的回應超過用戶端在 EDNS0 中宣告的 UDP 大小（查詢不帶 EDNS0 時為 512 位元組）時，dae 會截斷該回應並設定 TC=1，讓用戶端改經 TCP 重試。

因此不必改用 Dnsmasq，也不必在 Unbound 中停用 EDNS。如仍要停用，在 `Services: Unbound DNS: General` 中停用 DNSSEC 支援，並寫入以下 Unbound 設定：

``` yaml
# saved as /usr/local/etc/unbound.opnsense.d/disableedns.conf
server:
    disable-edns-do: yes 
```

dae 不執行 SNAT。如果代理正常但直連失敗，請在安裝 dae 的系統中設定 NAT。

這裡的直連指 dae `routing` 中的 `direct`，不是 OPN 未分流到 dae、直接從 WAN 連接埠發出的流量。例如，按上一節的規則，OPN 會將 Steam 流量分流到 dae。即使 dae 已設定 `domain(geosite:steam@cn) -> direct`，Steam 仍可能無法正常登入或下載。

## 效能最佳化

將 OPN 與 dae 之間的 MTU 值從預設 1500 改為 9000（需修改兩個介面和中間連結），可實現更低負載。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/tutorials/dae-with-opnsense.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
