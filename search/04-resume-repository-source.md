# 最新简历与公开仓库基线

> 审计日期：2026-08-09。此文件用于锁定本轮改版的事实来源，避免沿用旧站中的过时表述。

## 1. 来源优先级

1. 用户提供的最新版 PDF：`宋林蔚_大模型应用_AI-Agent_简历_CLI_论文项目精修版.pdf`。
2. 当前可公开访问的 [GitHub 仓库页](https://github.com/fjnuslw?tab=repositories)。
3. 仓库 README 与站内项目详情页，仅用于补充实现细节；与最新版简历冲突时，以简历为准。

公开网页继续隐藏手机号，仅保留邮箱、GitHub 与个人主页。

## 2. 公开身份与求职信息

- 姓名：宋林蔚
- 目标：大模型应用 / AI Agent 工程实习
- 邮箱：1147214246@qq.com
- GitHub：[github.com/fjnuslw](https://github.com/fjnuslw)
- 毕业：预计 2028 年
- 实习：可连续 3 个月以上
- 教育：福建师范大学软件工程硕士（2025.09—2028.06）；福州大学至诚学院计算机科学与技术本科（2020.09—2024.06）
- 荣誉：2025 年研究生一等奖学业奖学金；CET-6

## 3. 最新履历事实

### 友达光电｜卓越工程师计划｜AI 专案实习生

时间：2026.07—2026.08。

- 参与 FIDM 新产品 SOP 智撰课题，梳理新 Model 跨站点人工录入、图片编排与审核流程。
- 建立“Model 级 SOP 包、站点级 OI、作业 Step”领域模型，明确结构化主数据、历史 OI 与人工审核边界。
- 独立重构 OpenSOP Agent 原型：FastAPI、LangGraph、混合 RAG、受约束 OI Draft、审核中断恢复、Qwen2.5-VL-7B 图片理解。
- 验证集：40 份 OI、324 个 Step、80 项媒体证据、24 条 Lesson、12 个隔离任务；支持图片候选绑定、Lesson 审批沉淀与 Excel / ZIP 导出。

### 福建新意科技有限公司｜大模型应用开发

时间：2025.07—2026.02。

- 企业客服 / 运维知识问答，负责 Dify 工作流、多模型接入、知识库与 Prompt 迭代。
- 父子分块 + 全文索引；部署 Qwen-32B、CPU Embedding / Rerank；打通 MCP 与多供应商 API。
- 建立 20 个 Golden Cases，从准确性、证据相关性、完整性、稳定性驱动回归。

## 4. 最新项目事实

### 星途知汇｜对话式企业知识智能体

时间：2026.08—至今；企业落地 · 全栈 / Agent。

- 对话式知识采访 Agent：动态追问、可编辑经验卡片、员工原话来源、员工确认、业务审核、版本发布。
- LangGraph.js + PostgreSQL Checkpointer；Session / Run / Message / Projection；幂等请求、事务锁、唯一约束与检查点恢复。
- 权限优先 Hybrid RAG：SQL 可见范围过滤、Qwen Embedding、pgvector / pg_trgm 双路召回、RRF、Qwen Reranker、来源白名单、证据不足拒答。
- 飞书 OAuth 2.0 + PKCE、身份绑定、通讯录事件同步；真实完成 10 个部门 / 30 名在职员工目录同步验收。

### Local Window Copilot

时间：2026.07—2026.08；独立开发 · 开源。

- 面向 MiniCPM-V 4.6 Thinking（1.3B 总参数 / 0.8B LLM）的完整桌面 Agent Harness，无需云端 API。
- OCR 负责文字、数字与位置，VLM 负责页面布局和用户行为理解；GPU OCR 单图 0.347–0.487 s，较 CPU 加速 2.64–3.26×。
- SQLite 持久化窗口观察、完整对话与长期记忆；固定当前截图、按窗口补充历史、自动压缩早期对话、用户确认后保存稳定信息，重启可恢复。
- CLI 命令集成到原生悬浮聊天窗，通过 `/` 管理对话、窗口、上下文和记忆，支持流式回答、思考状态和取消。

## 5. 最新竞赛与研究事实

- 第十七届蓝桥杯人工智能赛·智能体开发大学组：全国总决赛一等奖、全国第 5 名；福建赛区省赛一等奖、福建省第 1 名。
- `Intrinsic Attention as Navigator: A Non-Generative Retrieval Method for Multi-Hop Queries`：2026，EMNLP / CCF-B，一作；基于 Qwen3-Embedding-4B，在 MuSiQue 与 2Wiki 上超过两种 7B / 8B embedding 基线；当前 OA / AC 均 3.0。
- `ESRA: Training-Free Multi-Hop Agentic RAG with Explicit Evidence-State Transitions`：2026，AI Open / JCR Q1，一作，在审；核心是显式 PlanState、branch、Search / Probe → LLM Commit → State Write-back 与 EvidenceSpace。

## 6. 2026-08-09 公开仓库快照

GitHub 页面当前显示 6 个公开仓库：

1. [OpenSOP-Agent](https://github.com/fjnuslw/OpenSOP-Agent) — Python
2. [local-window-copilot](https://github.com/fjnuslw/local-window-copilot) — Python
3. [fjnuslw.github.io](https://github.com/fjnuslw/fjnuslw.github.io) — HTML
4. [xingtu-knowledge-platform](https://github.com/fjnuslw/xingtu-knowledge-platform) — TypeScript
5. [video-to-knowledge-skill](https://github.com/fjnuslw/video-to-knowledge-skill) — Python / MIT
6. [silentdeck-codex-skill](https://github.com/fjnuslw/silentdeck-codex-skill) — Python / MIT

## 7. 必须纠正的旧站漂移

- 首页角色名从“大模型应用 / AI Agent 工程”校正为“大模型应用 / AI Agent 工程实习”，避免求职定位过度泛化。
- Local Window Copilot 时间从“2026.07—至今”校正为“2026.07—2026.08”。
- Local Window Copilot 的主叙述切换到“小模型 Agent Harness、OCR / VLM 分工、SQLite 记忆、原生悬浮窗 CLI”，不再把旧版 Evidence Graph / Observation Harness 作为首要卖点。
- OpenSOP 补入 Qwen2.5-VL-7B、24 条 Lesson、图片候选绑定与 Lesson 审批沉淀。
- 论文页不继续展示最新版简历未保留的精确 R@5 / F1 / 上下文压缩比例；改用简历中的可核验结论与评审状态。
- 公开仓库数从旧缓存中的 5 更新为 6，且 OpenSOP Agent 已公开。
