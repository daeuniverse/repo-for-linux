---
title: "升級核心"
---

<div v-pre lang="zh-TW">

# 升級核心

Linux 是核心，而非完整的作業系統。核心是作業系統的核心。

## 各發行版的核心升級方法

### 免責宣告

升級 Linux 核心並不簡單。只有遇到安全缺陷或硬體互動問題時，才必須升級。如果系統崩潰，可能需要恢復整個系統。

多數 Linux 發行版已隨附最新核心。升級核心不會刪除舊核心，舊核心仍保留在系統中。

> **注意**：除非需要特定驅動支援，否則不應手動升級核心；硬體或安全問題也可能需要升級。可從系統恢復選單復原到舊核心。

### 準備工作

升級前，執行 `uname -r` 檢查主機當前執行的核心版本。此處 eBPF 的最低版本要求為 `>= 5.17`。

各發行版的升級方法不同。本頁覆蓋 Armbian、Debian 及其衍生發行版、Red Hat、Fedora 及其衍生發行版，以及 Arch 及其衍生發行版。

> **注意**：由於 dae 基於 eBPF 建置，主機核心版本必須 >= 5.17，dae 才能正常執行。

### 在 Armbian Linux 上升級到 BTF 核心

Armbian 使用者可使用已編譯並啟用 BTF 的核心，參見 [daeuniverse/armbian-btf-kernel](https://github.com/daeuniverse/armbian-btf-kernel)。

### 在基於 Debian 的 Linux 上升級核心

Armbian 等 Debian 衍生發行版可用以下命令安裝指定版本的核心：

::: code-group

```shell [sudo]
# Sync databases.
sudo apt update
# Search available kernel versions.
apt-cache search ^linux-image
# Install specific image.
sudo apt install <specific-linux-image>
```

```shell [root]
# Sync databases.
apt update
# Search available kernel versions.
apt-cache search ^linux-image
# Install specific image.
apt install <specific-linux-image>
```

:::

安裝完成後，重啟系統以使用新核心，再檢查核心版本：

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

```shell
uname -r
```

以下升級到最新核心的方法僅適用於 Debian，屬於激進升級：

> **警告**：Debian 官方支援的最新核心位於 `unstable`。Debian Unstable 的代號為 SID，是持續滾動的開發版本，而非正式發行版，包含新引入 Debian 的套件。升級可能帶來破壞性變更，使用者需自行承擔風險。

參考資料：[在 Debian 11 上安裝 Linux 5.14 核心](https://www.itsfoss.net/installing-linux-5-14-kernel-on-debian-11)。

> **注意**：如果系統不是 Debian 11，請修改 `Pin: release a=bullseye`。例如，Debian 10 使用 `Pin: release a=buster`。

::: code-group

```shell [sudo]
# Add unstable source
cat <<EOF | sudo tee /etc/apt/sources.list.d/unstable.list
deb http://deb.debian.org/debian unstable main contrib non-free
deb-src http://deb.debian.org/debian unstable main contrib non-free
EOF

# Create apt preferences
cat <<EOF | sudo tee /etc/apt/preferences
Package: *
Pin: release a=bullseye
Pin-Priority: 500

Package: linux-image-amd64
Pin: release a=unstable
Pin-Priority: 1000

Package: *
Pin: release a=unstable
Pin-Priority: 100
EOF

# Sync databases.
sudo apt update

# Perform full dist-upgrade
sudo apt dist-upgrade
```

```shell [root]
# Add unstable source
cat <<EOF | tee /etc/apt/sources.list.d/unstable.list
deb http://deb.debian.org/debian unstable main contrib non-free
deb-src http://deb.debian.org/debian unstable main contrib non-free
EOF

# Create apt preferences
cat <<EOF | tee /etc/apt/preferences
Package: *
Pin: release a=bullseye
Pin-Priority: 500

Package: linux-image-amd64
Pin: release a=unstable
Pin-Priority: 1000

Package: *
Pin: release a=unstable
Pin-Priority: 100
EOF

# Sync databases.
apt update

# Perform full dist-upgrade
apt dist-upgrade
```

:::

重啟系統以使用新核心，再檢查核心版本：

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

```shell
uname -r
```

### 在 Red Hat 和 Fedora Linux 上升級核心

Fedora、Red Hat 及其衍生發行版可從儲存庫下載核心，手動升級到指定版本。安裝命令如下：

::: code-group

```shell [sudo]
sudo yum install kernel
```

```shell [root]
yum install kernel
```

:::

安裝完成後，重啟系統以使用新核心，再檢查核心版本：

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

```shell
uname -r
```

### 在基於 Arch 的 Linux 上升級核心

Arch 及其衍生發行版提供多種持續更新的 Linux 核心。Arch Linux 定期更新安全修補程式，因此經常有核心和修補程式更新可用。

Manjaro 及其他 Arch 衍生發行版通常透過更新管理器提供核心更新。系統更新程式會檢查最新核心，也可使用以下 `pacman` 命令檢查：

::: code-group

```shell [sudo]
# Search available kernel images.
pacman -Ss ^linux$
# Install specific kernel image.
sudo pacman -S <specific-linux-image>
```

```shell [root]
# Search available kernel images.
pacman -Ss ^linux$
# Install specific kernel image.
pacman -S <specific-linux-image>
```

:::

確認安裝並等待完成後，重啟系統，再檢查核心版本以確認升級結果：

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

```shell
uname -r
```

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/user-guide/kernel-upgrade.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
