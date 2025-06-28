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

```bash
# 產生適用於 GitHub Pages 的靜態網站
$ npm run generate

# 部署到 GitHub Pages（需先產生靜態檔案）
$ npm run deploy

# CI 自動部署（需設置 GITHUB_TOKEN）
$ npm run deploy:ci
```

如需更詳細的說明，請參考 [Nuxt 3 官方文件](https://nuxt.com/docs)。
