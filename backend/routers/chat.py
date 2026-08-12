import os, uuid
from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from ..characters import get_character
from ..config import BASE_DIR, settings
from ..database import Message, SessionLocal, get_player_name
from ..services.ai_service import ai_service
from ..services.rag_service import rag_service

router = APIRouter(prefix="/api", tags=["chat"])
CHAT_UPLOAD_DIR = BASE_DIR / "backend" / "uploads" / "chat"
CHAT_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def serialize_message(msg: Message) -> dict:
    return {"id": msg.id, "character_id": msg.character_id, "role": msg.role,
            "content": msg.content, "image_url": getattr(msg, "image_url", "") or "",
            "created_at": msg.created_at.strftime("%Y-%m-%d %H:%M:%S")}

class SendRequest(BaseModel):
    content: str
    player_name: Optional[str] = None

@router.get("/friends")
def list_friends():
    from ..characters import CHARACTERS
    db = SessionLocal()
    try:
        result = []
        for char in CHARACTERS:
            last = db.query(Message).filter(Message.character_id == char["id"]).order_by(Message.id.desc()).first()
            last_msg = f"[图片] {last.content}".strip() if last and getattr(last, "image_url", "") else (last.content if last else "开始聊天吧～")
            result.append({"id": char["id"], "name": char["name"], "band": char["band"], "avatar": char["avatar"],
                           "last_message": last_msg, "last_time": last.created_at.strftime("%Y-%m-%d %H:%M:%S") if last else ""})
        return result
    finally: db.close()

@router.get("/chat/{character_id}/history")
def get_history(character_id: str, limit: int = 50):
    db = SessionLocal()
    try:
        msgs = db.query(Message).filter(Message.character_id == character_id).order_by(Message.id.desc()).limit(limit).all()
        return [serialize_message(m) for m in reversed(msgs)]
    finally: db.close()

@router.post("/chat/{character_id}/send")
async def send_message(character_id: str, req: SendRequest):
    char = get_character(character_id)
    if not char: raise HTTPException(404, "角色不存在")
    db = SessionLocal()
    try:
        user_msg = Message(character_id=character_id, role="user", content=req.content, image_url="")
        db.add(user_msg); db.commit(); db.refresh(user_msg)
        history = db.query(Message).filter(Message.character_id == character_id, Message.role.in_(["user", "character"])).order_by(Message.id.desc()).limit(settings.HISTORY_TURNS * 2).all()
        history.reverse()
        rag_context = rag_service.retrieve(character_id, req.content)
        reply_text = await ai_service.chat_reply(char, history, req.content, rag_context, req.player_name or get_player_name())
        reply_msg = Message(character_id=character_id, role="character", content=reply_text, image_url="")
        db.add(reply_msg); db.commit(); db.refresh(reply_msg)
        return {"user_message": serialize_message(user_msg), "reply": serialize_message(reply_msg), "rag_context": rag_context}
    finally: db.close()

@router.post("/chat/{character_id}/send-image")
async def send_image(character_id: str, file: UploadFile = File(...), content: Optional[str] = Form(None), player_name: Optional[str] = Form(None)):
    char = get_character(character_id)
    if not char: raise HTTPException(404, "角色不存在")
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in {".png", ".jpg", ".jpeg", ".webp", ".gif"}: raise HTTPException(400, "格式不支持")
    data = await file.read()
    if len(data) > settings.CHAT_IMAGE_MAX_MB * 1024 * 1024: raise HTTPException(400, f"图片不能超过 {settings.CHAT_IMAGE_MAX_MB}MB")
    filename = f"{uuid.uuid4().hex}{ext}"
    (CHAT_UPLOAD_DIR / filename).write_bytes(data)
    image_url = f"/uploads/chat/{filename}"
    db = SessionLocal()
    try:
        user_msg = Message(character_id=character_id, role="user", content=content or "", image_url=image_url)
        db.add(user_msg); db.commit(); db.refresh(user_msg)
        history = db.query(Message).filter(Message.character_id == character_id, Message.role.in_(["user", "character"])).order_by(Message.id.desc()).limit(settings.HISTORY_TURNS * 2).all()
        history.reverse()
        rag_context = rag_service.retrieve(character_id, content or "用户发送了一张图片")
        reply_text = await ai_service.chat_reply(char, history, content, rag_context, player_name or get_player_name())
        reply_msg = Message(character_id=character_id, role="character", content=reply_text, image_url="")
        db.add(reply_msg); db.commit(); db.refresh(reply_msg)
        return {"user_message": serialize_message(user_msg), "reply": serialize_message(reply_msg), "rag_context": rag_context}
    finally: db.close()

@router.post("/chat/{character_id}/poke")
def poke(character_id: str):
    import random
    char = get_character(character_id)
    if not char: raise HTTPException(404, "角色不存在")
    db = SessionLocal()
    try:
        msg = Message(character_id=character_id, role="character", content=random.choice(char["poke_reactions"]), image_url="")
        db.add(msg); db.commit(); db.refresh(msg)
        return serialize_message(msg)
    finally: db.close()