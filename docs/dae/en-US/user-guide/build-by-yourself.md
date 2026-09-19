---
title: "Build from source"
---

<div v-pre lang="en-US">

# Build Guide

## Build

### Build Dependencies

```shell
clang >= 10
llvm >= 10 (optional)
golang >= 1.26
make
```

### Compilation

```shell
git clone https://github.com/daeuniverse/dae.git
cd dae
git submodule update --init
```

::: code-group

```shell [Minimal dependencies]
## Minimal dependency build
make GOFLAGS="-buildvcs=false" \
  CLANG=clang
```

```shell [Normal build]
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

### Trace Support per Architecture

`make` builds the optional `dae trace` eBPF program when the toolchain supports
it. The result is recorded in `.build_tags`: `trace` when built, or an empty
file otherwise.

`arm`, `mips`, `mips64`, `mips64le`, `mipsle`, and `s390x` builds do not include
`dae trace`; see `TRACE_UNSUPPORTED_GOARCH` in the Makefile. For these
architectures, the build prints a `WARNING`, omits the `trace` build tag, and
continues. For every other `GOARCH`, trace generation failure is an error, so
a binary cannot silently lose `dae trace`.

The BPF Test workflow verifies this list with
`./scripts/check-trace-arch-matrix.sh`. Reproduce the failures per architecture with:

```shell
git submodule update --init
GOARCH=mips BPF_CLANG=clang go generate ./trace/trace.go    # fails: no compiler specified
GOARCH=mips64 BPF_CLANG=clang go generate ./trace/trace.go  # fails: unsupported target
```

Do not remove an architecture from the list just because
`github.com/cilium/ebpf`'s `gen.FindTarget()` accepts it. Target lookup and
compilation are separate steps: `mips` passes lookup but fails compilation.
Its `bpf_tracing.h` selects the mips `pt_regs` layout, while the vendored
`vmlinux.h` from the `dae_bpf_headers` submodule falls back to x86.

`dae trace` requires kernel version 5.15 or later; the rest of dae requires 5.17 or later.

## Run

### Runtime Dependencies

For traffic splitting, dae relies on [geoip.dat](https://github.com/v2fly/geoip/releases/latest) and [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest).

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

### Run

Download the example configuration:

```shell
curl -L -o example.dae https://github.com/daeuniverse/dae/raw/main/example.dae
```

See [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae).

After editing the configuration, run dae:

::: code-group

```shell [sudo]
sudo ./dae run -c example.dae
```

```shell [root]
./dae run -c example.dae
```

:::

Alternatively, [run dae as a systemd service](/dae/user-guide/run-as-daemon).

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/user-guide/build-by-yourself.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
