# 验收记录

状态：本地验收与正式发布均通过。日期：2026-09-06（Asia/Shanghai）。

## 起点

- `git status --porcelain=v1`：空，原有作者工作无待提交变更。
- `git branch --show-current`：main；HEAD `b3722c9`。
- `git remote -v`：origin 为指定的 fjnuslw/fjnuslw.github.io。
- 视频读取成功：256.57 秒，关键帧保存在本地 `tmp/video-redesign/`，不提交。

## 本地验证

环境：Windows、Node v24.14.0、Edge 152.0.4191.53（隔离无界面浏览器）；用户可见预览为 Codex 内置浏览器。浏览器仿真不等同于实体手机或实体打印机测试。

### 命令

- `node --check js/main.js`：通过。
- `node tools/stamp-assets.mjs`：更新资源内容戳，再运行显示 **0 页更新**，含字体 CSS 引用与 preload 的相同哈希。
- `node tools/validate-site.mjs`：**14 个 HTML / 259 个本地链接 / 13 个正式路由**，H1、标题层级、锚点、索引、sitemap、SVG 说明检查通过。
- `node tools/build-site.mjs`：**50 个文件**，仅白名单公开页面/资源和字体许可；specs、tmp、研究资料、制作文件均不在 dist。
- `node tools/validate-site.mjs --dist`：**13 个 HTML / 245 个本地链接 / 13 个正式路由**，通过。
- `git diff --check`：通过；修正末尾多余空行。
- `python tmp/video-redesign/check-content.py`：六篇文章 `.post-content` 和日期文本与起始 HEAD 逐项一致。

### 浏览器

`node tmp/video-redesign/qa.cjs`（本地验收脚本，不发布）最终结果：

- **34 组视口检查**：13 路由 × 1440/320px + 四主页面 × 390/768px；页面 `scrollWidth === innerWidth`，0 脚本错误、0 失效图片。桌面/手机视口高 1000px。
- **45 项行为检查，全部通过**：画册名称/链接同步、循环和方向键；空间/平面、Home 和前后切换；移动展架局部滚动；菜单打开焦点、Escape 归位；触屏点击及横划事件；全局动态与流程演示暂停同步；减少动态下逐步完成演示；笔记筛选及重置；关键词检索、503 回退；文章进度；打印保留正文；13 路由无 JS（320×900）；四主页 200% 文字；字体实际加载、字体下载失败回退。
- 字体改动后重新运行同一检查集，并等待 `document.fonts.ready` 后截图；不是只检查回退字体。
- 发现并修复：菜单首次展开时 visibility 过渡造成焦点落在菜单按钮，取消该可见性过渡；移动展架定位坐标修正并在滚动停止后同步题签；Research-to-Spec 深色头部次按钮的文字对比度；作品说明字号统一为 16px。
- 页面外框无横向溢出；原有宽表、代码、工程图保留局部横向滚动，不缩成不可读字形。被裁切的装饰曲线与封面图属于各自 overflow 容器，不是页面溢出。

机器结果摘要见 [verification-results.json](verification-results.json)。完整日志及截图只在本地 `tmp/video-redesign/qa/`：

- `1440-index-html-viewport.png`、`320-index-html-viewport.png`：最终字体与首页构图。
- `1440-projects-html.png`、`320-projects-html.png`：空间展廊与移动平面展架。
- `1440-blog-html.png`、`1440-about-html.png`：主页面排版。
- `1440-blog-*.png`、`320-blog-*.png`：六篇文章。
- `1440-projects-*.png`、`320-projects-*.png`：两项详情。
- `search-fallback.png`、`nojs-home.png`、`print-article.png`：失效模式与打印。

### 字体与颜色（DG10）

- Noto Serif SC 本地可变子集：721 输入字符、762 字形、230,124 字节（224.73 KiB）；许可 `assets/fonts/OFL-NotoSerifSC.txt`；制作脚本 `tools/subset-display-font.py`。
- 用户预览实际计算样式：标题 `Garden Serif`、字重 **700**、颜色 `rgb(45,38,52)`；底色 `rgb(248,245,239)`；按钮 `rgb(160,78,103)`。
- 使用 WCAG 相对亮度公式计算以下正常文本对比度，全部 ≥4.5:1。图中固有的原工程语义色未随页面改色。

| 用途 | 前景 / 背景 | 对比度 |
| --- | --- | --- |
| 正文 / 纸白 | #2d2634 / #f8f5ef | 13.42:1 |
| 次要文字 / 纸白 | #675d68 / #f8f5ef | 5.77:1 |
| 玫瑰链接 / 纸白 | #a04e67 / #f8f5ef | 5.11:1 |
| 按钮 | #fffaf7 / #a04e67 | 5.36:1 |
| 展区正文 | #f8f5ef / #203f3b | 10.51:1 |
| 展区次要文字 | #d5dfd5 / #203f3b | 8.36:1 |
| 展区强调 | #e8bbc3 / #203f3b | 6.72:1 |
| 紫色封面 | #49334f / #c1acc8 | 5.35:1 |
| SOP 封面 | #654530 / #ead7c6 | 6.14:1 |

## 发布验证

- GitHub `/user` 确认现有凭据登录名为 **fjnuslw**；Git 提交作者沿用已配置的 fjnuslw。
- `git fetch origin main` 后 `git rev-list --left-right --count HEAD...origin/main` 为 **0 0**，不存在待整合的远端更新。
- 发现 Pages `build_type=legacy` 与显式 dist 工作流同时存在。按 DG09 切换为 **workflow**，GitHub API 返回 **204**，随后 GET 确認 **workflow**。`source.branch=main` 为配置残留字段，不代表再次用根目录发布。
- 正式发布遵循用户明确指定的 GitHub Pages 目标；保留已有 `.openai/hosting.json`，本轮没有额外创建另一份托管站点。
- 发布提交：[`32432259de910dfe8b811d66693b1b8489943c82`](https://github.com/fjnuslw/fjnuslw.github.io/commit/32432259de910dfe8b811d66693b1b8489943c82)，作者与提交者均为 fjnuslw；`git push origin main` 成功，未强制推送。
- [Deploy site / 34023772372](https://github.com/fjnuslw/fjnuslw.github.io/actions/runs/34023772372)：**completed / success**。源码校验、白名单构建、dist 校验、artifact 上传和 Pages 发布步骤全部成功。
- 2026-09-06 17:09 CST：读取 [正式站点](https://fjnuslw.github.io/) 的 13 个 HTML 路由、两份共享 CSS、共享 JS、字体及字体许可，共 **18 个公开文件 HTTP 200**。文本统一 CRLF/LF 后与本地 dist 相同；WOFF2 二进制哈希完全相同，响应 MIME 为 `font/woff2`。
- `specs/README.md`、`AGENTS.md`、`tools/site-manifest.mjs`、`tmp/video-redesign/verify-live.py` 共 **4 个非发布路径均 HTTP 404**。22 项线上文件检查全部通过，记录在本地 `tmp/video-redesign/live-verification.json`。
- 2026-09-06 17:12 CST：隔离 Edge 打开正式首页，HTTP 200，1440px 页面无横向溢出、无脚本错误；`Garden Serif` 实际加载，纸白/墨紫计算颜色正确，点击下一件作品成功切换为“星途知汇”。截图 `tmp/video-redesign/qa/live-home.png`，结果 `tmp/video-redesign/live-browser.json`。
- 上述发布证据对应实现提交；后续提交只补齐本次 spec 的完成状态与验收记录。
