# 任务

- [x] T01 / P01 P02：照片撤除。about.html 改印章 SVG 身份牌；`tools/site-manifest.mjs` 去引用；`git rm assets/song-linwei.jpg`，文件转存 `.private/`；dist 产物 0 处照片引用。
- [x] T02 / V01–V05：重写 `css/style.css` 与 `css/portfolio.css`；对比度计算见 verification.md。
- [x] T03 / M01–M05：重写 `js/main.js`：信号地形、标题解码、导航 scramble、磁性按钮、索引预览、计数、时钟；保留导览/筛选/进度/展台逻辑。
- [x] T04 / V03 V05：重写首页、项目、笔记、关于四页。
- [x] T05 / V03：详情页与文章页外壳脚本化替换（`../` 前缀修正后通过校验）；两篇专题文章页头配色对齐纸墨（保留其大字号版式）。
- [x] T06 / V03：演示页 chrome 调色（链接/背景/字体），状态色保留。
- [x] T07 / A01：validate/build/diff --check 通过；桌面 1440 与 320px 全 13 页浏览器验收；修复三处发现的问题（桌面导航关闭按钮泄漏、文章页头深色残留、语义地形文章 320px 溢出）；无 JS 与减少动态夹具抽查通过。
- [x] T08 / G02：白名单工作流 `.github/workflows/deploy.yml`；提交推送 main；部署证据见 verification.md。
