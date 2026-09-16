---
title: "CentOS 7"
---

<div v-pre lang="zh-TW">

# CentOS 7

> [!WARNING]
> CentOS 7 和 RHEL 6.5/7 預設不支援 eBPF，必須自行建置並安裝核心（>= 5.17）。

## 簡介

CentOS 7 是較早的 Linux 發行版，生命週期已近尾聲，但仍有使用者使用。本頁記錄在 CentOS 7 或 RHEL 6.5 上執行 dae 的步驟。

## 升級流程

### 更新核心

更新到支援 `BTF` 的核心。

```bash
curl -s https://repo.cooluc.com/mailbox.repo > /etc/yum.repos.d/mailbox.repo
yum makecache
yum --enablerepo=mailbox-kernel update kernel
```

> [!NOTE]
> `mailbox.repo` 把核心放在 `mailbox-kernel` 段，預設關閉，所以這條命令要帶 `--enablerepo`。該核心是重新建置的 LTS 版本，支援 BBRv2 與 eBPF。也可以自行編譯，原始碼套件位於 <https://repo.cooluc.com/kernel/7/SRPMS/>。

### 掛載 BPF

```bash
curl -fsS https://repo.cooluc.com/kernel/files/sys-fs-bpf.mount > /etc/systemd/system/sys-fs-bpf.mount
systemctl enable sys-fs-bpf.mount
```

### 掛載 Control Group v2

> [!NOTE]
> 下面這個位址已不再提供 `mount-cgroup2.service`（最近一次檢查返回 HTTP 404）。`curl -f` 會讓失敗顯示出來，而不是把錯誤頁寫進單元檔案；下載失敗時請自行提供掛載 cgroup v2 的單元。

```bash
curl -fsS https://repo.cooluc.com/kernel/mount-cgroup2.service > /etc/systemd/system/mount-cgroup2.service
systemctl enable mount-cgroup2.service
```

### 重啟系統使核心生效

> [!NOTE]
> 檢查核心版本。若版本高於 5.17 且以 `-1.el7.x86_64` 結尾，表示操作成功。

```bash
uname -r
```

若核心版本未變，表示此前已更新過核心，需要重新建置 grub2 載入程式，使新核心具有最高優先順序。

要將最新核心設為預設：

```bash
grub2-set-default 0
```

要重新建置核心載入程式設定：

```bash
grub2-mkconfig -o /boot/grub2/grub.cfg
```

### 執行 dae

現在可以照常下載並執行 dae。

```bash
mkdir -p /opt/dae && cd /opt/dae
wget https://github.com/daeuniverse/dae/releases/download/v0.2.2/dae-linux-x86_64.zip
unzip dae-linux-x86_64.zip && rm -f dae-linux-x86_64.zip
cp example.dae config.dae
chmod 600 config.dae
DAE_LOCATION_ASSET=$(pwd) ./dae-linux-x86_64 run -c config.dae
```

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/tutorials/run-on-centos7.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
