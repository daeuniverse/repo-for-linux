---
title: "提交訊息規範"
---

<div v-pre lang="zh-TW">

# 語義化提交訊息

## 採用這些約定的原因

- 自動生成更新日誌
- 便於瀏覽 Git 歷史（例如，忽略程式碼風格改動）

瞭解如何透過小幅調整提交訊息的風格，成為更好的開發者。

## 格式

```
`<type>(<scope>): <subject>`

`<scope>` is optional
```

## 範例

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

`<type>` 的取值範例：

| 型別 | 含義 |
| --- | --- |
| `feat` | 面向使用者的新功能，而非建置指令碼的新功能 |
| `fix` | 面向使用者的 bug 修復，而非建置指令碼的修復 |
| `docs` | 文件改動 |
| `style` | 格式調整、補充缺失的分號等；不改動生產程式碼 |
| `refactor` | 重構生產程式碼，例如重新命名變數 |
| `test` | 新增缺失的測試、重構測試；不改動生產程式碼 |
| `chore` | 更新 grunt 任務等；不改動生產程式碼，例如升級依賴 |
| `perf` | 改善效能，例如提高並行效能 |
| `ci` | 更新 CI 設定檔和指令碼，例如 `.gitHub/workflows/*.yml` |

`<Scope>` 的取值範例：

- `init`
- `runner`
- `watcher`
- `config`
- `web-server`
- `proxy`

`<scope>` 可以為空（例如，改動是全域性的，或難以歸屬於單個元件），此時省略圓括號。在 Karma 外掛等較小的專案中，`<scope>` 為空。

## 提交訊息主題（首行）

首行不得超過 `72` 個字元，其後應留一個空行。型別和範圍始終使用小寫，如下所示。

## 提交訊息正文

與 `<subject>` 一樣，使用祈使語氣和現在時：用 `change`，而不是 `changed` 或 `changes`。正文應說明改動的動機，以及與此前行為的對比。

## 提交訊息頁尾

### 引用 issue

應在頁尾中單獨一行列出要關閉的 issue，並以 `Closes` 關鍵字開頭，如下所示：

```
Closes #234
```

如果有多個 issue：

```
Closes #123, #245, #992
```

## 參考資料

- <https://www.conventionalcommits.org/>
- <https://seesparkbox.com/foundry/semantic_commit_messages>
- <http://karma-runner.github.io/1.0/dev/git-commit-msg.html>
- <https://wadehuanglearning.blogspot.com/2019/05/commit-commit-commit-why-what-commit.html>

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/fb5eae6c2578e3ec99ae5b2844cb4f4ed93557a5/docs/en/development/commit-msg-guide.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
