---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Service management {#title-service-management}

Configure honk with [Quick start](quick-start.md) or the [separate UI setup](install.md). Use honk's [Run with systemd](/honk/how-to-start#run-with-systemd), [Run with OpenWrt procd](/honk/how-to-start#run-with-openwrt-procd), [Service logs](/honk/how-to-start#service-logs) and [Reload and stop](/honk/how-to-start#reload-and-stop) for the service script, startup markers, log commands and reload outcomes. On the OpenWrt feed, use its service as described in the [feed guide](/openwrt/); do not create a second one.

doona needs the `/ui/` listener and a writable configuration source; [Quick start](quick-start.md) sets both. Check [What doona can change](what-doona-can-change.md) before reloading or restarting, then restart honk after changing the `experimental.native_api` block and reload the doona page.

</div>
