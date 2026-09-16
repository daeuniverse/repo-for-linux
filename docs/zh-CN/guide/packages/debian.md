# Debian / Ubuntu

所有软件包共用软件源配置。已添加软件源时，请直接跳到第 4 步选择软件。安装命令使用 sudo。

## 1. 安装 `curl`

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-1.md-->

## 2. 添加软件源

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-2.md-->

## 3. 导入 GPG 公钥

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-3.md-->

## 4. 选择软件

::: code-group

```sh [dae]
sudo apt update
sudo apt install dae
```

```sh [daed]
sudo apt update
sudo apt install daed
```

```sh [v2rayA]
sudo apt update
sudo apt install v2raya
```

```sh [v2ray]
sudo apt update
sudo apt install v2ray
```

```sh [Xray]
sudo apt update
sudo apt install xray
```

```sh [Juicity]
sudo apt update
sudo apt install juicity
```

```sh [Juicity-rs]
sudo apt update
sudo apt install juicity-rs
```

```sh [v2ray-rules-dat]
sudo apt update
sudo apt install v2ray-rules-dat
```

:::
