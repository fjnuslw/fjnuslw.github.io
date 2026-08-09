# fjnuslw.github.io 2026 改版 SPEC

版本：1.0
日期：2026-08-09
代号：**Evidence Ledger / AI Agent 工程档案**

## 0. 目标

把现站从“信息完整的通用开发者模板”改造成一个有强记忆点、可快速核验的中文 AI Agent 工程作品集。

新访客应在：

- **5 秒内**知道：宋林蔚、目标是大模型应用 / AI Agent 工程实习、当前开放实习；
- **15 秒内**看到：星途知汇、Local Window Copilot、蓝桥杯全国第 5、企业 10 部门 / 30 人同步、OCR GPU 2.64–3.26×；
- **60 秒内**理解：两段实习、三项旗舰工程、两项研究工作的逻辑关系，并能一跳进入案例、源码、公开履历或联系。

## 1. 研究依据

本 SPEC 由以下资料共同约束：

- [国际优秀个人网站调研](01-international-portfolios.md)
- [中文与亚洲开发者个人网站调研](02-chinese-asian-portfolios.md)
- [现站与信息架构审计](03-current-site-audit.md)
- [最新版简历与公开仓库基线](04-resume-repository-source.md)

采用的核心规律：

1. 借鉴 Brittany Chiang 的快速履历判断，但不复刻其双栏模板皮肤。
2. 借鉴 Rauno Freiberg / Lynn Fisher 的“单一视觉母题”，但保持自然纵向阅读。
3. 借鉴 Paco Coursey / Emil Kowalski 的“一句话价值”，先说项目解决什么，再说技术栈。
4. 借鉴 Anthony Fu 的可点击作品证据密度，将身份直接绑定项目和研究。
5. 借鉴 Innei / DIYgod 的人物气质与真人感，避免只剩企业模板语言。
6. 借鉴 Bruno Simon 的“演示即简历”，但只实现一个轻量、可降级的主互动，不引入 WebGL、音频或长 loading。

## 2. 受众与主要任务

### 2.1 第一受众：招聘者 / 用人团队

主要任务：

- 快速判断岗位方向、毕业时间和实习可用性；
- 找到两项最强项目、本人职责和可核验结果；
- 查看最新网页履历或联系候选人。

### 2.2 第二受众：技术面试官 / 工程师

主要任务：

- 查看 Agent 状态编排、RAG、模型与数据层设计；
- 进入 GitHub、案例页或 Demo；
- 找到系统边界、失败恢复、权限与评测方法。

### 2.3 第三受众：研究与开源同行

主要任务：

- 了解多跳检索与 Agentic RAG 研究；
- 查看开源工具和工程文章；
- 建立进一步交流入口。

## 3. 核心叙事

### 3.1 一句话定位

> 把大模型能力做成能进入真实流程、可恢复、可审核、证据可追溯的 Agent 系统。

### 3.2 三条证明链

1. **Enterprise Agent**：星途知汇——对话沉淀、人工确认、审核发布、权限内复用。
2. **Local Agent**：Local Window Copilot——本地小模型、OCR / VLM 分工、持久记忆、原生悬浮交互。
3. **Workflow Agent**：OpenSOP Agent——混合 RAG、受约束 OI Draft、图片证据、审核中断恢复。

### 3.3 个人工程签名

全站只使用一个可复述的视觉与文案母题：

> **Evidence Ledger：每一步有状态，每个结论有来源，每次发布有人确认。**

不混用假终端、玻璃拟态、粒子背景、3D 世界、技能百分比等无关视觉。

## 4. 信息架构

### 4.1 主导航顺序

`首页 → 项目 → 履历 → 文章 → 关于`

理由：将招聘场景中最高意图的项目与履历提前，文章和个人叙事作为深层证据。

### 4.2 首页

1. Hero：姓名、目标角色、价值主张、状态、主 CTA、真人照片、Agent Trace。
2. Proof Strip：3 个最强结果；不再保留四格“当前近况”。
3. Selected Systems：星途知汇、Local Window Copilot 两项旗舰项目。
4. Field System：OpenSOP Agent，以实习课题 / 制造业 Agent 形式突出。
5. Experience Snapshot：两段实习的压缩时间线。
6. Research & Recognition：两项研究 + 蓝桥杯证明入口。
7. Open-source Notes：video-to-knowledge、SilentDeck、近期文章。
8. Contact CTA。

### 4.3 项目页

- 首屏先给项目组合定位和分类索引。
- 三项旗舰项目采用全宽案例行：`项目编号 / 状态 / 一句话价值 / 问题 / 本人贡献 / 结果 / 证据入口`。
- video-to-knowledge 与 SilentDeck 进入“Tools / Knowledge Pipeline”紧凑列表。
- Local Window Copilot Demo 只保留轻量预览入口；完整 Demo 在独立页打开，避免总览页重复加载大型 iframe。

### 4.4 履历页

- 顶部为公开身份摘要、求职状态、联系与打印 / 导出。
- 桌面端使用粘性左侧目录；右侧按实习、项目、竞赛、教育、研究、技能排列。
- 全文事实严格依据最新版简历。
- 用户提供的源 PDF 含手机号，不直接提交到公开仓库；网页履历继续隐藏手机号并提供浏览器打印 / 导出 PDF。

### 4.5 文章页 / 关于页

- 文章页保留技术内容，但改用同一视觉框架；首页只精选最新 2 篇。
- 关于页不重复完整履历，集中讲工程原则、工作方法与正在寻找的合作 / 实习方向。

## 5. 视觉系统

### 5.1 色彩

| Token | 值 | 用途 |
| --- | --- | --- |
| `--ledger-ink` | `#0b0d0c` | Hero、页脚、强对比区 |
| `--ledger-paper` | `#f3f0e8` | 主页面暖白底 |
| `--ledger-paper-2` | `#e9e5da` | 次级区、卡片底 |
| `--ledger-text` | `#171a18` | 正文 |
| `--ledger-muted` | `#6e746f` | 元数据 |
| `--ledger-line` | `#c9c6bb` | 结构线 |
| `--ledger-signal` | `#c9ff5a` | Agent 活跃节点、主 CTA |
| `--ledger-coral` | `#ff6b4a` | 局部结果 / 编号强调 |

约束：大面积只使用 ink / paper；signal 与 coral 仅作高价值提示，避免重新变成多色卡片系统。

### 5.2 字体

- 中文与正文：系统中文无衬线栈，保证中国网络下零字体阻塞。
- 英文大标题 / 引语：Georgia 等系统衬线，提供编辑感。
- 编号、状态、技术元数据：系统等宽字体。
- 中文正文最小 16px / 1.65 行高；重要元数据不低于 12px。

### 5.3 排版与网格

- 最大内容宽度：1200px；正文阅读宽度：680–760px。
- Hero 使用 12 栏非对称网格，文字约 7 栏，身份 / Trace 约 5 栏。
- 首屏姓名使用 `clamp(4rem, 10vw, 8.5rem)`，形成首次进入的记忆点。
- 项目不使用同尺寸卡片墙；旗舰项目采用交错的全宽证据面板。
- 章节编号统一为 `01 / 02 / 03`，与 Evidence Ledger 母题一致。

### 5.4 图片

- 使用最新版简历中的个人照片作为身份锚点，以 CSS 灰度、裁切与边框处理，不生成虚构人物图。
- 星途知汇保留现有项目封面；Local Window Copilot 使用已有吉祥物 / Demo 画面作辅助。
- 所有内容图声明宽高；非首屏 `loading="lazy"`；首屏人物图本地加载。
- 社交分享图使用与新视觉一致的单张本地 OG 图。

## 6. Hero 详细规范

### 6.1 必显内容

- `宋林蔚 / LINWEI SONG`
- `大模型应用 / AI Agent 工程实习`
- 一句话定位（最多约 46 个汉字）
- 状态：`2028 届硕士 · 可连续实习 3 个月以上`
- 主 CTA：`看代表项目`
- 次 CTA：`查看公开履历`
- 辅助链接：GitHub、邮箱

### 6.2 签名视觉：Agent Trace

右侧为一张“运行账本”而非假终端：

`Observe → Ground → Recover → Approve`

- 每个节点显示简短中文解释与项目对应关系。
- 默认可完整阅读；hover / focus 只增强当前节点，不隐藏唯一信息。
- 使用 CSS / SVG 线条和节点，允许一次 240–360ms 入场。
- `prefers-reduced-motion` 下无位移动画。
- 人物照片嵌入账本角落，形成“人负责最后确认”的视觉含义。

### 6.3 Proof Strip

只保留三项：

1. `全国第 5`｜蓝桥杯智能体开发国赛一等奖
2. `10 部门 / 30 人`｜企业通讯录同步验收
3. `2.64–3.26×`｜OCR GPU 相对 CPU 实测加速

研究数量与毕业时间不再占用该区域。

## 7. 项目内容模板

每个旗舰项目必须按以下顺序呈现：

1. 状态 / 时间 / 本人角色；
2. 一句价值（20–36 字）；
3. 问题：真实业务或工程约束；
4. 本人贡献：系统设计与关键实现；
5. 结果：可核验数字或交付物；
6. 技术：最多 5 个关键技术，不做标签堆积；
7. 主 CTA：案例 / Demo；
8. 次 CTA：GitHub / 文档 / 证据。

### 7.1 首页项目优先级

1. 星途知汇
2. Local Window Copilot
3. OpenSOP Agent

### 7.2 项目事实要求

- 星途知汇必须出现 `LangGraph.js + PostgreSQL Checkpointer`、权限优先 Hybrid RAG、飞书同步、`10 部门 / 30 人`。
- Local Window Copilot 必须使用最新版的“小模型 Agent Harness”表述，时间为 `2026.07—2026.08`，出现 OCR / VLM 分工、SQLite 记忆、CLI 悬浮窗与 `2.64–3.26×`。
- OpenSOP 必须出现 `Qwen2.5-VL-7B`、`40 OI / 324 Step / 80 媒体证据 / 24 Lesson / 12 隔离任务`、图片候选绑定、审核恢复、Excel / ZIP。
- 论文不显示最新版简历未保留的精确 R@5、F1 或上下文压缩比例。

## 8. 交互规范

### 8.1 允许

- Hero Agent Trace 节点的 hover / focus 状态；
- 导航、按钮、项目行的 180–260ms 反馈；
- 章节进入视口时一次性轻微 reveal；
- 移动导航与返回顶部；
- 项目页原生 `<details>` 或明确链接用于展开补充证据。

### 8.2 禁止

- 自动打字、循环闪烁、鼠标尾迹、粒子背景、滚动劫持；
- 自动播放音频 / 视频；
- 首屏需要等待资源才显示正文；
- 依赖实时 GitHub API 的 Star / commit 数；
- hover 才能看到关键文本；
- 技能百分比或自我评分。

## 9. 响应式规范

### >= 1024px

- Hero 双栏；Agent Trace 与照片位于右栏。
- 履历页粘性目录 + 主正文。
- 项目证据面板可左右交错。

### 640–1023px

- Hero 仍可双区，但姓名、主 CTA 和证明条优先；Trace 缩为横向流程。
- 项目改为单列，元数据保持可扫读。

### < 640px

- Hero 单列；姓名不换成过小字号。
- Agent Trace 置于身份和 CTA 后，照片缩成角标。
- 390×844 的前两屏必须出现：身份、定位、主 CTA、三项证明与第一个旗舰项目入口。
- 取消粘性侧栏、复杂位移动效与大 iframe。

## 10. 可访问性

- 每个正式页面有唯一 H1、`header/nav/main/footer`、skip link。
- 键盘可完成导航、Agent Trace、所有 CTA、Demo 与打印。
- 触控目标至少 44×44px；焦点样式不得只依赖颜色。
- 文本达到 WCAG AA 对比；signal 绿只在深色背景或深色文字组合中使用。
- 所有内容图有准确 alt，纯装饰图 `alt=""`。
- `prefers-reduced-motion` 下取消 transform 位移动画。
- JavaScript 失败时身份、项目、履历与文章入口仍可阅读。

## 11. SEO 与分享

- 所有正式页面保留唯一 title、description、canonical、OG / Twitter。
- 首页保留 Person JSON-LD；项目页添加 `CollectionPage` / `CreativeWork`，文章沿用 `Article`。
- 新增 `sitemap.xml` 与 `robots.txt`；`blog/template.html` 设置 `noindex`。
- OG 图与新视觉一致，中文姓名、方向和三节点线索在小图仍可辨识。

## 12. 性能与维护

- 保持原生 HTML / CSS / JS 与 GitHub Pages，不引入前端框架或远程字体。
- 首屏不得依赖第三方 JS、实时 API、WebGL 或视频。
- 新样式独立为清晰的主题层；旧共享 CSS 不再继续无规则堆叠。
- 图片采用合适尺寸；非首屏 lazy-load；减少重复 iframe。
- 内容源的动态事实在 [最新版简历与公开仓库基线](04-resume-repository-source.md) 维护；页面更新时先核对该文件。

## 13. 本轮实施范围

### 必改

- `index.html`
- `projects.html`
- `resume.html`
- `about.html`
- `blog.html`
- `projects/local-window-copilot.html` 的过时定位与时间
- 全站主导航 / 页脚顺序
- 新主题 CSS 与必要 JS
- 个人照片与新版 OG 资产
- `sitemap.xml`、`robots.txt`

### 不在本轮强制范围

- 全量中英文双语页面；本轮只预留语言架构与英文元数据。
- 为星途知汇 / OpenSOP 新建完整独立案例页；若素材不足，先在项目页提供高质量展开证据。
- 引入访问统计、CMS、服务端构建或实时 GitHub 数据。

## 14. 验收标准

### 内容

- 首页首屏无旧四格近况；主 CTA 不超过 2 个。
- 首页最多 3 个旗舰项目，且 2 个在 15–60 秒阅读路径中突出。
- 所有时间、角色、项目指标、论文状态与最新版简历一致。
- 公开页面不暴露手机号，不提交源 PDF。

### 视觉

- 桌面首屏有大字号姓名、唯一 Agent Trace 母题与真人身份锚点。
- 全站不再依赖同尺寸圆角卡片墙形成层级。
- 色彩主要由 ink / paper / signal 构成，强调色用途一致。

### 质量

- 360×800、390×844、768×1024、1280×720 无横向滚动。
- 所有正式页面唯一 H1、可见焦点、有效主导航和 skip link。
- 本地站点校验通过，浏览器控制台无错误。
- 外链、资源链接、博客数据加载和 Demo 入口可用。
- Pages 发布后线上首页、项目页、履历页与 OG 资源返回成功。
