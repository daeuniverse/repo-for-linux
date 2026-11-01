# 安裝 honk

在使用 APT 或 RPM 的發行版上，從 Dae Universe 套件來源安裝 `honk`。Arch Linux 則可透過 AUR 安裝。

套件將 musl `full` 建置安裝至 `/usr/bin/honk-core`，內嵌 doona 網頁介面，並在 `/usr/share/honk/` 中建立指向 `/usr/share/v2ray-rules-dat/` 下 `geoip.dat` 與 `geosite.dat` 的符號連結。

- [Debian / Ubuntu](./debian.md)
- [Fedora / RHEL](./fedora.md)
- [openSUSE](./opensuse.md)
- [Arch Linux / Manjaro](./arch.md)
- [Docker](./docker.md)
- [OpenWrt](/zh-TW/openwrt/)

從 APT/RPM 套件來源安裝套件後，請繼續閱讀[首次執行](./first-run.md)，設定並啟動 honk。
