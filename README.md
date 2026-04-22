# 作業：設計 Skill + 打造 AI 應用程式

> **繳交方式**：將你的 GitHub repo 網址貼到作業繳交區  
> **作業性質**：個人作業

---

## 作業目標

使用 Antigravity Skill 引導 AI，完成一個具備前後端的 Web 應用程式（本專案為「公廟線上抽運勢籤網站」）。  
重點不只是「讓程式跑起來」，而是透過設計 Skill，學會用結構化的方式與 AI 協作完成完整 SDLC 流程。

---

## 繳交項目

你的 GitHub repo 需要包含以下內容：

### 1. Skill 設計（`.agent/skills/`）

為以下五個開發階段各設計一個 SKILL.md：

| 資料夾名稱        | 對應指令          | 說明                                                                      |
| ----------------- | ----------------- | ------------------------------------------------------------------------- |
| `prd/`          | `/prd`          | 產出 `docs/PRD.md`                                                      |
| `architecture/` | `/architecture` | 產出 `docs/ARCHITECTURE.md`                                             |
| `models/`       | `/models`       | 產出 `docs/MODELS.md`                                                   |
| `implement/`    | `/implement`    | 產出程式碼（HTML 前端 + FastAPI + SQLite 後端）                         |
| `test/`         | `/test`         | 產出手動測試清單                                                          |

### 2. 開發文件（`docs/`）

用你設計的 Skill 產出的文件，需包含：

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/MODELS.md`

### 3. 程式碼

一個可執行的 Web 應用程式，本專案實作功能如下：

| 功能             | 說明                                           | 是否完成 |
| ---------------- | ---------------------------------------------- | -------- |
| 求籤類別選擇     | 首頁提供感情、事業、健康、財運四種類別         | ✅       |
| 虛擬搖籤動畫     | 點擊搖籤按鈕觸發 2–4 秒搖籤動畫               | ✅       |
| 籤詩顯示         | 顯示籤號、籤詩原文及白話文解析                 | ✅       |
| 多語言支援       | 繁體中文 / English 即時切換（i18n）            | ✅       |
| 抽籤歷史紀錄     | 透過 UUID 識別訪客，歷史紀錄持久化存入 SQLite  | ✅       |
| 籤詩分享         | 提供複製連結與社群分享功能                     | ✅       |
| FastAPI 後端     | RESTful API 提供抽籤與歷史管理端點             | ✅       |
| SQLite 資料庫    | 儲存 100 筆籤詩資料與訪客抽籤紀錄              | ✅       |

### 4. 系統截圖（screenshots/）
在 screenshots/ 資料夾放入截圖

![](screenshots/首頁.png)

![](screenshots/抽籤.png)

![](screenshots/歷史紀錄.png)

### 5. 心得報告（本 README.md 下方）

在本 README 的**心得報告**區填寫。

---

## 專案結構

```
w9_sdlc_skill/
├── .agent/
│   └── skills/
│       ├── prd/SKILL.md          # /prd 指令：產出 PRD 文件
│       ├── architecture/SKILL.md # /architecture 指令：產出架構文件
│       ├── models/SKILL.md       # /models 指令：產出資料模型文件
│       ├── implement/SKILL.md    # /implement 指令：產出程式碼
│       ├── test/SKILL.md         # /test 指令：產出測試計畫
│       └── others/               # 其他輔助 Skill
├── docs/
│   ├── PRD.md                    # 產品需求文件
│   ├── ARCHITECTURE.md           # 系統架構設計
│   └── MODELS.md                 # 資料模型定義
├── backend/
│   ├── main.py                   # FastAPI 進入點，同時 serve 前端靜態檔案
│   ├── database.py               # SQLAlchemy 資料庫連線設定
│   ├── models.py                 # ORM 資料表模型
│   ├── schemas.py                # Pydantic 請求/回應 Schema
│   ├── crud.py                   # 資料庫 CRUD 操作
│   ├── seed.py                   # 籤詩資料匯入腳本
│   ├── requirements.txt          # Python 套件清單
│   └── routers/
│       ├── fortunes.py           # /api/fortunes 抽籤端點
│       └── history.py            # /api/history  歷史紀錄端點
├── frontend/
│   ├── index.html                # 單頁應用程式入口
│   ├── css/
│   │   ├── main.css              # 主要樣式（廟宇主題）
│   │   ├── theme.css             # CSS 變數 / 設計 Token
│   │   └── animations.css        # 搖籤動畫與過場效果
│   ├── js/
│   │   ├── app.js                # 主應用邏輯
│   │   ├── api.js                # API 客戶端（fetch 封裝）
│   │   ├── i18n.js               # 多語言服務
│   │   ├── router.js             # 前端頁面路由
│   │   └── share.js              # 社群分享功能
│   └── locales/
│       ├── zh.json               # 繁體中文語系
│       └── en.json               # 英文語系
├── fortune.db                    # SQLite 資料庫（執行後自動產生）
├── fortune_stick.json            # 籤詩原始資料（100 筆）
└── README.md                     # 本檔案（含心得報告）
```

---

## 技術棧

| 層級         | 技術                                      |
| ------------ | ----------------------------------------- |
| **前端**     | HTML5 + Vanilla CSS + Vanilla JavaScript  |
| **後端**     | Python 3.11 + FastAPI + Uvicorn           |
| **資料庫**   | SQLite（透過 SQLAlchemy ORM 操作）        |
| **API 文件** | Swagger UI（自動產生，`/docs`）           |
| **多語言**   | 自製 i18n 模組（`frontend/js/i18n.js`）   |
| **AI 協作**  | Antigravity + Skill-driven SDLC           |

---

## API 端點

| 方法   | 路徑                        | 說明                                     |
| ------ | --------------------------- | ---------------------------------------- |
| `GET`  | `/api/fortunes/draw`        | 依類別隨機抽取一支籤，並寫入歷史紀錄     |
| `GET`  | `/api/history/{visitor_id}` | 查詢指定訪客的抽籤歷史（最近 10 筆）     |
| `DELETE` | `/api/history/{visitor_id}` | 清除指定訪客的所有歷史紀錄             |

> 互動式 API 文件請在啟動後瀏覽 `http://localhost:8000/docs`

---

## 啟動方式

```bash
# 1. 建立虛擬環境
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# 2. 安裝套件
pip install -r backend/requirements.txt

# 3. 匯入籤詩資料（首次啟動前執行一次）
python -m backend.seed

# 4. 啟動伺服器
uvicorn backend.main:app --reload

# 5. 開啟瀏覽器
# http://localhost:8000
```

---

## 心得報告

**姓名**：黃柏豪
**學號**：D1249756

### 問題與反思

**Q1. 你設計的哪一個 Skill 效果最好？為什麼？哪一個效果最差？你認為原因是什麼？**

> 我認為規劃階段中 (/PRD) 的 skill 效果最好，它能很好的模擬出需求分析、軟體工程的思考模式，一步步拆解問題。也能很好的將複雜的規格，拆解成詳細的步驟，供後續階段使用。

> 不僅如此，對於一般資訊工程學系的學生來說，生成的 PRD 就像一門標準且規範的問題集，能很好的引導學生透過一步步實作小功能並像是樂高一樣組裝成完整的專案。

> 測試階段 (/test) 的 skill 效果最差，在驗證邏輯與灰箱測試中，我已先讓 Agent 先行使用 /test/SKILL 掃描測試漏洞。但在實際上手操作後，我能輕易發現 SKILL 未能考慮到的使用者操作路徑，並且從中找出邏輯漏洞。

> 例如: 抽籤後的結果應保留時間戳記並記錄於 .db 檔案之中、使用者可透過點選重新抽籤的按鈕再次對該領域問題重新抽籤、使用者可透過點選網站首頁標籤的方式重新選擇想問的問題面向。

> 而當我回顧 SKILL.md 的內容時，我發現它雖然有把該路徑設計進去，卻沒有落實相關檢查部分。因此我認為Agent 在針對複雜專案下的細節實作與邏輯驗證可能存在疏失，有待加強。

---

**Q2. 在用 AI 產生程式碼的過程中，你遇到什麼問題是 AI 沒辦法自己解決、需要你介入處理的？**

> AI 產生程式碼的過程中，在 Push 到 GitHub Repository 的時候，並未 Push 到我指定的 Repository，而是產出一個新的 Repository，這還是在我已經於 Prompt 中提供了該 Repository HTTP 連結的情況下。

> 為此，我仍得自行手動設定 git remote 的設定，並於 Terminal 中執行 git push 的指令，才成功將程式碼 Push 到正確的 Repository。
