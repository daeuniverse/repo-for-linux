#!/usr/bin/env bash

set -euo pipefail

readonly template_file="README.template.md"
readonly readme_file="README.md"
readonly start_marker="<!-- BEGIN GENERATED PACKAGE TABLE -->"
readonly end_marker="<!-- END GENERATED PACKAGE TABLE -->"

replacement_file=""
output_file=""

packages=(
  dae
  daed
  juicity
  juicity-rs
  v2ray
  v2raya
  xray
  v2ray-rules-dat
)

software_names=(
  dae
  daed
  Juicity
  Juicity-rs
  v2ray
  v2rayA
  Xray
  v2ray-rules-dat
)

read_yaml_value() {
  local file="$1"
  local key="$2"

  sed -nE "s/^${key}: \"?([^\"]+)\"?$/\1/p" "$file" | head -n 1
}

license_cell_for_package() {
  local package="$1"
  local homepage
  local license

  homepage="$(read_yaml_value "nfpm/${package}.yaml" homepage)"
  license="$(read_yaml_value "nfpm/${package}.yaml" license)"

  case "$package" in
    daed)
      printf '%s\n' '[MIT](https://github.com/daeuniverse/daed/blob/main/LICENSE) + [AGPL-3.0-only](https://github.com/daeuniverse/dae-wing/blob/main/LICENSE)'
      ;;
    *)
      printf '[%s](%s/blob/main/LICENSE)\n' "$license" "$homepage"
      ;;
  esac
}

resolve_version() {
  local package="$1"
  local version_file="${package}_version.txt"
  local matches=()
  local base
  local version

  shopt -s nullglob
  matches=(archive/${package}_*.deb)
  shopt -u nullglob

  if (( ${#matches[@]} > 0 )); then
    base="${matches[0]##*/}"
    version="${base#${package}_}"
    version="${version%_*}"
    version="${version%.deb}"
    printf '%s\n' "$version"
    return
  fi

  if [[ -f "$version_file" ]]; then
    tr -d '[:space:]' < "$version_file"
    printf '\n'
    return
  fi

  printf '%s\n' "N/A"
}

generate_table_block() {
  local index
  local package
  local software_name
  local homepage
  local license_cell
  local version

  printf '%s\n\n' "$start_marker"
  printf '%s\n' '| Software | Version | Project | License |'
  printf '%s\n' '| --- | --- | --- | --- |'

  for index in "${!packages[@]}"; do
    package="${packages[$index]}"
    software_name="${software_names[$index]}"
    homepage="$(read_yaml_value "nfpm/${package}.yaml" homepage)"
    license_cell="$(license_cell_for_package "$package")"
    version="$(resolve_version "$package")"

    printf '| %s | %s | [%s](%s) | %s |\n' \
      "$software_name" \
      "$version" \
      "$homepage" \
      "$homepage" \
      "$license_cell"
  done

  printf '\n%s\n' "$end_marker"
}

cleanup() {
  rm -f -- "${replacement_file:-}" "${output_file:-}"
}

main() {
  if [[ ! -f "$template_file" ]]; then
    echo "Error: $template_file not found" >&2
    exit 1
  fi

  if ! grep -q "$start_marker" "$template_file" || ! grep -q "$end_marker" "$template_file"; then
    echo "Error: README template markers are missing" >&2
    exit 1
  fi

  replacement_file="$(mktemp)"
  output_file="$(mktemp)"

  generate_table_block > "$replacement_file"

  awk -v start="$start_marker" -v end="$end_marker" -v replacement="$replacement_file" '
    BEGIN {
      while ((getline line < replacement) > 0) {
        replacement_lines[++replacement_count] = line
      }
    }
    $0 == start {
      for (i = 1; i <= replacement_count; ++i) {
        print replacement_lines[i]
      }
      skip = 1
      next
    }
    $0 == end {
      skip = 0
      next
    }
    !skip {
      print
    }
  ' "$template_file" > "$output_file"

  mv "$output_file" "$readme_file"
}

trap cleanup EXIT

main "$@"