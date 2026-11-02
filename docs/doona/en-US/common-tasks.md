---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Common tasks {#common-tasks}

Change routing, manage subscriptions, and diagnose traffic in the standard edition. For a first configuration, follow [Route your first connection](tutorial.md); for the smaller edition, see [doona lite](lite.md).

Before changing a rule, check [rule editing requirements](feature-requirements.md#req-rules). For when a saved change takes effect, see [configuration writes](what-doona-can-change.md#change-sources).


## Send one site's traffic through a proxy {#one-site}

1. Open **Connections** → **List** and find a connection to the site.
2. Select its add-rule icon.
3. Set **Match by** to **Full domain** and **Outbound** to your proxy group.
4. Check the preview and **Insert**. Place the new rule before any rule that would match the same traffic first.
5. Select **Apply** and check the success notice. To collect changes before applying them, use **Hold** and follow [held rules](routing.md#held-rules).

To include subdomains or keep this route in Global and Direct modes, use [the domain rule procedure](#domain-family).


## Route a domain and its subdomains through a group {#domain-family}

1. Open **Rules** → **Routing rules**. Select **Advanced** if the view switch appears, then **Add rule**.
2. Set **Match by** to **Domain suffix** and enter the domain in **Values**.
3. Set **Outbound** to the group.
4. Turn on **Lock this outbound** if this rule must also apply in Global or Direct mode.
5. Set **Insert** before any earlier rule that would match the same traffic.
6. Select **Add rule** in the dialog. Check the success notice and the new rule in the list.

For other conditions and rule ordering, see [the rule editor](routing.md#add-rule).


## Make a device bypass the proxy {#device-bypass}

Use a fixed IP address for the device so the rule continues to match it.

1. Open **Rules** → **Routing rules**. Select **Advanced** if shown, then **Add rule**.
2. Set **Match by** to **Source IP** and enter the device's IP address in **Values**.
3. Set **Outbound** to `direct` and enable **Lock this outbound**.
4. Set **Insert** before any rule that would match this device first.
5. Select **Add rule**. Check that the new rule contains the intended source address and outbound.

Use [Trace simulation](routing.md#trace) with that source address to check which rule wins.


## Choose a group's node and return to automatic selection {#group-node}

Check [selection and pinning requirements](feature-requirements.md#req-group-selection).

1. Open **Policies** and expand the group's card.
2. Select a node in its node grid.
3. Read the notice to confirm the selection and whether the automatic policy has paused.
4. To clear a manual pin, open the card's **More actions** menu and select **Back to automatic**. Check the member reported by the resulting notice.

For group policies, see [policy groups](routing.md#policies).


## Add or refresh a subscription {#subscription}

Check [subscription creation requirements](feature-requirements.md#req-nodes) and the separate [refresh requirements](feature-requirements.md#req-subscription-refresh).

1. Open **Nodes** and select **Add subscription**.
2. Enter **Name** and **Subscription URL**, then select **Add**.
3. Select the new subscription card and check its nodes. If the backend supports refresh, doona requests it after adding the subscription. The notice reports the result.
4. To refresh later, use the update button on that card. If doona saved the declaration but the refresh failed, resolve the reported error and use that button again.

Continue with [creating a group](tutorial.md) when the subscription has nodes.


## Switch to Global mode {#global-mode}

Check [outbound-mode requirements](feature-requirements.md#req-config-edit).

1. Open **Activity**.
2. Select **Global** on **Outbound mode**, then choose a target on **Global outbound**.
3. Select **Apply** and read the confirmation dialog.
4. Select **Apply** in the dialog. Check the notice and the displayed mode.

To return to rule-based routing, choose **Rule** and select **Apply**.

Choosing a global outbound also selects Global mode. In Global mode, choose a target to enable **Apply**. Changing the selection alone does not apply it. Select **Read-only** to inspect a write restriction; **Not provided by this backend** means the backend offers no configuration this control can edit.


## Find why a connection used an outbound {#why-outbound}

1. Open **Connections** → **List** and select the connection.
2. Read **Outbound**, **Chain** and **Rule** in its details.
3. In **More actions**, choose **Show matched rule** when available to open the matching rule.
4. To test the current configuration, choose **Trace this connection** and then **Run trace**.

A trace evaluates routing; it does not replay the connection. For availability and interpretation, see [trace requirements](feature-requirements.md#req-routing-trace) and [connection details](observe.md#connections).


## Check how a domain resolves {#dns-resolution}

Check [DNS query requirements](feature-requirements.md#req-dns-query).

1. Open **DNS** → **Query**.
2. Enter **Domain** and choose **Type**.
3. If **Upstream** appears, leave **Automatic** to follow the configured DNS routing, or select a named upstream.
4. **Bypass cache** is off by default. Enable it when the diagnostic lookup must bypass cached answers.
5. Select **Query**. Read the answers, status, upstream and routing information in the result.

To inspect recorded traffic instead, open **Resolution log**. See [DNS data and its limits](observe.md#dns).


## Update geodata {#update-geodata}

Check [manual update requirements](feature-requirements.md#req-geodata-update) before starting.

1. Open **Settings** and find **Geodata**.
2. Select **Update now**.
3. Wait for the operation to finish, then check its notice and the asset details.
4. If it fails, use the reported stage in [geodata update failures](troubleshooting.md#geodata-update).

Changing sources or the schedule is a separate task: see [geodata settings](config-and-settings.md#geodata) and [where those changes are stored](what-doona-can-change.md#change-geodata).


## Reload after editing files outside doona {#reload-honk}

First check whether the setting needs a [reload or a restart](what-doona-can-change.md). The reload action also has [backend requirements](feature-requirements.md#req-reload-suspend).

1. Select **Reload honk** in the top bar. On a narrow screen, find it under **More options**.
2. Select **Reload honk** in the confirmation dialog.
3. Check the result notice before making another change.

Reload does not apply the [held rules](routing.md#held-rules). Use their apply action separately.


## Resolve a file changed by another editor {#changed-on-disk}

1. Open **Configuration** → **Config files** and choose the file in **Config file**.
2. If the page reports a disk change, compare your draft with the current file before deciding what to keep.
3. To discard your draft, select **Cancel**. The editor returns to the current source.
4. To replace the current source with your draft, select **Keep changes**, then **Apply**. Check the result and read the file back.

**Keep changes** does not merge the two versions. For a refused write, see [read-only files and write errors](troubleshooting.md#read-only).

</div>
