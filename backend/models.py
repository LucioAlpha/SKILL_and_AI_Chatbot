"""
@module models
@description SQLAlchemy ORM 資料表模型定義
"""
import json
from sqlalchemy import Column, String, Integer, Text, ForeignKey
from backend.database import Base


class Fortune(Base):
    """籤詩資料表"""
    __tablename__ = "fortunes"

    id         = Column(String(10), primary_key=True, index=True)  # "1", "2", ...
    grade      = Column(String(10), nullable=False)   # 大吉|吉|小吉|兇|大兇 等
    poem_zh    = Column(Text, nullable=False)          # 籤詩原文
    meaning_zh = Column(Text, nullable=False)          # explain 白話解釋
    result_json = Column(Text, nullable=False)         # result dict → JSON 字串
    note       = Column(Text, nullable=True)           # 備注


class HistoryRecord(Base):
    """抽籤歷史紀錄資料表"""
    __tablename__ = "history_records"

    id            = Column(String(36), primary_key=True)   # UUID v4
    visitor_id    = Column(String(36), nullable=False, index=True)  # 匿名訪客 UUID
    fortune_id    = Column(String(10), ForeignKey("fortunes.id"), nullable=False)
    category      = Column(String(20), nullable=False)     # 願望|疾病|旅行 …
    created_at    = Column(String(32), nullable=False)     # ISO 8601
    fortune_grade = Column(String(10), nullable=False)     # 快照
    fortune_poem  = Column(Text, nullable=False)           # 快照（前 40 字）
