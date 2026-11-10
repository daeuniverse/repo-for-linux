---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Feature requirements {#title-feature-requirements}

Find your standard-edition feature in the table, then use its section to check prerequisites and enable it. Compare the listed capabilities with **System status → Backend features** before changing your configuration.

| Feature | Main condition | Section link |
| --- | --- | --- |
| Sign-in and administrator setup | Native API and authentication | [Requirements](#req-sign-in) |
| Configuration sources, forms, and outbound mode | Writable configuration source | [Requirements](#req-config-edit) |
| Configuration validation | Full validation capability | [Requirements](#req-validation) |
| Export, import, and revisions | Action-specific capability | [Requirements](#req-revisions) |
| System status and live metrics | Advertised runtime metrics | [Requirements](#req-runtime-status) |
| Traffic and memory history | Startup recorders enabled | [Requirements](#req-traffic-history) |
| Nodes and subscription declarations | Writable owning source | [Requirements](#req-nodes) |
| Subscription refresh | Refreshable subscription | [Requirements](#req-subscription-refresh) |
| Group listing, selection, and pins | Group selection capability | [Requirements](#req-group-selection) |
| Group creation, editing, and check settings | Complete writable declaration | [Requirements](#req-group-edit) |
| Latency probes | Compatible probe options | [Requirements](#req-probes) |
| Connections and closing traffic | Userspace transfer for closing | [Requirements](#req-connections) |
| Flows and recorded rule hits | Active flow recorder | [Requirements](#req-flows) |
| Routing rules, DNS rules, and templates | Writable rule source | [Requirements](#req-rules) |
| Routing trace | Routing trace capability | [Requirements](#req-routing-trace) |
| Events | Events capability | [Requirements](#req-events) |
| Logs | Active log recorder | [Requirements](#req-logs) |
| DNS queries and upstream selection | DNS query capability | [Requirements](#req-dns-query) |
| DNS cache actions | Action-specific cache capability | [Requirements](#req-dns-cache) |
| DNS log and statistics | Active DNS recorder | [Requirements](#req-dns-log) |
| Runtime overrides | Advertised runtime field | [Requirements](#req-runtime-options) |
| Geodata availability | Consistent loaded assets | [Requirements](#req-geodata) |
| Manual geodata updates | Loaded assets with usable URLs | [Requirements](#req-geodata-update) |
| Geodata settings and reset | Working state database | [Requirements](#req-geodata-settings) |
| Operations, reload, suspend, and resume | Supported backend action | [Requirements](#req-reload-suspend) |
| Process-name routing and UDP trace details | Required kernel hooks | [Requirements](#req-process-routing) |
| Keeping selections and probe history | Working state cache | [Requirements](#req-persistence) |
| Appearance and browser storage | Browser support and storage | [Requirements](#req-browser-settings) |

Capability names refer to the native API's `resources` object. A missing resource is unavailable; installing a newer UI alone cannot provide it. **Settings → Temporary runtime overrides** changes only advertised fields. For storage and activation rules, see [What doona can change](what-doona-can-change.md).

Error codes identify API failures. The sections distinguish them from read-only reasons, runtime degradation codes, and geodata operation stages. A disabled button can explain a local prerequisite without sending a request or producing an API error.


## Sign-in and administrator setup {#req-sign-in}

**Needs**

- A [compatible honk build](requirements.md#honk-version), an enabled native API, and its configured sign-in method.
- In `experimental.native_api`, password mode needs `password_auth: true` and a working state database; token mode uses `secret`.
- Initial administrator setup accepts only loopback, private, or link-local peers.

**Check in doona**

- The sign-in page shows whether you need setup, a password, or a token.
- System status shows the engine and backend features.

**To enable**

1. Enable `enabled: true` and your sign-in method in `experimental.native_api` outside doona. For hostname access, configure the permitted host and browser origin, then restart honk.
2. Follow [First sign-in](first-sign-in.md) from the gateway or LAN.
3. Check the engine and backend features on System status.

**Errors**

- [Sign-in failures](troubleshooting.md#sign-in): [`setup_required`](troubleshooting.md#sign-in), [`setup_already_completed`](troubleshooting.md#sign-in), [`invalid_credentials`](troubleshooting.md#sign-in), [`authentication_required`](troubleshooting.md#sign-in), [`permission_denied`](troubleshooting.md#sign-in).
- If the API is absent, see [missing native API](troubleshooting.md#no-native-api).


## Configuration sources, forms, and outbound mode {#req-config-edit}

**Needs**

- Reading needs `config.available` and a loaded source set within the backend's byte and source-count limits.
- Editing needs `config.writable`, `config_write: true` in `experimental.native_api`, credentials, complete source content, and a writable owning source.
- Creation needs `config.create` and a path loaded by an include pattern.
- Global settings and module forms need support from the detected engine. The honk outbound-mode control edits the main source; Global mode also needs an outbound target.

**Check in doona**

- Configuration shows source badges, diagnostics, and disabled-action explanations.
- Activity shows the honk outbound-mode control.

**To enable**

1. Enable `config_write: true` and credentials in `experimental.native_api` outside doona, then restart honk.
2. Resolve the source's read-only reason. Keep listener secrets in a separate file.
3. Apply your change and check both operation success and source readback.

**Errors**

- [Write failures](troubleshooting.md#read-only): [`stale_revision`](troubleshooting.md#read-only), [`state_conflict`](troubleshooting.md#read-only), [`permission_denied`](troubleshooting.md#sign-in).
- [Refusal reasons](troubleshooting.md#read-only): [`writes_disabled`](troubleshooting.md#read-only), [`configuration_unavailable`](troubleshooting.md#read-only), [`listener_secret_source`](troubleshooting.md#read-only), [`listener_secret_in_content`](troubleshooting.md#read-only), [`listener_settings_changed`](troubleshooting.md#read-only), [`unsafe_path`](troubleshooting.md#read-only).
- For missing local dependencies, see [offline dependencies](troubleshooting.md#offline-dependency).

**Details**

- An external edit can invalidate the revision used by a pending write.
- Outbound mode is a configuration change, not a separate runtime switch.


## Configuration validation {#req-validation}

**Needs**

- `config_validate.available`, the advertised `full` mode, and an admitted control request.
- The complete effective source set must fit the validation limits, including locally resolved includes. You can validate main and included sources.

**Check in doona**

- Check the editor's Validate button and Configuration diagnostics.

**To enable**

1. If full validation is absent, use a backend that implements it.
2. Restore missing includes or geodata dependencies, then select Validate again.
3. Check that the result has no error diagnostics. Validation does not apply your draft.

**Errors**

- Request errors: `request_too_large`, `invalid_request`.
- For offline-dependency diagnostics, see [dependency failures](troubleshooting.md#offline-dependency).


## Export, import, and revisions {#req-revisions}

**Needs**

- Export: `config_export.available`. Import: `config_import.available`; honor `replace_required`.
- List revisions: `config_revisions.available`. Restore: also `can_activate`.
- In honk, import and revisions need `--store db`; file mode can still export. Import needs an editable configuration store.

**Check in doona**

- Configuration → Backups and revisions shows the controls for the separate `x-honk` capabilities.

**To enable**

1. Select the intended storage mode at startup, then refresh Backups and revisions.
2. Import or restore, wait for the operation, and verify the active configuration.
3. If the result is unknown, refresh the original operation before retrying.

**Errors**

- The [`import_entry_changed`](troubleshooting.md#read-only) refusal and configuration validation failures can occur. See [write refusals](troubleshooting.md#read-only).

**Details**

- You can restore the recorded head when a failed revision record blocks ordinary writes, provided you have configuration-write authority.


## System status and live metrics {#req-runtime-status}

**Needs**

- System status: `runtime`. Memory: `runtime_memory` and each advertised metric.
- Outbound counters: `runtime_outbounds`. Datapath details: `datapath` and the advertised detail kinds.

**Check in doona**

- Check the Engine, Memory, Datapath, and Backend features cards on System status.

**To enable**

1. Use a compatible backend and resolve the degradation shown by the affected card.
2. Refresh and check that the expected readings appear. Do not treat a missing metric as zero.

**Errors**

- Counter reads: `temporarily_unavailable`. See [native API access](troubleshooting.md#no-native-api) and [state database failures](troubleshooting.md#state-db).
- Authentication failures use the [common sign-in codes](troubleshooting.md#sign-in).

**Details**

- Your backend can provide basic runtime status while some measurements are unavailable.


## Traffic and memory history {#req-traffic-history}

**Needs**

- Traffic history: `traffic_history.available` and `record_traffic: true` in `experimental.native_api`.
- Memory history: `memory_history.available` and `record_memory: true` in `experimental.native_api`.

**Check in doona**

- Check the traffic and memory charts on Activity and System status, and their entries in Backend features.

**To enable**

1. Enable the corresponding recorder in `experimental.native_api` outside doona, then restart honk.
2. Allow samples to accumulate and verify that the chart gains samples.

**Errors**

- An unavailable history endpoint returns [`capability_not_supported`](troubleshooting.md#no-native-api). See [backend compatibility](troubleshooting.md#no-native-api).

**Details**

- The recorders are independent startup settings, not runtime switches.
- The backend advertises maximum windows and sample counts. A bounded ring can retain less than the maximum window.


## Nodes and subscription declarations {#req-nodes}

**Needs**

- Lists: `nodes.available` and `providers.available`. Managed creation and deletion: the corresponding `can_manage` and a writable main source.
- Subscription editing: a unique declaration, honk source syntax, and a complete, writable owning source.
- Creation options such as update interval, User-Agent, and cache must appear in `providers.create_options`.

**Check in doona**

- On Nodes, inspect the Add, Edit, and Delete explanations.

**To enable**

1. Resolve [source permissions](what-doona-can-change.md). For write permission, enable `config_write: true` and credentials in `experimental.native_api` outside doona, then restart honk.
2. Apply your change and verify the resulting entry.
3. Refresh a newly created honk provider to load its nodes; it starts unfetched.

**Errors**

- [`capability_not_supported`](troubleshooting.md#no-native-api), [`state_conflict`](troubleshooting.md#read-only), `unsupported_value`. See [write refusals](troubleshooting.md#read-only).

**Details**

- Managed deletion excludes built-in nodes, provider-derived nodes, and declarations owned by includes.
- You also cannot delete a node referenced as a group's final outbound through managed deletion.


## Subscription refresh {#req-subscription-refresh}

**Needs**

- `providers.can_refresh`, `operations.available`, and a refreshable provider.
- In honk, a running subscription supervisor and an enabled subscription. The backend must be running when it admits the operation.

**Check in doona**

- Nodes shows the refresh action, provider status, node count, and last error.

**To enable**

1. Enable the subscription and check its URL and download route.
2. Refresh it, wait for the operation, and verify its updated status and nodes.

**Errors**

- [`capability_not_supported`](troubleshooting.md#no-native-api), [`state_conflict`](troubleshooting.md#read-only), `temporarily_unavailable`, `resource_not_found`. For an unavailable backend, see [native API access](troubleshooting.md#no-native-api).
- Provider error `route_unavailable`: its selected route has no usable node.
- For activation dependency failures, see [offline dependencies](troubleshooting.md#offline-dependency).

**Details**

- The built-in inline provider is not a subscription to download.


## Group listing, selection, and pins {#req-group-selection}

**Needs**

- Policies: `groups.available`. Selection: the group selection capability and `can_select`.
- Pinning or clearing an automatic-policy override: `can_override`.
- A running backend. These actions do not require `config_write` or edit the source.

**Check in doona**

- Check the group's controls on Policies.

**To enable**

1. Choose a selectable group or a policy that allows overrides.
2. Select or clear a member and verify the selected member or override indicator.

**Errors**

- [`state_conflict`](troubleshooting.md#read-only), `resource_not_found`. For API access failures, see [sign-in failures](troubleshooting.md#sign-in).
- If the selection disappears after restart, check [persistence requirements](#req-persistence).


## Group creation, editing, and check settings {#req-group-edit}

**Needs**

- Creation: a complete, writable main source. Editing: loaded configuration and exactly one declaration in a complete, writable source.
- Missing, duplicate, or incomplete declarations disable Edit even with configuration-write permission.
- Group check settings: `groups.config_patch` and the requested field in `mutable_config`. See the field list in [What doona can change](what-doona-can-change.md).

**Check in doona**

- Policies explains why Edit or a field is unavailable.

**To enable**

1. Resolve duplicate declarations outside the group editor or restore complete source readback.
2. If configuration writes are off, enable `config_write: true` and credentials in `experimental.native_api` outside doona, then restart honk.
3. Apply your change and verify the group's configuration after activation.

**Errors**

- Revision conflicts: [`stale_revision`](troubleshooting.md#read-only), [`state_conflict`](troubleshooting.md#read-only). For source refusals, see [read-only sources](troubleshooting.md#read-only).

**Details**

- Source editing and the restricted group PATCH controls have different prerequisites.


## Latency probes {#req-probes}

**Needs**

- `probes.available` and a compatible intersection of advertised target types, probe kinds, transports, and IP families.
- Your group must support every requested transport. Each selected node's protocol must support the probe kind and transport, including in a mixed selection.

**Check in doona**

- Check Settings → Latency probes and the probe controls on Nodes or Policies.

**To enable**

1. Choose an offered probe and IP family.
2. Run the probe and check its per-kind result.

**Errors**

- Request refusals: `unsupported_value`, `rate_limited`, `temporarily_unavailable`. Transport failures appear in the probe result.
- For missing probe support, see [native API compatibility](troubleshooting.md#no-native-api).

**Details**

- If your saved choice no longer fits the target, doona selects HTTP if available, otherwise the first compatible choice.
- doona cannot offer a probe when the intersection is empty.


## Connections and closing traffic {#req-connections}

**Needs**

- Listing: `connections.available`. Closing: `can_close`, an admitted control request, and a connection whose transfer belongs to userspace.
- Bulk close must fit the advertised maximum number of matching entries.

**Check in doona**

- Check Connections and its close-action explanations.

**To enable**

1. Generate traffic through the configured interface and verify an entry appears.
2. Close an eligible connection and confirm it leaves the live list.

**Errors**

- [`state_conflict`](troubleshooting.md#read-only), `resource_not_found`, `request_too_large`.
- See [Connections or Rules stay empty](troubleshooting.md#connections-or-rules-stay-empty).

**Details**

- The list shows connections that honk handles in userspace. Traffic the kernel forwards directly, such as `direct` traffic, does not appear.


## Flows and recorded rule hits {#req-flows}

**Needs**

- `flows.available`, `record_flows: true` in `experimental.native_api`, and an active recording policy.
- Check `recording.flows.active` in runtime settings. Availability alone does not mean capture is active.

**Check in doona**

- Check Routing log, Rules' recorded hits, and Settings → Temporary runtime overrides.
- **System status** → **Features that are off** names the state: **Flows are recorded only while viewed** in demand mode, **Flow recording is set to Off in Settings** when the runtime mode is Off, and **Flow recording is off** when the configuration prohibits recording.

**To enable**

1. If configuration prohibits recording, enable `record_flows: true` in `experimental.native_api` outside doona and restart honk.
2. Choose an offered runtime mode.
3. Generate new traffic and verify a recorded flow. Existing traffic does not prove that the recorder captured it.

**Errors**

- Reads: `snapshot_expired`, `snapshot_unavailable`, `flow_expired`. Refresh the view for a new snapshot.
- For an empty view, see [empty connection and rule lists](troubleshooting.md#troubleshooting).

**Details**

- **Off** records nothing, **Always** records the supported scopes, **On flow demand** records while a client asks for flows, and a sampled mode records a subset.
- **On flow demand** is the default. Recording starts when a client asks for flows and stops after the reported grace period, so flows from before you opened a page are not kept. Connections, Rules and Routing log ask for flows while they are open.
- To record without a client, set **Flow recording** to **Always** in Settings → **Temporary runtime overrides**. The configuration cannot pin the mode: its `record_flows` only permits or prohibits recording, and a restart or an accepted configuration activation returns the mode to **On flow demand**.


## Routing rules, DNS rules, and templates {#req-rules}

**Needs**

- Lists: `rules.available` or `dns_rules.available`. Adding, editing, or holding a rule: source permission and a locatable rule or insertion position.
- Routing templates: honk syntax, a complete writable target, routing confined to one source, valid referenced groups, and valid local geodata dependencies.
- Service rules: `rules.available`, `config.available` and a writable fallback rule. The rules go into the fallback's file.

**Check in doona**

- Rules and DNS rules show unavailable actions and dependency explanations.

**To enable**

1. Resolve the owning source. If configuration writes are off, enable `config_write: true` and credentials in `experimental.native_api` outside doona, then restart honk.
2. Use a single routing source before applying a template.
3. After activation, check the rule list and trace a matching destination.

**Errors**

- Source write refusals: see [read-only sources](troubleshooting.md#read-only).
- Dependency diagnostics: [`missing-offline-dependency`](troubleshooting.md#offline-dependency), [`unreadable-offline-dependency`](troubleshooting.md#offline-dependency), [`invalid-offline-dependency`](troubleshooting.md#offline-dependency). See [offline dependencies](troubleshooting.md#offline-dependency).


## Routing trace {#req-routing-trace}

**Needs**

- `routing_trace.available`, a supported resolution mode, and valid query inputs.
- The backend must advertise live resolution in `resolve_modes`. Your trace must fit backend request and time limits.

**Check in doona**

- Open the trace panel on Rules.

**To enable**

1. Install a compatible backend if the trace capability is absent.
2. Choose an offered resolution mode and supply the destination and other requested fields.
3. Run the trace and check its matched steps and final outbound.

**Errors**

- `invalid_request`, `unsupported_value`, `request_too_large`, `temporarily_unavailable`.
- For missing backend support, see [native API compatibility](troubleshooting.md#no-native-api).


## Events {#req-events}

**Needs**

- `events.available`.

**Check in doona**

- Check Events and its connection state.

**To enable**

1. Connect to a backend that advertises the resource.
2. Perform an action such as a reload and verify that its event appears.

**Errors**

- An old resume cursor can return [`event_cursor_expired`](troubleshooting.md#troubleshooting). See [missing startup messages](troubleshooting.md#troubleshooting).

**Details**

- The backend advertises event kinds, retention, and client limits. The stream only provides retained events.
- Reconnecting cannot recover events already evicted from the buffer.


## Logs {#req-logs}

**Needs**

- `logs.available`, `record_logs: true` in `experimental.native_api`, an active recording mode, and a level that includes your messages.
- The backend must advertise the filters.

**Check in doona**

- Check Logs and Settings → Temporary runtime overrides.

**To enable**

1. If necessary, enable `record_logs: true` in `experimental.native_api` outside doona and restart honk.
2. Choose an offered recording mode and level.
3. Generate a new event at that level and verify its log entry.

**Errors**

- [`capability_not_supported`](troubleshooting.md#no-native-api), `unsupported_value`, [`event_cursor_expired`](troubleshooting.md#troubleshooting). See [startup messages and recorder limits](troubleshooting.md#troubleshooting).

**Details**

- Buffer capacity and retention limit replay.
- Use the service log for messages from before the API recorder's installation.


## DNS queries and upstream selection {#req-dns-query}

**Needs**

- `dns_query.available` and an advertised record type.
- Selecting a named upstream also needs readable configuration containing that upstream.

**Check in doona**

- DNS → Query shows the offered types and upstreams.

**To enable**

1. If you need to select an upstream explicitly, define it in the `dns` configuration block, apply, and reopen Query.
2. Choose an offered type and upstream, run a query, and check the response and reported result.

**Errors**

- Invalid or unsupported requests: `invalid_request`, `unsupported_value`.
- For access failures, see [native API access](troubleshooting.md#no-native-api).

**Details**

- If your selected upstream is missing or removed, doona returns the selection to Automatic.


## DNS cache actions {#req-dns-cache}

**Needs**

- Listing: `dns_cache.available` and `read`.
- Deleting one entry, deleting a name, and flushing: `delete_entry`, `delete_name`, and `flush` respectively. These are independent capabilities.

**Check in doona**

- DNS → Cache shows supported controls.

**To enable**

1. Use a backend that advertises the action you need. Enabling DNS logging does not enable cache actions.
2. Delete or flush, then refresh the list and check the result. New DNS traffic can populate it again.

**Errors**

- Reads: `snapshot_expired`, `snapshot_unavailable`. Malformed requests: `invalid_request`.
- For compatibility and access, see [native API access](troubleshooting.md#no-native-api).


## DNS log and statistics {#req-dns-log}

**Needs**

- `dns_log.available`, `record_dns_log: true` in `experimental.native_api`, and an active recorder mode.
- Query and cache capabilities are separate.

**Check in doona**

- Check DNS → Log and Statistics, plus Settings → Temporary runtime overrides.

**To enable**

1. If configuration prohibits recording, enable `record_dns_log: true` in `experimental.native_api` outside doona and restart honk.
2. Select an offered mode, generate DNS traffic, and verify new log entries and statistics.

**Errors**

- [`capability_not_supported`](troubleshooting.md#no-native-api), `temporarily_unavailable`. See [recording and startup messages](troubleshooting.md#troubleshooting).

**Details**

- A permitted but inactive recorder produces no new samples.


## Runtime overrides {#req-runtime-options}

**Needs**

- `runtime_settings.available` and the requested field in `fields`. You do not need `config_write`.
- Recorder permissions and value bounds must allow your value, even when the backend advertises the recorder-mode field.

**Check in doona**

- Settings → Temporary runtime overrides shows available controls and recording state.

**To enable**

1. If necessary, enable the corresponding startup recorder in `experimental.native_api` outside doona and restart honk.
2. Adjust the runtime value and verify the returned setting.

**Errors**

- Invalid values: `invalid_request`. Unadvertised or prohibited values: `unsupported_value`.
- See [write boundaries](what-doona-can-change.md) and [backend access failures](troubleshooting.md#sign-in).

**Details**

- Restart or an accepted configuration activation resets these overrides.


## Geodata availability {#req-geodata}

**Needs**

- `geodata.available` and a consistent set of loaded assets across the traffic and DNS routers.

**Check in doona**

- Settings → Geodata shows loaded assets and status. An asset mismatch can make the resource unavailable.

**To enable**

1. Install the assets your rules require.
2. Reload or restart honk and check the list.

**Errors**

- An unavailable loaded set can return [`capability_not_supported`](troubleshooting.md#no-native-api). See [offline dependency failures](troubleshooting.md#offline-dependency).

**Details**

- Update now updates loaded assets; it does not install missing dependencies.


## Manual geodata updates {#req-geodata-update}

**Needs**

- `geodata.can_update`, configuration-write authority, credentials, and at least one loaded asset.
- Every loaded asset needs a disk path and a usable URL. Use a final HTTP or HTTPS URL; honk rejects redirects.
- The service user must be able to stage, replace, and sync files in the destination.

**Check in doona**

- Settings → Geodata shows Update now, asset details, and the operation result.
- Update now remains disabled until geodata status loads and the current action finishes.

**To enable**

1. Enable `config_write: true` and credentials in `experimental.native_api` outside doona if necessary.
2. Set `geosite` and `geoip` in `assets.geodata` for loaded assets. With a working state database, you can set sources through Settings instead.
3. Set `route` in `assets.geodata` if needed; it inherits `assets.route` when unset. For direct hostname downloads, configure a usable `bootstrap_resolver` in `global`. Restart honk after editing these startup settings.
4. In Settings → Geodata, select Update now, wait for completion, and check asset details and the operation result.

**Errors**

- [Download stages](troubleshooting.md#geodata-update): [`download_timeout`](troubleshooting.md#geodata-update), [`checksum_unavailable`](troubleshooting.md#geodata-update), [`checksum_mismatch`](troubleshooting.md#geodata-update), [`http_status_rejected`](troubleshooting.md#geodata-update), [`http_not_found`](troubleshooting.md#geodata-update), [`connection_failed`](troubleshooting.md#geodata-update), [`tls_failed`](troubleshooting.md#geodata-update), [`group_unavailable`](troubleshooting.md#geodata-update), [`route_blocked`](troubleshooting.md#geodata-update), [`asset_too_large`](troubleshooting.md#geodata-update), [`invalid_source`](troubleshooting.md#geodata-update).
- [Replacement stages](troubleshooting.md#geodata-update): [`replacement_failed`](troubleshooting.md#geodata-update) means replacement failed; [`directory_sync_failed`](troubleshooting.md#geodata-update) means honk could not confirm durability and may already have replaced a file.
- Before retrying, select **Copy error** on the failure notice. The copied `details.assets` lists each asset's `written` and `durability_confirmed` values; the asset details in Settings do not show them. Check these values and the destination filesystem.

**Details**

- Manual updates do not need the state database if configuration supplies every loaded asset's URL. Without the database, honk cannot use its stored or built-in URL lists.
- Each URL attempt uses the selected route. A failed group or routing decision does not fall back to direct.
- Asset lookup checks `DAE_LOCATION_ASSET`, then `global.data_dir`, then legacy locations, the working directory, and share directories.
- Packaged assets receive a replacement in the data directory, which takes precedence over the packaged copy. honk replaces assets already in the data directory or explicit asset directory in place.
- Each file download attempt allows 30 seconds without progress and 10 minutes in total. The checksum request has a separate 10-second deadline and appends `.sha256sum` to the URL path.
- A checksum 404 leaves the asset unverified. Other checksum fetch failures reject that attempt.
- An operation can fail after changing some files.


## Geodata sources, route, checksum, schedule, and reset {#req-geodata-settings}

**Needs**

- Credentials and a working state database for every settings write: source URL lists, download route, checksum verification, automatic-update schedule, and reset. You do not need `config_write`.
- `geodata.configurable_sources` and `geodata` in `runtime_settings.fields`.
- Route and checksum controls also need their corresponding returned settings. Selecting a group route needs the groups resource and a current group.
- Automatic downloads still need the [update prerequisites](#req-geodata-update).

**Check in doona**

- Check Settings → Geodata. If source and schedule controls are absent, inspect the persistence warning on System status.

**To enable**

1. Repair [state database access](troubleshooting.md#state-db), restart honk, and verify that the controls appear.
2. Save your change and confirm the returned setting.
3. When you change source URLs and updates are available, check the separate update operation that doona starts after saving.

**Errors**

- Settings failures: [`permission_denied`](troubleshooting.md#sign-in), [`capability_not_supported`](troubleshooting.md#no-native-api), [`state_conflict`](troubleshooting.md#read-only) for a stale group, `temporarily_unavailable` when storage fails.
- See [unavailable geodata controls](troubleshooting.md#geodata-sources) and [unsafe database paths](troubleshooting.md#state-unsafe).

**Details**

- The settings request only stores values. Reset is also a database write, not an edit to your configuration file.
- Overrides persist in the database, but startup re-seeds explicitly configured geodata URLs and the download route over stored overrides.


## Operations, reload, suspend, and resume {#req-reload-suspend}

**Needs**

- Tracking accepted actions: `operations.available`. Reload: also `reload.available`.
- Suspend: `suspend.available` and a running backend. Resume: `resume.available` and a suspended backend.
- The inspected honk revision advertises Suspend and Resume as unavailable. No configuration switch enables them there.

**Check in doona**

- Check Settings → Backend and the action's progress or failure notice.

**To enable**

1. Use a compatible backend's supported action, or use [Service management](service-management.md) for process control.
2. After reload, verify the accepted configuration and runtime state.

**Errors**

- Operation failures: [`state_conflict`](troubleshooting.md#read-only), configuration diagnostics, `temporarily_unavailable`. See [write and operation failures](troubleshooting.md#read-only).

**Details**

- An accepted request does not prove that the operation succeeded.
- If the result is unknown, read it back before another write.


## Process-name routing and UDP trace details {#req-process-routing}

**Needs**

- Process-name routing: cgroup v2 socket identity capture. Full names: kernel argument capture.
- UDP trace details separately need kernel tracing support.

**Check in doona**

- System status → Datapath shows reduced-support explanations.

**To enable**

1. Use a kernel and cgroup setup that supports the required hooks. See [kernel requirements](requirements.md#requirements).
2. Restart honk and verify that the relevant warning clears. A UI setting cannot add a missing kernel hook.

**Errors**

- Runtime degradation codes: [`pname_routing_reduced`](troubleshooting.md#troubleshooting), [`pname_routing_disabled`](troubleshooting.md#troubleshooting), [`udp_trace_unavailable`](troubleshooting.md#troubleshooting). See [kernel failures](troubleshooting.md#troubleshooting).
- These report reduced support; they are not configuration-write errors.

**Details**

- Without kernel argument capture, honk falls back to the thread's `comm` name instead of the argument-derived name.


## Keeping selections and probe history {#req-persistence}

**Needs**

- A working state cache, with `enabled` in `experimental.cache_file` not set to `false`, to keep Selector choices and latency history across restarts.
- This honk revision uses the state database for persistence. Password authentication also needs that database at startup.

**Check in doona**

- Check the persistence explanation on System status.

**To enable**

1. Leave `enabled` in `experimental.cache_file` unset to keep Selector choices and delay samples.
2. Resolve ownership, permissions, unsafe paths, locks, or corruption as described in [State database problems](troubleshooting.md#state-db).
3. Restart honk and check that the warning is gone before relying on saved state.

**Errors**

- Runtime degradation codes: [`state_cache_unavailable`](troubleshooting.md#state-db), which the UI recognizes, and [`persistence_unavailable`](troubleshooting.md#state-db), which honk reports with a reason when it continues without its database. See [state database failures](troubleshooting.md#state-db).


## Appearance and browser storage {#req-browser-settings}

**Needs**

- Browser settings do not need configuration-write permission.
- Liquid Glass needs Chromium with support for SVG-backed `backdrop-filter`.
- Wallpaper persistence needs working IndexedDB. Flag overrides need a node name without an embedded flag.

**Check in doona**

- Check Settings → Appearance and the flag picker.

**To enable**

1. Use a supported browser for Liquid Glass and allow browser storage for persistence.
2. Choose a wallpaper and reopen the page to verify that it persists.
3. To change an embedded flag, change the node's actual name. The browser override cannot replace it.

**Errors**

- Browser storage failures show local explanations instead of honk API codes.
- For stale UI assets after an upgrade, see [browser refresh](troubleshooting.md#troubleshooting).

**Details**

- Without persistence, doona can keep the wallpaper for your current session.

</div>
