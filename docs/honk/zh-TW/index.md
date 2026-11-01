# honk <Badge type="warning" text="實驗性" />

honk 是以 Rust 撰寫的 Linux 透明代理引擎，將 dae 風格的 eBPF 資料路徑與使用者空間的代理協定、路由整合在一起。它使用與 dae 相同的 `dae0` 介面和 `daens` 網路命名空間，並掛載在同一批網路介面上，因此無法與 dae 同時執行。

::: warning 尚未穩定
honk 是實驗性專案，介面、設定與功能可能變動，不建議用於正式環境。
:::

本手冊對應 **v0.1.0-beta.4**，建置時從固定的上游版本取得，以 GPL-3.0-only 授權條款發布。手冊內文暫以簡體中文顯示，待繁體中文翻譯完成後更新。

- [安裝 honk](./installation/)
- [設定指南](./configuration.md)
- [CLI 參考](./reference/cli.md)
- [設定方言參考](./reference/dialect.md)
