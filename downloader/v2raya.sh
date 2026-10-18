#!/usr/bin/env bash

set -e

eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

v2raya_temp_file="$(mktemp v2raya_temp_file.XXXXXX)"
if ! curl -s "https://api.github.com/repos/v2rayA/v2rayA/releases/latest" -o "$v2raya_temp_file"; then
    echo "Error: Cannot get latest version of v2rayA!"
    exit 1
fi
v2raya_remote_version=$(grep tag_name "$v2raya_temp_file" | awk -F "tag_name" '{printf $2}' | awk -F "," '{printf $1}' | awk -F '"' '{printf $3}')
v2raya_remote_version_short=$(echo "$v2raya_remote_version" | cut -d "v" -f2)
v2raya_url_amd64="https://github.com/v2rayA/v2rayA/releases/download/${v2raya_remote_version}/v2raya_linux_x64_${v2raya_remote_version_short}"
v2raya_core_url_amd64="https://github.com/v2rayA/v2rayA/releases/download/${v2raya_remote_version}/v2raya_core_linux_x64_${v2raya_remote_version_short}"
v2raya_url_arm64="https://github.com/v2rayA/v2rayA/releases/download/${v2raya_remote_version}/v2raya_linux_arm64_${v2raya_remote_version_short}"
v2raya_core_url_arm64="https://github.com/v2rayA/v2rayA/releases/download/${v2raya_remote_version}/v2raya_core_linux_arm64_${v2raya_remote_version_short}"
v2raya_url_i386="https://github.com/v2rayA/v2rayA/releases/download/${v2raya_remote_version}/v2raya_linux_x86_${v2raya_remote_version_short}"
v2raya_core_url_i386="https://github.com/v2rayA/v2rayA/releases/download/${v2raya_remote_version}/v2raya_core_linux_x86_${v2raya_remote_version_short}"
v2raya_url_riscv64="https://github.com/v2rayA/v2rayA/releases/download/${v2raya_remote_version}/v2raya_linux_riscv64_${v2raya_remote_version_short}"
v2raya_core_url_riscv64="https://github.com/v2rayA/v2rayA/releases/download/${v2raya_remote_version}/v2raya_core_linux_riscv64_${v2raya_remote_version_short}"
rm -f "$v2raya_temp_file"

curl -L "$v2raya_url_amd64" -o "./v2raya_amd64_${v2raya_remote_version}"
curl -L "$v2raya_core_url_amd64" -o "./v2raya_core_amd64_${v2raya_remote_version}"
curl -L "$v2raya_url_arm64" -o "./v2raya_arm64_${v2raya_remote_version}"
curl -L "$v2raya_core_url_arm64" -o "./v2raya_core_arm64_${v2raya_remote_version}"
curl -L "$v2raya_url_i386" -o "./v2raya_i386_${v2raya_remote_version}"
curl -L "$v2raya_core_url_i386" -o "./v2raya_core_i386_${v2raya_remote_version}"
curl -L "$v2raya_url_riscv64" -o "./v2raya_riscv64_${v2raya_remote_version}"
curl -L "$v2raya_core_url_riscv64" -o "./v2raya_core_riscv64_${v2raya_remote_version}"
chmod +x ./v2raya_*

for v2raya_arch in amd64 arm64 i386 riscv64; do
    upx -9 --no-progress "./v2raya_${v2raya_arch}_${v2raya_remote_version}" "./v2raya_core_${v2raya_arch}_${v2raya_remote_version}"
done

echo ${v2raya_remote_version#v} > v2raya_version.txt
