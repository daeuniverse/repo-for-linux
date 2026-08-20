# The Linux Repository of Dae Universe

This repo contains dae, v2rayA, v2ray, xray, juicity and juicity-rs programs.

## Usage

<table>
<tr>
<td valign="top">

<details open>
<summary><strong>Debian</strong></summary>

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

</details>

</td>
<td valign="top">

<details>
<summary><strong>RPM</strong></summary>

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

</td>
</tr>
</table>

## Available packages

This table is generated after packaging completes.

<!-- BEGIN GENERATED PACKAGE TABLE -->
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