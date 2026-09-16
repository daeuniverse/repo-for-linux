<div v-pre lang="zh-TW">

<!-- installation-1:start -->
### Docker

預建置映像及相關文件位於 <https://hub.docker.com/r/daeuniverse/dae>。

也可以使用 `docker compose`：

```shell
git clone --depth=1 https://github.com/daeuniverse/dae
cd dae
```

::: code-group

```shell [sudo]
sudo docker compose up -d --build
```

```shell [root]
docker compose up -d --build
```

:::
<!-- installation-1:end -->

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
