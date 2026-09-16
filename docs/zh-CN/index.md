---
layout: home
hero:
  name: Dae Universe
  text: "dae 安装与使用指南"
  tagline: "检查内核要求，安装 dae，配置 DNS、路由与服务。"
  image:
    src: /daeuniverse-hero.png
    alt: Dae Universe
  actions:
    - theme: brand
      text: "快速开始"
      link: /zh-CN/dae/
    - theme: alt
      text: "安装 daed"
      link: /zh-CN/daed/
    - theme: alt
      text: "v2rayA 与其他软件"
      link: /zh-CN/guide/packages
features:
  - title: "内核要求"
    details: "安装前检查内核版本及所需配置项。"
    link: /zh-CN/dae/start/requirements
    linkText: "检查运行环境"
  - title: "DNS 配置"
    details: "设置上游 DNS，按使用场景选择 DNS 分流模板。"
    link: /zh-CN/dae/configuration/dns
    linkText: "配置 DNS"
  - title: "路由配置"
    details: "按域名、IP、进程与网络分流，选择出站分组。"
    link: /zh-CN/dae/configuration/routing
    linkText: "编写分流规则"
  - title: "故障排查"
    details: "排查网络、DNS、防火墙及 eBPF 加载问题。"
    link: /zh-CN/dae/troubleshooting
    linkText: "查阅排查步骤"
  - title: "honk"
    details: "Rust 编写的 eBPF 代理引擎，借鉴 dae 与 sing-box，仍在早期开发。"
    link: /zh-CN/honk
    linkText: "了解 honk"
  - title: "kdae"
    details: "在 dae 主线之外重构架构并优化性能的分支。"
    link: /zh-CN/kdae
    linkText: "了解 kdae"
  - title: "DaedNext"
    details: "Rust 版 daed，把面板和 DaeNext 核心打包在一起，尚未发布。"
    link: /zh-CN/daednext
    linkText: "了解 DaedNext"
---
