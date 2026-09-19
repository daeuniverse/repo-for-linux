---
title: "重载与暂停"
---

<div v-pre lang="zh-CN">

# 重载与暂停

dae 可在不重启的情况下重载配置或临时暂停。

## 重载

dae 重载配置时通常不会中断现有连接，且比重启快得多。执行重载还会同时更新全部订阅。

::: code-group

```shell [sudo]
sudo dae reload
```

```shell [root]
dae reload
```

:::

## 暂停

暂停 dae：

::: code-group

```shell [sudo]
sudo dae suspend
```

```shell [root]
dae suspend
```

:::

## 恢复

使用重载命令恢复：

::: code-group

```shell [sudo]
sudo dae reload
```

```shell [root]
dae reload
```

:::

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/user-guide/reload-and-suspend.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
