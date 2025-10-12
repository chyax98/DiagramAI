# Excalidraw 语法规则 (编程式API)

> **适用版本**: @excalidraw/excalidraw v0.18+  
> **最后更新**: 2025-01-13

---

## 🎯 元素类型

### 基础图形
- `rectangle`: 矩形
- `ellipse`: 椭圆
- `diamond`: 菱形
- `line`: 直线
- `arrow`: 箭头
- `freedraw`: 自由绘制
- `text`: 文本
- `image`: 图片

### 特殊类型
- `frame`: 框架 (分组容器)

---

## 📐 元素属性

### 必需属性
```js
{
  type: "rectangle",       // 元素类型
  x: 100,                  // X 坐标
  y: 100,                  // Y 坐标
  width: 200,              // 宽度
  height: 100              // 高度
}
```

### 可选属性
```js
{
  id: "unique-id",         // 唯一ID (自动生成)
  strokeColor: "#000000",  // 边框颜色
  backgroundColor: "#ffffff", // 填充色
  fillStyle: "hachure",    // 填充样式
  strokeWidth: 1,          // 边框宽度
  roughness: 1,            // 粗糙度 (0-3)
  opacity: 100,            // 透明度 (0-100)
  angle: 0,                // 旋转角度
  roundness: null          // 圆角
}
```

---

## 🎨 样式选项

### fillStyle
- `"hachure"`: 交叉线填充 (默认)
- `"cross-hatch"`: 十字交叉
- `"solid"`: 实心填充

### strokeStyle
- `"solid"`: 实线 (默认)
- `"dashed"`: 虚线
- `"dotted"`: 点线

### roughness
- `0`: 完美线条
- `1`: 轻微手绘 (默认)
- `2`: 明显手绘
- `3`: 强烈手绘

---

## 🔗 连接 (箭头/线)

### 基础箭头
```js
{
  type: "arrow",
  x: 100,
  y: 100,
  width: 200,
  height: 0,
  points: [[0,0], [200,0]]  // 路径点
}
```

### 绑定连接
```js
{
  type: "arrow",
  start: {
    type: "rectangle",  // 起点形状
    id: "rect-1"        // 起点ID
  },
  end: {
    type: "ellipse",    // 终点形状
    id: "ellipse-1"     // 终点ID
  }
}
```

### 标签
```js
{
  type: "arrow",
  label: {
    text: "Connection",
    fontSize: 16,
    strokeColor: "#000"
  }
}
```

---

## 📝 文本元素

```js
{
  type: "text",
  x: 100,
  y: 100,
  text: "Hello World",
  fontSize: 20,
  fontFamily: 1,           // 1-4
  textAlign: "center",     // left, center, right
  verticalAlign: "middle"  // top, middle, bottom
}
```

### 字体选项
- `1`: Virgil (默认手绘字体)
- `2`: Helvetica
- `3`: Cascadia (代码字体)
- `4`: Comic Shanns

---

## 🖼️ 框架 (Frame)

```js
{
  type: "frame",
  name: "My Frame",
  children: ["elem-1", "elem-2"],  // 子元素ID
  x: 0,
  y: 0,
  width: 500,
  height: 300
}
```

---

## 🔄 Mermaid 转换

### 支持的图表
- ✅ Flowchart (流程图)
- ❌ Sequence (作为图片)
- ❌ Class (作为图片)
- ❌ ER (作为图片)

### 转换流程
```js
import { 
  parseMermaidToExcalidraw,
  convertToExcalidrawElements 
} from "@excalidraw/mermaid-to-excalidraw";

// 1. 解析 Mermaid
const skeleton = await parseMermaidToExcalidraw(mermaidCode);

// 2. 转换为 Excalidraw 元素
const elements = convertToExcalidrawElements(skeleton);
```

---

## 📋 元素骨架格式

### 简化定义
```js
// 骨架格式 (简化)
const skeleton = [
  {
    type: "rectangle",
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    label: { text: "Node 1" }
  }
];

// 转换为完整元素
const elements = convertToExcalidrawElements(skeleton);
```

---

## 🔗 参考

- API 文档: https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api
- 元素骨架: https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/excalidraw-element-skeleton
- Mermaid 转换: https://docs.excalidraw.com/docs/@excalidraw/mermaid-to-excalidraw/api
