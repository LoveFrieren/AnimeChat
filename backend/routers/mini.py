import json
from typing import List

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ..config import BASE_DIR
from ..services.ai_service import ai_service

router = APIRouter(prefix="/api/mini", tags=["mini"])

KNOWLEDGE_FILE = BASE_DIR / "backend" / "mini" / "character_knowledge.json"


def _norm(obj):
    """递归去除 JSON 键与字符串值的首尾空白，兼容原始数据中的多余空格"""
    if isinstance(obj, dict):
        return {(k or "").strip(): _norm(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_norm(x) for x in obj]
    if isinstance(obj, str):
        return obj.strip()
    return obj


def _load_knowledge() -> dict:
    try:
        return _norm(json.loads(KNOWLEDGE_FILE.read_text(encoding="utf-8")))
    except Exception:
        return {}


class BandMember(BaseModel):
    name: str
    role: str
    mbti: str
    price: int
    desc: str


class BandAnalyzeRequest(BaseModel):
    members: List[BandMember]


def _build_prompt(members: List[BandMember], db: dict) -> str:
    knowledge = [db.get(m.name.strip()) for m in members]
    knowledge = [k for k in knowledge if k]
    if not knowledge:
        raise HTTPException(400, "角色知识库缺失，请检查 backend/mini/character_knowledge.json")
    all_names = "、".join(k.get("全名", "") for k in knowledge)
    lines = []
    for k in knowledge:
        traits = k.get("特点", [])
        lines.append(
            f"{k.get('全名')}（{k.get('动漫出处')}·{k.get('所属团体')}）担任【{k.get('乐队职责')}】。"
            f"特点：{'、'.join(traits) if isinstance(traits, list) else traits}。音乐风格：{k.get('音乐风格')}"
        )
    return f"""你是一位资深动漫乐评人，熟悉《轻音少女》《孤独摇滚！》《MyGO!!!!!》《GBC》等作品。
请基于以下真实、准确的角色信息，分析这支由【{all_names}】组成的少女乐队的化学反应：
{chr(10).join(lines)}
分析要求：
用中文输出，尽可能减少英文单词出现；
不要弄错乐队人数，不要单独评价；
要两两循环分组评价（如5人组需10对）；
分析创作、排练、演出中的互动张力与互补性；
语言生动，有画面感，1000字以上；
若信息不足，只基于已知事实，不虚构；
不要说"在某某作品中"这种话；
以"这支由（{all_names}）组成的少女乐队，其化学反应无疑充满了丰富性和多样性。"开头。
输出格式：直接输出分析段落，不要标题、列表、解释。""".strip()


@router.post("/band/analyze")
async def band_analyze(req: BandAnalyzeRequest):
    if not ai_service.enabled:
        raise HTTPException(503, "未配置 API Key，请先填写 .env")
    db = _load_knowledge()
    prompt = _build_prompt(req.members, db)

    async def gen():
        try:
            async for text in ai_service.chat_stream(prompt, temperature=0.3):
                yield f"data: {json.dumps({'content': text}, ensure_ascii=False)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': f'{type(e).__name__}: {e}'}, ensure_ascii=False)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")