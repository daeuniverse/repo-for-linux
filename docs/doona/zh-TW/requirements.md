---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 執行需求 {#requirements}

安裝 doona 與 honk 前，先檢查閘道器與瀏覽器。個別頁面或操作的條件見[功能需求](feature-requirements.md)。

## 閘道器 {#閘道器}

啟動後端前，請按 honk 的 [Linux 核心要求](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#linux-内核要求)與 [bpffs 設定](https://github.com/daeuniverse/honk/blob/main/doc/zh/how-to-start.md#bpffs)檢查閘道器。

| 元件 | 需求 |
| --- | --- |
| 作業系統 | Linux；實際透明代理後端須以 root 身分運作。 |
| 核心 | Linux 6.12 或更新版本；實際 eBPF 後端會拒絕更早的核心。 |
| cgroup | 支援 BPF 的 cgroup v2；必要的通訊端掛鉤須成功附加。 |
| 核心型別資訊 | 與目前核心相符的原始 BTF，不是 ELF 除錯映像。 |
| BPF 檔案系統 | 預設固定目錄要求在 `/sys/fs/bpf` 掛載 bpffs。 |
| HTTPS 下載 | 發行版提供的系統 CA 憑證庫。 |

首次啟動實際後端時，保留主控台或其他連接閘道器的方式，因為 honk 會修改閘道器的網路設定。

使用上述 honk 指南中的命令檢查核心選項：

- 實際後端需要 `CONFIG_BPF=y`、`CONFIG_BPF_SYSCALL=y`、`CONFIG_BPF_JIT=y`、`CONFIG_CGROUP_BPF=y`、`CONFIG_NET_SCHED=y`、`CONFIG_NET_CLS_ACT=y`、`CONFIG_NET_XGRESS=y` 和 `CONFIG_NET_NS=y`。
- `CONFIG_NET_CLS_ACT` 會選取 `CONFIG_NET_XGRESS`。TCX 後端不要求舊的 `CONFIG_NET_CLS_BPF` 或 `CONFIG_NET_SCH_INGRESS` 選項。
- 預設的 UDP 首包暫存處理還需要 `CONFIG_NF_TABLES`、`CONFIG_NF_TABLES_INET`、`CONFIG_NFT_CT`、`CONFIG_NFT_QUEUE` 和 `CONFIG_NETFILTER_NETLINK_QUEUE`，各項須設為 `y` 或 `m`。

設定了 `HONK_VMLINUX_BTF` 時，honk 從該路徑讀取原始 BTF。否則依序嘗試 `/sys/kernel/btf/vmlinux` 和 `/usr/lib/debug/boot/vmlinux`；OpenWrt 的 `vmlinux-btf` 套件提供後者。

確認 `/sys/fs/bpf` 是 bpffs 掛載點，而不只是目錄。系統不會自動掛載時，使用上述 honk bpffs 說明中的 `/etc/fstab` 項目。


## honk 版本 {#honk-version}

使用實作 doona 原生 API 契約且啟用 `native-api` 建置功能的 honk。僅憑版本號無法判斷相容性。缺少該建置功能的程式，即使新增 API 組態也無法提供 API。

按[安裝指南](install.md)選擇相容的 honk-core 壓縮檔。應用程式的[契約版本記錄](https://github.com/Zakkaus/doona/blob/main/contract/api-standardize/SOURCE.md)列出預期的 API。

在閘道器上執行：

```sh
honk-core --version
```

登入後，在**系統狀態**中核對正在運作的引擎版本是否與已安裝的程式一致。API 缺失或建置遭拒時，查看[原生 API 疑難排解](troubleshooting.md#no-native-api)。

## 瀏覽器與原始碼建置 {#瀏覽器與原始碼建置}

| 元件 | 需求 |
| --- | --- |
| 瀏覽器 | 標準版建置目標：Chrome 或 Edge 120、Firefox 121、Safari 17 或更新版本；JavaScript 目標為 ES2022。 |
| 建置應用程式 | Node `^22.13.0 \|\| ^24.0.0 \|\| >=26.0.0`，pnpm 11.15.1。 |
| 建置本文件網站 | Node `^22.18.0 \|\| ^24.0.0 \|\| >=26.0.0`，pnpm 11.15.1。 |

只有[開發](development.md)時才需要 Node 與 pnpm，託管已建置的介面不需要。依程序名稱路由的額外條件見[功能需求](feature-requirements.md#req-process-routing)。

</div>

---

來源：[doona-docs](https://github.com/Zakkaus/doona-docs)，採用 [CC BY 4.0 授權條款](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
