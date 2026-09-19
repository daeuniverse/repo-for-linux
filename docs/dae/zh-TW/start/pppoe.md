<div v-pre lang="zh-TW">

<!-- quick-start-pppoe:start -->
## PPPoE 介面

代理 PPPoE 介面時，請將 `wan_interface` 或 `lan_interface` 設為 pppd 生成的介面（`ppp0` / `pppoe-wan`），而非實體介面。

如果 PPPoE 介面僅用於 WAN，將 `wan_interface` 設為 `auto` 即可。
<!-- quick-start-pppoe:end -->

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
