\# 动漫聊天室



仿 QQ/微信 界面的 AI 角色聊天软件：好友为《K-ON!》《MyGO!!!!!》等少女乐队成员，

对话由大模型驱动并以 RAG 知识库防止 OOC；朋友圈为 AI 生成的角色旅游动态。

小程序界面还有“15元组建你的少女乐队！”游戏等着你！



\## 快速开始

1\. 安装 Python 3.9+（勾选 Add to PATH）

2\. 双击 `start.bat`（首次自动建虚拟环境、装依赖、生成 .env）

3\. 在弹出的 .env 中填写 `LLM\_API\_KEY`（及可选的 BASE\_URL / MODEL），保存后再次双击 `start.bat`

4\. 浏览器自动打开 http://127.0.0.1:8000



\## 架构说明

\- 后端：FastAPI + SQLite(SQLAlchemy) + APScheduler + WebSocket

\- 防 OOC：`characters.py` 人设 + `knowledge/\*.txt` 知识库，发送消息时由

&#x20; `rag\_service` 检索 Top-K 相关片段注入 system prompt（纯 Python 实现，中文 n-gram + TF-IDF）

\- 定时任务：每日 8:00 随机两位角色推送早安问候；15:30 自动发布一条朋友圈（均可在 .env 调整）

\- 朋友圈：配置了图像 API 时调用 `/images/generations` 生成配图，否则降级为内置占位图；

&#x20; 配文由大模型以角色口吻生成；评论后角色会自动回复



\## 扩展角色（三步）

1\. 在 `backend/characters.py` 的 `CHARACTERS` 中追加角色 dict

2\. 在 `backend/knowledge/` 新建 `<角色id>.txt`，每行一条设定资料

3\. 将头像放入 `frontend/assets/avatars/` 并在 dict 中引用



\## 调试

\- 设置面板中"测试早安推送"可立即验证 WebSocket 推送

\- `POST /api/system/test/rag` 可查看某句话检索到的知识片段，便于调优知识库



> 本项目为个人学习用途的同人作品，相关角色版权归原作者及版权方所有。

