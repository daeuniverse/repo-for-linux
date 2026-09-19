### Fedora / RHEL

#### Dae Universe RPM 软件源

Fedora 和 RHEL 可使用 <https://daeuniverse.pages.dev> 提供的 Dae Universe 软件源。
以下命令假定已为当前账户配置 sudo。

##### 1. 添加 DNF 软件源

<!--@include: @/.vitepress/snippets/repositories/zh-CN/fedora-1.md-->

##### 2. 安装 dae

::: code-group

```sh [sudo]
sudo dnf install dae
```

```sh [root]
dnf install dae
```

:::

软件包包含 systemd 服务和示例文件 `/etc/dae/example.dae`。
将配置保存为 `/etc/dae/config.dae`。
完成[最小配置](/zh-CN/dae/start/minimal-configuration#最小配置)后，参见[服务管理](/zh-CN/dae/start/service-management#服务管理)。

<div v-pre lang="zh-CN">

<!-- installation-4:start -->
#### Fedora Copr

dae 已发布于 [Fedora Copr](https://copr.fedorainfracloud.org/coprs/zhullyb/v2rayA/package/dae)。
此方式仅适用于 Fedora，可替代 Dae Universe 软件源。
`zhullyb/v2rayA` 是 Copr 项目名，安装的软件包为 `dae`。

::: code-group

```shell [sudo]
sudo dnf copr enable zhullyb/v2rayA
sudo dnf install dae
```

```shell [root]
dnf copr enable zhullyb/v2rayA
dnf install dae
```

:::
<!-- installation-4:end -->

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
