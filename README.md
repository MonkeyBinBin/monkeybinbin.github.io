# blog

> Nuxt 3 專案

## 建構與執行

```bash
# 安裝相依套件
$ npm install # 或 yarn install

# 以熱重載模式在 localhost:3000 執行開發伺服器
$ npm run dev

# 建構前自動產生路由
$ npm run prebuild

# 建構生產環境
$ npm run build

# 啟動生產環境伺服器
$ npm run start

# 產生靜態網站（含自動產生路由）
$ npm run generate
```

## 程式碼品質檢查

```bash
# 檢查 JS/TS 與 Vue 程式碼
$ npm run lint:js

# 檢查 CSS/SCSS/SASS/Vue 樣式
$ npm run lint:css

# 一次執行所有 lint
$ npm run lint
```

## 部署到 GitHub Pages

本專案透過 GitHub Actions（`.github/workflows/deploy.yml`）自動部署到 GitHub Pages，無需手動執行部署指令。自動部署的觸發條件：

1. 任何 push 到 `develop` 分支（通常是 PR merge）
2. Contentful webhook 呼叫 `repository_dispatch` event（type: `contentful-publish`）
3. 手動透過 Actions UI 的 `workflow_dispatch`

`npm run generate` 可在本機產出 `dist/` 作為驗證，但不需要也不應該手動執行部署。

```bash
# 在本機產生靜態網站以供驗證（不會部署）
$ npm run generate
```

如需更詳細的說明，請參考 [Nuxt 3 官方文件](https://nuxt.com/docs)。
