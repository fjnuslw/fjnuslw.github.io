# 宋林蔚的个人网站

原生 HTML、CSS、JavaScript 作品集，正式域名为 `https://fjnuslw.github.io/`。

2026-09 改版已完成本地验收，并发布 [仅本人可见的预览](https://linwei-song-portfolio-2026.soonswartzmankxg.chatgpt.site)（需要登录）。既有 GitHub Pages 正式域名尚未更新。具体测试与发布结果见 [验收记录](specs/2026-09-portfolio-renewal/verification.md)。

## 开始维护

先阅读 [AGENTS.md](AGENTS.md) 与 [specs/README.md](specs/README.md)。当前重构的规格、任务和验收集中在 [specs/2026-09-portfolio-renewal](specs/2026-09-portfolio-renewal/spec.md)。

## 本地查看与构建

Node.js 18+ 用于校验与构建；可用任意静态服务器预览，例如 `python -m http.server 4173 --bind 127.0.0.1`。浏览器访问 `http://127.0.0.1:4173/`。

```text
node tools/stamp-assets.mjs
node tools/validate-site.mjs
node tools/build-site.mjs
node tools/validate-site.mjs --dist
git diff --check
```

正式发布只使用生成的 `dist/`。发布文件由 [tools/site-manifest.mjs](tools/site-manifest.mjs) 明确列出，禁止直接发布整个仓库根目录。`robots.txt` 不能替代发布文件隔离。

也可以运行 `node tools/preview-site.mjs --qa` 预览正式产物，地址为 `http://127.0.0.1:4174/`。测试路由 `/__qa/nojs/` 用 CSP 禁用脚本，`offline-index` 返回索引 503，`slow-index` 延迟索引 3 秒以检查异步焦点，`large-text` 放大文字到 200%，`reduced` 激活同一套减少动态规则并模拟媒体查询，`print` 激活打印样式。这些测试路径只存在于本地服务器，不会进入发布文件；打印样式测试不等同于实体打印机分页测试。

## 目录

| 目录 | 用途 |
| --- | --- |
| `blog/`、`projects/`、`assets/`、`css/`、`js/` | 正式页面、内容与资源 |
| `demos/local-window-copilot/` | 已有助手状态交互模拟 |
| `specs/` | 当前行为契约、计划、调研和验收 |
| `docs/archive/` | 已取代的视觉规范与历史调研 |
| `paper_search/` | 文章证据与技术来源 |
| `ai-prep/` | 本地历史求职资料及题库工具，不随正式构建发布 |
| `resume-redesign/`、`tmp/` | 独立简历制作与临时工作，不随正式构建发布 |

## 内容维护

文章正文与列表保持静态可读；`blog/posts.json` 供助手检索。新文同步更新博客列表、JSON、sitemap 与构建清单。共享视觉只维护 `css/portfolio.css`；文章专属图表样式留在各自文件。
