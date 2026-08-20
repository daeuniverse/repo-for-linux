#!/usr/bin/env bash
REAL_VERSION=$(cat v2ray-rules-dat_version.txt)
[ -d archive ] || mkdir -p archive
[ -d archive/deb ] || mkdir -p archive/deb
[ -d archive/rpm ] || mkdir -p archive/rpm
cat nfpm/v2ray-rules-dat.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | tee /tmp/v2ray-rules-dat.yaml
nfpm package --packager deb --config /tmp/v2ray-rules-dat.yaml --target ./archive/deb/v2ray-rules-dat_${REAL_VERSION}_all.deb
nfpm package --packager rpm --config /tmp/v2ray-rules-dat.yaml --target ./archive/rpm/v2ray-rules-dat_${REAL_VERSION}_all.rpm