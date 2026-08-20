#!/bin/sh
# Post-install notice for packages whose services run as user 'nobody'.
#
# If you terminate TLS with certificates managed by certbot under
# /etc/letsencrypt, the 'nobody' user must be able to read them.
# Grant access with POSIX ACLs (the commands below are expanded so they
# also work in dash, which does not support brace expansion).
# The /etc/letsencrypt paths are just an example: if you use acme.sh,
# lego or another ACME client, follow that tool's documentation.

## Reload Services
systemctl daemon-reload 2>/dev/null || true
## notice

case "${1:-configure}" in
    configure|abort-upgrade|abort-remove|abort-deconfigure)
printf "Service 'nobody' must be able to read TLS certificates managed by certbot under /etc/letsencrypt.\n"
printf "Visit https://daeuniverse.pages.dev/ for instructions on how to grant access with POSIX ACLs.\n"
        ;;
esac

exit 0
