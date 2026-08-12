#!/bin/sh
# Post-install notice for packages whose services run as user 'nobody'.
#
# If you terminate TLS with certificates managed by certbot under
# /etc/letsencrypt, the 'nobody' user must be able to read them.
# Grant access with POSIX ACLs (the commands below are expanded so they
# also work in dash, which does not support brace expansion).
# The /etc/letsencrypt paths are just an example: if you use acme.sh,
# lego or another ACME client, follow that tool's documentation.

## Color
echo_red() {
  printf '\033[31m%s\033[0m\n' "$*"
}
echo_red_bold() {
  printf "\033[1;31m%s\033[0m\n" "$1"
}
echo_yellow() {
  printf '\033[33m%s\033[0m\n' "$*"
}
echo_yellow_bold() {
  printf "\033[1;33m%s\033[0m\n" "$1"
}
echo_green() {
  printf '\033[32m%s\033[0m\n' "$*"
}
echo_green_bold() {
  printf "\033[1;32m%s\033[0m\n" "$1"
}

## notice

case "${1:-configure}" in
    configure|abort-upgrade|abort-remove|abort-deconfigure)
echo_green_bold "--------------------------------------------------------------"
echo_yellow_bold "NOTICE: TLS termination with certificates managed by certbot"
echo_green_bold "--------------------------------------------------------------"
echo_yellow "1. The proxy service runs as user 'nobody'. It must be able to read your TLS"
echo_yellow "certificates in order to terminate TLS."
echo_yellow "2. If you use certbot, grant the 'nobody' user read access to /etc/letsencrypt"
echo_yellow "via POSIX ACLs."
echo_yellow "3. The paths below are only examples and the directory may not exist on your"
echo_yellow "system yet: check the actual paths on your system."
echo_green_bold "--------------------------------------------------------------"
echo_red "Warning: all commands need root privileges. Use sudo or "
echo_red "run as root, you must know what you are doing."
echo_green_bold "--------------------------------------------------------------"
echo_yellow ""
echo_green "Set ACLs for the 'nobody' user to read your certbot-managed certificates:"
echo_green ""
echo_yellow "    setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}"
echo_yellow "    setfacl -m u:nobody:rX /etc/letsencrypt"
echo_green ""
echo_green "Keep the ACLs applied after every renewal with a certbot deploy hook:"
echo_green ""
echo_yellow "    certbot renew --deploy-hook \"setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}\""
echo_green ""
echo_green_bold "--------------------------------------------------------------"
echo_yellow "If you obtain certificates with acme.sh, lego or another ACME client,"
echo_yellow "follow the documentation of that tool to arrange certificate access"
echo_yellow "for the 'nobody' user."

        ;;
esac

exit 0
