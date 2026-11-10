---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Install on OpenWrt {#title-install-on-openwrt}

Install doona v0.1.0-rc.6 and honk on an OpenWrt router. Run every command in a root shell on the router and keep the same shell open throughout the installation.

## Quick install from the daeuniverse feed {#quick-install-from-the-daeuniverse-feed}

On supported 64-bit OpenWrt or ImmortalWrt 25.12 routers, install honk from the [daeuniverse feed](/openwrt/), then follow [Quick start](quick-start.md) to configure its embedded doona. The steps below are the manual archive route, an alternative for routers the feed does not support. The feed package and the manual route use different service names and data directories; choose one route.

## 1. Check the router and prepare tools {#1-check-the-router-and-prepare-tools}

Check the [backend prerequisites](install.md#install), including the kernel, BTF, cgroup, and CPU requirements, before downloading. A matching doona package does not establish that the router can run honk. Check storage for installed files and the download directory:

```sh
uname -r
uname -m
df -h / /tmp
```

OpenWrt 25.12 uses apk-tools 3; OpenWrt 24.10 and earlier use opkg and ipk packages. Stock OpenWrt 24.10 uses [Linux 6.6](https://github.com/openwrt/openwrt/blob/openwrt-24.10/target/linux/x86/Makefile), below honk’s minimum kernel requirement linked above. Installing a matching UI package does not resolve that incompatibility.

Choose the commands for the router’s package manager. OpenWrt provides the [veth module](https://github.com/openwrt/openwrt/blob/openwrt-25.12/package/kernel/linux/modules/netsupport.mk) and [NFQUEUE modules](https://github.com/openwrt/openwrt/blob/openwrt-25.12/package/kernel/linux/modules/netfilter.mk) as packages:

::: code-group

```sh [apk]
apk update
apk add curl ca-bundle kmod-veth kmod-nft-queue
```

```sh [opkg]
opkg update
opkg install curl ca-bundle kmod-veth kmod-nft-queue
```

:::

If NFQUEUE lacks prerequisites despite its enabled setting, honk can continue running without NFQUEUE staging and issue a startup warning. Check the [service log](service-management.md); successful service startup does not confirm active NFQUEUE staging.


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

Follow [Install honk](install.md#install) in a separate download directory so its `SHA256SUMS` does not replace doona’s. Choose a musl build and the OpenWrt installation tab, which installs `/usr/bin/honk-core`. Then return here.

After verifying the installed binary, remove its downloaded archive and extracted directory using their absolute paths. Once you have installed all chosen optional UI packages, remove the downloaded doona packages, index, key copy, and checksums from `/tmp/doona` using their absolute paths. Keep any downloads still needed for installation.


## 5. Prepare the data directory {#install-geodata}

For this manual route, set `global.data_dir` to `/etc/honk/data` in the [honk configuration](configuration.md#config), then prepare the persistent directory:

```sh
mkdir -p /etc/honk/config.d /etc/honk/data
chmod 0700 /etc/honk /etc/honk/config.d /etc/honk/data
```

Only download geodata when your rules need it; see [geodata requirements](feature-requirements.md#req-geodata). For this layout:

```sh
curl -fL --retry 3 -o /etc/honk/data/geosite.dat \
  https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geosite.dat
curl -fL --retry 3 -o /etc/honk/data/geoip.dat \
  https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geoip.dat
```

Alternatively, install the distribution’s [v2ray geodata packages](https://github.com/openwrt/packages/blob/openwrt-25.12/net/v2ray-geodata/Makefile) instead of downloading the files above:

::: code-group

```sh [apk]
apk add v2ray-geosite v2ray-geoip
```

```sh [opkg]
opkg install v2ray-geosite v2ray-geoip
```

:::

honk searches `/usr/share/dae`, but not `/usr/share/v2ray` directly. Check for existing files or links under `/usr/share/dae`; create any missing links as follows:

```sh
mkdir -p /usr/share/dae
ln -s ../v2ray/geosite.dat /usr/share/dae/geosite.dat
ln -s ../v2ray/geoip.dat /usr/share/dae/geoip.dat
```

Files already present in the configured data directory take precedence over these packaged files.

Use the OpenWrt service in [Service management](service-management.md), not the feed service.

## Preserve configuration across sysupgrade {#preserve-configuration-across-sysupgrade}

Before a normal sysupgrade that preserves configuration, add these paths to `/etc/sysupgrade.conf` if they are not already listed, then check the [backup list](https://github.com/openwrt/openwrt/blob/openwrt-25.12/package/base-files/files/sbin/sysupgrade):

```sh
printf '%s\n' '/etc/honk/' '/etc/init.d/honk-core' >> /etc/sysupgrade.conf
sysupgrade -l
```

Confirm that the list includes your honk configuration, data files, and init script. This configuration backup does not restore installed kernel modules, `/usr/bin/honk-core`, or `/usr/share/doona`.

After upgrading, repeat steps 1–4 to reinstall the tools, kernel modules, UI packages, and honk binary. If you chose packaged geodata, reinstall it and recreate its links using step 5. Keep the restored configuration and data, then [enable and start the service](service-management.md).

Check the [service log](service-management.md), then follow [First sign-in](first-sign-in.md).

</div>
