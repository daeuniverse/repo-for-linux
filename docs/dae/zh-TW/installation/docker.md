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

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
