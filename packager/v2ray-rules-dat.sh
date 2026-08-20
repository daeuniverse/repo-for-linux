#!/usr/bin/env bash
REAL_VERSION=$(cat v2ray-rules-dat_version.txt)
cat nfpm/v2ray-rules-dat.yaml | sed "s/REAL_VERSION/$REAL_VERSION/g" | tee /tmp/v2ray-rules-dat.yaml
nfpm package --packager deb --config /tmp/v2ray-rules-dat.yaml --target ./archive/v2ray-rules-dat_${REAL_VERSION}_all.deb
nfpm package --packager rpm --config /tmp/v2ray-rules-dat.yaml --target ./archive/v2ray-rules-dat_${REAL_VERSION}_all.rpm