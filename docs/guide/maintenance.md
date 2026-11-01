# Services & certificates

## Customize a systemd service

Edit the systemd service file with `systemctl edit --full`. This example edits `daed.service`:

::: code-group

```sh [sudo]
sudo systemctl edit --full daed.service
```

```sh [root]
systemctl edit --full daed.service
```

:::

The edited file is saved as `/etc/systemd/system/daed.service`, not `/lib/systemd/system/daed.service`. Package updates do not overwrite it.

## Let a non-root user read Let's Encrypt certificates

The v2ray, xray, juicity and juicity-rs services run as `nobody`. This user cannot read certificates in `/etc/letsencrypt/live` by default. Set access control lists (ACLs) to grant read access.

### 1. Install `acl` on Debian or Ubuntu

::: code-group

```sh [sudo]
sudo apt install acl
```

```sh [root]
apt install acl
```

:::

### 2. Grant `nobody` access to the certificates

::: code-group

```sh [sudo]
sudo setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}
sudo setfacl -m u:nobody:rX /etc/letsencrypt
```

```sh [root]
setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}
setfacl -m u:nobody:rX /etc/letsencrypt
```

:::

### 3. Set a Certbot deploy hook to restore ACLs after renewal

::: code-group

```sh [sudo]
sudo install -d -m 0755 /etc/letsencrypt/renewal-hooks/deploy
printf '%s\n' '#!/bin/sh' 'setfacl -R -m u:nobody:rX /etc/letsencrypt/live /etc/letsencrypt/archive' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/restore-acl.sh >/dev/null
sudo chmod 0755 /etc/letsencrypt/renewal-hooks/deploy/restore-acl.sh
```

```sh [root]
install -d -m 0755 /etc/letsencrypt/renewal-hooks/deploy
printf '%s\n' '#!/bin/sh' 'setfacl -R -m u:nobody:rX /etc/letsencrypt/live /etc/letsencrypt/archive' > /etc/letsencrypt/renewal-hooks/deploy/restore-acl.sh
chmod 0755 /etc/letsencrypt/renewal-hooks/deploy/restore-acl.sh
```

:::
