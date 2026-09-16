# Nix / NixOS

將 daed 模組合併至現有 NixOS flake，保留原有 Nixpkgs、系統與硬體設定，並將 `HOSTNAME` 替換為設定名稱。

## 1. 匯入 NixOS 模組

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

## 2. 啟用 daed

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

預設設定目錄為 `/etc/daed`，網頁介面監聽 `127.0.0.1:2023`，僅供本機存取。

`openFirewall.port` 是代理連接埠，不是網頁介面連接埠。請參閱[模組選項](https://github.com/daeuniverse/flake.nix/blob/main/daed/module.nix)。

## 3. 套用系統設定

在系統 flake 目錄中，將 `HOSTNAME` 替換為設定名稱後執行：

::: code-group

```shell [sudo]
sudo nixos-rebuild switch --flake .#HOSTNAME
```

```shell [root]
nixos-rebuild switch --flake .#HOSTNAME
```

:::

模組管理 systemd 開機啟動，無需另外執行 `systemctl enable`。

## 其他安裝方式：全域套件

此方式與服務模組二選一。啟用 `services.daed` 時，不要再透過 `environment.systemPackages` 安裝另一份 daed。依架構將 `x86_64-linux` 調整為 `aarch64-linux`。

```nix
# nixos configuration module
{
  environment.systemPackages =
    with inputs.daeuniverse.packages.x86_64-linux;
      [ daed ];
}
```

## 選用：二進位快取

上游 garnix 快取提供 x86_64-linux 與 aarch64-linux 建置。將以下設定合併至 NixOS 設定。

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
