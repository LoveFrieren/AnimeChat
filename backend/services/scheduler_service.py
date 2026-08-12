import random

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from ..characters import CHARACTERS
from ..config import settings
from ..database import Message, SessionLocal, get_player_name
from ..ws import manager
from . import moments_service

scheduler = AsyncIOScheduler()


def _serialize(msg: Message) -> dict:
    return {"id": msg.id, "character_id": msg.character_id, "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at.strftime("%Y-%m-%d %H:%M:%S")}


async def morning_greeting():
    """定时早安问候：随机两位角色主动发消息，经 WebSocket 推送到前端"""
    name = get_player_name()
    for char in random.sample(CHARACTERS, k=min(2, len(CHARACTERS))):
        content = random.choice(char["greetings"]).format(name=name)
        db = SessionLocal()
        try:
            msg = Message(character_id=char["id"], role="character", content=content)
            db.add(msg)
            db.commit()
            db.refresh(msg)
            payload = _serialize(msg)
        finally:
            db.close()
        await manager.broadcast({"type": "message", "message": payload})


async def daily_moment():
    post = await moments_service.create_post()
    if post:
        await manager.broadcast({"type": "moment", "post_id": post["id"]})


def start():
    scheduler.add_job(morning_greeting, "cron",
                      hour=settings.MORNING_GREETING_HOUR, minute=0, id="morning_greeting")
    if settings.AUTO_MOMENTS:
        scheduler.add_job(daily_moment, "cron", hour=15, minute=30, id="daily_moment")
    scheduler.start()


def shutdown():
    if scheduler.running:
        scheduler.shutdown(wait=False)