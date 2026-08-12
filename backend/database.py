import json
import os
from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, Text, create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import BASE_DIR

DATA_DIR = BASE_DIR / "data"
os.makedirs(DATA_DIR, exist_ok=True)
engine = create_engine(f"sqlite:///{DATA_DIR / 'app.db'}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
Base = declarative_base()

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, autoincrement=True)
    character_id = Column(String(64), index=True)
    role = Column(String(16))
    content = Column(Text)
    image_url = Column(String(512), default="")
    created_at = Column(DateTime, default=datetime.now)

class MomentPost(Base):
    __tablename__ = "moment_posts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    character_id = Column(String(64), index=True)
    image_url = Column(String(512))
    caption = Column(Text)
    location = Column(String(128))
    likes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.now)

class MomentComment(Base):
    __tablename__ = "moment_comments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, index=True)
    author_type = Column(String(16))
    author_name = Column(String(64))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.now)

def init_db():
    Base.metadata.create_all(engine)
    inspector = inspect(engine)
    if inspector.has_table("messages"):
        cols = [c["name"] for c in inspector.get_columns("messages")]
        if "image_url" not in cols:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE messages ADD COLUMN image_url TEXT DEFAULT ''"))

def _read_player() -> dict:
    try: return json.loads((DATA_DIR / "player.json").read_text(encoding="utf-8")) or {}
    except Exception: return {}

def save_player_profile(name: str = None, avatar_url: str = None):
    data = _read_player()
    if name is not None: data["name"] = name
    if avatar_url is not None: data["avatar_url"] = avatar_url
    (DATA_DIR / "player.json").write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")

def get_player_profile() -> dict:
    data = _read_player()
    return {"name": data.get("name") or "朋友", "avatar_url": data.get("avatar_url") or ""}

def get_player_name() -> str:
    return get_player_profile()["name"]