#!/usr/bin/env bash

set -e

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

for deb_file in ./archive/*.deb; do
    reprepro -b repo/apt includedeb ${codename} "$deb_file"
done

# RPM Packages
[ -d repo/rpm ] || mkdir -p repo/rpm
cp public-key.asc repo/rpm/public-key.asc
echo "%_gpg_name Markson Hon" > ~/.rpmmacros
echo "%gpg_path ~/.gnupg" >> ~/.rpmmacros
for arch in ${rpm_architecture}; do
  mkdir -p "repo/rpm/${arch}"
  for apps in $(ls ./archive/*.rpm); do
    cp "$apps" "repo/rpm/${arch}/"
  done
  for apps in $(ls ./archive/*all.rpm); do
    cp "$apps" "repo/rpm/${arch}/"
  done
  rpm --addsign "repo/rpm/${arch}/*.rpm"
  createrepo_c --database --update "repo/rpm/${arch}/*.rpm"
  gpg --detach-sign --armor "repo/rpm/${arch}/repodata/repomd.xml"
done