import os
from typing import List, Literal, Optional
from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel
from ..characters import get_character
from ..database import MomentComment, MomentPost, SessionLocal, get_player_name
from ..services import moments_service
from ..services.ai_service import ai_service

router = APIRouter(prefix="/api/moments", tags=["moments"])

@router.get("")
def list_posts():
    db = SessionLocal()
    try:
        posts = db.query(MomentPost).order_by(MomentPost.created_at.desc(), MomentPost.id.desc()).all()
        return [moments_service.serialize_post(p, moments_service._comments_of(db, p.id)) for p in posts]
    finally: db.close()

@router.get("/pool")
def list_pool(): return {"images": moments_service.list_pool_images()}

@router.get("/ref-images")
def list_ref_images(): return {"images": moments_service.list_ref_images()}

@router.post("/pool/upload")
async def upload_pool_image(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in {".png", ".jpg", ".jpeg", ".webp", ".gif"}: raise HTTPException(400, "格式不支持")
    data = await file.read()
    if len(data) > 8 * 1024 * 1024: raise HTTPException(400, "图片不能超过 8MB")
    return {"url": moments_service.save_pool_image(ext, data)}

class GenerateRequest(BaseModel):
    character_id: Optional[str] = None
    source: Literal["pool", "cloud", "local"] = "pool"
    user_prompt: Optional[str] = None
    image_url: Optional[str] = None
    caption_mode: Literal["auto", "manual", "vision"] = "auto"
    manual_caption: Optional[str] = None
    people_hint: Optional[str] = None
    reference_images: Optional[List[str]] = None

@router.post("/generate")
async def generate(req: GenerateRequest):
    if not req.character_id: raise HTTPException(400, "请指定发布角色")
    if not get_character(req.character_id): raise HTTPException(404, "角色不存在")
    return await moments_service.create_post(
        character_id=req.character_id, source=req.source, user_prompt=(req.user_prompt or "").strip() or None,
        image_url=(req.image_url or "").strip() or None, caption_mode=req.caption_mode,
        manual_caption=(req.manual_caption or "").strip() or None, people_hint=(req.people_hint or "").strip() or None,
        reference_images=[u for u in (req.reference_images or []) if u][:3]
    )

@router.post("/{post_id}/like")
def like(post_id: int):
    db = SessionLocal()
    try:
        post = db.get(MomentPost, post_id)
        if not post: raise HTTPException(404, "动态不存在")
        post.likes += 1; db.commit()
        return {"likes": post.likes}
    finally: db.close()

class CommentRequest(BaseModel):
    content: str
    author_name: Optional[str] = None

@router.post("/{post_id}/comment")
async def comment(post_id: int, req: CommentRequest):
    db = SessionLocal()
    try:
        post = db.get(MomentPost, post_id)
        if not post: raise HTTPException(404, "动态不存在")
        author_name = req.author_name or get_player_name()
        db.add(MomentComment(post_id=post_id, author_type="user", author_name=author_name, content=req.content))
        db.commit()
        reply_text = await ai_service.comment_reply(get_character(post.character_id), author_name, req.content)
        if reply_text:
            char = get_character(post.character_id)
            db.add(MomentComment(post_id=post_id, author_type="character", author_name=char["name"], content=reply_text))
            db.commit()
        return {"comments": [{"author_type": c.author_type, "author_name": c.author_name, "content": c.content, "created_at": c.created_at.strftime("%Y-%m-%d %H:%M:%S")} for c in moments_service._comments_of(db, post_id)]}
    finally: db.close()