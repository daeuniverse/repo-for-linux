---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# What doona can change {#title-what-doona-can-change}

doona changes configuration sources, runtime state, persistent geodata settings, and browser preferences through different controls. Turning off `experimental.native_api.config_write` disables configuration writes; it does not disable every action.

## Where changes are stored {#where-changes-are-stored}

In this table, **source permission** means `experimental.native_api.config_write: true`, token or password authentication, an available configuration coordinator, and a complete, writable source. A blocked database configuration store also prevents ordinary source edits. Includes follow the same source rules as the main file.

**Live** changes take effect without reloading the configuration. **Reload** means the write must pass validation and complete its activation operation. **Restart** means you must edit the configuration outside doona and restart honk.

| Change | Condition | Storage and application |
| --- | --- | --- |
| <a name="change-sources"></a><span id="change-sources"></span>Source text: `node`, `subscription`, `group`, `routing`, `dns` except `bind`, reloadable `global` fields, and `assets.subscription` | Source permission. Current revision. Required local dependencies available. | File replacement in file mode; a stored revision with `--store db`. Write plus reload. |
| Add or delete managed nodes and providers | Writable main source and the corresponding `can_manage` capability | Write plus reload. Managed deletion excludes built-in nodes, provider-derived nodes, and declarations in includes. |
| Edit a subscription declaration | Writable, complete source containing the declaration | Source write plus reload. |
| <a name="change-groups"></a><span id="change-groups"></span>Group fields: `policy`, `default`, `final`, `tolerance`, `idle_timeout`, `interrupt_connections`, `check_url` | Writable owning source, `groups.config_patch`, and the field in the group's `mutable_config` | Write plus reload. Supports writable includes. The API names `default` and `final` as `default_member_id` and `final_outbound`. |
| <a name="change-runtime"></a><span id="change-runtime"></span>Runtime `record_flows`, `record_logs`, `record_dns_log`, `log.level`, `log.buffered_records`, `dns_log.max_records`, `flows.max_flows`, `flows.retention_seconds` | Admitted API request; advertised field; configured recorder permission and value bounds | Live. No `config_write` requirement. Restart or an accepted configuration activation resets these overrides. |
| <a name="change-geodata"></a><span id="change-geodata"></span>Geodata URL lists, download route, checksum verification, automatic-update schedule, and reset | Credentials. Available state database. Corresponding settings advertised. | Live, stored in the state database. The settings request does not download or activate files and does not require `config_write`. doona starts a separate update after saving source URLs when updates are available. |
| Update geodata files | Configuration-write authority, credentials, loaded assets with paths and URLs | Download, file replacement, then activation. See [geodata update requirements](feature-requirements.md#req-geodata-update). |
| Select a group member, pin an automatic policy, or clear a pin | Running backend; group selection capability and the group's `can_select` or `can_override` | Live runtime action. No source write or `config_write` requirement. Selector persistence depends on the state cache and `experimental.cache_file.enabled` not being `false`. |
| Appearance, language, layout, flag overrides, and probe preferences | Browser support and storage | Live in this browser. They do not modify honk configuration. Wallpaper persistence uses IndexedDB. |

Explicit geodata URLs and download routes in the startup configuration replace the corresponding stored overrides when honk starts. A source edit that changes their resolved native API settings requires a restart. See [geodata settings](feature-requirements.md#req-geodata-settings).

## Settings that require a restart {#settings-that-require-a-restart}

The API refuses these effective changes before writing. Use an external editor, then follow [Service management](service-management.md). The editor may show a restart-required diagnostic or `listener_settings_changed`; see [write refusals](troubleshooting.md#read-only).

| Section | Restart-only keys |
| --- | --- |
| <a name="restart-dns"></a><span id="restart-dns"></span>`dns` | `bind` |
| <a name="restart-global"></a><span id="restart-global"></span>`global` | `check_interval`, `tcp_check_url`, `tcp_check_http_method`, `udp_check_dns`, `tls_implementation`, `tproxy_port`, `tproxy_port_protect`, `pprof_port`, `so_mark_from_dae`, `log_level`, `log_file`, `lan_interface`, `wan_interface`, `auto_config_kernel_parameter`, `data_dir`, `store_subscribe`, `nfqueue_enable` |
| <a name="restart-native"></a><span id="restart-native"></span>`experimental.native_api` | Every field, including authentication, listener, UI, recording, and write settings |
| <a name="restart-clash"></a><span id="restart-clash"></span>`experimental.clash_api` | `external_controller`, `external_ui`, `external_ui_download_url`, `external_ui_download_detour`, `secret`, `default_mode` |
| <a name="restart-cache"></a><span id="restart-cache"></span>`experimental.cache_file` | `enabled`, `store_dns` |
| <a name="restart-assets"></a><span id="restart-assets"></span>`assets` | `geodata.geosite`, `geodata.geoip`, `geodata.route`, `ui.url`, `ui.route`, and inherited `route` when they change the resolved native or Clash API settings |

The health-check comparison uses the effective first HTTP URL and method, and the selected UDP DNS target. `tls_implementation` requires a restart when switching into or out of UTLS mode. The log-file comparison uses the effective path, including any command-line override.

The reload policy also compares internal `global.tproxy_mark`. honk does not accept it as a DAE configuration key; do not add it to your file. honk rejects `global.data_dir` as `listener_settings_changed` in database mode and as a restart-required diagnostic in file mode.

## Why a source is read-only {#why-a-source-is-read-only}

Check the source badge on **Configuration**. A source can be read-only because:

- `config_write` is off, or neither `secret` nor `password_auth` provides credentials.
- It declares a native API or Clash API listener secret.
- Its text contains a listener-secret value subject to masking. honk masks matching values of at least eight bytes.
- In database mode, failure to record the active revision blocks the store.

Configuration actions also remain unavailable while the source set or write coordinator is unavailable. doona refuses incomplete source content. A write cannot introduce a listener secret, change the set of credential-bearing sources, or change listener settings.

Keep listener secrets in a separate include and edit that include outside doona. After restarting honk, reopen Configuration and check the other sources' badges. Separating a secret declaration does not help if another source contains the same masked secret value. See [read-only sources and write refusals](troubleshooting.md#read-only).

## Filesystem requirements {#filesystem-requirements}

A writable badge does not prove that the filesystem permits replacement. In file mode, honk must read the original and create and sync a temporary file beside it. It then renames that file over the original and syncs the directory. Its service user needs access to the containing directories and permission to create and replace entries there.

Configuration writes reject symbolic links in the source path and nonregular files. A missing write bit on the source file alone is not the permission test: replacement changes the directory entry. Concurrent file changes can also reject the write. After applying, check that the operation succeeded and the source readback contains your change.

Geodata updates have separate destination rules: packaged assets are normally replaced by a file in the data directory. See [geodata locations](feature-requirements.md#req-geodata-update).

## Accepted fields without the expected live effect {#accepted-fields-without-the-expected-live-effect}

| Field | Actual behavior |
| --- | --- |
| <a name="startup-preconnect"></a><span id="startup-preconnect"></span>`global.preconnect_node_count` | Consumed by startup warm-up. An accepted source edit does not rerun that warm-up. Restart honk to use the new value for startup. |
| `global.tls_fragment`, `global.tls_fragment_length`, `global.tls_fragment_interval` | Accepted and stored for compatibility; no runtime fragmentation consumer in this honk revision. |
| `global.bandwidth_max_tx`, `global.bandwidth_max_rx` | Accepted and stored for compatibility; no runtime bandwidth-limiting consumer in this honk revision. |

An accepted edit only starts an operation. The change is active when the operation reaches `succeeded`; read the source back to confirm it. Even then, a compatibility field does not change traffic behavior.

</div>

---

Source: [doona-docs](https://github.com/Zakkaus/doona-docs), licensed under [CC BY 4.0](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt).
