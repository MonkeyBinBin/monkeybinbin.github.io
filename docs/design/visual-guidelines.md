# Visual Guidelines

本文件記錄非 token 化的視覺原則，補充 `design-tokens.md` 未涵蓋的「應該怎麼做」。

## 排版

- **容器最大寬度**：目前未強制單一值，常見為 `max-width: 1200px; margin: 0 auto;` + `padding: 20px`（≤768px 縮為 `1.5rem 1rem`、≤480px 縮為 `1rem`）
- **垂直節奏**：段落間距預設 `16px`–`24px`；卡片群組使用 `gap: 1.5rem`（桌面）/ `1rem`（平板）/ `0.8rem`（手機）
- **文字對齊**：body 文字一律靠左對齊，只有標題與 hero 區塊可置中
- **標題層級**：每頁只能有一個 `<h1>`，對應 `pages/**.vue` 的 `useHead({ title })`

## 互動

- **連結底線動畫**：使用 `_mixins.scss` 的 `@mixin link-animation($color)`，不要各自發明 hover effect
- **按鈕 hover**：優先沿用 Bootstrap 類別；自訂按鈕 hover 應 `transition` 至少 `0.1s`–`0.3s` 以避免生硬
- **頁面切換**：使用 `main.scss` 已定義的 `.page-enter-active` / `.page-leave-active` 過場（`opacity 0.5s`），不要在 page 層再加 transition

## RWD

- 一律「mobile-first，但以 desktop 預設樣式為基底、用 `(width <= 768px)` 降級調整」— 這是本專案現行慣例
- 斷點只用 480 / 768（見 `design-tokens.md`），不要自創 600、700 等中間值
- 手機版字級最小 `0.75rem`（12px），再小會不可讀

## 無障礙（a11y）

- **語意 HTML**：優先使用 `<nav>`、`<section>`、`<article>`、`<time>` 等語意標籤
- **圖片必須有 `alt`**：裝飾性圖片用 `alt=""`，內容性圖片需描述
- **連結文字**：不要用「點這裡」，應描述目標（例：「查看文章詳情」）
- **色彩對比**：主色 `#1dc8cd` 在白底上對比不足以承載正文，只能作為強調色；正文請用深色（≥ `#333`）
- **鍵盤可達**：自訂互動元件需支援 Tab focus 與 Enter / Space 觸發，不要只綁 `@click`

## 圖片與資源

- 靜態圖片放 `public/img/`
- 文章內容圖片由 Contentful 提供 CDN URL，不需本地化
- `public/img/share.jpg` 為 og:image，尺寸固定 `1080x1080`（見 `nuxt.config.ts`）

## 不要做

- ❌ 直接在元件內寫死 hex 色碼 / 自定字體 family / 新斷點——應先更新 `design-tokens.md`
- ❌ 引入新 UI library（如 Element Plus、Ant Design）——本站已有 Bootstrap Vue Next + 自訂 SCSS
- ❌ 在全站 `assets/sass/main.scss` 加元件專屬樣式——請寫在元件 `<style scoped>` 中
- ❌ 使用 legacy `rgba(r, g, b, a)` 語法——統一用 `rgb(r g b / n%)`（見 `.github/copilot-instructions.md`）
