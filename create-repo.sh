#!/usr/bin/env bash

set -ex

export origin="DAE Universe"
export label="goose"
export suite="stable"
export codename="goose"
export debian_architecture="amd64 arm64 i386 riscv64"
export rpm_architecture="x86_64 aarch64 i386 riscv64"
export components="honk"
export description="A Debian repository for v2rayA, dae and juicity."

# Debian Packages
[ -d repo/apt ] || mkdir -p repo/apt
for dir in conf dists incoming pool; do
  [ -d "repo/apt/$dir" ] || mkdir -p "repo/apt/$dir"
done

cat > repo/apt/conf/distributions <<- EOL
Origin: ${origin}
Label: ${label}
Suite: ${suite}
Codename: ${codename}
Architectures: ${debian_architecture}
Components: ${components}
Description: ${description}
SignWith: THE_REAL_GPG_PUBLIC_KEY_ID
EOL

for deb_file in ./archive/deb/*.deb; do
    reprepro -b repo/apt includedeb ${codename} "$deb_file"
done

# RPM Packages
[ -d repo/rpm ] || mkdir -p repo/rpm
echo "%_gpg_name Markson Hon" > ~/.rpmmacros
echo "%gpg_path ~/.gnupg" >> ~/.rpmmacros
# Define the RPM architecture mapping
for arch in ${rpm_architecture}; do
  mkdir -p "repo/rpm/${arch}"
  case ${arch} in
    x86_64)
      rpm_arch="x86_64"
      rpm_filename_arch="amd64"
      ;;
    aarch64)
      rpm_arch="aarch64"
      rpm_filename_arch="arm64"
      ;;
    i386)
      rpm_arch="i386"
      rpm_filename_arch="i386"
      ;;
    riscv64)
      rpm_arch="riscv64"
      rpm_filename_arch="riscv64"
      ;;
  esac
  for apps in ./archive/rpm/*${rpm_filename_arch}.rpm; do
    target_file_path="repo/rpm/${arch}/$(basename "$apps" _${rpm_filename_arch}.rpm).${rpm_arch}.rpm"
    cp "$apps" "$target_file_path"
  done
  for apps in ./archive/rpm/*all.rpm; do
    target_file_path="repo/rpm/${arch}/$(basename "$apps" _all.rpm).noarch.rpm"
    cp "$apps" "$target_file_path"
  done
  for rpm_file in repo/rpm/${arch}/*.rpm; do
    rpm --addsign "$rpm_file"
  done
  createrepo_c --database --update "repo/rpm/${arch}"
  [ -d "repo/rpm/${arch}/repodata" ] || mkdir -p "repo/rpm/${arch}/repodata"
  gpg --detach-sign --armor "repo/rpm/${arch}/repodata/repomd.xml"
done

# Source Config File
cp ./daeuniverse.list ./repo/
cp ./daeuniverse.repo ./repo/
cp ./daeuniverse.sources ./repo/