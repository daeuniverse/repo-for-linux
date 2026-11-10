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

Open **Configuration** → **Config files** and inspect the source's badge or diagnostic. For the complete permission and filesystem rules, see [what doona can change](what-doona-can-change.md) and [configuration requirements](feature-requirements.md#req-config-edit).

| Reported reason | Fix |
| --- | --- |
| `writes_disabled` | Follow the configuration requirements above to enable authenticated writes. |
| `configuration_unavailable` | Check honk's startup log and wait for its configuration to load before editing. |
| `listener_secret_source` | Edit this secret-bearing file on disk. Keep listener secrets in their own include so other files remain editable. |
| `listener_secret_in_content` | Check for a listener-secret value in the content or path. Replace an overlapping secret outside doona and sign in again after applying the change. |
| `listener_settings_changed` or a restart-required diagnostic | Edit the setting outside doona and follow the [restart rules](what-doona-can-change.md). |
| `credential_sources_changed` | Reload honk after the external credential-file change, then reopen the source before editing. |
| `unsafe_path` | Use a regular file in an allowed configuration directory; check the [filesystem requirements](what-doona-can-change.md). |
| `stale_revision` or `state_conflict` after another edit | Resolve the [changed file](common-tasks.md#changed-on-disk) before applying again. |
| `import_entry_changed` | Start honk with `-c` pointing to the active configuration entry before importing server files. |

If the result is unknown, check the current source before repeating the write. For an accepted import or restore, reopen that action under **Backups and revisions**. If its dialog still reports an unknown result, select **Refresh** there to query the original operation. A lost response does not prove the write failed.


## Apply writes nothing and lists `global.nfqueue_enable` as needing a restart {#nfqueue-restart}

On a kernel without NFQUEUE support, honk turns NFQUEUE off at startup and logs `NFQUEUE is unavailable at startup`. honk 0.1.0-beta.4 and earlier then compare every write with the default `nfqueue_enable: true`, so Apply reports **Nothing was written** and lists `global.nfqueue_enable` as a setting that needs a restart, also after a restart. Set the value in the `global` section, then [restart honk](service-management.md):

```dae
global {
    nfqueue_enable: false
}
```

Apply then writes normally.

doona 0.1.0-rc.6 and later word this refusal differently when no loaded file states the settings honk refuses the write over: the notice says that they are not in the configuration and asks you to state them there and restart honk once. That wording covers any restart-only setting, not only `nfqueue_enable`.


## Apply says a required file is unavailable {#offline-dependency}

honk validates local dependencies before writing. Inspect the diagnostic and the files referenced by the configuration.

The diagnostic does not name the dependency file. For subscription or node errors, check cached subscription content and each node's `ech_config_path`. For DNS errors, check the files named by `use_host`. Restore missing files or refresh malformed subscription content, then apply again.

| Code | Cause and fix |
| --- | --- |
| `missing-offline-dependency` | Restore the missing dependency. For geodata, use [installation instructions](install.md#directories-and-geodata), or [OpenWrt geodata installation](install-openwrt.md#install-geodata). |
| `offline-dependency-denied` | Put the dependency in an allowed configuration or data directory and grant the service user read access. |
| `invalid-offline-dependency` | Replace malformed content, or refresh the affected subscription. |
| `unreadable-offline-dependency` | Check the service log for the underlying file or storage error. |

**Update now** updates loaded assets; it cannot install a missing initial asset. Check [geodata requirements](feature-requirements.md#req-geodata) before applying again.


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

Use the startup log from the current service run to identify the running build and listener. Check [compatible builds](requirements.md#honk-version) and [API configuration](configuration.md#config).

| Symptom | Cause and fix |
| --- | --- |
| Connection to the listener fails | Check that honk is running and the enabled API listens at the address you opened. Use [service checks](service-management.md). |
| `native API listener bind failed` | Confirm that `listen` names an address on this gateway and that another process is not using the port. |
| `Subscription HTTP client creation failed`, followed by `subscription network startup failed` | Read the underlying TLS error and check the system CA certificate store. Install your distribution's certificate package, such as `ca-certificates` or OpenWrt's `ca-bundle`. |
| `command not found` or a missing executable | Compare the honk-core path with your platform's [installation instructions](install.md). |
| `/api` returns 404 or sign-in shows **This honk build has no native API** | Confirm the address points to honk, then install a build that provides the native API. |
| Only `/ui/` returns 404 | Check the configured UI path and the files installed there. Follow [UI installation](install.md#doona). |
| Startup reports `failed to inspect native UI directory`, `failed to inspect native UI index.html` or `native UI index.html must be a regular file` | Correct the UI directory or extract the UI files so its `index.html` is a readable regular file. |
| An action returns `capability_not_supported` | Use [System status](observe.md#overview) to check that specific feature. This code alone does not mean the whole API is absent. |


## honk rejects a native API setting at startup {#unknown-setting}

`native API setting belongs inside native_api { }` means the field sits directly under `experimental`. Compare your file with the [native API configuration](configuration.md#config) and move the field into the nested block.

`enabled` and `secret` belong to several experimental blocks. Placing either directly under `experimental` produces `unknown experimental setting` without naming a single destination block. Move native API fields into `native_api { }`.

`unknown experimental setting` can also mean the running build does not support the setting. `native-api feature is required` means the build lacks the enabled native API feature. Check the running build against [honk requirements](requirements.md#honk-version).

For authentication combinations rejected at startup, use the exact startup error with [sign-in requirements](feature-requirements.md#req-sign-in) and the [configuration reference](configuration.md#config).


## A geodata update fails {#geodata-update}

Open **Settings** → **Geodata** and read the failed operation's stage. If **Update now** is missing or disabled, start with [update requirements](feature-requirements.md#req-geodata-update).

| Stage | What to check or change |
| --- | --- |
| `checksum_unavailable` | The checksum request failed. Check the mirror's checksum URL or choose another source. |
| `checksum_mismatch` | The downloaded content and checksum differ. Obtain a matching file and checksum from the source. |
| `download_timeout` | Check the download route and source; see the [download deadlines](feature-requirements.md#req-geodata-update). |
| `http_status_rejected` | Check the server's status and use a final URL rather than a redirect. |
| `http_not_found` | Correct the file URL. |
| `connection_failed` | Check the chosen route and node; for a direct hostname download, check the resolver described in [update requirements](feature-requirements.md#req-geodata-update). |
| `tls_failed` | Check the gateway clock and the server certificate and hostname. |
| `group_unavailable` | Check the selected group's usable nodes on **Policies**. |
| `route_blocked` | Correct the routing rule that sends this download to `block`. |
| `asset_too_large` | Check that the URL supplies the intended geodata file. |
| `invalid_source` | Correct the source URL. |
| `replacement_failed` or `directory_sync_failed` | Inspect the per-asset result and destination filesystem before retrying; follow [replacement requirements](feature-requirements.md#req-geodata-update). |

See [update requirements](feature-requirements.md#req-geodata-update) for checksum 404 handling, verification and partial-write behavior.


## Geodata sources or the update schedule cannot be edited {#geodata-sources}

Check **System status** → **Datapath** for a persistence warning. A `persistence_unavailable` degradation means the state database is unavailable; use its `reason` with [the database checks](#state-db).

Restore [geodata settings requirements](feature-requirements.md#req-geodata-settings), then reopen the Geodata card. Manual downloads have [separate requirements](feature-requirements.md#req-geodata-update); their availability does not prove that honk can save settings.


## honk reports a state database failure {#state-db}

Read the latest startup error in the [service log](service-management.md). Password authentication requires the database. If honk cannot open it, startup stops. In file-based token mode, some failures leave honk running without persistence; see [persistence requirements](feature-requirements.md#req-persistence).

| Message or reason | Next action |
| --- | --- |
| `unavailable` | Check that the service user can create and access the configured data directory and its state directory. |
| `unsafe` | Follow [unsafe path checks](#state-unsafe). |
| Locked by `honk-core admin reset` | Wait for that command to finish before starting honk. |
| Another honk-core has the database open | Stop the conflicting instance before starting this one. |
| Foreign application ID or newer schema | Use the honk build that owns this database; do not overwrite it with an older build. |
| `corrupt` | In file-based token mode, honk moves a corrupt database to `state/honk.db.corrupt` under the data directory and creates a new database. It never overwrites an earlier corrupt copy, including `state/honk.db.corrupt-wal`. Preserve any blocking copies elsewhere before restarting. |

After repairing access, [restart the service](service-management.md) and check whether the persistence warning is gone.


## The persistence warning has reason `unsafe` {#state-unsafe}

The service log names the refused path, rule and suggested fix. Check that exact path with the [data-directory configuration](configuration.md#config); do not assume every installation uses the same directory.

In file mode, `global.data_dir` selects the runtime data directory; `--data-dir` does not override it. Pass that same directory to `--data-dir` for `admin reset`. On OpenWrt, [`/var` is volatile](https://openwrt.org/docs/techref/filesystems); use the [manual installation’s persistent directory](install-openwrt.md#install-geodata).

The state directory and database must belong to honk's service user and exclude group and other permissions. honk also refuses a symlink or the wrong file type. Correct only the named path's ownership, permissions or type, then restart honk. Do not apply recursive permission changes to the configuration directory.

## Traffic fails after stopping OpenWrt's firewall {#traffic-fails-after-stopping-openwrts-firewall}

If stopping the firewall removes honk's nftables table, start the firewall again, then run `/etc/init.d/honk-core restart` on the gateway. The firewall manager must leave `inet honk_nfqueue` and its `udp_decision` chain intact while honk runs.

## apk reports `breaks: world[…]` when installing other packages {#apk-reports-breaks-world-when-installing-other-packages}

apk pins a package installed from a file, such as doona or honk downloaded as an `.apk`, to that file in `/etc/apk/world`. Once a repository carries another version, every `apk add` fails, even for unrelated tools, with an error such as `honk-0.1.0_beta2-r1: breaks: world[honk><Q1…]`. To follow the [daeuniverse feed](/openwrt/), run `apk add honk@daeuniverse`, listing any other packages in the same command. To keep the local build, name its file again in the same `apk add` command.

## Pinning a map fails with Invalid argument {#pinning-a-map-fails-with-invalid-argument}

Check the bpffs mount at `/sys/fs/bpf`; follow [kernel and filesystem requirements](requirements.md#requirements).

## honk rejects the kernel or compiled routing {#honk-rejects-the-kernel-or-compiled-routing}

Check the minimum kernel version and BPF/BTF support in [Requirements](requirements.md#requirements). Keep the full verifier log when reporting a verifier failure.

## LAN traffic is not routed as expected {#lan-traffic-is-not-routed-as-expected}

Check the [LAN interface instructions](configuration.md#interfaces-and-kernel), including the bridge name and the client gateway and DNS settings for a side router.

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
