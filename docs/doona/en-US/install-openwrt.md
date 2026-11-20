---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Install on OpenWrt {#title-install-on-openwrt}

Install doona v0.1.0-rc.6 and honk on an OpenWrt router. Run every command in a root shell on the router and keep the same shell open throughout the installation.

## Quick install from the daeuniverse feed {#quick-install-from-the-daeuniverse-feed}

On supported 64-bit OpenWrt or ImmortalWrt 25.12 routers, install honk from the [daeuniverse feed](/openwrt/); honk's [OpenWrt installation](/honk/how-to-start#openwrt) describes the feed's package and service. Then follow [Quick start](quick-start.md) to configure its embedded doona. The steps below are the manual archive route for routers the feed does not support; choose one route.

## 1. Check the router and prepare tools {#1-check-the-router-and-prepare-tools}

Check storage for installed files and the download directory:

```sh
df -h / /tmp
```

OpenWrt 25.12 uses apk-tools 3; OpenWrt 24.10 and earlier use opkg and ipk packages. Install the download tools for the router’s package manager:

::: code-group

```sh [apk]
apk update
apk add curl ca-bundle
```

```sh [opkg]
opkg update
opkg install curl ca-bundle
```

:::

For kernel, BTF, cgroup and kernel-module requirements, use honk's [Linux kernel requirements](/honk/how-to-start#linux-kernel-requirements) and [OpenWrt installation](/honk/how-to-start#openwrt). A matching doona package does not establish that the router can run honk.

## 2. Download and verify doona {#openwrt-packages}

These packages install the standard edition. For lite, use the archive route in [manual installation](install-manual.md), omitting `sudo`, then return at step 4.

Download into `/tmp/doona` and choose the package format used by the firmware. The OpenWrt apk packages are separate from Alpine’s packages.

`/tmp` uses RAM and loses its contents at reboot. Allow space for both the downloaded honk archive and its extracted directory at the same time.

```sh
mkdir -p /tmp/doona
cd /tmp/doona
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.6
```

::: code-group

```sh [apk]
FILE=doona-0.1.0_rc6-r1.apk
curl -fL -O "$BASE/$FILE" -O "$BASE/doona-openwrt.adb" \
  -O "$BASE/doona-openwrt.pem" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-openwrt.adb"' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-openwrt.pem"' SHA256SUMS | sha256sum -c -
```

```sh [opkg]
FILE=doona_0.1.0-rc.6-1_all.ipk
curl -fL -O "$BASE/$FILE" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
```

:::

Continue only when every selected file reports `OK`. If verification fails or finds no checksum line, check the filenames and download again before installing.

For download or binary errors, see [Installation errors](install.md#installation-errors).

## 3. Install the package {#3-install-the-package}

For apk, install the verified public key and use the signed index. Keep the index and package files in the same directory.

::: code-group

```sh [apk]
mkdir -p /etc/apk/keys
cp /tmp/doona/doona-openwrt.pem /etc/apk/keys/doona-openwrt.pem
apk add -X /tmp/doona/doona-openwrt.adb doona
```

```sh [opkg]
opkg install "/tmp/doona/$FILE"
```

:::

Without the release key and index, you can install a verified local apk directly:

```sh
apk add --allow-untrusted "/tmp/doona/$FILE"
```

This skips signature trust checking, so verify the package’s SHA-256 entry before using this alternative.

```sh
ls -l /usr/share/doona/index.html
```

The last command must list `index.html`. Use the [separate UI configuration](install.md) with this directory.

### Optional packages {#optional-packages}

Choose [optional assets](install.md#doona) only if you need them. Download the chosen file into `/tmp/doona` and verify its individual entry in `SHA256SUMS` as in step 2.

| Package | apk filename | opkg filename |
| --- | --- | --- |
| `doona-fonts` | `doona-fonts-0.1.0_rc6-r1.apk` | `doona-fonts_0.1.0-rc.6-1_all.ipk` |
| `doona-precompressed` | `doona-precompressed-0.1.0_rc6-r1.apk` | `doona-precompressed_0.1.0-rc.6-1_all.ipk` |

For apk, repeat the install command with the chosen package name instead of `doona`. For opkg, set `FILE` to the chosen filename and repeat the install command.

## 4. Install honk {#4-install-honk}

For the manual route, install a musl release at `/usr/bin/honk-core` as described in honk's [OpenWrt installation](/honk/how-to-start#openwrt), then return here. Follow honk's instructions for `apk add honk@daeuniverse` if you use the feed instead.

After verifying the installed binary, remove its downloaded archive and extracted directory using their absolute paths. Once you have installed all chosen optional UI packages, remove the downloaded doona packages, index, key copy, and checksums from `/tmp/doona` using their absolute paths. Keep any downloads still needed for installation.

## 5. Prepare the data directory {#install-geodata}

Set `global.data_dir` to `/etc/honk/data` and install geodata as described in honk's [GeoIP and Geosite](/honk/how-to-start#geoip-and-geosite). Only download geodata when your rules need it; see [geodata requirements](feature-requirements.md#req-geodata).

## Preserve configuration across sysupgrade {#preserve-configuration-across-sysupgrade}

Follow honk's [OpenWrt procd](/honk/how-to-start#run-with-openwrt-procd) section to add `/etc/honk/` and the init script to the sysupgrade backup list.

After upgrading, repeat steps 1–3 to reinstall the download tools and UI packages, and reinstall honk using step 4. Keep the restored configuration and data, then [enable and start the service](service-management.md).

Check the [service log](/honk/how-to-start#service-logs), then follow [First sign-in](first-sign-in.md).

</div>
