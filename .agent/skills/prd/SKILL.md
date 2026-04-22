---
name: prd
description: 協助撰寫產品需求文件（PRD，Product Requirements Document）。當使用者需要為新功能或產品建立 PRD、詢問 PRD 應包含哪些內容，或請求產生 PRD 範本時，使用此技能。
license: Apache-2.0
metadata:
  author: antigravity
  version: "1.0"
---

# PRD 產品需求文件技能（Product Requirements Document Skill）

## Overview

此技能指導 AI agent 協助使用者撰寫高品質的產品需求文件（PRD）。PRD 是軟體開發生命週期（SDLC）的核心文件，用於清晰定義產品功能範圍、目標用戶與驗收標準，確保開發團隊、PM 與利害關係人達成共識。

## Trigger Conditions & Usage

- **Use when:** 使用者說「幫我寫 PRD」、「產品需求文件要寫什麼」、「建立需求文件」、「寫功能規格」等。
- **Goal:** 引導使用者完成一份結構完整、可交付執行的 PRD 文件。

## Instructions

撰寫 PRD 時，依照以下結構逐步引導使用者填寫每個章節：

### 1. 文件基本資訊（Document Metadata）

收集以下欄位：
- **文件標題**：產品或功能名稱
- **版本號**：如 v1.0、v1.1
- **作者 / 負責人**：撰寫人員姓名
- **建立日期 / 更新日期**：日期紀錄
- **審核人員**：PM、技術主管、UX 設計師等

### 2. 背景與目標（Background & Objectives）

- **問題陳述**：目前面臨什麼問題或市場機會？
- **產品目標**：這個功能或產品要解決什麼問題？
- **成功指標（KPI / OKR）**：如何衡量成功？（例如：DAU 成長 20%、任務完成率 > 90%）

### 3. 目標用戶（Target Users）

- 定義**用戶角色（Personas）**：描述主要使用者是誰
- 列舉**用戶痛點（Pain Points）**：使用者面臨的困難
- 描述**使用情境（Use Cases / Scenarios）**：使用者在何種情況下使用此功能

### 4. 功能需求（Functional Requirements）

- 撰寫**使用者故事（User Stories）**：
  - 格式：`As a [user], I want to [action], so that [benefit]`
- 列出**功能清單**：每項功能的詳細說明
- 為每項功能定義**驗收標準（Acceptance Criteria）**：明確說明功能完成的判斷條件

### 5. 非功能性需求（Non-Functional Requirements）

涵蓋以下面向：
- **效能**：回應時間、吞吐量、並發用戶數
- **安全性**：身份驗證機制、資料加密標準
- **可靠性**：SLA 目標、容錯機制、備援策略
- **可擴展性**：預期流量成長下的系統擴展能力
- **相容性**：支援的瀏覽器、裝置、作業系統版本

### 6. UX / UI 需求

- 提供**線框稿（Wireframes）**或設計稿的連結 / 附件
- 描述**使用者流程圖（User Flow）**：從進入到離開的完整路徑
- 說明關鍵的**互動行為**：點擊、狀態切換、錯誤處理畫面

### 7. 系統與技術限制（Constraints & Dependencies）

- **技術架構限制**：現有技術棧、框架版本限制
- **第三方服務依賴**：API、外部平台、授權服務
- **與現有系統的整合點**：資料庫、認證系統、其他微服務

### 8. 里程碑與時程（Timeline & Milestones）

- 規劃開發階段：MVP → Phase 2 → GA
- 列出**預計交付日期**
- 定義各階段的**功能範圍（Scope）**

### 9. 範圍外（Out of Scope）

明確列出**不包含**在此版本的功能，避免 Scope Creep（範疇蔓延）。

### 10. 開放問題（Open Questions）

記錄尚未確認的決策項目：
- 待釐清的業務規則
- 需要利害關係人決策的設計問題
- 技術可行性尚待驗證的項目

## Constraints & Guardrails

- 每份 PRD 必須包含**第 2、3、4 章節**（背景、用戶、功能需求）作為最低要求，其他章節視專案規模彈性決定。
- 功能需求必須搭配**驗收標準**，避免模糊的描述（如「系統要快」→ 改為「API 回應時間 < 200ms，P95」）。
- 「Out of Scope」章節為強制項目，以防止需求無限擴張。
- 不要在 PRD 中包含具體的實作細節或程式碼，那屬於技術設計文件（TDD）的範疇。

## References

- [PRD 標準範本](./assets/prd-template.md)（待建立）
- [使用者故事撰寫指南](./references/user-story-guide.md)（待建立）
