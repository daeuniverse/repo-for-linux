---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Quick start {#title-quick-start}

Use the doona interface embedded in honk without downloading separate UI files.

Check the [gateway requirements](requirements.md) first. For a new backend, prepare honk's [minimal configuration](/honk/how-to-start#minimal-configuration) before enabling the API.

## 1. Get honk {#1-get-honk}

Install honk using the [honk installation guide](/honk/installation/); on OpenWrt, the [daeuniverse feed](/openwrt/) already ships it. The embedded doona needs the `full` build.

## 2. Configure honk {#2-configure-honk}

Add a `native_api` block with `enabled: true`, a `listen` address, `password_auth: true` and `config_write: true` to the honk configuration. honk's [Web UI and APIs](/honk/how-to-start#web-ui-and-apis) section shows the complete block, including `ui: 'embedded'`; for doona lite, set `ui: 'embedded-lite'` as described in [doona lite](lite.md).

[Start or restart honk](service-management.md) to apply the change.

## 3. Open doona {#3-open-doona}

On the machine running honk, open <http://127.0.0.1:9527/>.

With the OpenWrt feed's default configuration, open `http://<router LAN IP>:9527/` from a computer on the LAN, for example <http://192.168.1.1:9527/>. Use the IP address; honk refuses host names such as `openwrt.lan`.

For another router that listens on `127.0.0.1`, run this command on your computer, replacing `<router>` with its SSH address, and keep the connection open:

```sh
ssh -L 9527:127.0.0.1:9527 root@<router>
```

Open the same URL on your computer. The first visit creates the administrator; see [First sign-in](first-sign-in.md).

</div>
