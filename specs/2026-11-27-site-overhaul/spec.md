# 个人网站全面重塑与实证内容更新

日期：2026-11-27 · 状态：已验证（线上已发布）

## 问题与证据

用户反馈当前线上站点（`2026-10-25` 内容版 + `2026-09-06` 流光墨彩 / 数字花园视觉版）存在三个核心问题：
1. **AI 模板味偏重**：暖米纸底色、渐变文字标题、玫瑰色印章、斜体衬线、全大写英文 eyebrow 标签、粒子画布以及“数字花园 / 园主 / 慢慢生长”文青式口吻。
2. **内容偏杂**：首页堆砌 3D 翻页画册、预设动画小助手 Playground 展台以及不在当前主线的旧项目和小工具。
3. **事实过时**：缺少最新简历（2026.11）中的核心内容——明源云·橙果算法组 Agent 算法实习、Kaggle Name That LLM 公榜银牌区（BA 0.703，255/6,514）、Gemma 4 Developer Agent（Top 23%，990 回合轨迹 SFT）、EMNLP 2026 论文正式发表入口（ACL Anthology `2026.findings-emnlp.1449`）、2026 学业奖学金与三好学生荣誉，以及友达光电神经符号护栏与 WenQu/RepoSocratic 最新训练细节。

## 范围与行为

- **SO01 公开内容边界**：定位为技术研究者与工程师主页，突出论文、三段工程实习实践、Kaggle 与蓝桥杯竞赛、旗舰开源项目 `WenQu / RepoSocratic` 与技术笔记；严禁公开手机号、证件照、求职条幅（如“可连续实习 6 个月以上”）、简历下载或面试准备资料。保留作者未提交的 `resume-redesign/` 改动且不纳入公开构建。
- **SO02 视觉体系彻底换代**：通过 Impeccable `init` -> `concept-seed` -> 决策页确认新视觉世界与首屏效果图（`comp-first`），彻底移除“数字花园 / 林蔚手记 / 园主”外壳、3D 翻页画册、首页 Playground 展台与环境粒子画布；以单一共享视觉系统重写 `css/style.css`、`css/portfolio.css` 与 `js/main.js`，同步更新导航、页脚、内页头部与详情/文章外壳。
- **SO03 首页信息架构（代表性首屏先行）**：`index.html` 首屏直接呈现作者身份、核心研究方向与可核查实证入口（论文、多分支 GRPO 与 Harness 迭代、Kaggle 银牌、RepoSocratic 86.5%；不将“8 卡 A800”等硬件卡数直接挂在首页主视觉），下方依次展开：论文研究（IN-Retriever / ESRA）、工程实习实践（明源云 / 友达光电 / 福建新意科技）、竞赛与开源旗舰（Kaggle 两项 / 蓝桥杯 / WenQu & RepoSocratic）、精选技术手记入口与联系页脚。
- **SO04 作品页与旧项目归档**：`projects.html` 主线聚焦旗舰开源与竞赛工程（WenQu / RepoSocratic、Name That LLM、Gemma 4 Developer Agent、OpenSOP-Agent）及工业系统摘要；将旧项目（Local Window Copilot 及其交互模拟 Demo、星途知汇、Research-to-Spec、video-to-knowledge、SilentDeck）移入页面底部次级「早期归档」区块，保留全部原 URL 与站内锚点防止外部断链，并在交互模拟入口继续标明“不读取真实桌面、不运行本地模型”。
- **SO05 关于页、笔记页与详情页同步**：
  - `about.html` 更新教育背景（含 2025/2026 一等学业奖学金、2026 三好学生）、两篇论文（`IN-Retriever` 更新为 Findings of EMNLP 2026 已发表并链接 ACL Anthology；`ESRA` 保留 NAACL 在审与 OpenReview 作者页）、三段实习技术实践（明源云、友达光电、福建新意科技）与三项竞赛荣誉（Name That LLM、Gemma 4 Developer Agent、蓝桥杯证书链接）。
  - `blog.html` 与 `blog/*.html` 完整保留 6 篇历史技术笔记的正文、日期、URL 与 `blog/posts.json` 索引，同步新导航、页脚与阅读样式，确保 `6 篇公开笔记` 与筛选交互正常。
  - `projects/reposocratic.html` 补充完整训练与评测口径（Qwen3.8-27B → Qwen3.5-9B 蒸馏、双卡最长 11.7 万 token、24 家族 288 轨迹 86.5% 完成率与 +10.4pp 对照，同时保留 WenQu 在线会话尚未接入 9B 服务的边界说明）。
- **SO06 静默降级、无障碍与构建边界**：无远程字体、无后端、无追踪器；核心内容与链接直出 HTML，无 JS 时完整可读可导航；满足桌面与 320px 手机视口无横向撑宽、键盘焦点可见、WCAG AA 对比度、`prefers-reduced-motion` 与打印友好。`.impeccable/`、`PRODUCT.md`、`DESIGN.md`、`specs/` 与 `resume-redesign/` 排除在 `dist/` 与站点校验范围外。
- **SO07 验收与文档沉淀**：完成 Impeccable 机械检测（`impeccable detect --json --changed`）、桌面与移动端真机渲染截图、`impeccable-finish-reviewer` 独立审校、`DESIGN.md` + `.impeccable/design.json` 文档化，以及 `node tools/validate-site.mjs`、`node tools/build-site.mjs`、`node tools/validate-site.mjs --dist`、`git diff --check`。

## 设计与取舍

- 产品真相已记录于 `PRODUCT.md`，已实现的视觉设计系统令牌与组件规范已沉淀于 `DESIGN.md` 与 `.impeccable/design.json`。
- 视觉世界由用户在 Impeccable 决策页（`seed:a5144041fc5fa5e9`）采纳 `digital-design-canon-pc98-sixteen-color-field`（「PC-98 十六色抖动视窗」），并在 3 套首屏效果图评审中选定 `.impeccable/mocks/pc98-comp-1.png`（左侧固定导航轨 + 右上主视觉 + 下部三联停靠实证窗）。
- 根据用户在素材审查（第 2 轮）与首屏审阅中的明确反馈，落地四项针对性演进：
  1. 主视觉底板由通用天文台夜景改为 Agent 算法与应用主题的 PC-98 16 色 4×4 Bayer 抖动等距像素插画（`assets/plates/hero-skyline.png`：三层等距 Agent Core、浮空证据分片、青/绿多跳与 GRPO 轨迹弧、紫红剪枝分支与透视检查点网格）。
  2. 首页主视觉与停靠窗不挂「8 卡 A800 / 8×A800」硬件卡数。
  3. 左侧导航轨底部去除无意义海岸夜景图（删除 `sidebar-nightscape.png`），改为结构化 `PROFILE.DAT` 作者坐标隔舱（研究方向、院校、荣誉、福州实时 UTC+8 与 GitHub/Email 直链）。
  4. 中部停靠窗去除游戏式进度条，改为可点击的实证数值台账 `COMPETITIONS & EVAL`（Name That LLM `0.703`、RepoSocratic `86.5%`、Gemma 4 `Top 23%`）。
- 展示字体自托管 SIL OFL 1.1 `Fusion Pixel 12px` 简体中文子集 WOFF2（`assets/fonts/fusion-pixel-12px-sc.woff2`，含全站 1,280 个唯一字符及完整 ASCII），搭配 `Share Tech Mono` 与系统正文黑体，实现零外部字体请求与中英像素展示体统一。
- 保留 `projects/local-window-copilot.html`、`projects/research-to-spec.html`、`demos/local-window-copilot/index.html` 与 6 篇 `blog/*.html` 路由，历史文章正文继续保留暖纸阅读室（`#f5efe0`）以兼容原有浅底 SVG 图示，仅同步 PC-98 顶栏、页脚与阅读引导条。

## 任务与验收

详见同目录 [tasks.md](tasks.md) 与 [verification.md](verification.md)。

## 决策与发布记录

- 2026-11-27：用户确认三项核心产品决策——（1）技术研究者与工程师主页，不含招聘/手机号/证件照；（2）彻底去“数字花园”外壳与首页 Playground，主线对齐 2026.11 简历，旧项目降级归档且保留原 URL，6 篇历史笔记完整保留；（3）采用 `comp-first` 路径先定标首屏视觉效果图。
- 2026-11-27：用户通过浏览器审阅批准 `digital-design-canon-pc98-sixteen-color-field` 方向、`pc98-comp-1.png` 构图与 3 张 PC-98 像素底板，并明确提出 Agent 主题插画、`PROFILE.DAT`、`COMPETITIONS & EVAL` 与首页不写 `8×A800` 四项调整。
- 2026-11-27：完成本地改动、独立 Finish Reviewer 审校（含 Verdict Pass）、`DESIGN.md` 文档化与 `dist/` 构建验证，并按用户指令推送至 `origin/main`（提交 `3123f85`）；GitHub Actions `Deploy site`（Run `45966694530`）构建并发布成功，线上 `https://fjnuslw.github.io/` 校验匹配。
