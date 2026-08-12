# A Debian APT repo

This repo contains dae, v2rayA, v2ray, xray, juicity and juicity-rs programs.

## Usage

### 1. Add the repository

Sometimes you need to install `curl` and `gpg` at first:

```sh
sudo apt update
sudo apt install curl gpg
```

#### For APT version 3.0 or higher

Add the repository to your sources config:

```sh
cat <<- EOL | sudo tee /etc/apt/sources.list.d/daeuniverse.sources
Types: deb
URIs: https://daeuniverse.pages.dev
Suites: goose
Components: honk
Signed-By: /usr/share/keyrings/daeuniverse-archive-goose.gpg
EOL
```

#### For APT version lower than 3.0

Add the repository to your sources list:

```sh
cat <<- EOL | sudo tee /etc/apt/sources.list.d/daeuniverse.list
deb [signed-by=/usr/share/keyrings/daeuniverse-archive-goose.gpg] https://daeuniverse.pages.dev goose honk 
EOL
```

### 2. Import the GPG key

```sh
curl -fsSL https://daeuniverse.pages.dev/public-key.asc | sudo gpg --dearmor -o /usr/share/keyrings/daeuniverse-archive-goose.gpg
```

### 3. Install packages

Update the package list:

```sh
sudo apt update
```
Install the desired package, for example, v2rayA:

```sh
sudo apt install v2raya
```

## Available packages

This table is generated after packaging completes.

<!-- BEGIN GENERATED PACKAGE TABLE -->

| Software | Version | Project | License |
| --- | --- | --- | --- |
| dae | N/A | [https://github.com/daeuniverse/dae](https://github.com/daeuniverse/dae) | [AGPL-3.0-only](https://github.com/daeuniverse/dae/blob/main/LICENSE) |
| daed | N/A | [https://github.com/daeuniverse/daed](https://github.com/daeuniverse/daed) | [MIT](https://github.com/daeuniverse/daed/blob/main/LICENSE) + [AGPL-3.0-only](https://github.com/daeuniverse/dae-wing/blob/main/LICENSE) |
| Juicity | N/A | [https://github.com/juicity/juicity](https://github.com/juicity/juicity) | [AGPL-3.0-only](https://github.com/juicity/juicity/blob/main/LICENSE) |
| v2ray | N/A | [https://github.com/v2fly/v2ray-core](https://github.com/v2fly/v2ray-core) | [MIT](https://github.com/v2fly/v2ray-core/blob/main/LICENSE) |
| v2rayA | N/A | [https://github.com/v2rayA/v2rayA](https://github.com/v2rayA/v2rayA) | [AGPL-3.0-only](https://github.com/v2rayA/v2rayA/blob/main/LICENSE) |
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

### Install `acl` package

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