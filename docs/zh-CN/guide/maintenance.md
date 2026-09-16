# 服务与证书

## 自定义 systemd 服务

编辑 systemd 服务文件，以 `daed` 为例：

::: code-group

```sh [sudo]
sudo systemctl edit --full daed.service
```

```sh [root]
systemctl edit --full daed.service
```

:::

新文件保存在 `/etc/systemd/system/daed.service`，原文件仍位于 `/lib/systemd/system/daed.service`。更新软件包时不会覆盖新文件。

## 允许非 root 用户读取 Let’s Encrypt 证书

v2ray、xray、juicity 和 juicity-rs 服务以 `nobody` 用户身份运行。因为该用户默认无法读取 `/etc/letsencrypt/live` 中的证书，所以需要通过 ACL 授予读取权限。

### 1. 在 Debian 或 Ubuntu 上安装 `acl` 软件包

::: code-group

```sh [sudo]
sudo apt install acl
```

```sh [root]
apt install acl
```

:::

### 2. 授予 `nobody` 证书读取权限

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

### 3. 设置 Certbot 部署钩子，在证书续期后恢复 ACL

::: code-group

```sh [sudo]
sudo certbot renew --deploy-hook "setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}"
```

```sh [root]
certbot renew --deploy-hook "setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}"
```

:::
