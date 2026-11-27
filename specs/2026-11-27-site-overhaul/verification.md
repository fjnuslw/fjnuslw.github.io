# 2026-11-27 个人网站重塑验收记录

对应规格：[spec.md](spec.md) · 任务清单：[tasks.md](tasks.md)

> **部署状态说明**：本地验证与线上发布均已完成。提交 `3123f85` 已推送至 `https://github.com/fjnuslw/fjnuslw.github.io.git`（`main`），GitHub Actions `Deploy site` Run `45966694530` 通过并成功发布至 `https://fjnuslw.github.io/`。

## 1. 静态构建、资源指纹与边界检查

- `node tools/stamp-assets.mjs`：通过，已同步全站 HTML/CSS/JS 资源哈希查询串。
- `node tools/validate-site.mjs`：通过——`15 个 HTML 文件，301 个本地资源链接，14 个正式路由；已核对 H1、标题层级和站内锚点`。
- `node tools/build-site.mjs`：通过——`60 个文件 → dist/；内部文档与制作资料已排除`（`.impeccable/`、`PRODUCT.md`、`DESIGN.md`、`specs/`、`resume-redesign/`、`ai-prep/`、`.private/` 均未进入 `dist/`）。
- `node tools/validate-site.mjs --dist`：通过——`14 个 HTML 文件，285 个本地资源链接，14 个正式路由；已核对 H1、标题层级和站内锚点`。
- `git diff --check`：退出码 `0`（零尾随空白或冲突标记）。
- `impeccable embed-prompt --scan assets/plates`：通过——`SCAN: 3 rasters, 0 missing`（`brand-emblem.png`、`hero-skyline.png`、`hero-dither-bar.png`）。
- `impeccable concept-seed --check-seed seed:a5144041fc5fa5e9`：通过——`SEED KNOWN: seed:a5144041fc5fa5e9 was rolled on this machine.`。
- 作者未提交工作区 `resume-redesign/` 经 `git status --short` 核对保持原状未改动。

## 2. 首屏视口、320px 响应式与交互 QA（本地 Chrome Headless 对 `dist/` 实测）

- **`impeccable first-viewport`（`390×844` 与 `1440×900`）**：
  - `390×844`：`#hero-title` 100% 位于首屏，`.pc98-cta.is-primary` 完整位于首屏且为有效链接；像素底板以 `2.15 / 1` 零遮罩顶图区呈现于深空文案上方（`.impeccable/review/mobile.png`）。
  - `1440×900`：`#hero-title` 与主 CTA 完整位于首屏，左轨固定 14% 宽度，底部三联停靠窗齐平（`.impeccable/review/desktop.png`）。
- **多路由无横向溢出与图片完好（9 条路由 × `{1440×900, 320×800}` = 18/18 通过）**：
  - 覆盖 `index.html`、`projects.html`、`about.html`、`blog.html`、`projects/reposocratic.html`、`projects/local-window-copilot.html`、`projects/research-to-spec.html`、`blog/agent-status-spine.html`、`blog/kv-cache-reuse.html`。
  - 所有路由在 `320×800` 下 `scrollWidth === 320 === clientWidth`，`brokenImgs: []`。
  - 3 列 RepoSocratic 核心评测表在 `320×800` 下 `tableWidth = 264 = wrapWidth`，`86.5%` 完整显示零裁切；`projects/reposocratic.html` 4 列详表附带窄屏显式横向滚动提示 `.pc98-scroll-hint`。
- **桌面滚动导航与滚动联动**：`index.html` 在 `y = 0` 时 `.navbar` 为 `display: none`，滚动至 `#experience` 后自动转为 `display: block` 且激活项同步为 `03实习实践`。
- **移动端抽屉键盘控制（`390×844`）**：点击 `.nav-toggle` 后 `aria-expanded="true"`、`.nav-menu.active` 打开；按 `Escape` 后关闭并将焦点恢复至 `.nav-toggle`（`focusRestored: true`）。
- **笔记标签筛选（`blog.html`）**：初始 6 篇，点击 `Agent` 显示 6 篇并更新状态文本「主题「Agent」：6 篇笔记」，点击 `VLM` 筛至 2 篇，点击 `全部` 恢复 6 篇。
- **历史文章阅读兼容性（`blog/agent-status-spine.html`）**：顶部引导条已更新为 `← 返回技术笔记 / NOTES / READING ROOM`，暖纸正文与原 SVG 图示保持高对比度，文末 `.article-footer-nav a.btn` 实测文字色 `rgb(247, 235, 208)` 落于 `rgb(46, 72, 130)` 按钮底色上清晰可读。
- **无 JS（`scriptExecutionDisabled: true`）**：`index.html`、`projects.html`、`blog.html`、`about.html` 四个入口页均 `h1Visible: true`，全部卡片与导航直出可见。
- **减少动态效果（`prefers-reduced-motion: reduce`）**：主标题 `opacity: "1"` 且高度正常，按钮过渡时长收敛至 `1e-05s`。
- **打印模式（`media: print`）**：背景切换为 `rgb(255, 255, 255)`，文字切换为 `rgb(17, 17, 17)`，`.pc98-rail` 与 `.navbar` 隐藏，`h1` 保持 `display: block`。

## 3. 独立 Finish Reviewer 审校与已知外部环境限制

- **初审**：发现 7 项 `material_fixes`（左轨比例与 hero 出血、自托管简中像素展示体、0px 锐利斜面与抖动标题条、桌面滚动后导航可达性、移动端零遮罩顶图与 320px 表格、扁平化 `COMPETITIONS & EVAL` / 去重 `<h3>` / 像素 SVG 图标 / `about.html` 错字、以及 `index-html.md` 与 `state.json` 对齐）。
- **复审（Verdict Pass）**：上述 6 项视觉、保真、字体、移动端、真实性与 Craft Floor 修复项**全部评为 `resolved`**（视觉矩阵零 `contradicted` / `missing` / `added without approval` 项）；复审指出的 2 处微小回归（1376px 视口 `PROFILE.DAT` 换行拆字与 `initActiveNavLink()` 锚点守卫）随后已一并修复并重新构建验证。
- **复审结论原文与说明**：复审维持 `disposition: fix`，唯一未闭环项为 Check 1 持久化门禁——本机卡巴斯基杀毒软件会向本地 `http://127.0.0.1` 响应注入第三方脚本（`gc.kis.v2.scr.kaspersky-labs.com`），导致 `impeccable component-review capture` 冻结字节校验中断；因遵循安全约束不关闭或绕过本机杀毒软件、亦不手工伪造 `.impeccable/build/state.json`，该文件如实保留于 `hero` 打开状态（且 `DESIGN.md` 与 `.impeccable/design.json` 已在复审后完成编写）。

## 4. 线上部署与活站复核（2026-11-27）

- **Git 提交与推送**：`3123f858e654d695752e4859d6e8bd5fc7915090`（`main` → `origin/main`，作者 `fjnuslw`，排除 `resume-redesign/` 与 `.impeccable/` 临时缓存）。
- **GitHub Actions 工作流**：`Deploy site` Run [45966694530](https://github.com/fjnuslw/fjnuslw.github.io/actions/runs/45966694530) 状态 `completed`，结论 `success`。
- **线上资源一致性核验**：
  - `GET https://fjnuslw.github.io/`：`HTTP 200`，`<title>` 为 `宋林蔚 · Agent 后训练与多跳检索`，包含 `pc98-stage` 与 `PROFILE.DAT`，`css/portfolio.css?v=4db8bdcd4a` 与本地 `dist/index.html` 哈希完全一致。
  - `HEAD https://fjnuslw.github.io/assets/fonts/fusion-pixel-12px-sc.woff2`：`HTTP 200`（`223,612` bytes）。
  - `HEAD https://fjnuslw.github.io/assets/plates/hero-skyline.png`：`HTTP 200`（`36,084` bytes）。

## 5. 本地预览方式

```powershell
node tools/preview-site.mjs
```

启动后在本地浏览器访问 `http://127.0.0.1:4174/`（或直接浏览 `dist/index.html`）核查效果；确认满意后再另行决定是否提交并推送至线上。
