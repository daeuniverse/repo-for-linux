# Fedora / RHEL

所有套件共用套件來源設定。已新增來源時，可直接選擇軟體安裝。安裝命令使用 sudo；已進入 root shell 時，請移除命令中的 `sudo`。

## 1. 新增套件來源

<!--@include: @/.vitepress/snippets/repositories/zh-TW/fedora-1.md-->

## 2. 選擇軟體

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
