---
name: implement
description: 協助根據 PRD、架構設計文件與資料模型，生成對應的程式碼實作。涵蓋專案結構初始化、模組程式碼生成、資料檔案建立、UI 元件實作等。當使用者需要將設計文件轉換為可執行程式碼時，使用此技能。
license: Apache-2.0
metadata:
  author: antigravity
  version: "1.0"
---

# 程式碼實作技能（Code Implementation Skill）

## Overview

此技能指導 AI agent 根據已完成的 PRD、架構設計文件（ARCHITECTURE.md）與資料模型（MODELS.md），產出結構完整、可直接執行的程式碼。實作階段是 SDLC 中將設計藍圖轉化為真實產品的關鍵步驟，強調**可讀性、模組化與可維護性**。

## Trigger Conditions & Usage

- **Use when:** 使用者說「幫我生成程式碼」、「根據文件實作功能」、「產生專案結構」、「寫這個模組的程式碼」、「實作這個功能」等。
- **Prerequisites（前置條件）**：執行此技能前，應已完成：
  1. ✅ `docs/PRD.md` — 功能需求與驗收標準
  2. ✅ `docs/ARCHITECTURE.md` — 系統架構與技術選型
  3. ✅ `docs/MODELS.md` — 資料模型與 JSON Schema
- **Goal:** 依據設計文件產出可執行、結構清晰的程式碼，並確保每個模組有對應的說明註解。

## Instructions

### 步驟一：確認技術棧與專案結構

在生成任何程式碼前，先從 `ARCHITECTURE.md` 確認：

1. **技術棧**：前端框架（原生 JS / React / Vue）、樣式方案（CSS / Tailwind）
2. **專案目錄結構**：依架構文件定義的資料夾配置建立檔案
3. **命名慣例**：檔案名稱（`kebab-case`）、函式名稱（`camelCase`）、常數（`UPPER_SNAKE_CASE`）
4. **模組載入方式**：ES Module（`import/export`）或傳統 Script 標籤

輸出專案目錄樹，讓使用者確認後再開始生成程式碼：

```
project/
├── index.html
├── css/
│   ├── main.css
│   └── animations.css
├── js/
│   ├── app.js
│   └── modules/
│       ├── router.js
│       └── fortune.js
├── data/
│   └── fortunes.json
└── locales/
    ├── zh.json
    └── en.json
```

### 步驟二：依優先順序實作模組

依照以下順序生成程式碼，確保依賴關係正確：

```
1. 資料層（Data）    → fortunes.json、locales/*.json
2. 服務層（Service）→ 各 *Service.js 模組（無 UI 依賴）
3. 路由層（Router）  → router.js
4. 展示層（UI）      → HTML 結構、CSS 樣式
5. 整合層（App）     → app.js 主程式進入點
```

### 步驟三：每個模組的生成規範

生成每份程式碼時，必須遵守以下規範：

#### 3.1 檔案標頭註解

每個 JS 檔案開頭必須包含：

```javascript
/**
 * @module ModuleName
 * @description 模組功能說明
 * @dependencies 依賴的模組或外部服務
 * @author [作者]
 * @version 1.0.0
 */
```

#### 3.2 函式文件註解（JSDoc）

每個公開函式必須有 JSDoc：

```javascript
/**
 * 依類別隨機抽取一支籤詩
 * @param {string} category - 問事類別 ('love'|'career'|'health'|'wealth')
 * @returns {Fortune} 抽取到的籤詩物件
 * @throws {Error} 若類別不合法或籤詩庫未載入
 */
function draw(category) { ... }
```

#### 3.3 錯誤處理

- 所有非同步操作（`fetch`、`localStorage`）必須有 `try/catch`
- 錯誤訊息需為中文，方便用戶理解
- UI 層需有友善的降級顯示（Fallback UI）

```javascript
try {
  const data = await fetch('/data/fortunes.json');
  return await data.json();
} catch (error) {
  console.error('[FortuneService] 籤詩資料載入失敗:', error);
  showErrorMessage('資料載入失敗，請重新整理頁面');
}
```

#### 3.4 常數定義

硬編碼值（Magic Numbers/Strings）必須提取為具名常數：

```javascript
// ❌ 不好的寫法
if (history.length > 10) { ... }

// ✅ 好的寫法
const MAX_HISTORY_RECORDS = 10;
if (history.length > MAX_HISTORY_RECORDS) { ... }
```

#### 3.5 模組封裝模式

使用 **模組模式（Module Pattern）** 或 **ES Module** 封裝，避免污染全域命名空間：

```javascript
// ES Module 風格（推薦）
export const FortuneService = {
  async load() { ... },
  draw(category) { ... },
};

// 或 IIFE 模組模式（相容舊瀏覽器）
const FortuneService = (() => {
  let _cache = null;
  return {
    async load() { ... },
    draw(category) { ... },
  };
})();
```

### 步驟四：HTML 實作規範

#### 4.1 語意化結構

```html
<!-- ✅ 使用語意化標籤 -->
<main id="app">
  <section id="page-home" class="page" aria-label="首頁">...</section>
  <section id="page-category" class="page hidden" aria-label="選擇類別">...</section>
</main>

<!-- ❌ 避免純 div 堆疊 -->
<div id="app">
  <div id="home">...</div>
</div>
```

#### 4.2 無障礙屬性

- 所有互動元素需有 `aria-label` 或可見文字
- 圖示需有 `alt` 屬性或 `aria-hidden="true"`（裝飾性圖示）
- 按鈕需有 `type` 屬性（`button` / `submit`）

#### 4.3 SEO 基本設定

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="...">
  <title>公廟線上求籤 | 運勢指引</title>
  <!-- Open Graph for social sharing -->
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:image" content="...">
</head>
```

### 步驟五：CSS 實作規範

#### 5.1 CSS 自訂屬性（Design Tokens）

所有顏色、字型、間距必須定義為 CSS 變數：

```css
:root {
  /* 顏色 */
  --color-primary: #8B0000;      /* 廟宇深紅 */
  --color-gold: #C9A84C;         /* 金色 */
  --color-bg: #1A0A00;           /* 深棕背景 */
  --color-text: #F5E6C8;         /* 米色文字 */

  /* 字型 */
  --font-heading: 'Noto Serif TC', serif;
  --font-body: 'Noto Sans TC', sans-serif;

  /* 間距 */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;

  /* 動畫 */
  --duration-fast: 200ms;
  --duration-normal: 400ms;
  --duration-slow: 800ms;
  --easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### 5.2 動畫規範

```css
/* 尊重使用者的動畫偏好設定 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* 搖籤動畫：使用 CSS Keyframes 確保 GPU 加速 */
@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}
```

#### 5.3 RWD 斷點

```css
/* Mobile First */
/* 預設：手機（< 768px） */

/* 平板 */
@media (min-width: 768px) { ... }

/* 桌面 */
@media (min-width: 1024px) { ... }
```

### 步驟六：資料檔案生成規範

#### 6.1 fortunes.json 生成

依照 `MODELS.md` 中的 JSON Schema 生成完整 60 筆籤詩資料：

- 等級分布：上上 12 筆、上 12 筆、中 12 筆、下 12 筆、下下 12 筆
- 每筆必須通過 JSON Schema 驗證
- 籤詩內容需具備文化真實性（引用傳統卦象或通用籤語）

#### 6.2 locales/*.json 生成

依照 `MODELS.md` 中的 I18N_ENTRY 結構生成完整語言包，確保中英文 key 完全對應。

### 步驟七：驗收清單

生成程式碼後，逐項確認以下驗收條件：

#### 功能驗收
- [ ] 四個類別均可正常選擇並進入搖籤頁
- [ ] 搖籤動畫持續 2–4 秒後顯示結果
- [ ] 籤詩結果頁顯示籤號、等級、原文、白話解釋
- [ ] LINE / Facebook 分享連結可正常開啟
- [ ] 語言切換後全頁文字即時更新
- [ ] 歷史紀錄最多保留 10 筆，超出自動移除最舊紀錄
- [ ] 清除紀錄功能正常運作

#### 技術驗收
- [ ] 所有 JS 模組有 JSDoc 註解
- [ ] 所有非同步操作有錯誤處理
- [ ] CSS 顏色與字型使用 CSS 變數
- [ ] 動畫支援 `prefers-reduced-motion`
- [ ] HTML 使用語意化標籤與 `aria-label`
- [ ] `fortunes.json` 共 60 筆，五等級各 12 筆
- [ ] 網頁在 Chrome / Safari / Firefox 最新版正常顯示

#### 效能驗收
- [ ] Lighthouse Performance 分數 ≥ 90
- [ ] LCP < 2.5 秒
- [ ] 首屏無阻塞渲染資源

## Constraints & Guardrails

- **不生成後端程式碼**：本系統為純前端靜態網站，禁止生成 Node.js 伺服器、資料庫連線等後端程式碼（除非架構文件明確指定）。
- **不使用未在架構中定義的第三方套件**：若需新增套件，必須先更新 `ARCHITECTURE.md`。
- **程式碼必須可直接執行**：不生成含有佔位符（`// TODO: implement this`）的骨架程式碼，每個函式都必須有實際實作。
- **資料與程式碼分離**：所有業務資料（籤詩、語言包）存放於 JSON 檔案，不硬編碼於 JS 中。
- **每次只生成一個模組**：避免一次生成過多程式碼導致品質下降，依模組優先順序逐一實作。
- **生成後必須執行驗收清單**：每完成一個模組，確認該模組的驗收條件均已達成。

## 生成順序建議（Recommended Order）

```
Phase 1（資料層）
  ├── data/fortunes.json       ← 60 筆籤詩資料
  ├── locales/zh.json          ← 繁體中文語言包
  └── locales/en.json          ← 英文語言包

Phase 2（樣式層）
  ├── css/theme.css            ← CSS 變數（Design Tokens）
  ├── css/main.css             ← 全域樣式、Layout
  └── css/animations.css       ← 動畫樣式

Phase 3（服務層）
  ├── js/fortune.js            ← FortuneService
  ├── js/history.js            ← HistoryService
  ├── js/share.js              ← ShareService
  ├── js/i18n.js               ← I18nService
  └── js/audio.js              ← AudioService

Phase 4（應用層）
  ├── js/router.js             ← Hash Router
  └── js/app.js                ← 主程式進入點

Phase 5（展示層）
  └── index.html               ← 單頁應用 HTML 結構
```

## References

- [PRD.md](../../docs/PRD.md)
- [ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
- [MODELS.md](../../docs/MODELS.md)
- [MDN Web Docs - JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [JSDoc 官方文件](https://jsdoc.app/)
- [JSON Schema Draft 7](https://json-schema.org/specification-links.html#draft-7)
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/)
