# 宋林蔚简历 · 维护说明

## 文件

| 文件 | 说明 |
|------|------|
| `resume-cli.html` | CLI / VS Code Light 视觉版（主编辑文件） |
| `resume-ats.md` | ATS 纯文本版 |
| `宋林蔚_大模型应用_AI-Agent_简历_CLI.pdf` | 导出 PDF |
| `宋林蔚_大模型应用_AI-Agent_简历_ATS.docx` | ATS Word |
| `宋林蔚_简历_CLI_预览.jpg` | 预览图 |
| `awards/` | 蓝桥杯国赛 / 省赛获奖名单 PDF（本地副本） |
| `photo.jpg` | 证件照（从旧简历 PDF 提取，可替换） |

获奖名单公网地址（已部署到 GitHub Pages）：

- https://fjnuslw.github.io/awards/lanqiao-17-national-agent-dev.pdf
- https://fjnuslw.github.io/awards/lanqiao-17-fujian-agent-dev.pdf

## 编辑流程

1. 改内容：优先改 `resume-ats.md`，再同步到 `resume-cli.html`
2. 浏览器打开 `resume-cli.html` → 打印 → 另存为 PDF  
   - A4、边距无、勾选背景图形、缩放 100%
3. 或 Chrome headless：

```bash
chrome --headless=new --no-pdf-header-footer --print-to-pdf="宋林蔚_大模型应用_AI-Agent_简历_CLI.pdf" resume-cli.html
```

## 设计要点

- 白底 VS Code Light 配色 + 轻量窗口栏
- 板块标题为圆角胶囊（技能特长 / 实习经验 / 项目经验 / …）
- 经历、项目、论文统一「时间 | 标题 | 角色」横条布局
- 竞赛国赛 / 省赛并列，附获奖名单与证书核验链接
