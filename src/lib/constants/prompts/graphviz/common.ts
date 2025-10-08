/**
 * L2: Graphviz/DOT 语言规范提示词
 *
 * 作用：定义 Graphviz DOT 语言的通用语法规则和最佳实践
 * Token 预算：400-500 tokens
 * 适用范围：所有 Graphviz 图表类型（digraph、graph）
 *
 * 说明：Graphviz 是一个开源的图可视化软件，使用 DOT 语言描述图形
 * 支持多种布局引擎（dot、neato、circo、fdp、twopi、osage）
 */

export const GRAPHVIZ_COMMON_PROMPT = `
# Graphviz DOT 语言通用规范

## 语法要求

### 图声明
\`\`\`dot
// 有向图（使用 -> 连接）
digraph 图名称 {
  // 图内容
}

// 无向图（使用 -- 连接）
graph 图名称 {
  // 图内容
}

// 严格图（不允许重复边）
strict digraph 图名称 {
  // 图内容
}
\`\`\`

**重要规则**：
- 有向图必须使用 \`digraph\` 和 \`->\`
- 无向图必须使用 \`graph\` 和 \`--\`
- 不要混用 \`->\` 和 \`--\`
- 图名称可选，支持中文但建议使用英文

### 节点语法
\`\`\`dot
// 基础节点定义
节点ID [label="显示文本"];

// 带多个属性
节点ID [
  label="显示文本",
  shape=box,
  style=filled,
  fillcolor="#e3f2fd"
];

// 中文节点（推荐）
用户 [shape=circle];
订单 [shape=box];
\`\`\`

**常用节点形状**：
- \`box\` - 矩形（默认，通用步骤）
- \`circle\` - 圆形（状态节点）
- \`ellipse\` - 椭圆（默认形状）
- \`diamond\` - 菱形（判断节点）
- \`doublecircle\` - 双圆（结束状态）
- \`cylinder\` - 圆柱（数据库）
- \`plaintext\` - 纯文本（无边框）

### 边语法
\`\`\`dot
// 有向图
A -> B;
A -> B [label="条件"];
A -> B [label="成功", color="#4caf50", style=bold];

// 无向图
A -- B;
A -- B [label="连接", color="#2196f3"];

// 链式连接
A -> B -> C -> D;
\`\`\`

**常用边样式**：
- \`solid\` - 实线（默认）
- \`dashed\` - 虚线
- \`dotted\` - 点线
- \`bold\` - 粗线

## 命名规范

### 节点 ID 命名
- ✅ **推荐**：直接使用中文（Graphviz 完整支持中文）
- ✅ **可选**：使用英文字母、数字、下划线
- ❌ **避免**：使用特殊字符（! @ # $ % ^ & *）

**示例**：
\`\`\`dot
// ✅ 好的命名
用户;
订单系统;
node1;
user_service;

// ❌ 不推荐
node@1;        // 包含特殊字符
node 1;        // 包含空格（需要引号）
"node 1";      // 需要引号，不够清晰
\`\`\`

### 标签命名
- 使用 \`label\` 属性定义显示文本
- 支持中文、英文、数字、符号
- 可以使用 \`\\n\` 换行

## 样式系统

### 全局样式
\`\`\`dot
digraph {
  // 全局配置
  rankdir=TB;          // 布局方向：TB/LR/BT/RL
  node [shape=box, style=filled, fillcolor="#e3f2fd"];
  edge [color="#1976d2", fontsize=10];
  
  // 图内容...
}
\`\`\`

### 布局方向
- \`TB\` (Top to Bottom) - 从上到下（默认）
- \`LR\` (Left to Right) - 从左到右
- \`BT\` (Bottom to Top) - 从下到上
- \`RL\` (Right to Left) - 从右到左

### 布局引擎
- \`dot\` - 层次化布局（默认，适合流程图）
- \`neato\` - 弹簧模型（适合无向图）
- \`circo\` - 环形布局（适合网络拓扑）
- \`fdp\` - 力导向布局（适合大型图）
- \`twopi\` - 径向布局（适合中心辐射）
- \`osage\` - 聚类布局

**使用方法**：
\`\`\`dot
graph {
  layout=circo;  // 指定布局引擎
  // ...
}
\`\`\`

### 子图（Subgraph）
\`\`\`dot
digraph {
  // 聚类子图（带边框）
  subgraph cluster_0 {
    label="组名";
    style=filled;
    color="#bbdefb";
    fillcolor="#e3f2fd";
    
    节点A;
    节点B;
  }
  
  // 普通子图（用于布局约束）
  subgraph {
    rank=same;  // 节点在同一水平线
    节点C;
    节点D;
  }
}
\`\`\`

**重要规则**：
- 聚类子图必须以 \`cluster_\` 开头
- 聚类子图会显示边框和标签
- 普通子图用于布局约束

## 常见错误

### 错误 1: 混用有向图和无向图语法
**❌ 错误**：
\`\`\`dot
digraph {
  A -- B;  // 错误：有向图使用了无向图连接符
}
\`\`\`

**✅ 正确**：
\`\`\`dot
digraph {
  A -> B;  // 有向图使用 ->
}

graph {
  A -- B;  // 无向图使用 --
}
\`\`\`

### 错误 2: 特殊字符未处理
**❌ 错误**：
\`\`\`dot
digraph {
  用户"管理员" -> 系统;  // 引号未转义
}
\`\`\`

**✅ 正确**：
\`\`\`dot
digraph {
  用户管理员 -> 系统;
  // 或
  "用户\\"管理员\\"" -> 系统;
}
\`\`\`

### 错误 3: 子图命名错误
**❌ 错误**：
\`\`\`dot
digraph {
  subgraph group1 {  // 缺少 cluster_ 前缀，不会显示边框
    label="组1";
    A; B;
  }
}
\`\`\`

**✅ 正确**：
\`\`\`dot
digraph {
  subgraph cluster_group1 {  // cluster_ 前缀必需
    label="组1";
    style=filled;
    color=lightgrey;
    A; B;
  }
}
\`\`\`

## Kroki 渲染注意事项

### 支持的特性
- ✅ 所有标准 DOT 语法
- ✅ 中文节点和标签
- ✅ 所有布局引擎（dot、neato、circo、fdp、twopi、osage）
- ✅ HTML 标签（<BR/>、<B>、<I> 等）
- ✅ 颜色名称和十六进制色值

### 不支持的特性
- ❌ 外部图片引用（image 属性）
- ❌ 自定义字体文件
- ❌ PostScript 自定义形状

### 最佳实践
1. **使用十六进制颜色**：\`#4caf50\` 比 \`green\` 更精确
2. **避免过度嵌套**：最多 3 层子图嵌套
3. **合理使用换行**：标签使用 \`\\n\` 保持简洁
4. **统一样式**：同类节点使用相同形状和颜色
5. **测试布局引擎**：不同引擎适合不同场景
`;

/**
 * Token 估算: 约 480 tokens
 *
 * 分配明细:
 * - 语法要求: 200 tokens
 * - 命名规范: 80 tokens
 * - 样式系统: 120 tokens
 * - 常见错误: 80 tokens
 */

