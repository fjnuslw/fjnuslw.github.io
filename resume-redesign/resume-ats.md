# 宋林蔚

**大模型应用 / AI Agent 工程师**  
出生 2001.09 ｜ 现居 福建 · 福州  
18059396679 ｜ 1147214246@qq.com ｜ [github.com/fjnuslw](https://github.com/fjnuslw) ｜ [fjnuslw.github.io](https://fjnuslw.github.io)

## 实习经历

### 友达光电｜卓越工程师计划 · AI 专案实习生

2026.07—2026.09

- 业务侧：新 model 上线要按站点写 SOP/OI，依赖 key-in 与拍照贴图，规范不一致、审核慢，拖住 China Car 放量。
- 负责 FIDM 新产品 SOP 智撰 Agent：工序/关键画面理解 → 结构化草案 → 人工审校闭环，把工程师工作从「从零录入」改成「审校优化」。
- 设计目标：编写耗时约 −50%，OI 自动生成准确率 ≥90%，并支持 Lessons Learned 一键回写修订。

### 福建新意科技有限公司｜大模型应用开发实习生

2025.07—2026.02

- 企业智能客服 RAG 从 0 到可用：梳理业务知识、搭 Dify Workflow、接多模型 API，并持续迭代 Prompt 与命中效果。
- 长文档层级深、版本更新快，平铺切分会丢父子结构。设计树状切分 + 全文索引，用召回/命中/答案完整性对比「普通分段 vs 父子索引」后定版。
- 本地部署 Qwen-32B（vLLM），CPU 侧用 Xinference 跑 Embedding/Rerank；接 MCP 与多供应商接口并完成故障排查。
- 自建 20 题业务评测集（准确性、证据相关性、完整性、稳定性），对比 DeepSeek / 豆包等，用失败 case 反推知识库与选型。

## 项目经验

### Local Window Copilot｜Windows 本地桌面 Agent

2026.07—至今 ｜ [GitHub](https://github.com/fjnuslw/local-window-copilot)

- Windows 本地桌面 Agent（local-first，数据不出本机）。双链路：观察线截图 → MiniCPM-V 结构化卡片 → SQLite；对话线 ChatAgent 仅暴露 memory.search，FastAPI/SSE 流式输出并绑定证据 id。
- 小 VLM tool-call 抖动大：改 probe→stream（probe 只判要不要调工具，stream 专责终答），并用确定性 FTS 排名替换 VLM ranker → memory.search 失败率 46%→0%，排名延迟 ~30s→10ms。
- 长对话易爆上下文：system / profile / session / evidence 分层；会话级冻结 profile 稳住 llama.cpp prefix cache，首 Token −30%–60%；收紧观察契约后 VLM 成功率 54%→80%。
- 上线前 token 预算拦截 + rolling compact；WebUI 可回放观察 JSON、截图、tool trace；55 项单测锁住 ChatAgent / 检索 / API 主路径。

## 竞赛获奖

### 第十七届蓝桥杯全国大学生软件和信息技术大赛

- **全国总决赛 · 一等奖 · 全国第 5 名**（人工智能赛 · 智能体开发大学组）  
  [国赛获奖名单](https://fjnuslw.github.io/awards/lanqiao-17-national-agent-dev.pdf) ｜ [证书核验](https://dasai.lanqiao.cn/dasai-front/cert-search/)
- **福建赛区省赛 · 一等奖 · 福建省第 1 名 · 晋级国赛**  
  [省赛获奖名单](https://fjnuslw.github.io/awards/lanqiao-17-fujian-agent-dev.pdf) ｜ [证书核验](https://dasai.lanqiao.cn/dasai-front/cert-search/)

## 教育背景

**福建师范大学｜软件工程硕士** ｜ 2025.09—至今  
2025 年研究生一等奖学业奖学金

**福州大学至诚学院｜计算机科学与技术（本科）** ｜ 2020.09—2024.06  
英语六级（CET-6），可独立阅读英文论文与技术文档

## 论文

### 1. Intrinsic Attention as Navigator: A Non-Generative Retrieval Method for Multi-Hop Queries

一作 · EMNLP 2026（CCF-B）· ARR 3.5 / 3.0 / 2.5

- 发现 Embedding 模型 elite attention heads 可稳定定位跨文档桥接线索，实现无需 CoT、训练或预构图的 next-hop 检索。
- 指令激活桥接 clue；semantic residual 逐跳扣除已覆盖语义，beam 保留多路径，避免检索停留在原问题语义邻域。
- Qwen3-Embedding-4B 在 2Wiki / MuSiQue 的 R@5 达 89.10 / 76.45，相对 Direct +16.28 / +12.65，并超过 8B 直检；移除 intrinsic steering 后分别下降 18.0 / 9.7 点。

### 2. ESRA: Training-Free Multi-Hop Agentic RAG with Explicit Evidence-State Transitions

一作 · AI Open（JCR Q1）· 投稿

- 将多跳 Agent 的瓶颈定位为证据状态失控：自然语言轨迹无法约束当前关系、分支和答案槽，易状态漂移与跨分支串证据。
- PlanState 定位 branch/step，Search/Probe 构造带来源候选，Workspace 保存完整输出、只显当前分支；经校验的 candidate commit 写回，并区分候选构建/提交错误。
- 同骨干/索引下三数据集均优于 Direct、Standard RAG、IR-CoT、MA-RAG；bridge-comparison F1 0.889 vs 0.674，工具 observation −90.4%；移除 Workspace 后 Avg F1 0.673→0.208、loops 5.10→10.52。

## 技能特长

RAG 工程 · AI Agent · Tool Calling · Agent Workflow · LangGraph / LangChain · Dify · FastAPI · Python · 本地模型部署 · 评测与迭代
