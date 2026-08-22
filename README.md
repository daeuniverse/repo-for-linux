# The Linux Repository of Dae Universe

This repo contains dae, v2rayA, v2ray, xray, juicity and juicity-rs programs.

## Usage

<details open>
<summary><strong>Debian and other APT-based distributions</strong></summary>

**1. Install `curl`**

```sh
sudo apt update
sudo apt install curl
```

**2. Add the repository**

The source config file is downloaded directly from the repository.

For APT version 3.0 or higher:

```sh
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.sources https://daeuniverse.pages.dev/daeuniverse.sources
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

</details>

<details>
<summary><strong>RPM-based distributions</strong></summary>

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

</details>

## Available packages

This table is generated after packaging completes.

<!-- BEGIN GENERATED PACKAGE TABLE -->

| Software | Version | Project | License |
| --- | --- | --- | --- |
| dae | 2.0.0 | [https://github.com/daeuniverse/dae](https://github.com/daeuniverse/dae) | [AGPL-3.0-only](https://github.com/daeuniverse/dae/blob/main/LICENSE) |
| daed | 1.27.0 | [https://github.com/daeuniverse/daed](https://github.com/daeuniverse/daed) | [MIT](https://github.com/daeuniverse/daed/blob/main/LICENSE) + [AGPL-3.0-only](https://github.com/daeuniverse/dae-wing/blob/main/LICENSE) |
| Juicity | 0.5.0 | [https://github.com/juicity/juicity](https://github.com/juicity/juicity) | [AGPL-3.0-only](https://github.com/juicity/juicity/blob/main/LICENSE) |
| Juicity-rs | 1.0.1 | [https://github.com/juicity/juicity-rs](https://github.com/juicity/juicity-rs) | [AGPL-3.0-only](https://github.com/juicity/juicity-rs/blob/main/LICENSE) |
| v2ray | 5.53.0 | [https://github.com/v2fly/v2ray-core](https://github.com/v2fly/v2ray-core) | [MIT](https://github.com/v2fly/v2ray-core/blob/main/LICENSE) |
| v2rayA | 2.4.12 | [https://github.com/v2rayA/v2rayA](https://github.com/v2rayA/v2rayA) | [AGPL-3.0-only + MPL 2.0](https://github.com/v2rayA/v2rayA/blob/main/LICENSE) |
| Xray | 26.3.27 | [https://github.com/XTLS/Xray-core](https://github.com/XTLS/Xray-core) | [MPL-2.0](https://github.com/XTLS/Xray-core/blob/main/LICENSE) |
| v2ray-rules-dat | 202608212217 | [https://github.com/Loyalsoldier/v2ray-rules-dat](https://github.com/Loyalsoldier/v2ray-rules-dat) | [GPL-3.0-only](https://github.com/Loyalsoldier/v2ray-rules-dat/blob/main/LICENSE) |

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
