# Nix / NixOS

Import the daed module into your existing NixOS flake. Keep your Nixpkgs, system and hardware configuration. Replace `HOSTNAME` with your configuration name.

## 1. Import the NixOS module

```nix
# flake.nix

{
  inputs.daeuniverse.url = "github:daeuniverse/flake.nix";
  # ...

  outputs = {nixpkgs, ...} @ inputs: {
    nixosConfigurations.HOSTNAME = nixpkgs.lib.nixosSystem {
      modules = [
        inputs.daeuniverse.nixosModules.daed
      ];
    };
  };
}
```

## 2. Enable daed

```nix
# nixos configuration module
{
  # daed - dae with a web dashboard
  services.daed = {
      enable = true;

      openFirewall = {
        enable = true;
        port = 12345;
      };

      /* default options

      package = inputs.daeuniverse.packages.x86_64-linux.daed;
      configDir = "/etc/daed";
      listen = "127.0.0.1:2023";

      */
  };
}
```

The default configuration directory is `/etc/daed`. The web interface listens on `127.0.0.1:2023` and is accessible from the local machine.

`openFirewall.port` is the proxy port, not the web interface port. See the [module options](https://github.com/daeuniverse/flake.nix/blob/main/daed/module.nix).

## 3. Apply the system configuration

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

## Alternative: global packages

This is an alternative to the service module. Do not install another daed through `environment.systemPackages` while enabling `services.daed`. Replace `x86_64-linux` with `aarch64-linux` when appropriate.

```nix
# nixos configuration module
{
  environment.systemPackages =
    with inputs.daeuniverse.packages.x86_64-linux;
      [ daed ];
}
```

## Optional: binary cache

The upstream garnix cache serves x86_64-linux and aarch64-linux builds. Merge these settings into the NixOS configuration.

```nix
nix.settings = {
  substituters = ["https://cache.garnix.io"];
  trusted-public-keys = [
    "cache.garnix.io:CTFPyKSLcx5RMJKfLo5EEPUObbA78b0YQ2DTCJXqr9g="
  ];
};
```

---

[daeuniverse/flake.nix README](https://github.com/daeuniverse/flake.nix#readme) · [ISC](https://github.com/daeuniverse/flake.nix/blob/main/LICENSE)
