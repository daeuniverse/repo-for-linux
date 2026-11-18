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

On Debian or Ubuntu, run `sudo apt install honk`; honk's [installation guide](/honk/installation/) covers other systems and build variants. Choose a `full` or `native-api` build, because the `clash-api` variant cannot serve doona's native API.

## Installation errors {#installation-errors}

| Error | What to do |
| --- | --- |
| HTTP 404 when downloading | Check the release tag and exact asset filename. Copy the download link from that release instead of constructing an unverified filename. |
| BusyBox rejects `--ignore-missing` | BusyBox `sha256sum` does not support that option. Use the per-file `awk` and `sha256sum -c -` command shown in these installation guides. Require an `OK` result for the selected file. |

For a `GLIBC_*` error, choose the musl build as described in honk's [installation guide](/honk/installation/). For a missing kernel feature or a startup failure, see [Requirements](requirements.md#gateway) and honk's [troubleshooting](/honk/how-to-start#troubleshooting).


## Install geodata when your rules need it {#directories-and-geodata}

Check [geodata requirements](feature-requirements.md#req-geodata) before adding Geo rules. Install the files in the directory selected by `global.data_dir`, as described in honk's [GeoIP and Geosite](/honk/how-to-start#geoip-and-geosite).


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

When a hostname or another origin is refused, set `allowed_hosts` and `allow_origins` as described in honk's [Host and Origin checks](/honk/reference/experimental#host-and-origin-checks). After editing them, [restart honk](what-doona-can-change.md#restart-native) and reload the page.

If HTML loads but JavaScript or CSS returns 403, inspect the failing requests in the browser’s Network panel. Compare Host and Origin, including their ports, with the allowlists.

### Static servers and reverse proxies {#static-servers-and-reverse-proxies}

A static server can serve the extracted UI files at its web root or under a prefix such as `/ui/`. doona uses hash routes such as `/ui/#/activity`, so it needs no SPA rewrite rules.

Forward both the exact `/api` discovery endpoint and the `/api/` subtree to honk’s listener. Forwarding `/api/` alone misses discovery and prevents connection. If the connection address has a proxy prefix such as `/gateway`, route `/gateway/api` to honk’s `/api` and `/gateway/api/…` to `/api/…`. Apply the same prefix mapping to both routes.


## Maintain the installation {#operation}


### Reload or restart {#reload-and-restart}

Use [What doona can change](what-doona-can-change.md) to determine how an edit takes effect, then follow honk's [Reload and stop](/honk/how-to-start#reload-and-stop).

### Update the UI {#update-the-ui}

For an external UI directory, install the new package or archive using the same installation method. Replacing files in the already configured directory needs only a browser reload.

With `ui: embedded`, a standalone UI package does not replace the embedded interface. Either update honk to a build containing the newer UI using [Install honk](#install), or install the UI files separately and change [`ui`](configuration.md#config) to their directory. Restart honk after either change, then reload the browser page.

After installing the UI files, apply the configuration at the start of this page, [restart honk](service-management.md), and follow [First sign-in](first-sign-in.md).

</div>
