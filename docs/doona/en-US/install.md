---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Install doona separately {#title-install-doona-separately}

Install separate UI files when you do not want honk's embedded doona. For the embedded interface, use [Quick start](quick-start.md).

## Choose your system {#choose-your-system}

| System | Guide |
| --- | --- |
| Debian or Ubuntu | [Install with APT](install-debian.md) |
| Fedora or RHEL | [Install with DNF](install-fedora.md) |
| Arch Linux | [Install with pacman](install-arch.md) |
| Gentoo | [Install with Portage](install-gentoo.md) |
| OpenWrt | [Install on the router manually](install-openwrt.md) |
| Alpine or another Linux distribution | [Install an archive or Alpine package](install-manual.md) |

These packages install static web files. Backend installation, configuration, and service startup are separate steps. For the edition choice, see [Standard and lite](editions.md).

After installing the UI files and a compatible honk, add this block to its configuration, replacing any existing `native_api` block:

```dae
experimental {
    native_api {
        enabled: true
        listen: '127.0.0.1:9527'
        password_auth: true
        config_write: true
        ui: '/usr/share/doona'
    }
}
```

Use the package's directory containing `index.html`; Debian and Ubuntu use `/usr/share/doona-web`. For a manual extraction, use its directory. See [UI files](#doona), [other API options](configuration.md#config), and [other origins or reverse proxies](#other-origin).


## Install honk {#install}

Check the [kernel and host requirements in honk’s guide](https://github.com/daeuniverse/honk/blob/main/doc/en/how-to-start.md#linux-kernel-requirements). Keep console access available for the first start. Install `curl`, CA certificates, `tar`, and `sha256sum` before downloading.

### 1. Choose and download a backend build {#1-choose-and-download-a-backend-build}

Open [honk releases](https://github.com/daeuniverse/honk/releases). Choose a `full` or `native-api` archive for your gateway and copy its download link. The `clash-api` variant cannot serve doona’s native API. Backend releases have their own versions; do not use the doona version to construct a honk download URL.

```sh
uname -m
```

| Selection | What to choose |
| --- | --- |
| CPU | Match `x86_64` or `aarch64` to `uname -m`. |
| C library | Use `musl` for a static gateway build, including OpenWrt and Alpine. |
| API variant | `full` includes the native API and embedded UI; `native-api` serves the UI files installed separately. |
| Allocator | `-stock` uses the system allocator; builds without it use mimalloc. |

In a new download directory on the gateway, run this block and paste the archive’s download link at the prompt:

```sh
printf 'honk archive URL: '
read -r HONK_URL
```

Then download the archive and its release’s checksums in the same shell:

```sh
HONK_ARCHIVE=${HONK_URL##*/}
curl -fL -O "$HONK_URL" -O "${HONK_URL%/*}/SHA256SUMS"
```

### 2. Verify and extract the archive {#2-verify-and-extract-the-archive}

```sh
awk -v file="$HONK_ARCHIVE" '$2 == file' SHA256SUMS | sha256sum -c -
```

Continue only when every selected file reports `OK`. If verification fails or finds no checksum line, check the filenames and download again before installing.

```sh
tar -xzf "$HONK_ARCHIVE"
HONK_PACKAGE=${HONK_ARCHIVE%.tar.gz}
```

### 3. Install the binary {#3-install-the-binary}

For a new installation, choose the tab for your shell. For an update, stop the existing service first using [Service management](service-management.md), then replace the binary.

::: code-group

```sh [sudo]
sudo install -d /usr/local/bin
sudo install -m 0755 "$HONK_PACKAGE/honk-core" /usr/local/bin/honk-core
/usr/local/bin/honk-core --version
```

```sh [root]
install -d /usr/local/bin
install -m 0755 "$HONK_PACKAGE/honk-core" /usr/local/bin/honk-core
/usr/local/bin/honk-core --version
```

```sh [OpenWrt]
cp "$PWD/$HONK_PACKAGE/honk-core" /usr/bin/honk-core
chmod 0755 /usr/bin/honk-core
/usr/bin/honk-core --version
```

:::

The version command must run successfully. Keep the downloaded release name with your installation records.

For an update, keep the existing configuration and [restart the service](service-management.md). Check that its startup log reports the installed engine version.

If you arrived from a distribution guide, return there to finish.

### Build from source instead {#build-from-source-instead}

Follow [honk’s source-build instructions](https://github.com/daeuniverse/honk/blob/main/doc/en/how-to-start.md#build-from-source) for the toolchains, eBPF build, and BTF check. From the honk repository root, replace its final honk-core build command with:

```sh
cargo build --release -p honk-core --features ebpf,native-api
```

`ebpf` supplies the real datapath; `native-api` supplies doona’s API. Install `target/release/honk-core` at the binary path above. Release binaries embed the eBPF object, so you need not install a separate object file.

## Installation errors {#installation-errors}

| Error | What to do |
| --- | --- |
| HTTP 404 when downloading | Check the release tag and exact asset filename. Copy the download link from that release instead of constructing an unverified filename. |
| `GLIBC_* not found` when starting honk | The selected gnu binary requires a newer glibc. Choose the matching static musl build from honk’s release. |
| BusyBox rejects `--ignore-missing` | BusyBox `sha256sum` does not support that option. Use the per-file `awk` and `sha256sum -c -` command shown in these installation guides. Require an `OK` result for the selected file. |


## Install geodata when your rules need it {#directories-and-geodata}

Check [geodata requirements](feature-requirements.md#req-geodata) before adding Geo rules.

Use the data directory selected in your [configuration](configuration.md#config). For the `/var/lib/honk` layout used by the systemd guide, run:

```sh
sudo install -d -m 0700 /var/lib/honk
sudo curl -fL --retry 3 -o /var/lib/honk/geosite.dat \
  https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geosite.dat
sudo curl -fL --retry 3 -o /var/lib/honk/geoip.dat \
  https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/release/geoip.dat
```

In a root shell, omit `sudo`. On OpenWrt, use [its geodata steps](install-openwrt.md#install-geodata). For later updates and their conditions, see [geodata updates](feature-requirements.md#req-geodata-update).


## Install the UI files {#doona}

Follow the distribution guide above or [manual installation](install-manual.md). Use the directory containing `index.html` for the [`ui` setting](configuration.md#config):

| Installation | UI directory |
| --- | --- |
| Debian or Ubuntu package | `/usr/share/doona-web` |
| Other packages or the standard archive instructions | `/usr/share/doona` |
| Lite archive instructions | `/usr/share/doona-lite` |

### Optional assets {#optional-assets}

| Asset | Purpose |
| --- | --- |
| `doona-fonts` | Noto Sans TC and SC fonts for the standard edition. |
| `doona-precompressed` | `.br` and `.gz` copies beside the standard edition’s files for servers that serve precompressed assets. Use the same release as the main package. |

Debian names these `doona-web-fonts` and `doona-web-precompressed`. Package filenames are on each distribution page; archive steps are under [manual installation](install-manual.md).

Precompressed assets use additional disk space; omit them on routers with limited storage. Without the optional font archive, doona uses fallback fonts and does not load the optional font faces. It still requests `fonts/README` to detect the archive’s presence.

### Local builds and packaging recipes {#local-builds-and-packaging-recipes}

The repository supplies [OpenWrt, Alpine, Gentoo and Nix recipes](https://github.com/Zakkaus/doona/blob/main/install/README.md), not yet submitted to their distribution repositories. The AUR `doona-bin` recipe has a separate repository.

For a staged installation, first complete a [local build](development.md). From the doona repository root, run these commands, replacing `/absolute/staging/path` with your staging directory. Both targets accept `DESTDIR` and `PREFIX`; omit the second command if you do not need fonts.

```sh
make install DESTDIR=/absolute/staging/path PREFIX=/usr
make install-fonts DESTDIR=/absolute/staging/path PREFIX=/usr
```

The commands install the UI files under the staging directory’s `usr/share/doona`.


## Serve the UI through another address {#other-origin}

Use the [native API settings](configuration.md#config) for listener, UI directory, Host, and Origin configuration. Check [sign-in requirements](feature-requirements.md#req-sign-in) before using a hostname or reverse proxy.

### Hostnames and static-file 403 errors {#hostnames-and-static-file-403-errors}

For `http://owrt.lan:9527/ui/`, add these entries inside the existing `experimental.native_api` block, retaining its other settings and allowlist entries:

```dae
allowed_hosts: 'owrt.lan:9527'
allow_origins: 'http://owrt.lan:9527'
```

`allowed_hosts` takes a hostname and port without a scheme or path. `allow_origins` takes the scheme, hostname and port without a path or trailing slash. For multiple entries, quote each separately and separate them with commas, as in `allowed_hosts: 'owrt.lan:9527', 'router.lan:9527'`. Do not use JSON brackets or quote the whole list. Allowing a Host does not automatically allow its Origin.

If HTML loads but JavaScript or CSS returns 403, inspect the failing requests in the browser’s Network panel. Compare Host and Origin, including their ports, with the allowlists. After editing them, [restart honk](what-doona-can-change.md#restart-native) and reload the page.

### Static servers and reverse proxies {#static-servers-and-reverse-proxies}

A static server can serve the extracted UI files at its web root or under a prefix such as `/ui/`. doona uses hash routes such as `/ui/#/activity`, so it needs no SPA rewrite rules.

Forward both the exact `/api` discovery endpoint and the `/api/` subtree to honk’s listener. Forwarding `/api/` alone misses discovery and prevents connection. If the connection address has a proxy prefix such as `/gateway`, route `/gateway/api` to honk’s `/api` and `/gateway/api/…` to `/api/…`. Apply the same prefix mapping to both routes.


## Maintain the installation {#operation}


### Reload or restart {#reload-and-restart}

Use [What doona can change](what-doona-can-change.md) to determine how an edit takes effect, then use the commands in [Service management](service-management.md).

### Update the UI {#update-the-ui}

For an external UI directory, install the new package or archive using the same installation method. Replacing files in the already configured directory needs only a browser reload.

With `ui: embedded`, a standalone UI package does not replace the embedded interface. Either update honk to a build containing the newer UI using [Install honk](#install), or install the UI files separately and change [`ui`](configuration.md#config) to their directory. Restart honk after either change, then reload the browser page.

After installing the UI files, apply the configuration at the start of this page, [restart honk](service-management.md), and follow [First sign-in](first-sign-in.md).

</div>
