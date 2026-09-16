### Debian / Ubuntu

Debian、Ubuntu 及其他使用 APT 的发行版可使用 <https://daeuniverse.pages.dev> 提供的 Dae Universe 软件源。
以下命令假定已为当前账户配置 sudo。

#### 1. 安装 curl

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-1.md-->

#### 2. 添加 APT 软件源

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-2.md-->

#### 3. 导入 GPG 密钥

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-3.md-->

#### 4. 安装 dae

::: code-group

```sh [sudo]
sudo apt update
sudo apt install dae
```

```sh [root]
apt update
apt install dae
```

:::

软件包包含 systemd 服务和示例文件 `/etc/dae/example.dae`。
将配置保存为 `/etc/dae/config.dae`。
完成[最小配置](/zh-CN/dae/start/minimal-configuration#最小配置)后，参见[服务管理](/zh-CN/dae/start/service-management#服务管理)。

