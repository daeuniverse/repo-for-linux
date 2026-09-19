---
title: "外部 DNS"
---

<div v-pre lang="zh-TW">

# 外部 DNS

本頁說明如何讓外部解析器（範例為 AdGuardHome）應答 dae 攔截到的全部 DNS 查詢，同時讓解析器自己的上游查詢經 dae 及其代理發出。解析器可以執行在 dae 主機上，也可以執行在區域網路內的另一臺機器上。dae 如何攔截 DNS、嗅探到的網域如何反饋給路由，見 [DNS](/zh-TW/dae/configuration/dns) 和[工作原理](/zh-TW/dae/how-it-works)。

## dae 主機上的外部 DNS

AdGuardHome 執行在 dae 主機上，中國大陸網域直接解析，其餘網域經 `dns.google` 解析：

```
Listen on: the same machine with dae, port 53.

China mainland: udp://223.5.5.5:53
Others: https://dns.google/dns-query
```

按以下方式設定 dae：

1. 在 `global` 部分填寫 `wan_interface`，讓 AdGuardHome 自己的上游查詢經 dae 離開主機，從而可以被代理。

2. 在 `routing` 部分的第一行插入以下規則。沒有這條規則，dae 會攔截 AdGuardHome 發往 `223.5.5.5` 的明文 UDP 查詢，再交回 AdGuardHome，形成環路：

   ```python
   pname(AdGuardHome) && l4proto(udp) && dport(53) -> must_direct
   ```

   保留一條讓 `dns.google` 走代理的路由規則，DoH 上游才會被代理。

3. 在 `dns` 部分把 AdGuardHome 設為所有被攔截查詢的上游：

   ```
   dns {
     upstream {
       adguardhome: 'udp://127.0.0.1:53'
     }
     routing {
       request {
         fallback: adguardhome
       }
     }
   }
   ```

4. 繫結 WAN 時，把 `/etc/resolv.conf` 指向公網解析器，例如 `nameserver 119.29.29.29`，不要指向本機的 AdGuardHome。發往 `127.0.0.1` 的查詢停留在 loopback 介面，到不了 dae。發往公網位址的查詢經網路卡離開主機，由 dae 攔截後按 `dns` 部分交給 AdGuardHome，因此 dae 能看到應答。

   重啟後，dnsmasq 等 DNS 服務通常會還原 `/etc/resolv.conf`。遇到此情況，解除安裝這些服務，或執行 `sudo chattr +i /etc/resolv.conf`。

   ::: code-group

   ```shell [sudo]
   sudo chattr +i /etc/resolv.conf
   ```

   ```shell [root]
   chattr +i /etc/resolv.conf
   ```

   :::

5. 繫結 LAN 時，區域網路用戶端發往 dae 主機自身連接埠 53 的 UDP 查詢和其它報文一樣走路由，隨後交給 `dns` 部分設定的解析器，因此 dae 能看到應答，`domain()` 規則也會匹配該用戶端的流量。也就是說，DHCP 可以直接下發 dae 主機作為 DNS 伺服器。如果希望由主機自身的解析器直接應答這類查詢而不經過 dae，用路由規則顯式表達，例如 `l4proto(udp) && dport(53) && dip(<dae 主機位址>) -> must_direct`。

6. 如果仍有 DNS 問題且沒有 warn/error 日誌，把 AdGuardHome 的監聽連接埠從 53 改開。網路卡無法關閉校驗和驗證時，另一個程式佔用連接埠 53 會破壞攔截，見 [#31](https://github.com/daeuniverse/dae/issues/31#issuecomment-1467358364)。

7. 如果使用 PVE，參見 [#37](https://github.com/daeuniverse/dae/discussions/37)。

## 區域網路內另一臺機器上的外部 DNS

AdGuardHome 執行在區域網路內的另一臺機器上：

```
Listen on: 192.168.30.3:53 (mac address: 8c:16:45:36:1c:5a)

China mainland: udp://223.5.5.5:53
Others: https://dns.google/dns-query
```

按以下方式設定 dae：

1. 在 `global` 部分填寫 `lan_interface`，讓 AdGuardHome 自己的上游查詢經過 dae，從而可以被代理。

2. 在 `routing` 部分的第一行插入以下規則，原因與本機部署相同：

   ```python
   sip(192.168.30.3) && l4proto(udp) && dport(53) -> must_direct
   # Or use MAC address if in the same link:
   # mac('8c:16:45:36:1c:5a') && l4proto(udp) && dport(53) -> must_direct
   ```

   保留一條讓 `dns.google` 走代理的路由規則。

3. 在 `dns` 部分把 AdGuardHome 設為所有被攔截查詢的上游：

   ```
   dns {
     upstream {
       adguardhome: 'udp://192.168.30.3:53'
     }
     routing {
       request {
         fallback: adguardhome
       }
     }
   }
   ```

4. 讓 DHCP 伺服器下發公網解析器作為 DNS 伺服器，不要下發 AdGuardHome 所在的機器。直接發往 `192.168.30.3` 的查詢通常在區域網路內直達，不經過 dae，dae 看不到應答；發往其他任何位址的查詢都會被 dae 攔截，經 AdGuardHome 應答，dae 能看到應答。

5. 如果仍有 DNS 問題且沒有 warn/error 日誌，把 AdGuardHome 的監聽連接埠從 53 改開，見 [#31](https://github.com/daeuniverse/dae/issues/31#issuecomment-1467358364)。

6. 如果使用 PVE，參見 [#37](https://github.com/daeuniverse/dae/discussions/37)。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/configuration/external-dns.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
