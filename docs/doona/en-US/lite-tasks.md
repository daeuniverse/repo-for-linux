---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Common tasks in doona lite {#lite-tasks}

Import nodes and edit honk configuration after [connecting lite](lite-connect.md). Check [configuration write requirements](feature-requirements.md#req-config-edit), [full validation requirements](feature-requirements.md#req-validation), and the [lite backend requirements](editions.md#backend-requirements) if editing is unavailable.

## Apply a draft {#apply-a-draft}

After editing a subscription, group, routing, DNS or global setting:

1. Select **Review and apply**.
2. Check the proposed changes, then select **Apply**.
3. Wait for **Configuration saved and applied.**, then check the resource again. If the notification reports a failure or unconfirmed result, read it before retrying.

Node imports use the immediate apply flow described below. See [What doona can change](what-doona-can-change.md) for storage and activation rules.


## Import nodes from share links {#lite-task-import}

1. Open **Nodes** and select **Add node**.
2. Select **Paste links** and paste one link per line in **Share links**.
3. Check the recognized nodes and correct invalid lines.
4. Select **Add** for one node or **Add N nodes** for several. This writes and applies the nodes immediately; check that they appear in the list.

See [node requirements](feature-requirements.md#req-nodes) and [syntax validation](feature-requirements.md#req-validation) if import is unavailable.


## Add a subscription {#lite-task-subscription}

1. Open **Subscriptions** and select **Add subscription**.
2. Enter **Subscription link**. Fill in **Name (optional)** or leave it empty to use the suggested name.
3. Select **Save**. The new row is a draft.
4. Follow **Apply a draft** above, then check the subscription's nodes.

Editing and deleting subscriptions use the same review flow. For a failed fetch, check [subscription refresh requirements](feature-requirements.md#req-subscription-refresh).


## Create a group {#lite-task-group}

1. Open **Groups** and select **Create group**.
2. Enter **Name**, choose **Manual choice** under **Policy**, then select **Create**.
3. In **Edit group**, find a node under **Available nodes and subscriptions** and select its **Add** button. Confirm that it appears under **In this group**.
4. Follow **Apply a draft** above, then check the group's members.

For group controls, see [group editing requirements](feature-requirements.md#req-group-edit).


## Add a domain rule {#lite-task-rule}

1. Open **Routing** and select **Add rule**.
2. Choose **Domain and subdomains**, enter `example.com` in **Values**, and press Enter.
3. Choose the destination group under **Goes to**, choose **Position**, then select **Add**.
4. Follow **Apply a draft** above, then check that the domain rule appears.

**Rebuild rules from a template** replaces rules in the draft. Review the replacement before applying it. See [rule requirements](feature-requirements.md#req-rules) if editing is unavailable.


## Add a DNS server {#lite-task-dns}

1. Open **DNS** and select **Add DNS server**.
2. Choose **Custom** under **Provider**, enter a unique **Name** and a **Server address**, such as `tls://1.1.1.1:853`, then select **Add**.
3. Open the server's **Actions** menu and select **Set as default**.
4. Follow **Apply a draft** above and check the server and default rule.

For configuration fields, see [Configuration](configuration.md). For write conditions, see [rule requirements](feature-requirements.md#req-rules).


## Change a global setting {#lite-task-setting}

1. Open **Settings** and choose **Sniffing**.
2. Set **Sniffing timeout** to `200` and **Duration unit** to `ms`.
3. Follow **Apply a draft** above, then reopen the setting to check its value.

Restart-only settings show read-only values with a **Copy** button for the configuration line. Copy the line, edit the file's `global` section on the honk host, then restart honk. Copying the displayed restart command does not execute it. See [restart-only global settings](what-doona-can-change.md#restart-global) and the [configuration reference](configuration.md).


## Share a manual node {#lite-task-share}

1. Open **Nodes** and find the manually added node.
2. Open its **Actions** menu and select **Share**.
3. Select **Copy link** or scan the QR code. If copying is unavailable, select and copy the displayed link.

Subscription nodes do not expose share links here. If a link is too long for a QR code, copy the link. Share links contain connection credentials; share them only with intended recipients.

</div>
