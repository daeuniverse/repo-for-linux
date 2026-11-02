---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Route your first connection {#title-route-your-first-connection}

Continue from [Quick start](quick-start.md), with honk running and your administrator signed in. You need a working HTTP or HTTPS subscription URL and shell access to the gateway. This exercise sends `example.com` through a new group named `proxy` and leaves other traffic direct. Use `harbor` for the subscription name.

Start with a direct-only configuration: `fallback: direct`, no DNS block, and no existing `harbor` subscription or `proxy` group. Keep API credentials in a separate include so the main file remains editable; see the [configuration example](configuration.md). At this point, `example.com` uses the `direct` fallback. After adding the proxy rule in step 3, verify in step 6 that its outbound is `proxy`.

## 1. Add the subscription {#1-add-the-subscription}

Open **Nodes** and select **Add subscription**. Enter `harbor` in **Name** and your provider's URL in **Subscription URL**, then select **Add**. doona writes the declaration and requests a refresh.

Check that the success notice reports nodes and that selecting `harbor` lists its nodes. If doona saved the declaration but the fetch failed, resolve the reported error, then use **Update harbor** on its card. Continue only when the subscription has proxy nodes.

For disabled controls, check [node and subscription requirements](feature-requirements.md#req-nodes) or [refresh requirements](feature-requirements.md#req-subscription-refresh).

## 2. Create the group {#2-create-the-group}

Open **Policies** and select **New group**. Enter `proxy` in **Group name**. Set **Selection policy** to **Fastest on average**. In **Subscriptions**, select `harbor` and check **Matching nodes** before selecting **Create**.

The `proxy` card must appear with the subscription's members. Expand it to inspect the selected member and its latency or health status. Do not continue with an empty group. For disabled controls, see [group creation and editing requirements](feature-requirements.md#req-group-edit).

## 3. Send the test domain through the group {#3-send-the-test-domain-through-the-group}

Open **Rules** → **Routing rules**. Select **Advanced** if the view switch appears, then **Add rule**.

| Field | Value |
| --- | --- |
| **Condition form** | **Select** |
| **Match by** | **Full domain** |
| **Values** | `example.com` |
| **Outbound** | `proxy` |
| **Insert** | **Last, before the fallback** |

Select **Add rule** in the dialog. This writes and reloads immediately. Check the notice **New rule is in effect** and the new rule:

```dae
domain(full: example.com) -> proxy
```

Keep `fallback: direct`. If you cannot add a rule, see [routing rule requirements](feature-requirements.md#req-rules).

## 4. Define a DNS upstream {#4-define-a-dns-upstream}

Open **Configuration** → **Config files**, select `/etc/honk/config.dae` in **Config file**, and append the following block after the existing sections. Keep the subscription, group and routing rule you just created.

```dae
# Send selected DNS requests through the proxy group.
dns {
    # Use a numeric server address to avoid bootstrapping its hostname.
    upstream {
        remote_dns: 'https://1.1.1.1/dns-query' -> proxy
    }
    # Keep other requests at their original destination.
    routing {
        request {
            fallback: asis
        }
    }
}
```

Select **Apply**. Wait for the notice confirming the file write and configuration reload. Reopen the file and check that `remote_dns` is present. For a disabled editor or **Apply** button, see [configuration write requirements](feature-requirements.md#req-config-edit).

## 5. Add the DNS rule and apply it {#5-add-the-dns-rule-and-apply-it}

Open **Rules** → **DNS rules**. In **Request rules**, select **Add rule**. Set **Match by** to **Full domain**, enter `example.com` in **Values**, choose `remote_dns` in **Action**, and set **Insert** to **Last, before the fallback**.

Select **Add rule** to write and reload. Check **New rule is in effect** and the request rule:

```dae
qname(full: example.com) -> remote_dns
```

The routing rule chooses the traffic's group; the DNS rule chooses the resolver whose requests use that group. Each save above applies separately. If you cannot add a rule, see [DNS rule requirements](feature-requirements.md#req-rules).

## 6. Verify the rule with Trace simulation {#6-verify-the-rule-with-trace-simulation}

On **Rules**, open **Trace simulation**. Set **Network protocol** to **TCP**, **Domain** to `example.com`, and **Destination port** to `443`. Leave **Destination IP** empty, choose **No resolution (none)** in **Resolution mode**, and select **Run trace**.

The result must match your domain rule and show `proxy` as the outbound, with a node from `harbor` in the node chain. Repeat with `example.net`: its outbound must be `direct`. Trace simulates rule evaluation; it does not open a connection or prove that the proxy can reach the website. For disabled controls, see [routing trace requirements](feature-requirements.md#req-routing-trace).

## 7. Observe a real connection {#7-observe-a-real-connection}

Open **Connections** before making the request. On the gateway, run:

```sh
curl --http1.1 --limit-rate 32 https://example.com/ -o /dev/null
```

While it transfers, look for `example.com` on **Connections** and open its row. Check that the chain uses `proxy` and one of `harbor`'s nodes. Short connections can finish before you inspect them; repeat the request if necessary. A successful transfer confirms that the route carries real traffic. For an unavailable page, see [connection requirements](feature-requirements.md#req-connections).

honk handles proxied traffic in userspace, so it appears in Connections. The kernel forwards direct traffic, which does not appear there. Use [Trace](routing.md#trace) to inspect the direct fallback, and the [configuration reference](configuration.md#config) for the complete file example.

</div>

---

Source: [doona-docs](https://github.com/Zakkaus/doona-docs), licensed under [CC BY 4.0](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt).
