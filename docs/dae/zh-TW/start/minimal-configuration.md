<div v-pre lang="zh-TW">

<!-- quick-start-minimal-configuration:start -->
## 最小設定

以下是最小可啟動設定：

```shell
global{}
routing{}
```

此設定會使 dae 處於無負載狀態。要讓 dae 處理流量，可使用以下精簡設定：

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
  # Fill in your subscription links here.
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
    #filter: name(keyword: HK, keyword: SG)
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

更多內容參見 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

如果使用 PVE，請參見 [#37](https://github.com/daeuniverse/dae/discussions/37)。
<!-- quick-start-minimal-configuration:end -->

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
