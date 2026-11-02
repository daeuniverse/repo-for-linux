---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# doona lite {#lite}

doona lite provides forms for common honk configuration tasks. It is a preview in testing; see the [edition comparison](editions.md) before choosing it for your gateway.

Use **Nodes**, **Subscriptions**, **Groups**, **Routing** and **DNS** to manage resources, and **Settings** for global settings. Begin with [Connect doona lite](lite-connect.md), then follow [Common tasks](lite-tasks.md).

![Nodes](/doona/images/lite-nodes-light.webp)


## Install doona lite {#lite-install}

honk embeds doona lite starting with v0.1.0-beta.4. Install honk as described in [Quick start](quick-start.md), then add this block to its configuration, replacing any existing `native_api` block:

```dae
experimental {
    native_api {
        enabled: true
        listen: '127.0.0.1:9527'
        password_auth: true
        config_write: true
        ui: 'embedded-lite'
    }
}
```

For a separate installation, use the lite archive in [Manual installation](install-manual.md); lite has no distribution packages.

After either choice, apply the [UI restart rule](what-doona-can-change.md#restart-native), open the address from [Quick start](quick-start.md), then [connect doona lite](lite-connect.md).


## Switch to the standard edition {#lite-switch}

Follow [Install and switch editions](editions.md#editions-switch) to select the standard edition's files or embedded UI.

</div>

---

Source: [doona-docs](https://github.com/Zakkaus/doona-docs), licensed under [CC BY 4.0](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt).
