import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    def __init__(self):
        self.LLM_API_KEY = os.getenv("LLM_API_KEY", "")
        self.LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
        self.LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
        self.LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", "0.8"))
        
        self.HISTORY_TURNS = int(os.getenv("HISTORY_TURNS", "10"))
        self.RAG_TOP_K = int(os.getenv("RAG_TOP_K", "3"))
        
        self.IMAGE_MODEL = os.getenv("IMAGE_MODEL", "")
        self.LOCAL_IMAGE_API_URL = os.getenv("LOCAL_IMAGE_API_URL", "")
        self.LOCAL_IMAGE_BACKEND = os.getenv("LOCAL_IMAGE_BACKEND", "comfy").lower()
        
        self.HOST = os.getenv("HOST", "127.0.0.1")
        self.PORT = int(os.getenv("PORT", "8000"))
        self.MORNING_GREETING_HOUR = int(os.getenv("MORNING_GREETING_HOUR", "8"))
        self.AUTO_MOMENTS = os.getenv("AUTO_MOMENTS", "true").lower() == "true"
        
        self.CHAT_IMAGE_MODE = os.getenv("CHAT_IMAGE_MODE", "direct").lower()
        self.CHAT_IMAGE_MAX_MB = int(os.getenv("CHAT_IMAGE_MAX_MB", "10"))
        self.CHAT_IMAGE_MAX_SIDE = int(os.getenv("CHAT_IMAGE_MAX_SIDE", "1024"))
        self.CHAT_IMAGE_HISTORY_LIMIT = int(os.getenv("CHAT_IMAGE_HISTORY_LIMIT", "2"))

settings = Settings()