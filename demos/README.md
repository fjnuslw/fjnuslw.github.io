# 🎮 Demo 集成指南

本文件夹用于存放你的 AI Demo 项目。以下是将 Demo 集成到网站的几种方式。

---

## 方式一：嵌入 HuggingFace Spaces（推荐）

**适用于：Gradio / Streamlit 应用**

### 步骤：
1. 将你的 Demo 部署到 [HuggingFace Spaces](https://huggingface.co/spaces)
2. 获取 Space 的 URL，例如：`https://huggingface.co/spaces/your-name/your-demo`
3. 编辑 `projects.html`，找到 `demo-embed` 区域，替换为：

```html
<div class="demo-embed">
  <iframe 
    src="https://your-name-your-demo.hf.space"
    title="Demo 名称"
    style="width: 100%; height: 600px; border: none;">
  </iframe>
</div>
```

### 优点：
- 免费托管
- 支持 GPU（部分情况）
- 自动构建和部署
- 无需自己管理服务器

---

## 方式二：独立 HTML 页面

**适用于：纯前端 Demo（调用 API）**

### 步骤：
1. 在此文件夹下创建子文件夹，例如：`demos/my-chatbot/`
2. 在其中创建 `index.html`
3. 在 `projects.html` 中链接过去

### 示例结构：
```
demos/
├── my-chatbot/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── rag-demo/
│   └── index.html
└── README.md（本文件）
```

### 在 projects.html 中添加链接：
```html
<a href="demos/my-chatbot/index.html" class="btn btn-primary">
  🎮 体验 Demo
</a>
```

---

## 方式三：嵌入外部应用

**适用于：部署在 Vercel / Railway / Render 等平台的应用**

```html
<div class="demo-embed">
  <iframe 
    src="https://your-app.vercel.app"
    title="Demo 名称"
    style="width: 100%; height: 600px; border: none;">
  </iframe>
</div>
```

---

## 方式四：展示 API 调用效果

**适用于：后端 API 项目**

如果你的项目是纯 API（没有前端），可以：
1. 创建一个简单的前端界面调用 API
2. 用截图/GIF 展示效果
3. 在博客中写一篇技术文章详细介绍

---

## 注意事项

1. **API Key 安全**：永远不要在前端代码中直接暴露 API Key
   - 使用环境变量
   - 通过后端代理请求
   - 或使用有额度限制的公共 Key

2. **跨域问题**：iframe 嵌入时可能遇到跨域限制
   - HuggingFace Spaces 默认允许嵌入
   - 自部署应用需设置 `X-Frame-Options` 头

3. **移动端适配**：确保 Demo 在手机上也能正常使用

4. **加载速度**：建议添加加载动画，避免用户看到空白页面

---

## 快速开始模板

在 `demos/` 下创建一个新的 Demo 目录，复制以下 HTML 作为起点：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo 名称 — fjnuslw</title>
  <link rel="stylesheet" href="../../css/style.css">
  <style>
    /* Demo 专用样式 */
    .demo-app {
      max-width: 800px;
      margin: 0 auto;
      padding: calc(var(--nav-height) + 2rem) 1.5rem 2rem;
    }
  </style>
</head>
<body>
  <div class="bg-ambient"></div>
  
  <nav class="navbar">
    <div class="nav-container">
      <a href="../../index.html" class="nav-logo">
        <span class="logo-bracket">&lt;</span>
        <span class="logo-text">fjnuslw</span>
        <span class="logo-bracket"> /&gt;</span>
      </a>
    </div>
  </nav>

  <main class="demo-app">
    <h1 style="color: var(--text-bright); margin-bottom: 1rem;">
      Demo 名称
    </h1>
    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
      Demo 描述...
    </p>
    
    <!-- 你的 Demo 内容 -->
    
  </main>

  <script>
    // 你的 Demo 逻辑
  </script>
</body>
</html>
```

---

> 💡 **提示**：每次完成一个 Demo，记得同步更新 `projects.html` 页面，将状态从「规划中」改为「已上线」，并添加链接！
