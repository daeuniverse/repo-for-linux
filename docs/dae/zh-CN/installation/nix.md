### Nix / NixOS

使用现有的 NixOS flake 配置。
保留当前的 Nixpkgs、系统模块和硬件模块。

#### 1. 导入 NixOS 模块

将 `HOSTNAME` 替换为配置名称。
以下示例导入 dae 模块。

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

#### 2. 启用 dae

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

`configFile` 和 `config` 必须且只能设置其中一项。
如需使用外部文件，在 `services.dae` 内添加以下选项，并在应用配置前准备好该文件：

```nix
configFile = "/etc/dae/config.dae";
```

所有用户都能通过 Nix store 读取内联的 `config`。
防火墙端口必须与 `tproxy_port` 一致。
参见[最小配置](/zh-CN/dae/start/minimal-configuration#最小配置)和 [dae 模块选项](https://github.com/daeuniverse/flake.nix/blob/main/dae/module.nix)。

#### 3. 应用系统配置

在系统 flake 目录中，替换 `HOSTNAME` 后执行：

::: code-group

```shell [sudo]
sudo nixos-rebuild switch --flake .#HOSTNAME
```

```shell [root]
nixos-rebuild switch --flake .#HOSTNAME
```

:::

模块会管理 systemd 开机启动设置，无需另行执行 `systemctl enable`。

#### 替代方式：全局软件包

此方式可替代服务模块。
启用 `services.dae` 时，不要再通过 `environment.systemPackages` 安装另一个 dae。
按需将 `x86_64-linux` 替换为 `aarch64-linux`。

```nix
# nixos configuration module
{
  environment.systemPackages =
    with inputs.daeuniverse.packages.x86_64-linux;
      [ dae ]; # or dae-unstable
}
```

#### 软件包变体

| 软件包 | 用途 |
| --- | --- |
| `dae` / `dae-release` | 发行版；`dae` 是 `dae-release` 的别名 |
| `dae-unstable` | 跟踪 dae 主分支 |

```shell
nix flake show github:daeuniverse/flake.nix
```

#### 可选：二进制缓存

上游 garnix 缓存提供 `x86_64-linux` 和 `aarch64-linux` 架构的构建。
将以下设置合并到 NixOS 配置中。

```nix
nix.settings = {
  substituters = ["https://cache.garnix.io"];
  trusted-public-keys = [
    "cache.garnix.io:CTFPyKSLcx5RMJKfLo5EEPUObbA78b0YQ2DTCJXqr9g="
  ];
};
```

参见 [daeuniverse/flake.nix README](https://github.com/daeuniverse/flake.nix#readme)。

---

[daeuniverse/flake.nix README](https://github.com/daeuniverse/flake.nix#readme) · [ISC](https://github.com/daeuniverse/flake.nix/blob/main/LICENSE)
