---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Standard edition and doona lite {#editions}

The standard edition manages configuration and observes traffic. Choose it for traffic dashboards, connection controls, logs, advanced routing traces or editing multiple configuration sources.

doona lite focuses on configuration: nodes, subscriptions, groups, routing, DNS and global settings. Choose it for task-specific forms, sharing manual nodes and reviewing configuration drafts without traffic pages.

honk also has a Clash-compatible API for Clash dashboards such as zashboard; doona does not use it (see honk's [minimal configuration](https://github.com/daeuniverse/honk/blob/main/doc/en/how-to-start.md#minimal-configuration)).


## Compare features {#editions-compare}

Features depend on the resources and permissions honk advertises. Changing editions cannot enable an unavailable backend capability.

| Feature | Standard edition | doona lite |
| --- | --- | --- |
| Traffic monitoring | Activity, System status, Connections, Routing log, Logs and Events | No traffic pages |
| Widgets | Activity widgets and floating or docked widgets | No |
| Close connections; export events | Yes | No |
| Routing tests | Rules → Trace simulation, with advanced traffic fields and resolution options | Routing → Test rules, with matched rules and outbounds; uses the same routing trace API |
| DNS queries, Resolution log, Statistics and Cache | Yes | No standalone query or observation pages; routing tests use DNS resolution |
| Nodes, subscriptions and group selection | Yes; groups are under Policies | Yes; separate Nodes, Subscriptions and Groups pages |
| Multi-line share-link import | Yes | Yes, through Add node → Paste links |
| Share links and QR codes | No dedicated sharing dialog | Manual nodes and subscription links; no sharing of subscription nodes |
| Rename a subscription | Yes, with an option to update group references | No; the name stays fixed after creation |
| Group editing | Group form and full source editor | Group form, group text editor, duplicate group and copy members between groups |
| Routing and DNS rules | Forms and full source editor | Forms, reorder controls and per-page visual/text modes |
| DNS upstream presets | Edit upstreams in the source editor; no preset form | Custom upstreams and Ali DNS, DNSPod and Cloudflare presets |
| Global settings | Configuration → Global settings | Settings dialog; restart-only values are read-only with Copy |
| Configuration sources | Select and edit main/include sources; create sources and inspect diagnostics | Edits main only; no full source editor |
| Export configuration | Export the selected source | Export the applied main or the current page’s unsaved draft |
| Backend management | Multiple profiles, sign-out, temporary runtime overrides and geodata management | No corresponding management screens |
| Server configuration backups and revisions | Available when honk advertises the x-honk extensions | No |
| Themes and sign-in | Light/dark themes and palettes; administrator credentials or token | Light, dark or system theme, no palette selector; same honk credentials |


## Backend requirements {#backend-requirements}

Use the native-API honk build in [Requirements](requirements.md#honk-version). Both editions discover authentication through `GET /api` and read `GET /api/v1/capabilities`; password mode uses `POST /api/v1/auth/setup` or `POST /api/v1/auth/login`. The features below require other endpoints; not every connection needs them. Paths in this table start with `/api/v1`.

| Feature | honk resources and endpoints | Editions |
| --- | --- | --- |
| Configuration editing | `config` read/write, `config_validate` and `operations`; `GET /config`, `POST /config/validate`, `PUT /config/sources/{source_id}`, `GET /operations/{operation_id}` | Both; lite requires `full` validation and complete, hash-matching, writable main content. Standard source editing validates when supported. lite’s share-link import also needs `syntax` validation. |
| Nodes, subscriptions and groups | `nodes`, `providers`, `groups`; `GET /nodes`, `GET /providers`, `GET /groups`, `GET /groups/{group_id}`, `POST /providers/{provider_id}/refresh`, `PUT`/`DELETE /groups/{group_id}/selection`; `probes` via `POST /probes` | Both; lite edits declarations through main source replacement. The standard edition also uses node/provider create/delete and group configuration endpoints. |
| Status and service commands | `runtime`, `operations`, and the advertised `reload`/`suspend`/`resume` capabilities. Endpoints: `GET /runtime`, `GET /version` (standard edition), `POST /operations/reload`, `/operations/suspend`, `/operations/resume`, plus operation polling | Both; lite uses status in the shell rather than a traffic dashboard. |
| Routing tests | `routing_trace` via `POST /routing/trace`; `rules` via `GET /rules`; `dns_query` via `POST /dns/query` for name resolution when needed | Both; honk’s resolution modes determine the available tests. |
| Traffic and DNS observations | `traffic_history`, `memory_history`, `runtime_memory`, `runtime_outbounds`, `datapath`, `connections`, `flows`, `events`, `logs`, `dns_log`, `dns_cache`, `dns_query`; `GET /runtime/traffic/history`, `/runtime/memory/history`, `/runtime/memory`, `/runtime/outbounds`, `/datapath`, `/connections`, `/flows`, `/events`, `/logs`, `/dns/log`, `/dns/cache`, `/dns/rules`, plus `POST /dns/query` and connection/cache deletion when writable | Standard edition |
| Source and backend management | `POST /config/sources`; `geodata` via `GET /geodata` and `POST /geodata/update`; `runtime_settings` via `GET`/`PATCH /runtime/settings`; `POST /auth/logout` | Standard edition |
| Server backups and revisions | The advertised `x-honk` configuration export/import/revisions extensions, under `/x-honk/config/` | Standard edition; requires those extensions, beyond the base contract |

lite reuses the standard edition’s `src/api/client.ts` and models backed by the generated `src/api/types.ts`; it has its own UI and state. The [OpenAPI contract](https://github.com/Zakkaus/doona/blob/main/contract/api-standardize/openapi.yaml) defines the endpoint schemas. See [common lite tasks](lite-tasks.md) for the editing prerequisites in user terms.


## Install and switch editions {#editions-switch}

Use [Quick start](quick-start.md) for the embedded standard edition, [doona lite](lite.md#lite-install) to switch to lite, or [install UI files separately](install.md) to serve a directory.

honk serves one edition at `/ui/` at a time. Select its embedded UI or directory with `experimental.native_api.ui`, then [restart honk, not just reload](what-doona-can-change.md#restart-native). The [manual installation guide](install-manual.md) gives each edition a separate archive and directory, so installing one does not overwrite the other.

To use both at once, let honk serve one edition and use a static server for the other directory. Allow the second origin as described in [hostname and origin access](install.md#other-origin).

## Browser settings {#browser-settings}

Both editions share honk's native API, configuration and configuration changes. Each edition keeps its browser settings separately.

## Demos {#demos}

Try the [standard edition demo](https://demo.daeuniverse.org/) or the [doona lite demo](https://demo.daeuniverse.org/lite/).

</div>

---

Source: [doona-docs](https://github.com/Zakkaus/doona-docs), licensed under [CC BY 4.0](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt).
