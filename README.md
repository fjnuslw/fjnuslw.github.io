# 宋林蔚的个人网站

原生 HTML、CSS、JavaScript 作品集，正式域名为 `https://fjnuslw.github.io/`。

当前为「数字花园」改版：参考画册与展廊的空间感，重排首页、项目、手记、关于及全部详情页，保持原生 HTML/CSS/JS、原有内容与 URL。具体测试与线上发布状态见 [本轮验收记录](specs/2026-09-06-digital-garden/verification.md)。

## 开始维护

先阅读 [AGENTS.md](AGENTS.md) 与 [specs/README.md](specs/README.md)。当前规格、设计依据、任务和验收集中在 [specs/2026-09-06-digital-garden](specs/2026-09-06-digital-garden/spec.md)。历史改版记录保持原样。

## 本地查看与构建

Node.js 18+ 用于校验与构建。先构建白名单产物，再运行 `node tools/preview-site.mjs`，浏览器访问 `http://127.0.0.1:4174/`。

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
