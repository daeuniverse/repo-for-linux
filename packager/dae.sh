#!/usr/bin/env bash
[ -d archive ] || mkdir -p archive
REAL_VERSION=$(cat dae_version.txt)
for debian_arch in amd64 arm64 i386 riscv64; do
    cat nfpm/dae.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${debian_arch}/g" | tee /tmp/dae_${REAL_VERSION}_${debian_arch}_debian.yaml
    nfpm package -p deb --config /tmp/dae_${REAL_VERSION}_${debian_arch}_debian.yaml --target ./archive/dae_${REAL_VERSION}_${debian_arch}.deb
    nfpm package -p rpm --config /tmp/dae_${REAL_VERSION}_${debian_arch}_rpm.yaml --target ./archive/dae_${REAL_VERSION}_${debian_arch}.rpm
done