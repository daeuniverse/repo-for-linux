<div v-pre lang="zh-TW">

<!-- quick-start-minimal-configuration:start -->
## 最小設定

以套件安裝 dae 時，它讀取 `/etc/dae/config.dae`；其他安裝方式請見[服務管理](/zh-TW/dae/start/service-management)。將下列設定儲存為該檔案，並把訂閱網址替換為你自己的訂閱連結。

```shell
global {
  # Bind to LAN and/or WAN as you want. Replace the interface name to your own.
  #lan_interface: docker0
  wan_interface: auto # Use "auto" to auto detect WAN interface.

  log_level: info
  allow_insecure: false
  auto_config_kernel_parameter: true
}

subscription {
  my_sub: 'https://example.com/subscription'
}

# See https://github.com/daeuniverse/dae/blob/main/docs/en/configuration/dns.md for full examples.
dns {
  upstream {
    googledns: 'tcp+udp://dns.google:53'
    alidns: 'udp://dns.alidns.com:53'
  }
  routing {
    request {
      qtype(https) -> reject
      fallback: alidns
    }
    response {
      upstream(googledns) -> accept
      ip(geoip:private) && !qname(geosite:cn) -> googledns
      fallback: accept
    }
  }
}

group {
  proxy {
    filter: subtag(my_sub)
    policy: min_moving_avg
  }
}

# See https://github.com/daeuniverse/dae/blob/main/docs/en/configuration/routing.md for full examples.
routing {
  pname(NetworkManager) -> direct
  dip(224.0.0.0/3, 'ff00::/8') -> direct

  ### Write your rules below.

  # Disable h3 because it usually consumes too much cpu/mem resources.
  l4proto(udp) && dport(443) -> block
  dip(geoip:private) -> direct
  dip(geoip:cn) -> direct
  domain(geosite:cn) -> direct

  fallback: proxy
}
```

各區段的作用：

- `global`：設定 WAN 介面（`auto` 表示自動偵測）與日誌層級，並允許 dae 調整所需的核心參數。
- `subscription`：dae 下載節點的訂閱網址。把範例網址替換為你的訂閱連結。
- `dns`：定義兩個上游解析器，以及在它們之間選擇的規則。
- `group`：定義 `proxy` 策略群組，使用 `my_sub` 中的節點，並選擇移動平均延遲最低的節點（`min_moving_avg`）。
- `routing`：規則由上到下依序比對。私有位址、多播位址與中國大陸流量直接連線，UDP 443 連接埠被封鎖，其餘流量經由 `proxy` 轉送。

## 限制設定檔權限

dae 拒絕讀取其他使用者可讀的設定檔。將存取權限限制為僅擁有者：

::: code-group

```shell [sudo]
sudo chmod 600 /etc/dae/config.dae
```

```shell [root]
chmod 600 /etc/dae/config.dae
```

:::

接著[啟動並驗證服務](/zh-TW/dae/start/service-management#驗證服務)。

## 注重隱私的 DNS

如果相比極致速度，更重視隱私和防止 DNS 洩漏，請將上面的 `dns` 部分替換為：

```shell
dns {
  upstream {
    googledns: 'tcp+udp://dns.google:53'
    alidns: 'udp://dns.alidns.com:53'
  }
  routing {
    request {
      qname(geosite:cn) -> alidns
      fallback: googledns
    }
  }
}
```

## 語法骨架

最小可啟動設定只有兩個空區段。此設定會使 dae 處於無負載狀態，加入規則後才會處理流量。

```shell
global{}
routing{}
```

更多內容參見 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

如果使用 PVE，請參見 [#37](https://github.com/daeuniverse/dae/discussions/37)。
<!-- quick-start-minimal-configuration:end -->

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md)，採用 [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
