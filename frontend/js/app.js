// ============ 工具 ============
const $ = (s) => document.querySelector(s);
async function api(path, options = {}) {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, ...options });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
function esc(s) {
  const d = document.createElement("div");
  d.textContent = s ?? "";
  return d.innerHTML;
}
function fmtTime(ts) {
  if (!ts) return "";
  const d = new Date(ts.replace(" ", "T")), now = new Date();
  const hm = d.toTimeString().slice(0, 5);
  return d.toDateString() === now.toDateString()
    ? hm
    : `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), 2500);
}

// ============ 状态 ============
const state = {
  friends: [], current: null, ws: null,
  unread: JSON.parse(localStorage.getItem("unread") || "{}"),
  liked: JSON.parse(localStorage.getItem("liked_posts") || "[]"),
  playerName: localStorage.getItem("player_name") || "",
  playerAvatar: localStorage.getItem("player_avatar") || "",
  pendingImage: null, pendingImagePreview: "",
  selectedPoolImage: "",
  selectedRefImages: [], refTempSelection: [],
};
const saveUnread = () => localStorage.setItem("unread", JSON.stringify(state.unread));
const saveLiked = () => localStorage.setItem("liked_posts", JSON.stringify(state.liked));

// ============ 模型测速数据（手动填写） ============
const BENCHMARK_QUESTIONS = [
  "今天过得怎么样",
  "（发送一张爱音图片）你看这是谁呀",
  "请帮我写一首关于夏天的短诗",
];
// 所有模型的实测耗时（秒），"-" 表示未测。请自行填写。
const BENCHMARK_DATA = {
  "qwen3.7-plus（阿里云百炼api）": ["8.089秒", "10.156秒", "12.657秒"],
  "qwen-plus（阿里云百炼api）": ["1.774秒", "无视觉", "2.537秒"],
  "unsloth/Qwen3.6-35B-A3B-GGUF（本地LM Studio，16K）": ["2.253秒", "3.982秒", "3.561秒"],
  "qwen3.7-flash（阿里云百炼api）": ["5.409秒", "6.422秒", "6.664秒"],
  "qwen3.6-27b（阿里云百炼api）": ["25.458秒", "15.593秒", "26.325秒"],
};
// 左侧固定展示的模型
const BENCHMARK_FIXED_MODELS = [
  "qwen3.7-plus（阿里云百炼api）",
  "qwen-plus（阿里云百炼api）",
  "unsloth/Qwen3.6-35B-A3B-GGUF（本地LM Studio，16K）",
];

function renderBenchmark() {
  const select = $("#benchmark-select");
  if (select.options.length === 0) {
    Object.keys(BENCHMARK_DATA).forEach((name) => {
      if (!BENCHMARK_FIXED_MODELS.includes(name)) {
        const opt = document.createElement("option");
        opt.value = name; opt.textContent = name;
        select.appendChild(opt);
      }
    });
  }
  const dynamicModel = select.value || Object.keys(BENCHMARK_DATA).find((n) => !BENCHMARK_FIXED_MODELS.includes(n));

  const headerRow = $("#benchmark-header-row");
  headerRow.innerHTML = "";
  const thSlant = document.createElement("th");
  thSlant.className = "slant-header-cell";
  thSlant.innerHTML = `<span class="slant-top">模型</span><span class="slant-bottom">测试问题</span>`;
  headerRow.appendChild(thSlant);
  BENCHMARK_FIXED_MODELS.forEach((name) => {
    const th = document.createElement("th");
    th.className = "benchmark-model-header";
    th.textContent = name;
    headerRow.appendChild(th);
  });
  const thDyn = document.createElement("th");
  thDyn.className = "benchmark-model-header benchmark-dynamic-header";
  thDyn.textContent = dynamicModel;
  headerRow.appendChild(thDyn);

  const tbody = $("#benchmark-body");
  tbody.innerHTML = "";
  BENCHMARK_QUESTIONS.forEach((q, i) => {
    const tr = document.createElement("tr");
    const tdQ = document.createElement("td");
    tdQ.className = "benchmark-question-cell";
    tdQ.textContent = q;
    tr.appendChild(tdQ);
    BENCHMARK_FIXED_MODELS.forEach((name) => {
      const td = document.createElement("td");
      td.textContent = (BENCHMARK_DATA[name] || [])[i] || "-";
      tr.appendChild(td);
    });
    const tdD = document.createElement("td");
    tdD.className = "benchmark-dynamic-cell";
    tdD.textContent = (BENCHMARK_DATA[dynamicModel] || [])[i] || "-";
    tr.appendChild(tdD);
    tbody.appendChild(tr);
  });
}

// ============ 好友列表 ============
async function loadFriends() {
  state.friends = await api("/api/friends");
  renderFriendList($("#search-input").value.trim());
}
function renderFriendList(keyword = "") {
  const box = $("#friend-list");
  box.innerHTML = "";
  state.friends.filter((f) => !keyword || f.name.includes(keyword)).forEach((f) => {
    const unread = state.unread[f.id] || 0;
    const div = document.createElement("div");
    div.className = "friend-item " + (state.current === f.id ? "active" : "");
    div.innerHTML = `
      <img class="avatar" src="${f.avatar}" alt="">
      <div class="friend-info">
        <div class="friend-top"><span class="friend-name">${esc(f.name)}</span><span class="friend-time">${fmtTime(f.last_time)}</span></div>
        <div class="friend-bottom"><span class="last-msg">${esc(f.last_message)}</span>${unread ? `<span class="badge">${unread}</span>` : ""}</div>
      </div>`;
    div.onclick = () => selectChat(f.id);
    box.appendChild(div);
  });
}

// ============ 聊天 ============
async function selectChat(id) {
  state.current = id; state.unread[id] = 0; saveUnread();
  renderFriendList($("#search-input").value.trim());
  $("#chat-placeholder").classList.add("hidden");
  $("#chat-view").classList.remove("hidden");
  const f = state.friends.find((x) => x.id === id) || {};
  $("#chat-avatar").src = f.avatar;
  $("#chat-name").textContent = f.name;
  $("#chat-band").textContent = f.band;
  const msgs = await api(`/api/chat/${id}/history`);
  const box = $("#messages"); box.innerHTML = "";
  msgs.forEach((m) => appendMessage(m));
  scrollBottom();
}
function appendMessage(m, ragContext) {
  const f = state.friends.find((x) => x.id === m.character_id) || {};
  const mine = m.role === "user";
  const div = document.createElement("div");
  div.className = "msg-row " + (mine ? "mine" : "theirs");
  const avatarHtml = mine
    ? state.playerAvatar
      ? `<img class="me-avatar" src="${state.playerAvatar}" alt="">`
      : `<div class="me-avatar">${esc((state.playerName || "我").slice(0, 1))}</div>`
    : `<img class="avatar" src="${f.avatar}" alt="">`;
  const imageHtml = m.image_url ? `<img class="bubble-img" src="${m.image_url}" alt="聊天图片" title="点击查看大图">` : "";
  const textHtml = m.content ? `<div class="bubble-text">${esc(m.content)}</div>` : "";
  let bubbleInner = imageHtml + textHtml;
  if (!bubbleInner) bubbleInner = `<div class="bubble-text">……</div>`;
  const bodyHtml = `<div class="msg-body"><div class="bubble">${bubbleInner}</div>${ragContext ? `<details class="rag-debug"><summary>本次检索到的角色记忆</summary>${esc(ragContext)}</details>` : ""}</div>`;
  div.innerHTML = mine ? bodyHtml + avatarHtml : avatarHtml + bodyHtml;
  $("#messages").appendChild(div);
}
const scrollBottom = () => { const b = $("#messages"); b.scrollTop = b.scrollHeight; };
const showTyping = (on) => $("#typing-indicator").classList.toggle("hidden", !on);
async function sendMessage() {
  const input = $("#chat-input"), content = input.value.trim();
  const id = state.current;
  if (!id || (!content && !state.pendingImage)) return;
  input.value = "";
  const pendingFile = state.pendingImage;
  const localImageUrl = pendingFile ? state.pendingImagePreview : "";
  appendMessage({ role: "user", content, image_url: localImageUrl, character_id: id });
  scrollBottom(); showTyping(true);
  try {
    let data;
    if (pendingFile) {
      const fd = new FormData();
      fd.append("file", pendingFile); fd.append("content", content);
      if (state.playerName) fd.append("player_name", state.playerName);
      const res = await fetch(`/api/chat/${id}/send-image`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      data = await res.json();
      clearChatImagePreview();
    } else {
      data = await api(`/api/chat/${id}/send`, { method: "POST", body: JSON.stringify({ content, player_name: state.playerName || undefined }) });
    }
    appendMessage(data.reply, data.rag_context);
  } catch (e) {
    appendMessage({ role: "character", content: "（网络错误：" + e.message + "）", character_id: id });
  } finally { showTyping(false); scrollBottom(); loadFriends(); }
}
async function poke() {
  if (!state.current) return;
  const m = await api(`/api/chat/${state.current}/poke`, { method: "POST" });
  appendMessage(m); scrollBottom(); loadFriends();
}

// ============ 聊天图片处理 ============
function clearChatImagePreview() {
  state.pendingImage = null; state.pendingImagePreview = "";
  const input = $("#chat-image-input"); if (input) input.value = "";
  const box = $("#chat-image-preview"); if (box) box.classList.add("hidden");
  const img = $("#chat-image-preview-img"); if (img) img.src = "";
}
function initChatImage() {
  const btn = $("#btn-choose-chat-image"), input = $("#chat-image-input"), removeBtn = $("#btn-remove-chat-image");
  if (!btn || !input) return;
  btn.onclick = () => input.click();
  input.addEventListener("change", () => {
    const file = input.files[0]; if (!file) return;
    if (!file.type.startsWith("image/")) { toast("请选择图片文件"); input.value = ""; return; }
    const maxMB = 10;
    if (file.size > maxMB * 1024 * 1024) { toast(`图片不能超过 ${maxMB}MB`); input.value = ""; return; }
    state.pendingImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      state.pendingImagePreview = reader.result;
      const previewImg = $("#chat-image-preview-img"), previewBox = $("#chat-image-preview");
      if (previewImg && previewBox) { previewImg.src = reader.result; previewBox.classList.remove("hidden"); }
    };
    reader.readAsDataURL(file);
  });
  if (removeBtn) removeBtn.onclick = clearChatImagePreview;
}

// ============ 图片点击放大 ============
function initImageZoom() {
  document.addEventListener("click", (e) => {
    const target = e.target; if (!target) return;
    const zoomable = target.classList.contains("bubble-img") || target.classList.contains("moment-img");
    if (!zoomable) return;
    const modal = document.createElement("div");
    modal.style.cssText = `position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; cursor: zoom-out; opacity: 0; transition: opacity 0.2s;`;
    const img = document.createElement("img");
    img.src = target.src;
    img.style.cssText = `max-width: 90vw; max-height: 90vh; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transform: scale(0.9); transition: transform 0.2s;`;
    modal.appendChild(img); document.body.appendChild(modal);
    requestAnimationFrame(() => { modal.style.opacity = "1"; img.style.transform = "scale(1)"; });
    const close = () => { modal.style.opacity = "0"; img.style.transform = "scale(0.9)"; setTimeout(() => modal.remove(), 200); };
    modal.onclick = close;
  });
}

// ============ WebSocket ============
function connectWS() {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  state.ws = new WebSocket(`${proto}://${location.host}/ws`);
  state.ws.onmessage = (ev) => {
    const data = JSON.parse(ev.data);
    if (data.type === "message") {
      const m = data.message;
      if (state.current === m.character_id && !$("#chat-view").classList.contains("hidden")) { appendMessage(m); scrollBottom(); }
      else { state.unread[m.character_id] = (state.unread[m.character_id] || 0) + 1; saveUnread(); }
      loadFriends();
    } else if (data.type === "moment") {
      toast("📷 有好友发布了新的朋友圈动态！");
      if (!$("#moments-panel").classList.contains("hidden")) loadMoments();
    }
  };
  state.ws.onclose = () => setTimeout(connectWS, 3000);
}

// ============ 朋友圈 ============
async function loadMoments() {
  const posts = await api("/api/moments");
  const feed = $("#moments-feed"); feed.innerHTML = "";
  posts.forEach((p) => {
    const el = document.createElement("div"); el.className = "moment-card";
    el.innerHTML = `
      <div class="moment-head"><img class="avatar" src="${p.avatar}" alt=""><div><div class="moment-name">${esc(p.character_name)}</div><div class="moment-loc">📍 ${esc(p.location || "")} · ${esc(p.created_at.slice(5, 16))}</div></div></div>
      <div class="moment-caption">${esc(p.caption)}</div>
      <img class="moment-img" src="${p.image_url}" loading="lazy" alt="" title="点击查看大图">
      <div class="moment-actions"><button class="like-btn ${state.liked.includes(p.id) ? "liked" : ""}" data-id="${p.id}">💗 ${p.likes}</button></div>
      <div class="moment-comments">${p.comments.map((c) => `<div class="comment"><b>${esc(c.author_name)}</b>：${esc(c.content)}</div>`).join("")}</div>
      <div class="comment-input"><input placeholder="评论…" data-id="${p.id}"><button class="comment-btn" data-id="${p.id}">发送</button></div>`;
    feed.appendChild(el);
  });
  feed.querySelectorAll(".like-btn").forEach((btn) => {
    btn.onclick = async () => {
      const id = +btn.dataset.id; if (state.liked.includes(id)) return;
      const r = await api(`/api/moments/${id}/like`, { method: "POST" });
      state.liked.push(id); saveLiked(); btn.classList.add("liked"); btn.textContent = `💗 ${r.likes}`;
    };
  });
  feed.querySelectorAll(".comment-btn").forEach((btn) => {
    btn.onclick = async () => {
      const id = +btn.dataset.id;
      const input = feed.querySelector(`.comment-input input[data-id="${id}"]`);
      const content = input.value.trim(); if (!content) return;
      input.value = "";
      await api(`/api/moments/${id}/comment`, { method: "POST", body: JSON.stringify({ content, author_name: state.playerName || undefined }) });
      loadMoments();
    };
  });
}

// ============ 我的头像 ============
function renderMyAvatarPreview() {
  const box = $("#my-avatar-preview"); if (!box) return;
  if (state.playerAvatar) { box.style.backgroundImage = `url("${state.playerAvatar}")`; box.textContent = ""; }
  else { box.style.backgroundImage = ""; box.textContent = (state.playerName || "我").slice(0, 1); }
}
async function loadProfile() {
  try {
    const p = await api("/api/system/profile");
    state.playerAvatar = p.avatar_url || "";
    if (state.playerAvatar) localStorage.setItem("player_avatar", state.playerAvatar);
    else localStorage.removeItem("player_avatar");
  } catch (e) {}
}
function refreshAfterAvatarChange() {
  renderMyAvatarPreview(); renderFriendList($("#search-input").value.trim());
  if (state.current) selectChat(state.current);
}

// ============ 设置 ============
async function openSettings() {
  $("#settings-modal").classList.remove("hidden");
  $("#input-nickname").value = state.playerName;
  renderMyAvatarPreview();
  const s = await api("/api/system/status");
  $("#status-box").innerHTML = `<div>API Key：${s.api_key_configured ? "✅ 已配置" : "❌ 未配置（请在 .env 填写）"}</div><div>模型：${esc(s.model)}　|　接口：${esc(s.base_url)}</div><div>图像生成：${s.image_api_configured ? "✅ 已启用" : "⬜ 未配置（使用内置占位图）"}</div><div>角色数量：${s.character_count}　|　RAG 知识片段：${s.rag_chunks} 条</div>`;
}

// ============ 朋友圈生成弹窗 ============
function populateGenCharacterSelect() {
  const select = $("#gen-character"); if (!select) return;
  const current = select.value; select.innerHTML = "";
  state.friends.forEach((f) => { const opt = document.createElement("option"); opt.value = f.id; opt.textContent = f.name; select.appendChild(opt); });
  if (current && state.friends.some((f) => f.id === current)) select.value = current;
  else if (state.friends.length > 0) select.value = state.friends[0].id;
}
function syncGenPromptState() {
  const source = $("#gen-source").value; const isPool = source === "pool";
  $("#gen-prompt-field").classList.toggle("hidden", isPool);
  const prompt = $("#gen-prompt"); prompt.disabled = isPool; if (isPool) prompt.value = "";
  $("#gen-pool-field").classList.toggle("hidden", !isPool);
  $("#gen-caption-mode-field").classList.toggle("hidden", !isPool);
  const captionMode = $("#gen-caption-mode").value;
  $("#gen-people-field").classList.toggle("hidden", !(isPool && captionMode === "vision"));
  $("#gen-manual-caption-field").classList.toggle("hidden", !(isPool && captionMode === "manual"));
  $("#gen-ref-field").classList.toggle("hidden", !(source === "cloud" || source === "local"));
}
function setGenStatus(msg, isError = false) {
  const box = $("#gen-status-box"); if (!box) return;
  if (!msg) { box.classList.add("hidden"); box.classList.remove("error"); box.textContent = ""; return; }
  box.classList.remove("hidden"); box.classList.toggle("error", isError); box.textContent = msg;
}
function openGenMomentModal() {
  populateGenCharacterSelect();
  const source = $("#gen-source"); if (!source.value) source.value = "pool";
  $("#gen-prompt").value = ""; $("#gen-caption-mode").value = "vision"; $("#gen-people").value = ""; $("#gen-manual-caption").value = "";
  clearPoolImage(); state.selectedRefImages = []; renderRefPreview();
  syncGenPromptState(); setGenStatus("");
  $("#gen-moment-modal").classList.remove("hidden");
}
function closeGenMomentModal() { $("#gen-moment-modal").classList.add("hidden"); }
async function confirmGenMoment() {
  const source = $("#gen-source").value;
  const userPrompt = $("#gen-prompt").value.trim();
  const characterId = $("#gen-character").value;
  const btn = $("#btn-confirm-gen-moment");
  if (!characterId) { toast("请选择发布角色"); return; }
  const payload = { source }; payload.character_id = characterId;
  if (source === "pool") {
    if (!state.selectedPoolImage) { toast("请先从图片池选择一张图片"); return; }
    payload.image_url = state.selectedPoolImage;
    payload.caption_mode = $("#gen-caption-mode").value;
    if (payload.caption_mode === "manual") {
      const cap = $("#gen-manual-caption").value.trim();
      if (!cap) { toast("请输入手写文案"); return; }
      payload.manual_caption = cap;
    } else {
      const people = $("#gen-people").value.trim();
      if (people) payload.people_hint = people;
    }
  } else {
    if (userPrompt) payload.user_prompt = userPrompt;
    if ((source === "cloud" || source === "local") && state.selectedRefImages.length) payload.reference_images = state.selectedRefImages;
  }
  btn.disabled = true; btn.textContent = "生成中…";
  try {
    if (source === "pool") { const cm = $("#gen-caption-mode").value; setGenStatus(cm === "vision" ? "正在让 AI 识别图片并生成文案…" : "正在发布动态…"); }
    else if (source === "cloud") setGenStatus(state.selectedRefImages.length ? "正在调用云端 AI 生图（含人物参考图），可能需要较长时间…" : "正在调用云端 AI 生图，可能需要较长时间…");
    else setGenStatus(state.selectedRefImages.length ? "正在调用本地 ComfyUI 生图（含人物参考图），本地生图较慢，请耐心等待…" : "正在调用本地 ComfyUI / SD 生图，可能需要较长时间…");
    await api("/api/moments/generate", { method: "POST", body: JSON.stringify(payload) });
    await loadMoments(); closeGenMomentModal(); toast("✅ 动态已生成");
  } catch (e) { setGenStatus("生成失败：" + e.message, true); toast("❌ 生成失败：" + e.message); }
  finally { btn.disabled = false; btn.textContent = "生成动态"; }
}

// ============ 图片池选择器 ============
async function openPoolPicker() { $("#pool-picker-modal").classList.remove("hidden"); await loadPoolImages(); }
function closePoolPicker() { $("#pool-picker-modal").classList.add("hidden"); }
async function loadPoolImages() {
  const grid = $("#pool-grid"); grid.innerHTML = `<div class="pool-loading">加载中…</div>`;
  try {
    const data = await api("/api/moments/pool"); grid.innerHTML = "";
    if (!data.images || data.images.length === 0) { grid.innerHTML = `<div class="pool-empty">图片池为空，请先上传图片</div>`; return; }
    data.images.forEach((img) => {
      const item = document.createElement("div");
      item.className = "pool-item" + (state.selectedPoolImage === img.url ? " selected" : "");
      item.dataset.url = img.url;
      item.innerHTML = `<img src="${img.url}" alt="${esc(img.name)}">`;
      item.onclick = () => selectPoolImage(img.url);
      grid.appendChild(item);
    });
  } catch (e) { grid.innerHTML = `<div class="pool-empty">加载失败：${esc(e.message)}</div>`; }
}
function selectPoolImage(url) {
  state.selectedPoolImage = url;
  document.querySelectorAll(".pool-item").forEach((el) => el.classList.toggle("selected", el.dataset.url === url));
  const preview = $("#gen-pool-preview"); preview.src = url; preview.classList.remove("hidden");
  $("#btn-clear-pool-image").classList.remove("hidden");
  closePoolPicker();
}
function clearPoolImage() {
  state.selectedPoolImage = "";
  const preview = $("#gen-pool-preview"); if (preview) { preview.src = ""; preview.classList.add("hidden"); }
  const clearBtn = $("#btn-clear-pool-image"); if (clearBtn) clearBtn.classList.add("hidden");
}

// ============ 人物参考图选择器 ============
async function openRefPicker() { state.refTempSelection = [...state.selectedRefImages]; $("#ref-picker-modal").classList.remove("hidden"); await loadRefImages(); }
function closeRefPicker() { $("#ref-picker-modal").classList.add("hidden"); }
async function loadRefImages() {
  const grid = $("#ref-grid"); grid.innerHTML = `<div class="pool-loading">加载中…</div>`;
  try {
    const data = await api("/api/moments/ref-images"); grid.innerHTML = "";
    if (!data.images || data.images.length === 0) { grid.innerHTML = `<div class="pool-empty">参考图池为空</div>`; return; }
    data.images.forEach((img) => {
      const idx = state.refTempSelection.indexOf(img.url);
      const item = document.createElement("div");
      item.className = "pool-item" + (idx >= 0 ? " selected" : "");
      item.dataset.url = img.url;
      item.innerHTML = `<img src="${img.url}" alt="${esc(img.name)}">` + (idx >= 0 ? `<span class="ref-order">${idx + 1}</span>` : "");
      item.onclick = () => toggleRefSelect(img.url);
      grid.appendChild(item);
    });
  } catch (e) { grid.innerHTML = `<div class="pool-empty">加载失败：${esc(e.message)}</div>`; }
}
function toggleRefSelect(url) {
  const idx = state.refTempSelection.indexOf(url);
  if (idx >= 0) state.refTempSelection.splice(idx, 1);
  else { if (state.refTempSelection.length >= 3) { toast("最多选择 3 张参考图"); return; } state.refTempSelection.push(url); }
  loadRefImages();
}
function confirmRefSelection() { state.selectedRefImages = [...state.refTempSelection]; renderRefPreview(); closeRefPicker(); }
function clearRefImages() { state.selectedRefImages = []; renderRefPreview(); }
function renderRefPreview() {
  const box = $("#gen-ref-preview"); if (!box) return;
  box.innerHTML = "";
  state.selectedRefImages.forEach((url, i) => {
    const wrap = document.createElement("div"); wrap.className = "ref-thumb";
    wrap.innerHTML = `<img src="${url}" alt=""><span class="ref-order">${i + 1}</span>`;
    box.appendChild(wrap);
  });
  $("#btn-clear-ref-image").classList.toggle("hidden", state.selectedRefImages.length === 0);
}

// ============ 事件绑定与启动 ============
document.querySelectorAll(".nav-btn[data-view]").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn[data-view]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view; // chat / moments / mini / benchmark
    $("#sidebar").classList.toggle("hidden", view !== "chat");
    $("#chat-panel").classList.toggle("hidden", view !== "chat");
    $("#moments-panel").classList.toggle("hidden", view !== "moments");
    $("#mini-panel").classList.toggle("hidden", view !== "mini");
    $("#benchmark-panel").classList.toggle("hidden", view !== "benchmark");
    if (view === "moments") loadMoments();
    if (view === "mini" && typeof initBandMini === "function") initBandMini();
    if (view === "benchmark") renderBenchmark();
  };
});
$("#btn-settings").onclick = openSettings;
$("#btn-close-settings").onclick = () => $("#settings-modal").classList.add("hidden");
$("#btn-save-nickname").onclick = async () => {
  state.playerName = $("#input-nickname").value.trim();
  localStorage.setItem("player_name", state.playerName);
  await api("/api/system/profile", { method: "PUT", body: JSON.stringify({ name: state.playerName }) });
  renderMyAvatarPreview(); toast("昵称已保存，角色们会这样称呼你～");
};
$("#btn-test-greeting").onclick = async () => { await api("/api/system/test/greeting", { method: "POST" }); toast("已触发早安推送，请查看消息列表"); };
$("#btn-choose-avatar").onclick = () => $("#input-avatar").click();
$("#input-avatar").addEventListener("change", async () => {
  const file = $("#input-avatar").files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  try {
    const res = await fetch("/api/system/avatar", { method: "POST", body: fd });
    if (!res.ok) throw new Error((await res.text()) || "上传失败");
    const data = await res.json();
    state.playerAvatar = data.avatar_url; localStorage.setItem("player_avatar", state.playerAvatar);
    refreshAfterAvatarChange(); toast("头像已更新～");
  } catch (e) { toast("头像上传失败：" + e.message); }
  finally { $("#input-avatar").value = ""; }
});
$("#btn-reset-avatar").onclick = async () => {
  await api("/api/system/avatar", { method: "DELETE" });
  state.playerAvatar = ""; localStorage.removeItem("player_avatar");
  refreshAfterAvatarChange(); toast("已恢复默认字母头像");
};
$("#btn-gen-moment").onclick = openGenMomentModal;
$("#btn-close-gen-moment").onclick = closeGenMomentModal;
$("#btn-cancel-gen-moment").onclick = closeGenMomentModal;
$("#btn-confirm-gen-moment").onclick = confirmGenMoment;
$("#gen-source").addEventListener("change", syncGenPromptState);
$("#gen-caption-mode").addEventListener("change", syncGenPromptState);
$("#gen-moment-modal").addEventListener("click", (e) => { if (e.target === $("#gen-moment-modal")) closeGenMomentModal(); });
$("#btn-choose-pool-image").onclick = openPoolPicker;
$("#btn-clear-pool-image").onclick = clearPoolImage;
$("#btn-close-pool-picker").onclick = closePoolPicker;
$("#btn-upload-pool-image").onclick = () => $("#input-pool-upload").click();
$("#pool-picker-modal").addEventListener("click", (e) => { if (e.target === $("#pool-picker-modal")) closePoolPicker(); });
$("#input-pool-upload").addEventListener("change", async () => {
  const file = $("#input-pool-upload").files[0]; if (!file) return;
  if (!file.type.startsWith("image/")) { toast("请选择图片文件"); $("#input-pool-upload").value = ""; return; }
  const fd = new FormData(); fd.append("file", file);
  try {
    const res = await fetch("/api/moments/pool/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error((await res.text()) || "上传失败");
    const data = await res.json(); toast("✅ 已加入图片池");
    await loadPoolImages(); selectPoolImage(data.url);
  } catch (e) { toast("上传失败：" + e.message); }
  finally { $("#input-pool-upload").value = ""; }
});
$("#btn-choose-ref-image").onclick = openRefPicker;
$("#btn-clear-ref-image").onclick = clearRefImages;
$("#btn-close-ref-picker").onclick = closeRefPicker;
$("#btn-confirm-ref-picker").onclick = confirmRefSelection;
$("#ref-picker-modal").addEventListener("click", (e) => { if (e.target === $("#ref-picker-modal")) closeRefPicker(); });
$("#benchmark-select").addEventListener("change", renderBenchmark);
$("#btn-send").onclick = sendMessage;
$("#btn-poke").onclick = poke;
$("#chat-input").addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
$("#search-input").addEventListener("input", (e) => renderFriendList(e.target.value.trim()));

loadFriends();
loadProfile();
connectWS();
initChatImage();
initImageZoom();