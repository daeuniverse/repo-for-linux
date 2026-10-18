#!/usr/bin/env bash

set -e

eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

juicity_temp_file="$(mktemp juicity_temp_file.XXXXXX)"
if ! curl -s "https://api.github.com/repos/juicity/juicity/releases/latest" -o "$juicity_temp_file"; then
    echo "Error: Cannot get latest version of juicity!"
    exit 1
fi
juicity_remote_version=$(grep tag_name "$juicity_temp_file" | awk -F "tag_name" '{printf $2}' | awk -F '"' '{printf $3}')
juicity_url_amd64="https://github.com/juicity/juicity/releases/download/${juicity_remote_version}/juicity-linux-x86_64.zip"
juicity_url_arm64="https://github.com/juicity/juicity/releases/download/${juicity_remote_version}/juicity-linux-arm64.zip"
juicity_url_i386="https://github.com/juicity/juicity/releases/download/${juicity_remote_version}/juicity-linux-x86_32.zip"
juicity_url_riscv64="https://github.com/juicity/juicity/releases/download/${juicity_remote_version}/juicity-linux-riscv64.zip"
rm -f "$juicity_temp_file"

juicity_temp_dir="$(mktemp -d /tmp/juicity.XXXXXX)"
curl -L "$juicity_url_amd64" -o "$juicity_temp_dir/juicity_amd64_${juicity_remote_version}.zip"
curl -L "$juicity_url_arm64" -o "$juicity_temp_dir/juicity_arm64_${juicity_remote_version}.zip"
curl -L "$juicity_url_i386" -o "$juicity_temp_dir/juicity_i386_${juicity_remote_version}.zip"
curl -L "$juicity_url_riscv64" -o "$juicity_temp_dir/juicity_riscv64_${juicity_remote_version}.zip"
unzip "$juicity_temp_dir/juicity_amd64_${juicity_remote_version}.zip" juicity-server -d ./ && mv ./juicity-server ./juicity-server_amd64_${juicity_remote_version} && chmod +x ./juicity-server_amd64_${juicity_remote_version}
unzip "$juicity_temp_dir/juicity_amd64_${juicity_remote_version}.zip" juicity-client -d ./ && mv ./juicity-client ./juicity-client_amd64_${juicity_remote_version} && chmod +x ./juicity-client_amd64_${juicity_remote_version}
unzip "$juicity_temp_dir/juicity_arm64_${juicity_remote_version}.zip" juicity-server -d ./ && mv ./juicity-server ./juicity-server_arm64_${juicity_remote_version} && chmod +x ./juicity-server_arm64_${juicity_remote_version}
unzip "$juicity_temp_dir/juicity_arm64_${juicity_remote_version}.zip" juicity-client -d ./ && mv ./juicity-client ./juicity-client_arm64_${juicity_remote_version} && chmod +x ./juicity-client_arm64_${juicity_remote_version}
unzip "$juicity_temp_dir/juicity_i386_${juicity_remote_version}.zip" juicity-server -d ./ && mv ./juicity-server ./juicity-server_i386_${juicity_remote_version} && chmod +x ./juicity-server_i386_${juicity_remote_version}
unzip "$juicity_temp_dir/juicity_i386_${juicity_remote_version}.zip" juicity-client -d ./ && mv ./juicity-client ./juicity-client_i386_${juicity_remote_version} && chmod +x ./juicity-client_i386_${juicity_remote_version}
unzip "$juicity_temp_dir/juicity_riscv64_${juicity_remote_version}.zip" juicity-server -d ./ && mv ./juicity-server ./juicity-server_riscv64_${juicity_remote_version} && chmod +x ./juicity-server_riscv64_${juicity_remote_version}
unzip "$juicity_temp_dir/juicity_riscv64_${juicity_remote_version}.zip" juicity-client -d ./ && mv ./juicity-client ./juicity-client_riscv64_${juicity_remote_version} && chmod +x ./juicity-client_riscv64_${juicity_remote_version}
rm -rf "$juicity_temp_dir"

echo ${juicity_remote_version#v} > juicity_version.txt
