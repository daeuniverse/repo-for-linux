#!/usr/bin/env bash

set -e

eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

v2ray_temp_file="$(mktemp /tmp/v2ray.XXXXXX)"
if ! curl -s "https://api.github.com/repos/v2fly/v2ray-core/releases/latest" -o "$v2ray_temp_file"; then
    echo "Error: Cannot get latest version of v2ray!"
    exit 1
fi
v2ray_remote_version=$(grep tag_name "$v2ray_temp_file" | awk -F "tag_name" '{printf $2}' | awk -F "," '{printf $1}' | awk -F '"' '{printf $3}')
v2ray_url_amd64="https://github.com/v2fly/v2ray-core/releases/download/$v2ray_remote_version/v2ray-linux-64.zip"
v2ray_url_arm64="https://github.com/v2fly/v2ray-core/releases/download/$v2ray_remote_version/v2ray-linux-arm64-v8a.zip"
v2ray_url_i386="https://github.com/v2fly/v2ray-core/releases/download/$v2ray_remote_version/v2ray-linux-32.zip"
v2ray_url_riscv64="https://github.com/v2fly/v2ray-core/releases/download/$v2ray_remote_version/v2ray-linux-riscv64.zip"
rm -f "$v2ray_temp_file"

v2ray_temp_dir="$(mktemp -d /tmp/v2ray.XXXXXX)"
curl -L "$v2ray_url_amd64" -o "$v2ray_temp_dir/v2ray_amd64_${v2ray_remote_version}.zip"
curl -L "$v2ray_url_arm64" -o "$v2ray_temp_dir/v2ray_arm64_${v2ray_remote_version}.zip"
curl -L "$v2ray_url_i386" -o "$v2ray_temp_dir/v2ray_i386_${v2ray_remote_version}.zip"
curl -L "$v2ray_url_riscv64" -o "$v2ray_temp_dir/v2ray_riscv64_${v2ray_remote_version}.zip"
unzip "$v2ray_temp_dir/v2ray_amd64_${v2ray_remote_version}.zip" v2ray -d ./ && mv ./v2ray ./v2ray_amd64_${v2ray_remote_version} && chmod +x ./v2ray_amd64_${v2ray_remote_version}
unzip "$v2ray_temp_dir/v2ray_arm64_${v2ray_remote_version}.zip" v2ray -d ./ && mv ./v2ray ./v2ray_arm64_${v2ray_remote_version} && chmod +x ./v2ray_arm64_${v2ray_remote_version}
unzip "$v2ray_temp_dir/v2ray_i386_${v2ray_remote_version}.zip" v2ray -d ./ && mv ./v2ray ./v2ray_i386_${v2ray_remote_version} && chmod +x ./v2ray_i386_${v2ray_remote_version}
unzip "$v2ray_temp_dir/v2ray_riscv64_${v2ray_remote_version}.zip" v2ray -d ./ && mv ./v2ray ./v2ray_riscv64_${v2ray_remote_version} && chmod +x ./v2ray_riscv64_${v2ray_remote_version}
rm -rf "$v2ray_temp_dir"

echo ${v2ray_remote_version#v} > v2ray_version.txt