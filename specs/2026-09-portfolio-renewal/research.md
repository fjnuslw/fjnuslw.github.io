# 设计调研

日期：2026-09-06。仅借鉴结构与交互原则，不复制第三方代码或图片。以下原站与技术依据已浏览核对。

选择：以作品和作者为中心的亮色展台；助手负责导航，动态效果解释过程。现有项目封面是视觉封面，不能当产品截图。

| 参考 | 观察 | 本站的改造与边界 |
| --- | --- | --- |
| [Rauno / Craft](https://rauno.me/craft)、[交互细节](https://rauno.me/craft/interaction-design) | 命令菜单、路径与导航可成为作品体验的一部分 | 原创“去哪里”助手，保留文字标签和普通导航；不复制其代码、图标或动效 |
| [Paco](https://paco.me/)、[Redesign 2021](https://paco.me/writing/redesign-2021) | Building / Projects / Writing 各有不同阅读密度 | 作品大展示、文章紧凑列表；不用同尺寸面板处理全部内容 |
| [Emil / You Don't Need Animations](https://emilkowal.ski/ui/you-dont-need-animations) | 动画适合解释操作、给出反馈；高频操作应及时响应 | 首页只在点击时切换三阶段，短反馈约 180–240ms；不引入持续背景动画 |
| [Anthony Fu](https://antfu.me/)、[项目页](https://antfu.me/projects) | 身份、参与方式、项目分组和当前关注直接关联 | 姓名与作品优先，事实和作者贡献在项目详情展开；不伪造当前活跃状态 |

## 浏览器能力依据

- [WHATWG dialog](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element) 与 [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)：使用 `showModal()`，利用原生模态和背景不可交互行为，提供明确关闭控件，并验证实际焦点归还。
- [CSSWG prefers-reduced-motion](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-motion) 与 [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)：移除非必要位移、缩放与平滑滚动，功能仍保留。

## 取舍

站内检索只下载已有 `blog/posts.json`，在浏览器匹配标题、标签和摘要。它减少找路成本，不承担问答，也不发送访客输入。相比真正的聊天后端，少了模型费用和错误回答风险，代价是不能理解无限开放的问题；无匹配与索引失败都有真实出口。

保留原生静态架构，避免一次视觉改版引入框架迁移。现有项目吉祥物与照片已足以支撑个人辨识，不新增生成式背景图片。
