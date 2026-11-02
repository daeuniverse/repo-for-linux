---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Change configuration and settings {#config-and-settings}

Edit configuration files or change settings through the standard edition of doona. For configuration keys and examples, use the [configuration reference](configuration.md#config); for storage and activation behavior, see [what doona can change](what-doona-can-change.md).


## Choose a configuration editor {#config-page}

Open **Configuration** from the Settings hub. Check the [editing requirements](feature-requirements.md#req-config-edit) if a control is unavailable.

| Tab | Use it to |
| --- | --- |
| **Modules** | Find a configuration section and use **Open page** to reach its editor. |
| **Global settings** | Change offered global fields through a form. |
| **Config files** | Read or edit a whole source file and inspect its diagnostics. |
| **Backups and revisions** | Export configuration, import server files or restore a stored revision. See [availability](feature-requirements.md#req-revisions). |

**Config version** identifies the accepted configuration; the adjacent status reports diagnostics. **Listener secret values are redacted** means the returned text hides those values. **Modules** opens by default; source links and a missing main-source body open **Config files**. **Global settings** appears only for engines whose settings doona supports.

**Incomplete** means the source text is incomplete or its SHA-256 differs from the backend's reported value. It does not by itself indicate secret redaction. You cannot edit this source in doona; edit the file on the host.

For subscriptions, use [Nodes](routing.md#nodes). For group membership, use [Policies](routing.md#policies). For routing templates and individual rules, use [Rules](routing.md#rules).


## Edit a configuration file {#edit-source}

1. Open **Config files** and select a file from **Config file**.
2. Check its badge before editing. If it is read-only, follow [source permissions and refusal reasons](troubleshooting.md#read-only).
3. Edit the text. **Not applied** marks a draft; **Cancel** discards it.
4. Choose **Validate** when offered, then review the diagnostics. Use **Go** to reach a line or **Open** to inspect another file. See [validation requirements](feature-requirements.md#req-validation).
5. Choose **Apply** and wait for the result. On success, the notice names the written file and confirms the reload. For an unsuccessful or unconfirmed operation, read the notice before sending another change.

Reloading or closing the page loses an unapplied draft. Diagnostics distinguish the accepted configuration from the current draft; typing starts a new draft check when validation is available.

The file picker identifies **Main**, **Include**, **Subscription** and **Generated** sources. Hover over the line count and size to see the loaded time. Subscription updates replace subscription sources; the engine overwrites generated sources, so edit the configuration that produces them. Typing in a read-only source shows its notice once per file.

Diagnostics for the accepted configuration remain until draft validation completes. Applying a change or receiving a new accepted generation clears previous validation results. An empty level filter returns to **All**. Older validation links open diagnostics on **Config files**.

If the file changes while you edit, saving pauses. Review that change before choosing **Keep changes**, which lets your draft replace the newer file, then **Apply**. Choose **Cancel** to discard your draft and use the newer text.

A restart-required notice means honk refused the edit. Follow the [restart-only settings](what-doona-can-change.md#restart-global) procedure instead of repeatedly applying it.

### Create an included file {#create-an-included-file}

1. On **Config files**, choose **New file**.
2. If the dialog supplies the directory and extension, enter only **Name**. Choose **Include pattern** first if the dialog offers several patterns. Otherwise, enter a `.dae` path relative to the main configuration’s directory in **Path**.
3. Resolve any warning that the path matches no loaded include pattern.
4. Choose **Create**. The empty file opens in the editor; continue with the editing steps above.

### Use the global settings form {#use-the-global-settings-form}

1. Open **Global settings** and select the section to edit from **Config file**.
2. Change the offered fields, following their units and ranges. Use the [configuration reference](configuration.md#config) to check a key's meaning; resolve duplicate entries in **Config files**.
3. Choose **Write and reload**, or **Discard changes** to drop the draft. Check the result before leaving.

If writing succeeds but doona cannot read back the new configuration, it keeps the draft and offers **Retry**.

The picker includes global sections in main and include files; a main file without one can receive a new section. **Not set** uses the engine default. Clearing a numeric field leaves it unset; integer fields reject decimal points, and ports display ungrouped numbers such as `8080`.

Stored subscription bodies use the `subscription_body` table in the state database described in the [configuration reference](configuration.md#config). Separate `.sub` files are legacy storage; see [honk’s subscription reference](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/subscription.md#fetch-persistence-and-recovery) for startup migration.

### Export or restore configuration {#export-or-restore-configuration}

Open **Backups and revisions**, then choose the task:

| Task | Action |
| --- | --- |
| Download accepted configuration | Choose **Export configuration**. Review credentials before sharing the download. |
| Replace database configuration with server files | Choose **Import server files**, review the confirmation and confirm. This reads honk's startup file tree; it is not a local file upload. |
| Restore a recorded revision | Open the revision, review its metadata and sources, then choose **Restore revision** and confirm. |
| Check an unconfirmed import or restore | Use **Refresh** to check the accepted operation before starting another write. |

Review the revision’s source SHA-256 values before restoring it. If the database head changes during import or restore, review and confirm the replacement again.

To download only the selected source text, use **Download source file** on **Config files**. Review that file before sharing it too. See [backup and revision requirements](feature-requirements.md#req-revisions) for the available operations and export limits.


## Open Settings {#settings-page}

**Settings** has **General** and **Appearance** tabs. General contains backend profiles, temporary runtime overrides, geodata, latency probes and About. The page also opens without a connected backend.

### Connect or switch backends {#connect-or-switch-backends}

1. In **General** → **Backend**, select a **Profile**, or choose **Add profile** to create one.
2. Enter **Backend URL** as the backend root or reverse-proxy prefix, without `/api/v1`. Enter `mock` for demo data. You cannot save an empty address.
3. Enter **Token** for token authentication. For password authentication, follow the [sign-in guide](first-sign-in.md).
4. Choose **Test connection** and read the result.
5. Choose **Save** to store the profile and reload the page with it.

Switching profiles or confirming a profile dialog discards unsaved address and token edits. **Rename profile** and **Delete profile** manage saved entries. **Sign out** ends password sign-in or removes the saved token from this browser; removing a token does not revoke it on the backend.

Selecting another profile saves the choice and reloads immediately. Confirming **Add profile**, **Rename profile** or **Delete profile** also reloads; a new profile starts with demo data.

A pairing link fills **Backend URL** and **Token**; they take effect after **Save**. Save changes this browser’s profile, not honk’s configuration. For test or sign-in failures, see [sign-in troubleshooting](troubleshooting.md#sign-in).


### Change temporary runtime options {#runtime-options}

Check the [runtime override requirements](feature-requirements.md#req-runtime-options) first.

1. Open **Temporary runtime overrides** and check whether the values are **From configuration** or **Runtime override**.
2. Change the offered log level, record limits, flow retention or recording modes. Each recorder has its own demand-based, always-on and off choices.
3. Choose **Apply**, or **Discard changes** to abandon the draft. Read the recording status beside each recorder.

If runtime options change on the backend while you edit, doona keeps your draft and reports the change.

The offered fields include **Log level**, **Log records kept**, **DNS log records kept**, **Flows kept** and **Flow retention (seconds)**. **Flow recording** offers **On flow demand**; **Log recording** offers **On log demand**; **DNS log** offers **On DNS log demand**. Each also offers **Always** and **Off**. Recorder status reads **Recording**, **Idle** or **Disabled in configuration**.

For how long overrides last, see [runtime changes](what-doona-can-change.md#change-runtime). For persistent values, use **Edit persistent settings in Configuration** and the [configuration reference](configuration.md#config).


### Update geodata or change its sources {#geodata}

Check [file availability](feature-requirements.md#req-geodata), [update requirements](feature-requirements.md#req-geodata-update) and [settings requirements](feature-requirements.md#req-geodata-settings) for the controls you need.

1. Open **Geodata** and inspect the files. Expand **Details** for check times and download information.
2. To download the configured sources now, choose **Update now** and wait for the result.
3. To change sources, choose a preset in **Source**, or choose **Custom** and enter the URLs. Review any missing-category warning. In the custom dialog, confirm with the available action: **Apply and update** or **Apply**.
4. Adjust **Download route**, **Verify checksum** or **Automatic updates** when offered. For **Specific group**, select the group to save the route. These controls save on change; check each result.
5. To remove overrides, choose **Reset to defaults** and review the confirmation before proceeding.

**Source** offers **Loyalsoldier**, **MetaCubeX full**, **MetaCubeX lite** and **Custom**. With honk, each custom URL list accepts up to four URLs, tried in order. **Edit** reopens the custom dialog.

**Details** shows **Last checked** and **Next check**, followed by each file’s size, download host and route. The file table shows each file’s update time.

See [geodata storage and activation](what-doona-can-change.md#change-geodata) for persistence, and [geodata troubleshooting](troubleshooting.md#geodata-update) for download or activation failures.

### Set manual probe preferences {#set-manual-probe-preferences}

1. Open **Latency probes**.
2. Choose **Probe method**, **IP family**, **Measurement** and **Group probes**.
3. Return to a node or group and use its test button. **Probe with options…** lets you adjust the options for that test.

**Warm (reuse connection)** reuses a connection; **Cold (new connection)** opens a new connection. **Group probes** chooses **Direct members** or **Every leaf node**, including nested groups.

See [probe requirements](feature-requirements.md#req-probes) and [result meanings](routing.md#policies). For background checks, use **Edit health checks in Configuration**; their keys are in the [configuration reference](configuration.md#config).


### Change appearance {#appearance}

1. Open **Appearance**.
2. Choose **Language**, **Palette** and **Color scheme**. Adjust **Date format**, **Time format** or **Open at startup** as needed.
3. With a Glass palette, use **Choose image** under **Wallpaper** to select an image, or **Use default** to restore the built-in wallpaper. Adjust the offered veil and blur controls for readability.

#### Date and time {#date-and-time}

- **Date format** defaults to **Automatic (browser region)**, independently of the interface language. **Day/Month/Year**, **Month/Day/Year** and **Year-Month-Day** override it.
- **Time format** defaults to **24-hour**. **12-hour** uses the interface language's AM/PM words; **Automatic (browser region)** follows the browser region.

These choices apply throughout the interface, including charts and the log heatmap.

#### Layout and startup {#layout-and-startup}

**Wordmark**, **Notification position** and **Mirrored layout** are also available. Mirrored layout flips the interface left to right. **Show country flags** controls flags before node names without changing routing. **Show trends on activity cards** controls traffic, CPU and latency sparklines.

**Open at startup** defaults to **Activity** and saves immediately. It applies only when the address has no page route. Explicit page links keep their destination; without a configured backend, an address without a page route opens **Settings**.

#### Glass and wallpaper {#glass-and-wallpaper}

Glass palettes are **Liquid Glass**, **Glass**, **Frosted** and **Tinted**:

- Firefox and Safari render Liquid Glass as Glass. See [browser requirements](feature-requirements.md#req-browser-settings) for Liquid Glass support.
- Frosted uses uniform blur. Tinted has nearly opaque surfaces and no blur.
- Liquid Glass tables on **Events** and **Logs** omit refraction and the bright rim.
- Reduce Transparency, Increase Contrast and forced colors use solid surfaces.

Custom wallpapers also appear behind sign-in. doona scales them to at most 2560 pixels on the long edge.

| Control | Default or limit |
| --- | --- |
| **Readability veil** | On by default. |
| **Dim** | Defaults to its maximum of 60%; white in light mode and black in dark mode. |
| **Blur** | 0% to 150% for Liquid Glass, Glass and Frosted. Below 100%, surface fill increases. Tinted has no Blur control. |

For browser support and storage requirements, see [browser settings](feature-requirements.md#req-browser-settings). The [storage overview](what-doona-can-change.md) explains which choices belong to this browser.

#### Halloween {#halloween}

**Halloween** is under **Other** in the palette list. **Daylight** puts pumpkin orange on parchment and **Midnight** puts it on deep purple. Running states read **Haunting**, and unavailable and degraded states read **Cursed**. Cards carry faint drawings of a jack-o'-lantern, bats, a black cat and a spider web, and the duck logo wears a witch's hat. Its styles load only when you choose it.

### Get help and error details {#get-help-and-error-details}

In **About**, use **Guide** for documentation and **Keyboard shortcuts** for the shortcut list. **Copy recent errors** copies the recent API failures for a bug report; a failure notice's **Copy error** copies that request's details.

**About doona** shows engine, API and contract versions, the license and privacy statement. **Install as an app** appears when supported. When not already running as an app, Safari on iOS/iPadOS and Safari 26 or later on macOS show manual installation steps. An API major version other than 1 produces a warning.

If a read returns empty JSON or no response, doona retries it once before showing an error. Error details identify the request and key response headers.


## Find backend actions {#backend-actions}

| Action | Page and instructions | Requirements |
| --- | --- | --- |
| Reload, suspend or resume honk | [System status](observe.md#overview) | [Lifecycle actions](feature-requirements.md#req-reload-suspend) |
| Delete DNS cache entries | [DNS](observe.md#dns) | [Cache actions](feature-requirements.md#req-dns-cache) |
| Refresh subscriptions | [Nodes](routing.md#nodes) | [Subscription refresh](feature-requirements.md#req-subscription-refresh) |
| Close connections | [Connections](observe.md#connections) | [Connection actions](feature-requirements.md#req-connections) |

For writing rules held in the browser, use [held rules](routing.md#held-rules).

</div>
