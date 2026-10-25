# 验收记录

状态：本地验收通过，待正式发布。任务开始于 2026-10-25；验收于 2026-10-26（Asia/Shanghai）。

## 起点与保护

- 分支 main，起始提交 `0e55f34`；远端 fetch 成功。
- 作者三个 `resume-redesign/` 修改保持原状，仅显式暂存本轮文件。
- PDF 已完整渲染并读取一页，未复制至发布目录。

## 本地验证

### 命令与构建

- `node --check js/main.js`：通过。
- `python tools/subset-display-font.py ...`：744 个展示字符、785 个字形、239,308 字节（233.70 KiB）；所有展示中文字符均在 cmap 中。
- `node tools/stamp-assets.mjs`：重复执行为 **0 页更新**，字体 preload 与 CSS 使用同一内容戳。
- `node tools/validate-site.mjs`：**15 HTML / 281 本地链接 / 14 正式路由**，通过。首次检查发现新封面 H1→H3 跳级，修正为 H2 后复查通过。
- `node tools/build-site.mjs`：**51 文件**，仅白名单 dist。
- `node tools/validate-site.mjs --dist`：**14 HTML / 267 本地链接 / 14 正式路由**，通过。
- `git diff --check`：通过（只有 Windows 行尾转换提示）。

### 浏览器与视觉

环境：Windows，隔离 Edge / Playwright；预览 `http://127.0.0.1:4175/`，不代表线上部署。下述触屏、打印和高对比度均为浏览器仿真。

- `node tmp/resume-refresh/qa.cjs`：**36 组视口检查、52 项行为检查，全部通过**。14 正式路由在 1440/320px 下检查；四主页补充 390/768px。0 页面横向溢出、0 脚本错误、0 失效图片。
- 行为包含：画册顺序/循环/方向键、展廊平面/空间/Home/手机局部滚动、动态暂停、演示与手动降级、菜单焦点、触屏横划、关键词检索和 503 回退、文章进度、14 路由无 JS、200% 文本、字体加载及失效回退、评测表局部滚动和打印。
- 新内容专查：GRPO 能找到新项目，IN-Retriever 能找到研究；三策略计数与 83/96 可见；“尚未调用此 9B 服务”明确显示。
- 手动查看首页、作品、关于、新项目及手机截图。发现既有深色区块标题套用浅底渐变，修正共享选择器；`node tmp/resume-refresh/qa-final.cjs` 的 **12 项**屏幕、强制颜色和打印检查全部通过。
- 新配色正常文本对比度：粉色封面 **6.22:1**、录用状态 **7.75:1**、在审状态 **6.08:1**；深色区标题渐变最小 **6.72:1**。
- 最终截图：本地 `tmp/resume-refresh/qa/1440-about-html.png`、`1440-projects-html.png`、`1440-projects-reposocratic-html.png`、`320-projects-reposocratic-html.png`、`320-index-html-viewport.png`、`print-new-case.png`。完整日志在同目录；机器摘要见 [verification-results.json](verification-results.json)。

### 原有内容与发布边界

- 六篇文章的 `.post-content` 与 `.post-meta` 均和改动前一致，文章列表与 JSON 索引未改内容；这些文件只有共享字体/CSS/JS 内容戳变化。
- 三个 `resume-redesign/` 作者修改的 SHA-256 与任务开始时一致；不暂存、不提交。
- dist 中没有本轮 PDF、其电话、specs、tmp、resume-redesign、.private 或 ai-prep。
- 新内容仅复用原字体许可、已有项目图片与原生 HTML/CSS 封面，未引入第三方素材或新运行时依赖。

## 正式发布

待提交、推送、Actions 与线上一致性检查。
