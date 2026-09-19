---
title: "Refactoring validation plan"
---

<div v-pre lang="en-US">

# Refactoring validation plan

This document turns the “refactor roadmap” into an executable validation checklist, so that subsequent changes do not remain only at the architectural-discussion level.

There are three objectives:

- Before the actual refactor, use contract tests to lock down high-risk boundaries.
- Map new and existing tests to specific phases to reduce regression risk.
- Provide each phase with the smallest runnable test command to enable incremental progress.

## Validation Principles

- Validate error boundaries first, then lifecycle boundaries, and finally model boundaries.
- Each phase retains at least one independently runnable set of targeted tests, without relying on the full `go test ./...`.
- New tests prioritize behavior that must remain stable both before and after the refactor, rather than one-off implementation details.
- Do not combine behavioral and structural refactors in the same phase; first lock down behavior with tests, then move code.

## Phase 1: Tighten Config Boundaries

Objectives:

- Change high-level `panic` paths to return `error`.
- Lock down the contract behavior of `FunctionOrString` / `FunctionListOrString`.
- Make builders / policies return errors, rather than crash, when they receive invalid union values.

New tests:

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

Existing supporting tests:

- [config/marshal_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/config/marshal_test.go)
- [pkg/config_parser/config_parser_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/pkg/config_parser/config_parser_test.go)

Recommended command:

```bash
go test ./config/... ./pkg/config_parser/... ./component/dns/... ./component/outbound/... ./control/... -run 'FunctionOrString|FunctionListOrString|FallbackType|SelectionPolicy'
```

Acceptance criteria:

- All invalid union inputs return `error`.
- `panic` is no longer used to represent high-level configuration errors.

## Phase 2: Separate DNS Long-Lived and Short-Lived State

Objectives:

- Separate the long-lived state in `DnsController` from generation runtime.
- Continue supporting reuse of DNS cache / forwarder warm state during reload.
- Prevent reused workers from exiting abnormally after the old generation context is canceled.

Existing key tests:

- [control/dns_controller_reload_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_controller_reload_test.go)
  - `TestDnsController_RuntimeWorkersSurviveContextCancel`
- [control/dns_forwarder_cache_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_forwarder_cache_test.go)
- [control/dns_singleflight_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_singleflight_test.go)
- [control/dns_control_cache_cleanup_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control_cache_cleanup_test.go)
- [control/dns_cache_scope_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_cache_scope_test.go)

Recommended command:

```bash
go test ./control/... -run 'DnsController|dns.*reload|dns.*forwarder|dns.*singleflight|dns.*cache'
```

Acceptance criteria:

- After DNS runtime is updated, cancellation of the old context does not kill shared workers.
- DNS cache / forwarder lifecycle semantics remain unchanged.

## Phase 3: Demote ControlPlane to a Facade

Objectives:

- Extract the datapath janitor and DNS runtime handoff from `ControlPlane`.
- Preserve reload / retirement / drain semantics.

Existing key tests:

- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go)
  - `TestReuseDNSControllerFromUpdatesRuntime`
  - `TestReuseDNSListenerFromTransfersOwnership`
  - `TestReuseDNSListenerFromRejectsProtocolMismatch`
- [control/control_plane_janitor_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_janitor_test.go)
- [control/control_plane_shutdown_udp_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_shutdown_udp_test.go)
- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go)

Recommended command:

```bash
go test ./control/... ./cmd/... -run 'ReuseDNS|Drain|Janitor|Shutdown|Retirement'
```

Acceptance criteria:

- After `ControlPlane` is split, old/new generation handoff semantics remain unchanged.
- Janitor stopping and retirement cleanup still complete as expected.

## Phase 4: Move Runner / ReloadManager Down from cmd/run

Objectives:

- Move staged reload, handoff, and retirement queuing logic down from the CLI entry point.
- Preserve external CLI behavior.

Existing key tests:

- [cmd/run_shutdown_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/run_shutdown_test.go)
- [cmd/reload_progress_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_progress_test.go)
- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go)

Recommended command:

```bash
go test ./cmd/... ./control/... -run 'Reload|Progress|Shutdown|Handoff'
```

Acceptance criteria:

- CLI behavior remains unchanged.
- State transitions for reload busy / handoff / retirement remain unchanged.

## Phase 5: Routing IR

Objectives:

- Introduce a unified normalized rule IR.
- Have each matcher / backend lower from the IR rather than interpret parser rules independently.

Existing key tests:

- [component/routing/optimizer_contract_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/routing/optimizer_contract_test.go)
- [component/dns/request_rule_split_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/request_rule_split_test.go)
- [component/daedns/router_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/daedns/router_test.go)
- [control/routing_matcher_builder_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/routing_matcher_builder_test.go)

Recommended command:

```bash
go test ./component/routing/... ./component/dns/... ./component/daedns/... ./control/... -run 'Routing|Rule|Matcher|Optimizer'
```

Acceptance criteria:

- After rule normalization, semantics do not drift across DNS/request/response/control backends.
- The same rule input preserves fallback / outbound behavior across different backends.

## Phase 6: Make the Dialer Health Model Explicit

Objectives:

- Wrap the internal index model in an explicit health domain API.
- Preserve UDP data fallback, reload snapshot, and recovery backoff semantics.

Existing key tests:

- [component/outbound/dialer/recovery_bugs_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/recovery_bugs_test.go)
- [component/outbound/dialer_group_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer_group_test.go)
- [control/dial_family_fallback_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dial_family_fallback_test.go)
- [control/udp_dial_guard_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/udp_dial_guard_test.go)

Recommended command:

```bash
go test ./component/outbound/... ./component/outbound/dialer/... ./control/... -run 'Recovery|Snapshot|DialerGroup|UDP.*fallback|dial.*guard'
```

Acceptance criteria:

- `ReloadHealthSnapshot` / `RestoreHealthSnapshot` semantics remain unchanged.
- UDP data-plane fallback can still fall back to the DNS UDP / TCP health domain.

## Recommended Execution Order

Proceed in the following order. After each phase, retain a stable point at which the work can remain for the long term:

1. Phase 1: Tighten Config Boundaries
2. Phase 2: Separate DNS Long-Lived and Short-Lived State
3. Phase 3: Demote ControlPlane to a Facade
4. Phase 4: Move Runner / ReloadManager Down
5. Phase 5: Routing IR
6. Phase 6: Make the Dialer Health Model Explicit

## Review Checklist

Each refactor PR must answer at least the following questions during review:

- Does this change introduce a new state owner?
- If an object is reused, is the reused thing the “object” or the “state”?
- Do existing targeted tests cover the changed boundary?
- Does a single commit mix behavioral and structural changes?
- Does it leave a new dual source of state or a new implicit lifecycle coupling?

## First Completed Step

Completed in this iteration:

- Changed config union helpers from `panic` to returning `error`
- Added contract tests for invalid union input to fallback / policy / routing builders
- Created this validation document as the execution and regression baseline for subsequent refactors

## Second Completed Step

Completed further in this iteration:

- Removed `DnsController` legacy runtime fields and fallback read paths; standardized on `runtimeState` as the single source of truth
- Added [control/dns_runtime_test_helpers_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_runtime_test_helpers_test.go) as a test-time runtime-construction helper, preventing tests from continuing to depend on removed legacy fields
- Migrated DNS-related tests to `runtimeState` construction and verified no behavioral regression with `go test ./control/...`

## Third Completed Step

Completed further in this iteration:

- Extracted `dnsControllerStore` in [control/dns_control.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control.go), consolidating `dnsCache`, `dnsForwarderCache`, janitor/evictor state, BPF update worker state, and the preference wait registry under the long-lived state owner
- Adjusted tests including [control/dns_preference_wait_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_preference_wait_test.go), [control/dns_lru_e2e_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_lru_e2e_test.go), [control/dns_control_cache_cleanup_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control_cache_cleanup_test.go), [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go), and [control/control_plane_real_domain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_real_domain_test.go) so that they explicitly initialize `dnsControllerStore`, establishing the construction pattern after the long-lived-state ownership migration
- Added `newTestDnsControllerStore` in [control/dns_runtime_test_helpers_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_runtime_test_helpers_test.go), providing a unified test entry point for the subsequent separation of DNS long-lived state and generation runtime
- Verified with the following commands that this step changes only state ownership, not behavior:

```bash
go test ./control/...
go test ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

## Fourth Completed Step

Completed further in this iteration:

- In [control/dns_control.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control.go), changed `DnsController` ownership of `dnsControllerStore` from value semantics to shared pointer semantics and added `sharedStoreFacade()`, allowing subsequent reloads to create a new controller facade while continuing to reuse long-lived DNS state
- In [control/control_plane.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane.go), changed `ReuseDNSControllerFrom` to “refresh the old facade runtime, then create a new facade with the shared store and hand it to the new generation,” instead of continuing to transfer the same `DnsController` object directly between old and new generations
- Established the new handoff contract in [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go):
  - The old and new generations share the active DNS controller facade
  - The new facade and old facade are not the same object
  - Both share the same `dnsControllerStore`
  - The old facade runtime is also first updated to the new generation, preventing old references from continuing to hold the old runtime during the reload handoff window
- Adjusted the default test store in [control/dns_runtime_test_helpers_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_runtime_test_helpers_test.go) to a minimal form, preventing the default test construction from introducing an unstarted evictor queue and preserving the original synchronous callback semantics
- Verified with the following commands that behavior did not regress after facade separation:

```bash
go test ./control/...
go test ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

Supplementary validation for this iteration:

```bash
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

## Fifth Completed Step

Completed further in this iteration:

- In [control/dns_control.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control.go), brought refresh of `DnsController` generation-local behavioral configuration into `UpdateRuntime` / `ReuseForReload`:
  - `qtypePrefer`
  - `optimisticCacheEnabled`
  - `optimisticCacheTtl`
  - `maxCacheSize`
- Changed the preceding behavioral configuration to atomic reads and writes, fixing the data race between reload updates and concurrent janitor / lookup access, and preventing the implicit inconsistency where “the runtime pointer has switched but behavioral configuration still uses values from the old generation”
- Made `UpdateRuntime` and `ReuseForReload` explicitly return `error` for an invalid `IpVersionPrefer`, rather than silently accepting invalid runtime configuration
- Added and updated the following tests for this purpose:
  - [control/dns_controller_reload_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_controller_reload_test.go): added contract tests for synchronized behavioral-configuration refresh after reload and for failure on invalid `IpVersionPrefer`
  - [control/dns_cache_race_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_cache_race_test.go): narrowed the `singleflight` concurrency scenario to a deterministic barrier, establishing the singleflight contract under `-race` and preventing false reports caused by overly loose test timing
  - [control/dns_preference_wait_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_preference_wait_test.go), [control/dns_lru_e2e_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_lru_e2e_test.go), and [control/dns_control_cache_cleanup_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control_cache_cleanup_test.go): updated to use atomic-field access so that test construction matches the runtime implementation

Final validation for this iteration:

```bash
go test ./control/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

Conclusion:

- The current round of refactoring around config boundaries, `DnsController` state layering, reload facade handoff, and runtime behavioral-configuration synchronization has been completed as a closed loop.
- Both ordinary and `-race` regression suites passed, and can serve as a stable baseline before the next batch of `ControlPlane` facade work or deeper routing / dialer refactors.

## Sixth Completed Step

Completed further in this iteration:

- Added [control/dns_runtime.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_runtime.go), formally consolidating DNS orchestration state that was previously scattered on the `ControlPlane` root object into `controlPlaneDNSRuntime`:
  - `dnsController`
  - `dnsRouting`
  - `dnsFixedDomainTtl`
  - `dnsListener`
  - prepared start/reuse hook
  - upstream ready/available channel and once
  - deferred DNS listener start state
- In [control/control_plane.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane.go), changed the following DNS lifecycle methods to delegate to runtime:
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
- Changed DNS-related cleanup in `releaseRetainedState` to unified release by runtime, reducing direct holding and item-by-item reclamation of DNS subsystem state by the `ControlPlane` root object
- Preserved external behavior and changed only the state owner and method ownership, preparing for the subsequent demotion of `ControlPlane` to a facade

Tests adjusted in this iteration:

- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go): updated to explicitly construct `controlPlaneDNSRuntime`, establishing the new owner boundary for DNS listener/controller handoff and the prepared start/reuse hook

Validation for this iteration:

```bash
go test ./control/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

Conclusion:

- `ControlPlane` has begun transitioning from a large object that “directly holds every DNS detail” to a form that “composes an internal DNS runtime and delegates lifecycle operations.”
- This step remains a pure boundary rearrangement and introduces no new DNS runtime semantics; both ordinary and `-race` regression suites passed.

## Seventh Completed Step

Completed further in this iteration:

- Added [config/decode.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/config/decode.go), changing root section dispatch in `Config.New()` from “reflection over the entire `Config` struct” to an explicit decoder registry:
  - `global`
  - `subscription`
  - `node`
  - `group`
  - `routing`
  - `dns`
- In [config/config.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/config/config.go), made root required-section validation and parse order explicit, so that later replacement of reflection parsers one section at a time no longer requires first changing the main control flow of `Config.New()`
- Retained existing section-level `SectionParser` / `ParamParser` behavior; therefore, this step only tightens the boundary at the root entry point and does not change DSL semantics
- Added [config/decode_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/config/decode_test.go), establishing the explicit section-decoder dispatch path and the unknown-section error boundary

Validation for this iteration:

```bash
go test ./config/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

Conclusion:

- `Config.New()` no longer relies on root reflection scanning to determine the section parsing entry point.
- Decoder boundaries for key sections are now explicit, laying the foundation for continued replacement of the internal reflection parsing for `routing` / `dns` / `group`.

## Eighth Completed Step

Completed further in this iteration:

- Added [control/generation_state.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/generation_state.go), consolidating state in `ControlPlane` that clearly belongs to the generation lifecycle into `controlPlaneGenerationState`:
  - `outbounds`
  - `referencedOutbounds`
  - `dialMode`
  - `routingMatcher`
  - `bootstrapResolvers`
- Added [control/datapath_janitor.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/datapath_janitor.go), consolidating datapath janitor owner state into `controlPlaneDatapathJanitor`:
  - stop/done/once/started state
  - cleanup mutex
  - janitor scratch buffers
- In [control/control_plane.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane.go), changed the preceding state to be held by internal objects and made `releaseRetainedState()`, scratch acquisition, and initialization paths consistently delegate to the new owners
- Updated construction in [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_drain_test.go), [control/control_plane_janitor_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_janitor_test.go), [control/control_plane_real_domain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane_real_domain_test.go), [control/dscp_routing_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dscp_routing_test.go), [control/mac_routing_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/mac_routing_test.go), [control/metadata_routing_chain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/metadata_routing_chain_test.go), [control/dial_family_fallback_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dial_family_fallback_test.go), and [control/udp_reuse_simulation_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/udp_reuse_simulation_test.go), making tests explicitly reflect the new owner boundary

Validation for this iteration:

```bash
go test ./config/... ./control/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

Conclusion:

- `ControlPlane` has further advanced from a form in which all generation / datapath state is piled directly onto the root object to one in which the root object composes generation state, DNS runtime, and datapath janitor.
- This step remains an ownership and lifecycle boundary rearrangement and introduces no new datapath cleanup semantics; both ordinary and `-race` regression suites passed.

## Ninth Completed Step

Completed further in this iteration:

- Added [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_manager.go), consolidating reload queuing, staged handoff, retirement, and progress/pprof refresh logic that was previously scattered in `cmd/run.go` into `reloadManager`
- Added [cmd/runner.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/runner.go), changing the entry layer from “one oversized `Run` function” to a `Runner + ReloadManager` composition; [cmd/run.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/run.go) now only assembles `Runner` and delegates execution
- Updated reload-manager contract tests in [cmd/run_shutdown_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/run_shutdown_test.go), establishing:
  - shutdown handoff preferentially consumes pending staged handoff
  - a queued reload request retains only the latest request timestamp

Validation for this iteration:

```bash
go test ./cmd/... ./control/...
go test ./...
go test -race ./cmd/... ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

Conclusion:

- The lifecycle state machine of `cmd/run` no longer resides entirely in the entry function itself.
- Owner boundaries for staged reload / handoff / retirement have become the `Runner` and `ReloadManager` composition, so subsequent downward extraction need not begin directly from CLI control flow.

## Tenth Completed Step

Completed further in this iteration:

- Added [component/routing/ir.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/routing/ir.go) and [component/routing/normalize.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/routing/normalize.go), introducing the shared `routing.NormalizedProgram`
- Added [component/dns/routing_program.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/routing_program.go), consolidating the “optimization + internal selector split” for DNS request routing into `NormalizedRequestRoutingProgram`
- Added a `FromProgram` entry point to the following builders, allowing backends to lower from the shared program rather than independently interpret parser rules:
  - [component/dns/request_routing.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/request_routing.go)
  - [component/dns/response_routing.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/response_routing.go)
  - [control/routing_matcher_builder.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/routing_matcher_builder.go)
- Migrated the following call sites to the program entry point:
  - [component/dns/dns.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/dns.go)
  - [component/daedns/router.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/daedns/router.go)
  - [control/control_plane.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/control_plane.go)
- Added [component/routing/normalize_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/routing/normalize_test.go) and [component/dns/routing_program_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/routing_program_test.go), establishing:
  - program construction clones original rules and does not mutate the input in reverse
  - the request routing program consistently splits DNS / sub / node / subnode rules

Validation for this iteration:

```bash
go test ./component/routing/... ./component/dns/... ./control/... ./component/outbound/... ./cmd/...
go test ./...
```

Conclusion:

- The routing layer now has a shared normalize/program boundary.
- The DNS request, DNS response, and control matcher backends have advanced from “each independently interpreting parser rules” to “lowering from a common normalized program.”

## Eleventh Completed Step

Completed further in this iteration:

- Added [component/outbound/dialer/health_domain.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/health_domain.go), introducing the explicit `HealthDomain` / `HealthKey` API and starting to replace scattered hard-coded indexes in the following paths:
  - [component/outbound/dialer/connectivity_check.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/connectivity_check.go): `NetworkType.Index()` now maps through `HealthKey` normalization
  - [component/outbound/dialer_group.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer_group.go): standard selection network types and alive-set construction now use `StandardHealthKeys()`
- Added [component/outbound/dialer/recovery_state.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/recovery_state.go), elevating the recovery/backoff/timer/punishment state machine to `dialerRecoveryManager`
- Retained `Dialer` as a facade in [component/outbound/dialer/dialer.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/dialer.go), with health snapshot, restore, recovery trigger/cancel/backoff/stability methods consistently delegating to the recovery manager
- Added [component/outbound/dialer/health_domain_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/health_domain_test.go), establishing:
  - TCP DNS semantics still map to the shared TCP health domain
  - canonical health keys still cover the existing six standard collections

Validation for this iteration:

```bash
go test ./component/outbound/... ./component/outbound/dialer/... ./control/...
go test ./...
```

Conclusion:

- The dialer health model has advanced from “external callers directly depend on internal idx conventions” to a form with an explicit health domain API and recovery manager owner.
- Existing tests continue to cover recovery snapshot / restore / backoff behavior; the new API only makes the boundary explicit and does not change existing semantics.

## Review Fix Record

This iteration added fixes based on the review of uncommitted changes:

- Restored the historical exported signatures of `FunctionOrStringToFunction` and `FunctionListOrStringToFunctionList` in [config/config.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/config/config.go) to avoid breaking the external API; added `ParseFunctionOrString` and `ParseFunctionListOrString` for internal error-return call chains.
- Added locking for reload state read and written across goroutines in [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_manager.go), including `reloadingErr`, pending staged handoff, pending retirement channel, and reload timestamp; [cmd/run.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/run.go) now consistently uses `finishReloadSuccess()` to clean up the success path.
- Added DNS reload ownership-model comments to [control/dns_control.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_control.go) and [control/dns_runtime.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/control/dns_runtime.go), clarifying the “independent facade + shared store + handoff bridge” relationship.
- Adjusted [component/dns/routing_program.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/routing_program.go) so that `NormalizedRequestRoutingProgram` construction no longer first creates and then discards an intermediate program, but instead splits DNS / sub / node / subnode rules after a single optimization.
- Changed the store check on the DNS controller business path from silently creating an empty store to an explicit assertion, preventing initialization errors from being hidden when tests or manual construction create a controller; the reload compatibility bridge still explicitly initializes a missing store.
- Added `Lower` boundary tests to [component/routing/normalize_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/routing/normalize_test.go), covering empty rules, a nil parser, and fallback error propagation.
- Removed dead code in [component/outbound/dialer/dialer.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/dialer.go): `triggerRecoveryDetectionInternal`, which was completely equivalent to `triggerRecoveryDetection`.

Validation for this iteration:

```bash
go test ./config/... ./component/dns/... ./component/routing/... ./component/outbound/... ./control/... ./cmd/...
go test ./...
go test -race ./...
make ebpf
```

Conclusion:

- The ordinary full test suite and the full race test suite both passed.
- This round of fixes eliminated the review findings concerning exported API breakage, unsynchronized shared fields in the reload manager, duplicate cleanup entry points, wasteful intermediate routing-program wrapping, insufficient `Lower` boundary testing, and dialer dead code.

## Subsequent Review Fix Record

This iteration continued with fixes based on additional review findings:

- Added unit tests for `startControlPlaneRetirement` in [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_manager.go), covering retirement-channel publication, completion of the retirement goroutine, and invocation of old-generation cancel.
- Changed DNS configuration comparison from `reflect.DeepEqual` to stable fingerprint comparison, avoiding reliance on reflective deep comparison in the staged DNS reuse decision in [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_manager.go).
- Adjusted [component/dns/routing_program.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/dns/routing_program.go) so that `DeepCloneRules` runs only when there is no optimizer; when an optimizer exists, it directly uses the internal clone result of `ApplyRulesOptimizers`, avoiding a duplicate deep copy.
- Added `HealthKeyFromCollectionIndex` in [component/outbound/dialer/health_domain.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/health_domain.go), so that collection-index reverse lookup in [component/outbound/dialer/dialer.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/component/outbound/dialer/dialer.go) no longer traverses the six standard keys.

Validation for this iteration:

```bash
go test ./cmd/... ./component/dns/... ./component/outbound/...
go test ./...
go test -race ./...
```

Conclusion:

- The new retirement unit tests passed.
- The ordinary full test suite and the full race test suite both passed.

## DNS Fingerprint Coverage Fix Record

This iteration continued with fixes based on additional review findings:

- Added a maintenance comment to `dnsConfigFingerprint` in [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/reload_manager.go), stating that this function must remain synchronized with top-level fields of `config.Dns`.
- Added `TestDNSConfigFingerprintCoversAllDnsFields` in [cmd/run_shutdown_test.go](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/cmd/run_shutdown_test.go) to verify coverage of top-level `config.Dns` fields by reflection. If a DNS configuration field is added later without updating the fingerprint, the test will fail.

Validation for this iteration:

```bash
go test ./cmd/...
go test ./...
go test -race ./...
```

Conclusion:

- The ordinary full test suite and the full race test suite both passed.

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/zh/development/refactor-validation-plan.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
