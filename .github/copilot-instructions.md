# GitHub Copilot 指令

本檔案為 GitHub Copilot cloud agent 專用，agent 會自動將內容作為系統提示讀取。內容應與 `CLAUDE.md` 保持一致；若有衝突以 `CLAUDE.md` 為準。

## 專案概述

個人部落格。技術棧：

- Nuxt 3（`ssr: false`，靜態 SSG）
- Contentful CMS 作為內容唯一來源
- 透過 `.github/workflows/deploy.yml` 部署至 GitHub Pages（Pages source 為 GitHub Actions）

## 分支與提交規範

- 所有變更必須基於 `develop` 分支，透過 Pull Request 合併
- PR 的 base 必須是 `develop`。**禁止**修改 `master`：它是舊 `gh-pages` 流程的歷史快照，保留僅為 rollback 參考
- Commit message 使用 Conventional Commits 格式，例：`type(scope): 簡短描述`
- 回應與註解一律使用正體中文，技術專有名詞可保留英文
- 註解說明「為什麼」而非「做了什麼」
- **禁止**在程式碼或 commit message 中寫死敏感資訊（API key、token、連線字串）
- **禁止**在 commit message 或 PR description 中加入任何 AI 署名或生成標記

## 必要驗證

提交 PR 前必須確認以下指令全數通過：

```
npm run lint
npm test
npm run generate
```

`npm run generate` 需要環境變數 `CTF_CDA_ACCESS_TOKEN`，已由 Copilot 的 `copilot` environment 自動注入，不需手動設定或硬編碼。若變數遺失，`scripts/generateRoutes.mjs` 會 fail fast 並印出明確錯誤。

## 可以動的範圍（白名單）

### 基礎任務

- ESLint / Stylelint / Prettier 違規修正
- 文案、typo、metadata 修正（`pages/`、`README.md` 等使用者可見文字）
- Vue component 內的 bug fix
- SCSS 樣式調整（維持現有 design token、不引入新色票）
- 補測試檔：針對既有純函式（`helpers/`、`constant/`、`config/`）
- 補或改善中文註解

### 進階任務

- **多檔案變更**：允許同時修改 2–5 個邏輯相關的檔案（例：一個 component 搭配其 scoped style 與對應測試）
- **小型重構**：rename、抽 function、抽 component、移動純函式到 `helpers/`
- **新增 Vue component 或 page**：當 issue 明確描述 layout / 功能需求時，可從零建立新的 `.vue` 檔
- **`services/api.js` 新增查詢方法**：可新增 method 以滿足新需求，但**不得修改**任何既有 method 的查詢邏輯或欄位假設

## 多檔案變更的硬限制

放寬「多檔案」不代表放任跨模組亂改，必須遵守：

- 單次 PR 的變更檔數**不超過 5 個**
- 每個 PR 只處理**一個邏輯變更**，不要把 bug fix 跟 refactor 綁在同一個 PR
- 跨越 5 個以上檔案的重構 → 拒絕任務，或在 PR 描述中說明需要拆分後再處理

## 不要動的範圍（黑名單）

以下需人類決策，Copilot 應拒絕 issue 或在 PR 中說明無法自動修復：

- `scripts/generateRoutes.mjs`、`scripts/generateFeeds.mjs`、`server/utils/feeds.ts` 等 build 關鍵路徑
- `nuxt.config.ts`
- `config/index.mjs` 的結構調整
- `.github/workflows/*.yml`（含本檔所在的 workflow 設定）
- `services/api.js` 內**既有** method 的 Contentful 查詢邏輯或欄位假設（允許新增 method，見白名單）
- 升級 / 新增 / 移除 dependency（dependency 調整交由 Dependabot 處理）
- Contentful schema 假設的任何變動
- 跨越 5 個以上檔案的大規模重構
- 任何會影響 `dist/` 輸出結構或 GitHub Pages 部署設定的改動
- `tests/smoke.test.mjs`（這是安全退檔測試，除非是為了新增測試、否則不得修改）

## Contentful 注意事項

- 文章內容唯一來源是 Contentful，本機不保存任何文章原始檔
- `content_type: post` 為唯一固定內容型別，主要欄位：`id, createDate, title, slug, categoryList, articleContent`
- 若需要對 Contentful 發出新查詢，**優先使用 `services/api.js` 已存在的方法**，不要在新檔案裡重新建立 Contentful client

## 安全退檔

`config/index.mjs` **不得**再出現 `CTF_CDA_ACCESS_TOKEN` 欄位。這項規則由 `tests/smoke.test.mjs` 的 regression test 強制驗證，違反時 `npm test` 會失敗、PR 無法 merge。

## 修改風格

- 優先修改既有檔案、避免新增檔案
- 不要加入未被要求的重構或 refactor
- 不要加入防禦性錯誤處理程式碼，除非實際會發生
- 不要為假設性的未來需求預留擴充點
