#!/usr/bin/env bash

set -e

eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

v2ray_rules_dat_temp_file="$(mktemp /tmp/v2ray-rules-dat.XXXXXX)"
if ! curl -s "https://api.github.com/repos/Loyalsoldier/v2ray-rules-dat/releases/latest" -o "$v2ray_rules_dat_temp_file"; then
    echo "Error: Cannot get latest version of v2ray-rules-dat!"
    exit 1
fi
v2ray_rules_dat_remote_version=$(grep tag_name "$v2ray_rules_dat_temp_file" | awk -F "tag_name" '{printf $2}' | awk -F "," '{printf $1}' | awk -F '"' '{printf $3}')
v2ray_rules_dat_geoip_url="https://github.com/Loyalsoldier/v2ray-rules-dat/releases/download/$v2ray_rules_dat_remote_version/geoip.dat"
v2ray_rules_dat_geosite_url="https://github.com/Loyalsoldier/v2ray-rules-dat/releases/download/$v2ray_rules_dat_remote_version/geosite.dat"
rm -f "$v2ray_rules_dat_temp_file"

curl -L "$v2ray_rules_dat_geoip_url" -o ./geoip.dat
curl -L "$v2ray_rules_dat_geosite_url" -o ./geosite.dat

echo ${v2ray_rules_dat_remote_version} > v2ray-rules-dat_version.txt