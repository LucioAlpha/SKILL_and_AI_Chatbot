"""
@module routers.fortunes
@description 籤詩相關 API 路由
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend import crud, schemas

router = APIRouter(prefix="/api/fortunes", tags=["fortunes"])


@router.get("", response_model=schemas.ApiResponse)
def list_fortunes(db: Session = Depends(get_db)):
    """取得所有籤詩清單"""
    fortunes = crud.get_all_fortunes(db)
    return {"success": True, "data": [crud.fortune_to_schema(f) for f in fortunes]}


@router.get("/draw", response_model=schemas.ApiResponse)
def draw_fortune(db: Session = Depends(get_db)):
    """隨機抽取一支籤詩"""
    try:
        fortune = crud.draw_fortune(db)
        return {"success": True, "data": crud.fortune_to_schema(fortune)}
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{fortune_id}", response_model=schemas.ApiResponse)
def get_fortune(fortune_id: str, db: Session = Depends(get_db)):
    """取得單支籤詩"""
    fortune = crud.get_fortune_by_id(db, fortune_id)
    if not fortune:
        raise HTTPException(status_code=404, detail="籤詩不存在")
    return {"success": True, "data": crud.fortune_to_schema(fortune)}
