# Fedora / RHEL

在 Fedora 與 RHEL 上，從 Dae Universe 套件來源安裝 honk。

已設定 sudo 的一般使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。

以下步驟需要 systemd 和 Linux 6.12 或更新版本。以 `uname -r` 查看核心版本，其餘需求見[核心要求](../how-to-start.md#linux-核心要求)。

## 1. 新增套件來源

<!--@include: @/.vitepress/snippets/repositories/zh-TW/fedora-1.md-->

## 2. 安裝 honk

::: code-group

```sh [sudo]
sudo dnf install honk
```

```sh [root]
dnf install honk
```

:::

繼續閱讀[首次執行](./first-run.md)。

## 升級

升級套件後，重新啟動 honk 並檢查狀態。套件的安裝指令碼只執行 `systemctl daemon-reload`，不會重新啟動正在執行的程序。

::: code-group

```sh [sudo]
sudo dnf upgrade honk
sudo systemctl restart honk.service
sudo systemctl status honk.service --no-pager
```

```sh [root]
dnf upgrade honk
systemctl restart honk.service
systemctl status honk.service --no-pager
```

:::

## 解除安裝

::: code-group

```sh [sudo]
sudo systemctl disable --now honk.service
sudo dnf remove honk
```

```sh [root]
systemctl disable --now honk.service
dnf remove honk
```

:::

主機上的設定目錄 `/etc/honk` 和執行階段資料目錄 `/var/lib/honk` 會保留。如果修改過 `data_dir`，該目錄也會保留。
