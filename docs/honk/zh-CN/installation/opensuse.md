# openSUSE

在 openSUSE 上，从 Dae Universe 软件源安装 honk。

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。

以下步骤需要 systemd 和 Linux 6.12 或更高版本。用 `uname -r` 查看内核版本，其余要求见[内核要求](../how-to-start.md#linux-内核要求)。

## 1. 添加软件源

<!--@include: @/.vitepress/snippets/repositories/zh-CN/opensuse-1.md-->

## 2. 安装 honk

::: code-group

```sh [sudo]
sudo zypper install honk
```

```sh [root]
zypper install honk
```

:::

继续阅读[首次运行](./first-run.md)。

## 升级

升级软件包后，重启 honk 并检查状态。软件包的安装脚本只重新加载 systemd 服务定义，不会重启正在运行的进程。

::: code-group

```sh [sudo]
sudo zypper update honk
sudo systemctl restart honk.service
sudo systemctl status honk.service --no-pager
```

```sh [root]
zypper update honk
systemctl restart honk.service
systemctl status honk.service --no-pager
```

:::

## 卸载

::: code-group

```sh [sudo]
sudo systemctl disable --now honk.service
sudo zypper remove honk
```

```sh [root]
systemctl disable --now honk.service
zypper remove honk
```

:::

主机上的配置目录 `/etc/honk` 和运行时状态目录 `/var/lib/honk` 会保留。如果修改过 `data_dir`，该目录也会保留。
