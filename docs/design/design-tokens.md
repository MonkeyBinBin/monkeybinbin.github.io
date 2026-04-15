# Design Tokens

Design tokens 的 **唯一實作來源**是 [`assets/sass/helpers/_variables.scss`](../../assets/sass/helpers/_variables.scss)。
本文件為人類可讀的對照表，agent 改動視覺前須先核對。

## 色彩

### 品牌色

| 角色 | SCSS 變數 | 值 | 用途 |
|---|---|---|---|
| 主色 | `$primary-color` | `#1dc8cd` | 連結、強調、ScrollTop 漸層起點 |
| 輔色 | `$secondary-color` | `color.adjust($primary-color, $saturation: 25%, $lightness: 50%)` | 次要強調 |
| 第三色 | `$tertiary-color` | `#1de099` | ScrollTop 漸層中段、輔助視覺 |
| 標記主色 | `$marked-primary-color` | `#c91414` | 錯誤、warning、重點文字 |
| 標記輔色 | `$marked-secondary-color` | 由 `$marked-primary-color` 調整飽和度與亮度 | 次要 warning |

### ScrollTop Button 專用色票

由 `$primary-color` / `$tertiary-color` 衍生，僅用於 `components/PageNav/` 的回到頂端按鈕。
若要用於其他元件請先評估是否應抽成通用 token：

- `$scrolltop-gradient-start` / `$scrolltop-gradient-middle` / `$scrolltop-gradient-end`
- `$scrolltop-shadow-primary` / `$scrolltop-shadow-secondary`（預設、hover、active 三組）
- `$scrolltop-text-color`（`#fff`）
- `$scrolltop-inner-highlight` / `$scrolltop-inner-highlight-hover`

### 中性色

目前沿用 Bootstrap 預設（透過 `bootstrap/dist/css/bootstrap.min.css` 載入）。
若需自定中性色階，應於 `_variables.scss` 新增後於此文件同步登記。

## 字體

| 類別 | 來源 | 備註 |
|---|---|---|
| body / heading | 瀏覽器預設 + Bootstrap 5 stack | 尚未自定 font-family |
| 程式碼 | `highlight.js/styles/vs.css` | VS 風格的 code block |
| 圖示 | FontAwesome SVG core | 透過 `plugins/font-awesome.js` 註冊 |

## 字級階層

實作分散於各元件 scoped style，下表列出目前實際使用的主要字級（以 rem 為主、部分為 px）：

| 角色 | 常見值 | 出現位置 |
|---|---|---|
| 頁面大標 | `clamp(2rem, 5vw, 3.5rem)` | 首頁 tech-title |
| h1 / 區塊標題 | `1.75rem` / `1.5rem`（≤768px） | `pages/index.vue`、`pages/archives/` |
| h2 | `1.25rem`–`1.5rem` | 文章內標題 |
| body | `0.95rem`–`1rem` | 內文 |
| caption / meta | `0.8rem`–`0.875rem` / `12–14px` | 日期、標籤、分頁 |
| 按鈕 | `0.75rem`–`0.875rem` | 分頁、tag chip |

新增 UI 時請優先沿用上述值；若需要新的字級，應在 `_variables.scss` 建立語意命名變數（如 `$font-size-hero`）後再引用。

## 間距 scale

目前採用「直接寫 px / rem」的風格，尚未抽 token。實務常見值：

| 語意 | 常見值 |
|---|---|
| tight | `4px`、`0.5rem` |
| default | `8px`、`1rem` |
| comfortable | `16px`、`1.25rem`–`1.5rem` |
| loose | `20px`–`24px`、`2rem` |

**建議**：agent 若發現需要第 N 種間距值，應優先復用上表既有值，避免每個元件各自發明新的 spacing。

## 斷點

採用 CSS range syntax（`@media (width <= 768px)`），目前使用的斷點：

| 斷點 | CSS | 對象 |
|---|---|---|
| mobile | `width <= 480px` | 小螢幕手機 |
| tablet / small | `width <= 768px` | 平板與一般手機 |
| desktop | `width > 768px`（預設） | 桌面 |

Bootstrap 預設斷點（`576 / 768 / 992 / 1200 / 1400`）在引用 Bootstrap 類別時仍可使用，但**自訂 SCSS 請統一使用 480 / 768** 與專案既有慣例一致。

## 圓角與陰影

目前未統一 token 化。常見實作：

- 按鈕 / chip：`border-radius: 4px` 或 `999px`（pill）
- 陰影：主要出現在 ScrollTop button（見上方色票）

新增陰影請避免直接寫死 `rgba(...)`，改用 `rgb(... / n%)` 語法以符合 stylelint。

## z-index

透過 `_functions.scss` 提供 `z($layer)` 函式查詢 `$z-layers` map。目前 map 本身尚未在 `_variables.scss` 宣告（TODO：若需要 z-index 管理應先建立 `$z-layers`）。

## 新增 token 流程

1. 在 `assets/sass/helpers/_variables.scss` 新增變數，命名以 `$語意-修飾` 為主（例：`$card-padding-default`）
2. 在本文件對應小節新增一列說明
3. 引用處改用變數，不要留下原始 hex / rem 值
