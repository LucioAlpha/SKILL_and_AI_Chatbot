"""
@module main
@description FastAPI 應用程式進入點，同時 serve 前端靜態檔案
"""
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.database import engine, Base
from backend.routers import fortunes, history

# 建立所有資料表（若不存在）
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="公廟線上抽運勢籤 API",
    description="提供籤詩抽取與歷史紀錄管理功能",
    version="1.0.0",
)

# ── API 路由 ──────────────────────────────────────────────
app.include_router(fortunes.router)
app.include_router(history.router)

# ── 前端靜態檔案 ──────────────────────────────────────────
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"

if FRONTEND_DIR.exists():
    # 掛載靜態資源（css、js、locales）
    app.mount("/css", StaticFiles(directory=FRONTEND_DIR / "css"), name="css")
    app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")
    app.mount("/locales", StaticFiles(directory=FRONTEND_DIR / "locales"), name="locales")

    @app.get("/", include_in_schema=False)
    async def serve_index():
        """Serve 前端首頁"""
        return FileResponse(FRONTEND_DIR / "index.html")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        """所有非 API 路徑均回傳 index.html（SPA fallback）"""
        index = FRONTEND_DIR / "index.html"
        return FileResponse(index)
