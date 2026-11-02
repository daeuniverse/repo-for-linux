---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Configuration {#config}

Look up honk's DAE settings exposed by doona, their defaults, and how they take effect. For configuration syntax, use honk's [nodes](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/nodes.md), [subscriptions](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/subscription.md), [groups](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/groups.md), [routing](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/routing.md), and [DNS](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/dns.md) references. Start with [Quick start](quick-start.md) or follow [Route your first connection](tutorial.md).

The tables show defaults for honk `1b95e2e`. The example overrides some defaults. The Applies column links to the corresponding write-permission or restart row in [What doona can change](what-doona-can-change.md).

## Native API and authentication {#native-api-and-authentication}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `experimental.native_api.enabled` | `false` | Enables the native API used by doona. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.listen` | `127.0.0.1:9527` | API address. Use a numeric IP and a nonzero port. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.password_auth` | `false` | Enables administrator sign-in; cannot coexist with `secret` or anonymous loopback. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.secret` | `''` | Token sign-in. Visible ASCII without whitespace or commas. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.allow_anonymous_loopback` | `false` | Allows uncredentialed loopback access; does not grant protected writes. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.config_write` | `false` | Permits source writes and geodata updates with credentials. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.ui` | `''` | Serves doona at `/ui/`: a directory containing `index.html`, or `embedded` / `embedded-lite` with a `native-ui` build. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.allow_origins` | `[]` | Additional browser origins, such as `https://panel.example`. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.allowed_hosts` | `[]` | Additional HTTP host authorities, such as `panel.example`. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |

## Data directory and state database {#data-directory-and-state-database}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `global.data_dir` | `/var/lib/honk` | Runtime root; state database is `state/honk.db` below it. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.store_subscribe` | `true` | Retains subscription bodies for offline startup; per-entry `cache` must also allow it. | [Restart](what-doona-can-change.md#restart-global) | [subscription](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/subscription.md) |
| `experimental.cache_file.enabled` | Unset | Unset keeps Selector choices and delay samples; `false` disables this cache; `true` also keeps Clash mode and permits DNS persistence. | [Restart](what-doona-can-change.md#restart-cache) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.cache_file.store_dns` | `false` | Retains DNS answers when `enabled: true`. | [Restart](what-doona-can-change.md#restart-cache) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |

The state database also holds administrator credentials and geodata settings. `--store db` selects database-backed configuration revisions; it is a startup option, not a DAE key. See [revision requirements](feature-requirements.md#req-revisions).

## Assets and subscription defaults {#assets-and-subscription-defaults}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `assets.route` | Empty; routing rules | Default download route: `routing`, `direct`, or a group. Inherited by geodata, UI and subscriptions. | [Restart](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/assets.md) |
| `assets.geodata.geosite` | `''`; built-in URLs with state DB | HTTP(S) source for loaded domain categories. | [Restart](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/assets.md) |
| `assets.geodata.geoip` | `''`; built-in URLs with state DB | HTTP(S) source for loaded IP categories. | [Restart](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/assets.md) |
| `assets.geodata.route` | Inherits `assets.route` | Download route for data and checksums. An unset route preserves a stored override. | [Restart](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/assets.md) |
| `assets.ui.url` | [zashboard dist.zip](https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip) | Clash dashboard download, not the doona directory. `HONK_UI_DOWNLOAD_URL` overrides it. | [Restart](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/assets.md) |
| `assets.ui.route` | Inherits `assets.route` | Clash dashboard download route; also accepts a node tag. | [Restart](what-doona-can-change.md#restart-assets) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/assets.md) |
| `assets.subscription.ua` | `honk/<version>` | Default subscription User-Agent; an entry can override it. | [Reload](what-doona-can-change.md#change-sources) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/assets.md) |
| `assets.subscription.interval` | `86400s` | Default refresh interval; `0` disables scheduled refresh. | [Reload](what-doona-can-change.md#change-sources) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/assets.md) |
| `assets.subscription.cache` | `true` | Default per-entry body cache, subject to `global.store_subscribe`. | [Reload](what-doona-can-change.md#change-sources) | [assets](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/assets.md) |

Entry options override subscription defaults. Sub-block routes override `assets.route`. An effective change to inherited geodata or UI settings requires a restart; subscription-only changes can reload. Explicit startup geodata URLs and routes replace stored overrides. Defining a URL does not load an asset. See [geodata requirements](feature-requirements.md#req-geodata-update).

## Recording permissions {#recording-permissions}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `experimental.native_api.record_traffic` | `true` | Traffic history charts. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.record_memory` | `true` | Memory history charts. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.record_flows` | `true` | Permits flow recording for Routing log and rule-hit evidence. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.record_logs` | `true` | Permits the Logs recorder. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.native_api.record_dns_log` | `true` | Permits the DNS resolution log recorder. | [Restart](what-doona-can-change.md#restart-native) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |

These file keys grant recorder permission. Flows, logs and DNS logs start in on-demand mode. Their runtime switches cannot override a configured prohibition. Connections lists active userspace connections separately from the flow recorder. See [Connections](feature-requirements.md#req-connections), [flows](feature-requirements.md#req-flows), and [runtime overrides](feature-requirements.md#req-runtime-options).

## Health checks {#health-checks}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `global.tcp_check_url` | `https://www.gstatic.com/generate_204` | Global HTTP probe target list; the health loop uses the first URL. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.tcp_check_http_method` | `HEAD` | Global HTTP health-check method. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.udp_check_dns` | `dns.google:53`, `8.8.8.8`, `2001:4860:4860::8888` | UDP probe targets; the first literal IP takes precedence over names. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.check_interval` | `30s` | Global health-check interval. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.check_tolerance` | `50ms` | Default latency improvement required to switch URLTest members. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |

## Logging {#logging}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `global.log_level` | `info` | Startup filter. A valid `RUST_LOG` takes precedence, then `--debug`. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.log_file` | `''` | Optional file output. Relative paths resolve below `data_dir`; `--log-file` overrides this value. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |

## Interfaces and kernel {#interfaces-and-kernel}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `global.lan_interface` | `[]` | LAN interfaces for forwarded traffic; no LAN hooks when empty. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.wan_interface` | `[]` | Interfaces for host traffic; `auto` follows the lowest-metric IPv4 default route. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.tproxy_port` | `12345` | Transparent TCP/UDP listener port. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.so_mark_from_dae` | `0` | Effective mark is `0x100` at zero; otherwise the configured socket bypass mark. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.nfqueue_enable` | `true` | Requests NFQUEUE staging for ambiguous forwarded LAN UDP. Requires the real eBPF backend. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |

To handle LAN clients, set `global.lan_interface` to the interface facing them:

- On a main router, use its LAN bridge, commonly `br-lan`; clients already use this router as their gateway.
- On a side router, also set clients' gateway and DNS to the side router's LAN address, either on each client or through the main router's DHCP settings.

Do not assume `lan_interface: auto` selects the LAN. It selects the interface with the lowest-metric IPv4 default route, usually the WAN interface on a main router.

## Dialing and warm-up {#dialing-and-warm-up}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `global.dial_mode` | `domain` | Domain discovery and rerouting mode: `ip`, `domain`, `domain+`, `domain++`. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.bootstrap_resolver` | `''` | Resolver for node names and control-plane dials. Direct geodata downloads from hostnames need it. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.tls_implementation` | `tls` | Selects regular TLS or `utls` ClientHello emulation. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.max_concurrent_dials` | `64` | Requested cap on physical proxy connects and handshakes; resource budgeting can lower it. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.udp_warm_node_count` | `0` | UDP warm-up candidate count; zero disables it. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.preconnect_node_count` | `auto` | Startup-only bare-TCP warm-up; `auto` chooses at most eight eligible nodes. Reload does not repeat it. | [Restart for warm-up](what-doona-can-change.md#startup-preconnect) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |

## Accepted without runtime effect {#accepted-without-runtime-effect}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `global.tproxy_port_protect` | `true` | Stored only; does not control port protection. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.pprof_port` | `0` | Stored only; starts no pprof server. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.auto_config_kernel_parameter` | `false` | Stored only; does not control the datapath's fixed sysctl setup. | [Restart](what-doona-can-change.md#restart-global) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.disable_waiting_network` | `false` | Stored only; does not alter startup waiting. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.allow_insecure` | `false` | Stored only; does not disable certificate verification globally. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.sniffing_timeout` | `30ms` | Stored only; does not set the runtime sniffing timeout. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.mptcp` | `false` | Stored only; does not enable MPTCP. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.fallback_resolver` | `8.8.8.8:53` | Stored only; does not select a fallback resolver. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.tls_fragment` | `false` | Stored only; does not enable TLS fragmentation. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.tls_fragment_length` | `''` | Stored only; does not set a fragment length. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.tls_fragment_interval` | `''` | Stored only; does not set a fragment interval. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.bandwidth_max_tx` | `''` | Stored only; does not limit transmit bandwidth. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.bandwidth_max_rx` | `''` | Stored only; does not limit receive bandwidth. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |
| `global.utls_imitate` | `chrome_auto` | Accepted fingerprint request; does not change the single supported Chrome profile. | [Reload](what-doona-can-change.md#change-sources) | [global](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/global.md) |

## DNS listener and Clash compatibility {#dns-listener-and-clash-compatibility}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `dns.bind` | `''` | Standalone DNS listener; empty disables it. Edit outside doona. | [Restart](what-doona-can-change.md#restart-dns) | [dns](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/dns.md) |
| `experimental.clash_api.external_controller` | `''` | Clash API listener; empty disables it. | [Restart](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.clash_api.external_ui` | `''` | Clash dashboard directory. | [Restart](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.clash_api.secret` | `''` | Clash bearer secret; declaring it makes its source read-only in doona. | [Restart](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |
| `experimental.clash_api.default_mode` | `Rule` | Initial Clash mode: `Rule`, `Global`, or `Direct`. | [Restart](what-doona-can-change.md#restart-clash) | [experimental](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/experimental.md) |

## Runtime API fields, not DAE keys {#runtime-api-fields-not-dae-keys}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `record_flows`, `record_logs`, `record_dns_log` | `auto` | On-demand recorder modes: `auto`, `on`, `off`; configured prohibitions still apply. | [Live](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/api.md) |
| `log.level` | From `global.log_level` | Live log filter; also changes console and file output when overridden. | [Live](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/api.md) |
| `log.buffered_records` | `512` | Log ring capacity; `64`–`512`. | [Live](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/api.md) |
| `dns_log.max_records` | `512` | DNS log capacity; `64`–`512`. | [Live](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/api.md) |
| `flows.max_flows` | `1024` | Flow record capacity; `64`–`1024`. | [Live](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/api.md) |
| `flows.retention_seconds` | `300` | Terminal flow retention; `1`–`300` seconds. | [Live](what-doona-can-change.md#change-runtime) | [api](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/api.md) |

Change these through Settings, not a DAE file. An accepted activation or restart resets them. See [runtime override requirements](feature-requirements.md#req-runtime-options).

## Stored geodata settings, not DAE keys {#stored-geodata-settings-not-dae-keys}

| Key | Default | What doona does with it | Applies | honk reference |
| --- | --- | --- | --- | --- |
| `geodata.geosite.urls`, `geodata.geoip.urls` | [GitHub](https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geosite.dat) + [jsDelivr](https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat); `geoip.dat` for GeoIP | Stored URL lists; startup file URLs take precedence. | [Live, stored](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/api.md) |
| `geodata.download` | Routing rules | Download route and optional `group_id`; configured startup routes take precedence. | [Live, stored](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/api.md) |
| `geodata.verify_checksum` | `true` | Checksum verification for downloads. | [Live, stored](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/api.md) |
| `geodata.auto_update.enabled` | `true` | Enables scheduled update checks. | [Live, stored](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/api.md) |
| `geodata.auto_update.interval_hours` | `24` | Interval between scheduled checks, in hours. | [Live, stored](what-doona-can-change.md#change-geodata) | [api](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/api.md) |

Change these through Settings with credentials and an available state database. Saving settings does not itself activate new asset files. See [geodata settings requirements](feature-requirements.md#req-geodata-settings).

## Aliases and migration keys {#aliases-and-migration-keys}

| Old name | Current name |
| --- | --- |
| `experimental.native_api.geosite_download_url` | `assets.geodata.geosite` |
| `experimental.native_api.geoip_download_url` | `assets.geodata.geoip` |
| `experimental.native_api.geodata_download_detour` | `assets.geodata.route` |
| `experimental.clash_api.external_ui_download_url` | `assets.ui.url` |
| `experimental.clash_api.external_ui_download_detour` | `assets.ui.route` |
| `experimental.udp_nfqueue.enabled` | `global.nfqueue_enable` |

Use the current names in new files. Asset aliases emit `legacy-assets-key`; a nonempty old value combined with its new key fails with `conflicting-assets-setting`. The old NFQUEUE block emits a migration warning and supplies the value only when `global.nfqueue_enable` is absent. `experimental.cache_file.path` and `cache_id` are legacy import hints, not the active database location. `store_fakeip` has no effect.

## Complete annotated example {#complete-annotated-example}

This main file adds the tutorial subscription, group, domain rule, DNS rule and download defaults. Replace the subscription URL before starting honk.

Keep API credentials separate from the main file that Nodes modifies. See [source write requirements](feature-requirements.md#req-config-edit).

### Main file {#main-file}

```dae
# /etc/honk/config.dae
# Keep API credentials in a separate include.
include {
    config.d/*.dae
}

# Host traffic, storage, checks and connection settings.
global {
    wan_interface: auto
    # For LAN clients, uncomment and replace with their gateway interface.
    # lan_interface: br-lan
    data_dir: '/var/lib/honk'
    store_subscribe: true
    log_level: info
    # Optional append-only log file, relative to data_dir.
    # log_file: 'honk.log'
    tproxy_port: 12345
    so_mark_from_dae: 0
    nfqueue_enable: true
    tcp_check_url: 'https://www.gstatic.com/generate_204'
    tcp_check_http_method: HEAD
    udp_check_dns: 'dns.google:53', '8.8.8.8', '2001:4860:4860::8888'
    check_interval: 30s
    check_tolerance: 50ms
    dial_mode: domain
    bootstrap_resolver: '1.1.1.1:53'
    tls_implementation: tls
    max_concurrent_dials: 64
    preconnect_node_count: auto
    udp_warm_node_count: 0
}

# Replace the placeholder with your provider's subscription URL.
subscription {
    harbor: 'https://subscription.example/sub'
}

# Optional static nodes; uncomment only with your real node details.
node {
    # backup: 'socks5://192.0.2.2:1080'
}

# Select from harbor's nodes by moving-average latency.
group {
    # This group is used by both the traffic rule and the DNS upstream.
    proxy {
        filter: subtag('harbor')
        policy: min_moving_avg
    }
}

# Send only the tutorial domain through the group.
routing {
    domain(full: example.com) -> proxy
    fallback: direct
}

# Resolve the tutorial domain through the same group.
dns {
    # An IP-based HTTPS endpoint avoids a bootstrap hostname dependency.
    upstream {
        remote_dns: 'https://1.1.1.1/dns-query' -> proxy
    }
    # Other DNS requests keep their original destination.
    routing {
        # Match the same full domain as the traffic rule.
        request {
            qname(full: example.com) -> remote_dns
            fallback: asis
        }
        # Keep the selected upstream's answer.
        response {
            fallback: accept
        }
    }
}

# Download defaults; these URLs alone do not load geodata assets.
assets {
    route: routing
    # Sources for updates after routing rules load the relevant assets.
    geodata {
        geosite: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geosite.dat'
        geoip: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geoip.dat'
        route: direct
    }
    # Applies only to a separately configured Clash dashboard, not doona.
    ui {
        url: 'https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip'
        route: direct
    }
    # Individual subscription options can override these defaults.
    subscription {
        interval: 86400s
        cache: true
        # ua: 'clash.meta'
    }
}
```

### API file {#api-file}

Write the API block from [Quick start](quick-start.md) to `/etc/honk/config.d/api.dae`, or use the [separate UI configuration](install.md) for installed UI files.

Then [restart honk](service-management.md). For the corresponding UI steps, follow [Route your first connection](tutorial.md).

</div>
