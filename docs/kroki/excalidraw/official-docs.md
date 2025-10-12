# Excalidraw 官方文档汇总

> **更新时间**: 2025-01-13  
> **官方网站**: https://excalidraw.com  
> **GitHub**: https://github.com/excalidraw/excalidraw

---

## 📚 核心资源

### 官方平台
- **在线工具**: https://excalidraw.com
- **Excalidraw+**: https://plus.excalidraw.com (Pro版)
- **文档中心**: https://docs.excalidraw.com
- **博客**: https://blog.excalidraw.com

### GitHub
- **主仓库**: https://github.com/excalidraw/excalidraw
- **库组件**: https://github.com/excalidraw/excalidraw-libraries
- **Mermaid 转换**: https://github.com/excalidraw/mermaid-to-excalidraw

---

## 🎯 核心特性

### 1. 手绘风格
- 自然手绘外观
- 可调整粗糙度
- 多种笔触风格

### 2. 协作功能
- 实时多人编辑
- 共享链接
- 端到端加密

### 3. 丰富工具
- 基础图形: 矩形、圆形、菱形、箭头
- 文本标注
- 自由绘制
- 图片嵌入

### 4. 导出格式
- PNG (栅格)
- SVG (矢量)
- 剪贴板
- JSON (.excalidraw)

---

## 🔧 集成方式

### 1. NPM 包
```bash
npm install @excalidraw/excalidraw
```

```jsx
import { Excalidraw } from "@excalidraw/excalidraw";

<Excalidraw />
```

### 2. 编辑器插件
- **VSCode**: Excalidraw Extension
- **Obsidian**: Excalidraw Plugin
- **Confluence**: Excalidraw App

### 3. Mermaid 转换
```bash
npm install @excalidraw/mermaid-to-excalidraw
```

```js
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";

const elements = await parseMermaidToExcalidraw(mermaidSyntax);
```

---

## 📦 文件格式

### .excalidraw JSON
```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "type": "rectangle",
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 100,
      "strokeColor": "#000",
      "backgroundColor": "#fff",
      "fillStyle": "hachure"
    }
  ],
  "appState": {
    "viewBackgroundColor": "#ffffff"
  }
}
```

---

## 🎨 编程式创建

### 元素骨架 (Skeleton)
```js
const elements = [
  {
    type: "rectangle",
    x: 100,
    y: 100,
    width: 200,
    height: 100
  },
  {
    type: "arrow",
    x: 300,
    y: 150,
    width: 100,
    height: 0,
    start: { id: "rect-1" },
    end: { id: "rect-2" }
  }
];
```

### 转换为完整元素
```js
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

const excalidrawElements = convertToExcalidrawElements(elements);
```

---

## 📚 学习资源

### 官方文档
- **API 文档**: https://docs.excalidraw.com
- **开发指南**: https://github.com/excalidraw/excalidraw/tree/master/docs
- **示例集**: https://libraries.excalidraw.com

### 社区
- **GitHub Discussions**: https://github.com/excalidraw/excalidraw/discussions
- **Discord**: https://discord.gg/UexuTaE

---

## 🔗 重要链接

- 官网: https://excalidraw.com
- GitHub: https://github.com/excalidraw/excalidraw
- 文档: https://docs.excalidraw.com
- 库: https://libraries.excalidraw.com
- 博客: https://blog.excalidraw.com
