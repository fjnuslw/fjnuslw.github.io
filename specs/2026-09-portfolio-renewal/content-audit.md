# 内容与清理台账

2026-09-06 初始 Git 状态：`resume-redesign/resume-cli.html` 已修改；`.workbuddy/`、简历 assets/output/scripts/search/tmp 等有未跟踪文件。本轮保留。

| 内容 | 处置 | 原因 |
| --- | --- | --- |
| 六篇博客 + paper_search | 保留 | 已发布正文与技术证据，不因过往时间删除 |
| 两项项目详情 + Local Window Copilot Demo | 保留并统一入口 | 有真实路由和可用演示，标注模拟边界 |
| search 下 2026-08 方案与调研 | 9 份文档已移至 docs/archive/2026-08-design，并修复相对链接 | 旧视觉方案与当前改版冲突，保留来源供追溯 |
| tmp/spec-frontend-polish.md | 已移至 docs/archive/2026-07-frontend-polish.md | 已跟踪的旧方案散落临时目录 |
| ai-prep/test-layout-spec.md | 已移至 docs/archive/2026-07-interview-board.md | 旧题库布局不覆盖当前网站要求 |
| ai-prep | 本地历史工作区，排除正式产物 | 历史岗位快照与模板回答，不作为现行站点事实 |
| loadBlogPosts / TAG_COLORS / COLOR_NAME_MAP / resolveCover / 旧返回顶部初始化 | 已删除 | 当前页面均使用静态文章链接；顶部入口并入助手 |
| css/evidence-ledger.css 与旧首页选择器 | 已替换为 portfolio.css；清理无调用规则 | 收敛共享主题，移除旧首页与动态卡片样式 |
| assets/og-portfolio.png | 已删除无引用文件；保留在用 OG 图 | 清理重复资产，不生成无需求的新 OG 图 |
| 星途知汇封面 PNG | 源文件保留；页面改用已有 WebP，PNG 不进入产物 | 以现有压缩资产减少传输 |
| demos/README.md 里的接口/Hugging Face 模板 | 已改为真实 Demo 的维护说明 | 移除未实现能力承诺，保留模拟范围 |
| tools/build-interview-bank.mjs 私人绝对路径 | 改为显式输入参数 | 旧工作区工具不依赖作者机器上的隐含路径 |
| resume-redesign / tmp 未提交文件 | 保留并排除产物 | 作者其他工作，不能按垃圾文件删除 |

正式产物为 14 条页面路由、50 个文件，由 `tools/site-manifest.mjs` 控制。源文件保留与线上发布是两个边界：`paper_search`、归档文档、求职工具和简历制作资料均不进入 `dist`。文章发表日期与历史技术背景保留；本轮仅修复结构、可读性、图像描述和导航。
