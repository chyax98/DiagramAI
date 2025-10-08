/**
 * L2: Excalidraw 语言规范
 *
 * 作用：定义 Excalidraw JSON 格式的通用规则和最佳实践
 * Token 预算：200-500 tokens
 *
 * 适用范围：所有 Excalidraw 图表类型（sketch、wireframe、diagram）
 */

export const EXCALIDRAW_COMMON_PROMPT = `
# Excalidraw 通用语法规范

## 格式要求

### JSON 结构
Excalidraw 使用标准 JSON 格式，必须包含以下顶层属性：

\`\`\`json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [],
  "appState": {},
  "files": {}
}
\`\`\`

## 核心元素类型

### 基本形状
- \`rectangle\` - 矩形：用于容器、框架
- \`ellipse\` - 椭圆：用于开始/结束、强调
- \`diamond\` - 菱形：用于判断、决策

### 线条
- \`arrow\` - 箭头：表示方向、关系
- \`line\` - 线条：连接、分隔

### 文本
- \`text\` - 独立文本元素
- \`label\` - 形状内的标签（嵌套在形状的 \`label\` 属性中）

## 必需属性

每个元素必须包含：
- \`type\` - 元素类型
- \`x\` - X 坐标
- \`y\` - Y 坐标
- \`width\` - 宽度（形状类型）
- \`height\` - 高度（形状类型）

## 常用样式属性

\`\`\`json
{
  "strokeColor": "#000000",        // 边框颜色
  "backgroundColor": "#ffffff",    // 填充颜色
  "strokeWidth": 2,               // 边框宽度 (1, 2, 4)
  "strokeStyle": "solid",         // solid, dashed, dotted
  "fillStyle": "hachure",         // hachure, cross-hatch, solid
  "roughness": 1,                 // 手绘粗糙度 (0-2)
  "opacity": 100,                 // 不透明度 (0-100)
  "fontSize": 20,                 // 字体大小
  "fontFamily": 1,                // 1=手绘, 2=正常, 3=代码
  "textAlign": "center"           // left, center, right
}
\`\`\`

## 命名规范

### 元素 ID
- 使用有意义的英文 ID：\`login-button\`、\`user-icon\`
- 或使用类型-序号：\`rect-1\`、\`arrow-2\`
- 必须唯一，用于箭头绑定

### 颜色规范
推荐使用现代、清晰的颜色：
- 浅色背景：\`#c0eb75\` (绿)、\`#ffc9c9\` (红)、\`#a5d8ff\` (蓝)
- 深色边框：\`#1971c2\` (蓝)、\`#2f9e44\` (绿)、\`#5f3dc4\` (紫)

## 常见错误

### 错误 1: 缺少顶层必需属性
❌ 错误：缺少 \`type\`、\`version\` 等
✅ 正确：始终包含完整的 JSON 结构

### 错误 2: 元素缺少位置或尺寸
❌ 错误：只有 \`type\`，没有 \`x\`、\`y\`、\`width\`、\`height\`
✅ 正确：所有形状必须有完整的位置和尺寸信息

### 错误 3: 箭头绑定到不存在的 ID
❌ 错误：\`"start": {"id": "nonexistent"}\`
✅ 正确：确保绑定的 ID 对应已存在的元素

### 错误 4: JSON 格式错误
❌ 错误：缺少逗号、引号不匹配
✅ 正确：生成严格有效的 JSON，使用 JSON 验证器检查

## 布局最佳实践

- 元素间距：至少 50px
- 标准形状宽度：100-300px
- 标准形状高度：50-150px
- 字体大小：16-20px（正文），28-36px（标题）
- 箭头起点/终点：精确绑定到元素 ID

## 手绘风格控制

\`roughness\` 参数控制手绘效果：
- \`0\` - 精确线条（适合线框图）
- \`1\` - 标准手绘（推荐默认值）
- \`2\` - 强烈手绘（适合草图）
`;

/**
 * Token 估算: 约 450 tokens
 */

