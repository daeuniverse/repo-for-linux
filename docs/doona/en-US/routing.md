---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Manage nodes, groups and rules {#routing}

Use the Routing hub to add node sources, choose how groups select nodes and decide which traffic uses them. This guide covers the standard edition; for an end-to-end example, follow [Route your first connection](tutorial.md).

| Task | Page | Check before starting |
| --- | --- | --- |
| Add or edit a subscription or node | [Nodes](#nodes) | [Node management](feature-requirements.md#req-nodes) |
| Refresh a subscription | [Nodes](#nodes) | [Subscription refresh](feature-requirements.md#req-subscription-refresh) |
| Choose a member or pin an automatic group | [Policies](#policies) | [Group selection](feature-requirements.md#req-group-selection) |
| Change membership or group settings | [Policies](#policies) | [Group editing](feature-requirements.md#req-group-edit) |
| Test a node or group | [Nodes or Policies](#policies) | [Latency probes](feature-requirements.md#req-probes) |
| Apply a template or edit rules | [Rules](#rules) | [Rules and templates](feature-requirements.md#req-rules) |
| Add rules for common services | [Service rules](#service-rules) | [Rules and templates](feature-requirements.md#req-rules) |
| Simulate a route | [Trace simulation](#trace) | [Routing trace](feature-requirements.md#req-routing-trace) |

See [what doona can change](what-doona-can-change.md) for when a change takes effect. Open the help beside an unavailable control to find its reason.


## Add and maintain nodes {#nodes}

Open **Nodes**. Select a source card to see its nodes; use the table's search and filters to find a node. The **Latency** tab compares available measurements.

**Search nodes** searches every source; **Group** and **Protocol** filter the table. A reported stream transport appears after the protocol, while filtering still matches the protocol.

Source cards show kind, state, node count, update times, expiry and usage. A quota meter appears when the backend reports an allowance. Expiry shows minutes, with seconds in its tooltip. Arrow keys move between cards. **Not fetched** means no successful fetch and no reported error; **Stale** means retained data needs updating. Empty file sources remain listed with their status.

**Latency** shows the lowest and highest latency and unavailable-node count. Compare **Latest latency** with **Moving average** and **Average of the last 10** when reported. **Group by** groups nodes by group or protocol and names unavailable or unmeasured nodes. Selecting a chart node opens it on **Nodes**.

### Add a subscription {#add-a-subscription}

1. Choose **Add subscription**.
2. Enter **Name** and **Subscription URL**. Review **Auto-update**, **User-Agent** and **Cache the subscription** if offered.
3. Choose **Add**. When subscription refresh is available, doona fetches the new source and reports the node count. If that fetch fails, use **Retry** in the notice.
4. Select the source card and check its nodes before creating a group.

Subscription URLs must use HTTP or HTTPS. doona adds `https://` to a URL without a scheme when the field loses focus or you save it. Invalid URLs and node links show an explanation below their fields.

### Add node links {#add-node-links}

1. Choose **Paste node link**.
2. For one link, enter **Name** and **Node link**. For several links, paste one per line and review the parsed names and errors.
3. Confirm the addition and check the result. If some links fail, the dialog keeps them for correction.

honk supports XHTTP over H2 for Trojan, VMess and VLESS links. `xhttp` and `splithttp` select this transport; supported modes are `auto`, `packet-up`, `stream-up` and `stream-one`. See [honk’s XHTTP reference](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/nodes.md#xhttp-over-h2) for supported options and limits.

### Refresh or edit a subscription {#refresh-or-edit-a-subscription}

1. Use the update action on its source card to fetch it now. The page's subscription update button refreshes all subscriptions.
2. To change the URL or options, use the card's edit action. Change the offered fields, then choose **Apply**. If the card instead offers **Open config file**, edit the declaration there.
3. Use **Auto-update** to choose an interval. For **Custom**, enter a non-negative whole **Interval** and choose its **Unit**.
4. If **Download route** appears, choose the route for fetching the subscription. It does not set the route for traffic using its nodes.

A failed refresh keeps the last successfully loaded nodes. If the selected download route has no usable node, the refresh fails instead of falling back to direct. This can happen when a subscription routes through nodes it has not delivered yet.

An empty **User-Agent** removes `ua` and uses the engine default. **Cache the subscription** appears when the entry sets `cache` or the backend reports a cache default. Choosing **By routing rules** removes the explicit `route`. Other options stay as written.

Renaming can update simple `subtag(...)` filters in the same file. Keep the offered update switch on to retain those group memberships. References in another file or inside an expression block renaming.

If group filters block a rename, follow the dialog's links to **Policies** and update those filters first. For failed downloads, check the [subscription refresh requirements](feature-requirements.md#req-subscription-refresh).

### Edit or remove a node source {#edit-or-remove-a-node-source}

Use a source card's **More actions** menu to remove the source, then review the confirmation. If groups still refer to a subscription, the dialog names them; change their filters first.

For a node declared in configuration, use the row's edit or remove action when offered. If a declaration belongs to an include file and removal is unavailable, open that file in [Configuration](config-and-settings.md#edit-source).

Select rows with their checkboxes to work on several nodes at once. Every row can be selected, including subscription and include-file nodes. With a selection, **Test all** becomes **Test selected (N)** and tests only those nodes. **Remove selected (N)** counts only the manual nodes in the main configuration that you can remove; subscription and include-file nodes are never removed. One confirmation removes them one at a time and shows progress. Closing the dialog stops the remaining removals, and nodes that fail stay selected. `Ctrl A` or `⌘A` selects every listed row, `Shift` with `↑` or `↓` extends the selection, and `Esc` clears it. Changing the source, search or filters clears the selection.

Renaming an inline node updates exact node filters, default and final members, and DNS upstream detours in its declaring source. References from another source prevent renaming.

**Add to group** opens the group editor with the node staged; **Apply** confirms. It lists groups in writable main or include files and supports search. Group editing can use readable configuration even when the runtime groups API is unavailable.


## Choose and edit policy groups {#policies}

Open **Policies**. Each card represents a group; expand a folded card to see its members. The card shows the selected member and the reported health of its members.

**All**, **Manual** and **Automatic** filter groups by selection kind and show counts. The filter stays in the URL; opening a hidden group returns to **All**. Cards show the policy and available, unavailable and untested counts. Groups with more than 12 members offer **Filter nodes**, **Region**, **Sort** and **Available only**. Automatic groups start folded; pinned groups and groups opened by a link expand automatically.

A nested group shows the parent’s latency sample for it, or the latency of the node its current selection resolves to.

### Choose a member {#choose-a-member}

1. If the card offers **Both**, **TCP** and **UDP**, select the network to change.
2. Choose a member. A manual group selects it; an automatic group that allows overrides pins it and shows **Pinned**.
3. To remove a pin, choose **Back to automatic** from **More actions**. On an expanded card this follows the selected network; on a folded automatic card it clears both pins.

For selections across restarts, see [persistence requirements](feature-requirements.md#req-persistence).

### Create or edit a group {#create-or-edit-a-group}

1. Choose **New group**, or use a card's pencil button to edit that group.
2. For a new group, enter **Group name**. Choose **Selection policy**.
3. Select regions, subscriptions, nodes or nested groups to include. Review **Matching nodes** before saving. An empty filter includes all nodes.
4. Use **Add filter** for conditions not covered by the membership choices. Conditions within a filter must all match; **Add OR match** adds an alternative.
5. Review **Default member**, **Final outbound** and the connection-interruption switch when offered. The default is the initial member for manual selection. The group uses the final outbound when no member is available.
6. Choose **Create** for a new group or **Apply** for an edit, then check the result. **Cancel** abandons the draft after any discard confirmation.

Removing an explicit member does not exclude it if another filter still matches it. Change that filter too. For read-only fields, see [group editing requirements](feature-requirements.md#req-group-edit).

**Default member** appears only for manual selection and lists direct members. Choosing an automatic policy leaves the stored `default` unchanged. **Final outbound** offers `direct`, `block`, groups and nodes, excluding groups that would form a cycle. **None** removes the corresponding `default` or `final` setting.

**Interrupt existing connections on switch** controls whether selecting another member closes existing connections. In **Edit group**, it waits for **Apply**. In **View configuration**, changing the switch writes immediately.

After a configuration conflict, retrying preserves fields you did not edit. Reopen the editor if edits conflict or the group has a new name. If someone removed the group elsewhere, the editor stays open and reports that it did not save the changes.

Expand **Regions** to choose regions; selected tags stay visible. **Add filter** supports name and `subtag` matches, and custom expressions remain editable as text. In the **Groups** and **Nodes** pickers, search stays fixed while the options scroll.

### Test members or change background checks {#test-members-or-change-background-checks}

Use a group’s **More actions** → **Test all**, or a node’s test button, to use your [manual probe preferences](config-and-settings.md#settings-page). Choose **Probe with options…** to adjust one test. Check [probe requirements](feature-requirements.md#req-probes) if the action is unavailable.

On **Nodes**, **Test all** in the toolbar tests the listed nodes.

A timed-out or cancelled measurement, an unavailable address or a local refusal can leave a result `unknown`. This does not prove that the node is unavailable. Trojan, AnyTLS and VLESS retain DNS UDP probe choices whose support depends on node configuration. doona reports backend admission refusals instead of silently falling back to HTTP.

For a group's background checks, choose **More actions** → **Check settings**, edit the offered fields and choose **Apply**. These settings are separate from a manual test.

Leave a check field empty to remove the group override and use the global value or default. After a conflict, unchanged fields take the backend’s new values. Fields changed on both sides keep your draft and show the backend value beside it; applying again replaces that value.


## Apply a routing template {#rules}

Open **Rules** → **Routing rules**. When the view switch appears, use **Simple** for templates and **Advanced** for the rule list. See [rule and template requirements](feature-requirements.md#req-rules) before applying a template.

You can inspect templates from readable configuration even without the rules API. **Simple** is the default unless a link selects a rule, prefills a new rule or reviews held rules. Custom routing and routing spread over several files have no selected template.

- **Routing mode** offers **Bypass mainland China**, **GFW list only** and **Global proxy**.
- **More templates** offers **Single proxy group**, **Groups by service**, **Groups by service and region**, and **Back to mainland China**.
- **Back to mainland China** sends mainland Chinese domains and IPs through group `cn`. That group's name matching excludes Hong Kong, Macau and Taiwan. Other traffic goes direct.

1. Choose a **Routing mode**, or open **More templates** for additional choices. Review the template description and options.
2. Choose **Apply** to open the confirmation.
3. Review the target file, groups to create or reuse, and the file diff. A template replaces the target file's top-level routing rules. Routing includes removed by that replacement stop contributing rules through those statements; the included files remain on disk.
4. If **Also add DNS routing** appears, decide whether to include the proposed DNS configuration.
5. Confirm with **Apply** and check the result. If validation fails, correct the reported problem before applying again.

Existing groups retain their settings. Review warnings about reused groups or names that collide with nodes before confirming.

| Template option | Default and effect |
| --- | --- |
| **Block ads** | Off; blocks `geosite:category-ads-all` when enabled. |
| **Block QUIC** | On; blocks UDP port 443. honk marks its own sockets before routing, so this does not block its connections to QUIC-based nodes. |
| **Keep NetworkManager direct** | On; sends NetworkManager traffic direct. |

The defaults apply when the routing holds no rules. Otherwise each option starts from the routing. A detected template keeps its choices. For custom routing, an option starts on only when the routing already contains its rule, so applying a template keeps the ad, QUIC and NetworkManager rules unless you turn the option off.

**Also add DNS routing** appears only when no loaded file has a `dns` block. The checkbox defaults to on. It sends `geosite:cn` queries to `alidns` at `223.5.5.5:53` over UDP, and other queries to `cloudflare` at `1.1.1.1:853` over DNS over TLS.

Warnings identify reused groups that select one exact node or use a `fixed` policy. If a new group has the same name as a node, rules naming it reach the group instead of the node.

The target is the file containing top-level `routing`, or the main file when none exists. doona adds missing groups there. Existing DNS routing, other content and other files stay unchanged. New group labels follow the interface language; region labels include country flags.


## Add service rules {#service-rules}

**Add service rules** in the **Rules** → **Routing rules** toolbar adds one rule per service, such as `domain(geosite:netflix) -> proxy`, and keeps the existing rules.

1. Choose **Add service rules**, then an **Outbound** for all selected services.
2. Select services under **Games**, **Media**, **Social and messaging**, **AI** and **Development and platforms**.
3. Choose **Apply** to write the rules and reload, or **Hold** to add them to [held rules](#held-rules).

The dialog disables a service when a routing rule or held rule already uses its category (**A rule already exists**), or when the loaded geodata lacks it (**Not included in the current geodata**).

The rules go into the file that holds the fallback, just before the fallback. The first matching rule decides, so a game service other than **All games** goes above an existing `geosite:category-games` rule in that file. Otherwise that rule would take the game's traffic.

Two services add more than one rule:

- **Steam**: with an outbound other than `direct` or `block`, **Connect Steam downloads directly** adds `domain(geosite:steam@cn) -> direct` before the Steam rule.
- **Telegram**: adds `dip(geoip:telegram)` with the same outbound, and the DNS request rule `qname(geosite: telegram) && qtype(https, svcb) -> reject` unless one exists, so Telegram connections do not bypass the proxy. When the DNS request rules are in another file, the dialog says so and leaves DNS unchanged.

If doona cannot write the fallback's file, the dialog reports that rules cannot be added automatically. Add them in the configuration file instead, or see [rule requirements](feature-requirements.md#req-rules).


## Add or change an individual routing rule {#add-rule}

1. Open **Rules** → **Routing rules** → **Advanced** when the view switch is present.
2. Choose **Add rule**. Select **Match by** and enter **Values**, separating multiple values with commas. **Add AND condition** adds another condition that must also match. Use **Expression** for a custom condition.
3. Choose **Outbound** and **Insert**. Review earlier rules when choosing a position: the first matching rule determines the result.
4. Choose **Add rule** and check the result in the list.

Switching from **Expression** to **Select** converts representable expressions into condition rows; other expressions stay in **Expression** with a hint. **Domain keyword** matches a substring: `tracker, ads` matches either keyword.

**Outbound** offers `direct`, `block` and groups, but not individual nodes. Turn on **Lock this outbound** to add `must`. **Insert** offers **Last, before the fallback** or a position before a listed rule, starting at the first offered position. Both pickers support search.

Use a row's **Edit rule** to change its condition or target, then **Save**. Use **Remove rule** and confirm to delete it. The fallback row supplies the target when no preceding rule matches.

If you cannot edit or remove a rule in the list, use **Open config file** to edit its declaring file. This action also opens read-only sources at the rule’s line. Editing a fallback changes only its target.

**Hits** counts retained flows whose `rule_generation_id` matches the list’s `generation_id`; it is not a running total. Without a rule list, the view groups current-snapshot flows by rule and shows **Hits** and **Share**. **Rule source** distinguishes `kernel`, `userspace`, `recomputed` and `unknown`.

### Start from observed traffic {#start-from-observed-traffic}

1. Use an add-rule action on a **Connections**, **Routing log** or **DNS** row, or on a Trace evaluation that offers it.
2. Review the selected rule list, condition, target and insertion position. A DNS domain can open a DNS request rule; without DNS rules it opens a routing rule.
3. Read the preview and any duplicate-rule or earlier-rule warning.
4. Choose **Apply** to write this rule, or **Hold** to add it to [held rules](#held-rules). If writing is unavailable, use **Copy rule**.

The dialog has no preset outbound. It shows the current outbound and warns when the choice would not change it. When the matched rule belongs to a writable file, **Insert** defaults to **Before the matched rule**. The other choices are **Last, before the fallback** and **First**. You can also limit DNS conditions to the query’s record type.

Row icons work without selecting the row first. **Connections** also offers **Add rule** in its detail panel, but not its toolbar. **Routing log** uses the row icon, not its detail panel. **DNS** offers **Add rule** in query results, beside answered addresses, and on **Resolution log** and **Cache** rows.

After applying, the success notice offers **View rule** for a routing rule, or **Query again** for a DNS rule added from a DNS query.


## Add or change a DNS rule {#dns-rules}

Open **Rules** → **DNS rules**. Request rules choose how to resolve a query; response rules decide what to do with an answer.

1. Choose **Add rule** under **Request rules** or **Response rules**.
2. Select the condition and enter its values, or use **Expression**.
3. Choose **Action** and, when requested, an upstream. To define an upstream first, follow the [DNS setup example](tutorial.md).
4. Choose **Insert**, review the condition and action, then choose **Add rule**.
5. Use the [DNS page](observe.md#dns) to query the name and inspect the result.

Existing DNS rules use the same edit, save and removal controls as routing rules. See [DNS rule requirements](feature-requirements.md#req-rules) if the list or an action is unavailable.

honk checks each DNS list in order. Response rules accept an answer, reject it or query another upstream. DNS rule dialogs use **Action** instead of **Outbound** and do not offer **Lock this outbound**. **Resolution log** opens DNS; **Open DNS configuration** opens the `dns` section.


## Apply held rules {#held-rules}

Held rules are drafts in the current page session. Reloading the browser page loses them.

1. Open **Rules** and review the pending card for each list with held rules.
2. Remove unwanted entries with **Discard held rule**.
3. Choose **Apply held rules**, or the counted apply button in the top bar. This applies held rules from every list.
4. Read the result. doona processes files one at a time; if a file fails, unwritten rules stay held. Rules already written leave the list even if their activation fails, so follow the failure notice before continuing.

The browser asks before leaving while you have held rules. Pending cards show each rule and insertion position, identify held rules in other lists and report counts for writes to more than one file. A failed write shows its lines on the card.

**Reload honk** reloads the configuration already stored; it does not apply held rules.


## Check a route with Trace {#trace}

Trace evaluates inputs against the current configuration. It does not test a connection to the destination.

1. Open **Rules** → **Trace simulation**.
2. Choose **Network protocol**, then enter a **Domain**, a **Destination IP**, or both, and a **Destination port**.
3. Choose an offered **Resolution mode**. See [Trace requirements](feature-requirements.md#req-routing-trace) for supported modes.

   **Live resolution (live)** and **Resolve, then simulate (query)** require a **Domain** and an empty **Destination IP**.

4. Expand **Advanced** if the rules need source, process, DSCP or mark information. Fill the relevant fields.

   **DSCP** accepts an integer from 0 to 63.

5. Choose **Run trace**. Read **Decision**, the outbound and the per-rule results. If inputs are missing, supply them and run the trace again.
6. For a real connection, check [Connections](observe.md#connections). Use an offered **Add rule** action on the trace result to start a rule from those inputs.

An IP-only trace evaluates that IP and port. Domain-family `dial_mode` can discover a domain from real TLS or HTTP traffic and evaluate routing again; include the domain to simulate that. For an indeterminate result, supply any **Missing inputs**. doona infers **Likely outbound**, when shown, from a matched rule in the same generation; it does not confirm the decision. The result identifies its observation time and generation, and lists **Matched**, **Not matched**, **Skipped** or **Indeterminate** for each rule.

Query resolution adds a DNS query card with **Query DNS** and **View cache** links. Group results show the group-to-node chain under **Node** and its **Reachability**, with controls to test the node or open its group and node pages.

</div>
