<div v-pre lang="zh-CN">

<!-- quick-start-pppoe:start -->
## PPPoE 接口

代理 PPPoE 接口时，请将 `wan_interface` 或 `lan_interface` 设为 pppd 生成的接口（`ppp0` / `pppoe-wan`），而非物理接口。

如果 PPPoE 接口仅用于 WAN，将 `wan_interface` 设为 `auto` 即可。
<!-- quick-start-pppoe:end -->

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
