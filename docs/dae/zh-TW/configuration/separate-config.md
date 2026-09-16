---
title: "拆分設定檔"
---

<div v-pre lang="zh-TW">

# 拆分設定檔

以下情況適合將設定拆分為多個檔案：

- 透過 `sed` 等工具修改設定檔來切換節點。
- 複製他人的設定檔後，覆蓋其中的某些部分。

## 範例

目錄結構：

```sh
# tree /etc/dae
/etc/dae
├── config.d
│  ├── dns.dae
│  ├── node.dae
│  └── route.dae
└── config.dae
```

入口設定檔是傳遞給 `dae -c ...` 的檔案。`include` 路徑按以下規則處理：

| 路徑型別 | 範例 | 處理方式 |
| --- | --- | --- |
| 相對路徑 | `config.d/*.dae` | 相對於入口設定檔所在目錄解析，而非當前工作目錄 |
| 絕對路徑 | `/etc/dae/config.d/*.dae` | 按原樣使用 |

出於安全原因，dae 僅允許包含入口設定目錄下的檔案。

設定檔如下：

::: code-group

```jsonc [config.dae]
# config.dae

# load all dae files placed in ./config.d/
include {
    # Relative path example:
    config.d/*.dae

    # Absolute path example:
    /etc/dae/config.d/*.dae
}
global {
    tproxy_port: 12345

    log_level: warn

    tcp_check_url: 'http://cp.cloudflare.com'
    udp_check_dns: 'dns.google:53'
    check_interval: 600s
    check_tolerance: 50ms

    #lan_interface: eth0
    wan_interface: eth0
    allow_insecure: false

    dial_mode: domain
    disable_waiting_network: false
    auto_config_kernel_parameter: true
    sniffing_timeout: 30ms
}
```

```jsonc [dns.dae]
# dns.dae
dns {
    upstream {
        alidns: 'udp://dns.alidns.com:53'
        googledns: 'tcp+udp://dns.google:53'
    }

    routing {
        request {
            qname(geosite:category-ads) -> reject
            qname(geosite:category-ads-all) -> reject
            fallback: alidns
        }
        response {
            upstream(googledns) -> accept
            !qname(geosite:cn) && ip(geoip:private) -> googledns
            fallback: accept
        }
    }
}
```

```jsonc [node.dae]
# node.dae
node {
    node1: 'xxx'
    node2: 'xxx'
}

subscription {
    my_sub: 'https://www.example.com/subscription/link'
}

group {
    my_group {
        filter: subtag(my_sub) && !name(keyword: 'ExpireAt:')
        policy: min_moving_avg
    }

    local_group {
        filter: name(node1, node2)
        policy: fixed(0)
    }
}
```

```jsonc [route.dae]
# route.dae
routing {
    pname(NetworkManager) -> direct
    dip(224.0.0.0/3, 'ff00::/8') -> direct
    dip(geoip:private) -> direct

    dip(1.14.5.14) -> direct

    domain(geosite:openai) -> local_group
    dip(geoip:cn) -> direct
    domain(geosite:cn) -> direct
    domain(geosite:category-scholar-cn) -> direct
    domain(geosite:geolocation-cn) -> direct


    fallback: my_group
}
```

:::







然後透過以下命令執行 `dae`：

::: code-group

```shell [sudo]
sudo dae run -c /etc/dae/config.dae
```

```shell [root]
dae run -c /etc/dae/config.dae
```

:::

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/configuration/separate-config.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
