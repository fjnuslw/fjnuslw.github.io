# 个人网站基线

更新：2026-11-27。网站作者：宋林蔚（Linwei Song）；正式域名：`https://fjnuslw.github.io/`。

## 访问任务

访客可在首屏数秒内核实作者的学术论文、工程实习实践、竞赛成绩、开源源码与模型权重，并顺畅阅读深度技术笔记。公共网站不展示招聘意向、手机号、证件照、简历下载或面试准备资料。

## 信息架构

- 首页 `index.html`：PC-98 十六色固定区格首屏（14% 左侧固定导航轨 + `PROFILE.DAT` 坐标档案、右上全出血 Agent Core 像素底板与核心实证入口、下部 `RESEARCH & INDUSTRY` / `COMPETITIONS & EVAL` / `LINKS.LOG` 三联停靠窗）；首屏以下依次展开论文研究、三段工程实习、旗舰开源与竞赛、近期技术笔记及统一页脚，桌面端滚出首屏后自动浮现联动顶栏。
- 竞赛与开源 `projects.html`：主线聚焦 `WenQu / RepoSocratic`、`Kaggle Name That LLM`、`Kaggle Gemma 4 Developer Agent` 与 `OpenSOP-Agent`；早期项目（`Local Window Copilot` 及其前端模拟 Demo、`星途知汇`、`Research-to-Spec`、`video-to-knowledge`、`SilentDeck`）收拢于页末「早期探索与工具归档」，完整保留全部原有路由与锚点。
- 技术笔记 `blog.html` + `blog/*.html`：6 篇历史技术笔记保留原文、发布日期、URL、`blog/posts.json` 索引与暖纸阅读室（兼容既有浅底 SVG 图表），统一顶部 PC-98 指令栏、阅读引导条与页脚，提供客户端主题标签筛选。
- 关于 `about.html`：教育背景（含 2025/2026 一等学业奖学金与三好学生）、`IN-Retriever`（Findings of EMNLP 2026 已发表）/ `ESRA`（NAACL 在审）研究说明、三段工程实习详情与三项竞赛荣誉记录。
- `projects/reposocratic.html`：`WenQu / RepoSocratic` 独立训练与同条件评测档案页，明确在线应用与 9B 离线权重的接入边界。
- `demos/local-window-copilot/`：浏览器内纯前端交互模拟，明确标注不读取真实桌面、不运行本地模型。
- `ai-prep/`、`resume-redesign/`、`.private/`、`.impeccable/`、`specs/`：仅在本地维护，构建脚本严格白名单排除，不进入正式发布的 `dist/`。

## 视觉与技术约束

- 视觉体系记录于 [DESIGN.md](../DESIGN.md)（配侧车 `.impeccable/design.json`）：锁定 16 色午夜深空蓝 PC-98 视觉世界（`#090b28` / `#101435` / `#2e4882` / `#a33a5d` / `#f0e0ba` 及青/绿/琥珀实证信号色）、0px 直角像素双斜面边框、4×4 有序抖动底板与标题条，无模糊投影、无毛玻璃、无装饰粒子画布。
- 静态 HTML/CSS/JS，零外部字体、零后端、零追踪器。展示体自托管 SIL OFL 1.1 `Fusion Pixel 12px` 简体中文子集 WOFF2（`assets/fonts/fusion-pixel-12px-sc.woff2`），辅以自托管 `Saira Condensed`、`Share Tech Mono` 与系统正文黑体；所有共享样式位于 `css/style.css` 与 `css/portfolio.css`，共享渐进增强交互位于 `js/main.js`。
- 重要内容和链接直接写在 HTML；无 JS 时完整可读可导航；正式页面保持唯一 H1、清晰标题层级、有效 canonical、桌面与 320px 无横向撑宽、键盘焦点可见、减少动态效果收敛与打印模式友好。

## 发布与维护

- 使用 `node tools/build-site.mjs` 按白名单输出正式静态文件至 `dist/`，严禁直接打包仓库根目录。
- 每次跨页改动前更新对应 `specs/`，改动后执行 `node tools/stamp-assets.mjs`、`node tools/validate-site.mjs`、`node tools/build-site.mjs`、`node tools/validate-site.mjs --dist`、`git diff --check`，并在桌面与 320px 手机视口核查渲染与交互。
- 当前活跃视觉与内容变更见 [specs/2026-11-27-site-overhaul/](2026-11-27-site-overhaul/spec.md)。
