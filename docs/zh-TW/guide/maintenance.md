# 服務與憑證

## 自訂 systemd 服務

編輯 systemd 服務檔案，以 `daed` 為例：

::: code-group

```sh [sudo]
sudo systemctl edit --full daed.service
```

```sh [root]
systemctl edit --full daed.service
```

:::

新檔案儲存於 `/etc/systemd/system/daed.service`，原始檔案仍位於 `/lib/systemd/system/daed.service`。更新套件時不會覆寫新檔案。

## 允許非 root 使用者讀取 Let’s Encrypt 憑證

v2ray、xray、juicity 和 juicity-rs 服務以 `nobody` 使用者身分執行。因為該使用者預設無法讀取 `/etc/letsencrypt/live` 中的憑證，所以需要透過 ACL 授予讀取權限。

### 1. 在 Debian 或 Ubuntu 安裝 `acl` 套件

::: code-group

```sh [sudo]
sudo apt install acl
```

```sh [root]
apt install acl
```

:::

### 2. 授予 `nobody` 憑證讀取權限

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

### 3. 設定 Certbot 部署掛鉤，在憑證續期後還原 ACL

::: code-group

```sh [sudo]
sudo certbot renew --deploy-hook "setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}"
```

```sh [root]
certbot renew --deploy-hook "setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}"
```

:::
