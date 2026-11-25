---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Troubleshooting {#troubleshooting}

Find your symptom, then follow its checks and fix. This page covers connection, editing, recording and geodata failures in doona with honk.

| Symptom | Start here |
| --- | --- |
| A control is missing or disabled | [Feature controls](#a-control-is-missing-or-disabled) |
| A file is read-only or Apply fails | [Configuration writes](#read-only) |
| Sign-in fails | [Sign-in](#sign-in) |
| There is no native API, or `/ui/` returns 404 | [API and UI access](#no-native-api) |
| Geodata update fails | [Update errors](#geodata-update) |
| Geodata source or schedule controls are missing | [Geodata settings](#geodata-sources) |
| A subscription update is rejected because of a proxy chain or group exit | [Rejected updates](#refresh-rejected) |
| A monitoring page is empty | [Recording and visibility](#connections-or-rules-stay-empty) |

## A control is missing or disabled {#a-control-is-missing-or-disabled}

Open **System status** and read **Features that are off**. doona uses the backend's advertised capabilities and the current source or recording state to decide which actions it can offer.

| Affected action | Check and fix |
| --- | --- |
| Editing files, rules or outbound mode | Follow [configuration requirements](feature-requirements.md#req-config-edit); for a source badge, use [read-only files](#read-only). |
| Adding nodes or subscriptions | Follow [node management requirements](feature-requirements.md#req-nodes). |
| Refreshing a subscription or measuring latency | Check [refresh requirements](feature-requirements.md#req-subscription-refresh) or [probe requirements](feature-requirements.md#req-probes). |
| Selecting a group member or editing a group | Selection and editing have separate [selection](feature-requirements.md#req-group-selection) and [editing](feature-requirements.md#req-group-edit) requirements. |
| A recorder or its settings | Follow [runtime override requirements](feature-requirements.md#req-runtime-options) and the relevant [recording checks](#connections-or-rules-stay-empty). |
| A feature the build does not provide | Compare the installed engine with [supported honk builds](requirements.md#honk-version). |


## A file is read-only, or a write is refused {#read-only}

Open **Configuration** → **Config files** and inspect the source's badge or diagnostic. For the complete permission and filesystem rules, see [what doona can change](what-doona-can-change.md) and [configuration requirements](feature-requirements.md#req-config-edit). honk's [accepted configuration and reload operations](/honk/reference/api#accepted-configuration-and-reload-operations) defines the refusal codes and what each one protects.

If the result is unknown, check the current source before repeating the write. For an accepted import or restore, reopen that action under **Backups and revisions**. If its dialog still reports an unknown result, select **Refresh** there to query the original operation. A lost response does not prove the write failed.


## Apply writes nothing and lists `global.nfqueue_enable` as needing a restart {#nfqueue-restart}

When no loaded file states the settings honk refuses the write over, doona 0.1.0-rc.6 and later say that they are not in the configuration, ask you to state them there, and require one restart. That wording covers any restart-only setting, not only `nfqueue_enable`. See honk's [`nfqueue_enable`](/honk/reference/global#nfqueue-enable) for the startup downgrade and the behaviour of earlier releases.


## Apply says a required file is unavailable {#offline-dependency}

The diagnostic does not name the dependency file. For subscription or node errors, check cached subscription content and each node's `ech_config_path`. For DNS errors, check the files named by `use_host`. Restore missing files or refresh malformed subscription content, then apply again.

honk's [configuration management trust boundary](/honk/reference/experimental#configuration-management-trust-boundary) defines the `missing-offline-dependency`, `offline-dependency-denied`, `invalid-offline-dependency` and `unreadable-offline-dependency` codes.

**Update now** updates loaded assets; it cannot install a missing initial asset. Check [geodata requirements](feature-requirements.md#req-geodata) before applying again.


## A subscription update is rejected because of a proxy chain or group exit {#refresh-rejected}

The help beside the subscription card's status says that a proxy chain or group exit refers to a node this subscription removed or duplicated. honk rejected the update and keeps the previous nodes in use.

Change the [chain's hops](routing.md#proxy-chain) or the [group's exit node](routing.md#group-exit) to a node with a unique name, or remove the reference, then update the subscription again. honk's [proxy chains](/honk/reference/nodes#proxy-chains) describes the check.


## Sign-in fails {#sign-in}

Check [sign-in requirements](feature-requirements.md#req-sign-in), then match the response below.

| Symptom or code | Cause and fix |
| --- | --- |
| `setup_required` | Complete administrator setup through [First sign-in](first-sign-in.md). |
| `setup_already_completed` | An administrator already exists. Sign in with that account. |
| `invalid_credentials` | Re-enter the account credentials. For a forgotten password, use the reset steps below. |
| `authentication_required` | Sign in again using the authentication method configured for this backend. |
| `permission_denied` during setup | Check the allowed client addresses in [setup requirements](feature-requirements.md#req-sign-in). |
| A network error or HTTP 403 through a hostname or another origin | Check reachability, then follow [hostname and origin access](install.md#other-origin). |
| The API is reachable but denies a protected action | Check that action's [feature requirements](feature-requirements.md), including credentials and write authority. |

### Reset a forgotten administrator password {#reset-a-forgotten-administrator-password}

On the gateway, [stop honk](service-management.md). Run the installed `honk-core` as its service user, replacing `/var/lib/honk` with the data directory from your [configuration](configuration.md#config):

If you are unsure which directory to pass, follow the [data-directory checks](#state-unsafe).

```sh
honk-core --data-dir /var/lib/honk admin reset
```

The command deletes the administrator record and reports whether one existed. Start honk again, then follow [First sign-in](first-sign-in.md) to create the administrator.


## The native API or UI cannot be reached {#no-native-api}

Check [compatible builds](requirements.md#honk-version) and [API configuration](configuration.md#config). For listener and startup-log diagnostics, see honk's [`native_api`](/honk/reference/experimental#native-api) and [check runtime status](/honk/how-to-start#check-runtime-status).

| Symptom | Cause and fix |
| --- | --- |
| `/api` returns 404 or sign-in shows **This honk build has no native API** | Confirm the address points to honk, then install a build that provides the native API. |
| Only `/ui/` returns 404 | Check the configured UI path and the files installed there. Follow [UI installation](install.md#doona). |
| Startup reports `failed to inspect native UI directory`, `failed to inspect native UI index.html` or `native UI index.html must be a regular file` | Correct the UI directory or extract the UI files so its `index.html` is a readable regular file. |
| An action returns `capability_not_supported` | Use [System status](observe.md#overview) to check that specific feature. This code alone does not mean the whole API is absent. |


## honk rejects a native API setting at startup {#unknown-setting}

See honk's [`native_api`](/honk/reference/experimental#native-api) for the startup diagnostics, including `native API setting belongs inside native_api { }`, `unknown experimental setting` and `native-api feature is required`, and for the authentication combinations it rejects.


## A geodata update fails {#geodata-update}

Read the failed operation's stage on **Settings → Geodata**. honk's [managed entries and geodata](/honk/reference/api#managed-entries-and-geodata) lists every stage and its fix. See [update requirements](feature-requirements.md#req-geodata-update) for when **Update now** is available and how to read the copied error details.


## Geodata sources or the update schedule cannot be edited {#geodata-sources}

Check **System status** → **Datapath** for a persistence warning. A `persistence_unavailable` degradation means the state database is unavailable; use its `reason` with [the database checks](#state-db). See honk's [persisted state](/honk/reference/experimental#persisted-state) for stored-settings behaviour.

Restore [geodata settings requirements](feature-requirements.md#req-geodata-settings), then reopen the Geodata card. Manual downloads have [separate requirements](feature-requirements.md#req-geodata-update); their availability does not prove that honk can save settings.


## honk reports a state database failure {#state-db}

Read the latest startup error in the [service log](service-management.md). honk's [persisted state](/honk/reference/experimental#persisted-state) describes the database, its failure reasons and the corrupt-file handling.


## The persistence warning has reason `unsafe` {#state-unsafe}

The service log names the refused path, rule and suggested fix. See honk's [persisted state](/honk/reference/experimental#persisted-state) for the required ownership, permissions and file type, and [data directory and asset paths](/honk/reference/global#data-directory-and-asset-paths) for `global.data_dir`. On OpenWrt, `/var` is volatile; use the persistent directory from honk's [OpenWrt installation](/honk/how-to-start#openwrt).

## Traffic fails after stopping OpenWrt's firewall {#traffic-fails-after-stopping-openwrts-firewall}

See [Traffic fails after stopping OpenWrt's firewall](/honk/how-to-start#troubleshooting) in honk's troubleshooting table. The firewall manager must leave `inet honk_nfqueue` and its `udp_decision` chain intact while honk runs.

## apk reports `breaks: world[…]` when installing other packages {#apk-reports-breaks-world-when-installing-other-packages}

apk pins a package installed from a file in `/etc/apk/world`. Once a repository carries another version, every `apk add` fails, even for unrelated tools. To keep the local doona build, name its file again in the same `apk add` command. For the honk package, follow honk's [OpenWrt installation](/honk/how-to-start#openwrt).

## Pinning a map fails with Invalid argument {#pinning-a-map-fails-with-invalid-argument}

See honk's [troubleshooting](/honk/how-to-start#troubleshooting); the cause is a `/sys/fs/bpf` mount that is not bpffs.

## honk rejects the kernel or compiled routing {#honk-rejects-the-kernel-or-compiled-routing}

Check honk's [Linux kernel requirements](/honk/how-to-start#linux-kernel-requirements) and [troubleshooting](/honk/how-to-start#troubleshooting). Keep the full verifier log when reporting a verifier failure.

## LAN traffic is not routed as expected {#lan-traffic-is-not-routed-as-expected}

See honk's [troubleshooting](/honk/how-to-start#troubleshooting) and [choosing interfaces](/honk/configuration#choosing-interfaces), including the side-router client gateway and DNS settings.

## Connections or Rules stay empty {#connections-or-rules-stay-empty}

| Empty view | Cause and next check |
| --- | --- |
| **Connections** | Clear filters and read any visibility or truncation notice. Check [connection coverage](feature-requirements.md#req-connections); a missing row does not establish that traffic stopped. |
| **Routing log** or recorded rule hits | Check [flow recording](feature-requirements.md#req-flows). |
| **Resolution log** or DNS statistics | Check [DNS recording](feature-requirements.md#req-dns-log). |
| **Logs** | Check [log recording](feature-requirements.md#req-logs). The recorder cannot recover earlier startup messages; read the service log. |
| **Events** | Check [event availability](feature-requirements.md#req-events) and the selected kind filter. |

**Log recording** defaults to **On log demand**. In demand mode, each permitted recorder starts when a client requests its data, with a 60-second grace period after demand ends. Connections, Rules and Routing log request flow recording while open.

For how each view uses its data, see [Watching traffic](observe.md).

## An open tab still shows the previous version {#an-open-tab-still-shows-the-previous-version}

Reload the page after upgrading. When doona reports that a new version is ready, select **Reload**. With `ui: embedded`, the bundled UI comes from the installed honk binary; check the UI setting in the [configuration reference](configuration.md#config).


## doona lite cannot open, or the wrong edition appears {#lite-trouble}

Check the directory and extracted files against [lite installation](lite.md#lite-install). After changing the UI setting, follow the [native API restart rule](what-doona-can-change.md#restart-native), then reload the browser page. For HTTP 403 or origin failures, use [sign-in checks](#sign-in).

## Collect an error for a report {#collect-an-error-for-a-report}

Select **Copy error** in the failure notice, or **Copy recent errors** under **Settings** → **About**. Include the action you attempted and the running engine and UI versions. Copy the error before reloading the page, which clears the in-memory error history.

The history retains at most 20 errors. Copied details include request method and path, status, error code and request ID when available. The copy omits request bodies and configuration text, and redacts recognized secret fields. See [About](config-and-settings.md#settings-page) for the copy actions.

</div>
