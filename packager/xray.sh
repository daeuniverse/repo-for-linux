#!/usr/bin/env bash
REAL_VERSION=$(cat xray_version.txt)
for debian_arch in amd64 arm64 i386 riscv64; do
    cat nfpm/xray.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${debian_arch}/g" | tee /tmp/xray_${REAL_VERSION}_${debian_arch}_debian.yaml
    nfpm package -p deb --config /tmp/xray_${REAL_VERSION}_${debian_arch}_debian.yaml --target ./archive/xray_${REAL_VERSION}_${debian_arch}.deb
done
for rpm_arch in x86_64 aarch64 i386 riscv64; do
    cat nfpm/xray.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${rpm_arch}/g" | tee /tmp/xray_${REAL_VERSION}_${rpm_arch}_rpm.yaml
    nfpm package -p rpm --config /tmp/xray_${REAL_VERSION}_${rpm_arch}_rpm.yaml --target ./archive/xray_${REAL_VERSION}_${rpm_arch}.rpm
done