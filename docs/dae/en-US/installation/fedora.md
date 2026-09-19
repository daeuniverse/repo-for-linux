### Fedora / RHEL

#### Dae Universe RPM Repository

For Fedora and RHEL, use the Dae Universe repository at <https://daeuniverse.pages.dev>.
The commands below assume sudo is configured for your account.

##### 1. Add the DNF Repository

<!--@include: @/.vitepress/snippets/repositories/en-US/fedora-1.md-->

##### 2. Install dae

::: code-group

```sh [sudo]
sudo dnf install dae
```

```sh [root]
dnf install dae
```

:::

The package includes a systemd service and an example at `/etc/dae/example.dae`.
Save your configuration as `/etc/dae/config.dae`.
Complete [Minimal Configuration](/dae/start/minimal-configuration#minimal-configuration), then see
[Service Management](/dae/start/service-management#service-management).

<div v-pre lang="en-US">

<!-- installation-4:start -->
#### Fedora Copr

For Fedora only, use [Fedora Copr](https://copr.fedorainfracloud.org/coprs/zhullyb/v2rayA/package/dae)
instead of the Dae Universe repository.
`zhullyb/v2rayA` is the Copr project name; the package installed is `dae`.

::: code-group

```shell [sudo]
sudo dnf copr enable zhullyb/v2rayA
sudo dnf install dae
```

```shell [root]
dnf copr enable zhullyb/v2rayA
dnf install dae
```

:::
<!-- installation-4:end -->

</div>


---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
