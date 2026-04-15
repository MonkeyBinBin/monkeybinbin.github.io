# 設計規範文件

本目錄是本部落格的 **UI/UX 設計單一事實來源**，供人類開發者與 agent 在處理視覺變更時查閱。

## 文件結構

| 檔案 | 用途 |
|---|---|
| [`design-tokens.md`](./design-tokens.md) | 色彩、字體、字級、間距、斷點、陰影等 design tokens |
| [`component-inventory.md`](./component-inventory.md) | 現有 `components/` 與頁面的用途、主要元素 |
| [`visual-guidelines.md`](./visual-guidelines.md) | 排版、互動、無障礙等視覺原則 |

## 使用時機

### agent 自動開發

處理 `components/`、`pages/`、`assets/sass/` 相關的 issue 時：

1. 先讀 `design-tokens.md` 與 `component-inventory.md`，確認要動到哪些既有 token 與元件
2. 若 issue 需引入新色碼 / 字體 / 間距，需在 PR 中同步更新 `design-tokens.md`
3. 視覺驗收流程請見 `.github/copilot-instructions.md` 的「UI 變更流程」章節

### 人類開發者

提交 UI 類 issue 時，請使用 `UI 變更` issue template（會引導附上 Figma 連結、截圖等設計參考），
以便 agent 或接手者有明確的設計依據。

## 維護原則

- design tokens 的唯一實作來源是 `assets/sass/helpers/_variables.scss`，文件內容應與其保持同步
- 新增 token 時先更新 SCSS，再更新本文件
- component inventory 可在新增 / 移除元件時透過 PR 同步更新
