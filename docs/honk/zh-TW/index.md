# honk <Badge type="warning" text="實驗性" />

honk 是以 Rust 撰寫的 Linux eBPF 透明代理引擎，代理閘道器轉送的流量和本機發起的流量。設定語法和 TC 資料路徑來自 dae，在文件宣告的範圍內與 dae 相容。honk 使用與 dae 相同的 `dae0` 介面和 `daens` 網路命名空間，並掛接在同一批網路介面上，兩者因此不能同時執行。

真實透明代理需要 `root` 和 Linux 6.12+；較舊的核心會在掛接前遭拒。

::: warning 尚未穩定
honk 是實驗性專案，介面、設定與功能可能變動，不建議用於正式環境。
:::

本手冊跟隨 honk `main` 的提交 `6db2c39`，比套件中的 v0.1.0-beta.6 新；這裡寫到的功能可能要到下一個版本才進入套件。內容從上游抓取，採用 GPL-3.0-only 授權條款。

- [安裝 honk](./installation/)
- [設定指南](./configuration.md)
- [CLI 參考](./reference/cli.md)
- [設定方言參考](./reference/dialect.md)
