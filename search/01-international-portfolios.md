# 国际优秀个人网站调研

> 调研日期：2026-08-09
> 目标：为宋林蔚的 AI Agent / LLM 工程师作品集提炼可实施的设计模式，而不是复制某个现成模板。

## 方法与边界

- 样本均在桌面浏览器中实际打开并核对首屏；同时阅读官网公开内容与可确认的 GitHub 源仓库。
- 下文的“观察”来自当前页面、DOM 语义与公开仓库；“推断”是针对宋林蔚站点的设计判断。
- 可访问性与性能部分只是轻量抽查，不等同于 WCAG 或 Lighthouse 全量审计。图片 `alt`、landmark、skip link 等数量只代表本次首屏 DOM 快照。
- 开源网站只用于学习设计规律。多位作者都明确反对整站换文案式复制；Josh Comeau 也专门讨论了作品集照搬现象（[原文](https://www.joshwcomeau.com/blog/why-my-blog-is-closed-source/)）。

## 样本概览

| 样本 | 最强项 | 对本项目最有价值的启发 |
| --- | --- | --- |
| [Brittany Chiang](https://brittanychiang.com/) | 履历扫描效率 | 固定身份区 + 单一滚动叙事 |
| [Paco Coursey](https://paco.me/) | 极简信息密度 | 用文字排版直接证明审美与项目判断 |
| [Rauno Freiberg](https://rauno.me/) | 空间化作品集 | 一个强记忆点统领整站，而非堆动效 |
| [Maggie Appleton](https://maggieappleton.com/) | 内容分类与个人声音 | 清晰的一句话定位 + 可生长内容系统 |
| [Lee Robinson](https://leerob.com/) | 极致克制 | 首屏只留下身份、方向与少量代表作 |
| [Josh W. Comeau](https://www.joshwcomeau.com/) | 互动叙事与人格 | 把少量“奇趣”放在不妨碍阅读的位置 |
| [Bruno Simon](https://bruno-simon.com/) | 沉浸式创意上限 | 创意入口必须配文本降级路径 |
| [Lynn Fisher](https://lynnandtonic.com/) | 独特视觉身份 | 视觉母题要可持续迭代，而非一次性皮肤 |
| [Max Böck](https://mxb.dev/) | 个性与可访问性的平衡 | 强标题、丰富主题、语义结构可以共存 |
| [Emil Kowalski](https://emilkowal.ski/) | 项目/写作快速索引 | “名称 + 一句价值”比大段简介更易扫描 |

## 1. Brittany Chiang

官网：[brittanychiang.com](https://brittanychiang.com/)；公开的旧版 V4 源码：[bchiang7/v4](https://github.com/bchiang7/v4)。当前官网已将 V4 标为旧作品，因此旧仓库适合研究模式，不应被视为当前站源码。

- **首屏结构（观察）**：桌面端是明显的左右双栏。左栏固定显示姓名、职位、一句话价值、章节导航和社交入口；右栏承载 About、Experience、Projects、Writing 的纵向内容。访客在不滚动时已经能回答“是谁、做什么、往哪看”。
- **项目呈现（观察）**：项目不是孤立缩略图，而是“标题、用途说明、技术标签、产品图/量化证据”的组合；完整项目档案另有入口。当前页面也把工作经历、项目、写作放在同一连续叙事中（[官网项目段](https://brittanychiang.com/)）。
- **交互/动效（观察）**：动效服务于章节定位和卡片反馈，整体没有抢夺内容注意力。左栏导航会提示当前阅读章节。
- **视觉系统（观察）**：深海军蓝背景、低饱和灰蓝正文、高对比浅色标题；大字号身份区和窄正文列形成清晰层级。旧 V4 仓库还公开了完整颜色参考（[源码说明](https://github.com/bchiang7/v4)）。
- **可访问性/性能抽查（观察）**：本次首屏检测到 `header`、`nav`、`main` 和 skip link；9 个图片元素均带 `alt`。单页较长，但首屏任务路径清楚。
- **适合借鉴（推断）**：宋林蔚的站点可采用“固定职业身份 + 右侧证据流”，把 AI Agent / LLM 应用定位、两项旗舰项目、论文和经历放在一次滚动中。
- **应避免（推断）**：不要复刻其配色、字体和左栏比例。这个版式已被大量模板化复制；应保留信息逻辑，换成与宋林蔚 CLI / Agent 工程语境一致的视觉母题。

## 2. Paco Coursey

官网：[paco.me](https://paco.me/)；作者公开的 [pacocoursey/paco](https://github.com/pacocoursey/paco) 是已归档的 2020 旧站，仓库明确写着“outdated”，不能当作当前官网源码。

- **首屏结构（观察）**：居中窄列、极大留白，先以两段短文建立身份，再把 Building、Projects、Writing 排成三列。初始淡入结束后，第一屏几乎就是完整导航和代表作索引。
- **项目呈现（观察）**：项目采用“短名称 + 一句功能定义”，例如 cmdk、Writer、Next Themes；没有图片也能让技术读者立刻理解产物类型（[官网](https://paco.me/)）。
- **交互/动效（观察）**：文字在约 1–2 秒内完成克制的渐入；链接下划线、箭头和排版变化承担反馈。旧站仓库也把设计目标概括为 minimalism、UI interactions、typography（[旧站 README](https://github.com/pacocoursey/paco)）。
- **视觉系统（观察）**：黑白为主，斜体只用于关键语气，细线和基线对齐构成秩序；视觉质量主要来自字距、行距和留白，而非装饰资产。
- **可访问性/性能抽查（观察）**：首屏无图片，检测到 `main`，未检测到 `nav` 或 skip link；约 20 个元素存在 transition/animation。轻资产有利于加载，但淡入期间正文对比度暂时偏低。
- **适合借鉴（推断）**：项目标题必须配一行“它解决什么问题”，例如“证据可追溯的多智能体知识平台”，避免只列技术栈。
- **应避免（推断）**：宋林蔚信息量比 Paco 大，不能把所有履历压成稀疏文字。应把这种克制用于首屏和项目索引，而非整站所有页面。

## 3. Rauno Freiberg

官网：[rauno.me](https://rauno.me/)；作者 GitHub：[raunofreiberg](https://github.com/raunofreiberg)。本次未确认当前站的公开源码仓库。

- **首屏结构（观察）**：页面像横向展览册。首张大画框以不对称断行写出姓名、身份和工作对象，右侧露出下一张画框，顶部微型进度尺暗示可横向探索。
- **项目呈现（观察）**：Devouring Details、Craft、History of Software Design、Projects、Field Notes 都被处理成可进入的“展板”，而不是常规卡片网格（[官网](https://rauno.me/)）。
- **交互/动效（观察）**：核心体验是横向滑动、画框缩放/位移与复制邮箱反馈；末尾用 “Make it fast / beautiful / consistent / careful / timeless / soulful” 收束作者的方法论。第三方设计拆解也记录了其横向画框与缩放模式（[Step1 页面](https://step1.dev/gallery/dUU9wqguUj1yI8rkNLf07)），但具体实现仍应以官网观察为准。
- **视觉系统（观察）**：浅灰展厅底、白色画框、黑色大字和单一荧光黄圆形；一个高饱和几何体就构成了强记忆点。
- **可访问性/性能抽查（观察）**：首屏检测到 `main`，未检测到 `nav`、`header` 或 skip link；无图片元素，主视觉由 CSS/图形布局构成。横向滚动对键盘、窄屏与不熟悉交互的访客存在额外学习成本。
- **适合借鉴（推断）**：为宋林蔚建立一个单一强母题，例如“Agent 运行轨迹 / 证据链节点”，让视觉记忆点直接对应专业能力。
- **应避免（推断）**：招聘场景不宜把核心履历藏进横向滚动。可以借用画框感、进度提示和局部空间动效，但主要内容仍保持自然纵向阅读。

## 4. Maggie Appleton

官网：[maggieappleton.com](https://maggieappleton.com/)；当前 V3 源码：[MaggieAppleton/maggieappleton.com-V3](https://github.com/MaggieAppleton/maggieappleton.com-V3)。

- **首屏结构（观察）**：超大衬线标题直接说清“做关于编程、设计、人类学的视觉文章”，下面两行补充身份和当前方向；顶部只保留 Garden、Now、About。
- **项目呈现（观察）**：内容不是按统一“项目”模板硬塞，而是分成 Essays、Notes、Patterns、Library 等成熟度与用途不同的集合；每项有标题、摘要、类型和时间（[官网内容结构](https://maggieappleton.com/)）。
- **交互/动效（观察）**：动效不喧闹，重点是内容间的联结、预览与可继续生长的花园隐喻。源码说明其使用 backlinks、tooltip hover previews、typed collections 和 CSS masonry（[V3 README](https://github.com/MaggieAppleton/maggieappleton.com-V3)）。
- **视觉系统（观察）**：暖白纸张底、深灰大衬线字、洋红强调色、手绘/植物感标志；技术主题因此具有人文辨识度。
- **可访问性/性能抽查（观察）**：检测到 `header`、`nav`、`main`；12 个图片元素均带 `alt`，未检测到 skip link。仓库公开了图片优化和视频 poster/压缩流程（[媒体处理说明](https://github.com/MaggieAppleton/maggieappleton.com-V3)）。
- **适合借鉴（推断）**：将“工程项目、论文研究、工具脚本、实践笔记”分成不同内容类型，避免所有成果都长成同一种卡片。
- **应避免（推断）**：宋林蔚当前目标是快速求职展示，不应让数字花园压过履历主线；内容生长系统应作为第二层，而非首屏主任务。

## 5. Lee Robinson

官网：[leerob.com](https://leerob.com/)；作者 GitHub：[leerob](https://github.com/leerob)。当前官网源码未在本次调研中确认。

- **首屏结构（观察）**：一个约 600px 的居中文本列，姓名后只用两段说明当前工作、过往经历与长期使命，随后列 6 篇代表文章和联系入口。
- **项目呈现（观察）**：首页不追求完整目录，而是由作者亲自筛选“favorite writing”；更完整的生涯叙事放在 [五分钟自传](https://leerob.com/bio) 中。
- **交互/动效（观察）**：几乎没有显式动效或复杂导航，普通文本链接就是主要交互。
- **视觉系统（观察）**：白底、深色衬线正文、默认感列表符号；看起来接近一封精心排版的个人信。
- **可访问性/性能抽查（观察）**：检测到 `main`，无首屏图片、按钮和复杂组件；未检测到 `header`、`nav` 或 skip link。资源极少，因此“加载与维护成本低”是合理推断，而不是本次正式性能跑分。
- **适合借鉴（推断）**：首屏必须有强编辑取舍：不是“我会什么都列出来”，而是“我希望你先记住哪三件事”。
- **应避免（推断）**：对尚需展示项目证据的候选人，Lee 式极简若原样照搬会显得信息不足。应把它作为摘要层，下一屏立即给项目证据。

## 6. Josh W. Comeau

官网：[joshwcomeau.com](https://www.joshwcomeau.com/)；作者说明当前站闭源及原因：[Why My Blog is Closed-Source](https://www.joshwcomeau.com/blog/why-my-blog-is-closed-source/)。

- **首屏结构（观察）**：顶部是品牌字标、内容分类、课程、Goodies、About、搜索/声音/主题控制；主视觉用天空、云层和 3D 人物建立亲和力，随后马上进入最新文章与分类入口。
- **项目呈现（观察）**：核心“产品”是教程与课程，首页采用“最新内容 + 分类标签 + 热门内容”的多入口策略；About 页面则把经历、开源包、演讲和个人细节穿成互动叙事（[About](https://www.joshwcomeau.com/about-josh/)）。
- **交互/动效（观察）**：声音开关、主题、搜索、可编辑生成艺术和大量文章内交互都体现“可探索解释”。这些功能与其“互动教学”身份一致，而不是无关炫技。
- **视觉系统（观察）**：高明度蓝天、圆润 3D 角色、粉色标签、粗体无衬线标题；品牌氛围友好而不幼稚。
- **可访问性/性能抽查（观察）**：检测到 `header`、`nav` 和 skip link；4 个图片元素均带 `alt`；首屏有 13 个按钮，功能丰富也意味着更高的交互与维护复杂度。
- **适合借鉴（推断）**：可以为“Local Window Copilot”加入一个与功能直接相关的小型交互演示，或让证据链在 hover/focus 时逐步展开；只选一个主互动。
- **应避免（推断）**：不要为求职作品集堆音效、生成艺术和多个开关。Josh 的互动密度由多年内容生态支撑；宋林蔚站点首先要保证 30 秒内完成职业判断。

## 7. Bruno Simon

官网 3D 版：[bruno-simon.com](https://bruno-simon.com/)；文本版：[bruno-simon.com/html](https://bruno-simon.com/html/)；当前源码：[brunosimon/folio-2025](https://github.com/brunosimon/folio-2025)。

- **首屏结构（观察）**：页面先加载一座 3D 小岛、车辆和 “Click to Start”；进入后通过驾驶车辆探索项目、经历和隐藏内容。首屏本身就是能力证明。
- **项目呈现（观察）**：项目被放进可驾驶世界中的地点与交互点；文本版则用 Activities、Projects、Lab 的普通列表提供直接索引（[HTML 版](https://bruno-simon.com/html/)）。
- **交互/动效（观察）**：WebGL/WebGPU、物理车辆、昼夜/天气、音频、成就和多输入方式构成完整游戏循环；仓库公开了 game loop、Three.js 资源与 Blender 压缩流程（[Folio 2025 README](https://github.com/brunosimon/folio-2025)）。
- **视觉系统（观察）**：低多边形 3D、霓虹紫黑空间、手写提示字、暖色小岛；视觉语言与“creative developer”定位高度一致。
- **可访问性/性能抽查（观察）**：本次首次进入约等待 9–10 秒才出现可操作场景；页面使用 1 个 canvas、44 个图片元素，其中 41 个未带 `alt`（其中可能包含装饰/界面精灵，不能仅据此判定违规）。未检测到标准 landmark 或 skip link，但官方提供完整文本版作为降级路径。
- **适合借鉴（推断）**：最值得学的不是 3D，而是“演示即简历”：让一个轻量、真实可操作的 Agent 工作流成为首页记忆点，并给出立即可读的文字证据。
- **应避免（推断）**：不要把简历和项目藏在需要学习操作的世界里；也不要让首屏依赖重型模型、音频或长加载。招聘访问往往发生在手机或受限网络。

## 8. Lynn Fisher

官网：[lynnandtonic.com](https://lynnandtonic.com/)；源码：[lynnandtonic/lynnandtonic.com](https://github.com/lynnandtonic/lynnandtonic.com)；历年版本：[Site Archive](https://lynnandtonic.com/archive/)。

- **首屏结构（观察）**：当前 V.XIX 像一本旧书目录：居中超大姓名、职业副标题、点线目录和罗马数字；首屏几乎没有解释文字，却有强烈身份感。
- **项目呈现（观察）**：Work、Thoughts、Archive、GIFs 分流不同内容；历年作品集版本被完整保留，形成“持续设计实践”本身的作品（[Archive](https://lynnandtonic.com/archive/)）。
- **交互/动效（观察）**：当前首屏的互动主要是目录和模式切换；真正的创意变化更多体现在响应式构图与每年重新设计。作者的旧版 About 也说明年度刷新和 responsive design 是其长期实践（[2021 About](https://lynnandtonic.com/archive/2021/about/)）。
- **视觉系统（观察）**：纸张纹理、黑色装饰衬线、目录点线和罗马数字构成极完整的“古籍索引”母题。
- **可访问性/性能抽查（观察）**：检测到 `header`、`nav`、`main`；无 raster 图片，只有 1 个 SVG；未检测到 skip link。首屏视觉资产很轻。
- **适合借鉴（推断）**：为宋林蔚站点选择可延展的“研究档案 / Agent 运行记录”语言，并让版本更新留下清晰痕迹，而不是每次换一套无关皮肤。
- **应避免（推断）**：极端主题化会牺牲第一眼信息量。宋林蔚首页仍需显式出现职位方向、核心能力、项目和可量化结果。

## 9. Max Böck

官网：[mxb.dev](https://mxb.dev/)；源码：[maxboeck/mxb](https://github.com/maxboeck/mxb)。

- **首屏结构（观察）**：顶部用编号导航形成秩序，Hero 以超大 “I make websites.” 建立一句话定位，紧接简短身份和 Featured Posts。
- **项目呈现（观察）**：当前首页偏写作型，每篇精选文章有标题、摘要、图像和阅读量/反馈数字；完整内容通过 Writing、Notes、About 分流（[官网](https://mxb.dev/)）。
- **交互/动效（观察）**：最显眼的是主题选择器，提供 Classic、Dark 和 8 个 Mario Kart 命名主题；个性化入口清楚但不阻断阅读。
- **视觉系统（观察）**：巨型衬线标题配现代无衬线正文，亮红作为单一强调色；编号导航和验证徽章形成编辑杂志感。
- **可访问性/性能抽查（观察）**：检测到 `header`、`nav`、`main` 和 skip link；9 个图片元素均带 `alt`。源码 README 说明站点用 Eleventy 构建，并强调开源用于学习而非整站复制（[仓库](https://github.com/maxboeck/mxb)）。
- **适合借鉴（推断）**：用一个极短、极大的职业命题统领首屏；导航编号可转换成“01 Projects / 02 Research / 03 Experience”。
- **应避免（推断）**：主题数量不应成为宋林蔚站点的主功能。保留一个稳健的浅/深色方案即可，把开发预算放在项目证据和移动端。

## 10. Emil Kowalski

官网：[emilkowal.ski](https://emilkowal.ski/)；作者 GitHub：[emilkowalski](https://github.com/emilkowalski)。本次未确认当前个人站源码仓库。

- **首屏结构（观察）**：窄列大留白，姓名/职位后直接进入 Today；两段话交代当前 Linear、过往 Vercel 和关注点，下一屏就是 Projects。
- **项目呈现（观察）**：animations.dev、Sonner、index.how、Vaul 都用“名称 + 一句功能定义”；Writing 同样是一行标题和一行观点摘要（[官网](https://emilkowal.ski/)）。
- **交互/动效（观察）**：静态画面极简，但项目/文章细节页承担互动演示；其公开设计工程规则强调只在有价值处使用动画、优先 transform/opacity 并适配 reduced motion（[公开技能](https://github.com/emilkowalski/skill/blob/main/skills/emil-design-eng/SKILL.md)）。
- **视觉系统（观察）**：暖白背景、近黑正文、浅灰辅助信息；层级主要靠空间、字重与对齐，而不是边框和卡片。
- **可访问性/性能抽查（观察）**：检测到 `header`、`main`，无首屏图片，仅 2 个按钮；未检测到 `nav` 或 skip link。轻资产和线性信息结构利于快速阅读。
- **适合借鉴（推断）**：把星途知汇、Local Window Copilot、论文各压缩成一句明确价值，再允许访客进入深层案例；项目索引不应先展示一排技术标签。
- **应避免（推断）**：过度留白会削弱宋林蔚的证据密度。可借用项目命名与摘要方式，但需在首屏并列展示 2–3 个可信指标或状态。

## 对宋林蔚作品集的设计原则

1. **先完成 30 秒判断，再制造惊喜。** 首屏必须同时回答姓名、目标角色、核心方向、两项旗舰成果和下一步入口；创意动效只能增强这些答案。
2. **只设一个可复述的视觉母题。** 建议围绕“Agent 运行轨迹 / 证据链 / 研究档案”构建，而不是混用玻璃拟态、霓虹渐变、终端窗口和 3D 等多套语言。
3. **项目先写价值，再写技术。** 每项采用“名称 → 一句解决的问题 → 个人职责 → 可验证结果 → 技术栈/链接”的顺序。
4. **首页只精选 2–5 项。** Josh Comeau 建议作品集是 highlight reel，并推荐展示 2–5 个项目（[官方说明](https://www.joshwcomeau.com/effective-portfolio/)）；其余成果进入完整档案页。
5. **让“演示即证据”，但保留文字捷径。** 可以做一个轻量 Agent 流程交互或证据链展开；同时始终提供静态摘要、项目页和简历入口，借鉴 Bruno 的 HTML 降级思路。
6. **动效是状态反馈，不是背景噪声。** 首屏允许一次编排式入场，项目卡只做 hover/focus/active 微交互；支持 `prefers-reduced-motion`，避免长时间循环漂浮。
7. **建立编辑型信息层级。** 用超大职业命题、紧凑元数据、宽松正文和单一强调色制造节奏；少依赖同尺寸卡片网格。
8. **把工程、研究、经历分层，不混成一个清单。** 首页形成“旗舰工程 → 论文研究 → 工作经历”的证据链；二级页再展开方法、架构、指标和源码。
9. **语义结构与性能属于视觉质量。** 保留 `header/nav/main/footer`、skip link、键盘焦点、有效 `alt`；首屏不依赖重型 WebGL、视频或远程字体才可成立。
10. **学习结构，不复制身份。** 开源仓库用于核对实现和取舍；最终配色、文案、图形和动效必须从宋林蔚自己的 AI Agent 项目与 CLI 气质生长出来。

## 推荐落地优先级

1. 首屏采用 Brittany 的快速履历判断能力 + Rauno 的单一强视觉记忆点。
2. 项目索引采用 Paco / Emil 的“一句话价值”，项目详情采用 Brittany 的证据结构。
3. 研究与写作采用 Maggie 的分类方法，但保持 Lee 式精选，避免首页变成资料库。
4. 微交互参考 Josh / Rauno 的细节感，严格控制为一个主互动和少量反馈。
5. 可访问性与轻量降级参考 Brittany、Max 和 Bruno 的文本替代路径。
