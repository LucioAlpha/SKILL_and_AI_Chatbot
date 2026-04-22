"""
@module seed
@description 將 fortune_stick.json 匯入 SQLite 資料庫
執行方式：python -m backend.seed
"""
import json
import sys
from pathlib import Path

from backend.database import SessionLocal, engine, Base
from backend.models import Fortune

SEED_FILE = Path(__file__).parent.parent / "fortune_stick.json"


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Fortune).count()
        if existing > 0:
            print(f"[seed] 資料庫已有 {existing} 筆籤詩，略過匯入。")
            return

        with open(SEED_FILE, encoding="utf-8") as f:
            data = json.load(f)

        count = 0
        for item in data:
            fortune = Fortune(
                id=str(item["id"]),
                grade=item.get("type", "吉"),
                poem_zh=item.get("poem", ""),
                meaning_zh=item.get("explain", ""),
                result_json=json.dumps(item.get("result", {}), ensure_ascii=False),
                note=item.get("note"),
            )
            db.add(fortune)
            count += 1

        db.commit()
        print(f"[seed] 成功匯入 {count} 支籤詩。")
    except Exception as e:
        db.rollback()
        print(f"[seed] 匯入失敗：{e}", file=sys.stderr)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
