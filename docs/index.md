---
layout: home
hero:
  name: Dae Universe
  text: "Install and use dae"
  tagline: "Check kernel requirements, install dae, and configure DNS, routing and services."
  image:
    src: /daeuniverse-hero.png
    alt: Dae Universe
  actions:
    - theme: brand
      text: "Quick start"
      link: /dae/
    - theme: alt
      text: "Install daed"
      link: /daed/
    - theme: alt
      text: "v2rayA & other software"
      link: /guide/packages
features:
  - title: "Kernel requirements"
    details: "Check the kernel version and required configuration before installation."
    link: /dae/start/requirements
    linkText: "Check requirements"
  - title: "DNS configuration"
    details: "Configure upstream DNS and choose a DNS routing template."
    link: /dae/configuration/dns
    linkText: "Configure DNS"
  - title: "Routing"
    details: "Route traffic by domain, IP, process and network, and pick an outbound group."
    link: /dae/configuration/routing
    linkText: "Write routing rules"
  - title: "Troubleshooting"
    details: "Investigate network, DNS, firewall and eBPF loading problems."
    link: /dae/troubleshooting
    linkText: "Find a solution"
  - title: "honk"
    details: "An experimental Linux transparent proxy engine written in Rust, based on designs from dae and sing-box."
    link: /honk
    linkText: "About honk"
  - title: "kdae"
    details: "A branch with architecture and performance changes not yet in dae's main branch."
    link: /kdae
    linkText: "About kdae"
  - title: "DaedNext"
    details: "daed in Rust, bundling the dashboard with the DaeNext core. Not yet released."
    link: /daednext
    linkText: "About DaedNext"
---
