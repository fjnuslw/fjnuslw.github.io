# 调研记录

日期：2026-09-06。目的：界定「AI 味」的可核对特征，并为一套有作者气质的动态视觉找可复用、可改造的实现思路。检索词与结论如下。

## 1. AI 模板化特征（用于对照当前站点）

- [Why Your AI Keeps Building the Same Purple Gradient Website](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website)：Inter/Roboto 默认字体、蓝紫渐变、居中大标题 CTA、三卡网格、灰色 1px 边框 + 圆角 + 柔和阴影，是模型收敛的默认解。
- [AI Slop Fonts and Gradients: The Tells That Give Away AI Design](https://www.925studios.co/blog/ai-slop-design-tells)：定义「可互换的外观」；解法是真实内容、不对称、有性格的字体配对。
- [AI Design Slop (Medium)](https://mohitphogat.medium.com/ai-design-slop-why-every-ai-built-interface-looks-the-same-and-how-to-fix-it-bf874e0b470c)：单看每处都没坏，组合起来没有灵魂。
- [5 AI Website Design Tips](https://unpromptable.substack.com/p/5-ai-website-design-tips-for-websites)：先收集视觉参照再动手；从内容出发而非布局出发。

对照结论：当前蓝白版命中「系统字体、默认蓝、居中 eyebrow、圆角阴影卡片、玻璃导航、通用 fade-in」。本轮针对性反着做：系统衬线显示字体 + 等宽元信息、纸墨配色、细线编号版式、方角、无模糊阴影。

## 2. 2026 作品集趋势（用于选择大方向）

- [Awwwards Portfolio Gallery](https://www.awwwards.com/websites/portfolio/)：获奖作品集的共同点是编辑排版（editorial）、大字号衬线/展示字体、案例滚动叙事。
- [Muzli Top 100 Portfolios](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-website/)：画廊级案例呈现、非对称网格占主流。
- [Figma Web Design Trends 2026](https://www.figma.com/resource-library/web-design-trends/)：高饱和单色回归；怀旧印刷质感。
- [Colorlib Portfolio Trends](https://colorlib.com/wp/portfolio-design-trends/)：列表式作品索引（index list）+ 悬停预览是被反复验证的编辑系模式。

采用：暖纸 + 墨 + 朱砂的「印刷笔记本」方向；作品/笔记改为编号索引行 + 精确指针下的悬停预览。

## 3. 粒子与动效实现（纯 JS/CSS 复用改造）

- [particles.js](https://vincentgarreau.com/particles.js/) 与 [自建教程](https://levelup.gitconnected.com/create-your-own-particles-js-9fc8b719548a)：点-线星座场的参考实现；距离连线 + 指针吸引/斥力。改造点：降低密度、限 DPR、离屏即停、静态首帧兜底。
- [Cruip: Text Scramble Animation](https://cruip.com/making-a-text-scramble-animation-with-javascript/)：字符逐位锁定的「解码」动画，`setInterval`/rAF 即可实现，适合一次性入场与链接 hover。
- [FreeFrontend JavaScript Text Effects](https://freefrontend.com/javascript-text-effects/)：打字机、扰动的多种轻量写法；选择 decode 而非 loop 打字（避免自动循环动画）。

## 4. 边界

所有动效只取实现思路，代码自写；不引入 particles.js/GSAP 等依赖；不复制任何站点素材。动效清单维持 spec M01–M05 的范围，拒绝「数量堆砌」（AI 特征清单同样把 fade-in/漂浮 blob 列为滥用项）。
