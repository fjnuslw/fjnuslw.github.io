# 最新简历与公开仓库基线

> 简历基线更新：2026-08-24。此文件用于锁定公开页面的事实来源，避免沿用旧站中的过时表述。

## 1. 来源优先级

1. 用户提供的最新版 PDF：`宋林蔚_大模型应用_AI-Agent_简历.pdf`（生成于 2026-08-24 20:18）。
2. 当前可公开访问的 [GitHub 仓库页](https://github.com/fjnuslw?tab=repositories)。
3. 仓库 README 与站内项目详情页，仅用于补充实现细节；与最新版简历冲突时，以简历为准。

公开网页继续隐藏手机号，仅保留邮箱、GitHub 与个人主页。

## 2. 公开身份与求职信息

- 姓名：宋林蔚
- 目标：大模型应用 / AI Agent 工程实习
- 邮箱：1147214246@qq.com
- GitHub：[github.com/fjnuslw](https://github.com/fjnuslw)
- 毕业：预计 2028 年
- 实习：可连续 6 个月以上
- 教育：福建师范大学软件工程硕士（2025.09—2028.06）；福州大学至诚学院计算机科学与技术本科（2020.09—2024.06）
- 荣誉：2025 年研究生一等奖学业奖学金；CET-6

## 3. 最新履历事实

### 友达光电｜卓越工程师计划｜AI 专案实习生

时间：2026.07—2026.08。

- 参与 FIDM 新产品 SOP 智撰课题，将需求抽象为“Model 级 SOP 包、站点级 OI Draft、有序作业 Step”，明确结构化主数据、历史文档与人工决策边界。
- 使用公开 / 合成数据独立设计并实现 OpenSOP Agent 工程原型：FastAPI 异步任务与 SSE 进度、LangGraph 生成 / 校验 / 双级审核、interrupt / resume 审核恢复。
- OI 文档级混合检索融合 Dense 与字符级 Lexical 召回，经 RRF、可插拔 Reranker 与元数据排序选取当前版本 OI 作为完整主路线。
- 通过 Pydantic Schema、来源白名单与人工图片确认约束 Draft；数据集包含 40 份历史 OI、324 个 Step、80 个媒体证据、24 条 Lesson、12 个合成隔离检索任务，并支持 Excel / ZIP 导出。

### 福建新意科技有限公司｜大模型应用开发

时间：2025.07—2026.02。

- 企业客服 / 运维知识问答 RAG 原型，负责复杂文档索引、检索评测与模型服务联调；完整链路为“文档解析与切分 → 向量 / 全文召回 → Rerank → 上下文组装 → Qwen-32B 生成”。
- 问答型文档使用细粒度 child 召回并回溯 parent；大型技术文档按章节结构 + 字符窗口切分，以 document_id、section_path、source、version 等 Metadata 保留来源与上下文。
- 建立小规模 Golden Cases，对比 Embedding / Rerank 与普通 Chunk / 层级索引，从召回命中、证据相关性、回答准确性、完整性和稳定性定位失败环节；最新版简历未提供固定样本数。
- 基于 Xinference 在 CPU 侧部署 Embedding / Rerank，以 vLLM 部署 Qwen-32B，完成模型接入、接口联调及部署 / 推理故障排查。

## 4. 最新项目事实

### 星途知汇｜飞书原生企业知识与销售 Agent 平台

时间：2026.08—至今；企业落地 · 全栈 / Agent。

- 面向职业教育 / IT 培训企业咨询销售团队，负责从 0 到 1 建设“组织知识沉淀 → 一线销售调用”闭环。
- 飞书作为员工销售工作台：私聊及白名单内部群提交文字、PDF、云文档与妙记，多份材料按员工显式选择的会话归并，先持久化和异步解析，全部就绪后触发分析，完整结果通过私聊流式交付。
- 打通飞书身份、组织目录与人员变更，将入职、调岗、离职映射为账号和知识权限；流程为“动态采访 / 销售复盘 → 员工确认 → 主管审核 → 版本发布 / 撤回”，权限在知识召回前执行。
- 采用 Agent + 版本化 Skill + 受控 Tool；实机同步 10 个部门、30 名在职员工，当前实例形成 6 类知识库、42 篇发布知识和 6 个发布 Skill。

### Local Window Copilot

时间：2026.07—2026.08；独立开发 · 开源。

- Windows 本地视觉上下文与连续记忆 Agent Harness，基于 llama.cpp 部署 MiniCPM-V 4.6 Thinking。
- 在悬浮窗抢占焦点前锁定 PID / HWND，每轮刷新同一物理窗口并固定 PinnedScene，以 ownership / epoch fencing 避免错窗、画面漂移和异步结果串线。
- “全帧 OCR → 确定性 ScreenMap → VLM 语义”分层观测：PP-OCRv6 保留文本、置信度和 Bounding Box；Unicode / 几何特征与 Hungarian 匹配构建跨帧 Evidence Graph，支持滚动后追问离开视口的真实可见内容。
- SQLite WAL 保存观察与对话双账本：Observation / OcrLayout / Occurrence、Thread / Generation、版本化 Capsule；长期记忆候选只来自用户原话，经接受或编辑后进入有界 Notebook，支持替换、软删除和服务重启恢复。
- 最新简历不再展示旧版 OCR CPU / GPU 速度与倍数，正式页面不以该指标作为当前主证据。

## 5. 最新竞赛与研究事实

- 第十七届蓝桥杯人工智能赛·智能体开发大学组：全国总决赛一等奖、全国第 5 名；福建赛区省赛一等奖、福建省第 1 名。
- `Intrinsic Attention as Navigator: A Non-Generative Retrieval Method for Multi-Hop Queries`：2026，EMNLP 正式录用，一作。IN-Retriever 直接读取 Qwen3-Embedding-4B 内部注意力导航下一跳；Bridge Focus Score、正交投影、ChromaDB / HNSW、优先队列和 Beam Search 组成证据搜索，4B 骨干超过两种 7B / 8B 强嵌入基线。
- `ESRA: Training-Free Multi-Hop Agentic RAG with Explicit Evidence-State Transitions`：2026，AI Open / JCR Q1，在审，与导师共同一作；核心是显式 PlanState、branch、Search / Probe → LLM Commit → State Write-back 与 EvidenceSpace。

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
- 可连续实习期从 3 个月以上更新为 6 个月以上。
- 星途知汇补入飞书销售工作台、版本化 Skill / 受控 Tool 与当前实例 6 类知识库、42 篇发布知识、6 个发布 Skill。
- Local Window Copilot 的主叙述切换为“PID / HWND 锁窗、PinnedScene 与 epoch fencing、ScreenMap、跨帧 Evidence Graph、SQLite WAL 双账本、Capsule / Notebook”，移除正式页面中的旧 OCR 倍速主证据。
- 新意科技的 Golden Cases 只表述为“小规模”，不继续显示旧版固定 20 个。
- IN-Retriever 更新为 EMNLP 正式录用，移除 OA / AC 分数与最新版未保留的数据集名称；ESRA 作者角色更新为“与导师共同一作”。
- OpenSOP 以最新版的 Dense + 字符级 Lexical、RRF / Reranker、Pydantic Schema、来源白名单、人工图片确认与双级审核为准。
- 公开仓库数从旧缓存中的 5 更新为 6，且 OpenSOP Agent 已公开。
