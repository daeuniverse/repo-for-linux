# Debian / Ubuntu

Configure the repository once for all packages. If it is already configured, skip to package selection. Package installation commands use sudo.

## 1. Install `curl`

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-1.md-->

## 2. Add the repository

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-2.md-->

## 3. Import the GPG key

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-3.md-->

## 4. Select software

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
