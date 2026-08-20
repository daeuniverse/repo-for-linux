#!/usr/bin/env bash
REAL_VERSION=$(cat daed_version.txt)
for debian_arch in amd64 arm64 i386 riscv64; do
    cat nfpm/daed.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${debian_arch}/g" | tee /tmp/daed_${REAL_VERSION}_${debian_arch}_debian.yaml
    nfpm package -p deb --config /tmp/daed_${REAL_VERSION}_${debian_arch}_debian.yaml --target ./archive/daed_${REAL_VERSION}_${debian_arch}.deb
    nfpm package -p rpm --config /tmp/daed_${REAL_VERSION}_${debian_arch}_rpm.yaml --target ./archive/daed_${REAL_VERSION}_${debian_arch}.rpm
done