---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-TW">

# 為第一條連線設定路由 {#title-為第一條連線設定路由}

完成[快速入門](quick-start.md)後，保持 honk 運作並以管理員身分登入。準備可用的 HTTP 或 HTTPS 訂閱 URL，以及閘道器的 shell 存取權限。本教學將 `example.com` 送入名為 `proxy` 的新群組，其他流量保持直連。訂閱名稱使用 `harbor`。

從直連組態開始：使用 `fallback: direct`，沒有 DNS 區塊，也沒有既有的 `harbor` 訂閱或 `proxy` 群組。將 API 憑證放在獨立的引入檔案，讓主檔案保持可編輯；見[組態範例](configuration.md)。此時 `example.com` 使用 `direct` 回退。第 3 步新增代理規則後，在第 6 步確認其出站為 `proxy`。

## 1. 新增訂閱 {#1-新增訂閱}

開啟**節點**頁，選擇**新增訂閱**。在**名稱**中填寫 `harbor`，在**訂閱網址**中填寫供應商的 URL，然後選擇**新增**。doona 會寫入宣告並請求更新。

檢查成功通知是否顯示節點數，再選擇 `harbor` 檢視其節點。如果宣告已儲存但擷取失敗，先解決回報的錯誤，再選擇卡片上的**更新 harbor**。訂閱包含代理節點後再繼續。

控制項無法使用時，請查閱[節點與訂閱條件](feature-requirements.md#req-nodes)或[更新條件](feature-requirements.md#req-subscription-refresh)。

## 2. 建立群組 {#2-建立群組}

開啟**策略**頁，選擇**新增群組**。在**群組名稱**中填寫 `proxy`，將**選擇方式**設為**平均最快**。在**訂閱**中選擇 `harbor`，檢查**符合的節點**後選擇**建立**。

頁面應出現 `proxy` 卡片，其中包含訂閱成員。展開卡片，檢視所選成員及其延遲或健康狀態。群組內沒有節點時請勿繼續。控制項無法使用時，見[群組建立與編輯條件](feature-requirements.md#req-group-edit)。

## 3. 將測試網域送入群組 {#3-將測試網域送入群組}

開啟**規則** → **路由規則**。如果顯示檢視切換，先選擇**進階**，再選擇**新增規則**。

| 欄位 | 值 |
| --- | --- |
| **條件寫法** | **選擇** |
| **依據** | **完整網域** |
| **值** | `example.com` |
| **出站** | `proxy` |
| **插入位置** | **最後（fallback 之前）** |

選擇對話框中的**新增規則**，立即寫入並重載。檢查**新規則已生效**通知及新增規則：

```dae
domain(full: example.com) -> proxy
```

保留 `fallback: direct`。新增功能無法使用時，見[路由規則條件](feature-requirements.md#req-rules)。

## 4. 定義 DNS 上游 {#4-定義-dns-上游}

開啟**組態** → **設定檔**，在**設定檔**中選擇 `/etc/honk/config.dae`，將以下區塊附加到現有區塊之後。保留剛才建立的訂閱、群組和路由規則。

```dae
# 透過代理群組傳送指定的 DNS 請求。
dns {
    # 使用數字伺服器位址，避免依賴其網域的初始解析。
    upstream {
        remote_dns: 'https://1.1.1.1/dns-query' -> proxy
    }
    # 保留其他請求的原目的地。
    routing {
        request {
            fallback: asis
        }
    }
}
```

選擇**套用**，等待檔案已寫入、組態已重載的通知。重新開啟檔案，檢查 `remote_dns` 是否存在。編輯器或**套用**無法使用時，見[組態寫入條件](feature-requirements.md#req-config-edit)。

## 5. 新增並套用 DNS 規則 {#5-新增並套用-dns-規則}

開啟**規則** → **DNS 規則**，在**request 規則**中選擇**新增規則**。將**依據**設為**完整網域**，在**值**中填寫 `example.com`，在**動作**中選擇 `remote_dns`，將**插入位置**設為**最後（fallback 之前）**。

選擇**新增規則**以寫入並重載。檢查**新規則已生效**通知及請求規則：

```dae
qname(full: example.com) -> remote_dns
```

路由規則選擇流量使用的群組；DNS 規則選擇解析器，該解析器的請求也經過此群組。以上每次儲存都會單獨生效。新增功能無法使用時，見 [DNS 規則條件](feature-requirements.md#req-rules)。

## 6. 用追蹤模擬驗證規則 {#6-用追蹤模擬驗證規則}

在**規則**頁開啟**追蹤模擬**。將**網路協定**設為 **TCP**，**網域**填寫 `example.com`，**目的連接埠**填寫 `443`。**目的 IP**留空，在**解析模式**中選擇**不解析（none）**，再選擇**開始追蹤**。

結果應符合你的網域規則，出站為 `proxy`，節點鏈中包含 `harbor` 的節點。改用 `example.net` 再執行一次，出站應為 `direct`。追蹤只模擬規則評估，不建立連線，也不能證明代理可以存取網站。控制項無法使用時，見[路由追蹤條件](feature-requirements.md#req-routing-trace)。

## 7. 觀察真實連線 {#7-觀察真實連線}

發出請求前先開啟**連線**頁。在閘道器執行：

```sh
curl --http1.1 --limit-rate 32 https://example.com/ -o /dev/null
```

傳輸期間，在**連線**頁找到 `example.com` 並開啟對應列。檢查節點鏈是否包含 `proxy` 和 `harbor` 的某個節點。短連線可能在檢視前已經結束，必要時再次發出請求。傳輸成功表示此路由能承載真實流量。頁面無法使用時，見[連線條件](feature-requirements.md#req-connections)。

代理流量由使用者空間處理，會出現在連線頁。直連流量由核心轉送，不會出現在該頁。使用[追蹤](routing.md#trace)檢查直連回退，或檢視[組態參考](configuration.md#config)中的完整檔案範例。

</div>
