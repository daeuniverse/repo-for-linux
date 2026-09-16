# Nix / NixOS

将 daed 模块合并到现有 NixOS flake，并将 `HOSTNAME` 替换为配置名称。保留原有 Nixpkgs、系统与硬件配置。

## 1. 导入 NixOS 模块

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

## 2. 启用 daed

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

默认配置目录为 `/etc/daed`，Web 界面监听 `127.0.0.1:2023`，仅供本机访问。

`openFirewall.port` 是代理端口，并非 Web 界面端口。参见[模块选项](https://github.com/daeuniverse/flake.nix/blob/main/daed/module.nix)。

## 3. 应用系统配置

在系统 flake 目录中，将 `HOSTNAME` 替换为配置名称后执行：

::: code-group

```shell [sudo]
sudo nixos-rebuild switch --flake .#HOSTNAME
```

```shell [root]
nixos-rebuild switch --flake .#HOSTNAME
```

:::

模块管理 systemd 开机启动，无需另外执行 `systemctl enable`。

## 其他安装方式：全局软件包

此方式与服务模块二选一。启用 `services.daed` 时，不要再通过 `environment.systemPackages` 安装另一份 daed。按架构将 `x86_64-linux` 调整为 `aarch64-linux`。

```nix
# nixos configuration module
{
  environment.systemPackages =
    with inputs.daeuniverse.packages.x86_64-linux;
      [ daed ];
}
```

## 可选：二进制缓存

上游 garnix 缓存提供 x86_64-linux 与 aarch64-linux 构建。将以下设置合并到 NixOS 配置。

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
