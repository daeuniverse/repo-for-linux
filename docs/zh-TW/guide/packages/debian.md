# Debian / Ubuntu

所有套件共用套件來源設定。已新增來源時，可直接選擇軟體安裝。已設定 sudo 的一般使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。

## 1. 安裝 `curl`

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-1.md-->

## 2. 新增套件來源

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-2.md-->

## 3. 匯入 GPG 公鑰

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-3.md-->

## 4. 選擇軟體

| 軟體 | 套件名稱 |
| --- | --- |
| dae | `dae` |
| [daed](/zh-TW/daed/)（已歸檔，請勿用於新安裝） | `daed` |
| v2rayA | `v2raya` |
| v2ray | `v2ray` |
| Xray | `xray` |
| Juicity | `juicity` |
| Juicity-rs | `juicity-rs` |
| v2ray-rules-dat | `v2ray-rules-dat` |

將指令中的 `PACKAGE` 替換為表中的套件名稱。

::: code-group

```sh [sudo]
sudo apt update
sudo apt install PACKAGE
```

```sh [root]
apt update
apt install PACKAGE
```

:::
