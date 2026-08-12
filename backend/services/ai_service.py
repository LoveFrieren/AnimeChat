import asyncio, base64, io, json, random, time, uuid
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse
import httpx
from openai import AsyncOpenAI
from ..config import settings

GENERATED_DIR = Path(__file__).resolve().parent.parent / "generated_images"
CHAT_UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads" / "chat"
MOMENTS_POOL_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "assets" / "moments_pool"
REF_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "assets" / "band" / "picture"
COMFY_WORKFLOW_FILE = Path(__file__).resolve().parent.parent / "comfy" / "workflow_api.json"

class AIService:
    def __init__(self):
        self.enabled = bool(settings.LLM_API_KEY) and "your_api_key" not in settings.LLM_API_KEY
        self.client = AsyncOpenAI(api_key=settings.LLM_API_KEY or "sk-placeholder", base_url=settings.LLM_BASE_URL)

    def build_system_prompt(self, character: dict, rag_context: str, player_name: str) -> str:
        parts = [f"你现在正在手机聊天软件中与好友对话，请完全扮演动漫作品中的角色【{character['name']}】（来自：{character['band']}）。",
                 f"【角色设定】\n{character['persona']}"]
        if rag_context: parts.append(f"【角色相关资料】\n{rag_context}")
        parts.append(f"【对话对象】玩家昵称：{player_name}，是{character['name']}熟悉且信任的好友。")
        parts.append("【扮演规则】\n1. 始终以角色第一人称回应，不承认是AI；\n2. 严格保持性格口癖防OOC；\n3. 回复自然简短（1~3句），可用emoji；\n4. 不编造冲突设定；\n5. 不提及元信息。")
        return "\n\n".join(parts)

    def _resolve_any_image_path(self, image_url: str) -> Optional[Path]:
        if not image_url: return None
        name = Path(image_url).name
        if image_url.startswith("/assets/moments_pool/"): base = MOMENTS_POOL_DIR
        elif image_url.startswith("/generated/"): base = GENERATED_DIR
        elif image_url.startswith("/uploads/chat/"): base = CHAT_UPLOAD_DIR
        else: return None
        path = (base / name).resolve()
        return path if path.exists() else None

    def _read_path_as_data_url(self, path: Path) -> Optional[str]:
        try:
            mime = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}.get(path.suffix.lower(), "image/jpeg")
            try:
                from PIL import Image
                img = Image.open(path)
                if img.mode != "RGB" and mime == "image/jpeg": img = img.convert("RGB")
                max_side = settings.CHAT_IMAGE_MAX_SIDE
                if max_side > 0 and max(img.size) > max_side: img.thumbnail((max_side, max_side))
                buf = io.BytesIO()
                img.save(buf, format="JPEG" if mime == "image/jpeg" else img.format or "PNG", quality=85)
                data = buf.getvalue()
            except Exception: data = path.read_bytes()
            return f"data:{mime};base64,{base64.b64encode(data).decode('utf-8')}"
        except Exception: return None

    def _build_chat_messages(self, character, history, rag_context, player_name):
        messages = [{"role": "system", "content": self.build_system_prompt(character, rag_context, player_name)}]
        image_ids = set()
        if settings.CHAT_IMAGE_MODE != "off":
            all_ids = [getattr(m, "id", None) for m in history if getattr(m, "role", "") == "user" and getattr(m, "image_url", "")]
            if settings.CHAT_IMAGE_HISTORY_LIMIT > 0: image_ids = set(all_ids[-settings.CHAT_IMAGE_HISTORY_LIMIT:])
        for m in history:
            if m.role == "user":
                text = m.content or ""
                img_url = getattr(m, "image_url", "")
                if getattr(m, "id", None) in image_ids and img_url:
                    p = self._resolve_any_image_path(img_url)
                    data_url = self._read_path_as_data_url(p) if p else None
                    if data_url:
                        messages.append({"role": "user", "content": [{"type": "text", "text": text or "（用户发送了一张图片）"}, {"type": "image_url", "image_url": {"url": data_url}}]})
                        continue
                messages.append({"role": "user", "content": text or "（用户发送了一张图片）" if img_url else "……"})
            elif m.role == "character":
                messages.append({"role": "assistant", "content": m.content})
        return messages

    async def chat_reply(self, character, history, user_text, rag_context, player_name) -> str:
        if not self.enabled: return f"（{character['name']}暂时无法回应）"
        messages = self._build_chat_messages(character, history, rag_context, player_name)
        if not any(m.get("role") == "user" for m in messages[1:]) and user_text: messages.append({"role": "user", "content": user_text})
        try:
            resp = await self.client.chat.completions.create(model=settings.LLM_MODEL, messages=messages, temperature=settings.LLM_TEMPERATURE, max_tokens=400)
            return (resp.choices[0].message.content or "").strip() or "……"
        except Exception as e:
            return f"（AI 服务调用失败：{e}）"

    # ================= 朋友圈配文（彻底删除场景指定，100%尊重画面） =================
    async def generate_caption(self, character: dict, location: str) -> Optional[str]:
        if not self.enabled: return None
        try:
            resp = await self.client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[{"role": "system", "content": f"你是动漫角色【{character['name']}】。{character['persona']}"},
                          {"role": "user", "content": f"你正在{location}旅游，要发一条朋友圈。请以{character['name']}的口吻写配文，不超过30字，活泼自然，不加引号。"}],
                temperature=0.9, max_tokens=80)
            return (resp.choices[0].message.content or "").strip()
        except Exception: return None

    async def generate_caption_from_image(self, character: dict, image_url: str, people_hint: str = "") -> Optional[str]:
        if not self.enabled: return None
        path = self._resolve_any_image_path(image_url)
        if not path: return None
        data_url = self._read_path_as_data_url(path)
        if not data_url: return None
        hint_text = f"用户告诉你，图中的人物是：{people_hint}（请结合人物身份自然提及）。" if people_hint else "请仔细观察图中出现的所有人物。"
        try:
            resp = await self.client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[{"role": "system", "content": f"你是动漫角色【{character['name']}】。{character['persona']}"},
                          {"role": "user", "content": [
                              {"type": "text", "text": f"我要以你的口吻发一条朋友圈，图片已经选好。{hint_text}\n【严格要求】必须以图片画面实际内容为准（人物、动作、场景、物品），绝对不要编造画面中不存在的剧情或地点！以{character['name']}的口吻写配文，不超过40字，活泼自然，不加引号。"},
                              {"type": "image_url", "image_url": {"url": data_url}}]}],
                temperature=0.9, max_tokens=100)
            return (resp.choices[0].message.content or "").strip().replace('"', "").replace("“", "").replace("”", "")
        except Exception as e:
            print(f"[看图配文] 失败：{e}")
            return None

    async def comment_reply(self, character: Optional[dict], author_name: str, comment_text: str) -> Optional[str]:
        if not character or not self.enabled: return f"谢谢{author_name}～♪"
        try:
            resp = await self.client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[{"role": "system", "content": f"你是动漫角色【{character['name']}】。{character['persona']}"},
                          {"role": "user", "content": f"好友{author_name}在你的朋友圈下评论：{comment_text}\n请以{character['name']}的身份回复，15字以内，不加引号。"}],
                temperature=0.9, max_tokens=60)
            return (resp.choices[0].message.content or "").strip()
        except Exception: return f"谢谢{author_name}～♪"

    # ================= 三轨生图（完美接入 ComfyUI） =================
    async def generate_image(self, prompt: str, source: str = "cloud", reference_images: list = None) -> Optional[str]:
        if source == "local": return await self.generate_image_local(prompt, reference_images or [])
        return await self.generate_image_cloud(prompt, reference_images or [])

    async def generate_image_cloud(self, prompt: str, reference_images: list = None) -> Optional[str]:
        model = (settings.IMAGE_MODEL or "").strip()
        if not self.enabled or not model: return None
        if model.lower().startswith("qwen-image"): return await self._generate_image_qwen_native(prompt, reference_images or [])
        try:
            resp = await self.client.images.generate(model=settings.IMAGE_MODEL, prompt=prompt, size="1024x1024", n=1)
            return getattr(resp.data[0], "url", None)
        except Exception: return None

    async def _generate_image_qwen_native(self, prompt: str, reference_images: list) -> Optional[str]:
        parsed = urlparse(settings.LLM_BASE_URL)
        url = f"{parsed.scheme}://{parsed.netloc}/api/v1/services/aigc/multimodal-generation/generation"
        content = []
        for u in reference_images[:3]:
            p = (REF_DIR / Path(u).name).resolve()
            if p.exists(): content.append({"image": f"data:image/jpeg;base64,{base64.b64encode(p.read_bytes()).decode('utf-8')}"})
        content.append({"text": prompt})
        payload = {"model": settings.IMAGE_MODEL.strip().lower(), "input": {"messages": [{"role": "user", "content": content}]}, "parameters": {"prompt_extend": True, "n": 1, "watermark": False}}
        try:
            async with httpx.AsyncClient(timeout=300) as client:
                resp = await client.post(url, json=payload, headers={"Authorization": f"Bearer {settings.LLM_API_KEY}", "Content-Type": "application/json"})
                if resp.status_code != 200: return None
                image_url = resp.json()["output"]["choices"][0]["message"]["content"][0]["image"]
                async with httpx.AsyncClient(timeout=120) as client2:
                    img_resp = await client2.get(image_url)
                    img_resp.raise_for_status()
                GENERATED_DIR.mkdir(parents=True, exist_ok=True)
                filename = f"cloud_{int(time.time())}.png"
                (GENERATED_DIR / filename).write_bytes(img_resp.content)
                return f"/generated/{filename}"
        except Exception: return None

    async def generate_image_local(self, prompt: str, reference_images: list = None) -> Optional[str]:
        local_url = getattr(settings, "LOCAL_IMAGE_API_URL", "").rstrip("/")
        if not local_url: return None
        if settings.LOCAL_IMAGE_BACKEND == "comfy":
            return await self._generate_image_comfy(prompt, reference_images or [])
        return await self._generate_image_sdwebui(prompt)

    async def _generate_image_comfy(self, prompt: str, reference_images: list) -> Optional[str]:
        if not COMFY_WORKFLOW_FILE.exists():
            print("[ComfyUI] ❌ 未找到 backend/comfy/workflow_api.json")
            return None
        local_url = getattr(settings, "LOCAL_IMAGE_API_URL", "").rstrip("/")
        try:
            workflow = json.loads(COMFY_WORKFLOW_FILE.read_text(encoding="utf-8"))
            # 1. 上传参考图并替换 LoadImage 节点
            ref_names = []
            for u in reference_images[:3]:
                p = (REF_DIR / Path(u).name).resolve()
                if not p.exists(): continue
                fname = f"animechat_{uuid.uuid4().hex[:8]}{p.suffix.lower()}"
                async with httpx.AsyncClient(timeout=120) as client:
                    with open(p, "rb") as f:
                        resp = await client.post(f"{local_url}/upload/image", files={"image": (fname, f, p.suffix.lstrip(".") or "png")}, data={"overwrite": "true"})
                        resp.raise_for_status()
                        ref_names.append(resp.json().get("name", fname))
            
            load_ids = sorted([nid for nid, n in workflow.items() if n.get("class_type") == "LoadImage"], key=lambda x: int(x) if str(x).isdigit() else 0)
            for i, nid in enumerate(load_ids):
                if i < len(ref_names): workflow[nid]["inputs"]["image"] = ref_names[i]
                else:
                    for other in workflow.values():
                        ins = other.get("inputs", {})
                        for k in [k for k, v in ins.items() if isinstance(v, list) and len(v) == 2 and str(v[0]) == str(nid)]: del ins[k]
                    del workflow[nid]

            # 2. 注入提示词
            patched = False
            for nid, node in workflow.items():
                ins = node.get("inputs", {})
                if "prompt" in ins and any(isinstance(v, list) and len(v) == 2 for v in ins.values()):
                    ins["prompt"] = prompt
                    if "seed" in ins and isinstance(ins["seed"], int): ins["seed"] = random.randint(0, 2_000_000_000_000_000)
                    patched = True
            if not patched:
                for nid, node in workflow.items():
                    if "TextEncodeQwenImageEdit" in str(node.get("class_type", "")):
                        node.get("inputs", {})["prompt"] = prompt
                        patched = True
            
            # 3. 提交并轮询
            async with httpx.AsyncClient(timeout=120) as client:
                resp = await client.post(f"{local_url}/prompt", json={"prompt": workflow})
                if resp.status_code != 200: return None
                prompt_id = resp.json()["prompt_id"]
            
            deadline = time.time() + 1800
            history = None
            async with httpx.AsyncClient(timeout=30) as client:
                while time.time() < deadline:
                    await asyncio.sleep(3)
                    try:
                        r = await client.get(f"{local_url}/history/{prompt_id}")
                        if prompt_id in r.json(): history = r.json()[prompt_id]; break
                    except: pass
            
            if not history: return None
            image_info = None
            for node_out in history.get("outputs", {}).values():
                if node_out.get("images"): image_info = node_out["images"][0]; break
            
            async with httpx.AsyncClient(timeout=120) as client:
                r = await client.get(f"{local_url}/view", params={"filename": image_info["filename"], "subfolder": image_info.get("subfolder", ""), "type": image_info.get("type", "output")})
                r.raise_for_status()
            GENERATED_DIR.mkdir(parents=True, exist_ok=True)
            filename = f"comfy_{int(time.time())}.png"
            (GENERATED_DIR / filename).write_bytes(r.content)
            return f"/generated/{filename}"
        except Exception as e:
            print(f"[ComfyUI] ❌ 调用失败: {e}")
            return None

    async def _generate_image_sdwebui(self, prompt: str) -> Optional[str]:
        local_url = getattr(settings, "LOCAL_IMAGE_API_URL", "").rstrip("/")
        try:
            payload = {"prompt": f"anime style, masterpiece, best quality, {prompt}", "negative_prompt": "bad anatomy, bad hands, worst quality", "steps": 20, "width": 1024, "height": 1024}
            async with httpx.AsyncClient(timeout=180) as client:
                resp = await client.post(f"{local_url}/sdapi/v1/txt2img", json=payload)
                resp.raise_for_status()
            raw = resp.json()["images"][0]
            b64 = raw.split(",", 1)[-1] if "," in raw else raw
            GENERATED_DIR.mkdir(parents=True, exist_ok=True)
            filename = f"local_{int(time.time())}.png"
            (GENERATED_DIR / filename).write_bytes(base64.b64decode(b64))
            return f"/generated/{filename}"
        except Exception: return None

    async def generate_moment_comment(self, author_name: str, caption: str, commenter: dict, context: list, relation_tier: str = "") -> str:
        if not self.enabled: return "好棒！♪"
        tier_hint = {"close": "极为亲密的挚友，语气亲昵护短。", "teammates": "同伴，围绕日常吐槽。", "rivals": "经常互怼，语气傲娇。"}.get(relation_tier, "相识的朋友。")
        context_str = "\n".join([f"- {c['author_name']}: {c['content']}" for c in context]) if context else "暂无"
        prompt = f"你是【{commenter['name']}】（{commenter['persona']}）。\n好友【{author_name}】发了朋友圈：'{caption}'\n【关系】{tier_hint}\n已有评论：\n{context_str}\n请留下一条评论。要求：5-25字，符合性格，不加引号，直接输出文本。"
        try:
            resp = await self.client.chat.completions.create(model=settings.LLM_MODEL, messages=[{"role": "user", "content": prompt}], temperature=0.9, max_tokens=60)
            return (resp.choices[0].message.content or "").strip().replace('"', "")
        except Exception: return "赞！"

    async def chat_stream(self, prompt: str, temperature: float = 0.3):
        resp = await self.client.chat.completions.create(model=settings.LLM_MODEL, messages=[{"role": "user", "content": prompt}], temperature=temperature, max_tokens=2048, stream=True)
        async for chunk in resp:
            if chunk.choices and chunk.choices[0].delta.content: yield chunk.choices[0].delta.content

ai_service = AIService()