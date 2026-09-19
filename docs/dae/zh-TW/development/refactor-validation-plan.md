---
title: "重構驗證計劃"
---

<div v-pre lang="zh-TW">

# dae 重構驗證計劃

本文件用於把“重構路線”落到可執行的驗證清單上，避免後續改動只停留在架構討論層面。

目標有三點：

- 在真正重構前，先用契約測試固定高風險邊界。
- 把新增測試和現有測試對映到具體階段，降低迴歸風險。
- 給每個階段提供最小可執行的測試命令，便於逐步推進。

## 驗證原則

- 先驗證錯誤邊界，再驗證生命週期邊界，最後驗證模型邊界。
- 每個階段至少保留一組可以獨立執行的 targeted tests，不依賴全量 `go test ./...`。
- 新增測試優先覆蓋重構前後都必須保持穩定的行為，不覆蓋一次性實現細節。
- 行為重構和結構重構不要混在同一個階段；先用測試鎖住行為，再移動程式碼。

## Phase 1: Config 邊界收緊

目標：

- 把高層 `panic` 路徑改成 `error` 返回。
- 固定 `FunctionOrString` / `FunctionListOrString` 的契約行為。
- 讓 builder / policy 在接收到非法 union 值時返回錯誤，而不是崩潰。

新增測試：

- [config/function_union_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/config/function_union_test.go)
  - `TestFunctionOrStringToFunction`
  - `TestFunctionListOrStringToFunctionList`
  - `TestPatchMustOutboundFallback`
- [component/dns/fallback_contract_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/fallback_contract_test.go)
  - `TestRequestMatcherBuilderRejectsInvalidFallbackType`
  - `TestResponseMatcherBuilderRejectsInvalidFallbackType`
- [component/outbound/dialer_selection_policy_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer_selection_policy_test.go)
  - `TestNewDialerSelectionPolicyFromGroupParamRejectsInvalidPolicyType`
- [control/routing_matcher_builder_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/routing_matcher_builder_test.go)
  - `TestRoutingMatcherBuilderRejectsInvalidFallbackType`

現有輔助測試：

- [config/marshal_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/config/marshal_test.go)
- [pkg/config_parser/config_parser_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/pkg/config_parser/config_parser_test.go)

建議命令：

```bash
go test ./config/... ./pkg/config_parser/... ./component/dns/... ./component/outbound/... ./control/... -run 'FunctionOrString|FunctionListOrString|FallbackType|SelectionPolicy'
```

通過標準：

- 所有非法 union 輸入都返回 `error`。
- 不再依賴 `panic` 來表示設定層高階錯誤。

## Phase 2: DNS 長短狀態分離

目標：

- 把 `DnsController` 中的長期狀態和 generation runtime 分開。
- 繼續支援 reload 期間複用 DNS cache / forwarder warm state。
- 避免舊 generation 上下文取消後，複用的 worker 異常退出。

現有關鍵測試：

- [control/dns_controller_reload_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_controller_reload_test.go)
  - `TestDnsController_RuntimeWorkersSurviveContextCancel`
- [control/dns_forwarder_cache_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_forwarder_cache_test.go)
- [control/dns_singleflight_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_singleflight_test.go)
- [control/dns_control_cache_cleanup_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control_cache_cleanup_test.go)
- [control/dns_cache_scope_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_cache_scope_test.go)

建議命令：

```bash
go test ./control/... -run 'DnsController|dns.*reload|dns.*forwarder|dns.*singleflight|dns.*cache'
```

通過標準：

- DNS runtime 更新後，舊 context 取消不會殺死共享 worker。
- DNS cache / forwarder 生命週期語義保持不變。

## Phase 3: ControlPlane 降級為 facade

目標：

- 把 datapath janitor 和 DNS runtime handoff 從 `ControlPlane` 中抽離。
- 保持 reload / retirement / drain 語義不變。

現有關鍵測試：

- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go)
  - `TestReuseDNSControllerFromUpdatesRuntime`
  - `TestReuseDNSListenerFromTransfersOwnership`
  - `TestReuseDNSListenerFromRejectsProtocolMismatch`
- [control/control_plane_janitor_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_janitor_test.go)
- [control/control_plane_shutdown_udp_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_shutdown_udp_test.go)
- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go)

建議命令：

```bash
go test ./control/... ./cmd/... -run 'ReuseDNS|Drain|Janitor|Shutdown|Retirement'
```

通過標準：

- `ControlPlane` 拆分後，舊/new generation handoff 語義不變。
- janitor 停止和 retirement cleanup 仍然能按預期完成。

## Phase 4: cmd/run 下沉 Runner / ReloadManager

目標：

- 把 staged reload、handoff、retirement 排隊邏輯從 CLI 入口下沉。
- 保持外部 CLI 行為不變。

現有關鍵測試：

- [cmd/run_shutdown_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/run_shutdown_test.go)
- [cmd/reload_progress_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_progress_test.go)
- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go)

建議命令：

```bash
go test ./cmd/... ./control/... -run 'Reload|Progress|Shutdown|Handoff'
```

通過標準：

- CLI 行為不變。
- reload busy / handoff / retirement 的狀態轉換不變。

## Phase 5: Routing IR

目標：

- 引入統一的 normalized rule IR。
- 各 matcher / backend 從 IR 降低，而不是直接從 parser 規則各自解釋。

現有關鍵測試：

- [component/routing/optimizer_contract_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/routing/optimizer_contract_test.go)
- [component/dns/request_rule_split_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/request_rule_split_test.go)
- [component/daedns/router_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/daedns/router_test.go)
- [control/routing_matcher_builder_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/routing_matcher_builder_test.go)

建議命令：

```bash
go test ./component/routing/... ./component/dns/... ./component/daedns/... ./control/... -run 'Routing|Rule|Matcher|Optimizer'
```

通過標準：

- 規則規範化後，DNS/request/response/control backend 的語義不漂移。
- 同一個規則輸入，在不同 backend 上的 fallback / outbound 行為保持一致。

## Phase 6: Dialer 健康模型顯式化

目標：

- 用顯式 health domain API 包裹內部索引模型。
- 保持 UDP data fallback、reload snapshot、recovery backoff 語義不變。

現有關鍵測試：

- [component/outbound/dialer/recovery_bugs_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/recovery_bugs_test.go)
- [component/outbound/dialer_group_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer_group_test.go)
- [control/dial_family_fallback_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dial_family_fallback_test.go)
- [control/udp_dial_guard_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/udp_dial_guard_test.go)

建議命令：

```bash
go test ./component/outbound/... ./component/outbound/dialer/... ./control/... -run 'Recovery|Snapshot|DialerGroup|UDP.*fallback|dial.*guard'
```

通過標準：

- `ReloadHealthSnapshot` / `RestoreHealthSnapshot` 語義不變。
- UDP data-plane fallback 仍然能回落到 DNS UDP / TCP 健康域。

## 建議執行順序

建議按以下順序推進，每完成一個階段都保留一個可長期停留的穩定點：

1. Phase 1: Config 邊界收緊
2. Phase 2: DNS 長短狀態分離
3. Phase 3: ControlPlane facade 化
4. Phase 4: Runner / ReloadManager 下沉
5. Phase 5: Routing IR
6. Phase 6: Dialer 健康模型顯式化

## 評審檢查表

每個重構 PR 在評審時至少回答以下問題：

- 這次改動是否引入了新的狀態所有者？
- 如果有複用物件，複用的是“物件”還是“狀態”？
- 現有 targeted tests 是否覆蓋到了改動邊界？
- 是否把行為改動和結構改動混在了一個提交中？
- 是否留下了新的雙狀態源或新的隱式生命週期耦合？

## 當前已落地的第一步

本次已完成：

- 把 config union helper 從 `panic` 改為返回 `error`
- 給 fallback / policy / routing builder 新增非法 union 輸入的契約測試
- 建立本驗證文件，作為後續重構的執行與迴歸基線

## 當前已落地的第二步

本次繼續完成：

- 刪除 `DnsController` 的 legacy runtime 欄位與 fallback 讀取路徑，統一以 `runtimeState` 作為單一真相來源
- 新增 [control/dns_runtime_test_helpers_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_runtime_test_helpers_test.go) 作為測試期 runtime 構造輔助，避免測試繼續依賴被移除的 legacy 欄位
- 將 DNS 相關測試遷移到 `runtimeState` 構造方式，並透過 `go test ./control/...` 驗證行為未迴歸

## 當前已落地的第三步

本次繼續完成：

- 在 [control/dns_control.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control.go) 中抽出 `dnsControllerStore`，把 `dnsCache`、`dnsForwarderCache`、janitor/evictor 狀態、BPF update worker 狀態以及 preference wait registry 統一收口為長期狀態所有者
- 調整 [control/dns_preference_wait_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_preference_wait_test.go)、[control/dns_lru_e2e_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_lru_e2e_test.go)、[control/dns_control_cache_cleanup_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control_cache_cleanup_test.go)、[control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go) 和 [control/control_plane_real_domain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_real_domain_test.go) 等測試，使其顯式初始化 `dnsControllerStore`，固定長期狀態歸屬遷移後的構造方式
- 新增 [control/dns_runtime_test_helpers_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_runtime_test_helpers_test.go) 中的 `newTestDnsControllerStore`，為後續繼續拆分 DNS 長期狀態和 generation runtime 提供統一測試入口
- 透過以下命令驗證這一步僅改變狀態歸屬，不改變行為：

```bash
go test ./control/...
go test ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

## 當前已落地的第四步

本次繼續完成：

- 在 [control/dns_control.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control.go) 中把 `DnsController` 對 `dnsControllerStore` 的持有從值語義切換為共享指標語義，並新增 `sharedStoreFacade()`，讓後續 reload 可以建立新的 controller facade，同時繼續複用長期 DNS state
- 在 [control/control_plane.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane.go) 中將 `ReuseDNSControllerFrom` 改為“重新整理舊 facade runtime，再建立共享 store 的新 facade 並交給新 generation”，不再繼續把同一個 `DnsController` 物件在新舊 generation 間直接轉移
- 在 [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go) 中固定新的 handoff 契約：
  - 新舊 generation 共享 active DNS controller facade
  - 新 facade 與舊 facade 不是同一個物件
  - 兩者共享同一個 `dnsControllerStore`
  - 舊 facade 的 runtime 也會先更新到新 generation，避免 reload 交接視窗內的舊引用繼續持有舊 runtime
- 調整 [control/dns_runtime_test_helpers_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_runtime_test_helpers_test.go) 的預設測試 store 為最小化形態，避免測試預設構造誤引入未啟動的 evictor queue，保持原有同步 callback 語義
- 透過以下命令驗證 facade 分離後行為未迴歸：

```bash
go test ./control/...
go test ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

本輪補充驗證：

```bash
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

## 當前已落地的第五步

本次繼續完成：

- 在 [control/dns_control.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control.go) 中把 `DnsController` 的 generation-local 行為設定重新整理納入 `UpdateRuntime` / `ReuseForReload`：
  - `qtypePrefer`
  - `optimisticCacheEnabled`
  - `optimisticCacheTtl`
  - `maxCacheSize`
- 將上述行為設定改為原子讀寫，修復 reload 更新與 janitor / lookup 並行存取時的 data race，避免“runtime 指標已切換，但行為設定仍沿用舊 generation 值”的隱性不一致
- 讓 `UpdateRuntime` 和 `ReuseForReload` 對非法 `IpVersionPrefer` 顯式返回 `error`，而不是靜默接受無效執行時設定
- 為此補充並更新以下測試：
  - [control/dns_controller_reload_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_controller_reload_test.go)：新增 reload 後行為設定同步重新整理的契約測試，以及非法 `IpVersionPrefer` 的失敗契約測試
  - [control/dns_cache_race_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_cache_race_test.go)：把 `singleflight` 並行場景收斂成確定性 barrier，固定 `-race` 下的單飛契約，避免測試本身因時序過鬆而誤報
  - [control/dns_preference_wait_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_preference_wait_test.go)、[control/dns_lru_e2e_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_lru_e2e_test.go)、[control/dns_control_cache_cleanup_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control_cache_cleanup_test.go)：更新為原子欄位存取方式，保證測試構造與執行時實現一致

本輪最終驗證：

```bash
go test ./control/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

結論：

- 當前這輪圍繞 config 邊界、`DnsController` 狀態分層、reload facade handoff 與 runtime 行為設定同步的重構已經完成閉環。
- 普通迴歸與 `-race` 迴歸均已通過，可以作為下一批 `ControlPlane` facade 化或更深層 routing / dialer 重構之前的穩定基線。

## 當前已落地的第六步

本次繼續完成：

- 新增 [control/dns_runtime.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_runtime.go)，把原先散落在 `ControlPlane` 根物件上的 DNS orchestration 狀態正式收攏為 `controlPlaneDNSRuntime`：
  - `dnsController`
  - `dnsRouting`
  - `dnsFixedDomainTtl`
  - `dnsListener`
  - prepared start/reuse hook
  - upstream ready/available channel 與 once
  - deferred DNS listener start 狀態
- 在 [control/control_plane.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane.go) 中把以下 DNS 生命週期方法改為委託到 runtime：
  - `CloneDnsCache`
  - `ActiveDnsController`
  - `DetachDnsController`
  - `StopDNSListener`
  - `RestartDNSListener`
  - `ReuseDNSListenerFrom`
  - `ReuseDNSControllerFrom`
  - `SetPreparedDNSStartHook`
  - `SetPreparedDNSReuseHook`
  - `WaitDNSUpstreamsReady`
  - `WaitDNSUpstreamAvailable`
  - `StartPreparedDNSListener`
- 將 `releaseRetainedState` 裡的 DNS 相關清理切換為 runtime 統一釋放，減少 `ControlPlane` 根物件直接持有和逐項回收 DNS 子系統狀態
- 保持外部行為不變，只調整狀態 owner 與方法歸屬，為後續繼續把 `ControlPlane` 降級為 facade 做準備

本次同步調整的測試：

- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go)：更新為顯式構造 `controlPlaneDNSRuntime`，固定 DNS listener/controller handoff 與 prepared start/reuse hook 的新 owner 邊界

本輪驗證：

```bash
go test ./control/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

結論：

- `ControlPlane` 已經開始從“直接持有所有 DNS 細節”的大物件，轉向“組合一個內部 DNS runtime 並委託生命週期操作”的形態。
- 這一步仍然是純邊界重排，沒有引入新的 DNS 執行語義；普通迴歸和 `-race` 迴歸均通過。

## 當前已落地的第七步

本次繼續完成：

- 新增 [config/decode.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/config/decode.go)，把 `Config.New()` 根部的 section 分發從“反射遍歷整個 `Config` 結構體”改成顯式 decoder registry：
  - `global`
  - `subscription`
  - `node`
  - `group`
  - `routing`
  - `dns`
- 在 [config/config.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/config/config.go) 中把根部必選 section 校驗和 parse 順序顯式化，讓後續逐節替換反射 parser 時，不再需要先動 `Config.New()` 的主控制流
- 保留現有 section 級 `SectionParser` / `ParamParser` 行為，因此這一步只是在根入口收緊邊界，不改 DSL 語義
- 新增 [config/decode_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/config/decode_test.go)，固定顯式 section decoder 分發路徑和 unknown section 錯誤邊界

本輪驗證：

```bash
go test ./config/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

結論：

- `Config.New()` 已不再依賴根部反射掃描來決定 section 解析入口。
- 關鍵 section 的 decoder 邊界已經顯式化，為後續繼續替換 `routing` / `dns` / `group` 的內部反射解析打下基礎。

## 當前已落地的第八步

本次繼續完成：

- 新增 [control/generation_state.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/generation_state.go)，把 `ControlPlane` 中明顯屬於 generation 生命週期的狀態收口為 `controlPlaneGenerationState`：
  - `outbounds`
  - `referencedOutbounds`
  - `dialMode`
  - `routingMatcher`
  - `bootstrapResolvers`
- 新增 [control/datapath_janitor.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/datapath_janitor.go)，把 datapath janitor 的 owner 狀態收口為 `controlPlaneDatapathJanitor`：
  - stop/done/once/started 狀態
  - cleanup mutex
  - janitor scratch buffers
- 在 [control/control_plane.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane.go) 中將上述狀態改為內部物件持有，並讓 `releaseRetainedState()`、scratch 獲取與初始化路徑統一委託到新 owner
- 更新 [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go)、[control/control_plane_janitor_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_janitor_test.go)、[control/control_plane_real_domain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_real_domain_test.go)、[control/dscp_routing_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dscp_routing_test.go)、[control/mac_routing_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/mac_routing_test.go)、[control/metadata_routing_chain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/metadata_routing_chain_test.go)、[control/dial_family_fallback_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dial_family_fallback_test.go)、[control/udp_reuse_simulation_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/udp_reuse_simulation_test.go) 的構造方式，使測試顯式體現新的 owner 邊界

本輪驗證：

```bash
go test ./config/... ./control/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

結論：

- `ControlPlane` 已進一步從“所有 generation / datapath 狀態都直接堆在根物件上”的形態，推進到“根物件組合 generation state、dns runtime、datapath janitor”的形態。
- 這一步仍然是所有權與生命週期邊界重排，沒有引入新的 datapath 清理語義；普通迴歸和 `-race` 迴歸均通過。

## 當前已落地的第九步

本次繼續完成：

- 新增 [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_manager.go)，把 `cmd/run.go` 中原先散落的 reload 排隊、staged handoff、retirement、progress/pprof 重新整理邏輯收口為 `reloadManager`
- 新增 [cmd/runner.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/runner.go)，讓入口層從“一個超大 `Run` 函式”轉為 `Runner + ReloadManager` 的組合；[cmd/run.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/run.go) 現在只負責組裝 `Runner` 並委託執行
- 更新 [cmd/run_shutdown_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/run_shutdown_test.go) 的 reload manager 契約測試，固定：
  - shutdown handoff 會優先消費 pending staged handoff
  - queued reload request 只保留最新請求時間戳記

本輪驗證：

```bash
go test ./cmd/... ./control/...
go test ./...
go test -race ./cmd/... ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

結論：

- `cmd/run` 的生命週期狀態機已經不再完全寄居在入口函式本體裡。
- staged reload / handoff / retirement 的 owner 邊界已經轉為 `Runner` 與 `ReloadManager` 組合，後續繼續下沉時不必再從 CLI 控制流直接拆。

## 當前已落地的第十步

本次繼續完成：

- 新增 [component/routing/ir.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/routing/ir.go) 和 [component/routing/normalize.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/routing/normalize.go)，引入共享的 `routing.NormalizedProgram`
- 新增 [component/dns/routing_program.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/routing_program.go)，把 DNS request routing 的“最佳化 + internal selector split”收口為 `NormalizedRequestRoutingProgram`
- 在以下 builder 中新增 `FromProgram` 入口，使 backend 從共享 program 降低，而不是各自直接解釋 parser 規則：
  - [component/dns/request_routing.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/request_routing.go)
  - [component/dns/response_routing.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/response_routing.go)
  - [control/routing_matcher_builder.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/routing_matcher_builder.go)
- 將以下呼叫點遷移到 program 入口：
  - [component/dns/dns.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/dns.go)
  - [component/daedns/router.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/daedns/router.go)
  - [control/control_plane.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane.go)
- 新增 [component/routing/normalize_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/routing/normalize_test.go) 和 [component/dns/routing_program_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/routing_program_test.go)，固定：
  - program 構造會 clone 原始規則，不反向汙染輸入
  - request routing program 會穩定拆分 DNS / sub / node / subnode 規則

本輪驗證：

```bash
go test ./component/routing/... ./component/dns/... ./control/... ./component/outbound/... ./cmd/...
go test ./...
```

結論：

- routing 層已經有了共享的 normalize/program 邊界。
- DNS request、DNS response、control matcher 三個 backend 已經從“各自拿 parser rules 解釋”推進到“從共同的 normalized program lowering”。

## 當前已落地的第十一步

本次繼續完成：

- 新增 [component/outbound/dialer/health_domain.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/health_domain.go)，引入顯式 `HealthDomain` / `HealthKey` API，並在以下路徑開始替代散落的硬編碼 index：
  - [component/outbound/dialer/connectivity_check.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/connectivity_check.go)：`NetworkType.Index()` 現在透過 `HealthKey` 歸一化對映
  - [component/outbound/dialer_group.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer_group.go)：標準 selection network types 與 alive set 建置改為基於 `StandardHealthKeys()`
- 新增 [component/outbound/dialer/recovery_state.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/recovery_state.go)，把 recovery/backoff/timer/punishment 狀態機提為 `dialerRecoveryManager`
- 在 [component/outbound/dialer/dialer.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/dialer.go) 中保留 `Dialer` 作為 facade，健康快照、restore、recovery trigger/cancel/backoff/stability 相關方法統一委託到 recovery manager
- 新增 [component/outbound/dialer/health_domain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/health_domain_test.go)，固定：
  - TCP DNS 語義仍然對映到共享 TCP 健康域
  - canonical health keys 仍覆蓋現有 6 個標準 collection

本輪驗證：

```bash
go test ./component/outbound/... ./component/outbound/dialer/... ./control/...
go test ./...
```

結論：

- dialer 健康模型已經從“外圍呼叫者直接依賴內部 idx 約定”推進到“有顯式 health domain API 和 recovery manager owner”的形態。
- 現有 recovery snapshot / restore / backoff 行為由既有測試持續覆蓋，新增 API 只是顯式化邊界，沒有改變既有語義。

## 審閱修復記錄

本次根據未提交修改審閱結果補充修復：

- 恢復 [config/config.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/config/config.go) 中 `FunctionOrStringToFunction` 與 `FunctionListOrStringToFunctionList` 的歷史匯出簽章，避免破壞外部 API；新增 `ParseFunctionOrString` 與 `ParseFunctionListOrString` 供內部 error-return 呼叫鏈使用。
- 為 [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_manager.go) 中跨 goroutine 讀寫的 reload 狀態加鎖，包括 `reloadingErr`、pending staged handoff、pending retirement channel 與 reload 時間戳記，並讓 [cmd/run.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/run.go) 統一走 `finishReloadSuccess()` 清理成功路徑。
- 在 [control/dns_control.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control.go) 與 [control/dns_runtime.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_runtime.go) 補充 DNS reload ownership model 註解，明確“獨立 facade + 共享 store + handoff bridge”關係。
- 調整 [component/dns/routing_program.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/routing_program.go)，`NormalizedRequestRoutingProgram` 構造不再先建立再丟棄中間 program，而是一次最佳化後拆分 DNS / sub / node / subnode 規則。
- 將 DNS controller 業務路徑的 store 檢查從靜默建立空 store 改為顯式斷言，避免測試或手工構造 controller 時掩蓋初始化錯誤；reload 相容橋仍會顯式初始化缺失 store。
- 補充 [component/routing/normalize_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/routing/normalize_test.go) 的 `Lower` 邊界測試，覆蓋空規則、nil parser、fallback 錯誤傳播。
- 刪除 [component/outbound/dialer/dialer.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/dialer.go) 中與 `triggerRecoveryDetection` 完全等價的 `triggerRecoveryDetectionInternal` 死程式碼。

本輪驗證：

```bash
go test ./config/... ./component/dns/... ./component/routing/... ./component/outbound/... ./control/... ./cmd/...
go test ./...
go test -race ./...
make ebpf
```

結論：

- 普通全量測試與 race 全量測試均通過。
- 這輪修復消除了審閱中指出的匯出 API 破壞、reload manager 未同步共享欄位、重複清理入口、routing program 中間包裝浪費、`Lower` 邊界測試不足和 dialer 死程式碼問題。

## 後續審閱修復記錄

本次根據新增審閱點繼續修復：

- 為 [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_manager.go) 的 `startControlPlaneRetirement` 補充單元測試，覆蓋 retirement channel 釋出、退休協程完成以及舊 generation cancel 呼叫。
- 將 DNS 設定比較從 `reflect.DeepEqual` 改為穩定 fingerprint 比較，避免在 [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_manager.go) 的 staged DNS reuse 判斷中依賴反射深比較。
- 調整 [component/dns/routing_program.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/routing_program.go)，僅在無 optimizer 時執行 `DeepCloneRules`；有 optimizer 時直接使用 `ApplyRulesOptimizers` 內部 clone 結果，避免重複深複製。
- 在 [component/outbound/dialer/health_domain.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/health_domain.go) 新增 `HealthKeyFromCollectionIndex`，並讓 [component/outbound/dialer/dialer.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/dialer.go) 的 collection index 反查不再遍歷 6 個標準 key。

本輪驗證：

```bash
go test ./cmd/... ./component/dns/... ./component/outbound/...
go test ./...
go test -race ./...
```

結論：

- 新增 retirement 單元測試通過。
- 普通全量測試與 race 全量測試均通過。

## DNS Fingerprint 覆蓋修復記錄

本次根據新增審閱點繼續修復：

- 在 [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_manager.go) 的 `dnsConfigFingerprint` 上補充維護註解，明確該函式必須與 `config.Dns` 頂層欄位保持同步。
- 在 [cmd/run_shutdown_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/run_shutdown_test.go) 新增 `TestDNSConfigFingerprintCoversAllDnsFields`，透過反射校驗 `config.Dns` 頂層欄位覆蓋率。後續新增 DNS 設定欄位但未更新 fingerprint 時，測試會失敗。

本輪驗證：

```bash
go test ./cmd/...
go test ./...
go test -race ./...
```

結論：

- 普通全量測試與 race 全量測試均通過。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/zh/development/refactor-validation-plan.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
