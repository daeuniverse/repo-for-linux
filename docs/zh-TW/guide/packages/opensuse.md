# openSUSE

所有套件共用套件來源設定。已新增來源時，可直接選擇軟體安裝。已設定 sudo 的一般使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。

## 1. 新增套件來源

<!--@include: @/.vitepress/snippets/repositories/zh-TW/opensuse-1.md-->

## 2. 選擇軟體

| 軟體 | 套件名稱 |
| --- | --- |
| dae | `dae` |
| [daed](/zh-TW/daed/)（已歸檔，請勿用於新安裝） | `daed` |
| [doona](/zh-TW/doona/) | `doona` |
| v2rayA | `v2raya` |
| v2ray | `v2ray` |
| Xray | `xray` |
| Juicity | `juicity` |
| Juicity-rs | `juicity-rs` |
| v2ray-rules-dat | `v2ray-rules-dat` |

將指令中的 `PACKAGE` 替換為表中的套件名稱。

doona 另提供 `doona-fonts` 與 `doona-precompressed`，均為可選套件。

::: code-group

```sh [sudo]
sudo zypper install PACKAGE
```

```sh [root]
zypper install PACKAGE
```

:::
