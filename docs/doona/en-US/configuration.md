---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Configuration {#config}

doona reads and writes honk configuration through the native API. For keys, defaults and syntax, use honk's [global](/honk/reference/global), [experimental](/honk/reference/experimental), [assets](/honk/reference/assets), [DNS](/honk/reference/dns), [routing](/honk/reference/routing), [groups](/honk/reference/groups), and [subscription](/honk/reference/subscription) references. Start with [Quick start](quick-start.md) or follow [Route your first connection](tutorial.md).

The sections below group the settings doona depends on and link honk for each field contract. See [What doona can change](what-doona-can-change.md) for how edits take effect.

## Native API and authentication {#native-api-and-authentication}

doona needs `experimental.native_api.enabled: true`, a `listen` address, and either `password_auth: true` or `secret`; set `config_write: true` to let doona write configuration. See honk's [`native_api`](/honk/reference/experimental#native-api) for every field and authentication combination.

## Data directory and state database {#data-directory-and-state-database}

`global.data_dir` selects the runtime root. The administrator account and stored geodata settings live in the state database below it; see honk's [data directory and asset paths](/honk/reference/global#data-directory-and-asset-paths) and [configuration database](/honk/reference/api#configuration-db-store-db).

## Assets and subscription defaults {#assets-and-subscription-defaults}

These keys set download routes and subscription defaults. See honk's [assets fields](/honk/reference/assets#fields) and [subscription fields](/honk/reference/subscription#fields).

## Recording permissions {#recording-permissions}

`record_traffic` and `record_memory` feed the traffic and memory charts on Activity and System status. `record_flows` feeds Routing log and recorded rule hits, `record_logs` feeds Logs, and `record_dns_log` feeds the DNS resolution log. See honk's [shared sampling and optional history](/honk/reference/experimental#shared-sampling-and-optional-history) for recorder permission and demand semantics.

## Health checks {#health-checks}

See honk's [global fields](/honk/reference/global#fields) for `tcp_check_url`, `tcp_check_http_method`, `udp_check_dns`, `check_interval`, and `check_tolerance`.

## Logging {#logging}

See honk's [`log_level`](/honk/reference/global#log-level) and [`log_file`](/honk/reference/global#log-file).

## Interfaces and kernel {#interfaces-and-kernel}

doona shows the bound interfaces and datapath details on System status; honk owns their semantics. See honk's [interface semantics](/honk/reference/global#interface-semantics), [`nfqueue_enable`](/honk/reference/global#nfqueue-enable), and [side-router LAN clients](/honk/how-to-start#side-router-lan-clients).

## Dialing and warm-up {#dialing-and-warm-up}

See honk's [global fields](/honk/reference/global#fields) and [warm-up and dial budget](/honk/configuration#warm-up-and-dial-budget).

## Accepted without runtime effect {#accepted-without-runtime-effect}

honk accepts some compatibility fields without a runtime consumer. See honk's [global fields](/honk/reference/global#fields).

## DNS listener and Clash compatibility {#dns-listener-and-clash-compatibility}

See honk's [standalone DNS listener](/honk/reference/dns#standalone-listener-bind) and [`clash_api`](/honk/reference/experimental#clash-api). A Clash API secret makes its source read-only in doona.

## Runtime API fields, not DAE keys {#runtime-api-fields-not-dae-keys}

Change these through **Settings → Temporary runtime overrides**, not a DAE file; an accepted activation or restart resets them. See honk's [native logs and runtime settings](/honk/reference/api#native-logs-and-runtime-settings) for the fields, bounds, and reset behavior.

## Stored geodata settings, not DAE keys {#stored-geodata-settings-not-dae-keys}

Change these through **Settings → Geodata** with credentials and a working state database; saving settings does not activate new files. See honk's [geodata sources and automatic updates](/honk/reference/api#geodata-sources-and-automatic-updates) and [managed entries and geodata](/honk/reference/api#managed-entries-and-geodata).

## Aliases and migration keys {#aliases-and-migration-keys}

Use the current names in new files. honk's [legacy keys](/honk/reference/experimental#legacy-keys) lists the old names and migration warnings.

## Complete annotated example {#complete-annotated-example}

See honk's [fuller configuration](/honk/configuration#fuller-configuration) for an annotated example that combines these sections. doona's [tutorial](tutorial.md) builds the same configuration through the interface.

</div>
