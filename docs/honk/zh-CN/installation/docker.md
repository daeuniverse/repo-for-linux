# Docker

使用 [GitHub Container Registry](https://github.com/daeuniverse/honk/pkgs/container/honk) 上的镜像 `ghcr.io/daeuniverse/honk` 运行 honk。honk 的[使用 Docker 运行](../how-to-start.md#使用-docker-运行)涵盖宿主机要求、仓库的 `docker-compose.yml`、锁文件、外部 BTF 和升级。

镜像已内嵌 doona。在 honk 的[网页界面与 API](../how-to-start.md#网页界面与-api)加入 `native_api` 块，再按 doona 的[首次登录](/zh-CN/doona/first-sign-in)打开界面。

## 卸载

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
