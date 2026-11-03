---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Install from archives or on Alpine {#title-install-from-archives-or-on-alpine}

Install doona v0.1.0-rc.5 from an archive when your system has no matching package. Alpine users can choose the [signed package route](#install-alpine) instead.

Use a terminal on the gateway and a new download directory. Run the steps in the same shell; in a root shell, omit `sudo`. Check the [honk prerequisites](install.md#install) before installing the backend.

Prepare `curl`, CA certificates, `tar`, and `sha256sum`. On Alpine, run `apk add curl ca-certificates` as root.

## 1. Choose an edition {#1-choose-an-edition}

Choose one tab. The [edition comparison](editions.md) explains the differences.

::: code-group

```sh [Standard]
FILE=doona-0.1.0-rc.5.tar.gz
UI_DIR=/usr/share/doona
```

```sh [Lite]
FILE=doona-lite-0.1.0-rc.5.tar.gz
UI_DIR=/usr/share/doona-lite
```

:::

## 2. Download and verify {#2-download-and-verify}

```sh
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.5
curl -fL -O "$BASE/$FILE" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
```

Continue only when every selected file reports `OK`. If verification fails or finds no checksum line, check the filenames and download again before installing.

For download or binary errors, see [Installation errors](install.md#installation-errors).

## 3. Extract the web files {#3-extract-the-web-files}

```sh
sudo mkdir -p "$UI_DIR"
sudo tar -xzf "$FILE" -C "$UI_DIR"
ls -l "$UI_DIR/index.html"
```

The last command must list `index.html`. Use that directory in the [separate UI configuration](install.md).

### Optional standard-edition assets {#optional-standard-edition-assets}

For the standard edition, choose an [optional asset](install.md#doona) below. Set `FILE` to its filename and run the block once for each archive you want. Keep the lite directory separate.

| Asset | Filename |
| --- | --- |
| Fonts | `doona-fonts-0.1.0-rc.5.tar.gz` |
| Precompressed files | `doona-precompressed-0.1.0-rc.5.tar.gz` |

```sh
FILE=doona-fonts-0.1.0-rc.5.tar.gz
curl -fL -O "$BASE/$FILE"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c - &&
  sudo tar -xzf "$FILE" -C /usr/share/doona
```

After installing the archive, skip to the backend section below.


## Alpine package alternative {#install-alpine}

This route installs the standard edition. Run in a new download directory after installing the tools above. Use the Alpine assets, whose names end in `.alpine.apk`; OpenWrt’s apk files use a different format.

```sh
BASE=https://github.com/Zakkaus/doona/releases/download/v0.1.0-rc.5
FILE=doona-0.1.0-rc.5-r0.alpine.apk
curl -fL -O "$BASE/$FILE" -O "$BASE/doona-alpine.rsa.pub" -O "$BASE/SHA256SUMS"
awk -v file="$FILE" '$2 == file' SHA256SUMS | sha256sum -c -
awk '$2 == "doona-alpine.rsa.pub"' SHA256SUMS | sha256sum -c -
```

After both checks report `OK`, install the verified key and package as root. Keep the key filename unchanged; each release supplies its own key.

```sh
mkdir -p /etc/apk/keys
cp "$PWD/doona-alpine.rsa.pub" /etc/apk/keys/doona-alpine.rsa.pub
apk add "./$FILE"
ls -l /usr/share/doona/index.html
```

The last command must list `index.html`. Optional packages are `doona-fonts-0.1.0-rc.5-r0.alpine.apk` and `doona-precompressed-0.1.0-rc.5-r0.alpine.apk`. For either, change `FILE`, download and verify it as above, then run `apk add "./$FILE"` as root.

To install directly without adding the release key, first verify the downloaded package as above, then run as root:

```sh
apk add --allow-untrusted "./$FILE"
```

This skips signature trust checking, so keep the SHA-256 verification step.

For optional packages, use the same signed-key or direct installation method you chose for the main package.

## Install the backend {#install-the-backend}

If you already have a compatible honk, keep it. Otherwise, follow [Install honk](install.md#install), then return here.

For OpenRC systems, [Service management](service-management.md) gives a foreground command for the first connection; it does not configure an OpenRC service.

Apply the [separate UI configuration](install.md), [start honk](service-management.md), then follow [First sign-in](first-sign-in.md).

</div>
