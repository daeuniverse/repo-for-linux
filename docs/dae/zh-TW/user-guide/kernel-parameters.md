---
title: "核心參數"
---

<div v-pre lang="zh-TW">

# 設定核心參數

> **注意**
> 如果 `global.auto_config_kernel_parameter` 為 `true`，將自動設定參數。

將 dae 所在裝置作為路由器或其他中間裝置，並繫結 LAN 介面時，需要調整 Linux 核心參數。

無論該選項是否開啟，dae 每次啟動都會修改以下主機參數：`net.ipv4.conf.all.rp_filter = 0`、`net.ipv4.conf.all.arp_filter = 0`，以及 `dae0` 上的 `rp_filter = 0`、`arp_filter = 0`、`accept_local = 1`、`disable_ipv6 = 0`、`forwarding = 1`。原因是從它的 `daens` 網路名稱空間注入的回覆會經 `dae0` veth 以遠端源位址重新進入主機。它還會在自己的 `daens` 名稱空間內（而非主機上）盡力啟用 `net.ipv4.tcp_early_demux` 和 `net.ipv4.ip_early_demux`。

較新的 Linux 發行版預設停用 IP 轉送。搭建 Linux 路由器、閘道、VPN 伺服器或普通撥入伺服器時，需要啟用轉送。還應停用 `send_redirects`，以保持裝置的閘道角色及正確的下游路由表。

## 1. 設定 LAN 介面

對每個需要代理的 LAN 介面執行以下操作，將 `docker0` 替換為介面名稱：

::: code-group

```shell [sudo]
export lan_ifname=docker0

sudo tee /etc/sysctl.d/60-dae-lan-$lan_ifname.conf << EOF
net.ipv4.conf.$lan_ifname.forwarding = 1
net.ipv6.conf.$lan_ifname.forwarding = 1
net.ipv4.conf.$lan_ifname.send_redirects = 0
EOF
sudo sysctl --system
```

```shell [root]
export lan_ifname=docker0

tee /etc/sysctl.d/60-dae-lan-$lan_ifname.conf << EOF
net.ipv4.conf.$lan_ifname.forwarding = 1
net.ipv6.conf.$lan_ifname.forwarding = 1
net.ipv4.conf.$lan_ifname.send_redirects = 0
EOF
sysctl --system
```

:::

## 2. 啟用全域轉送

啟用全域 IPv4 和 IPv6 轉送，以避免異常情況：

::: code-group

```shell [sudo]
sudo tee /etc/sysctl.d/60-ip-forward.conf << EOF
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
EOF
sudo sysctl --system
```

```shell [root]
tee /etc/sysctl.d/60-ip-forward.conf << EOF
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
EOF
sysctl --system
```

:::

## 3. 設定 WAN 介面

對於接受路由器通告（RA）的 WAN 介面，將 `eth0` 替換為介面名稱：

::: code-group

```shell [sudo]
export wan_ifname=eth0

if [ "$(cat /proc/sys/net/ipv6/conf/$wan_ifname/accept_ra)" == "1" ]; then
    sudo tee /etc/sysctl.d/60-dae-wan-$wan_ifname.conf << EOF
net.ipv6.conf.$wan_ifname.accept_ra = 2
EOF
    sudo sysctl --system
fi
```

```shell [root]
export wan_ifname=eth0

if [ "$(cat /proc/sys/net/ipv6/conf/$wan_ifname/accept_ra)" == "1" ]; then
    tee /etc/sysctl.d/60-dae-wan-$wan_ifname.conf << EOF
net.ipv6.conf.$wan_ifname.accept_ra = 2
EOF
    sysctl --system
fi
```

:::

`net.ipv6.conf.all.forwarding = 1` 會抑制 `accept_ra = 1` 時的 RA 接收，因此需要將 `accept_ra` 從 `1` 改為 `2`。參閱 <https://sysctl-explorer.net/net/ipv6/accept_ra/>。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/user-guide/kernel-parameters.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
