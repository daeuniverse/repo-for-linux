#!/usr/bin/env bash

set -e

eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

xray_temp_file="$(mktemp /tmp/xray.XXXXXX)"
if ! curl -s "https://api.github.com/repos/XTLS/Xray-core/releases/latest" -o "$xray_temp_file"; then
    echo "Error: Cannot get latest version of xray!"
    exit 1
fi
xray_remote_version=$(grep tag_name "$xray_temp_file" | awk -F "tag_name" '{printf $2}' | awk -F "," '{printf $1}' | awk -F '"' '{printf $3}')
xray_url_amd64="https://github.com/XTLS/Xray-core/releases/download/$xray_remote_version/xray-linux-64.zip"
xray_url_arm64="https://github.com/XTLS/Xray-core/releases/download/$xray_remote_version/xray-linux-arm64-v8a.zip"
xray_url_i386="https://github.com/XTLS/Xray-core/releases/download/$xray_remote_version/xray-linux-32.zip"
xray_url_riscv64="https://github.com/XTLS/Xray-core/releases/download/$xray_remote_version/xray-linux-riscv64.zip"
rm -f "$xray_temp_file"

xray_temp_dir="$(mktemp -d /tmp/xray.XXXXXX)"
curl -L "$xray_url_amd64" -o "$xray_temp_dir/xray_amd64_${xray_remote_version}.zip"
curl -L "$xray_url_arm64" -o "$xray_temp_dir/xray_arm64_${xray_remote_version}.zip"
curl -L "$xray_url_i386" -o "$xray_temp_dir/xray_i386_${xray_remote_version}.zip"
curl -L "$xray_url_riscv64" -o "$xray_temp_dir/xray_riscv64_${xray_remote_version}.zip"
unzip "$xray_temp_dir/xray_amd64_${xray_remote_version}.zip" xray -d ./ && mv ./xray ./xray_amd64_${xray_remote_version} && chmod +x ./xray_amd64_${xray_remote_version}
unzip "$xray_temp_dir/xray_arm64_${xray_remote_version}.zip" xray -d ./ && mv ./xray ./xray_arm64_${xray_remote_version} && chmod +x ./xray_arm64_${xray_remote_version}
unzip "$xray_temp_dir/xray_i386_${xray_remote_version}.zip" xray -d ./ && mv ./xray ./xray_i386_${xray_remote_version} && chmod +x ./xray_i386_${xray_remote_version}
unzip "$xray_temp_dir/xray_riscv64_${xray_remote_version}.zip" xray -d ./ && mv ./xray ./xray_riscv64_${xray_remote_version} && chmod +x ./xray_riscv64_${xray_remote_version}
rm -rf "$xray_temp_dir"

echo ${xray_remote_version#v} > xray_version.txt