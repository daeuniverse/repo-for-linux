#!/usr/bin/env bash

set -e

honk_temp_file="$(mktemp /tmp/honk.XXXXXX)"
if ! curl -s "https://api.github.com/repos/daeuniverse/honk/releases" -o "$honk_temp_file"; then
    echo "Error: Cannot get latest version of honk!"
    exit 1
fi
honk_remote_version=$(jq -er 'first(.[] | .tag_name | select(startswith("v")))' < "$honk_temp_file")
honk_url_amd64="https://github.com/daeuniverse/honk/releases/download/${honk_remote_version}/honk-core-${honk_remote_version}-x86_64-unknown-linux-gnu.tar.gz"
honk_url_arm64="https://github.com/daeuniverse/honk/releases/download/${honk_remote_version}/honk-core-${honk_remote_version}-aarch64-unknown-linux-gnu.tar.gz"
rm -f "$honk_temp_file"

honk_temp_dir="$(mktemp -d /tmp/honk.XXXXXX)"
curl -L "$honk_url_amd64" -o "$honk_temp_dir/honk_amd64_${honk_remote_version}.tar.gz"
curl -L "$honk_url_arm64" -o "$honk_temp_dir/honk_arm64_${honk_remote_version}.tar.gz"
tar -xzf "$honk_temp_dir/honk_amd64_${honk_remote_version}.tar.gz" -C "$honk_temp_dir" && mv "$honk_temp_dir/honk-core-${honk_remote_version}-x86_64-unknown-linux-gnu/honk-core" ./honk-core_amd64_${honk_remote_version} && chmod +x ./honk-core_amd64_${honk_remote_version}
tar -xzf "$honk_temp_dir/honk_arm64_${honk_remote_version}.tar.gz" -C "$honk_temp_dir" && mv "$honk_temp_dir/honk-core-${honk_remote_version}-aarch64-unknown-linux-gnu/honk-core" ./honk-core_arm64_${honk_remote_version} && chmod +x ./honk-core_arm64_${honk_remote_version}
rm -rf "$honk_temp_dir"
echo ${honk_remote_version#v} > honk_version.txt
