### Nix / NixOS

Use an existing NixOS flake configuration.
Retain your current Nixpkgs, system, and hardware modules.

#### 1. Import the NixOS Module

Replace `HOSTNAME` with your configuration name.
This example imports the dae module.

```nix
# flake.nix

{
  inputs.daeuniverse.url = "github:daeuniverse/flake.nix";
  # ...

  outputs = {nixpkgs, ...} @ inputs: {
    nixosConfigurations.HOSTNAME = nixpkgs.lib.nixosSystem {
      modules = [
        inputs.daeuniverse.nixosModules.dae
      ];
    };
  };
}
```

#### 2. Enable dae

```nix
# nixos configuration module
{
  # ...

  services.dae = {
      enable = true;

      openFirewall = {
        enable = true;
        port = 12345;
      };

      # `configFile` or `config` must be set

      /* default options

      package = inputs.daeuniverse.packages.x86_64-linux.dae;
      disableTxChecksumIpGeneric = false;
      assets = with pkgs; [ v2ray-geoip v2ray-domain-list-community ];

      */

      # alternative of `assets`, a dir contains geo database.
      # assetsPath = "/etc/dae";
  };
}
```

Set exactly one of `configFile` and `config`.
To use an external file, add this option inside `services.dae` and prepare
the file before applying the configuration:

```nix
configFile = "/etc/dae/config.dae";
```

Inline `config` is readable by all users through the Nix store.
The firewall port must match `tproxy_port`.
See [Minimal Configuration](/dae/start/minimal-configuration#minimal-configuration) and the
[dae module options](https://github.com/daeuniverse/flake.nix/blob/main/dae/module.nix).

#### 3. Apply the System Configuration

In the system flake directory, replace `HOSTNAME` and run:

::: code-group

```shell [sudo]
sudo nixos-rebuild switch --flake .#HOSTNAME
```

```shell [root]
nixos-rebuild switch --flake .#HOSTNAME
```

:::

The module manages systemd boot enablement; no separate `systemctl enable` is needed.

#### Alternative: Global Packages

Use this instead of the service module.
Do not install another dae through `environment.systemPackages` while enabling `services.dae`.
Replace `x86_64-linux` with `aarch64-linux` when appropriate.

```nix
# nixos configuration module
{
  environment.systemPackages =
    with inputs.daeuniverse.packages.x86_64-linux;
      [ dae ]; # or dae-unstable
}
```

#### Package Variants

| Package | Purpose |
| --- | --- |
| `dae` / `dae-release` | Release; `dae` aliases `dae-release` |
| `dae-unstable` | Tracks the dae main branch |

```shell
nix flake show github:daeuniverse/flake.nix
```

#### Optional: Binary Cache

The upstream garnix cache serves `x86_64-linux` and `aarch64-linux` builds.
Merge these settings into the NixOS configuration.

```nix
nix.settings = {
  substituters = ["https://cache.garnix.io"];
  trusted-public-keys = [
    "cache.garnix.io:CTFPyKSLcx5RMJKfLo5EEPUObbA78b0YQ2DTCJXqr9g="
  ];
};
```

See the [daeuniverse/flake.nix README](https://github.com/daeuniverse/flake.nix#readme).

---

[daeuniverse/flake.nix README](https://github.com/daeuniverse/flake.nix#readme) · [ISC](https://github.com/daeuniverse/flake.nix/blob/main/LICENSE)
