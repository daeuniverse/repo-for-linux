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

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/user-guide/reload-and-suspend.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
