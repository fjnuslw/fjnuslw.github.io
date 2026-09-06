# 验收记录

日期：2026-09-06。证据产生环境：本机 Node 24、dist 预览服务（`tools/preview-site.mjs --qa`）、内置浏览器 1440×900 与 320×740 视口。

## 静态校验（G01）

- `node tools/validate-site.mjs`：通过。14 个 HTML 文件、238 个本地资源链接、13 个正式路由；H1 唯一性、标题层级、锚点、canonical 均核对。
- `node tools/build-site.mjs`：48 个文件 → `dist/`；`--dist` 校验通过；产物中 `song-linwei` 引用 0 处。
- `git diff --check`：无输出（无空白错误）。

## 对比度（V01，WCAG 相对亮度计算）

| 前景 / 背景 | 比率 | 用途 |
| --- | --- | --- |
| 墨 #1d1a15 / 纸 #f6f2e9 | 15.52 | 正文 |
| 墨 2 #423d32 / 纸 | 9.66 | 次级文字 |
| 灰墨 #635b49 / 纸 | 6.02 | 元信息 |
| 朱砂 #a83517 / 纸 | 5.90 | 强调与链接 |
| 松绿 #2e5d4b / 纸 | 6.75 | 辅助 |
| 朱砂 / 洗纸 #f0ebdf | 5.54 | 面板内强调 |
| 纸 / 墨底 #191611 | 16.15 | 深段文字 |
| 亮朱砂 #d9552b / 墨底 | 4.54 | 深段强调 |

全部 ≥4.5:1，满足 AA 普通文本要求。

## 浏览器验收（A01 / M01–M05）

- 首页 1440px：地形画布初始化（1425×860）、标题解码后完整呈现、页脚时钟显示「福州 HH:MM」、统计数字计数、无横向溢出。
- 展台：运行一次后 STEP 02/03、节点高亮、文案更新；切换「星途知汇」标题/节点/选中态同步。
- 导览：Ctrl+K 打开（9 条默认结果），搜索「缓存」返回 2 条（posts.json 已加载），Esc 关闭。
- 笔记筛选：VLM → 「显示 2 / 6 篇文章」；全部 → 6。
- 移动菜单 320px：开（aria-expanded=true、body 锁定）、关均正常；汉堡按钮可见。
- 320px 全 13 个公开路由 `scrollWidth - clientWidth` 均为 0。
- `__qa/nojs/`：内容完整、静态导航 4 链接可用、reveal 全可见。
- `__qa/reduced/`：地形画布隐藏、内容完整、无溢出。

## 验收中发现并修复的问题

1. 桌面导航出现移动端关闭按钮（`.nav-menu-close` 基线未隐藏）→ 修复于 portfolio.css。
2. 两篇专题文章（status / kv）页头深色背景残留 → 直接在文章 CSS 中对齐纸墨（保留其大字号版式）。
3. 语义地形文章 320px 横向溢出 385px：全局 `.post-content pre code{white-space:pre}` 与卡片式代码块叠加导致 1fr 轨道被 min-content 撑破（属遗留问题，本轮验收发现）→ 该文章内联样式补 `white-space:pre-wrap; overflow-wrap:anywhere`。

## 发布（G02）

- 推送：见下方记录。
- Pages：`.github/workflows/deploy.yml` 以白名单构建 dist 并部署；工作流含 validate → build → validate --dist 三道校验。
- 部署结果：推送后回填。

## 遗留

- `assets/og-evidence-ledger.png` 社交分享卡仍为旧视觉，配色未随纸墨系统重绘（不影响站点本身，后续单独更新）。
- gh CLI 在本机不可用，Pages 源若未自动切到 Actions，需要仓库管理员在 Settings → Pages 将 Source 设为 GitHub Actions（工作流已带 `enablement: true` 会尝试自动接管）。
