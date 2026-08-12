#!/bin/sh
# Post-install notice for packages whose services run as user 'nobody'.
#
# If you terminate TLS with certificates managed by certbot under
# /etc/letsencrypt, the 'nobody' user must be able to read them.
# Grant access with POSIX ACLs (the commands below are expanded so they
# also work in dash, which does not support brace expansion).
# The /etc/letsencrypt paths are just an example: if you use acme.sh,
# lego or another ACME client, follow that tool's documentation.

case "${1:-configure}" in
    configure|abort-upgrade|abort-remove|abort-deconfigure)
        cat <<'NOTICE'

NOTICE: the proxy service runs as user 'nobody'. It must be able to
read your TLS certificates in order to terminate TLS.

If you use certbot, grant the 'nobody' user read access to
/etc/letsencrypt via POSIX ACLs. The paths below are only an example;
the directory may not exist on your system yet:

    setfacl -R -m u:nobody:rX /etc/letsencrypt/live
    setfacl -R -m u:nobody:rX /etc/letsencrypt/archive
    setfacl -m u:nobody:rX /etc/letsencrypt

Keep the ACLs applied after every renewal with a certbot deploy hook:

    sudo certbot renew --deploy-hook "setfacl -R -m u:nobody:rX /etc/letsencrypt/live && setfacl -R -m u:nobody:rX /etc/letsencrypt/archive && setfacl -m u:nobody:rX /etc/letsencrypt"

If you obtain certificates with acme.sh, lego or another ACME client,
follow the documentation of that tool to arrange certificate access
for the 'nobody' user.

NOTICE
        ;;
esac

exit 0
