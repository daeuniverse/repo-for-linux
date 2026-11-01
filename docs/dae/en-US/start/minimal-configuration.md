<div v-pre lang="en-US">

<!-- quick-start-minimal-configuration:start -->
## Minimal Configuration

When dae is installed from a package, it reads `/etc/dae/config.dae`; for other installations, see [Service management](/dae/start/service-management). Save the configuration below as that file and replace the subscription URL with your own.

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

Each block does one job:

- `global` sets the WAN interface (`auto` detects it) and the log level, and lets dae adjust the kernel parameters it needs.
- `subscription` names the URL dae downloads nodes from. Replace the example URL with your subscription link.
- `dns` defines two upstream resolvers and the rules that choose between them.
- `group` defines `proxy`, which uses the nodes of `my_sub` and picks the one with the lowest moving-average latency (`min_moving_avg`).
- `routing` matches rules from top to bottom: private, multicast and Chinese mainland traffic goes direct, UDP port 443 is blocked and everything else goes through `proxy`.

## Restrict the file permissions

dae refuses a configuration file that other users can read. Limit access to the owner:

::: code-group

```shell [sudo]
sudo chmod 600 /etc/dae/config.dae
```

```shell [root]
chmod 600 /etc/dae/config.dae
```

:::

Then [start and verify the service](/dae/start/service-management#verify-the-service).

## Privacy-oriented DNS

If privacy and preventing DNS leaks matter more than maximum speed,
replace the `dns` section above with:

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

## Syntax skeleton

The smallest configuration that starts dae is two empty blocks. It leaves dae idle: no traffic is handled until you add rules.

```shell
global{}
routing{}
```

For more options, see [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae).

If you use PVE, refer to [#37](https://github.com/daeuniverse/dae/discussions/37).
<!-- quick-start-minimal-configuration:end -->

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md), licensed under [AGPL-3.0](/upstream/dae-LICENSE.txt).
