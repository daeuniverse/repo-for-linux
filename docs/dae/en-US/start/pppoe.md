<div v-pre lang="en-US">

<!-- quick-start-pppoe:start -->
## PPPoE Interface

To proxy a PPPoE interface, set `wan_interface` or `lan_interface` to the
interface created by pppd (such as `ppp0` or `pppoe-wan`), not the physical interface.
If you use PPPoE only for WAN, set `wan_interface` to `auto`.
<!-- quick-start-pppoe:end -->

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
