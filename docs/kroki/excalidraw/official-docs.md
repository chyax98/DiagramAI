# Excalidraw 官方文档汇总

> 更新时间: 2025-10-13
> 数据来源: Excalidraw 官方文档、GitHub 仓库

---

## 📚 核心文档资源

### 官方网站
- **主页**: https://excalidraw.com/
- **开发者文档**: https://docs.excalidraw.com/
- **GitHub 仓库**: https://github.com/excalidraw/excalidraw
- **在线编辑器**: https://excalidraw.com/ (直接使用)
- **Excalidraw+**: https://plus.excalidraw.com/ (增强版)

### 关键文档链接
- **API 文档**: https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api
- **集成指南**: https://docs.excalidraw.com/docs/@excalidraw/excalidraw/integration
- **Props 参考**: https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/
- **Utils 工具**: https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/utils
- **Element Skeleton API**: https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/excalidraw-element-skeleton
- **Libraries (素材库)**: https://libraries.excalidraw.com/

---

## 🎯 Excalidraw 概述

### 定位
Excalidraw 是一个**虚拟白板工具**，专注于创建手绘风格的图表和草图。

### 核心特点
- ✅ **手绘风格**: 自动生成手绘效果，适合低保真原型和头脑风暴
- ✅ **开源免费**: 完全开源 (MIT 许可)，可自部署
- ✅ **端到端加密**: 协作时数据 E2EE 加密
- ✅ **实时协作**: 支持多人同时编辑
- ✅ **嵌入场景**: 导出的图片可内嵌完整场景数据
- ✅ **素材库**: 丰富的预制图形库 (IT 图标、UML、架构图等)

### 适用场景
- 快速原型设计 (Wireframes)
- 系统架构图
- 流程图和思维导图
- 教学演示
- 头脑风暴白板
- 技术文档配图

---

## 🔧 技术架构

### 技术栈
- **前端**: React + TypeScript
- **渲染**: Canvas API (SVG 导出)
- **存储**: LocalStorage (本地) / Firebase (协作)
- **协作**: WebSocket + CRDT
- **数据格式**: JSON (元素数组 + 应用状态)

### 三种使用方式

#### 1. 在线使用
```
访问 https://excalidraw.com/
无需安装，浏览器直接使用
```

#### 2. npm 包集成
```bash
npm install @excalidraw/excalidraw
# 或
yarn add @excalidraw/excalidraw
```

```jsx
import { Excalidraw } from "@excalidraw/excalidraw";

function App() {
  return (
    <div style={{ height: "500px" }}>
      <Excalidraw />
    </div>
  );
}
```

#### 3. VS Code 插件
```
安装 "Excalidraw" 插件
创建 .excalidraw 或 .excalidraw.png 文件
直接在编辑器内绘图
```

---

## 📐 核心概念

### 1. 元素类型 (Element Types)

Excalidraw 支持以下图形元素:

| 元素类型 | 说明 | 用途 |
|---------|------|------|
| `rectangle` | 矩形 | 容器、组件框 |
| `diamond` | 菱形 | 决策节点 |
| `ellipse` | 椭圆 | 起止节点、实体 |
| `arrow` | 箭头 | 流程连接 |
| `line` | 直线 | 连接线 |
| `text` | 文本 | 标签、说明 |
| `image` | 图片 | 嵌入图像 |
| `freedraw` | 自由绘制 | 手绘曲线 |
| `frame` | 画板 | 分组容器 |

### 2. Element Skeleton (简化元素定义)

使用 `convertToExcalidrawElements()` API 创建元素:

```typescript
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

const elements = [
  {
    type: "rectangle",
    id: "rect-1",
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    strokeColor: "#000000",
    backgroundColor: "#ffffff",
  },
  {
    type: "text",
    id: "text-1",
    x: 150,
    y: 130,
    text: "Hello Excalidraw",
    fontSize: 20,
  },
  {
    type: "arrow",
    id: "arrow-1",
    x: 300,
    y: 150,
    width: 100,
    height: 0,
    startBinding: { elementId: "rect-1" },
    endBinding: { elementId: "rect-2" },
  }
];

const excalidrawElements = convertToExcalidrawElements(elements);
```

### 3. 属性系统

#### 位置和尺寸
- `x`, `y`: 元素左上角坐标
- `width`, `height`: 元素宽高
- `angle`: 旋转角度 (弧度)

#### 样式属性
- `strokeColor`: 边框颜色
- `backgroundColor`: 填充颜色
- `fillStyle`: 填充样式 (`hachure`, `cross-hatch`, `solid`)
- `strokeWidth`: 线条粗细
- `strokeStyle`: 线条样式 (`solid`, `dashed`, `dotted`)
- `roughness`: 手绘粗糙度 (0-2)
- `opacity`: 透明度 (0-100)

#### 文本属性
- `text`: 文本内容
- `fontSize`: 字体大小
- `fontFamily`: 字体族 (1=手写体, 2=普通, 3=代码)
- `textAlign`: 文本对齐 (`left`, `center`, `right`)
- `verticalAlign`: 垂直对齐 (`top`, `middle`, `bottom`)

---

## 🔌 API 参考

### Props (组件属性)

#### 核心 Props
```typescript
<Excalidraw
  // 初始数据
  initialData={{
    elements: [...],
    appState: {...},
    scrollToContent: true
  }}

  // 回调事件
  onChange={(elements, appState, files) => {}}
  onPointerUpdate={(payload) => {}}
  onPaste={(data, event) => {}}

  // UI 定制
  UIOptions={{
    canvasActions: {
      changeViewBackgroundColor: false,
      clearCanvas: false
    }
  }}

  // 协作
  collaborators={new Map()}

  // 视图控制
  viewModeEnabled={false}
  zenModeEnabled={false}
  gridModeEnabled={false}
/>
```

### ExcalidrawAPI (Ref API)

```typescript
const excalidrawRef = useRef(null);

// 获取 API 实例
const api = excalidrawRef.current;

// 更新场景
api.updateScene({
  elements: newElements,
  appState: { viewBackgroundColor: "#ffffff" }
});

// 滚动到元素
api.scrollToContent(targetElement, {
  fitToContent: true,
  animate: true
});

// 更新素材库
api.updateLibrary({
  libraryItems: [...],
  merge: true,
  prompt: false
});

// 导出
const blob = await api.exportToBlob({
  elements: api.getSceneElements(),
  mimeType: "image/png",
  appState: { exportBackground: true }
});
```

### Utils (工具函数)

#### 导出工具
```typescript
import {
  exportToCanvas,
  exportToBlob,
  exportToSvg,
  exportToClipboard
} from "@excalidraw/excalidraw";

// 导出为 Canvas
const canvas = await exportToCanvas({
  elements,
  appState,
  files
});

// 导出为 SVG
const svg = await exportToSvg({
  elements,
  appState,
  files
});

// 导出为 Blob
const blob = await exportToBlob({
  elements,
  mimeType: "image/png",
  quality: 0.95
});
```

#### 数据处理
```typescript
import {
  serializeAsJSON,
  loadFromBlob,
  loadSceneOrLibraryFromBlob,
  getNonDeletedElements,
  getSceneVersion
} from "@excalidraw/excalidraw";

// 序列化为 JSON
const json = serializeAsJSON(elements, appState);

// 从 Blob 加载
const data = await loadFromBlob(blob, null, null);

// 获取非删除元素
const activeElements = getNonDeletedElements(elements);

// 获取场景版本号
const version = getSceneVersion(elements);
```

---

## 🎨 素材库 (Libraries)

### 官方素材库
访问 https://libraries.excalidraw.com/ 获取:

- **IT Logos** - 常见技术品牌图标 (AWS, Docker, Kubernetes 等)
- **Google Cloud** - GCP 架构图标
- **AWS Architecture** - AWS 服务图标
- **Azure Icons** - Azure 服务图标
- **UML Diagrams** - UML 图形元素
- **Flowchart** - 流程图形状
- **Wireframe** - 原型设计组件
- **Event Storming** - 事件风暴模板
- **C4 Model** - C4 架构图模板

### 自定义素材库
```typescript
// 添加到素材库
const libraryItems = [
  {
    id: "custom-1",
    status: "published",
    elements: [...], // Excalidraw 元素数组
    name: "My Custom Component"
  }
];

api.updateLibrary({
  libraryItems,
  merge: true
});
```

---

## 🔄 数据格式

### .excalidraw 文件结构
```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "id": "element-id",
      "type": "rectangle",
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 100,
      "angle": 0,
      "strokeColor": "#000000",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "seed": 1234567890,
      "version": 1,
      "versionNonce": 123456,
      "isDeleted": false,
      "groupIds": [],
      "boundElements": null,
      "updated": 1234567890,
      "link": null,
      "locked": false
    }
  ],
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#ffffff"
  },
  "files": {}
}
```

### 嵌入场景 (Embed Scene)
导出 PNG 时可选 "Embed scene" 选项，图片文件会包含完整的 JSON 数据。

加载时可恢复为可编辑状态:
```typescript
const file = await loadFromBlob(imageBlob, null, null);
// file.elements 包含所有元素
```

---

## 🔗 集成场景

### 1. React 应用集成
```jsx
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import { useState } from "react";

function DiagramEditor() {
  const [elements, setElements] = useState([]);

  const handleExport = async () => {
    const blob = await exportToBlob({
      elements,
      mimeType: "image/png",
      appState: { exportBackground: true }
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.png";
    a.click();
  };

  return (
    <div>
      <button onClick={handleExport}>导出</button>
      <Excalidraw
        onChange={(els) => setElements(els)}
        initialData={{ elements: [] }}
      />
    </div>
  );
}
```

### 2. Mermaid 转 Excalidraw
```typescript
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

const mermaidDefinition = `
graph TD
  A[开始] --> B[处理]
  B --> C[结束]
`;

const { elements } = await parseMermaidToExcalidraw(mermaidDefinition);
const excalidrawElements = convertToExcalidrawElements(elements);
```

### 3. Obsidian 插件集成
Excalidraw 有官方 Obsidian 插件，支持:
- 在笔记中直接绘制
- 链接到 Obsidian 页面
- 自动保存到 vault
- 双向链接支持

---

## 📊 对比其他工具

| 特性 | Excalidraw | Mermaid | PlantUML |
|------|-----------|---------|----------|
| **渲染方式** | Canvas (手绘) | SVG (矢量) | PNG/SVG (矢量) |
| **定位** | 白板/低保真 | 代码驱动图表 | UML 标准图表 |
| **语法** | 无 (可视化) | 文本 DSL | 文本 DSL |
| **协作** | ✅ 实时协作 | ❌ | ❌ |
| **自由度** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **精确度** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **学习曲线** | 低 | 中 | 高 |
| **适合场景** | 头脑风暴、原型 | 技术文档 | 正式 UML 文档 |

---

## 🔐 隐私与安全

### 本地使用
- 数据存储在浏览器 LocalStorage
- 不上传到服务器
- 完全离线可用

### 协作模式
- 数据端到端加密 (E2EE)
- 仅分享链接的人可访问
- 无第三方追踪 Cookie

### 自部署
```bash
git clone https://github.com/excalidraw/excalidraw.git
cd excalidraw
yarn install
yarn start
```

---

## 📖 参考资源

### 官方文档
- [Getting Started](https://docs.excalidraw.com/docs)
- [API Reference](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api)
- [Examples](https://github.com/excalidraw/excalidraw/tree/master/examples)

### 社区资源
- [Discord 社区](https://discord.gg/UexuTaE)
- [GitHub Discussions](https://github.com/excalidraw/excalidraw/discussions)
- [YouTube 教程](https://www.youtube.com/results?search_query=excalidraw+tutorial)

### 扩展阅读
- [Excalidraw: Why and How to Use it (EA Forum)](https://forum.effectivealtruism.org/posts/iKes4JjvpLM8LKMyT/excalidraw-why-and-how-to-use-it)
- [Create diagrams with Excalidraw + VSCode](https://mfyz.medium.com/create-quick-diagrams-and-wireframes-using-excalidraw-vscode-3354e7a41077)
- [Excalidraw User Guide (UofT)](https://support.ischool.utoronto.ca/excalidraw-user-guide/)

---

**最后更新**: 2025-10-13
**Excalidraw 版本**: v0.18.0 (2025-03-11)
