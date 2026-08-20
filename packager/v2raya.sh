#!/usr/bin/env bash
REAL_VERSION=$(cat v2raya_version.txt)
for debian_arch in amd64 arm64 i386 riscv64; do
    cat nfpm/v2raya.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${debian_arch}/g" | tee /tmp/v2raya_${REAL_VERSION}_${debian_arch}_debian.yaml
    nfpm package -p deb --config /tmp/v2raya_${REAL_VERSION}_${debian_arch}_debian.yaml --target ./archive/v2raya_${REAL_VERSION}_${debian_arch}.deb
done
for rpm_arch in x86_64 aarch64 i386 riscv64; do
    cat nfpm/v2raya.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${rpm_arch}/g" | tee /tmp/v2raya_${REAL_VERSION}_${rpm_arch}_rpm.yaml
    nfpm package -p rpm --config /tmp/v2raya_${REAL_VERSION}_${rpm_arch}_rpm.yaml --target ./archive/v2raya_${REAL_VERSION}_${rpm_arch}.rpm
done