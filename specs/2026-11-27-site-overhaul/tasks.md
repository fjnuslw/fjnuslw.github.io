# 2026-11-27 个人网站重塑任务清单

对应规格：[spec.md](spec.md) · 验收证据：[verification.md](verification.md)

| 状态 | 任务 | 关联需求 | 交付文件 / 产物 |
| --- | --- | --- | --- |
| 已完成 | 建立产品真相文档与构图工作流配置 | SO01, SO07 | `PRODUCT.md`, `.impeccable/config.json`, `specs/2026-11-27-site-overhaul/spec.md` |
| 已完成 | 完成视觉方向决策与首屏 3 方案评审并锁定构图与底板 | SO02, SO03 | `.impeccable/surfaces/index-html.md`, `.impeccable/mocks/pc98-comp-1.png`, `assets/plates/{brand-emblem,hero-skyline,hero-dither-bar}.png`（全量含 prompt provenance） |
| 已完成 | 自托管本地字体（Fusion Pixel 12px 简中子集 + Saira Condensed + Share Tech Mono）与 PC-98 图标 | SO02, SO06 | `assets/fonts/fusion-pixel-12px-sc.woff2`, `assets/fonts/FUSION-PIXEL-OFL.txt`, `assets/fonts/saira-condensed-*.woff2`, `assets/fonts/share-tech-mono-400-latin.woff2`, `favicon.svg` |
| 已完成 | 重写全站共享样式、交互脚本与 5 个核心页面（对齐 2026.11 简历实证并去 AI 模板化） | SO01, SO02, SO03, SO04, SO05 | `css/style.css`, `css/portfolio.css`, `js/main.js`, `index.html`, `projects.html`, `about.html`, `blog.html`, `projects/reposocratic.html` |
| 已完成 | 同步 6 篇历史笔记、2 篇归档项目页与交互模拟页外壳，保留全部历史正文/日期/URL | SO04, SO05, SO06 | `blog/*.html`, `blog/template.html`, `projects/local-window-copilot.html`, `projects/research-to-spec.html`, `demos/local-window-copilot/index.html`, `sitemap.xml` |
| 已完成 | 更新白名单构建与校验脚本，排除 `.impeccable/`、`PRODUCT.md`、`DESIGN.md`、`specs/` 与 `resume-redesign/` | SO01, SO06 | `tools/site-manifest.mjs`, `tools/validate-site.mjs`, `tools/build-site.mjs` |
| 已完成 | 执行机械检测、Chrome 多视口/交互/无障碍 QA、Finish Reviewer 独立审校及 Verdict Pass 修复 | SO06, SO07 | `.impeccable/review/{desktop,mobile,final-repro}.png`, `.impeccable/review/diff/final/`, `verification.md` |
| 已完成 | 沉淀设计系统文档、侧车 JSON 与仓库规格索引，并输出本地 `dist/` | SO07 | `DESIGN.md`, `.impeccable/design.json`, `specs/README.md`, `specs/site.md`, `dist/`（本地构建，未推送线上） |
