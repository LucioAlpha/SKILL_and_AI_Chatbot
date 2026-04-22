"""
@module schemas
@description Pydantic 請求與回應 Schema 定義
"""
from typing import Optional, Any
from pydantic import BaseModel


# ── Fortune ──────────────────────────────────────────────
class FortuneOut(BaseModel):
    id: str
    grade: str
    poem_zh: str
    meaning_zh: str
    result: dict[str, str]   # result_json 解析後回傳
    note: Optional[str]

    model_config = {"from_attributes": True}


# ── History ───────────────────────────────────────────────
class HistoryCreate(BaseModel):
    fortune_id: str
    category: str            # 使用者選擇的問事項目（願望|疾病|旅行 …）


class HistoryOut(BaseModel):
    id: str
    visitor_id: str
    fortune_id: str
    category: str
    created_at: str
    fortune_grade: str
    fortune_poem: str

    model_config = {"from_attributes": True}


# ── 統一回應包裝 ──────────────────────────────────────────
class ApiResponse(BaseModel):
    success: bool = True
    data: Optional[Any] = None
    error: Optional[dict] = None
