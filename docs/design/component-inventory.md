# Component Inventory

本文件列出 `components/` 下既有元件與 `pages/` 下各頁面的用途，供 agent 評估「要新增還是沿用」時查閱。

實作細節請直接閱讀對應 `index.vue`，本文件只提供語意概要。

## components/

| 元件 | 路徑 | 用途 | 主要元素 |
|---|---|---|---|
| ArticleOutline | `components/ArticleOutline/index.vue` | 文章列表項（卡片）— 顯示單篇文章的縮圖、標題、摘要與 meta | 標題、建立日期、tag chip、「繼續閱讀」連結 |
| PageFooter | `components/PageFooter/index.vue` | 全站共用 footer | 版權聲明、社群連結 |
| PageHeader | `components/PageHeader/index.vue` | 全站共用 header | 站名、描述、導覽入口 |
| PageNav | `components/PageNav/index.vue` | 全站共用導覽列與 ScrollTop 按鈕 | 導覽連結、回到頂端按鈕（使用 `$scrolltop-*` 色票） |
| Search | `components/Search/index.vue` | 站內搜尋 UI | 搜尋輸入框、結果列表 |

## pages/

| 頁面 | 路徑 | 用途 |
|---|---|---|
| 首頁 | `pages/index.vue` | 文章列表 + 分頁導覽（tech-section 風格） |
| 分頁 | `pages/page/[page].vue` | 首頁第 N 頁 |
| 文章詳情 | `pages/article/[id].vue` | 單篇文章內容 + 上下篇導覽 + Disqus 留言 |
| Tag 列表 | `pages/tag/[tag]/[[page]].vue` | 依 tag 過濾的文章列表（含分頁） |
| Archives | `pages/archives/index.vue` | 依年月分群的文章清單 |
| About | `pages/about/index.vue` | 自我介紹 |

## 使用原則

- **優先沿用既有元件**：新增 UI 前先檢查此清單，能復用就不新增。例如文章列表項必用 `ArticleOutline`
- **命名規則**：新元件放在 `components/<PascalCase>/index.vue`
- **樣式範圍**：元件樣式一律 `<style scoped lang="scss">`，全域規則才放 `assets/sass/`
- **新增元件需同步更新本文件**，以免後續 agent 重複造輪子
