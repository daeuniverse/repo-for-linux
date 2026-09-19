---
title: DNS and private addresses
---

# DNS and private addresses

## How dae intercepts DNS

dae handles two kinds of packets: packets it routes (ingress on a LAN interface) and packets that leave the host (egress on a WAN interface). Among them, UDP and TCP traffic to destination port 53 is marked as a DNS query first and then passes through the routing rules. Everything except traffic that matches `must_direct` goes to the DNS module. A plain `direct` does not let DNS bypass dae, and neither does the `dip(geoip:private) -> direct` rule for private addresses in the bundled configuration.

Two kinds of traffic never reach the DNS module:

- Traffic that matches `must_direct`. A query from a LAN client to a socket on the dae host itself, such as a local dnsmasq listening on port 53, is routed like any other packet and reaches the DNS module, UDP and TCP alike; to let the host's own resolver answer it, say so with `l4proto(udp) && dport(53) && dip(<address of the dae host>) -> must_direct`.
- Queries over the loopback interface. dae only hooks the LAN and WAN interfaces.

dae does not reassemble IP fragments. It processes only the first fragment of a datagram and passes later fragments through unchanged, so a fragmented UDP DNS message cannot be intercepted correctly.

## The `dns` section decides where a query goes

An intercepted query selects an upstream through `dns.routing.request`. The matched upstream answers it; the original destination never sees the query. Only the built-in outbound `asis` queries the request's original destination, and it always does so over UDP, even when the client asked over TCP.

On a truncated answer (`TC=1`), `udp://` and `tcp+udp://` upstreams retry over TCP. `asis` does not retry. dae discards the server's answer and replies with a message that keeps the query's ID and question, sets `TC=1` and carries an empty Answer section. The client then decides whether to retry over TCP.

Because dae takes over every DNS query it routes, LAN devices can use any DNS address, including the dae host itself. With `asis`, do not point LAN devices at port 53 of dae itself, because the query would loop between dae and itself. Setting `dns.bind`, for example to `'127.0.0.1:5353'`, also makes dae listen for DNS queries at that address.

The `domain()` routing rules depend on DNS answers dae has seen. When the resolver that answers LAN clients sends its own upstream queries through a `must_direct` rule, dae never sees those answers. dae then learns no domain for the returned IPs, so `domain()` rules do not match the clients' traffic.

## `bootstrap_resolver`

dae sends three kinds of lookups directly to `global.bootstrap_resolver`, never through a proxy:

- hostnames in `dns.upstream` that are not IP literals
- the background real-domain probe that `dial_mode: domain` (the default) runs for a sniffed domain
- once the internal DNS router is enabled, subscription and node hostnames that no `sub()`, `node()` or `subnode()` rule assigns to an upstream

When unset, dae uses `119.29.29.29:53` first and `223.5.5.5:53` second. Setting the option replaces both defaults; the upstream example is:

```shell
global {
  bootstrap_resolver: '9.9.9.9:53'
}
```

## Private addresses use direct connections by default

The bundled `example.dae` and the upstream minimal configuration both contain the following rule, which sends traffic to reserved addresses directly. The built-in set `geoip:private` covers RFC 1918 private addresses, loopback and link-local addresses, among others.

```shell
dip(geoip:private) -> direct
```

This is the default behaviour of the bundled configuration, not an exclusion hardcoded in the eBPF datapath or the control plane. Remove the rule and these addresses are no longer guaranteed a direct connection: the traffic follows the remaining routing rules and may enter a proxy. The rule also has no effect on DNS: queries to port 53 of a reserved address still go to the DNS module.

See [DNS configuration](/dae/configuration/dns) and [routing configuration](/dae/configuration/routing) for details.
