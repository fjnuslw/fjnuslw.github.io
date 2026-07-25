# 个人网站前端优化 Spec（2026-07-25）

> 目标：在保持现有极简风格不变的前提下，修复布局一致性问题、拉开首页版式节奏、清理工程债。
> 范围：index / blog / projects / resume / about + css/style.css（+ js/main.js 如需）
> 非目标：不改变配色体系、不引入框架、不做深色模式（列入后续 backlog）

---

## S1 统一全站宽度体系（P0）

**现状**：四处宽度并存 —— 导航/首页/页脚 1120px（L1821 补丁覆盖）、子页面 880px（L1994 补丁覆盖）、文章正文 768px、初始定义 720px。补丁叠补丁。

**修改**：
- `:root` 主定义：`--max-width: 960px`、`--max-width-wide: 960px`（保留两个变量名，HTML 不用动）
- 删除 L1821 `:root { --max-width-wide: 1120px; }` 补丁
- 删除文件末尾 L1993-1995 补丁；`.post-content` 阅读宽度（768px）规则保留并移到正文样式区，注释标注「长文阅读宽度，有意窄于内容宽度」

**验收**：桌面端导航、页脚、五个页面内容区左右边缘全部对齐（960px）；仅博客文章正文保持 768px。

## S2 首页 section 版式差异化（P1）

**现状**：精选项目 / 求职工具 / 技术栈三个 section 共用「3 列网格」版式，节奏重复。

**修改**：
- 精选项目：保持 3 列卡片网格（全站视觉重心，唯一卡片区）
- 最新文章：保持现有横条列表（已差异化，不动）
- 求职工具 `.resource-grid`：3 列 → 单列整行横条（resource-card 本身已是横向结构，只改容器列数）
- 技术栈 `.capability-grid`：3 列卡片 → 行内标签流。`.capability-group` 去卡片化（去边框/背景/内边距），改为 flex 行：组标题固定宽 + 标签 inline 排列；组间仅分隔线

**验收**：首页自上而下版式序列为：左右分栏 → 3列网格 → 横条列表 → 整行横条 → 行内标签流，无相邻重复。

## S3 项目页信息架构重构（P0）

**修改**：
- 删除「如何添加 Demo？」站长说明卡（内容已在 demos/README.md）
- 「数据分析助手（规划中）」移至项目列表末尾；徽章由蓝色 badge-wip 改为琥珀色 badge-coming，与已完成项目拉开权重
- 项目卡描述统一 `-webkit-line-clamp: 3` 截断，消除卡片高差
- 封面语言统一：无实景图卡片的「渐变 + emoji」封面 → 与首页一致的信号条（浅底 + 三词流程，随卡片主题色）；Local Window Copilot 保留 mascot 实景图
- 「在线 Demo」区保留 iframe，精简引导文案

**验收**：页面只含访客向内容；卡片视觉高度一致；全站项目卡片设计语言统一（信号条或实景图）。

## S4 清理内联样式（P0）

**现状**：about / resume / projects 三页共 30+ 处 `style="..."`，设计系统被架空。

**修改**：全部迁移为 style.css 语义化类：
- `.intro-text`（about 自我介绍段落）、`.section-block`（区块底部间距）
- `.resume-header` / `.resume-contact`（简历基本信息块）、`.skill-matrix`（技能清单两列表）
- `.resume-item-flat`（无边框 resume-item 变体）
- `.demo-note`（Demo 区说明文字）

**验收**：三页 HTML 中除卡片主题色变量（`--card-color`）外，无其他内联样式。

## S5 page-header 与 footer 增强（P1）

**page-header**：四个子页面标题区增加 mono eyebrow 小字（BLOG / PROJECTS / RESUME / ABOUT），样式复用 hero-eyebrow 体系，与首页呼应。

**footer**：单行 → 三区结构：左侧版权与定位说明 / 中间站内导航（5 页）/ 右侧站外链接（GitHub、邮箱）。五个页面统一替换；移动端纵向堆叠。

**SEO 补强**：五个页面统一补 og:title / og:description / og:type / og:url 与 twitter card meta。

## S6 无 JS 降级（P2 顺带）

- 首页「最新文章」与 blog.html 文章列表容器增加 `<noscript>` 提示与博客页链接
- css/js 引用版本号统一更新为 `?v=20260725`

---

## 验证清单

1. 本地 http 服务下五个页面均 200，控制台无报错
2. 桌面宽度下 S1 对齐验收；375px 移动宽度下无横向滚动
3. `git push origin main` 成功，线上 https://fjnuslw.github.io 各页面渲染正常

## Backlog（本次不做）

- 深色模式（需全量变量梳理，单独立项）
- 博客文章静态化渲染（现依赖 JS fetch posts.json）
- OG 分享图片生成
