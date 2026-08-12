import math
from collections import Counter
from pathlib import Path

NGRAMS = (2, 3)  # 中文无需分词，字符级 n-gram 即可取得不错效果


def char_ngrams(text: str, n: int):
    text = "".join(ch for ch in text if not ch.isspace())
    return [text[i:i + n] for i in range(len(text) - n + 1)]


class RAGService:
    """轻量 RAG：knowledge/ 下每个 <角色id>.txt 为该角色专属资料，common.txt 为全员共享资料。
    每一行视为一条知识片段，检索时只在该角色+共享资料中召回 Top-K 注入 system prompt。"""

    def __init__(self, knowledge_dir: Path, top_k: int = 3):
        self.top_k = top_k
        self.chunks = []
        self.idf = {}
        self._load(Path(knowledge_dir))
        self._build_index()

    def _load(self, kdir: Path):
        if not kdir.exists():
            return
        for f in sorted(kdir.glob("*.txt")):
            cid = None if f.stem == "common" else f.stem
            for line in f.read_text(encoding="utf-8").splitlines():
                line = line.strip().lstrip("-•· ").strip()
                if len(line) >= 6:
                    self.chunks.append({"character_id": cid, "text": line})

    def _vectorize(self, text: str) -> Counter:
        vec = Counter()
        for n in NGRAMS:
            vec.update(char_ngrams(text, n))
        return vec

    def _build_index(self):
        df = Counter()
        for c in self.chunks:
            c["vec"] = self._vectorize(c["text"])
            df.update(set(c["vec"]))
        n = max(len(self.chunks), 1)
        self.idf = {g: math.log((n + 1) / (cnt + 1)) + 1 for g, cnt in df.items()}
        for c in self.chunks:
            c["wvec"] = {g: v * self.idf.get(g, 1.0) for g, v in c["vec"].items()}
            c["norm"] = math.sqrt(sum(v * v for v in c["wvec"].values())) or 1.0

    def retrieve(self, character_id: str, query: str, top_k: int = None) -> str:
        k = top_k or self.top_k
        q_raw = self._vectorize(query)
        if not q_raw:
            return ""
        q = {g: v * self.idf.get(g, 1.0) for g, v in q_raw.items()}
        q_norm = math.sqrt(sum(v * v for v in q.values())) or 1.0

        scored = []
        for c in self.chunks:
            if c["character_id"] not in (None, character_id):
                continue
            small, big = (q, c["wvec"]) if len(q) < len(c["wvec"]) else (c["wvec"], q)
            dot = sum(v * big.get(g, 0.0) for g, v in small.items())
            if dot <= 0:
                continue
            scored.append((dot / (q_norm * c["norm"]), c["text"]))
        scored.sort(key=lambda x: x[0], reverse=True)

        texts = [t for s, t in scored[:k] if s > 0.05]
        return "\n".join(f"- {t}" for t in texts)


from ..config import settings

KNOWLEDGE_DIR = Path(__file__).resolve().parent.parent / "knowledge"
rag_service = RAGService(KNOWLEDGE_DIR, top_k=settings.RAG_TOP_K)