---
name: test
description: 協助根據 PRD 的驗收標準與實作程式碼，生成對應的測試計畫與測試案例。涵蓋單元測試、整合測試、端對端測試（E2E）與手動驗收測試。當使用者需要撰寫測試、驗證功能正確性或確保品質時，使用此技能。
license: Apache-2.0
metadata:
  author: antigravity
  version: "1.0"
---

# 測試驗證技能（Test & Validation Skill）

## Overview

此技能指導 AI agent 協助使用者根據 PRD 驗收標準、架構設計與實作程式碼，產出完整的**測試計畫（Test Plan）**與**測試案例（Test Cases）**。測試是 SDLC 中確保產品品質的最後防線，透過系統化的測試覆蓋功能需求、邊界條件與非功能性需求，確保上線前品質達標。

## Trigger Conditions & Usage

- **Use when:** 使用者說「幫我寫測試」、「生成測試案例」、「驗收怎麼測」、「寫 E2E 測試」、「單元測試怎麼寫」、「測試覆蓋率不足」等。
- **Prerequisites（前置條件）**：
  1. ✅ `docs/PRD.md` — 功能需求與驗收標準（AC）
  2. ✅ `docs/ARCHITECTURE.md` — 技術棧與模組結構
  3. ✅ `docs/MODELS.md` — 資料模型與驗證規則
  4. ✅ 已完成程式碼實作（至少部分功能）
- **Goal:** 產出可執行的測試程式碼與手動驗收測試腳本，確保每條驗收標準（AC）都有對應的測試覆蓋。

## Instructions

### 步驟一：分析測試需求

從 PRD 的驗收標準（Acceptance Criteria）中萃取測試需求：

1. **列出所有 AC 條目**，每條 AC 對應至少一個測試案例
2. **識別測試類型**：
   - 功能是否正確 → 單元測試 / 整合測試
   - 使用者流程是否順暢 → E2E 測試
   - 效能指標是否達標 → 效能測試
   - UI 是否符合設計 → 視覺回歸測試（手動）
3. **識別邊界條件與負面測試**：
   - 空值、null、undefined 輸入
   - 超出範圍的值（如 localStorage 超過 10 筆）
   - 網路失敗、API 錯誤
   - 不支援的瀏覽器功能

### 步驟二：規劃測試層次

依據測試金字塔（Testing Pyramid）規劃各層次的測試比例：

```
        /\
       /E2E\       少量（高成本、高信心）
      /------\
     /整合測試 \    適量
    /----------\
   /  單元測試  \   大量（低成本、快速）
  /--------------\
```

| 測試層次 | 工具 | 目標 | 比例 |
|---------|------|------|------|
| **單元測試** | Jest / Vitest | 測試個別函式與模組邏輯 | ~60% |
| **整合測試** | Jest + DOM API | 測試模組間的互動 | ~30% |
| **E2E 測試** | Playwright | 測試完整使用者流程 | ~10% |
| **手動驗收** | 測試腳本文件 | 確認 AC 與 UX 品質 | 補充 |

### 步驟三：撰寫單元測試

針對每個 Service 模組撰寫單元測試，覆蓋正常路徑與異常路徑：

#### 測試檔案結構規範

```
tests/
├── unit/
│   ├── fortune.test.js
│   ├── history.test.js
│   ├── share.test.js
│   ├── i18n.test.js
│   └── router.test.js
├── integration/
│   ├── draw-flow.test.js
│   └── history-flow.test.js
└── e2e/
    ├── draw-fortune.spec.js
    ├── share-fortune.spec.js
    └── history.spec.js
```

#### 單元測試模板（Jest / Vitest）

```javascript
/**
 * @file fortune.test.js
 * @description FortuneService 單元測試
 */
import { FortuneService } from '../../js/fortune.js';

describe('FortuneService', () => {
  // 測試前置作業
  beforeAll(async () => {
    await FortuneService.load();
  });

  describe('draw(category)', () => {
    // 正常路徑測試
    test('應回傳合法的 Fortune 物件（love 類別）', () => {
      const fortune = FortuneService.draw('love');
      expect(fortune).toBeDefined();
      expect(fortune.id).toMatch(/^fortune_\d{3}$/);
      expect(['上上', '上', '中', '下', '下下']).toContain(fortune.grade);
      expect(fortune.meaning_love).toBeTruthy();
    });

    // 邊界條件測試
    test('應涵蓋所有等級（多次抽籤統計）', () => {
      const grades = new Set();
      for (let i = 0; i < 200; i++) {
        grades.add(FortuneService.draw('career').grade);
      }
      expect(grades.size).toBe(5); // 應出現所有 5 個等級
    });

    // 負面測試
    test('傳入不合法類別時應拋出 Error', () => {
      expect(() => FortuneService.draw('invalid')).toThrow();
    });
  });
});
```

#### 常見測試情境模板

```javascript
// localStorage 測試（需 Mock）
beforeEach(() => {
  localStorage.clear();
  jest.spyOn(Storage.prototype, 'setItem');
  jest.spyOn(Storage.prototype, 'getItem');
});

// fetch 資料載入測試（需 Mock）
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ fortunes: mockFortunes }),
  })
);

// 非同步測試
test('載入籤詩資料應成功', async () => {
  await expect(FortuneService.load()).resolves.not.toThrow();
});

// 網路失敗測試
test('fetch 失敗時應捕捉錯誤', async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('Network Error')));
  await expect(FortuneService.load()).rejects.toThrow('Network Error');
});
```

### 步驟四：撰寫整合測試

測試多個模組協同運作的情境：

```javascript
/**
 * @file draw-flow.test.js
 * @description 完整抽籤流程整合測試
 */
describe('抽籤完整流程', () => {
  test('抽籤後應自動寫入 localStorage 歷史紀錄', async () => {
    // 1. 載入籤詩
    await FortuneService.load();

    // 2. 執行抽籤
    const fortune = FortuneService.draw('health');

    // 3. 儲存紀錄
    HistoryService.save(fortune, 'health');

    // 4. 驗證紀錄已寫入
    const history = HistoryService.getAll();
    expect(history).toHaveLength(1);
    expect(history[0].fortune_id).toBe(fortune.id);
    expect(history[0].category_id).toBe('health');
    expect(history[0].fortune_grade).toBe(fortune.grade);
  });

  test('超過 10 筆紀錄時應自動移除最舊紀錄', () => {
    localStorage.clear();
    // 新增 11 筆
    for (let i = 0; i < 11; i++) {
      const fortune = FortuneService.draw('wealth');
      HistoryService.save(fortune, 'wealth');
    }
    const history = HistoryService.getAll();
    expect(history).toHaveLength(10); // 最多 10 筆
  });
});
```

### 步驟五：撰寫 E2E 測試（Playwright）

```javascript
/**
 * @file draw-fortune.spec.js
 * @description 抽籤完整 E2E 流程測試
 */
import { test, expect } from '@playwright/test';

test.describe('抽籤流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('完整抽籤流程：首頁 → 選類別 → 搖籤 → 查看結果', async ({ page }) => {
    // 1. 首頁
    await expect(page.locator('h1')).toContainText('公廟');

    // 2. 點擊開始求籤
    await page.click('#btn-start');
    await expect(page.locator('#page-category')).toBeVisible();

    // 3. 選擇感情類別
    await page.click('[data-category="love"]');
    await expect(page.locator('#page-shake')).toBeVisible();

    // 4. 點擊搖籤
    await page.click('#btn-shake');

    // 5. 等待動畫結束（最多 5 秒）
    await page.waitForSelector('#page-result', { timeout: 5000 });

    // 6. 驗證結果頁內容
    await expect(page.locator('#fortune-grade')).toBeVisible();
    await expect(page.locator('#fortune-poem')).toBeVisible();
    await expect(page.locator('#fortune-meaning')).toBeVisible();
  });

  test('語言切換：中文 → 英文', async ({ page }) => {
    const langBtn = page.locator('#btn-lang');
    await expect(page.locator('h1')).toContainText('公廟');
    await langBtn.click();
    await expect(page.locator('h1')).toContainText('Temple');
  });

  test('分享功能：複製連結應成功', async ({ page, context }) => {
    // 授予剪貼簿權限
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // 完成抽籤流程
    await page.click('#btn-start');
    await page.click('[data-category="wealth"]');
    await page.click('#btn-shake');
    await page.waitForSelector('#page-result');

    // 點擊複製連結
    await page.click('#btn-copy-link');

    // 驗證剪貼簿內容
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('http');
  });

  test('歷史紀錄：抽籤後應出現在紀錄頁', async ({ page }) => {
    // 完成一次抽籤
    await page.click('#btn-start');
    await page.click('[data-category="career"]');
    await page.click('#btn-shake');
    await page.waitForSelector('#page-result');

    // 前往歷史紀錄頁
    await page.click('#nav-history');
    await expect(page.locator('.history-item')).toHaveCount(1);
  });
});
```

### 步驟六：手動驗收測試腳本

輸出一份**手動測試腳本**，讓 QA 或 PM 可依步驟執行驗收：

#### 格式規範

```markdown
## TC-[編號]：[測試案例名稱]

**對應 AC**：F-01 AC-01
**測試類型**：功能測試 / 邊界測試 / 負面測試
**前置條件**：瀏覽器已開啟網站首頁

| 步驟 | 操作 | 預期結果 | 實際結果 | 狀態 |
|------|------|---------|---------|------|
| 1 | 點擊「開始求籤」按鈕 | 跳轉至類別選擇頁 | | ⬜ |
| 2 | 點擊「感情」類別 | 跳轉至搖籤頁 | | ⬜ |

**測試通過條件**：所有步驟狀態均為 ✅
**備註**：...
```

### 步驟七：測試報告

測試完成後，輸出測試摘要報告：

```markdown
## 測試執行摘要

| 測試層次 | 總計 | 通過 | 失敗 | 略過 | 覆蓋率 |
|---------|------|------|------|------|--------|
| 單元測試 |  45  |  43  |   2  |   0  |  87%   |
| 整合測試 |  12  |  12  |   0  |   0  |  95%   |
| E2E 測試 |   8  |   7  |   1  |   0  |   -    |
| 手動驗收 |  24  |  23  |   0  |   1  |   -    |

### 失敗項目清單

| # | 測試名稱 | 失敗原因 | 對應 Issue |
|---|---------|---------|-----------|
| 1 | share.test.js: FB 分享 URL 格式 | API URL 格式已更新 | #42 |

### 未覆蓋的 AC 條目

- F-02 AC-03（音效測試需手動執行）
- F-05 AC-02（語言切換動畫未自動化）
```

## 測試覆蓋率目標

| 模組 | 目標覆蓋率 | 說明 |
|------|-----------|------|
| `FortuneService` | ≥ 90% | 核心抽籤邏輯，高風險 |
| `HistoryService` | ≥ 90% | localStorage 讀寫邏輯 |
| `I18nService` | ≥ 80% | 語言切換邏輯 |
| `ShareService` | ≥ 70% | 依賴第三方 API，部分需 Mock |
| `AudioService` | ≥ 60% | 瀏覽器 Audio API 難以自動化測試 |
| `Router` | ≥ 85% | 頁面路由邏輯 |

## Constraints & Guardrails

- **每條 AC 必須有對應測試**：PRD 中的每條驗收標準至少有一個自動化或手動測試案例。
- **負面測試為必要項目**：每個模組至少包含一個負面測試（無效輸入、網路失敗、邊界值）。
- **禁止只測試正常路徑**：若測試案例全為正常路徑，視為測試不完整。
- **Mock 必須說明**：使用 `jest.fn()` 或 `jest.spyOn()` 時，必須在測試描述中說明為何 Mock。
- **E2E 測試必須使用真實 DOM**：不可在 E2E 測試中直接呼叫 JS 函式繞過 UI。
- **測試案例命名規範**：`[模組] [情境] [預期結果]`，例如：`HistoryService 儲存超過 10 筆時 應自動移除最舊一筆`。
- **測試資料獨立**：每個測試案例使用 `beforeEach` 清理狀態，不依賴其他測試的執行結果。

## 命名規範

| 項目 | 規範 | 範例 |
|------|------|------|
| 測試檔案 | `[module].test.js`（單元）/ `[flow].spec.js`（E2E） | `fortune.test.js` |
| 測試案例 ID | `TC-[功能]-[編號]` | `TC-F01-001` |
| `describe` 區塊 | 模組名稱或功能名稱 | `describe('FortuneService')` |
| `test/it` 敘述 | 情境 + 預期結果（繁中） | `test('類別為空時應拋出錯誤')` |

## References

- [Jest 官方文件](https://jestjs.io/docs/getting-started)
- [Vitest 官方文件](https://vitest.dev/)
- [Playwright 官方文件](https://playwright.dev/docs/intro)
- [測試金字塔（Martin Fowler）](https://martinfowler.com/articles/practical-test-pyramid.html)
- [手動驗收測試範本](./assets/test-plan-template.md)（待建立）
