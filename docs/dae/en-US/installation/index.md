# Installation guide

Choose the entry for your system. Before installation, check [kernel requirements](/dae/start/requirements); installing the package alone does not complete proxy configuration.

## Dae Universe APT / RPM repository

| System | Package manager | Installation |
| --- | --- | --- |
| Debian | APT | [Install dae](/dae/installation/debian) |
| Ubuntu | APT | [Install dae](/dae/installation/debian) |
| Fedora | DNF | [Install dae](/dae/installation/fedora) |
| RHEL | DNF | [Install dae](/dae/installation/fedora) |
| openSUSE | Zypper | [Install dae](/dae/installation/opensuse) |

## Distribution and community packages

| System | Source | Installation |
| --- | --- | --- |
| Arch Linux | Official repository, AUR, archlinuxcn | [Installation](/dae/installation/arch) |
| Manjaro | AUR / archlinuxcn | [Installation](/dae/installation/arch) |
| Gentoo | gentoo-zh overlay | [Installation](/dae/installation/gentoo) |
| Calculate | gentoo-zh overlay | [Installation](/dae/installation/gentoo) |
| NixOS | daeuniverse/flake.nix | [Installation](/dae/installation/nix) |

Fedora also offers an alternative [Copr](/dae/installation/fedora) installation method.

## Containers and manual installation

- [Docker](/dae/installation/docker)
- [Manual installation](/dae/installation/manual-installation)
- [OPNsense](/dae/tutorials/dae-with-opnsense)
- [CentOS 7](/dae/tutorials/run-on-centos7)

The CentOS 7 and macOS tutorials contain historical dependencies; read their notices before following the commands.

<!-- installation-5:start -->
## Alpine

See [Run on Alpine](/dae/tutorials/run-on-alpine).
<!-- installation-5:end -->

<!-- installation-6:start -->
## macOS

A workaround is available to run dae on macOS. See [Run on macOS](/dae/tutorials/run-on-macos).
<!-- installation-6:end -->

## After installation

[Minimal configuration](/dae/start/minimal-configuration) → [Service management](/dae/start/service-management) → [Troubleshooting](/dae/troubleshooting)

## Other available packages

This site focuses on dae documentation. The repository also provides daed, v2rayA and other packages; the table lists all repository packages.

Versions come from the repository build; documentation-only builds read missing versions from the [status branch](https://github.com/daeuniverse/repo-for-linux/tree/status).

| Software | Version | Project | License |
| --- | --- | --- | --- |
<!--@include: @/.vitepress/generated/package-rows.md-->

### Install software

<!--@include: @/.vitepress/snippets/packages/en-US/install.md-->

The daed installation steps are in the [daed chapter](/daed/); the [other available packages](/guide/packages) page describes the repository packages.


---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
