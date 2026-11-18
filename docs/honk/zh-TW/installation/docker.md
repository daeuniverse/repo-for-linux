# Docker

使用 [GitHub Container Registry](https://github.com/daeuniverse/honk/pkgs/container/honk) 上的映像 `ghcr.io/daeuniverse/honk` 執行 honk。honk 的[使用 Docker 執行](../how-to-start.md#使用-docker-執行)涵蓋主機需求、儲存庫的 `docker-compose.yml`、鎖定檔、外部 BTF 和升級。

映像內含 doona。在 honk 的[網頁介面與 API](../how-to-start.md#網頁介面與-api)加入 `native_api` 區塊，再依 doona 的[首次登入](/zh-TW/doona/first-sign-in)開啟介面。

## 解除安裝

在包含 `docker-compose.yml` 的目錄中停止並移除容器：

::: code-group

```sh [sudo]
sudo docker compose down
```

```sh [root]
docker compose down
```

:::

主機上的 `/etc/honk`、`/var/lib/honk`、Compose 檔案、`.env` 與 `/etc/tmpfiles.d/honk-container.conf` 會保留。已下載的映像與 `/run/honk-core.lock` 也會保留；不要刪除或取代其他執行個體可能持有的鎖定檔。
