"""
@module routers.history
@description 抽籤歷史紀錄相關 API 路由
"""
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from backend.database import get_db
from backend import crud, schemas

router = APIRouter(prefix="/api/history", tags=["history"])

VISITOR_HEADER = "X-Visitor-Id"


def _get_visitor_id(x_visitor_id: Optional[str] = Header(None)) -> str:
    """從 Header 取得訪客 UUID，若未提供則回傳 400"""
    if not x_visitor_id:
        raise HTTPException(
            status_code=400,
            detail=f"缺少必要 Header：{VISITOR_HEADER}"
        )
    return x_visitor_id


@router.get("", response_model=schemas.ApiResponse)
def get_history(
    visitor_id: str = Depends(_get_visitor_id),
    db: Session = Depends(get_db),
):
    """取得當前訪客最近 10 筆抽籤紀錄"""
    records = crud.get_history_by_visitor(db, visitor_id)
    # ✅ 修正：明確轉換 ORM 物件為 Pydantic Schema（ApiResponse.data 為 Any，不會自動序列化）
    return {"success": True, "data": [schemas.HistoryOut.model_validate(r) for r in records]}


@router.post("", response_model=schemas.ApiResponse)
def add_history(
    payload: schemas.HistoryCreate,
    visitor_id: str = Depends(_get_visitor_id),
    db: Session = Depends(get_db),
):
    """新增一筆抽籤紀錄"""
    try:
        record = crud.create_history(db, visitor_id, payload)
        # ✅ 修正：明確轉換 ORM 物件為 Pydantic Schema
        return {"success": True, "data": schemas.HistoryOut.model_validate(record)}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("", response_model=schemas.ApiResponse)
def clear_history(
    visitor_id: str = Depends(_get_visitor_id),
    db: Session = Depends(get_db),
):
    """清除當前訪客所有抽籤紀錄"""
    deleted = crud.clear_history(db, visitor_id)
    return {"success": True, "data": {"deleted": deleted}}
