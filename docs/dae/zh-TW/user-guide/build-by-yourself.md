---
title: "從原始碼建置"
---

<div v-pre lang="zh-TW">

# 從原始碼建置

## 建置

### 建置依賴

```shell
clang >= 10
llvm >= 10 (optional)
golang >= 1.26
make
```

### 編譯

```shell
git clone https://github.com/daeuniverse/dae.git
cd dae
git submodule update --init
```

::: code-group

```shell [最小依赖]
## Minimal dependency build
make GOFLAGS="-buildvcs=false" \
  CLANG=clang
```

```shell [普通构建]
## Normal build
make
```

```shell [ARMv7]
## Cross compile
# To armv7 CPU architect:
make CGO_ENABLED=0 GOARCH=arm GOARM=7
```

```shell [MIPS]
# To mips CPU architect:
make CGO_ENABLED=0 GOARCH=mips
```

:::

### 各架構的 trace 支援

當工具鏈能夠生成可選的 `dae trace` eBPF 程式時，`make` 會將其建置進二進位檔案。結果記錄在 `.build_tags` 中：包含該程式時為 `trace`，未包含時為空。

| 目標架構 | trace 建置行為 |
| --- | --- |
| `arm`、`mips`、`mips64`、`mips64le`、`mipsle`、`s390x` | Makefile 的 `TRACE_UNSUPPORTED_GOARCH` 將這些架構列為不支援；建置時輸出 `WARNING`，繼續生成不帶 `trace` 建置標籤的二進位檔案 |
| 其他 `GOARCH` | trace 生成失敗會報錯，不會在沒有提示的情況下生成缺少 `dae trace` 的二進位檔案 |

該清單基於實際驗證，而非推測；BPF Test 工作流程會透過 `./scripts/check-trace-arch-matrix.sh` 重新驗證。可用以下命令按架構重現：

```shell
git submodule update --init
GOARCH=mips BPF_CLANG=clang go generate ./trace/trace.go    # fails: no compiler specified
GOARCH=mips64 BPF_CLANG=clang go generate ./trace/trace.go  # fails: unsupported target
```

不要僅因 `github.com/cilium/ebpf` 的 `gen.FindTarget()` 接受某個架構，就將其從清單中移除。目標查詢與編譯是不同的步驟：`mips` 能通過前者，卻無法通過後者。原因是 `bpf_tracing.h` 選擇了 mips 的 `pt_regs` 佈局，而 `dae_bpf_headers` 子模組提供的 `vmlinux.h` 則退回到 x86。

`dae trace` 本身要求核心版本 >= 5.15；dae 的其餘功能要求核心版本 >= 5.17。

## 執行

### 執行期依賴

dae 使用 [geoip.dat](https://github.com/v2fly/geoip/releases/latest) 和 [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest) 資料進行流量分流。

::: code-group

```shell [sudo]
sudo mkdir -p /usr/local/share/dae/
pushd /usr/local/share/dae/
sudo curl -L -o geoip.dat https://github.com/v2fly/geoip/releases/latest/download/geoip.dat
sudo curl -L -o geosite.dat https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat
popd
```

```shell [root]
mkdir -p /usr/local/share/dae/
pushd /usr/local/share/dae/
curl -L -o geoip.dat https://github.com/v2fly/geoip/releases/latest/download/geoip.dat
curl -L -o geosite.dat https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat
popd
```

:::

### 執行

下載範例設定檔：

```shell
curl -L -o example.dae https://github.com/daeuniverse/dae/raw/main/example.dae
```

請參閱 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

調整設定後，執行 dae：

::: code-group

```shell [sudo]
sudo ./dae run -c example.dae
```

```shell [root]
./dae run -c example.dae
```

:::

> **注意**：也可將 dae 作為 systemd 常駐程式執行，參見[常駐程式服務指南](/zh-TW/dae/user-guide/run-as-daemon)。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/user-guide/build-by-yourself.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
