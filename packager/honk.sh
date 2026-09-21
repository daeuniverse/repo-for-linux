#!/usr/bin/env bash
[ -d archive ] || mkdir -p archive
[ -d archive/deb ] || mkdir -p archive/deb
[ -d archive/rpm ] || mkdir -p archive/rpm
REAL_VERSION=$(cat honk_version.txt)
# honk tags pre-releases as 0.0.1.beta.80; nfpm needs 0.0.1-beta.80 to write a version that sorts before 0.0.1.
PACKAGE_VERSION=$(echo "$REAL_VERSION" | sed -E 's/^([0-9]+\.[0-9]+\.[0-9]+)\.(.+)$/\1-\2/')
for debian_arch in amd64 arm64; do
    cat nfpm/honk.yaml | sed "s/^version: \"REAL_VERSION\"/version: \"$PACKAGE_VERSION\"/" | sed "s/REAL_VERSION/$REAL_VERSION/g" | sed "s/REAL_ARCH/${debian_arch}/g" | tee /tmp/honk_${REAL_VERSION}_${debian_arch}_.yaml
    nfpm package -p deb --config /tmp/honk_${REAL_VERSION}_${debian_arch}_.yaml --target ./archive/deb/honk_${REAL_VERSION}_${debian_arch}.deb
    nfpm package -p rpm --config /tmp/honk_${REAL_VERSION}_${debian_arch}_.yaml --target ./archive/rpm/honk_${REAL_VERSION}_${debian_arch}.rpm
done
