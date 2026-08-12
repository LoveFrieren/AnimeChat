import os

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from ..characters import CHARACTERS
from ..config import BASE_DIR, settings
from ..database import get_player_profile, save_player_profile
from ..services import scheduler_service
from ..services.ai_service import ai_service
from ..services.rag_service import rag_service

router = APIRouter(prefix="/api/system", tags=["system"])

USER_ASSET_DIR = BASE_DIR / "frontend" / "assets" / "user"
ALLOWED_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


@router.get("/status")
def status():
    return {
        "api_key_configured": ai_service.enabled,
        "model": settings.LLM_MODEL,
        "base_url": settings.LLM_BASE_URL,
        "character_count": len(CHARACTERS),
        "rag_chunks": len(rag_service.chunks),
        "image_api_configured": bool(settings.IMAGE_MODEL),
    }


@router.get("/profile")
def profile():
    return get_player_profile()


class ProfileRequest(BaseModel):
    name: str


@router.put("/profile")
def update_profile(req: ProfileRequest):
    save_player_profile(name=req.name.strip() or "朋友")
    return {"ok": True, **get_player_profile()}


@router.post("/avatar")
async def upload_avatar(file: UploadFile = File(...)):
    """上传自定义头像：保存为 frontend/assets/user/me.* 并记录 URL"""
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, "仅支持 png / jpg / jpeg / webp / gif 格式")
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(400, "头像图片不能超过 5MB")
    USER_ASSET_DIR.mkdir(parents=True, exist_ok=True)
    for old in USER_ASSET_DIR.glob("me.*"):
        old.unlink(missing_ok=True)
    (USER_ASSET_DIR / f"me{ext}").write_bytes(content)
    url = f"/assets/user/me{ext}"
    save_player_profile(avatar_url=url)
    return {"avatar_url": url}


@router.delete("/avatar")
def delete_avatar():
    for old in USER_ASSET_DIR.glob("me.*"):
        old.unlink(missing_ok=True)
    save_player_profile(avatar_url="")
    return {"avatar_url": ""}


@router.post("/test/greeting")
async def test_greeting():
    """调试用：立即触发一次早安问候推送"""
    await scheduler_service.morning_greeting()
    return {"ok": True}


class RagTestRequest(BaseModel):
    character_id: str
    query: str


@router.post("/test/rag")
def test_rag(req: RagTestRequest):
    """调试用：查看某句话会检索到哪些角色资料"""
    return {"context": rag_service.retrieve(req.character_id, req.query)}