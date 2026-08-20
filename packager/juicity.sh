#!/usr/bin/env bash
REAL_VERSION=$(cat juicity_version.txt)
for debian_arch in amd64 arm64 i386 riscv64; do
    cat nfpm/juicity.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${debian_arch}/g" | tee /tmp/juicity_${REAL_VERSION}_${debian_arch}_.yaml
    nfpm package -p deb --config /tmp/juicity_${REAL_VERSION}_${debian_arch}_.yaml --target ./archive/juicity_${REAL_VERSION}_${debian_arch}.deb
    nfpm package -p rpm --config /tmp/juicity_${REAL_VERSION}_${debian_arch}_.yaml --target ./archive/juicity_${REAL_VERSION}_${debian_arch}.rpm
done