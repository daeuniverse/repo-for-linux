# Docker

使用 [GitHub Container Registry](https://github.com/daeuniverse/honk/pkgs/container/honk) 上的镜像 `ghcr.io/daeuniverse/honk` 运行 honk。镜像包含 musl `full` 发布版二进制以及仓库固定版本的 GeoIP 和 Geosite 文件；构建时会用 SHA-256 校验每个下载文件。

每个发布版以去掉 `v` 的版本号作为镜像标签，例如 `ghcr.io/daeuniverse/honk:0.1.0-beta.4`；`latest` 只指向正式版，不包含预发布版。镜像提供 linux/amd64 和 linux/arm64 两种架构，拉取时无需登录。

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。

## 1. 检查宿主机

honk 需要加载并挂载 eBPF 程序、创建 `dae0` 和 `daens` 命名空间、修改 sysctl，并在宿主机的 bpffs 上固定 map，因此容器以特权模式运行，并共享宿主机的网络和 PID 命名空间。它对宿主机的改动与直接安装相同，不提供任何隔离。

宿主机必须满足[内核要求](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#linux-内核要求)，包括 Linux 6.12+ 和已挂载的 bpffs。

后续步骤还需要带 Compose 插件的 [Docker Engine](https://docs.docker.com/engine/install/) 和 `curl`。用以下命令检查 Compose；已安装插件时会输出 Compose 的版本。

::: code-group

```sh [sudo]
sudo docker compose version
```

```sh [root]
docker compose version
```

:::

## 2. 准备配置

按[最小配置](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#最小配置)准备 `/etc/honk/config.dae` 和 `/var/lib/honk`。

镜像已内嵌 doona。要启用网页界面，请将以下配置加入配置文件；如果已有 `experimental` 小节，将内容合并到该小节：

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

## 3. 启动容器

启动容器前，停止并禁用已安装的原生服务。仅在已安装 dae 时执行 dae 命令；仅在已安装原生 honk 时执行 honk 命令。

::: code-group

```sh [sudo]
sudo systemctl disable --now dae.service
sudo systemctl disable --now honk.service
```

```sh [root]
systemctl disable --now dae.service
systemctl disable --now honk.service
```

:::

下载仓库中的 `docker-compose.yml`，并在 `.env` 中写入发布版本号：

```sh
curl -fLO https://raw.githubusercontent.com/daeuniverse/honk/main/docker-compose.yml
echo 'HONK_VERSION=<version>' > .env   # 例如 0.1.0-beta.4
```

如果宿主机使用外部 BTF 文件，请先按第 5 步配置。创建锁文件，然后启动容器并查看日志：

::: code-group

```sh [sudo]
sudo touch /run/honk-core.lock
sudo docker compose up -d
sudo docker compose logs -f
```

```sh [root]
touch /run/honk-core.lock
docker compose up -d
docker compose logs -f
```

:::

该文件从宿主机挂载 `/sys`、`/etc/honk` 和 `/var/lib/honk`。配置目录的挂载会覆盖镜像内仅直连的默认配置；`/var/lib/honk` 保存运行时状态，例如原生 API 的管理员账户，重启或升级后仍然保留。

容器共享宿主机网络，因此网页界面监听宿主机的回环地址。

在 honk 所在主机上打开 <http://127.0.0.1:9527/ui/>，首次访问时创建管理员账号。

## 4. 开机后保留锁文件

锁文件挂载让容器与原生实例共享 `/run/honk-core.lock`，防止容器接管正在运行的数据路径。停止后也应保留此文件；不要删除、替换或截断仍可能被实例持有的锁。

每次开机后，必须先创建锁文件，再自动启动容器。使用 systemd 的宿主机可配置不截断已有文件的开机创建规则：

::: code-group

```sh [sudo]
echo 'f /run/honk-core.lock 0600 root root -' | sudo tee /etc/tmpfiles.d/honk-container.conf
sudo systemd-tmpfiles --create /etc/tmpfiles.d/honk-container.conf
```

```sh [root]
echo 'f /run/honk-core.lock 0600 root root -' > /etc/tmpfiles.d/honk-container.conf
systemd-tmpfiles --create /etc/tmpfiles.d/honk-container.conf
```

:::

其他 init 系统也须在开机启动容器前，以不截断的方式创建该文件。直接使用 `docker run` 或 `podman run` 部署时，同样必须挂载此锁文件。

## 5. 使用外部 BTF 文件（可选）

如果宿主机使用外部原始 BTF 文件，而不是 `/sys/kernel/btf/vmlinux`，将以下内容保存为 `docker-compose.yml` 同目录的 `docker-compose.override.yml`。Compose 的每个命令（包括升级）都会加载它。将 `source` 改为宿主机的原始 BTF 文件路径；环境变量填写容器内的挂载路径：

```yaml
services:
  honk:
    environment:
      HONK_VMLINUX_BTF: /run/honk-vmlinux
    volumes:
      - type: bind
        source: /usr/lib/debug/boot/vmlinux
        target: /run/honk-vmlinux
        read_only: true
        bind:
          create_host_path: false
```

## 6. 重载和查看状态

重载配置：

::: code-group

```sh [sudo]
sudo docker compose exec honk honk-core reload
```

```sh [root]
docker compose exec honk honk-core reload
```

:::

镜像自带 iproute2 和 nftables，容器又与宿主机共用网络命名空间，因此以下命令显示的就是宿主机的状态：

::: code-group

```sh [sudo]
sudo docker compose exec honk ip rule
sudo docker compose exec honk ip route show table all
sudo docker compose exec honk tc filter show dev <网卡> ingress
sudo docker compose exec honk nft list ruleset
```

```sh [root]
docker compose exec honk ip rule
docker compose exec honk ip route show table all
docker compose exec honk tc filter show dev <网卡> ingress
docker compose exec honk nft list ruleset
```

:::

## 下一步

- [首次登录](/zh-CN/doona/first-sign-in)：打开 <http://127.0.0.1:9527/ui/>，创建管理员账号。
- [管理节点、策略组和规则](/zh-CN/doona/routing)：添加节点或订阅和路由规则；在此之前所有流量直连。
- [故障排除](/zh-CN/doona/troubleshooting)：无法正常使用时的排查步骤。

## 7. 升级

修改 `.env` 中的 `HONK_VERSION`，然后重新创建容器：

::: code-group

```sh [sudo]
sudo docker compose pull
sudo docker compose up -d
```

```sh [root]
docker compose pull
docker compose up -d
```

:::

在仓库检出目录中执行 `docker compose build`（使用 sudo 时为 `sudo docker compose build`），可以从已发布的版本构建同一镜像，而不必拉取。

## 8. 卸载

在包含 `docker-compose.yml` 的目录中停止并移除容器：

::: code-group

```sh [sudo]
sudo docker compose down
```

```sh [root]
docker compose down
```

:::

宿主机上的 `/etc/honk`、`/var/lib/honk`、Compose 文件、`.env` 和 `/etc/tmpfiles.d/honk-container.conf` 会保留。已下载的镜像和 `/run/honk-core.lock` 也会保留；不要删除或替换其他实例可能持有的锁文件。
