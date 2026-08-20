#!/usr/bin/env bash
REAL_VERSION=$(cat v2ray-rules-dat_version.txt)
nfpm package --packager deb --config /tmp/v2ray-rules-dat.yaml --target ./archive/v2ray-rules-dat_${REAL_VERSION}_all.deb
nfpm package --packager rpm --config /tmp/v2ray-rules-dat.yaml --target ./archive/v2ray-rules-dat_${REAL_VERSION}_all.rpm