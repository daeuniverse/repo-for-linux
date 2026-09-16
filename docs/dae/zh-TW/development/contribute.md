---
title: "參與貢獻"
---

<div v-pre lang="zh-TW">

# 貢獻指南

如果你想為專案作出貢獻、幫助改進專案，歡迎參與。參與貢獻也是瞭解 GitHub 協作開發、新技術及其生態系統的好方法。你還可以學習如何提交有建設性、能提供幫助的 bug 報告和功能請求，以及其中最可貴的貢獻：高質量、整潔的 Pull Request。

## bug 報告和功能請求

如果發現了 bug 或想請求新功能，請先搜尋是否已有類似的 issue。如果沒有，請在本儲存庫中建立 [issue](https://github.com/daeuniverse/dae/issues/new)。

## 程式碼

如果想修復 bug 或實現功能，請 fork 本儲存庫並建立 Pull Request。

在建立 Pull Request 前，如果對需求或實現有疑問，建議先建立 issue 進行討論。這樣可以確認維護者同意改動的內容和方式，也有望讓後續合併更快。

只有所有狀態檢查都通過後，Pull Request 才能合併。

## pre-commit 鉤子

本儲存庫使用 [pre-commit 鉤子](https://github.com/pre-commit/pre-commit-hooks)，在提交寫入本地 Git 歷史之前執行 lint 檢查。按以下步驟設定 pre-commit：

```bash
# install pre-commit
pip3 install pre-commit
# install pre-commit hooks
pre-commit install
```

## 如何建立整潔的 Pull Request

- 在 GitHub 上建立專案的個人 fork。
- 將 fork 複製到本地機器。你在 GitHub 上的遠端版本庫名為 `origin`。
- 將原始儲存庫新增為名為 `upstream` 的遠端版本庫。
- 如果 fork 建立已有一段時間，請務必將上游改動拉取到本地儲存庫。
- 從 `main` 建立一個新分支，用於本次開發。
- 實現或修復功能，併為程式碼添加註解。
- 遵循專案的程式碼風格，包括縮排。
- 如果專案有測試，請執行測試。常規單元測試使用 `go test -tags dae_stub_ebpf ./...`，eBPF 測試使用 `make ebpf-test`。
- 按需編寫或調整測試。
- 按需新增或修改文件。
- 使用 Git 的[互動式 rebase](https://help.github.com/articles/interactive-rebase) 將多次提交合併為一次提交。必要時建立一個新分支。
- 將分支推送到你在 GitHub 上的 fork，即遠端版本庫 `origin`。
- 從你的 fork 向正確的分支建立 Pull Request。目標分支為專案的 `main`。
- Pull Request 獲批並合併後，可以將 `upstream` 的改動拉取到本地儲存庫，並刪除多餘的分支。

最後還有同樣重要的一點：始終使用現在時編寫提交訊息。提交訊息應描述這次提交應用後會對程式碼產生什麼作用，而不是你對程式碼做了什麼。

## 重新請求審查

請勿在新評論中透過提及審查者來提醒他們，而應使用重新請求審查功能。詳情見 [GitHub 文件：重新請求審查](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request#re-requesting-a-review)。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/ed92f27457d952b60339e63772e64eaef91698f6/docs/en/development/contribute.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
