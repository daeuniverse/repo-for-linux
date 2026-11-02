#!/usr/bin/env bash
set -e
[ -d archive ] || mkdir -p archive
[ -d archive/deb ] || mkdir -p archive/deb
[ -d archive/rpm ] || mkdir -p archive/rpm
# The packages are built and signed-off upstream; ship them as they are.
# create-repo.sh turns <name>_all.rpm into <name>.noarch.rpm in each architecture directory.
for deb_file in ./doona_pkg/*.deb; do
    cp "$deb_file" ./archive/deb/
done
for rpm_file in ./doona_pkg/*.noarch.rpm; do
    cp "$rpm_file" "./archive/rpm/$(basename "$rpm_file" .noarch.rpm)_all.rpm"
done
