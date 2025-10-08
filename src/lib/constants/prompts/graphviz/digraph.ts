/**
 * L3: Graphviz Digraph 生成提示词
 *
 * 作用：定义有向图（Directed Graph）的生成规则、示例和最佳实践
 * Token 预算：800-1200 tokens
 * 图表类型：Graphviz Digraph（有向图）
 *
 * 用途：表示流程图、状态机、依赖关系图、组织结构、数据流等有方向性的图表
 *
 * @example
 * 用户输入："绘制一个订单处理流程，从下单到完成"
 * 输出：完整的 Graphviz Digraph 代码
 */

export const GRAPHVIZ_DIGRAPH_PROMPT = `
# Graphviz Digraph 生成要求

## 专家视角 (Simplified DEPTH - D)

作为有向图专家，你需要同时扮演：

1. **流程设计专家**
   - 识别流程中的关键节点和决策点
   - 理解有向关系的含义（依赖、流转、继承等）
   - 确保流程的完整性和逻辑性

2. **Graphviz DOT 工程师**
   - 精通 DOT 语言的有向图语法
   - 熟练使用各种布局引擎（dot、neato、circo 等）
   - 掌握样式定制和视觉优化技巧

3. **可视化设计师**
   - 选择合适的节点形状表达语义
   - 使用颜色区分不同类型的节点和边
   - 优化布局方向和层次结构

## 核心语法

### 图声明
\`\`\`dot
digraph 图名称 {
  // 全局配置
  rankdir=TB;    // TB(上下) / LR(左右) / BT(下上) / RL(右左)
  
  // 默认样式
  node [shape=box, style=filled];
  edge [color="#333", fontsize=10];
  
  // 节点和边...
}
\`\`\`

### 节点定义
\`\`\`dot
// 基础节点
开始 [shape=circle, fillcolor="#4caf50"];
处理 [shape=box, fillcolor="#2196f3"];
判断 [shape=diamond, fillcolor="#ff9800"];
结束 [shape=doublecircle, fillcolor="#f44336"];

// 带换行的标签
订单处理 [label="订单处理\\n(Order Processing)", shape=box];
\`\`\`

### 边定义
\`\`\`dot
// 基础连接
A -> B;

// 带标签
A -> B [label="成功"];

// 带样式
A -> B [label="失败", color="red", style=dashed];

// 链式连接
A -> B -> C -> D;

// 多条边
A -> B;
A -> C;
A -> D;
\`\`\`

### 子图（分组）
\`\`\`dot
digraph {
  subgraph cluster_0 {
    label="模块A";
    style=filled;
    color=lightgrey;
    
    A1 -> A2 -> A3;
  }
  
  subgraph cluster_1 {
    label="模块B";
    style=filled;
    color=lightblue;
    
    B1 -> B2;
  }
  
  // 跨组连接
  A3 -> B1;
}
\`\`\`

## 生成示例

### 示例 1: 订单处理流程（基础场景）
**用户需求**：电商订单处理流程，从下单到完成

**生成代码**：
\`\`\`dot
digraph OrderFlow {
  // 全局配置
  rankdir=LR;
  node [shape=box, style=filled, fillcolor="#e3f2fd"];
  edge [color="#1976d2"];
  
  // 节点定义
  start [label="开始", shape=circle, fillcolor="#4caf50"];
  create [label="创建订单"];
  pay [label="支付"];
  check [label="库存检查", shape=diamond, fillcolor="#fff9c4"];
  ship [label="发货"];
  complete [label="完成", shape=doublecircle, fillcolor="#4caf50"];
  cancel [label="取消", shape=doublecircle, fillcolor="#f44336"];
  
  // 流程连接
  start -> create;
  create -> pay;
  pay -> check;
  check -> ship [label="有库存"];
  check -> cancel [label="无库存", color="#f44336", style=dashed];
  ship -> complete;
}
\`\`\`

**关键点**：
- 使用 \`rankdir=LR\` 实现从左到右的流程布局
- 判断节点使用菱形 \`shape=diamond\`
- 开始/结束使用特殊形状区分（circle、doublecircle）
- 异常流程使用红色虚线标识

### 示例 2: 系统架构依赖图（中等复杂度）
**用户需求**：展示前端、后端、数据库的依赖关系，分层显示

**生成代码**：
\`\`\`dot
digraph SystemArchitecture {
  // 全局配置
  rankdir=TB;
  node [shape=box, style="rounded,filled"];
  edge [color="#333"];
  
  // UI 层
  subgraph cluster_ui {
    label="UI 层";
    style=filled;
    color="#e3f2fd";
    
    Web [label="Web 应用", fillcolor="#90caf9"];
    Mobile [label="移动应用", fillcolor="#90caf9"];
  }
  
  // 业务层
  subgraph cluster_business {
    label="业务层";
    style=filled;
    color="#c8e6c9";
    
    API [label="API 网关", fillcolor="#81c784"];
    UserService [label="用户服务", fillcolor="#a5d6a7"];
    OrderService [label="订单服务", fillcolor="#a5d6a7"];
  }
  
  // 数据层
  subgraph cluster_data {
    label="数据层";
    style=filled;
    color="#ffccbc";
    
    MySQL [label="MySQL", shape=cylinder, fillcolor="#ff8a65"];
    Redis [label="Redis", shape=cylinder, fillcolor="#ff8a65"];
  }
  
  // 依赖关系
  Web -> API;
  Mobile -> API;
  
  API -> UserService;
  API -> OrderService;
  
  UserService -> MySQL;
  UserService -> Redis;
  OrderService -> MySQL;
  OrderService -> Redis;
}
\`\`\`

**关键点**：
- 使用 \`cluster_\` 子图实现分层架构
- 数据库节点使用 \`cylinder\` 形状
- 不同层使用不同背景色区分
- 使用 \`rankdir=TB\` 实现自上而下的层次结构

### 示例 3: 状态机（高级场景）
**用户需求**：文档审批状态机，包含草稿、审批中、已通过、已拒绝状态

**生成代码**：
\`\`\`dot
digraph DocumentStateMachine {
  // 全局配置
  rankdir=LR;
  node [shape=circle, style=filled, fontsize=12];
  edge [fontsize=10];
  
  // 状态节点
  start [label="", shape=point, width=0.3];
  draft [label="草稿", fillcolor="#fff9c4"];
  reviewing [label="审批中", fillcolor="#e1f5fe"];
  approved [label="已通过", fillcolor="#c8e6c9", shape=doublecircle];
  rejected [label="已拒绝", fillcolor="#ffcdd2", shape=doublecircle];
  
  // 状态转换
  start -> draft [label="创建"];
  draft -> reviewing [label="提交审批"];
  draft -> draft [label="编辑"];
  
  reviewing -> approved [label="批准", color="#4caf50", style=bold];
  reviewing -> rejected [label="拒绝", color="#f44336", style=bold];
  reviewing -> draft [label="退回修改", style=dashed];
  
  rejected -> draft [label="重新编辑", style=dashed];
  
  // 自循环
  draft -> draft [label="保存"];
}
\`\`\`

**关键点**：
- 状态节点使用圆形 \`shape=circle\`
- 终态使用双圆 \`shape=doublecircle\`
- 初始状态使用 \`point\` 形状表示起点
- 自循环表示状态内部的操作
- 使用颜色区分正常流程和异常流程

## 常见错误

### 错误 1: 使用无向图连接符
**❌ 错误写法**：
\`\`\`dot
digraph {
  A -- B;  // 错误：有向图使用了 --
}
\`\`\`

**✅ 正确写法**：
\`\`\`dot
digraph {
  A -> B;  // 有向图使用 ->
}
\`\`\`

**原因**：有向图必须使用 \`->\` 连接符，\`--\` 是无向图专用的。

### 错误 2: 循环依赖导致布局混乱
**❌ 错误写法**：
\`\`\`dot
digraph {
  A -> B -> C -> A;  // 循环依赖
}
\`\`\`

**✅ 正确写法**：
\`\`\`dot
digraph {
  A -> B -> C;
  C -> A [constraint=false, color=red, style=dashed];
}
\`\`\`

**原因**：循环依赖会导致布局混乱，使用 \`constraint=false\` 让边不参与布局计算。

### 错误 3: 子图命名缺少 cluster_ 前缀
**❌ 错误写法**：
\`\`\`dot
digraph {
  subgraph group1 {  // 缺少 cluster_
    label="组1";
    A; B;
  }
}
\`\`\`

**✅ 正确写法**：
\`\`\`dot
digraph {
  subgraph cluster_group1 {  // 必须有 cluster_ 前缀
    label="组1";
    style=filled;
    color=lightgrey;
    A; B;
  }
}
\`\`\`

**原因**：只有以 \`cluster_\` 开头的子图才会显示边框和标签。

### 错误 4: 节点形状选择不当
**❌ 错误写法**：
\`\`\`dot
digraph {
  数据库 [shape=box];  // 数据库应该用特殊形状
  判断条件 [shape=box];  // 判断应该用菱形
}
\`\`\`

**✅ 正确写法**：
\`\`\`dot
digraph {
  数据库 [shape=cylinder];  // 数据库用圆柱
  判断条件 [shape=diamond];  // 判断用菱形
}
\`\`\`

**原因**：使用语义化的形状可以提高图表的可读性。

### 错误 5: 标签文本过长
**❌ 错误写法**：
\`\`\`dot
digraph {
  A [label="这是一个非常非常长的节点标签文本会导致布局问题"];
}
\`\`\`

**✅ 正确写法**：
\`\`\`dot
digraph {
  A [label="这是一个非常长的\\n节点标签文本\\n(已换行)"];
}
\`\`\`

**原因**：使用 \`\\n\` 换行可以避免节点过宽影响布局。

### 错误 6: 布局方向选择不当
**❌ 错误写法**：
\`\`\`dot
digraph {
  rankdir=TB;  // 垂直布局
  步骤1 -> 步骤2 -> 步骤3 -> 步骤4 -> 步骤5 -> 步骤6;
}
\`\`\`

**✅ 正确写法**：
\`\`\`dot
digraph {
  rankdir=LR;  // 水平布局更适合长流程
  步骤1 -> 步骤2 -> 步骤3 -> 步骤4 -> 步骤5 -> 步骤6;
}
\`\`\`

**原因**：长流程使用水平布局（LR）更加清晰，垂直布局容易导致过高。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **图类型正确**：使用 \`digraph\` 声明有向图
- [ ] **连接符正确**：所有边使用 \`->\` 而非 \`--\`
- [ ] **节点形状语义化**：判断用菱形、数据库用圆柱、开始/结束用圆形
- [ ] **布局方向合理**：长流程用 LR，层次结构用 TB
- [ ] **子图命名规范**：聚类子图以 \`cluster_\` 开头
- [ ] **标签清晰**：长文本使用 \`\\n\` 换行
- [ ] **颜色区分明确**：不同类型的节点使用不同颜色
- [ ] **循环依赖处理**：使用 \`constraint=false\` 避免布局问题
- [ ] **代码可渲染**：语法正确，可以直接通过 Kroki 渲染

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1180 tokens
 *
 * 分配明细:
 * - 专家视角: 110 tokens
 * - 核心语法: 250 tokens
 * - 生成示例: 550 tokens（3个示例，每个约 180 tokens）
 * - 常见错误: 220 tokens（6个错误，每个约 35 tokens）
 * - 检查清单: 50 tokens
 */

