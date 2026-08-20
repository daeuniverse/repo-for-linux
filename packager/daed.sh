#!/usr/bin/env bash
REAL_VERSION=$(cat daed_version.txt)
[ -d archive ] || mkdir -p archive
[ -d archive/deb ] || mkdir -p archive/deb
[ -d archive/rpm ] || mkdir -p archive/rpm
for debian_arch in amd64 arm64 i386 riscv64; do
    cat nfpm/daed.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${debian_arch}/g" | tee /tmp/daed_${REAL_VERSION}_${debian_arch}_.yaml
    nfpm package -p deb --config /tmp/daed_${REAL_VERSION}_${debian_arch}_.yaml --target ./archive/deb/daed_${REAL_VERSION}_${debian_arch}.deb
    nfpm package -p rpm --config /tmp/daed_${REAL_VERSION}_${debian_arch}_.yaml --target ./archive/rpm/daed_${REAL_VERSION}_${debian_arch}.rpm
done