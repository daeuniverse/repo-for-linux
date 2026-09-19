---
title: "路由規則"
---

<div v-pre lang="zh-TW">

# 路由規則

## 範例

### 內建出站

```shell
### Built-in outbounds: block, direct, must_rules

# must_rules means no redirecting DNS traffic to dae and continue to matching.
# For single rule, the difference between "direct" and "must_direct" is that "direct" will hijack and process DNS request
# (for traffic split use), but "must_direct" will not. "must_direct" is useful when there are traffic loops of DNS requests.
# "must_direct" can also be written as "direct(must)".
# Similarly, "must_groupname" is also supported to NOT hijack and process DNS traffic, which equals to "groupname(must)".
```

### 預設出站

```shell
### fallback outbound
# If no rule matches, traffic will go through the outbound defined by fallback.
fallback: my_group
```

### 網域規則

```shell
### Domain rule
domain(suffix: v2raya.org) -> my_group  # equals to domain(v2raya.org) -> my_group 
domain(full: dns.google) -> my_group
domain(keyword: facebook) -> my_group
domain(regex: '\.goo.*\.com$') -> my_group
domain(geosite:category-ads) -> block
domain(geosite:cn)->direct
```

### 目標 IP

```shell
### Dest IP rule
dip(8.8.8.8) -> direct
dip(101.97.0.0/16) -> direct
dip(geoip:private) -> direct
```

### 來源 IP

```shell
### Source IP rule
sip(192.168.0.0/24) -> my_group
sip(192.168.50.0/24) -> direct
```

### 目標連接埠

```shell
### Dest port rule
dport(80) -> direct
dport(10080-30000) -> direct
```

### 來源連接埠

```shell
### Source port rule
sport(38563) -> direct
sport(10080-30000) -> direct
```

### 傳輸層協定

```shell
### Level 4 protocol rule:
l4proto(tcp) -> my_group
l4proto(udp) -> direct
```

### IP 版本

```shell
### IP version rule:
ipversion(4) -> block
ipversion(6) -> ipv6_group
```

### 來源 MAC

```shell
### Source MAC rule
mac('02:42:ac:11:00:02') -> direct
```

### 行程名稱

```shell
### Process Name rule (only support localhost process when binding to WAN)
pname(curl) -> direct
```

### DSCP

```shell
### DSCP rule (match DSCP; is useful for BT bypass). See https://github.com/daeuniverse/dae/discussions/295
dscp(0x4) -> direct
```

### 多個網域

```shell
### Multiple domains rule
domain(keyword: google, suffix: www.twitter.com, suffix: v2raya.org) -> my_group
```

### 多個 IP 位址

```shell
### Multiple IP rule
dip(geoip:cn, geoip:private) -> direct
dip(9.9.9.9, 223.5.5.5) -> direct
sip(192.168.0.6, 192.168.0.10, 192.168.0.15) -> direct
```

### 與條件

```shell
### 'And' rule
dip(geoip:cn) && dport(80) -> direct
dip(8.8.8.8) && l4proto(tcp) && dport(1-1023, 8443) -> my_group
dip(1.1.1.1) && sip(10.0.0.1, 172.20.0.0/16) -> direct
```

### 非條件

```shell
### 'Not' rule
!domain(geosite:google-scholar,
        geosite:category-scholar-!cn,
        geosite:category-scholar-cn
    ) -> my_group
```

### 組合條件

```shell
### Little more complex rule
domain(geosite:geolocation-!cn) &&
    !domain(geosite:google-scholar,
            geosite:category-scholar-!cn,
            geosite:category-scholar-cn
        ) -> my_group
```

### 自訂 DAT 檔案

```shell
### Customized DAT file
domain(ext:"yourdatfile.dat:yourtag")->direct
dip(ext:"yourdatfile.dat:yourtag")->direct
```

### fwmark

```shell
### Set fwmark
# Mark is useful when you want to redirect traffic to specific interface (such as wireguard) or for other advanced uses.

# An example of redirecting Disney traffic to wg0 is given here.
# You need set ip rule and ip table like this:
# 1. Set all traffic with mark 0x800/0x800 to use route table 1145:
# >> ip rule add fwmark 0x800/0x800 table 1145
# >> ip -6 rule add fwmark 0x800/0x800 table 1145
# 2. Set default route of route table 1145:
# >> ip route add default dev wg0 scope global table 1145
# >> ip -6 route add default dev wg0 scope global table 1145
# Notice that interface wg0, mark 0x800, table 1145 can be set by preferences, but cannot conflict.
# Notice also that dae marks its own egress traffic with an internal mark (0x100) unless
# so_mark_from_dae sets another one: a rule written for *unmarked* traffic does not match
# dae's own egress, and a rule that matches 0x100 affects dae's own traffic as well.
# 3. Set routing rules in dae config file.
domain(geosite:disney) -> direct(mark: 0x800)
```

### Must 規則

```shell
### Must rules
# For following rules, DNS requests will be forcibly redirected to dae except from mosdns.
# Different from must_direct/must_my_group, traffic from mosdns will continue to match other rules.
pname(mosdns) -> must_rules
ip(geoip:cn) -> direct
domain(geosite:cn) -> direct
fallback: my_group
```

## 按裝置限定的網域白名單（自動 sniff-punt）

```shell
mac('aa:bb:cc:dd:ee:ff') && domain(geosite:docker, suffix:quay.io, geosite:github) -> my_group
mac('aa:bb:cc:dd:ee:ff') -> direct
```

核心匹配 `domain` 條件時，用連線的目標 IP 查詢 `domain_routing_map`。鍵不含來源 IP 或 MAC。值是所有經 dae 轉送、且解析到該 IP 的 DNS 應答的網域點陣圖按位或的結果，在這些 DNS 快取條目存活期間一直有效。因此，只要另一個 dae 用戶端或 dae 主機曾透過 dae 解析過目標 IP，使用加密 DNS（DoH/DoT）的裝置仍能命中白名單。如果沒有任何經 dae 轉送的應答覆蓋該目標 IP，連線就不帶網域資訊，會落到退回規則。

dae 會識別同時滿足以下條件的規則組合：

- 使用單主機 `mac`/`sip` 選擇器。
- 包含正向 `domain` 條件。
- 後面有一條僅含該選擇器的 `direct`/`block` 退回規則。

dae 會在退回規則前自動插入一條僅在核心空間生效的 sniff-punt 規則。該規則將缺少網域資訊的連線送到使用者空間，嗅探 TLS SNI、HTTP host 或 QUIC，再用嗅探到的網域重新匹配同一組規則。

這種恢復是有條件的，因為 dae 只嗅探一部分送到使用者空間的連線。dae 從不嗅探目標連接埠為 20、21、22、25、53、119、123、161、3306、5432、6379、9200、27017 和 11211 的 TCP 連線，這份清單是硬編碼的。TCP 連線的前幾個位元組不是 TLS 握手或 HTTP 請求時，dae 也會跳過嗅探。相同的目標、行程名稱、MAC 和 DSCP 已連續 3 次嗅探失敗時，dae 同樣跳過，並對該組合暫停嗅探 10 分鐘。

dae 只在來源連接埠或目標連接埠為 443 或 8443 且封包是 QUIC Initial 時才嗅探 UDP。對被跳過的連線和嗅探不到網域的連線，dae 會不帶網域重新路由。白名單規則因此無法命中，連線會落到退回規則。

該裝置未命中白名單的流量仍會落到退回規則，並經使用者空間轉送。

使用此功能需要啟用嗅探（`sniffing_timeout > 0`、`dial_mode != ip`）。可透過 `auto_sniff_punt: false` 關閉此功能。

## 參數名與取反規則

以下接受無名參數值的函式會拒絕不支援的參數名：`pname`、`port`/`dport`、`sport`、`dscp`、`ip`/`dip`、`sip`、`ipversion`、`l4proto`、`mac`、`qtype`，以及回應路由中的 `upstream`。

語法允許在所有函式呼叫中使用 `key: value`。這些函式的解析器以前會忽略未知參數名，因此 `port(bogus_param: 443)` 會在沒有提示的情況下生成與 `port(443)` 相同的 match set。`pname(bogus_param: 1)` 則會匹配名為 `1` 的行程。

現在，這類規則會報錯 `unsupported parameter key "bogus_param"`，並指出接受的寫法。函式原本支援的值字首 `geoip:`、`geosite:` 和 `ext:` 不受影響，例如 `dip(geoip:cn)` 和 `dip(ext:"file.dat:tag")`。不帶參數名的 `pname(NetworkManager)` 和 `port(443)` 也不受影響。

如果設定在上述函式中使用了誤寫的參數名，dae 將無法啟動，直到移除該參數名。升級前請檢查路由部分。

最佳化器不再合併出站相同、且僅含一個函式的取反規則。規則按順序匹配，因此以下兩條獨立規則會將未命中 `a` **或**未命中 `b` 的流量傳送到 `my_group`：

```shell
!domain(geosite:a) -> my_group
!domain(geosite:b) -> my_group
```

合併後的 `!domain(geosite:a, geosite:b)` 對整個集合取反，僅匹配**同時未命中** `a` 和 `b` 的流量，範圍更窄。dae 現在保留原來的兩條規則，因此依賴舊合併行為的設定會匹配比以前更多的流量。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/configuration/routing.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
