# 验收记录

状态：本地验收通过；发布记录见下。日期：2026-09-06（Asia/Shanghai）。

## 起点

- HEAD `39f54a1`，工作区干净；origin 为 `https://github.com/fjnuslw/fjnuslw.github.io`。
- 本轮重新抽帧：参考视频每 15 秒共 18 帧，保存在本地 `tmp/vidframes/`，不进仓库与 dist。
- 变更仅触及 `css/style.css`（无改动）、`css/portfolio.css`、`js/main.js` 与 specs 文档；13 个公开页面 HTML 内容未改（stamp-assets 仅刷新资源哈希）。

## 命令

- `node --check js/main.js`：通过。
- `node tools/stamp-assets.mjs`：13 页资源版本刷新。
- `node tools/validate-site.mjs`：14 HTML / 259 本地链接 / 13 正式路由通过。
- `node tools/build-site.mjs`：50 个文件 → dist，仅白名单；无 specs/tmp/制作资料。
- `node tools/validate-site.mjs --dist`：13 HTML / 245 链接 / 13 路由通过。
- `git diff --check`：通过。
- 对比度脚本（Node，WCAG 相对亮度）：渐变端点实测——纸面暖赭 `#a8603a` 4.39:1、玫瑰 `#a04e67` 5.11:1、梅紫 `#63497d` 6.94:1、墨端 8.21–13.42:1；深底亮纸 10.51:1、玫瑰亮 6.72:1。全部 ≥3:1（展示级大字 AA），正文与小型标签保持原有纯色（≥4.5:1）。

## 浏览器（本地 dist 预览 127.0.0.1:4175，Edge headless + ZCode 内置浏览器）

回归 `node tmp/video-redesign/qa.cjs`（上轮同款脚本）：

- **34 组视口**（13 路由 × 1440/320 + 四主页 × 390/768）：0 横向溢出、0 运行时错误、0 失效图片。
- **45 项行为**：画册翻页/键盘、空间展廊、全局动态暂停、演示运行/暂停、检索、筛选、无 JS 等，全部通过——本轮未破坏既有功能。

专项 `node tmp/video-redesign/qa-flow.cjs`（9 项，全部通过）：

1. 画布 `position:fixed`、`z-index:-1`、`pointer-events:none`、`aria-hidden`。
2. 首屏 H1/副题 em/深色区 H2 计算样式 `background-clip:text` 生效。
3. 可见页面粒子持续动画（画布像素和随时间变化）。
4. 「暂停花园动态」→ 画布冻结（像素和不变）。
5. 再次点击 → 动画恢复（像素和重新变化）。
6. `reducedMotion:'reduce'`：保留一帧静态星点、1.5 秒内 RAF 回调 0 次、丝绸动画 `animationName:none`。
7. 指针在画面中移动后，光标附近画布区域内容响应变化（推挤/连线）。
8. 禁用 JS：无 canvas，H1 与导航完整。
9. `emulateMedia print`：渐变标题回退实色、canvas 与 garden-lines `display:none`。

视觉复核（ZCode 内置浏览器 1440×900 截图 + 视觉模型判读，人工确认）：

- 首页首屏：主标题暖赭→玫瑰→梅紫渐变、副题玫瑰→梅紫渐变、色洗/弧线/噪点纹理、粒子点均可见，无重叠错位。
- 首页 2100px 深色区：大标题亮纸→玫瑰渐变清晰，展台布局无异常。
- projects.html 顶部、blog/agent-status-spine.html 文头：墨色渐变标题正常。
- 320px 首页：渐变标题完整不裁切、无横向溢出、纹理粒子不干扰阅读。
- `__qa/nojs`：内容导航完整；`__qa/print`：白底墨字、装饰剥离。

已知边界：ZCode 内置浏览器面板处于后台时宿主将 webview 判为 `document.hidden`，粒子按设计停止（RAF 节流 + 站点 `page-inactive`）；上表 3–5 项在可见 headless Edge 中复测通过，另以 Node 控制流模拟覆盖加载/暂停/恢复/隐藏/再可见五条路径。headless 仿真不等同于实体手机与实体打印机。

## 发布

- 2026-09-06：提交 `8e3c285` 已以 fjnuslw 推送 main（`39f54a1..8e3c285`）。本机直连 github.com 超时，经由本机 7897 本地代理推送；未改动全局 git 配置。
- GitHub Actions run `34025935433`（head `8e3c285`）：**completed / success**。

### 线上核对（2026-09-06）

- `https://fjnuslw.github.io/` 引用 `css/portfolio.css?v=e11231f279`、`js/main.js?v=89d7248230`，与本地文件 SHA-256 前缀逐字一致（stamp-assets 哈希）。
- 线上 `portfolio.css` 含 `garden-canvas` / `background-clip:text` 规则（8 处命中）；线上 `main.js` 含 `initGardenCanvas`（2 处命中）。
- 结合本地 dist 预览的浏览器验收（34 视口 + 45 行为 + 9 专项 + 截图判读），本轮发布闭环完成。
