---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Service management {#title-service-management}

Configure honk with [Quick start](quick-start.md) or the [separate UI setup](install.md), then use this page to manage a manually installed service and read its logs. For a feed installation, use the [feed’s service instructions](/openwrt/) instead; do not create a second service.

## 1. Create the service {#1-create-the-service}

Choose the section for your service manager. If a honk service already exists, inspect its executable and configuration paths before replacing it. The examples below use the paths from this site’s installation guides.

### systemd {#systemd}

Run on the gateway. In a root shell, omit `sudo`. This unit uses `/usr/local/bin/honk-core` and `/etc/honk/config.dae`.

```sh
sudo install -d -m 0700 /var/lib/honk
sudo tee /etc/systemd/system/honk-core.service > /dev/null <<'EOF'
[Unit]
Description=honk transparent proxy engine
Wants=network-online.target
After=network-online.target

[Service]
Type=notify
User=root
WorkingDirectory=/var/lib/honk
ExecStart=/usr/local/bin/honk-core --config /etc/honk/config.dae --disable-timestamp
ExecReload=/usr/local/bin/honk-core reload
Restart=on-failure
RestartSec=2s
TimeoutStopSec=30s
LimitNOFILE=1048576
LimitMEMLOCK=infinity
UMask=0077

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
```

The unit follows [honk’s systemd example](https://github.com/daeuniverse/honk/blob/main/doc/en/how-to-start.md#run-with-systemd). Check that guide before adding privilege restrictions to the service.

### OpenWrt procd {#openwrt-procd}

Run as root on the router. This script uses `/usr/bin/honk-core` and the data directory prepared by [OpenWrt installation](install-openwrt.md#install-geodata).

```sh
cat > /etc/init.d/honk-core <<'EOF'
#!/bin/sh /etc/rc.common

START=99
STOP=10
USE_PROCD=1

start_service() {
    procd_open_instance
    procd_set_param command /usr/bin/honk-core --config /etc/honk/config.dae --data-dir /etc/honk/data --disable-timestamp
    procd_set_param limits nofile="1048576 1048576"
    procd_set_param env MIMALLOC_PURGE_DELAY=0
    procd_set_param respawn
    procd_set_param stdout 1
    procd_set_param stderr 1
    procd_close_instance
}

reload_service() {
    /usr/bin/honk-core reload
}
EOF
chmod 0755 /etc/init.d/honk-core
```

`MIMALLOC_PURGE_DELAY=0` requests immediate purging from mimalloc. See [honk’s CLI reference](https://github.com/daeuniverse/honk/blob/main/doc/en/reference/cli.md) for this setting.

## 2. Enable and start honk {#2-enable-and-start-honk}

::: code-group

```sh [systemd]
sudo systemctl enable --now honk-core
sudo systemctl status honk-core
```

```sh [OpenWrt]
/etc/init.d/honk-core enable
/etc/init.d/honk-core start
/etc/init.d/honk-core status
```

:::

For systemd, look for `active (running)`. On OpenWrt, the status should report `running`. Open doona as described in [Quick start](quick-start.md) to confirm that the listener is reachable.

Check the current startup log for `native API listener ready` and `honk-core is running`. At the API listener's `/api` address, a JSON response whose `auth` object has `setup_required` set to `true` means the API is reachable and no administrator exists yet. API access alone does not prove that the real eBPF backend can route traffic.

Read startup diagnostics even when honk starts successfully: the parser warns about and ignores unknown scalar keys in `global`.

## Read the logs {#read-the-logs}

::: code-group

```sh [systemd]
sudo journalctl -u honk-core -e
```

```sh [OpenWrt]
logread -e honk-core
```

:::

To follow new messages, use `sudo journalctl -u honk-core -f` on systemd or `logread -f -e honk-core` on OpenWrt. Press Ctrl+C to stop following. If startup fails, use the error in the log with [Troubleshooting](troubleshooting.md#troubleshooting).

The journal includes earlier service runs. Diagnose the current start from the latest `honk-core … starting` message, which also reports the engine version.

## Reload, restart, or stop {#reload-restart-or-stop}

Check [What doona can change](what-doona-can-change.md) before choosing reload or restart. After either command, read the log to confirm the result.

| Task | systemd | OpenWrt |
| --- | --- | --- |
| Start | `sudo systemctl start honk-core` | `/etc/init.d/honk-core start` |
| Reload configuration | `sudo systemctl reload honk-core` | `/etc/init.d/honk-core reload` |
| Restart | `sudo systemctl restart honk-core` | `/etc/init.d/honk-core restart` |
| Stop | `sudo systemctl stop honk-core` | `/etc/init.d/honk-core stop` |
| Disable startup at boot | `sudo systemctl disable honk-core` | `/etc/init.d/honk-core disable` |

Disabling startup at boot does not stop a running service. To keep honk stopped after reboot, run both stop and disable.

## Service and reload errors {#service-and-reload-errors}

| Symptom or log message | Meaning and next step |
| --- | --- |
| systemd cannot find `honk-core.service` | Create the unit using step 1, run `sudo systemctl daemon-reload`, then start it using step 2. |
| Reload reports `no running honk-core instance` | No real instance holds the process lock. A foreground process using `--mock-ebpf` does not hold that lock. Start the intended real service using step 2. |
| `SIGHUP reload applied` | honk applied the new configuration. |
| `SIGHUP reload rejected` | Read the accompanying `stage` and errors to determine whether honk applied the new configuration. For a restart-required rejection, edit the listed settings on the host and [restart honk](what-doona-can-change.md). |
| `SIGHUP reload committed with degraded datapath` | honk committed the configuration, but the datapath remains degraded. Read the accompanying errors before treating the service as healthy. |

A successful reload command alone does not prove that honk applied the configuration; check the service log for the outcome.

## OpenRC or a foreground test {#openrc-or-a-foreground-test}

This page does not provide an OpenRC service script. After configuring honk, stop any existing instance before running it in a terminal to complete the first sign-in:

```sh
sudo /usr/local/bin/honk-core --config /etc/honk/config.dae
```

Keep the terminal open and use the browser steps in [Quick start](quick-start.md). Logs appear in the terminal; Ctrl+C stops honk. This command does not enable startup at boot.

Stop the foreground process before starting the service. If you use `--mock-ebpf` for a startup check, it does not test real eBPF attachment or routing. Expect the warning `NFQUEUE is unavailable at startup; continuing with NFQUEUE staging disabled` when its reason is `the mock eBPF backend was selected`.

</div>

---

Source: [doona-docs](https://github.com/Zakkaus/doona-docs), licensed under [CC BY 4.0](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt).
