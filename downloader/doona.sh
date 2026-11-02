#!/usr/bin/env bash

set -e

eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

doona_temp_file="$(mktemp /tmp/doona.XXXXXX)"
if ! curl -s "https://api.github.com/repos/Zakkaus/doona/releases" -o "$doona_temp_file"; then
    echo "Error: Cannot get latest version of doona!"
    exit 1
fi
# The newest release that is not a draft, pre-releases included.
doona_remote_tag=$(jq -er 'first(.[] | select(.draft | not) | .tag_name | select(startswith("v")))' < "$doona_temp_file")
rm -f "$doona_temp_file"
doona_version="${doona_remote_tag#v}"
doona_release_url="https://github.com/Zakkaus/doona/releases/download/${doona_remote_tag}"

rm -rf ./doona_pkg
mkdir -p ./doona_pkg
curl -fL "${doona_release_url}/SHA256SUMS" -o ./doona_pkg/SHA256SUMS

# The packaging revision after the version is chosen upstream, so read the file names from SHA256SUMS.
doona_files=()
for pattern in "doona-web_${doona_version}-[0-9]+_all\.deb" \
               "doona-web-fonts_${doona_version}-[0-9]+_all\.deb" \
               "doona-web-precompressed_${doona_version}-[0-9]+_all\.deb" \
               "doona-${doona_version}-[0-9]+\.noarch\.rpm" \
               "doona-fonts-${doona_version}-[0-9]+\.noarch\.rpm" \
               "doona-precompressed-${doona_version}-[0-9]+\.noarch\.rpm"; do
    doona_file=$(awk '{ print $2 }' ./doona_pkg/SHA256SUMS | grep -E "^${pattern}\$" || true)
    if [ "$(printf '%s\n' "$doona_file" | grep -c .)" -ne 1 ]; then
        echo "Error: Expected one doona asset matching ${pattern} in SHA256SUMS, got: ${doona_file}"
        exit 1
    fi
    doona_files+=("$doona_file")
done

for doona_file in "${doona_files[@]}"; do
    curl -fL "${doona_release_url}/${doona_file}" -o "./doona_pkg/${doona_file}"
    (cd ./doona_pkg && awk -v file="$doona_file" '$2 == file' SHA256SUMS | sha256sum -c -)
done

echo ${doona_version} > doona_version.txt
