---
title: "重新載入與暫停"
---

<div v-pre lang="zh-TW">

# 重新載入與暫停

dae 可在不重啟的情況下重新載入設定或臨時暫停。

## 重新載入

dae 重新載入設定時通常不會中斷現有連線，且比重啟快得多。執行重新載入還會同時更新全部訂閱。

::: code-group

```shell [sudo]
sudo dae reload
```

```shell [root]
dae reload
```

:::

## 暫停

暫停 dae：

::: code-group

```shell [sudo]
sudo dae suspend
```

```shell [root]
dae suspend
```

:::

## 恢復

使用重新載入命令恢復：

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

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/user-guide/reload-and-suspend.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
