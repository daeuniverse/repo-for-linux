#!/usr/bin/env bash

set -e

dae_temp_file="$(mktemp /tmp/dae.XXXXXX)"
if ! curl -s "https://api.github.com/repos/daeuniverse/dae/releases/latest" -o "$dae_temp_file"; then
    echo "Error: Cannot get latest version of dae!"
    exit 1
fi
dae_remote_version=$(grep tag_name "$dae_temp_file" | awk -F "tag_name" '{printf $2}' | awk -F "," '{printf $1}' | awk -F '"' '{printf $3}')
dae_url_amd64="https://github.com/daeuniverse/dae/releases/download/${dae_remote_version}/dae-linux-x86_64.zip"
dae_url_arm64="https://github.com/daeuniverse/dae/releases/download/${dae_remote_version}/dae-linux-arm64.zip"
dae_url_i386="https://github.com/daeuniverse/dae/releases/download/${dae_remote_version}/dae-linux-x86_32.zip"
dae_url_riscv64="https://github.com/daeuniverse/dae/releases/download/${dae_remote_version}/dae-linux-riscv64_rva23u64.zip"
rm -f "$dae_temp_file"

dae_temp_dir="$(mktemp -d /tmp/dae.XXXXXX)"
curl -L "$dae_url_amd64" -o "$dae_temp_dir/dae_amd64_${dae_remote_version}.zip"
curl -L "$dae_url_arm64" -o "$dae_temp_dir/dae_arm64_${dae_remote_version}.zip"
curl -L "$dae_url_i386" -o "$dae_temp_dir/dae_i386_${dae_remote_version}.zip"
curl -L "$dae_url_riscv64" -o "$dae_temp_dir/dae_riscv64_${dae_remote_version}.zip"
unzip "$dae_temp_dir/dae_amd64_${dae_remote_version}.zip" dae-linux-x86_64 -d ./ && mv ./dae-linux-x86_64 ./dae_amd64_${dae_remote_version} && chmod +x ./dae_amd64_${dae_remote_version}
unzip "$dae_temp_dir/dae_arm64_${dae_remote_version}.zip" dae-linux-arm64 -d ./ && mv ./dae-linux-arm64 ./dae_arm64_${dae_remote_version} && chmod +x ./dae_arm64_${dae_remote_version}
unzip "$dae_temp_dir/dae_i386_${dae_remote_version}.zip" dae-linux-x86_32 -d ./ && mv ./dae-linux-x86_32 ./dae_i386_${dae_remote_version} && chmod +x ./dae_i386_${dae_remote_version}
unzip "$dae_temp_dir/dae_riscv64_${dae_remote_version}.zip" dae-linux-riscv64_rva23u64 -d ./ && mv ./dae-linux-riscv64_rva23u64 ./dae_riscv64_${dae_remote_version} && chmod +x ./dae_riscv64_${dae_remote_version}
rm -rf "$dae_temp_dir"
echo ${dae_remote_version#v} > dae_version.txt