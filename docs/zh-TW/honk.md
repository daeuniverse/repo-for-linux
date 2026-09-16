# honk <Badge type="warning" text="實驗性" />

honk 是以 Rust 撰寫的 Linux 透明代理引擎。核心路徑沿用 dae 的 eBPF 資料面與 `dae0`／`daens` 模型，使用者空間的出站分組、多協定撥號與 Clash 相容 API 則借鏡 sing-box。

honk 並非任一專案的逐行移植，而是將兩者的設計整合至同一個行程，以 GPL-3.0-only 發布。

::: warning 尚未穩定
上游將 honk 標註為實驗性專案，版本仍處於 `v0.0.1-alpha` 階段。介面、設定與功能可能隨時變動，不建議用於生產環境。
:::

本站不提供 honk 的安裝與設定說明。功能範圍、設定格式與目前進度以上游為準：

[honk 專案首頁](https://github.com/daeuniverse/honk)
