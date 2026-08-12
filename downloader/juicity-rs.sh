#!/usr/bin/env bash

set -e

juicity_rs_temp_file="$(mktemp juicity_rs_temp_file.XXXXXX)"
if ! curl -s "https://api.github.com/repos/juicity/juicity-rs/releases/latest" -o "$juicity_rs_temp_file"; then
    echo "Error: Cannot get latest version of juicity-rs!"
    exit 1
fi
juicity_rs_remote_version=$(grep tag_name "$juicity_rs_temp_file" | awk -F "tag_name" '{printf $2}' | awk -F '"' '{printf $3}')
juicity_rs_url_amd64="https://github.com/juicity/juicity-rs/releases/download/${juicity_rs_remote_version}/juicity-x86_64-unknown-linux-gnu.zip"
juicity_rs_url_arm64="https://github.com/juicity/juicity-rs/releases/download/${juicity_rs_remote_version}/juicity-aarch64-unknown-linux-gnu.zip"
juicity_rs_url_i386="https://github.com/juicity/juicity-rs/releases/download/${juicity_rs_remote_version}/juicity-i686-unknown-linux-gnu.zip"
juicity_rs_url_riscv64="https://github.com/juicity/juicity-rs/releases/download/${juicity_rs_remote_version}/juicity-riscv64gc-unknown-linux-gnu.zip"
rm -f "$juicity_rs_temp_file"

juicity_rs_temp_dir="$(mktemp -d /tmp/juicity-rs.XXXXXX)"
curl -L "$juicity_rs_url_amd64" -o "$juicity_rs_temp_dir/juicity_rs_amd64_${juicity_rs_remote_version}.zip"
curl -L "$juicity_rs_url_arm64" -o "$juicity_rs_temp_dir/juicity_rs_arm64_${juicity_rs_remote_version}.zip"
curl -L "$juicity_rs_url_i386" -o "$juicity_rs_temp_dir/juicity_rs_i386_${juicity_rs_remote_version}.zip"
curl -L "$juicity_rs_url_riscv64" -o "$juicity_rs_temp_dir/juicity_rs_riscv64_${juicity_rs_remote_version}.zip"
unzip "$juicity_rs_temp_dir/juicity_rs_amd64_${juicity_rs_remote_version}.zip" juicity-server -d ./ && mv ./juicity-server ./juicity-server_amd64_${juicity_rs_remote_version} && chmod +x ./juicity-server_amd64_${juicity_rs_remote_version}
unzip "$juicity_rs_temp_dir/juicity_rs_amd64_${juicity_rs_remote_version}.zip" juicity-client -d ./ && mv ./juicity-client ./juicity-client_amd64_${juicity_rs_remote_version} && chmod +x ./juicity-client_amd64_${juicity_rs_remote_version}
unzip "$juicity_rs_temp_dir/juicity_rs_arm64_${juicity_rs_remote_version}.zip" juicity-server -d ./ && mv ./juicity-server ./juicity-server_arm64_${juicity_rs_remote_version} && chmod +x ./juicity-server_arm64_${juicity_rs_remote_version}
unzip "$juicity_rs_temp_dir/juicity_rs_arm64_${juicity_rs_remote_version}.zip" juicity-client -d ./ && mv ./juicity-client ./juicity-client_arm64_${juicity_rs_remote_version} && chmod +x ./juicity-client_arm64_${juicity_rs_remote_version}
unzip "$juicity_rs_temp_dir/juicity_rs_i386_${juicity_rs_remote_version}.zip" juicity-server -d ./ && mv ./juicity-server ./juicity-server_i386_${juicity_rs_remote_version} && chmod +x ./juicity-server_i386_${juicity_rs_remote_version}
unzip "$juicity_rs_temp_dir/juicity_rs_i386_${juicity_rs_remote_version}.zip" juicity-client -d ./ && mv ./juicity-client ./juicity-client_i386_${juicity_rs_remote_version} && chmod +x ./juicity-client_i386_${juicity_rs_remote_version}
unzip "$juicity_rs_temp_dir/juicity_rs_riscv64_${juicity_rs_remote_version}.zip" juicity-server -d ./ && mv ./juicity-server ./juicity-server_riscv64_${juicity_rs_remote_version} && chmod +x ./juicity-server_riscv64_${juicity_rs_remote_version}
unzip "$juicity_rs_temp_dir/juicity_rs_riscv64_${juicity_rs_remote_version}.zip" juicity-client -d ./ && mv ./juicity-client ./juicity-client_riscv64_${juicity_rs_remote_version} && chmod +x ./juicity-client_riscv64_${juicity_rs_remote_version}
rm -rf "$juicity_rs_temp_dir"

echo ${juicity_rs_remote_version#v} > juicity-rs_version.txt
