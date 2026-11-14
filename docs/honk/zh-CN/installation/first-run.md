# 首次运行

在 [Debian / Ubuntu](./debian.md)、[Fedora / RHEL](./fedora.md) 或 [openSUSE](./opensuse.md) 上安装 honk 软件包后，按本页配置并启动服务。

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。

## 1. 配置 honk

首次安装时，把以下仅直连配置保存为当前目录下的 `config.dae`。把 `br-lan` 替换为客户端流量实际进入的 LAN 接口；只代理本机流量时删除 `lan_interface`。`wan_interface: auto` 跟随最低 metric 的 IPv4 默认路由。

```dae
global {
    wan_interface: auto
    lan_interface: br-lan
    data_dir: '/var/lib/honk'
    log_level: info
    dial_mode: domain
    auto_config_kernel_parameter: true
}

routing {
    fallback: direct
}
```

如果 `/etc/honk/config.dae` 已存在，保留该文件并跳过此步；否则用下面的命令安装配置文件，目录与文件只允许 root 访问：

::: code-group

```sh [sudo]
sudo install -d -m 0700 /etc/honk /var/lib/honk
sudo install -m 0600 ./config.dae /etc/honk/config.dae
```

```sh [root]
install -d -m 0700 /etc/honk /var/lib/honk
install -m 0600 ./config.dae /etc/honk/config.dae
```

:::

启动前，按实际网络修改 `/etc/honk/config.dae`。内核要求见[Linux 内核要求](../how-to-start.md#linux-内核要求)，完整配置见[配置指南](../configuration.md)。

软件包已内嵌 doona。要启用网页界面，把以下配置加入配置文件；如果已有 `experimental` 小节，把内容合并到该小节：

```dae
experimental {
    native_api {
        enabled: true
        listen: '127.0.0.1:9527'
        password_auth: true
        config_write: true
        ui: 'embedded'
    }
}
```

## 2. 启动服务

如果已安装 dae，先停止服务并禁用开机自启，再启动 honk：

::: code-group

```sh [sudo]
sudo systemctl disable --now dae.service
```

```sh [root]
systemctl disable --now dae.service
```

:::

::: code-group

```sh [sudo]
sudo systemctl enable --now honk.service
```

```sh [root]
systemctl enable --now honk.service
```

:::

检查服务是否在运行，输出应显示 `active (running)`：

::: code-group

```sh [sudo]
sudo systemctl status honk.service --no-pager
```

```sh [root]
systemctl status honk.service --no-pager
```

:::

若未运行，查看本次启动的最近 50 行日志：

::: code-group

```sh [sudo]
sudo journalctl -u honk.service -b -n 50 --no-pager
```

```sh [root]
journalctl -u honk.service -b -n 50 --no-pager
```

:::

在 honk 所在主机上打开 <http://127.0.0.1:9527/ui/>，首次访问时创建管理员账号。

## 下一步

- [首次登录](/zh-CN/doona/first-sign-in)：连接 doona 与 honk，并创建管理员账号。
- [管理节点、策略组和规则](/zh-CN/doona/routing)：添加节点或订阅和路由规则；在此之前所有流量直连。
- [故障排除](/zh-CN/doona/troubleshooting)：无法正常使用时的排查步骤。
