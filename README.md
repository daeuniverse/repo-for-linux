# A Debian APT repo

This repo contains dae, v2rayA, v2ray, xray, juicity and juicity-rs programs.

## Usage

<div class="dae-tabs">

<input type="radio" name="daeuniverse-tabs" id="daeuniverse-tab-debian" checked>
<label for="daeuniverse-tab-debian">Debian</label>

<input type="radio" name="daeuniverse-tabs" id="daeuniverse-tab-rpm">
<label for="daeuniverse-tab-rpm">RPM</label>

<div class="dae-panel" id="daeuniverse-panel-debian">

**1. Install `curl`**

```sh
sudo apt update
sudo apt install curl
```

**2. Add the repository**

The source config file is downloaded directly from the repository.

For APT version 3.0 or higher:

```sh
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.source https://daeuniverse.pages.dev/daeuniverse.source
```

For APT version lower than 3.0:

```sh
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.list https://daeuniverse.pages.dev/daeuniverse.list
```

**3. Import the GPG key**

```sh
sudo curl -fsSL -o /usr/share/keyrings/daeuniverse-archive-goose.gpg https://daeuniverse.pages.dev/daeuniverse-archive-goose.gpg
```

**4. Install packages**

```sh
sudo apt update
sudo apt install v2raya
```

</div>

<div class="dae-panel" id="daeuniverse-panel-rpm">

**1. Add the repository**

The repository config file is downloaded directly from the repository, the GPG key is imported automatically.

For Fedora, RHEL and other DNF-based distributions:

```sh
sudo curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

For openSUSE:

```sh
sudo curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

**2. Install packages**

```sh
sudo dnf install v2raya
```

or on openSUSE:

```sh
sudo zypper install v2raya
```

</div>

</div>

<style>
.dae-tabs { margin: 1rem 0; }
.dae-tabs > input { display: none; }
.dae-tabs > label {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  margin: 0 0.25rem -1px 0;
  border: 1px solid #d0d7de;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  background: #f6f8fa;
  color: #24292f;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  top: 1px;
}
.dae-tabs > input:checked + label {
  background: #ffffff;
  border-bottom: 1px solid #ffffff;
}
.dae-tabs > .dae-panel {
  display: none;
  border: 1px solid #d0d7de;
  border-radius: 0 6px 6px 6px;
  padding: 1rem;
  background: #ffffff;
}
.dae-tabs > input#daeuniverse-tab-debian:checked ~ #daeuniverse-panel-debian,
.dae-tabs > input#daeuniverse-tab-rpm:checked ~ #daeuniverse-panel-rpm {
  display: block;
}
</style>

## Available packages

This table is generated after packaging completes.

<!-- BEGIN GENERATED PACKAGE TABLE -->

| Software | Version | Project | License |
| --- | --- | --- | --- |
| dae | N/A | [https://github.com/daeuniverse/dae](https://github.com/daeuniverse/dae) | [AGPL-3.0-only](https://github.com/daeuniverse/dae/blob/main/LICENSE) |
| daed | N/A | [https://github.com/daeuniverse/daed](https://github.com/daeuniverse/daed) | [MIT](https://github.com/daeuniverse/daed/blob/main/LICENSE) + [AGPL-3.0-only](https://github.com/daeuniverse/dae-wing/blob/main/LICENSE) |
| Juicity | N/A | [https://github.com/juicity/juicity](https://github.com/juicity/juicity) | [AGPL-3.0-only](https://github.com/juicity/juicity/blob/main/LICENSE) |
| Juicity-rs | N/A | [https://github.com/juicity/juicity-rs](https://github.com/juicity/juicity-rs) | [AGPL-3.0-only](https://github.com/juicity/juicity-rs/blob/main/LICENSE) |
| v2ray | N/A | [https://github.com/v2fly/v2ray-core](https://github.com/v2fly/v2ray-core) | [MIT](https://github.com/v2fly/v2ray-core/blob/main/LICENSE) |
| v2rayA | N/A | [https://github.com/v2rayA/v2rayA](https://github.com/v2rayA/v2rayA) | [AGPL-3.0-only + MPL 2.0](https://github.com/v2rayA/v2rayA/blob/main/LICENSE) |
| Xray | N/A | [https://github.com/XTLS/Xray-core](https://github.com/XTLS/Xray-core) | [MPL-2.0](https://github.com/XTLS/Xray-core/blob/main/LICENSE) |
| v2ray-rules-dat | N/A | [https://github.com/Loyalsoldier/v2ray-rules-dat](https://github.com/Loyalsoldier/v2ray-rules-dat) | [GPL-3.0-only](https://github.com/Loyalsoldier/v2ray-rules-dat/blob/main/LICENSE) |

<!-- END GENERATED PACKAGE TABLE -->

## How to edit Systemd Service

If you want to edit the systemd service file, you can just run(for example, for `daed` service):

```sh
sudo systemctl edit --full daed.service
```

New file will be placed in `/etc/systemd/system/daed.service`, instead of in `/lib/systemd/system/daed.service`, and new file will not be overwritten when package is updated.

## How to set ACL to allow non-root user to read letsencrypt certs

We use the `nobody` user to run the v2ray, xray, juicity and juicity-rs services, and the `nobody` user does not have permission to read the certs in `/etc/letsencrypt/live`, so you need to set ACL to allow non-root user to read letsencrypt certs.

### Install `acl` package (use Debian/Ubuntu as an example)

```sh
sudo apt install acl
```

### Set ACL to allow user `nobody` to read letsencrypt certs

```sh
sudo setfacl -R -m u:nobody:r /etc/letsencrypt/{live,archive}
sudo setfacl -m u:nobody:rX /etc/letsencrypt
```

### Set hook to certbot to automatically set ACL when certs are renewed

```sh
sudo certbot renew --deploy-hook "setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}"
```
