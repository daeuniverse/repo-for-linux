#!/usr/bin/env bash
REAL_VERSION=$(cat juicity-rs_version.txt)
for debian_arch in amd64 arm64 i386 riscv64; do
    cat nfpm/juicity-rs.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${debian_arch}/g" | tee /tmp/juicity-rs_${REAL_VERSION}_${debian_arch}_debian.yaml
    nfpm package -p deb --config /tmp/juicity-rs_${REAL_VERSION}_${debian_arch}_debian.yaml --target ./archive/juicity-rs_${REAL_VERSION}_${debian_arch}.deb
done
for rpm_arch in x86_64 aarch64 i386 riscv64; do
    cat nfpm/juicity-rs.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${rpm_arch}/g" | tee /tmp/juicity-rs_${REAL_VERSION}_${rpm_arch}_rpm.yaml
    nfpm package -p rpm --config /tmp/juicity-rs_${REAL_VERSION}_${rpm_arch}_rpm.yaml --target ./archive/juicity-rs_${REAL_VERSION}_${rpm_arch}.rpm
done