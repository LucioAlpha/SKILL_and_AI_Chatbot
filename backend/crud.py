"""
@module crud
@description 資料庫 CRUD 操作封裝
"""
import json
import random
import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session
from backend import models, schemas

MAX_HISTORY_PER_VISITOR = 10


# ── Fortune ──────────────────────────────────────────────

def get_all_fortunes(db: Session) -> list[models.Fortune]:
    return db.query(models.Fortune).all()


def get_fortune_by_id(db: Session, fortune_id: str) -> models.Fortune | None:
    return db.query(models.Fortune).filter(models.Fortune.id == fortune_id).first()


def draw_fortune(db: Session) -> models.Fortune:
    """隨機抽取一支籤詩"""
    fortunes = db.query(models.Fortune).all()
    if not fortunes:
        raise ValueError("籤詩資料庫為空，請先執行 seed.py")
    return random.choice(fortunes)


def fortune_to_schema(fortune: models.Fortune) -> schemas.FortuneOut:
    """ORM → Pydantic Schema，解析 result_json"""
    return schemas.FortuneOut(
        id=fortune.id,
        grade=fortune.grade,
        poem_zh=fortune.poem_zh,
        meaning_zh=fortune.meaning_zh,
        result=json.loads(fortune.result_json),
        note=fortune.note,
    )


# ── History ───────────────────────────────────────────────

def get_history_by_visitor(db: Session, visitor_id: str) -> list[models.HistoryRecord]:
    """取得特定訪客最近 10 筆紀錄（倒序）"""
    return (
        db.query(models.HistoryRecord)
        .filter(models.HistoryRecord.visitor_id == visitor_id)
        .order_by(models.HistoryRecord.created_at.desc())
        .limit(MAX_HISTORY_PER_VISITOR)
        .all()
    )


def create_history(
    db: Session,
    visitor_id: str,
    payload: schemas.HistoryCreate,
) -> models.HistoryRecord:
    """新增抽籤紀錄，超過上限時自動刪除最舊一筆"""
    fortune = get_fortune_by_id(db, payload.fortune_id)
    if not fortune:
        raise ValueError(f"籤詩不存在：{payload.fortune_id}")

    # 超過上限時移除最舊紀錄
    existing = (
        db.query(models.HistoryRecord)
        .filter(models.HistoryRecord.visitor_id == visitor_id)
        .order_by(models.HistoryRecord.created_at.asc())
        .all()
    )
    if len(existing) >= MAX_HISTORY_PER_VISITOR:
        db.delete(existing[0])

    record = models.HistoryRecord(
        id=str(uuid.uuid4()),
        visitor_id=visitor_id,
        fortune_id=fortune.id,
        category=payload.category,
        created_at=datetime.now(timezone.utc).isoformat(),
        fortune_grade=fortune.grade,
        fortune_poem=fortune.poem_zh[:40],
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def clear_history(db: Session, visitor_id: str) -> int:
    """清除特定訪客的所有紀錄，回傳刪除筆數"""
    deleted = (
        db.query(models.HistoryRecord)
        .filter(models.HistoryRecord.visitor_id == visitor_id)
        .delete()
    )
    db.commit()
    return deleted
