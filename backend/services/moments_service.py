import asyncio, random, uuid
from datetime import datetime, timedelta
from pathlib import Path
from ..characters import CHARACTERS, get_character
from ..database import MomentComment, MomentPost, SessionLocal
from .ai_service import ai_service

PLACEHOLDER_IMAGES = ["/assets/placeholders/travel1.jpg", "/assets/placeholders/travel2.jpg", "/assets/placeholders/travel3.jpg"]
LOCATIONS = ["海边栈道", "红叶神社", "下北泽LiveHouse", "涩谷街头", "温泉旅馆", "夏日祭典", "学校天台", "街角咖啡厅", "旧唱片店"]
CAPTION_FALLBACKS = ["今天在{loc}～心情像旋律一样轻快♪", "来{loc}玩啦！拍了好多照片！", "{loc}的风景，让人想写成一首歌呢。"]
MOMENTS_POOL_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "assets" / "moments_pool"
REF_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "assets" / "band" / "picture"
POOL_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

def list_pool_images() -> list:
    if not MOMENTS_POOL_DIR.exists(): return []
    return [{"name": f.name, "url": f"/assets/moments_pool/{f.name}"} for f in sorted(MOMENTS_POOL_DIR.iterdir()) if f.is_file() and f.suffix.lower() in POOL_EXTS]

def pool_image_exists(image_url: str) -> bool: return (MOMENTS_POOL_DIR / Path(image_url).name).is_file()

def save_pool_image(ext: str, data: bytes) -> str:
    MOMENTS_POOL_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"user_{uuid.uuid4().hex[:10]}{ext}"
    (MOMENTS_POOL_DIR / filename).write_bytes(data)
    return f"/assets/moments_pool/{filename}"

def list_ref_images() -> list:
    if not REF_DIR.exists(): return []
    return [{"name": f.stem, "url": f"/assets/band/picture/{f.name}"} for f in sorted(REF_DIR.iterdir()) if f.is_file() and f.suffix.lower() in POOL_EXTS]

def ref_image_exists(image_url: str) -> bool: return (REF_DIR / Path(image_url).name).is_file()

def serialize_post(post: MomentPost, comments) -> dict:
    char = get_character(post.character_id) or {}
    return {"id": post.id, "character_id": post.character_id, "character_name": char.get("name", post.character_id), "avatar": char.get("avatar", ""),
            "image_url": post.image_url, "caption": post.caption, "location": post.location, "likes": post.likes,
            "created_at": post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "comments": [{"author_type": c.author_type, "author_name": c.author_name, "content": c.content, "created_at": c.created_at.strftime("%Y-%m-%d %H:%M:%S")} for c in comments]}

def _comments_of(db, post_id):
    return db.query(MomentComment).filter(MomentComment.post_id == post_id).order_by(MomentComment.id).all()

async def _generate_auto_comments(post_id: int):
    db = SessionLocal()
    try:
        post = db.get(MomentPost, post_id)
        if not post: return
        author_char = get_character(post.character_id)
        if not author_char or "relations" not in author_char: return
        relations = author_char["relations"]
        candidates = {name: "close" for name in relations.get("close", [])}
        for name in random.sample(relations.get("teammates", []), min(2, len(relations.get("teammates", [])))):
            if name not in candidates: candidates[name] = "teammates"
        for name in random.sample(relations.get("rivals", []), min(1, len(relations.get("rivals", [])))):
            if name not in candidates: candidates[name] = "rivals"
        if not candidates: return
        selected_items = random.sample(list(candidates.items()), random.randint(1, min(3, len(candidates))))
        context_comments = []
        for name, tier in selected_items:
            commenter_char = next((c for c in CHARACTERS if c["name"] == name), None)
            if not commenter_char: continue
            content = await ai_service.generate_moment_comment(author_char["name"], post.caption, commenter_char, context_comments, relation_tier=tier)
            comment = MomentComment(post_id=post.id, author_type="character", author_name=name, content=content)
            db.add(comment); db.commit(); db.refresh(comment)
            context_comments.append({"author_name": name, "content": content, "created_at": comment.created_at.strftime("%Y-%m-%d %H:%M:%S")})
        if context_comments and random.random() < 0.65:
            target = random.choice(context_comments)
            others = [n for n, _ in selected_items if n != target["author_name"]]
            replier_name = random.choice(others) if others and random.random() < 0.5 else author_char["name"]
            replier_char = next((c for c in CHARACTERS if c["name"] == replier_name), author_char)
            tier = "teammates"
            rels = relations if replier_name == author_char["name"] else replier_char.get("relations", {})
            for t in ["close", "teammates", "rivals"]:
                if target["author_name"] in rels.get(t, []): tier = t; break
            reply = await ai_service.generate_moment_comment(target["author_name"], target["content"], replier_char, context_comments, relation_tier=tier)
            db.add(MomentComment(post_id=post.id, author_type="character", author_name=replier_name, content=f"回复 {target['author_name']}: {reply}"))
            db.commit()
    except Exception as e: print(f"[自动评论异常] {e}")
    finally: db.close()

async def create_post(character_id=None, source="pool", user_prompt=None, image_url=None, caption_mode="auto",
                      manual_caption=None, people_hint=None, reference_images=None):
    char = get_character(character_id) if character_id else random.choice(CHARACTERS)
    location = random.choice(LOCATIONS)
    image_url = (image_url or "").strip() or None

    if source == "pool":
        if not (image_url and pool_image_exists(image_url)):
            imgs = [f for f in MOMENTS_POOL_DIR.iterdir() if f.is_file() and f.suffix.lower() in POOL_EXTS] if MOMENTS_POOL_DIR.exists() else []
            if imgs: image_url = f"/assets/moments_pool/{random.choice(imgs).name}"
    elif source in ("cloud", "local") and user_prompt:
        image_url = await ai_service.generate_image(user_prompt, source=source, reference_images=reference_images or [])

    if not image_url:
        if source in ("cloud", "local"):
            image_url = await ai_service.generate_image(f"anime illustration, cute anime girl, travel scene, beautiful scenery", source="cloud")
        if not image_url: image_url = random.choice(PLACEHOLDER_IMAGES)

    # 配文逻辑：彻底删除场景干扰，100% 尊重画面
    caption = None
    if caption_mode == "manual" and manual_caption:
        caption = manual_caption
    else:
        # 强制让视觉模型看图写文案
        caption = await ai_service.generate_caption_from_image(char, image_url, people_hint or "")
        if not caption:
            # 视觉模型失败，才回退到纯文本（不注入 scene）
            caption = await ai_service.generate_caption(char, location) or random.choice(CAPTION_FALLBACKS).format(loc=location)

    db = SessionLocal()
    try:
        post = MomentPost(character_id=char["id"], image_url=image_url, caption=caption, location=location)
        db.add(post); db.commit(); db.refresh(post)
        asyncio.create_task(_generate_auto_comments(post.id))
        await asyncio.sleep(1.5)
        return serialize_post(db.get(MomentPost, post.id), _comments_of(db, post.id))
    finally: db.close()

async def seed_demo_posts():
    db = SessionLocal()
    try:
        if db.query(MomentPost).count() > 0: return
        demos = [("yui", PLACEHOLDER_IMAGES[0], "和律她们去海边了！海风咸咸的，好像薯片的味道～🌊", "海边栈道"),
                 ("tomori", PLACEHOLDER_IMAGES[1], "在神社的台阶上……捡到了很好看的石头。今天也是值得记住的一天。", "红叶神社"),
                 ("anon", PLACEHOLDER_IMAGES[2], "新店的草莓芭菲绝了！照片已经修好啦，大家一定会喜欢的♪", "街角咖啡厅")]
        now = datetime.now()
        offsets = sorted(random.sample(range(120, 601), len(demos)), reverse=True)
        for (cid, img, cap, loc), off in zip(demos, offsets):
            db.add(MomentPost(character_id=cid, image_url=img, caption=cap, location=loc, created_at=now - timedelta(minutes=off)))
        db.commit()
    finally: db.close()