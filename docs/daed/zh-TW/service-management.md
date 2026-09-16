# daed：服務管理

以下適用於 Dae Universe DEB/RPM 套件來源提供的 daed，設定目錄為 `/etc/daed/`。

服務檔案宣告與 `dae.service` 衝突，請選擇其中一個服務。該服務未定義 reload 動作，不應使用 `systemctl reload daed`。

Gentoo 在預設啟用 `webui` USE 旗標時也提供此 systemd 服務。

## systemd

### 立即啟動並設為開機啟動

::: code-group

```shell [sudo]
sudo systemctl enable --now daed
```

```shell [root]
systemctl enable --now daed
```

:::

### 立即啟動

::: code-group

```shell [sudo]
sudo systemctl start daed
```

```shell [root]
systemctl start daed
```

:::

### 開機啟動

::: code-group

```shell [sudo]
sudo systemctl enable daed
```

```shell [root]
systemctl enable daed
```

:::

### 重新啟動

::: code-group

```shell [sudo]
sudo systemctl restart daed
```

```shell [root]
systemctl restart daed
```

:::

重新啟動會中斷現有連線。

## OpenRC（Gentoo）

完成 [Gentoo 安裝說明](./installation/gentoo)中的 OpenRC 前置設定後，使用以下指令。此服務指令碼未定義 reload 動作。

### 立即啟動並設為開機啟動

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

### 立即啟動

::: code-group

```shell [sudo]
sudo rc-service daed start
```

```shell [root]
rc-service daed start
```

:::

### 開機啟動

::: code-group

```shell [sudo]
sudo rc-update add daed default
```

```shell [root]
rc-update add daed default
```

:::

### 重新啟動

::: code-group

```shell [sudo]
sudo rc-service daed restart
```

```shell [root]
rc-service daed restart
```

:::
