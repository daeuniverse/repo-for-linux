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
printf "This service runs with user account 'nobody', so 'nobody' user must be\n"
printf "able to read TLS certificates, for a example, certbot's /etc/letsencrypt \n"
printf "should be readable for the user 'nobody', for instructions on how to grant \n"
printf "access with POSIX ACLs, visit https://daeuniverse.pages.dev/.\n"
        ;;
esac

exit 0
