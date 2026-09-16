### openSUSE

使用 <https://daeuniverse.pages.dev> 提供的 Dae Universe 软件源。
以下命令假定已为当前账户配置 sudo。

#### 1. 添加 Zypper 软件源

<!--@include: @/.vitepress/snippets/repositories/zh-CN/opensuse-1.md-->

#### 2. 安装 dae

::: code-group

```sh [sudo]
sudo zypper install dae
```

```sh [root]
zypper install dae
```

:::

软件包包含 systemd 服务和示例文件 `/etc/dae/example.dae`。
将配置保存为 `/etc/dae/config.dae`。
完成[最小配置](/zh-CN/dae/start/minimal-configuration#最小配置)后，参见[服务管理](/zh-CN/dae/start/service-management#服务管理)。

