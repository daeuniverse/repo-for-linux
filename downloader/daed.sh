#!/usr/bin/env bash

set -e

eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

daed_temp_file="$(mktemp /tmp/daed.XXXXXX)"
if ! curl -s "https://api.github.com/repos/daeuniverse/daed/releases" -o "$daed_temp_file"; then
    echo "Error: Cannot get latest version of dae!"
    exit 1
fi
daed_remote_version=$(jq .[].tag_name < "$daed_temp_file" | grep -vE "dae-" | sed s/\"//g | head -n 1)
daed_url_amd64="https://github.com/daeuniverse/daed/releases/download/${daed_remote_version}/daed-linux-x86_64.zip"
daed_url_arm64="https://github.com/daeuniverse/daed/releases/download/${daed_remote_version}/daed-linux-arm64.zip"
daed_url_i386="https://github.com/daeuniverse/daed/releases/download/${daed_remote_version}/daed-linux-x86_32.zip"
daed_url_riscv64="https://github.com/daeuniverse/daed/releases/download/${daed_remote_version}/daed-linux-riscv64.zip"
rm -f "$daed_temp_file"

daed_temp_dir="$(mktemp -d /tmp/dae.XXXXXX)"
curl -L "$daed_url_amd64" -o "$daed_temp_dir/daed_amd64_${daed_remote_version}.zip"
curl -L "$daed_url_arm64" -o "$daed_temp_dir/daed_arm64_${daed_remote_version}.zip"
curl -L "$daed_url_i386" -o "$daed_temp_dir/daed_i386_${daed_remote_version}.zip"
curl -L "$daed_url_riscv64" -o "$daed_temp_dir/daed_riscv64_${daed_remote_version}.zip"
unzip "$daed_temp_dir/daed_amd64_${daed_remote_version}.zip" "daed-linux-x86_64/daed-linux-x86_64" -d ./ && mv ./daed-linux-x86_64/daed-linux-x86_64 ./daed_amd64_${daed_remote_version} && chmod +x ./daed_amd64_${daed_remote_version}
unzip "$daed_temp_dir/daed_arm64_${daed_remote_version}.zip" "daed-linux-arm64/daed-linux-arm64" -d ./ && mv ./daed-linux-arm64/daed-linux-arm64 ./daed_arm64_${daed_remote_version} && chmod +x ./daed_arm64_${daed_remote_version}
unzip "$daed_temp_dir/daed_i386_${daed_remote_version}.zip" "daed-linux-x86_32/daed-linux-x86_32" -d ./ && mv ./daed-linux-x86_32/daed-linux-x86_32 ./daed_i386_${daed_remote_version} && chmod +x ./daed_i386_${daed_remote_version}
unzip "$daed_temp_dir/daed_riscv64_${daed_remote_version}.zip" "daed-linux-riscv64/daed-linux-riscv64" -d ./ && mv ./daed-linux-riscv64/daed-linux-riscv64 ./daed_riscv64_${daed_remote_version} && chmod +x ./daed_riscv64_${daed_remote_version}
rm -rf "$daed_temp_dir"

for daed_arch in amd64 arm64 i386 riscv64; do
    upx --lzma --best "./daed_${daed_arch}_${daed_remote_version}"
done

echo ${daed_remote_version#v} > daed_version.txt