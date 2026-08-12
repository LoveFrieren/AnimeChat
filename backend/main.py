import threading
import webbrowser
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.staticfiles import StaticFiles

from .config import settings
from .database import init_db
from .routers import chat, mini, moments, system  # 修改点 1：引入 mini 路由
from .services import moments_service, scheduler_service
from .ws import manager

BACKEND_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BACKEND_DIR.parent / "frontend"
GENERATED_DIR = BACKEND_DIR / "generated_images"
GENERATED_DIR.mkdir(exist_ok=True)
CHAT_UPLOAD_DIR = BACKEND_DIR / "uploads" / "chat"
CHAT_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    await moments_service.seed_demo_posts()
    scheduler_service.start()
    print("=" * 52)
    print(f"  🎸 动漫聊天室已启动: http://{settings.HOST}:{settings.PORT}")
    print("=" * 52)
    yield
    scheduler_service.shutdown()


app = FastAPI(title="动漫聊天室", lifespan=lifespan)

# ===== 新增：开发期禁用前端静态资源缓存 =====
@app.middleware("http")
async def no_cache_for_assets(request: Request, call_next):
    response = await call_next(request)
    # 针对图片、CSS、JS 禁用浏览器缓存，修改后普通刷新即可生效
    if request.url.path.startswith(("/assets/", "/css/", "/js/")):
        response.headers["Cache-Control"] = "no-store, max-age=0"
    return response
# ==========================================

app.include_router(chat.router)
app.include_router(moments.router)
app.include_router(system.router)
app.include_router(mini.router)  # 修改点 2：注册 mini 路由


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


app.mount("/generated", StaticFiles(directory=str(GENERATED_DIR)), name="generated")
app.mount("/uploads/chat", StaticFiles(directory=str(CHAT_UPLOAD_DIR)), name="chat_uploads")
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    threading.Timer(1.5, lambda: webbrowser.open(
        f"http://{settings.HOST}:{settings.PORT}")).start()
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, log_level="info")