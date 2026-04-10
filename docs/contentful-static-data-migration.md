# Contentful Runtime → Build-Time Static Data 遷移規畫

## 背景與動機

本專案目前已採用方向 1 的安全處理：`CTF_CDA_ACCESS_TOKEN` 透過環境變數注入，不再寫死在 repo 內。但因為 `plugins/contentful.js` 是 client-side plugin，Nuxt 的 `runtimeConfig.public.ctfCdaAccessToken` 仍會把 token inline 進 build 後的 JS bundle，使用者只要打開瀏覽器 devtools 就能看到。

CDA token 屬於「唯讀公開金鑰」類型，官方允許客戶端暴露，但仍有以下顧慮：

1. Bundle 內的 token 無法被真正隱藏，rotate 時必須重新 build + deploy
2. 違反「敏感值不落地於可公開存取資源」的一般安全原則
3. 使用者打開頁面時還會打 Contentful API，增加站外相依與網路延遲
4. Contentful 免費額度是按 API 請求量計算的，runtime fetching 容易耗用

**本文件規畫的方向 2 目標**：將 Contentful 的資料擷取完全移到 build time，瀏覽器只讀打包進 `dist/` 的靜態 JSON，徹底移除 client bundle 內的任何 token 痕跡。

> 本文件為未來工作（future work），不屬於「導入 Copilot 自動修復流程」的必要步驟。實作前請先重新評估站上是否還有依賴 runtime fetching 的功能。

---

## 目標狀態

- **Client bundle 內不含任何 Contentful token**
- **`plugins/contentful.js` 移除**
- **`services/api.js` 改讀本地 JSON**（或對應的 composable / useAsyncData）
- **所有頁面資料來自 `dist/` 內的靜態 JSON**
- **Contentful API 只在 build 時呼叫**，由 `scripts/` 下的腳本統一處理
- **CTF_CDA_ACCESS_TOKEN 只存在於 CI 環境變數 / GitHub Secrets**，真正做到「secret 只活在 build runner 記憶體內」

---

## 設計概要

### 資料產出階段

在現有 `scripts/generateRoutes.mjs` 與 `scripts/generateFeeds.mjs` 的基礎上，新增一個統一的 data snapshot 腳本（暫定 `scripts/generateContentSnapshot.mjs`），負責：

1. 呼叫 Contentful 拉取所有文章（`content_type: post`），**含 `articleContent` 完整內文**
2. 拉取所有 tag 清單
3. 將結果分成以下 JSON 檔寫入 `public/data/`（或其他 Nuxt static assets 目錄）：
   - `public/data/articles-index.json`：文章清單（不含內文，只含 metadata）
   - `public/data/articles/<id>.json`：單篇文章完整內容
   - `public/data/tags.json`：tag 對應文章 id 清單
   - `public/data/years.json`：歸檔年份 + 每年文章清單
   - `public/data/related/<id>.json`：預先計算好的相關文章清單（避免 runtime 計算）
4. 執行時機：`prebuild` 階段，在 `generateRoutes.mjs` 之前或合併執行

> 也可以考慮只輸出一個大型 `content.json` 的極簡方案，但 GitHub Pages 對單一檔案大小沒限制、但每頁載入整包會浪費流量，還是以分檔為主。

### 資料消費階段

- **`services/api.js`**：整個改寫成讀本地 JSON 的 fetch 函式，函式簽章盡量保持相容（`getArticles`、`getArticleById`、`getArticlesWithTag` 等），減少 page 層的改動
  - 讀取方式：`useFetch('/data/articles-index.json')` 或 `import` 靜態 JSON
  - 分頁、tag 過濾、歸檔年月分組等邏輯在 client 用 JS 計算（資料集小，效能不是問題）
- **`plugins/contentful.js`**：刪除
- **`nuxt.config.ts`**：
  - 移除 `runtimeConfig.public.ctfCdaAccessToken`、`CTF_CDA_ACCESS_TOKEN`
  - 移除 `vite.define['process.env']` 內的對應欄位
  - `plugins` 陣列移除 `'~/plugins/contentful.js'`

### Nitro server routes 處理

現有 `server/routes/feed.xml.ts`、`atom.xml.ts`、`feed.json.ts`、`search-index.json.ts` 透過 `server/utils/feeds.ts` 呼叫 Contentful。靜態部署情境下這些路由會被 prerender，實際仍只在 build 時執行，但它們也會讀到 `process.env.CTF_CDA_ACCESS_TOKEN`。

方向 2 實作時，這幾個 server routes 可以改成讀前一步產出的 snapshot JSON，徹底跟 Contentful 脫鉤。或更激進：直接把 feed / search index 的產出全部移到 `scripts/generateFeeds.mjs`，廢掉這幾個 server route。

> 現狀下 `scripts/generateFeeds.mjs` 已經會在 `close` hook 產出 feed，所以 server routes 其實是重複實作。遷移時一併整併是合理的。

---

## 需要變更的檔案

### 新增

- `scripts/generateContentSnapshot.mjs`：統一的資料拉取腳本
- `public/data/`（目錄，執行時產出，可加入 `.gitignore`）
- `composables/useContent.ts`（可選）：封裝讀取本地 JSON 的 composable，取代 `services/api.js`

### 修改

- `services/api.js`：改為讀 `public/data/` 下的 JSON
- `nuxt.config.ts`：移除 Contentful 相關 runtime config 與 plugin
- `package.json`：`prebuild` 改為同時執行 snapshot + routes 產出
- 各 page（`pages/index.vue`、`pages/article/[id].vue`、`pages/tag/[tag]/[[page]].vue`、`pages/archives/index.vue`）：確認資料來源切換後仍運作

### 刪除

- `plugins/contentful.js`
- `server/utils/feeds.ts`（若決定整併）
- `server/routes/feed.xml.ts`、`atom.xml.ts`、`feed.json.ts`、`search-index.json.ts`（若決定整併到 build script）

---

## 風險與注意事項

1. **資料量成長**：若日後文章數量變得很多（數百篇以上），單次 build 拉取完整內文會變慢。可評估增量抓取或 Contentful sync API。
2. **預覽流程**：如果未來想支援 draft preview，純 build-time 方案會失去即時預覽能力。解法是保留一份 preview 專用的 runtime fetcher，但 **只在 dev 環境啟用**（用 `import.meta.dev` 或 `NODE_ENV` gate）。
3. **搜尋功能**：目前 `fuse.js` 搜尋是 client-side fuzzy match，已相容於靜態 JSON 方案，不需改動搜尋邏輯，只要確保搜尋索引從 snapshot 讀取即可。
4. **相關文章計算**：`getRelatedArticles` 目前是 runtime 跑。遷移後有兩種選擇：
   - **預計算**：build 時就算好每篇文章的相關列表，寫入 `public/data/related/<id>.json`（資料量較大但 runtime 零計算）
   - **Runtime 計算**：把 `tags.json` 讀進 client，用 JS 算（省 build 時間與儲存空間，但 client 要跑邏輯）
   - 建議預計算，因為相關文章邏輯不常變，放在 build time 比較乾淨
5. **dist 大小**：假設每篇文章平均 30KB，100 篇約 3MB。GitHub Pages 有 1GB 站點大小限制與 100GB/月頻寬限制，短期內不是問題。
6. **Nuxt 的 `useAsyncData` vs `import`**：靜態 JSON 有兩種載入方式：
   - `import` 時打包進 JS bundle（編譯時決定）→ 適合 metadata 類小檔
   - `useFetch` / `$fetch` 時在 runtime 透過 HTTP 載入 → 適合大檔如單篇文章內容
   - 混合使用：文章列表用 import、單篇文章用 fetch，避免一次載入全部內容

---

## 實作順序建議

1. **先做 snapshot 腳本**：不動現有程式，先讓 `scripts/generateContentSnapshot.mjs` 能正確產出 `public/data/*.json`，可以獨立驗證
2. **改寫一個 page 當 pilot**：選最簡單的 `pages/archives/index.vue`，把資料來源切到本地 JSON，跑起來再繼續下一頁
3. **逐頁遷移**：index → article/[id] → tag → archives
4. **刪除 `plugins/contentful.js`**：所有 page 都不再依賴後，再砍 plugin
5. **清理 `nuxt.config.ts`**：移除 runtime config 與 vite define 內的 token 相關欄位
6. **整併 server routes**：把 feed / search index 的產出統一到 build script，刪掉重複的 server 實作
7. **驗證 client bundle 乾淨**：build 後 `grep -r "<token_value>" dist/`、`grep -r "ctfCdaAccessToken" dist/`，應該完全沒有結果
8. **rotate 一次 token**：確認即使 token 變了，本地 `.env` + CI secret 換掉即可，不需改任何 commit 進 repo 的檔案

---

## 驗收條件

- [ ] `dist/_nuxt/*.js` 內找不到任何 `CTF_CDA_ACCESS_TOKEN` 的值或變數名
- [ ] 開啟 production 站台、打開 DevTools Network 分頁，確認沒有任何對 `cdn.contentful.com` 的請求
- [ ] 刪除本機 `.env` 後，`npm run dev` 或靜態 dist 仍能正常瀏覽既有內容（因為資料已打包）
- [ ] Rotate Contentful token 後，只需更新 GitHub Secret 並重新 run 一次 deploy workflow，無需動任何原始碼
- [ ] RSS / Atom / JSON feed 與 search-index 正常產出且內容正確

---

## 與方向 1 的銜接

方向 1 完成後（目前狀態）：

- `CTF_CDA_ACCESS_TOKEN` 已移出 repo，改由環境變數注入
- Build 時必須提供 token 才能產生 `dist/`
- 但 token 仍會被 inline 進 client bundle

進入方向 2 時，方向 1 的所有變更**都要保留**。方向 2 是在安全基線之上的架構精進，不是取代。

