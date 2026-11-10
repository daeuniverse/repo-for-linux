---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Install on Gentoo {#title-install-on-gentoo}

Install doona v0.1.0-rc.6 with the repository’s ebuild in a local Portage repository. For doona lite, use [manual installation](install-manual.md).

Use a terminal on the gateway and a new download directory. Run the steps in the same shell; in a root shell, omit `sudo`. Check the [honk prerequisites](install.md#install) before installing the backend.

Install `net-misc/curl` and `app-misc/ca-certificates` if they are missing.

```sh
sudo emerge --ask net-misc/curl app-misc/ca-certificates
```

## 1. Prepare a local repository {#1-prepare-a-local-repository}

If you already have a local repository, set `REPO` to its absolute path and skip the creation commands. Otherwise, create a new repository named `doona-local`:

```sh
REPO=/var/db/repos/doona-local
sudo mkdir -p "$REPO/metadata" "$REPO/profiles" /etc/portage/repos.conf
printf '%s
' doona-local | sudo tee "$REPO/profiles/repo_name"
printf 'masters = gentoo
auto-sync = false
' | sudo tee "$REPO/metadata/layout.conf"
printf '[doona-local]
location = %s
' "$REPO" | sudo tee /etc/portage/repos.conf/doona-local.conf
portageq get_repos /
```

The repository name must appear in the final command’s output.

## 2. Add the ebuild {#2-add-the-ebuild}

```sh
VERSION=0.1.0-rc.6
PV=0.1.0_rc6
RAW=https://raw.githubusercontent.com/Zakkaus/doona/v${VERSION}/install/gentoo/net-proxy/doona
sudo mkdir -p "$REPO/net-proxy/doona"
sudo curl -fL -o "$REPO/net-proxy/doona/doona-$PV.ebuild" "$RAW/doona-$PV.ebuild"
sudo curl -fL -o "$REPO/net-proxy/doona/metadata.xml" "$RAW/metadata.xml"
```

## 3. Verify the release archives {#3-verify-the-release-archives}

The ebuild uses the program archive and enables the `fonts` USE flag by default. In your download directory, fetch and verify both archives:

```sh
BASE=https://github.com/Zakkaus/doona/releases/download/v$VERSION
curl -fL -O "$BASE/doona-${VERSION}.tar.gz" -O "$BASE/doona-fonts-${VERSION}.tar.gz" -O "$BASE/SHA256SUMS"
awk -v file="doona-${VERSION}.tar.gz" '$2 == file' SHA256SUMS | sha256sum -c -
awk -v file="doona-fonts-${VERSION}.tar.gz" '$2 == file' SHA256SUMS | sha256sum -c -
```

Continue only when every selected file reports `OK`. If verification fails or finds no checksum line, check the filenames and download again before installing.

For download or binary errors, see [Installation errors](install.md#installation-errors).

Put the verified files in Portage’s distfiles directory under the names used by the ebuild, then generate its Manifest:

```sh
DISTDIR=$(portageq distdir)
sudo install -m 0644 "$PWD/doona-${VERSION}.tar.gz" "$DISTDIR/doona-$PV.tar.gz"
sudo install -m 0644 "$PWD/doona-fonts-${VERSION}.tar.gz" "$DISTDIR/doona-$PV-fonts.tar.gz"
sudo ebuild "$REPO/net-proxy/doona/doona-$PV.ebuild" manifest
```

## 4. Accept the keyword and install {#4-accept-the-keyword-and-install}

Add `=net-proxy/doona-0.1.0_rc6 ~amd64` to your `package.accept_keywords` configuration, replacing `~amd64` with your architecture’s testing keyword, such as `~arm64`. If that configuration is a directory, use a file inside it.

To omit fonts, add `net-proxy/doona -fonts` to `package.use` before installing.

```sh
sudo emerge --ask =net-proxy/doona-0.1.0_rc6
ls -l /usr/share/doona/index.html
```

The last command must list `index.html`. Use that directory in the [separate UI configuration](install.md).

### Portage errors {#portage-errors}

| Error | What to check |
| --- | --- |
| Portage cannot find `net-proxy/doona` | Run `portageq get_repos /` and check that it lists your local repository. Confirm that the ebuild is under that repository’s `net-proxy/doona/` directory; fix registration using step 1. |
| A testing keyword masks the package | Check that the `package.accept_keywords` entry in step 4 uses your architecture’s keyword, such as `~amd64` or `~arm64`. |

## 5. Install the backend {#5-install-the-backend}

If you already have a compatible honk, keep it. Otherwise, follow [Install honk](install.md#install), then return here.

Use the systemd procedure in [Service management](service-management.md) on a systemd host. On OpenRC, that page provides a foreground command for the first connection.

Apply the [separate UI configuration](install.md), [start honk](service-management.md), then follow [First sign-in](first-sign-in.md).

</div>
