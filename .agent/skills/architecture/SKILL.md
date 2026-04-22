---
name: architecture
description: 協助撰寫系統架構設計文件（Architecture Design Document）。當使用者需要規劃系統架構、選擇技術棧、設計元件關係、定義 API 介面或繪製架構圖時，使用此技能。
license: Apache-2.0
metadata:
  author: antigravity
  version: "1.0"
---

# 系統架構設計技能（Architecture Design Skill）

## Overview

此技能指導 AI agent 協助使用者撰寫高品質的系統架構設計文件（Architecture Design Document，ADD）。架構設計文件是 SDLC 中銜接 PRD 與實作的關鍵文件，用於定義系統的整體結構、技術選型、元件關係與資料流，確保工程團隊在開發前對系統藍圖達成共識。

## Trigger Conditions & Usage

- **Use when:** 使用者說「幫我設計系統架構」、「技術架構怎麼規劃」、「畫架構圖」、「選擇技術棧」、「設計 API」、「規劃資料庫架構」等。
- **Goal:** 引導使用者完成一份結構完整、可交付開發團隊執行的架構設計文件。

## Instructions

撰寫架構設計文件時，依照以下結構逐步引導使用者完成每個章節：

### 1. 文件基本資訊（Document Metadata）

收集以下欄位：
- **文件標題**：系統或功能名稱
- **版本號**：如 v1.0、v1.1
- **作者 / 負責人**：架構師或技術主管姓名
- **建立日期 / 更新日期**：日期紀錄
- **審核人員**：技術主管、資深工程師、DevOps 等
- **關聯文件**：對應的 PRD 文件連結

### 2. 架構概覽（Architecture Overview）

- **系統簡介**：用一段話描述系統要做什麼
- **架構風格（Architecture Style）**：選擇並說明採用的架構模式，例如：
  - 單體式（Monolithic）
  - 微服務（Microservices）
  - 無伺服器（Serverless）
  - 事件驅動（Event-Driven）
  - 分層架構（Layered / N-Tier）
- **高階架構圖（High-Level Diagram）**：以 Mermaid 或文字描述系統各層之間的關係
  - 建議使用 Mermaid `graph TD` 或 `C4Context` 圖

### 3. 技術選型（Technology Stack）

依系統層次列出技術決策，並說明選擇理由：

| 層次 | 技術選擇 | 選擇理由 |
|------|---------|---------|
| **前端** | (e.g., React, Vue, HTML/CSS/JS) | ... |
| **後端** | (e.g., Node.js, Python FastAPI, Go) | ... |
| **資料庫** | (e.g., PostgreSQL, MongoDB, SQLite) | ... |
| **快取** | (e.g., Redis, In-Memory) | ... |
| **訊息佇列** | (e.g., Kafka, RabbitMQ, 無) | ... |
| **部署平台** | (e.g., Vercel, AWS, GCP, Docker) | ... |
| **CI/CD** | (e.g., GitHub Actions, GitLab CI) | ... |

### 4. 系統元件設計（Component Design）

針對每個主要元件（Component / Module）進行描述：

- **元件名稱**：清楚命名
- **職責（Responsibility）**：此元件負責什麼功能
- **介面（Interface）**：對外暴露的 API 或事件
- **依賴（Dependencies）**：依賴哪些其他元件或服務
- **資料流（Data Flow）**：資料如何流入與流出

> 建議使用 Mermaid `graph LR` 繪製元件關係圖。

### 5. 資料架構（Data Architecture）

- **資料模型（Data Model）**：核心實體（Entity）及其屬性
  - 使用 Mermaid `erDiagram` 繪製 ER 圖
- **資料儲存策略**：
  - 哪些資料存入資料庫、哪些存於快取、哪些存於本地（LocalStorage）
- **資料流向圖**：說明資料從使用者輸入到儲存的完整路徑

### 6. API 設計（API Design）

列出主要 API 端點（若有後端或 REST/GraphQL API）：

| 方法 | 路徑 | 描述 | 請求格式 | 回應格式 |
|------|------|------|---------|---------|
| GET | `/api/v1/fortunes` | 取得所有籤詩清單 | — | `{ data: Fortune[] }` |
| GET | `/api/v1/fortunes/draw` | 隨機抽取一支籤 | `?category=love` | `{ data: Fortune }` |
| POST | `/api/v1/history` | 儲存抽籤紀錄 | `{ userId, fortuneId }` | `{ success: true }` |

- 定義**統一錯誤回應格式**：`{ error: { code, message } }`
- 說明**版本控制策略**：URL 版本號（`/v1/`）或 Header 版本

### 7. 安全性設計（Security Design）

- **身份驗證（Authentication）**：JWT、Session、OAuth 2.0 或無需登入
- **授權（Authorization）**：RBAC（角色存取控制）或 ABAC
- **資料保護**：敏感資料加密策略（傳輸層 TLS、靜態加密）
- **防護措施**：CORS 設定、Rate Limiting、Input Validation、XSS/CSRF 防禦

### 8. 部署架構（Deployment Architecture）

- **環境規劃**：
  - Development → Staging → Production
- **部署方式**：容器化（Docker）、Serverless、靜態部署（CDN）
- **基礎設施圖（Infrastructure Diagram）**：
  - 使用 Mermaid 描述伺服器、CDN、資料庫、網路的關係
- **擴展策略（Scaling Strategy）**：水平擴展 vs. 垂直擴展

### 9. 非功能性考量（Non-Functional Considerations）

| 面向 | 設計決策 |
|------|---------|
| **效能** | 快取策略、資料庫索引、Lazy Loading |
| **可靠性** | 錯誤重試機制、Circuit Breaker、健康檢查 |
| **可觀測性** | 日誌（Logging）、追蹤（Tracing）、監控（Monitoring）工具選擇 |
| **可維護性** | 程式碼分層原則、模組化設計、文件覆蓋率 |
| **可測試性** | 單元測試策略、整合測試設計、Mock 機制 |

### 10. 架構決策紀錄（Architecture Decision Records, ADR）

記錄重要的架構決策，每筆 ADR 包含：
- **決策標題**：如「選擇 localStorage 而非後端 API 儲存抽籤紀錄」
- **背景（Context）**：為什麼需要做這個決策？
- **決策（Decision）**：我們選擇了什麼？
- **理由（Rationale）**：為什麼這樣選？
- **後果（Consequences）**：這個決策帶來什麼取捨？

### 11. 開放問題（Open Questions）

記錄尚未確認的技術決策：
- 待技術驗證的可行性問題
- 需要團隊討論的架構取捨
- 依賴外部服務尚待確認的項目

## Constraints & Guardrails

- 架構設計文件必須包含**第 2、3、4 章節**（架構概覽、技術選型、元件設計）作為最低要求。
- **所有架構圖必須使用 Mermaid 語法**（或文字 ASCII 圖）呈現，確保版本控制可追蹤。
- API 設計必須遵循 **RESTful 慣例**或清楚說明採用的 API 風格（GraphQL、gRPC 等）。
- 技術選型必須附帶**選擇理由**，避免「因為我熟悉」的主觀理由，需從效能、生態系、團隊能力、成本等客觀面向說明。
- 架構決策紀錄（ADR）為強制項目，至少記錄 **3 個關鍵決策**。
- 不要在架構文件中寫具體程式碼實作，那屬於技術設計文件（TDD）或程式碼本身。

## Output Format

完成的架構設計文件應輸出為 Markdown 格式，儲存至專案的 `docs/architecture.md` 或 `docs/ADD.md`。

包含的 Mermaid 圖表類型建議：
- `graph TD` / `graph LR`：元件關係、資料流
- `erDiagram`：資料模型
- `sequenceDiagram`：API 呼叫序列
- `C4Context`（若支援）：系統情境圖

## References

- [架構設計文件範本](./assets/architecture-template.md)（待建立）
- [ADR 撰寫指南](./references/adr-guide.md)（待建立）
- [Mermaid 語法參考](https://mermaid.js.org/syntax/flowchart.html)
