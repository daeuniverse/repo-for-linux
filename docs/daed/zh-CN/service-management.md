# daed：服务管理

本页适用于 Dae Universe DEB/RPM 软件源提供的 daed，配置目录为 `/etc/daed/`。

服务文件声明与 `dae.service` 冲突，请选择其中一个服务。该服务未定义 `reload` 动作，不应使用 `systemctl reload daed`。

Gentoo 在默认启用 `webui` USE 标志时也提供此 systemd 服务。

## systemd

### 立即启动并设为开机启动

::: code-group

```shell [sudo]
sudo systemctl enable --now daed
```

```shell [root]
systemctl enable --now daed
```

:::

### 立即启动

::: code-group

```shell [sudo]
sudo systemctl start daed
```

```shell [root]
systemctl start daed
```

:::

### 开机启动

::: code-group

```shell [sudo]
sudo systemctl enable daed
```

```shell [root]
systemctl enable daed
```

:::

### 重新启动

::: code-group

```shell [sudo]
sudo systemctl restart daed
```

```shell [root]
systemctl restart daed
```

:::

重新启动会中断现有连接。

## OpenRC（Gentoo）

完成 [Gentoo 安装说明](./installation/gentoo)中的 OpenRC 前置设置后，使用以下命令。该服务脚本未定义 reload 动作。

### 立即启动并设为开机启动

::: code-group

```shell [sudo]
sudo rc-service daed start
sudo rc-update add daed default
```

```shell [root]
rc-service daed start
rc-update add daed default
```

:::

### 立即启动

::: code-group

```shell [sudo]
sudo rc-service daed start
```

```shell [root]
rc-service daed start
```

:::

### 开机启动

::: code-group

```shell [sudo]
sudo rc-update add daed default
```

```shell [root]
rc-update add daed default
```

:::

### 重新启动

::: code-group

```shell [sudo]
sudo rc-service daed restart
```

```shell [root]
rc-service daed restart
```

:::
