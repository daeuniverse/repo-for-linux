直接从软件源下载源配置文件。
根据 APT 版本，选择以下一种方式。

::: code-group

```sh [APT ≥ 3.0 · sudo]
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.sources https://daeuniverse.pages.dev/daeuniverse.sources
```

```sh [APT ≥ 3.0 · root]
curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.sources https://daeuniverse.pages.dev/daeuniverse.sources
```

```sh [APT < 3.0 · sudo]
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.list https://daeuniverse.pages.dev/daeuniverse.list
```

```sh [APT < 3.0 · root]
curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.list https://daeuniverse.pages.dev/daeuniverse.list
```

:::
