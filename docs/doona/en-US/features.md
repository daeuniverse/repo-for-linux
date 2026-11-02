---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Find the right page {#features}

Find a task in the standard edition of doona. For a first setup, follow [Quick start](quick-start.md) and [Route your first connection](tutorial.md); for the smaller interface, see [doona lite](lite.md).

Validate routing from a real LAN client using working nodes: test direct and proxied TCP, UDP and DNS. `honk-core is running`, the `dae0` link and a reachable API do not prove that traffic flows.


## Pages {#pages}

| Page | What to do there | Availability |
| --- | --- | --- |
| [Activity](observe.md#activity) | Watch traffic, memory, connections and node health on a dashboard. | [Live metrics](feature-requirements.md#req-runtime-status), [history](feature-requirements.md#req-traffic-history) |
| [System status](observe.md#overview) | Check the engine, datapath and explanations for limited features. | [Runtime status](feature-requirements.md#req-runtime-status) |
| [Connections](observe.md#connections) | Inspect live connections, their routing and traffic; close connections or open their matched rule. | [Connection actions](feature-requirements.md#req-connections) |
| [Routing log](observe.md#flows) | Inspect recorded flows and the routing map to understand previous routing decisions. | [Flow recording](feature-requirements.md#req-flows) |
| [DNS](observe.md#dns) | Query a name, inspect answers and cache entries, or read the resolution log. | [Queries](feature-requirements.md#req-dns-query), [cache](feature-requirements.md#req-dns-cache), [log](feature-requirements.md#req-dns-log) |
| [Nodes](routing.md#nodes) | Add subscriptions or node links, refresh sources and test nodes. | [Node management](feature-requirements.md#req-nodes), [subscription refresh](feature-requirements.md#req-subscription-refresh), [probes](feature-requirements.md#req-probes) |
| [Policies](routing.md#policies) | Choose a group's member or edit its selection policy and membership. | [Selection](feature-requirements.md#req-group-selection), [editing](feature-requirements.md#req-group-edit) |
| [Rules](routing.md#rules) | Apply a routing template, edit routing or DNS rules, and simulate a route. | [Rules and templates](feature-requirements.md#req-rules), [Trace](feature-requirements.md#req-routing-trace) |
| [Configuration](config-and-settings.md#config-page) | Open configuration modules, edit files or global settings, and manage backups and revisions. | [Editing](feature-requirements.md#req-config-edit), [validation](feature-requirements.md#req-validation), [revisions](feature-requirements.md#req-revisions) |
| [Events](observe.md#events) | Inspect backend events. | [Event stream](feature-requirements.md#req-events) |
| [Logs](observe.md#logs) | Read, filter, pause and export engine logs. | [Log recording](feature-requirements.md#req-logs) |
| [Settings](config-and-settings.md#settings-page) | Manage backend profiles, temporary overrides, geodata, probe preferences and appearance. | The page opens without a backend. See [runtime overrides](feature-requirements.md#req-runtime-options), [geodata](feature-requirements.md#req-geodata) and [browser settings](feature-requirements.md#req-browser-settings) for its controls. |


## When a page or action is unavailable {#still-missing}

Pages stay in navigation even when the backend cannot provide their data. Open **System status** to read the feature limitations, or open the help beside a disabled action. Follow the matching requirement link in the table before changing the backend.

For an editing refusal, see [read-only sources](troubleshooting.md#read-only). For sign-in errors, see [sign-in troubleshooting](troubleshooting.md#sign-in).


## Dashboard and floating panel {#widgets}

Activity and the floating panel share a widget gallery. Choose cards for the values you need, such as traffic, memory, node availability, DNS latency or subscription quota. See the [Activity guide](observe.md#activity) for the dashboard and the [panel guide](tour.md#panels) for arranging the floating panel.

### Read quota and memory {#read-quota-and-memory}

**Subscription quota** is not in the default layout. Add it to see expiry and an allowance meter, or usage when the backend reports no allowance.

**Memory** defaults to a chart; **Sparkline** provides a value tile. In the floating panel, medium size shows resident memory and cgroup usage against its limit; the chart starts at large size. The meter uses cgroup usage and omits a zero or missing limit. The display distinguishes an unreported limit from an unset one, and **Key-value list** identifies reported OOM kills.

### Choose a size {#choose-a-size}

Dashboard widths range from one fifth to full width. Cumulative traffic and DNS and network splits stop at half width; the group switch stops at two thirds. Unsupported saved sizes use the nearest available size. Metric widgets in the panel omit a redundant large size.

At two thirds width, charts and wide metric lists show peak and average values. Wide lists with at least four rows use two columns. Node latency adds its range at half width. Large donuts enlarge the ring and narrow the legend; large panel donuts show every entry. Narrow legends retain names, values and shares. Small panel notices take a full row, and small node latency uses names and values.

Long names wrap, notices grow to fit their content, and DNS and network splits show every category. Narrow area charts omit overlapping time labels. Waiting sparklines show a baseline until a second sample arrives.


## Settings stored in the browser {#theme-gallery}

Compare the [palette gallery](/doona/screenshots/palettes.webp), then change [appearance settings](config-and-settings.md#appearance).

For language, appearance, date and time formats, startup page and probe preferences, use [Settings](config-and-settings.md#settings-page). To distinguish browser preferences from saved configuration and temporary backend changes, see [where changes are stored](what-doona-can-change.md).

This origin’s `localStorage` keeps profiles, tokens, preferences and layouts. Clearing browser data removes those saved browser values, not honk’s configuration. `sessionStorage` keeps per-tab state such as each section’s last page. Token requests use `Authorization`; doona removes a pairing token from the URL fragment on load.

Over HTTPS or on localhost, a service worker caches the application shell, fonts and icons, never API responses. The interface can then open offline, and you can install it as an app. Saved theme and language apply before the first paint. doona does not download other pages before authentication. Installing an update reuses files already available to the page.

See [SECURITY.md](https://github.com/Zakkaus/doona/blob/main/.github/SECURITY.md) to report a vulnerability.

</div>
