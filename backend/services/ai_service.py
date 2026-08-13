import base64
import io
import time
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse
import httpx
from openai import AsyncOpenAI
from ..config import settings

# 本地生图（方案三）的落盘目录，main.py 已将其挂载为 /generated
GENERATED_DIR = Path(__file__).resolve().parent.parent / "generated_images"
# 聊天图片上传目录，main.py 会挂载为 /uploads/chat
CHAT_UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads" / "chat"
# 朋友圈本地图片池目录
MOMENTS_POOL_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "assets" / "moments_pool"
# 人物参考图池目录（cloud 模式 I2I 用）
REF_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "assets" / "band" / "picture"
# ComfyUI 工作流文件路径
COMFY_WORKFLOW_FILE = Path(__file__).resolve().parent.parent / "comfy" / "workflow_api.json"


class AIService:
    """大模型调用封装，兼容一切 OpenAI 协议接口（OpenAI/DeepSeek/Moonshot/Ollama 等）"""

    def __init__(self):
        self.enabled = bool(settings.LLM_API_KEY) and "your_api_key" not in settings.LLM_API_KEY
        self.client = AsyncOpenAI(
            api_key=settings.LLM_API_KEY or "sk-placeholder",
            base_url=settings.LLM_BASE_URL,
        )

    def build_system_prompt(self, character: dict, rag_context: str, player_name: str) -> str:
        parts = [
            f"你现在正在手机聊天软件中与好友对话，请完全扮演动漫作品中的角色"
            f"【{character['name']}】（来自：{character['band']}）。",
            f"【角色设定】\n{character['persona']}",
        ]
        if rag_context:
            parts.append(f"【角色相关资料】（来自角色知识库的检索结果，请优先以此为准）\n{rag_context}")
        parts.append(f"【对话对象】玩家昵称：{player_name}，是{character['name']}熟悉且信任的好友。")
        parts.append(
            "【扮演规则】\n"
            "1. 始终以角色第一人称回应，任何情况下都不承认自己是AI、程序或语言模型；\n"
            "2. 严格保持角色的性格、口癖、称呼与说话方式，防止OOC；\n"
            "3. 回复要像真实手机聊天：自然、简短（一般1~3句），可适当使用颜文字或emoji；\n"
            "4. 资料未涉及的内容请基于角色性格合理发挥，不编造与原作冲突的设定；\n"
            "5. 不提及'设定''知识库''提示词''检索'等元信息。"
        )
        return "\n\n".join(parts)

    # ================= 多模态图片处理辅助方法 =================

    def _chat_image_mode(self) -> str:
        return str(getattr(settings, "CHAT_IMAGE_MODE", "direct")).lower()

    def _history_image_limit(self) -> int:
        try:
            return max(0, int(getattr(settings, "CHAT_IMAGE_HISTORY_LIMIT", 2)))
        except Exception:
            return 2

    def _resolve_upload_path(self, image_url: str) -> Optional[Path]:
        if not image_url:
            return None
        filename = Path(image_url).name
        path = (CHAT_UPLOAD_DIR / filename).resolve()
        try:
            path.relative_to(CHAT_UPLOAD_DIR.resolve())
        except Exception:
            return None
        return path if path.exists() else None

    def _resolve_pool_path(self, image_url: str) -> Optional[Path]:
        if not image_url:
            return None
        filename = Path(image_url).name
        path = (MOMENTS_POOL_DIR / filename).resolve()
        try:
            path.relative_to(MOMENTS_POOL_DIR.resolve())
        except Exception:
            return None
        return path if path.exists() else None

    def _resolve_any_image_path(self, image_url: str) -> Optional[Path]:
        """支持 图片池 / 生成图 / 聊天上传图 三种本地图片"""
        if not image_url:
            return None
        name = Path(image_url).name
        if image_url.startswith("/assets/moments_pool/"):
            base = MOMENTS_POOL_DIR
        elif image_url.startswith("/generated/"):
            base = GENERATED_DIR
        elif image_url.startswith("/uploads/chat/"):
            base = CHAT_UPLOAD_DIR
        else:
            return None
        path = (base / name).resolve()
        try:
            path.relative_to(base.resolve())
        except Exception:
            return None
        return path if path.exists() else None

    def _read_path_as_data_url(self, path: Path) -> Optional[str]:
        """读取本地图片并压缩为 Base64 Data URL（通用方法）"""
        try:
            mime_map = {
                ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
                ".webp": "image/webp", ".gif": "image/gif",
            }
            mime = mime_map.get(path.suffix.lower(), "image/jpeg")

            try:
                from PIL import Image
                img = Image.open(path)
                if img.mode != "RGB" and mime == "image/jpeg":
                    img = img.convert("RGB")
                max_side = int(getattr(settings, "CHAT_IMAGE_MAX_SIDE", 1024))
                if max_side > 0 and max(img.size) > max_side:
                    img.thumbnail((max_side, max_side))
                buf = io.BytesIO()
                save_format = "JPEG" if mime == "image/jpeg" else img.format or "PNG"
                img.save(buf, format=save_format, quality=85)
                data = buf.getvalue()
            except Exception:
                data = path.read_bytes()

            b64 = base64.b64encode(data).decode("utf-8")
            return f"data:{mime};base64,{b64}"
        except Exception:
            return None

    def _read_image_as_data_url(self, image_url: str) -> Optional[str]:
        path = self._resolve_upload_path(image_url)
        if not path:
            return None
        return self._read_path_as_data_url(path)

    def _build_user_content(self, m, include_image: bool):
        text = (getattr(m, "content", "") or "").strip()
        image_url = getattr(m, "image_url", "") or ""

        if include_image and image_url and self._chat_image_mode() != "off":
            data_url = self._read_image_as_data_url(image_url)
            if data_url:
                return [
                    {"type": "text", "text": text or "（用户发送了一张图片）"},
                    {"type": "image_url", "image_url": {"url": data_url}},
                ]

        if image_url and not text:
            return "（用户发送了一张图片）"

        return text or "……"

    def _build_chat_messages(self, character, history, rag_context, player_name, with_images: bool):
        messages = [
            {"role": "system",
             "content": self.build_system_prompt(character, rag_context, player_name)}
        ]

        image_ids = set()
        if with_images and self._chat_image_mode() != "off":
            all_image_ids = [
                getattr(m, "id", None)
                for m in history
                if getattr(m, "role", "") == "user" and (getattr(m, "image_url", "") or "")
            ]
            limit = self._history_image_limit()
            if limit > 0:
                image_ids = set(all_image_ids[-limit:])

        for m in history:
            if m.role == "user":
                include_image = getattr(m, "id", None) in image_ids
                content = self._build_user_content(m, include_image)
                messages.append({"role": "user", "content": content})
            elif m.role == "character":
                messages.append({"role": "assistant", "content": m.content})

        return messages

    async def _create_chat_completion(self, messages):
        resp = await self.client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=messages,
            temperature=settings.LLM_TEMPERATURE,
            max_tokens=400,
        )
        return (resp.choices[0].message.content or "").strip() or "……"

    # ================= 核心聊天方法 =================

    async def chat_reply(self, character, history, user_text, rag_context, player_name) -> str:
        if not self.enabled:
            return f"（{character['name']}暂时无法回应：请先在 .env 中配置 LLM_API_KEY 并重启～）"

        # [新增] 开始计时
        start_time = time.time()

        messages = self._build_chat_messages(
            character, history, rag_context, player_name, with_images=True
        )
        if not any(m.get("role") == "user" for m in messages[1:]) and user_text:
            messages.append({"role": "user", "content": user_text})

        try:
            resp = await self._create_chat_completion(messages)
            
            # [新增] 结束计时并打印到控制台
            end_time = time.time()
            duration = end_time - start_time
            print(f"⏱️ [模型测速] 模型: {settings.LLM_MODEL} | 耗时: {duration:.3f}秒 | 输入: {user_text[:20]}...")
            
            return resp
        except Exception as e:
            has_image = any(
                isinstance(m.get("content"), list)
                for m in messages[1:] if m.get("role") == "user"
            )
            if has_image:
                try:
                    print(f"[图片聊天] 多模态调用失败，尝试纯文本回退：{e}")
                    fallback_messages = self._build_chat_messages(
                        character, history, rag_context, player_name, with_images=False
                    )
                    if not any(m.get("role") == "user" for m in fallback_messages[1:]) and user_text:
                        fallback_messages.append({"role": "user", "content": user_text})
                    return await self._create_chat_completion(fallback_messages)
                except Exception:
                    pass
            return f"（AI 服务调用失败：{type(e).__name__}: {e}）"

    # ================= 朋友圈配文 =================

    async def generate_caption(self, character: dict, location: str, scene: str = None) -> Optional[str]:
        if not self.enabled:
            return None
        # 如果提供了生图提示词(scene)，则让配文参考该场景，避免与画面冲突
        if scene:
            scene_text = f"你正在以下场景游玩：{scene}。"
        else:
            scene_text = f"你正在{location}旅游。"
        try:
            resp = await self.client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[
                    {"role": "system",
                     "content": f"你是动漫角色【{character['name']}】。{character['persona']}"},
                    {"role": "user",
                     "content": (f"{scene_text}要发一条朋友圈。"
                                 f"请以{character['name']}的口吻写配文，不超过30字，活泼自然，不加引号。")},
                ],
                temperature=0.9, max_tokens=80,
            )
            return (resp.choices[0].message.content or "").strip()
        except Exception:
            return None

    async def generate_caption_from_image(self, character: dict, image_url: str,
                                          people_hint: str = "", location: str = "") -> Optional[str]:
        """多模态配图配文：把用户选择的图片发给视觉模型，结合提示生成文案。"""
        if not self.enabled:
            return None
        path = self._resolve_pool_path(image_url)
        if not path:
            return None
        data_url = self._read_path_as_data_url(path)
        if not data_url:
            return None

        hint = (people_hint or "").strip()
        hint_text = f"用户告诉你，图中的人物是：{hint}。" if hint else "用户没有说明图中人物，请根据图片内容自行识别。"
        loc_text = f"地点大致在{location}。" if location else ""

        try:
            resp = await self.client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[
                    {"role": "system",
                     "content": f"你是动漫角色【{character['name']}】。{character['persona']}"},
                    {"role": "user", "content": [
                        {"type": "text", "text": (
                            f"我要以你的口吻发一条朋友圈，图片已经选好。{hint_text}{loc_text}\n"
                            f"请结合图片内容，以{character['name']}的口吻写一条朋友圈配文，"
                            f"不超过40字，活泼自然，不加引号，不要提及'图片是生成的'之类的话。"
                        )},
                        {"type": "image_url", "image_url": {"url": data_url}},
                    ]},
                ],
                temperature=0.9,
                max_tokens=100,
            )
            return ((resp.choices[0].message.content or "").strip()
                    .replace('"', "").replace("“", "").replace("”", ""))
        except Exception as e:
            print(f"[看图配文] 多模态调用失败：{e}")
            return None

    async def comment_reply(self, character: Optional[dict], author_name: str, comment_text: str) -> Optional[str]:
        if not character:
            return None
        if not self.enabled:
            return f"谢谢{author_name}～♪"
        try:
            resp = await self.client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[
                    {"role": "system",
                     "content": f"你是动漫角色【{character['name']}】。{character['persona']}"},
                    {"role": "user",
                     "content": (f"好友{author_name}在你的朋友圈下评论：{comment_text}\n"
                                 f"请以{character['name']}的身份回复，15字以内，不加引号。")},
                ],
                temperature=0.9, max_tokens=60,
            )
            return (resp.choices[0].message.content or "").strip()
        except Exception:
            return f"谢谢{author_name}～♪"

    # ================= 三轨生图 =================

    async def generate_image(self, prompt: str, source: str = "cloud",
                             reference_images: list = None) -> Optional[str]:
        if source == "local":
            return await self.generate_image_local(prompt)
        return await self.generate_image_cloud(prompt, reference_images or [])

    async def generate_image_cloud(self, prompt: str, reference_images: list = None) -> Optional[str]:
        """云端生图调度：qwen-image 系列走 DashScope 原生接口（支持参考图 I2I），
        其余模型走 OpenAI 兼容 /images/generations。"""
        model = (settings.IMAGE_MODEL or "").strip()
        if not self.enabled or not model:
            print("[云端生图] ⚠️ 未启用或未配置 IMAGE_MODEL")
            return None
        if model.lower().startswith("qwen-image"):
            return await self._generate_image_qwen_native(prompt, reference_images or [])
        return await self._generate_image_openai_compat(prompt)

    async def _generate_image_openai_compat(self, prompt: str) -> Optional[str]:
        try:
            print(f"[云端生图] 🚀 OpenAI 兼容接口，模型 {settings.IMAGE_MODEL}")
            resp = await self.client.images.generate(
                model=settings.IMAGE_MODEL, prompt=prompt, size="1024x1024", n=1)
            if hasattr(resp.data[0], "url") and resp.data[0].url:
                return resp.data[0].url
            print(f"[云端生图] ⚠️ 返回结构异常: {resp.data[0]}")
            return None
        except Exception as e:
            print(f"[云端生图] ❌ 调用失败: {type(e).__name__}: {e}")
            return None

    def _ref_image_data_urls(self, reference_images: list) -> list:
        """把本地参考图按用户选择顺序读取为 base64 data URL（最多3张）"""
        urls = []
        for u in reference_images[:3]:
            p = (REF_DIR / Path(u).name).resolve()
            if not p.exists():
                continue
            try:
                data = p.read_bytes()
                b64 = base64.b64encode(data).decode("utf-8")
                mime = {".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                        ".png": "image/png", ".webp": "image/webp"}.get(p.suffix.lower(), "image/jpeg")
                urls.append(f"data:{mime};base64,{b64}")
            except Exception as e:
                print(f"[云端生图] ️ 参考图读取失败 {u}: {e}")
        return urls

    async def _generate_image_qwen_native(self, prompt: str, reference_images: list) -> Optional[str]:
        """DashScope 原生 multimodal-generation 接口（qwen-image-3.0 系列）。
        参考图按顺序放入 content，模型据此保持人物一致性。"""
        model = settings.IMAGE_MODEL.strip().lower()
        parsed = urlparse(settings.LLM_BASE_URL)
        base = f"{parsed.scheme}://{parsed.netloc}"
        url = f"{base}/api/v1/services/aigc/multimodal-generation/generation"

        content = []
        ref_urls = self._ref_image_data_urls(reference_images)
        for ru in ref_urls:
            content.append({"image": ru})

        text = prompt
        if ref_urls:
            n = len(ref_urls)
            order = "参考图1" if n == 1 else f"参考图1至参考图{n}"
            text = (f"提供了{n}张人物参考图（按顺序为{order}），"
                    f"请保持画面中人物的外貌、发型、服装与参考图一致。"
                    f"场景与内容要求：{prompt}")
        content.append({"text": text})

        payload = {
            "model": model,
            "input": {"messages": [{"role": "user", "content": content}]},
            "parameters": {"prompt_extend": True, "n": 1, "watermark": False},
        }
        headers = {
            "Authorization": f"Bearer {settings.LLM_API_KEY}",
            "Content-Type": "application/json",
        }

        try:
            print(f"[云端生图] 🚀 DashScope 原生接口，模型 {model}，参考图 {len(ref_urls)} 张")
            async with httpx.AsyncClient(timeout=300) as client:
                resp = await client.post(url, json=payload, headers=headers)
                if resp.status_code != 200:
                    print(f"[云端生图] ❌ HTTP {resp.status_code}: {resp.text[:500]}")
                    return None
                data = resp.json()

            image_url = data["output"]["choices"][0]["message"]["content"][0]["image"]

            # 下载落盘，避免 24 小时临时链接失效
            async with httpx.AsyncClient(timeout=120) as client:
                img_resp = await client.get(image_url)
                img_resp.raise_for_status()

            GENERATED_DIR.mkdir(parents=True, exist_ok=True)
            filename = f"cloud_{int(time.time())}.png"
            (GENERATED_DIR / filename).write_bytes(img_resp.content)
            print(f"[云端生图] ✅ 已保存到 /generated/{filename}")
            return f"/generated/{filename}"
        except Exception as e:
            print(f"[云端生图]  调用失败: {type(e).__name__}: {e}")
            return None

    # ---------- 方案三：本地生图（ComfyUI / SD WebUI） ----------

    async def generate_image_local(self, prompt: str, reference_images: list = None) -> Optional[str]:
        local_url = getattr(settings, "LOCAL_IMAGE_API_URL", "").rstrip("/")
        if not local_url:
            return None
        if getattr(settings, "LOCAL_IMAGE_BACKEND", "comfy") == "comfy":
            return await self._generate_image_comfy(prompt, reference_images or [])
        return await self._generate_image_sdwebui(prompt)

    async def _comfy_upload(self, local_url: str, path: Path) -> Optional[str]:
        """把参考图上传到 ComfyUI 的 input 目录，返回文件名"""
        filename = f"animechat_{uuid.uuid4().hex[:8]}{path.suffix.lower()}"
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                with open(path, "rb") as f:
                    resp = await client.post(
                        f"{local_url}/upload/image",
                        files={"image": (filename, f, path.suffix.lstrip(".") or "png")},
                        data={"overwrite": "true"},
                    )
                resp.raise_for_status()
                return resp.json().get("name", filename)
        except Exception as e:
            print(f"[ComfyUI] ⚠️ 参考图上传失败 {path.name}: {e}")
            return None

    async def _generate_image_comfy(self, prompt: str, reference_images: list) -> Optional[str]:
        """通过 ComfyUI API 执行 backend/comfy/workflow_api.json 工作流。
        自动上传参考图（最多 3 张）、注入提示词/反向提示词/种子、可选 4 步加速。"""
        if not COMFY_WORKFLOW_FILE.exists():
            print("[ComfyUI] ❌ 未找到 backend/comfy/workflow_api.json。"
                  "请在 ComfyUI 中开启 Dev mode，点击 Save (API Format)，"
                  "保存为该文件后重试。")
            return None

        ref_paths = []
        for u in reference_images[:3]:
            p = (REF_DIR / Path(u).name).resolve()
            if p.exists():
                ref_paths.append(p)
        if not ref_paths:
            print("[ComfyUI] ⚠️ 未选择参考图：Qwen-Image-Edit 工作流至少需要 1 张参考图")
            return None

        try:
            workflow = json.loads(COMFY_WORKFLOW_FILE.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"[ComfyUI] ❌ 工作流解析失败: {e}")
            return None

        # 1) 上传参考图
        ref_names = []
        for p in ref_paths:
            name = await self._comfy_upload(local_url_getattr(), p)
            if name:
                ref_names.append(name)

        # 2) 按顺序分配 LoadImage 节点；多余的 LoadImage 节点连同连线一起移除
        load_ids = sorted(
            [nid for nid, n in workflow.items() if n.get("class_type") == "LoadImage"],
            key=lambda x: int(x) if str(x).isdigit() else 0,
        )
        for i, nid in enumerate(load_ids):
            if i < len(ref_names):
                workflow[nid]["inputs"]["image"] = ref_names[i]
            else:
                for other in workflow.values():
                    ins = other.get("inputs", {})
                    for k in [k for k, v in ins.items()
                              if isinstance(v, list) and len(v) == 2 and str(v[0]) == str(nid)]:
                        del ins[k]
                del workflow[nid]

        # 3) 注入提示词 / 反向提示词 / 加速开关 / 随机种子
        patched = False
        for nid, node in workflow.items():
            ins = node.get("inputs", {})
            # 子图节点：同时含 prompt 与图像连线输入
            if "prompt" in ins and any(isinstance(v, list) and len(v) == 2 for v in ins.values()):
                ins["prompt"] = prompt
                if "prompt_1" in ins:
                    ins["prompt_1"] = settings.COMFY_NEGATIVE_PROMPT
                if "value" in ins and isinstance(ins["value"], bool):
                    ins["value"] = settings.COMFY_TURBO_MODE
                if "seed" in ins and isinstance(ins["seed"], int):
                    ins["seed"] = random.randint(0, 2_000_000_000_000_000)
                patched = True
        # 兜底：若工作流被展平（无子图），定位正向 TextEncodeQwenImageEditPlus 节点
        if not patched:
            for nid, node in workflow.items():
                ct = str(node.get("class_type", ""))
                if "TextEncodeQwenImageEdit" in ct:
                    ins = node.get("inputs", {})
                    cur = ins.get("prompt", "")
                    if isinstance(cur, str) and cur.strip():
                        ins["prompt"] = prompt
                        patched = True
        if not patched:
            print("[ComfyUI] ❌ 未能在工作流中定位提示词节点，请确认导出的是 API 格式")
            return None

        # 4) 提交任务
        local_url = local_url_getattr()
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                resp = await client.post(f"{local_url}/prompt", json={"prompt": workflow})
                if resp.status_code != 200:
                    print(f"[ComfyUI] ❌ 提交失败 HTTP {resp.status_code}: {resp.text[:500]}")
                    return None
                prompt_id = resp.json()["prompt_id"]
        except Exception as e:
            print(f"[ComfyUI] ❌ 提交失败: {type(e).__name__}: {e}")
            return None
        print(f"[ComfyUI] 🚀 任务已提交 {prompt_id}（turbo={settings.COMFY_TURBO_MODE}，"
              f"参考图 {len(ref_names)} 张）。本地生图较慢，请耐心等待…")

        # 5) 轮询历史结果
        timeout = max(60, settings.COMFY_TIMEOUT)
        deadline = time.time() + timeout
        history = None
        async with httpx.AsyncClient(timeout=30) as client:
            while time.time() < deadline:
                await asyncio.sleep(3)
                try:
                    r = await client.get(f"{local_url}/history/{prompt_id}")
                    data = r.json()
                    if prompt_id in data:
                        history = data[prompt_id]
                        break
                except Exception:
                    pass
        if history is None:
            print(f"[ComfyUI] ❌ 超时（{timeout}s）未获得结果")
            return None
        if history.get("status", {}).get("status_str") == "error":
            print(f"[ComfyUI] ❌ 任务执行出错: {history.get('status')}")
            return None

        # 6) 提取并下载结果图，落盘到 /generated
        image_info = None
        for node_out in history.get("outputs", {}).values():
            imgs = node_out.get("images", [])
            if imgs:
                image_info = imgs[0]
                break
        if not image_info:
            print("[ComfyUI] ❌ 输出中未找到图片")
            return None
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                r = await client.get(
                    f"{local_url}/view",
                    params={
                        "filename": image_info["filename"],
                        "subfolder": image_info.get("subfolder", ""),
                        "type": image_info.get("type", "output"),
                    },
                )
                r.raise_for_status()
            GENERATED_DIR.mkdir(parents=True, exist_ok=True)
            filename = f"comfy_{int(time.time())}.png"
            (GENERATED_DIR / filename).write_bytes(r.content)
            print(f"[ComfyUI] ✅ 已保存到 /generated/{filename}")
            return f"/generated/{filename}"
        except Exception as e:
            print(f"[ComfyUI] ❌ 下载结果图失败: {type(e).__name__}: {e}")
            return None

    async def _generate_image_sdwebui(self, prompt: str) -> Optional[str]:
        """旧版 SD WebUI txt2img 通道（LOCAL_IMAGE_BACKEND=sdwebui 时使用）"""
        local_url = getattr(settings, "LOCAL_IMAGE_API_URL", "").rstrip("/")
        try:
            payload = {
                "prompt": f"anime style, masterpiece, best quality, {prompt}",
                "negative_prompt": "bad anatomy, bad hands, missing fingers, extra digit, "
                                   "fewer digits, cropped, worst quality, low quality",
                "steps": 20,
                "width": 1024,
                "height": 1024,
            }
            async with httpx.AsyncClient(timeout=180) as client:
                resp = await client.post(f"{local_url}/sdapi/v1/txt2img", json=payload)
                resp.raise_for_status()
                data = resp.json()

            raw = data["images"][0]
            b64 = raw.split(",", 1)[-1] if "," in raw else raw
            img_bytes = base64.b64decode(b64)

            GENERATED_DIR.mkdir(parents=True, exist_ok=True)
            filename = f"local_{int(time.time())}.png"
            (GENERATED_DIR / filename).write_bytes(img_bytes)

            return f"/generated/{filename}"
        except Exception as e:
            print(f"[本地图像生成] ❌ 调用失败: {type(e).__name__}: {e}")
            return None

    # ================= 朋友圈评论生成 =================

    async def generate_moment_comment(self, author_name: str, caption: str, commenter: dict,
                                      context: list, relation_tier: str = "") -> str:
        if not self.enabled:
            return "好棒！♪"

        tier_hint = {
            "close": "你们俩是极为亲密的挚友（CP级羁绊），语气可以亲昵、黏人或护短。",
            "teammates": "你们俩是同伴，可以围绕日常、练习或吐槽评论。",
            "rivals": "你们俩平时经常互怼、拌嘴，语气可以吐槽、挑衅或傲娇。",
        }.get(relation_tier, "你们俩是相识的朋友。")

        context_str = "\n".join([f"- {c['author_name']}: {c['content']}" for c in context]) if context else "暂无"

        prompt = f"""你是【{commenter['name']}】（{commenter['persona']}）。
你的好友【{author_name}】发了一条朋友圈："{caption}"
【你与发帖人的关系】{tier_hint}
已有的评论：
{context_str}

请以你的口吻在下方留下一条评论或回复上面的评论。
【严格要求】：
1. 极度简短（5-25字），像真实的微信朋友圈评论，绝对不要加引号！
2. 严格符合你的性格、口癖，可使用emoji。
3. 如果是回复特定的人，请自然地接话。
4. 直接输出评论文本，不要任何解释、前缀或动作描写。"""

        try:
            resp = await self.client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.9, max_tokens=60,
            )
            return ((resp.choices[0].message.content or "").strip()
                    .replace('"', "").replace("“", "").replace("”", ""))
        except Exception:
            return "赞！"

    # ================= 流式文本 =================

    async def chat_stream(self, prompt: str, temperature: float = 0.3):
        if not self.enabled:
            raise RuntimeError("LLM_API_KEY 未配置")

        resp = await self.client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=2048,
            stream=True,
        )

        async for chunk in resp:
            if not chunk.choices:
                continue
            delta = chunk.choices[0].delta
            if delta and delta.content:
                yield delta.content


def local_url_getattr() -> str:
    return getattr(settings, "LOCAL_IMAGE_API_URL", "").rstrip("/")


ai_service = AIService()