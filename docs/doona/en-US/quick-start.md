---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Quick start {#title-quick-start}

Use the doona interface embedded in honk without downloading separate UI files.

Check the [gateway requirements](requirements.md) first. Keep your existing honk configuration; for a new backend, prepare honk's [minimal configuration](https://github.com/daeuniverse/honk/blob/main/doc/en/how-to-start.md#minimal-configuration) before adding the API block below.

## 1. Get honk {#1-get-honk}

On 64-bit OpenWrt or ImmortalWrt 25.12, install honk from the [daeuniverse feed](/openwrt/).

On other Linux systems, follow [Install honk](install.md#install) and choose an archive whose name contains `full` from [honk releases](https://github.com/daeuniverse/honk/releases).

## 2. Configure honk {#2-configure-honk}

The daeuniverse OpenWrt feed already ships this block, listening on the LAN instead of `127.0.0.1`; skip to step 3. Elsewhere, add this block to the honk configuration, replacing any existing `native_api` block:

```dae
experimental {
    native_api {
        enabled: true
        listen: '127.0.0.1:9527'
        password_auth: true
        config_write: true
        ui: 'embedded'
    }
}
```

To run doona lite instead, set `ui: 'embedded-lite'` (available from honk v0.1.0-beta.4); see [doona lite](lite.md).

For other options, see [Configuration](configuration.md). [Start or restart honk](service-management.md) to apply the change.

## 3. Open doona {#3-open-doona}

On the machine running honk, open <http://127.0.0.1:9527/>.

With the OpenWrt feed's default configuration, open `http://<router LAN IP>:9527/` from a computer on the LAN, for example <http://192.168.1.1:9527/>. Use the IP address; honk refuses host names such as `openwrt.lan`.

For another router that listens on `127.0.0.1`, run this command on your computer, replacing `<router>` with its SSH address, and keep the connection open:

```sh
ssh -L 9527:127.0.0.1:9527 root@<router>
```

Open the same URL on your computer. The first visit creates the administrator; see [First sign-in](first-sign-in.md).

</div>

---

Source: [doona-docs](https://github.com/Zakkaus/doona-docs), licensed under [CC BY 4.0](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt).
