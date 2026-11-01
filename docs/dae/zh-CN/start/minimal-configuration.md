<div v-pre lang="zh-CN">

<!-- quick-start-minimal-configuration:start -->
## 最小配置

通过软件包安装 dae 时，它读取 `/etc/dae/config.dae`；其他安装方式见[服务管理](/zh-CN/dae/start/service-management)。将下面的配置保存为该文件，并把订阅地址替换为你自己的订阅链接。

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

各小节的作用：

- `global`：设置 WAN 接口（`auto` 表示自动检测）和日志级别，并允许 dae 调整所需的内核参数。
- `subscription`：dae 下载节点的订阅地址。把示例地址替换为你的订阅链接。
- `dns`：定义两个上游解析器，以及在它们之间选择的规则。
- `group`：定义 `proxy` 策略组，使用 `my_sub` 中的节点，并选择移动平均延迟最低的节点（`min_moving_avg`）。
- `routing`：规则从上到下依次匹配。私有地址、组播地址和中国大陆流量直连，UDP 443 端口被阻断，其余流量经由 `proxy` 转发。

## 限制配置文件权限

dae 拒绝读取其他用户可读的配置文件。将访问权限限制为仅所有者：

::: code-group

```shell [sudo]
sudo chmod 600 /etc/dae/config.dae
```

```shell [root]
chmod 600 /etc/dae/config.dae
```

:::

然后[启动并验证服务](/zh-CN/dae/start/service-management#验证服务)。

## 注重隐私的 DNS

如果相比极致速度，更重视隐私和防止 DNS 泄漏，请将上面的 `dns` 部分替换为：

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

## 语法骨架

最小可启动配置只有两个空小节。此配置会使 dae 处于无负载状态，添加规则后才会处理流量。

```shell
global{}
routing{}
```

更多内容参见 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

如果使用 PVE，请参见 [#37](https://github.com/daeuniverse/dae/discussions/37)。
<!-- quick-start-minimal-configuration:end -->

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md)，采用 [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
