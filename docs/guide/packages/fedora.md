# Fedora / RHEL

Configure the repository once for all packages. If it is already configured, skip to package selection. Package installation commands use sudo.

## 1. Add the repository

<!--@include: @/.vitepress/snippets/repositories/en-US/fedora-1.md-->

## 2. Select software

::: code-group

```sh [dae]
sudo dnf install dae
```

```sh [daed]
sudo dnf install daed
```

```sh [v2rayA]
sudo dnf install v2raya
```

```sh [v2ray]
sudo dnf install v2ray
```

```sh [Xray]
sudo dnf install xray
```

```sh [Juicity]
sudo dnf install juicity
```

```sh [Juicity-rs]
sudo dnf install juicity-rs
```

```sh [v2ray-rules-dat]
sudo dnf install v2ray-rules-dat
```

:::
