#!/usr/bin/env bash
[ -d archive ] || mkdir -p archive
[ -d archive/deb ] || mkdir -p archive/deb
[ -d archive/rpm ] || mkdir -p archive/rpm
REAL_VERSION=$(cat honk_version.txt)
for debian_arch in amd64 arm64; do
    cat nfpm/honk.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${debian_arch}/g" | tee /tmp/honk_${REAL_VERSION}_${debian_arch}_.yaml
    nfpm package -p deb --config /tmp/honk_${REAL_VERSION}_${debian_arch}_.yaml --target ./archive/deb/honk_${REAL_VERSION}_${debian_arch}.deb
    nfpm package -p rpm --config /tmp/honk_${REAL_VERSION}_${debian_arch}_.yaml --target ./archive/rpm/honk_${REAL_VERSION}_${debian_arch}.rpm
done
