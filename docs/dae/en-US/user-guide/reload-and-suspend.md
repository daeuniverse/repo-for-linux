---
title: "Reload and suspend"
---

<div v-pre lang="en-US">

# Reload and Suspend

dae can reload its configuration or suspend temporarily without restarting.

## Reload

Reloading is much faster than restarting and generally preserves existing
connections. It also updates all subscriptions at once:

::: code-group

```shell [sudo]
sudo dae reload
```

```shell [root]
dae reload
```

:::

## Suspend

Suspend dae temporarily:

::: code-group

```shell [sudo]
sudo dae suspend
```

```shell [root]
dae suspend
```

:::

## Resume

To resume, reload:

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

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/user-guide/reload-and-suspend.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
