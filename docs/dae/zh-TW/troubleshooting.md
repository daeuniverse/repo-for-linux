---
title: "故障排查"
---

<div v-pre lang="zh-TW">

# 故障排查

## `dae suspend` 後無網路

dae 暫停後不會劫持任何 DNS 請求。因此，請勿在 DHCP 設定中將 dae 設為 DNS 伺服器，可改用 `223.5.5.5` 等位址。

## PVE 相關

- [PVE 網路卡硬體直通](https://github.com/daeuniverse/dae/issues/43)

## 繫結 WAN 後無網路

### 排查本地 DNS 服務

如果在 `dns` 部分使用 `adguardhome`、`mosdns`，請參閱 [外部 DNS](/zh-TW/dae/configuration/external-dns)。

### 排查防火牆

dae 會把劫持到的封包從 WAN egress 和 LAN ingress 的 tc hook 經 `dae0` 裝置轉入其私有的 `daens` 網路名稱空間。在 `daens` 內，`tproxy_dae0peer_ingress` 設定 fwmark `0x8000000`。名稱空間內的策略路由（路由表 `2023`）再把封包送到 `tproxy_port`（預設 `12345`）上的 tproxy 監聽器。主機的 `INPUT` 鏈看不到這些封包，也看不到該 fwmark，因此主機防火牆針對該 fwmark 或該連接埠的規則對它們不起作用。dae 不會為該連接埠新增防火牆規則，並忽略已棄用的 `auto_config_firewall_rule` 選項。

主機防火牆能看到的是 dae 自身的出站連線，以及 dae 重新注入 WAN 介面的應答封包；放行 established 和 related 流量的規則集會讓這兩類都通過。如果繫結 WAN 後無網路，請先停止防火牆以確認原因，再確認它仍放行 established 和 related 流量；ufw 與 firewalld 的預設規則集都放行這類流量。

Linux 上常見的防火牆：

```bash
ufw
firewalld
```

#### ufw

`/etc/ufw/before*.rules` 的預設規則會放行 established 和 related 流量，已覆蓋 dae 重新注入 WAN 介面的應答封包。舊的教學會在 `/etc/ufw/before*.rules` 中新增以下 fwmark 規則。因為被劫持的封包只在 `daens` 內帶有 fwmark `0x8000000`，所以這些規則在主機上匹配不到任何封包，dae 不需要它們：

```bash
# before.rules
-A ufw-before-input -m mark --mark 0x8000000 -j ACCEPT

# before6.rules
-A ufw6-before-input -m mark --mark 0x8000000 -j ACCEPT
```

#### firewalld

firewalld 的預設 zone 會放行 established 和 related 流量，已覆蓋 dae 重新注入 WAN 介面的應答封包。舊的教學會在每次開機和防火牆規則變更後執行以下命令。因為被劫持的封包只在 `daens` 內帶有 fwmark `0x8000000`，所以該命令在主機上匹配不到任何封包，dae 不需要它：

```bash
sudo nft 'insert rule inet firewalld filter_INPUT mark 0x8000000 accept'
```

### 排查 PPPoE

舊版本 dae 不支援 PPPoE，請使用最新版本。

## 繫結 LAN 但其他電腦 DNS 異常

### 排查 dae 設定

請確保繫結到正確的 LAN 介面。

| 介面用途 | 設定 |
| --- | --- |
| WAN 和 LAN 共用 `eth1` | 同時設定 `wan_interface: eth1` 和 `lan_interface: eth1` |
| 需要代理的 LAN 介面為 `eth1` 和 `docker0` | 設定 `lan_interface: eth1,docker0` |

### 排查 DNS

在 LAN 中另一臺電腦上驗證：

```bash
curl -i 1.1.1.1
curl -i google.com
```

若第一行有回應而第二行沒有，請檢查 dae 所在電腦的連接埠 `53` 是否被其他程式佔用。

```bash
netstat -ulpen|grep 53
# or
# lsof -i:53 -n
```

若連接埠被佔用，請停止該服務行程，或將其監聽連接埠從 53 改為其他連接埠。同時修改 `/etc/resolv.conf`，確保 DNS 可存取。例如，寫入 `nameserver 223.5.5.5`，不要使用 `nameserver 127.0.0.1`。

## 無法載入 eBPF 物件

> FATA[0022] load eBPF objects: field TproxyWanEgress: program tproxy_wan_egress: load program: argument list too long: 1617: (bf) r2 = r6: 1618: (85) call bpf_map_loo (truncated, 992 line(s) omitted)

此錯誤在用 `clang-13` 編譯 dae 時出現。請改用 `clang-15` 或更高版本編譯，或直接從 [releases](https://github.com/daeuniverse/dae/releases) 下載二進位檔案。`-D__UNROLL_ROUTE_LOOP` 沒有任何效果：該宏在 `control/kern/tproxy.c` 中只是一行被註解掉的定義，沒有對應程式碼。路由始終使用 `bpf_loop`，且 dae 在低於 `5.17.0` 的核心上拒絕啟動。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/troubleshooting.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
