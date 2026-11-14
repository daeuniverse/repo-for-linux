# Docker

使用 [GitHub Container Registry](https://github.com/daeuniverse/honk/pkgs/container/honk) 上的映像 `ghcr.io/daeuniverse/honk` 執行 honk。映像包含 musl `full` 發行版的二進位檔，以及儲存庫固定版本的 GeoIP 和 Geosite 檔案，建置時會對每個下載檔案做 SHA-256 驗證。

每個發行版以去掉 `v` 的版本號作為映像標籤，例如 `ghcr.io/daeuniverse/honk:0.1.0-beta.6`；`latest` 只指向正式版，不含預發行版。映像提供 linux/amd64 和 linux/arm64 兩種架構，拉取不需要登入。

已設定 sudo 的一般使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。

## 1. 檢查主機

honk 需要載入並掛接 eBPF 程式、建立 `dae0` 和 `daens` 命名空間、修改 sysctl，還要在主機的 bpffs 上固定 map。容器因此必須以特權模式執行，並共用主機的網路和 PID 命名空間。它對主機的變更與直接安裝相同，沒有隔離。

主機必須滿足[核心要求](../how-to-start.md#linux-核心要求)，包括 Linux 6.12+ 和已掛載的 bpffs。

後續步驟還需要含 Compose 外掛程式的 [Docker Engine](https://docs.docker.com/engine/install/) 和 `curl`。以下列指令檢查 Compose；已安裝外掛程式時會輸出 Compose 的版本。

::: code-group

```sh [sudo]
sudo docker compose version
```

```sh [root]
docker compose version
```

:::

## 2. 準備設定

依照[最小設定](../how-to-start.md#最小設定)準備 `/etc/honk/config.dae` 和 `/var/lib/honk`。

映像內含 doona。請在設定檔加入以下內容以啟用網頁介面；若已有 `experimental` 區段，將內容併入該區段：

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

## 3. 啟動容器

啟動容器前，停止並停用已安裝的原生服務。僅在已安裝 dae 時執行 dae 指令；僅在已安裝原生 honk 時執行 honk 指令。

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

下載儲存庫中的 `docker-compose.yml`，並在 `.env` 中寫入發行版本號：

```sh
curl -fLO https://raw.githubusercontent.com/daeuniverse/honk/main/docker-compose.yml
echo 'HONK_VERSION=<version>' > .env   # 例如 0.1.0-beta.6
```

若主機使用外部 BTF 檔案，先完成第 5 步的設定。建立鎖定檔，然後啟動容器並查看日誌：

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

該檔案從主機掛載 `/sys`、`/etc/honk` 和 `/var/lib/honk`，並以唯讀方式掛載 `/etc/localtime`。設定目錄的掛載會覆蓋映像內只走直連的預設設定；`/var/lib/honk` 儲存執行階段狀態，例如原生 API 的管理員帳號，重新啟動或升級後仍然保留。

容器共用主機網路，因此網頁介面監聽主機的 loopback 位址。

在執行 honk 的主機上開啟 <http://127.0.0.1:9527/ui/>，並於首次存取時建立管理員帳號。

## 4. 開機後保留鎖定檔

鎖定檔掛載讓容器與原生執行個體共用 `/run/honk-core.lock`，防止容器接管正在執行的資料路徑。停止後也應保留此檔案；不要刪除、取代或截斷仍可能被執行個體持有的鎖。

每次開機後，必須先建立鎖定檔，再自動啟動容器。使用 systemd 的主機可設定不截斷既有檔案的開機建立規則：

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

其他 init 系統也須在開機啟動容器前，以不截斷的方式建立該檔案。直接使用 `docker run` 或 `podman run` 部署時，同樣必須掛載此鎖定檔。

## 5. 使用外部 BTF 檔案（可選）

如果主機使用外部原始 BTF 檔案，而不是 `/sys/kernel/btf/vmlinux`，請將以下內容儲存為與 `docker-compose.yml` 同目錄的 `docker-compose.override.yml`。Compose 的每個指令（包括升級）都會載入它。將 `source` 改為主機上原始 BTF 檔案的路徑；環境變數填寫容器內的掛載路徑：

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

## 6. reload 與查看狀態

reload 設定：

::: code-group

```sh [sudo]
sudo docker compose exec honk honk-core reload
```

```sh [root]
docker compose exec honk honk-core reload
```

:::

映像內建 iproute2 和 nftables，容器又與主機共用網路命名空間，因此以下指令顯示的就是主機的狀態：

::: code-group

```sh [sudo]
sudo docker compose exec honk ip rule
sudo docker compose exec honk ip route show table all
sudo docker compose exec honk tc filter show dev <介面> ingress
sudo docker compose exec honk nft list ruleset
```

```sh [root]
docker compose exec honk ip rule
docker compose exec honk ip route show table all
docker compose exec honk tc filter show dev <介面> ingress
docker compose exec honk nft list ruleset
```

:::

## 下一步

- [首次登入](/zh-TW/doona/first-sign-in)：開啟 <http://127.0.0.1:9527/ui/>，建立管理員帳號。
- [管理節點、策略群組和規則](/zh-TW/doona/routing)：新增節點或訂閱和路由規則；在此之前所有流量直接連線。
- [疑難排解](/zh-TW/doona/troubleshooting)：無法正常運作時的檢查項目。

## 7. 升級

修改 `.env` 中的 `HONK_VERSION`，然後重新建立容器：

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

在儲存庫檢出目錄中執行 `docker compose build`（使用 sudo 時為 `sudo docker compose build`），可以直接用已發行的版本建置同一個映像，不必拉取。

## 8. 解除安裝

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
