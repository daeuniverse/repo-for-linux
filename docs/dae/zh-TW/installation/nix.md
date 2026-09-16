### Nix / NixOS

使用現有的 NixOS flake 設定。
保留當前的 Nixpkgs、系統模組和硬體模組。

#### 1. 匯入 NixOS 模組

將 `HOSTNAME` 替換為設定名稱。
以下範例匯入 dae 模組。

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

#### 2. 啟用 dae

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

`configFile` 和 `config` 必須且只能設定其中一項。
如需使用外部檔案，在 `services.dae` 內新增以下選項，並在套用設定前準備好該檔案：

```nix
configFile = "/etc/dae/config.dae";
```

所有使用者都能通過 Nix store 讀取內嵌的 `config`。
防火牆連接埠必須與 `tproxy_port` 一致。
參見[最小設定](/zh-TW/dae/start/minimal-configuration#最小設定)和 [dae 模組選項](https://github.com/daeuniverse/flake.nix/blob/main/dae/module.nix)。

#### 3. 套用系統設定

在系統 flake 目錄中，替換 `HOSTNAME` 後執行：

::: code-group

```shell [sudo]
sudo nixos-rebuild switch --flake .#HOSTNAME
```

```shell [root]
nixos-rebuild switch --flake .#HOSTNAME
```

:::

模組會管理 systemd 開機啟動設定，無需另行執行 `systemctl enable`。

#### 替代方式：全域套件

此方式可替代服務模組。
啟用 `services.dae` 時，不要再透過 `environment.systemPackages` 安裝另一個 dae。
按需將 `x86_64-linux` 替換為 `aarch64-linux`。

```nix
# nixos configuration module
{
  environment.systemPackages =
    with inputs.daeuniverse.packages.x86_64-linux;
      [ dae ]; # or dae-unstable
}
```

#### 套件變體

| 套件 | 用途 |
| --- | --- |
| `dae` / `dae-release` | 發行版；`dae` 是 `dae-release` 的別名 |
| `dae-unstable` | 跟蹤 dae 主分支 |

```shell
nix flake show github:daeuniverse/flake.nix
```

#### 可選：二進位快取

上游 garnix 快取提供 `x86_64-linux` 和 `aarch64-linux` 架構的建置。
將以下設定合併到 NixOS 設定中。

```nix
nix.settings = {
  substituters = ["https://cache.garnix.io"];
  trusted-public-keys = [
    "cache.garnix.io:CTFPyKSLcx5RMJKfLo5EEPUObbA78b0YQ2DTCJXqr9g="
  ];
};
```

參見 [daeuniverse/flake.nix README](https://github.com/daeuniverse/flake.nix#readme)。

---

[daeuniverse/flake.nix README](https://github.com/daeuniverse/flake.nix#readme) · [ISC](https://github.com/daeuniverse/flake.nix/blob/main/LICENSE)
