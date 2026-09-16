---
title: "代理協定"
---

<div v-pre lang="zh-TW">

# 代理協定

dae 支援以下代理協定：

| 協定 | 支援細節 | URI 格式 |
| --- | --- | --- |
| HTTP(S)、naiveproxy | — | [HTTP(S)](/zh-TW/dae/proxy-protocols#http-s) |
| Socks | **版本**： Socks4 / Socks4a / Socks5 | [Socks](/zh-TW/dae/proxy-protocols#socks) |
| VMess / VLESS | **VMess**： AEAD, alterID=0<br>**傳輸**： TCP / WS / gRPC / Meek / HTTPUpgrade<br>**TLS**：支援 Reality | [v2rayN](https://github.com/2dust/v2rayN/wiki/%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E(ver-2))<br>[DuckSoft](https://github.com/XTLS/Xray-core/discussions/716) |
| Shadowsocks | **加密**： AEAD / Stream Ciphers<br>**外掛**： simple-obfs / shadow-tls (SIP003)，參閱[外掛說明](/zh-TW/dae/proxy-protocols#shadowsocks-外掛) | [SIP002](https://shadowsocks.org/doc/sip002.html)<br>[SIP008](https://shadowsocks.org/doc/sip008.html) |
| ShadowsocksR | — | — |
| Trojan | Trojan-gfw / Trojan-go | [trojan/trojan-go](https://p4gefau1t.github.io/trojan-go/developer/url) |
| Tuic | **版本**： v5 | [Tuic](https://github.com/daeuniverse/dae/discussions/182) |
| Juicity | — | [Juicity](https://github.com/juicity/juicity?tab=readme-ov-file#link-format) |
| Hysteria2 | — | [Hysteria2](https://v2.hysteria.network/docs/developers/URI-Scheme) |
| AnyTLS | — | [AnyTLS](https://github.com/anytls/anytls-go/blob/main/docs/uri_scheme.md) |
| 代理鏈（靈活協定） | — | [Proxy chain](https://github.com/daeuniverse/dae/discussions/236) |

表中協定均已支援。“—”表示原文未列出細分資訊或 URI 參考連結。

## URI 範例

### HTTP(S)

  ```
  https://[[user:]pass@]hostname:port/
  ```

### Socks

  ```
  socks4://[[user:]pass@]hostname:port/
  socks5://[[user:]pass@]hostname:port/
  ```

## Shadowsocks 外掛

v2ray-plugin 未標記為支援，但其 Websocket（+TLS）子項已標記為支援。

ShadowTLS v3 連結也可直接使用 `shadowtls://`。

需要瀏覽器式 TLS 指紋的節點可採用以下任一設定方式：

- 設定 `global.tls_implementation: utls`，並保留 `global.utls_imitate` 的預設值 `chrome_auto`。
- 在連結的查詢參數中附加 `tlsImplementation=utls&utlsImitate=chrome`。

如果提供商要求不使用自訂 SNI，請省略 `sni`，或將其值明確設為空。

## 外部代理程式

可使用外部代理程式擴充協定支援。以下以 naiveproxy 為例。

dae 和其他代理程式雖支援 HTTPS 協定，卻不使用 Chromium 網路堆疊，因而會削弱 naiveproxy 的偽裝效果。因此，建議使用外部 naiveproxy 程式。

1. 啟動 naiveproxy：

   本範例讓 naiveproxy 監聽 HTTP 連接埠。HTTP 代理不支援 UDP 流量，因此使用外部代理程式時，建議優先使用 SOCKS5 連接埠。

   ```bash
   naiveproxy --listen=http://127.0.0.1:1090 --proxy=https://yourlink
   ```

2. 在 dae 設定的節點部分新增 `http://127.0.0.1:1090`，並在所用組中使用此節點。

3. 若已繫結 WAN 介面，即填寫了 `global.wan_interface`，請在 `routing` 部分靠前的位置新增以下規則。這可防止流量經 naiveproxy 後回到 dae，造成環路：

   ```shell
   pname(naiveproxy) -> must_direct
   ```

   此處 `pname` 匹配行程名稱。可透過檢視啟動命令、執行時執行 `ps -ef` 命令，或檢視 dae 日誌確定 naiveproxy 的行程名稱。

   `must_direct` 表示允許包括 DNS 查詢在內的全部流量直接通過，不重新導向至 dae。

   僅繫結 LAN 介面的使用者無需執行此步驟。

## 相容性說明

### VLESS 的 XTLS Vision 與格式錯誤的 ServerHello

flow 為 `xtls-rprx-vision` 時，用戶端從第一次寫入起就傳送 Vision 幀：先是填充頭，隨後是隨機填充。TLS 負載短於 900 位元組時，會填充到總長 900 至 1399 位元組；其他負載填充 0 至 255 位元組。這種幀格式不等待伺服器的 `ServerHello`。從 `ServerHello` 讀取的密碼套件只決定用戶端隨後是否切換到 XTLS direct 模式；在該模式下，用戶端把內層 TLS 記錄直接寫入底層連線。

出站層的 VLESS 實現在完成本地邊界檢查後，才從 `ServerHello` 讀取密碼套件。讀到的資料塊從記錄起始處算起必須至少有 79 位元組，記錄長度欄位加 5 必須不小於 79。`legacy_session_id` 長度必須符合 RFC 8446 第 4.1.2 節規定的 0 至 32 位元組範圍，密碼套件的兩個位元組必須落在該資料塊內。解析器不校驗 24 位握手長度，不限制記錄長度上限，也不等待整條記錄到齊。

如果某項檢查失敗，例如工作階段 ID 超過 32 位元組，或資料塊太短而放不下密碼套件，則不設定密碼套件。`ServerHello` 協商出 TLS 1.2，或密碼套件不是 TLS 1.3 套件，或密碼套件為 `TLS_AES_128_CCM_8_SHA256` 時，同樣跳過 direct 模式。此後用戶端一旦寫入 TLS 應用資料，或過濾器檢查過 6 個封包，就用命令 `0x01`（填充結束）結束填充階段；該幀本身仍帶填充。之後的流量在外層 TLS 之上的 Vision 流中不加填充地轉送，也不報告協定錯誤。

此行為由 dae 依賴的出站函式庫實現；dae 本身不解析握手訊息。

### 覆蓋基於 QUIC 的協定的壅塞控制演算法

`tuic`、`juicity` 和 `hysteria2` 節點連結支援僅作用於用戶端的 `cc_override` 查詢參數，用於選擇用戶端使用的壅塞控制演算法。該參數不會發送給伺服器。在 `tuic` 和 `juicity` 上，它優先於連結的 `congestion_control` 參數；在 `hysteria2` 上，它優先於伺服器應答的 `rx`：

```
tuic://<uuid>:<password>@<server>:<port>?congestion_control=bbr&cc_override=bbr3
juicity://<uuid>:<password>@<server>:<port>?congestion_control=bbr&cc_override=bbr3
hysteria2://<auth>:<password>@<server>:443?upmbps=20&downmbps=100&cc_override=bbr3
```

| 協定 | `cc_override` 支援的值 |
| --- | --- |
| `tuic`、`juicity` | `bbr`、`cubic`、`new_reno`、`brutal`、`bbr3` |
| `hysteria2` | `bbr`、`brutal`、`bbr3` |

匹配前會將參數值轉為小寫，並去除首尾空白。如果參數值不受支援，節點會在構造 dialer 時失敗，而不是靜默退回。在 `tuic` 和 `juicity` 上，只有 `brutal` 和 `bbr3` 會安裝各自的 sender；`bbr`、`cubic` 和 `new_reno` 安裝的都是同一個 BBR sender，因為出站函式庫沒有 CUBIC 和 NewReno 實現。`cc_override=brutal` 只在已知傳送速率時才安裝 Brutal：在 `tuic` 和 `juicity` 上，連結必須帶有正值的 `cwnd`（單位為每秒位元組數）；在 `hysteria2` 上，必須按下文所述宣告正值的上傳速率。沒有速率時，連線會安裝 BBR（不是 `bbr3`），既不報錯，也不寫日誌。

未設定 `cc_override` 時，`tuic` 和 `juicity` 只在連結設定了 `congestion_control=brutal` 且 `cwnd` 為正值時安裝 `brutal`。其他情況一律安裝 `bbr3`。`hysteria2` 在伺服器未應答 `rx=auto` 且已宣告上傳速率時，按伺服器 `rx` 與用戶端上傳速率中的較小者安裝 `brutal`；否則安裝 `bbr3`。上傳速率來自連結的 `upmbps` 與 `downmbps`，或 `maxTx` 與 `maxRx`，否則來自全域的 `bandwidth_max_tx` 與 `bandwidth_max_rx`；每對參數必須兩個值都設定。在連結中新增 `cc_override=bbr`，可為該節點恢復先前穩定版本的預設演算法。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/proxy-protocols.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
