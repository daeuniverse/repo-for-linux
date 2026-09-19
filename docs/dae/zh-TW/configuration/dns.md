---
title: "DNS"
---

<div v-pre lang="zh-TW">

# DNS

dae 會攔截所有經它路由或從本機發出、發往連接埠 53 的 UDP 和 TCP 流量，並嗅探 DNS。只有命中 `must_direct` 的流量不經過 dae；僅寫 `direct` 仍會交給 DNS 模組處理。區域網路用戶端發往 dae 主機自身 socket（例如本機監聽連接埠 53 的 dnsmasq）的查詢和其它報文一樣走路由，UDP 與 TCP 都會進入 DNS 模組。要把這類查詢直接交給該 socket（dae 看不到應答），靠的是 `must_direct` 規則，例如 `l4proto(udp) && dport(53) && dip(<dae 主機位址>) -> must_direct`。只有經 loopback 介面的查詢不會經過 dae 的任何 hook。

dae 不重組 IP 分片：只處理封包的第一個分片，後續分片原樣放行，因此被分片的 UDP DNS 報文無法被正確攔截。若為區域網路用戶端應答的解析器自己的上游查詢走了 `must_direct` 規則，dae 看不到這些應答，也就學不到返回 IP 對應的網域，`domain()` 規則不會匹配用戶端的流量。

## URI 格式

### DoH3

```
h3://<host>:<port>/<path>
http3://<host>:<port>/<path>

default port: 443
default path: /dns-query
```

### DoH

```
https://<host>:<port>/<path>

default port: 443
default path: /dns-query
```

### DoT

```
tls://<host>:<port>

default port: 853
```

### DoQ

```
quic://<host>:<port>

default port: 853
```

### UDP

```
udp://<host>:<port>

default port: 53
```

### TCP

```
tcp://<host>:<port>

default port: 53
```

### TCP 和 UDP

```
tcp+udp://<host>:<port>

default port: 53
```

對於 dae 代替用戶端轉送的查詢，收到截斷的回應（`TC=1`，RFC 1035 §4.2.1）時，dae 會按 RFC 7766 §5 的要求透過 TCP 重試。`udp://` 上游只在回應被截斷後重試；`tcp+udp://` 上游在任何 UDP 失敗後都會重試。由 `sub()`、`node()` 和 `subnode()` 選中的 dae 自身查詢在 `udp://` 上游沒有這種重試。回應被截斷時查詢直接失敗，錯誤為 `internal dns response truncated`。只有 `tcp+udp://` 上游會透過 TCP 重試這些查詢，因此預期回應較大時，這些規則應指向 `tcp+udp://` 或 `tcp://` 上游。

內建目標 `asis` 沿用用戶端所用的位址和連接埠，但不沿用用戶端的傳輸方式：dae 總是透過 UDP 查詢該伺服器，即使用戶端是透過 TCP 發起查詢。`asis` 不會透過 TCP 重試。該伺服器回覆 `TC=1` 時，dae 丟棄伺服器的回應。dae 改為根據用戶端的查詢構造一條訊息回覆用戶端：ID 和 Question 段與查詢相同，`NOERROR`、`RA=1`、`TC=1`，Answer 段為空。之後由用戶端決定是否通過 TCP 重試。其他協定仍使用各自指定的傳輸方式。

## 範例

```shell
dns {
    # For example, if ipversion_prefer is 4 and dae already knows the domain has type A records, dae returns an empty
    # answer to type AAAA queries; otherwise dae returns the AAAA answer unchanged.
    ipversion_prefer: 4

    # Give a fixed ttl for domains. Zero makes the cached answer expire immediately; with optimistic_cache (default true)
    # dae may still serve it as a stale answer while refreshing.
    fixed_domain_ttl {
        ddns.example.org: 10
        test.example.org: 3600
    }

    # Bind to local address to listen for DNS queries
    #bind: '127.0.0.1:5353'

    upstream {
        # Scheme list: tcp, udp, tcp+udp, https, tls, http3, h3, quic, details see above Schema.
        # If host is a domain and has both IPv4 and IPv6 record, dae will automatically choose
        # IPv4 or IPv6 to use according to group policy (such as min latency policy).
        # Please make sure DNS traffic will go through and be forwarded by dae, which is REQUIRED for domain routing.
        # If dial_mode is "ip", the upstream DNS answer SHOULD NOT be polluted, so domestic public DNS is not recommended.

        alidns: 'udp://dns.alidns.com:53'
        googledns: 'tcp+udp://dns.google:53'

        # alih3: 'h3://dns.alidns.com:443'
        # alih3_path: 'h3://dns.alidns.com:443/dns-query'
        # alihttp3: 'http3://dns.alidns.com:443'
        # alihttp3_path: 'http3://dns.alidns.com:443/dns-query'
        # ali_quic: 'quic://dns.alidns.com:853'

        # h3_custom_path: 'h3://dns.example.com:443/custom-path'
        # http3_custom_path: 'http3://dns.example.com:443/custom-path'

        # ali_doh: 'https://dns.alidns.com:443'
        # ali_dot: 'tls://dns.alidns.com:853'

        # doh_custom_path: 'https://dns.example.com:443/custom-path'
    }
    # The routing format of 'request' and 'response' is similar with section 'routing'.
    # See https://github.com/daeuniverse/dae/blob/main/docs/en/configuration/routing.md
    routing {
        # According to the request of dns query, decide to use which DNS upstream.
        # Match rules from top to bottom.
        request {
            # Built-in outbounds in 'request': asis, reject.
            # asis queries the server the request was addressed to, always over UDP.
            # Do not point other LAN devices at dae:53 (loop risk).
            # You can also use user-defined upstreams.

            # Available functions for ordinary DNS requests: qname, qtype.
            # Additional internal dae selectors in the same block: sub, node, subnode.
            # - sub(): subscription fetch requests
            # - node(): node host resolution requests
            # - subnode(): node host resolution requests for subscription-derived nodes
            #   and it is checked before node()
            # Internal selectors:
            # - only affect dae's own DNS lookups
            # - must target names defined in dns.upstream
            # - do not use fallback
            # - cannot be mixed with qname/qtype in the same rule

            # DNS request name (omit suffix dot '.').
            qname(geosite:category-ads-all) -> reject
            qname(geosite:google@cn) -> alidns # Also see: https://github.com/v2fly/domain-list-community#attributes
            qname(suffix: abc.com, keyword: google) -> googledns
            qname(full: ok.com, regex: '^yes') -> googledns
            # DNS request type
            qtype(a, aaaa) -> alidns
            qtype(cname) -> googledns
            # disable ECH to avoid affecting traffic split
            qtype(https) -> reject

            # Route dae's own subscription fetch DNS to googledns.
            # sub(my_sub) -> googledns
            # Route all nodes with "hk" in their name to googledns.
            # node(name_keyword: hk) -> googledns
            # Use alidns for nodes from subscription "my_sub" before node() rules are checked.
            # subnode(subtag: my_sub) -> alidns

            # If no match, fallback to this upstream.
            fallback: asis
        }
        # According to the response of dns query, decide to accept or re-lookup using another DNS upstream.
        # Match rules from top to bottom.
        response {
            # Built-in outbounds in 'response': accept, reject.
            # You can use user-defined upstreams.

            # Available functions: qname, qtype, upstream, ip.
            # Accept the response if the request is sent to upstream 'googledns'. This is useful to avoid loop.
            upstream(googledns) -> accept
            # If DNS request name is not in CN and response answers include private IP, which is most likely polluted
            # in China mainland. Therefore, resend DNS request to 'googledns' to get correct result.
            ip(geoip:private) && !qname(geosite:cn) -> googledns
            fallback: accept
        }
    }

}
```

`ipversion_prefer` 不會讓 dae 主動查詢首選的位址族。設定 `ipversion_prefer: 4` 時，只有 dae 已經知道該網域有 `A` 記錄，才會把 `AAAA` 回應替換成空的 `NOERROR` 回覆。已知有 `A` 記錄指兩種情況之一：快取中存在未過期的 `A` 回應；或者 `AAAA` 回應最多等待 50 ms（RFC 8305 的解析延遲），在此期間收到了帶記錄的 `A` 回應。否則 dae 原樣返回 `AAAA` 回應。`ipversion_prefer: 6` 的行為相同，只是兩個位址族對調。

`fixed_domain_ttl` 設為 `0` 不會關閉快取。dae 仍會儲存回應，並把快取截止時間設為收到回應的時刻，因此該條目在下次查詢時已經過期。`optimistic_cache` 預設為 `true`。因此在 `optimistic_cache_ttl`（預設 `60` 秒；`0` 表示不限）內，dae 用這條過期條目回答後續查詢，並在後臺向上遊重新整理一次。回覆中的記錄 TTL 不超過 `optimistic_stale_reply_ttl`（預設 `30`）。設定 `optimistic_cache: false` 後，該網域的每次查詢都同步發往上游。

## 引導解析器（`global`）

三類查詢由 dae 直接發往 `global.bootstrap_resolver`，從不經過代理。第一類是 `dns.upstream` 中非 IP 字面量條目的主機名稱。第二類是 `dial_mode: domain`（預設值）對嗅探到的網域執行的後臺探測，前提是 dae 的 DNS 快取中沒有該網域的 `A` 或 `AAAA` 記錄。`domain+` 和 `domain++` 跳過該探測；`ip` 從不按網域建立連線。`dial_mode` 只接受 `ip`、`domain`、`domain+` 和 `domain++`。

第三類在 `dns.routing.request` 含有任何規則時生效，此時 dae 的內部 DNS 路由已啟用。當沒有 `sub()`、`node()` 或 `subnode()` 規則把訂閱 URL 的主機或某個節點的伺服器主機名稱分配給上游，或者分配到的上游未返回位址時，dae 透過引導解析器解析該主機名稱。這些查詢繞過 `qname` 和 `qtype` 規則，並且在 DNS 路由執行期間隨時發生，不只在啟動時。

未設定時，dae 依次嘗試 `119.29.29.29:53` 和 `223.5.5.5:53`。設定後只使用指定的解析器，完全替代這兩個預設值。中國大陸以外的主機通常應選擇距離更近的解析器：

```shell
global {
  bootstrap_resolver: '9.9.9.9:53'
}
```

## 範本

根據所需的 DNS 行為選擇一種範本。

::: code-group

```shell [按域名分流]
# Use alidns for China mainland domains and googledns for others.
dns {
  upstream {
    googledns: 'tcp+udp://dns.google:53'
    alidns: 'udp://dns.alidns.com:53'
  }
  routing {
    # According to the request of dns query, decide to use which DNS upstream.
    # Match rules from top to bottom.
    request {
      # Lookup China mainland domains using alidns, otherwise googledns.
      qname(geosite:cn) -> alidns
      # fallback is also called default.
      fallback: googledns
    }
  }
}
```

```shell [污染响应重新查询]
# Use alidns for all DNS queries and fallback to googledns if pollution result detected.
dns {
  upstream {
    googledns: 'tcp+udp://dns.google:53'
    alidns: 'udp://dns.alidns.com:53'
  }
  routing {
    # According to the request of dns query, decide to use which DNS upstream.
    # Match rules from top to bottom.
    request {
      # fallback is also called default.
      fallback: alidns
    }
    # According to the response of dns query, decide to accept or re-lookup using another DNS upstream.
    # Match rules from top to bottom.
    response {
      # Trusted upstream. Always accept its result.
      upstream(googledns) -> accept
      # Possibly polluted, re-lookup using googledns.
      ip(geoip:private) && !qname(geosite:cn) -> googledns
      # fallback is also called default.
      fallback: accept
    }
  }
}
```

:::

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/configuration/dns.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
