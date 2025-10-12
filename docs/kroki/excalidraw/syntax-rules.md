# Excalidraw 语法规则和最佳实践

> 更新时间: 2025-10-13
> 适用版本: Excalidraw v0.18.0+

---

## ⚠️ 重要说明

Excalidraw 是一个**可视化白板工具**，没有传统意义上的"文本语法"。但在以下场景需要了解其数据结构规则:

1. **编程集成**: 使用 `@excalidraw/excalidraw` npm 包
2. **Element Skeleton API**: 通过代码创建图形元素
3. **Mermaid 转换**: 使用 `@excalidraw/mermaid-to-excalidraw`
4. **自动化生成**: 脚本批量生成图表

---

## 📐 Element Skeleton 语法规则

### 1. 基础元素结构

#### 完整元素属性 (可选优化版)
```typescript
{
  // 必需属性
  type: "rectangle" | "diamond" | "ellipse" | "arrow" | "line" | "text" | "image" | "freedraw" | "frame",

  // 位置和尺寸 (必需)
  x: number,
  y: number,
  width: number,
  height: number,

  // 可选属性 (有默认值)
  id?: string,              // 自动生成
  angle?: number,           // 默认 0
  strokeColor?: string,     // 默认 "#000000"
  backgroundColor?: string, // 默认 "transparent"
  fillStyle?: "hachure" | "cross-hatch" | "solid", // 默认 "hachure"
  strokeWidth?: number,     // 默认 1
  strokeStyle?: "solid" | "dashed" | "dotted", // 默认 "solid"
  roughness?: number,       // 默认 1 (范围 0-2)
  opacity?: number,         // 默认 100 (范围 0-100)

  // 绑定属性 (用于箭头连接)
  startBinding?: { elementId: string, focus?: number, gap?: number },
  endBinding?: { elementId: string, focus?: number, gap?: number },

  // 文本专属
  text?: string,
  fontSize?: number,
  fontFamily?: 1 | 2 | 3,   // 1=手写体, 2=普通, 3=代码
  textAlign?: "left" | "center" | "right",
  verticalAlign?: "top" | "middle" | "bottom",

  // 分组和框架
  groupIds?: string[],
  frameId?: string
}
```

#### 最简元素定义 (推荐)
```typescript
// 矩形 - 最少 5 个属性
{
  type: "rectangle",
  x: 100,
  y: 100,
  width: 200,
  height: 100
}

// 文本 - 最少 6 个属性
{
  type: "text",
  x: 150,
  y: 130,
  width: 100,
  height: 30,
  text: "Hello"
}

// 箭头 - 最少 6 个属性
{
  type: "arrow",
  x: 100,
  y: 150,
  width: 200,
  height: 0,
  points: [[0, 0], [200, 0]]
}
```

### 2. 元素类型详解

#### Rectangle (矩形)
```typescript
{
  type: "rectangle",
  x: 100,
  y: 100,
  width: 200,
  height: 100,

  // 推荐样式
  strokeColor: "#1971c2",
  backgroundColor: "#e7f5ff",
  fillStyle: "hachure",  // 手绘填充
  roundness: { type: 3 } // 圆角
}
```

#### Diamond (菱形) - 决策节点
```typescript
{
  type: "diamond",
  x: 350,
  y: 80,
  width: 140,
  height: 140,

  strokeColor: "#f08c00",
  backgroundColor: "#fff4e6"
}
```

#### Ellipse (椭圆) - 起止节点
```typescript
{
  type: "ellipse",
  x: 100,
  y: 300,
  width: 120,
  height: 80,

  strokeColor: "#2f9e44",
  backgroundColor: "#ebfbee"
}
```

#### Arrow (箭头)
```typescript
{
  type: "arrow",
  x: 100,
  y: 150,
  width: 200,
  height: 0,

  // 关键: 绑定到其他元素
  startBinding: {
    elementId: "rect-1",
    focus: 0,      // -1 到 1, 0 为中心
    gap: 10        // 距离元素边缘的像素
  },
  endBinding: {
    elementId: "rect-2",
    focus: 0,
    gap: 10
  },

  // 箭头样式
  startArrowhead: null,
  endArrowhead: "arrow",  // "arrow" | "bar" | "dot" | null

  // 曲线箭头
  roundness: {
    type: 2,  // 2 = 曲线
    value: 0.5
  }
}
```

#### Line (直线)
```typescript
{
  type: "line",
  x: 100,
  y: 200,
  width: 300,
  height: 0,

  points: [[0, 0], [150, -50], [300, 0]], // 折线点

  strokeStyle: "dashed",
  strokeWidth: 2
}
```

#### Text (文本)
```typescript
{
  type: "text",
  x: 150,
  y: 130,
  width: 100,      // 文本容器宽度
  height: 30,      // 自动计算,但需提供初始值
  text: "Hello World",

  fontSize: 20,
  fontFamily: 1,   // 1=手写体, 2=普通, 3=代码
  textAlign: "center",
  verticalAlign: "middle",

  strokeColor: "#000000",
  backgroundColor: "transparent"
}
```

#### Image (图片)
```typescript
{
  type: "image",
  x: 100,
  y: 100,
  width: 200,
  height: 150,

  fileId: "file-id-from-files-object",

  // 图片缩放
  scale: [1, 1],
  status: "saved"
}
```

#### Frame (画板/分组容器)
```typescript
{
  type: "frame",
  x: 0,
  y: 0,
  width: 800,
  height: 600,
  name: "Page 1",

  // 包含的元素 ID
  children: ["rect-1", "text-1", "arrow-1"]
}
```

---

## 🎨 样式规则

### 颜色规则

#### 标准颜色 (推荐使用)
```typescript
// Excalidraw 默认调色板
const COLORS = {
  // 黑白
  black: "#000000",
  white: "#ffffff",

  // 灰色系
  gray: "#868e96",

  // 主色调
  blue: "#1971c2",
  cyan: "#0c8599",
  teal: "#087f5b",
  green: "#2f9e44",
  lime: "#5c940d",
  yellow: "#f59f00",
  orange: "#f08c00",
  red: "#e03131",
  pink: "#d6336c",
  grape: "#ae3ec9",
  violet: "#7048e8",
};

// 背景色 (浅色)
const BG_COLORS = {
  blue: "#e7f5ff",
  cyan: "#e3fafc",
  teal: "#e6fcf5",
  green: "#ebfbee",
  lime: "#f4fce3",
  yellow: "#fff9db",
  orange: "#fff4e6",
  red: "#ffe3e3",
  pink: "#ffdeeb",
  grape: "#f3d9fa",
  violet: "#e5dbff",
};
```

#### 自定义颜色
```typescript
{
  strokeColor: "#ff6b6b",      // 任意 Hex 颜色
  backgroundColor: "rgba(255, 107, 107, 0.2)", // 支持 rgba
}
```

### 填充样式 (fillStyle)

```typescript
// hachure - 手绘斜线填充 (默认)
{
  fillStyle: "hachure",
  backgroundColor: "#e7f5ff"
}

// cross-hatch - 交叉斜线填充
{
  fillStyle: "cross-hatch",
  backgroundColor: "#e7f5ff"
}

// solid - 纯色填充
{
  fillStyle: "solid",
  backgroundColor: "#e7f5ff"
}

// transparent - 无填充
{
  backgroundColor: "transparent"
}
```

### 线条样式 (strokeStyle)

```typescript
// solid - 实线 (默认)
{
  strokeStyle: "solid",
  strokeWidth: 2
}

// dashed - 虚线
{
  strokeStyle: "dashed",
  strokeWidth: 2,
  strokeColor: "#1971c2"
}

// dotted - 点线
{
  strokeStyle: "dotted",
  strokeWidth: 2
}
```

### 粗糙度 (roughness)

```typescript
// 0 - 完全光滑 (无手绘效果)
{ roughness: 0 }

// 1 - 标准粗糙度 (默认)
{ roughness: 1 }

// 2 - 高粗糙度 (强烈手绘感)
{ roughness: 2 }
```

---

## 🔗 元素绑定规则

### 箭头绑定 (Binding)

#### 基础绑定
```typescript
// 箭头从 rect-1 指向 rect-2
{
  type: "arrow",
  id: "arrow-1",
  x: 300,
  y: 150,
  width: 200,
  height: 0,

  startBinding: { elementId: "rect-1" },
  endBinding: { elementId: "rect-2" }
}
```

#### 精确绑定点 (focus)
```typescript
{
  startBinding: {
    elementId: "rect-1",
    focus: 0.5,  // 0.5 = 右侧中点, -0.5 = 左侧中点
    gap: 10      // 距离边缘 10px
  },
  endBinding: {
    elementId: "rect-2",
    focus: 0,    // 0 = 正中心
    gap: 10
  }
}
```

#### Focus 值说明
```
focus = -1  → 左上角
focus = 0   → 中心点
focus = 1   → 右下角

对于矩形:
  水平方向: -1 (左边) 到 1 (右边)
  垂直方向: -1 (上边) 到 1 (下边)
```

### 分组规则

```typescript
// 1. 创建元素并分配相同的 groupId
const groupId = "group-1";

const elements = [
  {
    type: "rectangle",
    id: "rect-1",
    groupIds: [groupId],
    x: 100, y: 100, width: 100, height: 80
  },
  {
    type: "text",
    id: "text-1",
    groupIds: [groupId],
    x: 120, y: 120, width: 60, height: 25,
    text: "Grouped"
  }
];

// 2. 嵌套分组 (多个 groupId)
{
  groupIds: ["group-1", "group-2"] // group-2 包含 group-1
}
```

### Frame 规则

```typescript
// Frame 作为容器
{
  type: "frame",
  id: "frame-1",
  name: "Screen 1",
  x: 0, y: 0,
  width: 800, height: 600,
  children: ["rect-1", "text-1", "arrow-1"]
}

// 子元素需设置 frameId
{
  type: "rectangle",
  id: "rect-1",
  frameId: "frame-1",
  x: 100, y: 100, width: 200, height: 100
}
```

---

## 📏 布局规则

### 坐标系统
- **原点**: 左上角 (0, 0)
- **X 轴**: 向右递增
- **Y 轴**: 向下递增
- **单位**: 像素 (px)

### 元素定位
```typescript
// 绝对定位
{
  x: 100,  // 距离画布左边 100px
  y: 200   // 距离画布上边 200px
}

// 相对定位 (手动计算)
const parentX = 100;
const parentY = 200;
const childX = parentX + 50;  // 相对父元素右移 50px
const childY = parentY + 80;  // 相对父元素下移 80px
```

### 间距建议
```typescript
// 推荐间距值
const SPACING = {
  tiny: 8,
  small: 16,
  medium: 24,
  large: 48,
  xlarge: 96
};

// 示例: 垂直排列矩形
const elements = [
  { type: "rectangle", x: 100, y: 100, width: 200, height: 80 },
  { type: "rectangle", x: 100, y: 100 + 80 + 24, width: 200, height: 80 }, // 间距 24px
];
```

### 对齐规则
```typescript
// 水平居中
const centerX = (canvasWidth - elementWidth) / 2;

// 垂直居中
const centerY = (canvasHeight - elementHeight) / 2;

// 左对齐
const alignLeft = 100; // 统一 x 坐标

// 顶部对齐
const alignTop = 100;  // 统一 y 坐标
```

---

## 🔄 转换规则

### convertToExcalidrawElements() 规则

```typescript
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

// 输入: Element Skeleton (简化格式)
const skeletonElements = [
  {
    type: "rectangle",
    x: 100, y: 100,
    width: 200, height: 100
  }
];

// 输出: 完整 Excalidraw 元素
const excalidrawElements = convertToExcalidrawElements(skeletonElements, {
  regenerateIds: true  // 重新生成 ID (默认 true)
});

// 结果包含所有必需属性:
// id, version, versionNonce, isDeleted, seed, etc.
```

### Regenerate IDs 规则
```typescript
// regenerateIds: true (默认)
// - 忽略输入的 id
// - 自动生成新的唯一 ID
convertToExcalidrawElements(elements, { regenerateIds: true });

// regenerateIds: false
// - 保留输入的 id
// - 未提供 id 的元素会生成新 ID
convertToExcalidrawElements(elements, { regenerateIds: false });
```

---

## ✅ 最佳实践

### 1. ID 管理
```typescript
// ❌ 避免: 手动管理 ID (容易冲突)
const elements = [
  { type: "rectangle", id: "1", ... },
  { type: "text", id: "2", ... }
];

// ✅ 推荐: 使用有意义的前缀
const elements = [
  { type: "rectangle", id: "node-start", ... },
  { type: "text", id: "label-title", ... },
  { type: "arrow", id: "flow-1-to-2", ... }
];

// ✅ 最佳: 让 API 自动生成
const elements = [
  { type: "rectangle", ... },  // 无 id
  { type: "text", ... }         // 无 id
];
```

### 2. 颜色一致性
```typescript
// ✅ 定义颜色常量
const THEME = {
  primary: "#1971c2",
  primaryBg: "#e7f5ff",
  success: "#2f9e44",
  successBg: "#ebfbee",
  warning: "#f59f00",
  warningBg: "#fff9db",
  danger: "#e03131",
  dangerBg: "#ffe3e3"
};

// 使用
{
  strokeColor: THEME.primary,
  backgroundColor: THEME.primaryBg
}
```

### 3. 文本换行
```typescript
// ❌ Excalidraw 不支持 \n 自动换行
{ text: "Line 1\nLine 2" }  // 无效

// ✅ 使用多个文本元素
[
  { type: "text", x: 100, y: 100, text: "Line 1" },
  { type: "text", x: 100, y: 130, text: "Line 2" }
]

// ✅ 或让用户手动换行 (UI 中按 Enter)
```

### 4. 箭头连接
```typescript
// ❌ 避免: 无绑定的箭头 (难以维护)
{
  type: "arrow",
  x: 300, y: 150,
  width: 200, height: 0
}

// ✅ 推荐: 始终使用绑定
{
  type: "arrow",
  x: 300, y: 150,
  width: 200, height: 0,
  startBinding: { elementId: "node-1" },
  endBinding: { elementId: "node-2" }
}
```

### 5. 响应式布局
```typescript
// ❌ 避免: 硬编码坐标
const elements = [
  { type: "rectangle", x: 100, y: 100, ... },
  { type: "rectangle", x: 400, y: 100, ... }
];

// ✅ 推荐: 使用变量计算
const CANVAS = { width: 800, height: 600 };
const NODE = { width: 200, height: 100 };
const SPACING = 100;

const elements = [
  {
    type: "rectangle",
    x: CANVAS.width / 4 - NODE.width / 2,
    y: CANVAS.height / 2 - NODE.height / 2,
    width: NODE.width,
    height: NODE.height
  },
  {
    type: "rectangle",
    x: (CANVAS.width * 3) / 4 - NODE.width / 2,
    y: CANVAS.height / 2 - NODE.height / 2,
    width: NODE.width,
    height: NODE.height
  }
];
```

### 6. 图层顺序
```typescript
// 元素按数组顺序渲染 (后面的在上面)
const elements = [
  { /* 背景层 */ },
  { /* 中间层 */ },
  { /* 前景层 */ }
];

// ✅ 推荐顺序
[
  // 1. Frame (最底层)
  { type: "frame", ... },

  // 2. 装饰元素
  { type: "rectangle", ... },
  { type: "ellipse", ... },

  // 3. 连接线
  { type: "arrow", ... },
  { type: "line", ... },

  // 4. 文本 (最上层)
  { type: "text", ... }
]
```

---

## 📚 参考资源

- [Element Skeleton API 文档](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/excalidraw-element-skeleton)
- [Props 完整参考](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/excalidraw-api)
- [TypeScript 类型定义](https://github.com/excalidraw/excalidraw/blob/master/packages/excalidraw/element/types.ts)

---

**最后更新**: 2025-10-13
