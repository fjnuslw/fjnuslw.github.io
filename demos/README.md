# 已实现的交互演示

当前只有 [Local Window Copilot](local-window-copilot/index.html)：浏览器中拖动助手、切换待命/观察/分析/隐私/异常表情。它不读取真实桌面、不运行 OCR 或模型，也不保存实际工作记忆。

维护入口：`local-window-copilot/src/main.js`、`src/styles.css`、`assets/mascot/`。首页与项目详情使用普通链接进入独立演示，不重复嵌入 iframe。

新增 Demo 前先写 spec，列清真实能力和模拟边界。验收键盘与触屏操作、320px 布局、减少动态效果、返回项目入口和资源链接；只有实现并验证后才标记可用。正式产物由 `tools/site-manifest.mjs` 列出。

旧文档中未实现的 HuggingFace、API 聊天和外部嵌入模板已移除。不要把前端环境变量作为密钥保护方式。
