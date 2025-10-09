/**
 * L3: Graphviz State Diagram 生成提示词
 *
 * 作用:定义状态图的生成规则、示例和最佳实践
 * Token 预算:900-1200 tokens
 * 图表类型:Graphviz State Diagram(状态图/状态机)
 *
 * 用途:表示系统状态转换、业务流程状态、生命周期等状态机模型
 *
 * @example
 * 用户输入:"绘制订单状态流转图"
 * 输出:完整的 Graphviz DOT 代码
 */

export const GRAPHVIZ_STATE_PROMPT = `
# Graphviz State Diagram 生成要求

## 专家视角 (Simplified DEPTH - D)

作为状态图专家,你需要同时扮演:

1. **状态机设计专家**
   - 识别系统的所有可能状态
   - 理解状态之间的转换条件
   - 确保状态机的完整性(无死锁、无孤立状态)

2. **Graphviz DOT 工程师**
   - 精通 DOT 语言的状态图语法
   - 熟练使用节点形状表达状态类型
   - 掌握边标签表达转换事件

3. **可视化设计师**
   - 使用颜色区分状态类型(初始、中间、终止)
   - 使用箭头和标签清晰表达转换逻辑
   - 设计清晰的状态层次结构

## 核心语法

### 图声明
\`\`\`dot
digraph StateMachine {
  // 布局方向
  rankdir=LR;    // LR(左→右) 适合状态流转
  rankdir=TB;    // TB(上→下) 适合分层状态

  // 默认样式
  node [shape=circle, style=filled, fillcolor="#e3f2fd"];
  edge [color="#1976d2", fontsize=10];

  // 状态和转换...
}
\`\`\`

### 状态图专用节点形状
\`\`\`dot
// 初始状态
initial [label="", shape=circle, width=0.3, fillcolor="black"];

// 普通状态
idle [label="空闲", shape=circle, fillcolor="#90caf9"];
active [label="活动中", shape=circle, fillcolor="#4fc3f7"];

// 终止状态
final [label="", shape=doublecircle, width=0.3, fillcolor="black"];

// 复合状态(包含子状态)
processing [label="处理中", shape=box, style="rounded,filled", fillcolor="#fff9c4"];

// 决策点
check [label="", shape=diamond, width=0.5, fillcolor="#ff9800"];
\`\`\`

### 状态转换
\`\`\`dot
// 基本转换
idle -> active [label="开始"];

// 条件转换
active -> check [label="检查"];
check -> success [label="通过"];
check -> failed [label="失败"];

// 自循环(状态内部转换)
active -> active [label="重试"];

// 超时转换
active -> timeout [label="3秒", style=dashed, color="red"];
\`\`\`

## 生成示例

### 示例 1: 订单状态流转(基础场景)
**用户需求**:电商订单从创建到完成的状态流转

**生成代码**:
\`\`\`dot
digraph OrderState {
  rankdir=LR;
  node [shape=circle, style=filled, fontsize=11];
  edge [color="#333", fontsize=9];

  // 状态定义
  initial [label="", shape=point, width=0.2];
  created [label="待支付", fillcolor="#90caf9"];
  paid [label="已支付", fillcolor="#4fc3f7"];
  shipped [label="已发货", fillcolor="#29b6f6"];
  delivered [label="已送达", fillcolor="#03a9f4"];
  completed [label="已完成", fillcolor="#4caf50"];
  cancelled [label="已取消", fillcolor="#f44336"];
  final [label="", shape=doublecircle, width=0.3, fillcolor="black"];

  // 状态转换
  initial -> created;
  created -> paid [label="支付"];
  created -> cancelled [label="取消"];

  paid -> shipped [label="发货"];
  paid -> cancelled [label="退款"];

  shipped -> delivered [label="送达"];
  delivered -> completed [label="确认收货"];

  completed -> final;
  cancelled -> final;
}
\`\`\`

**关键点**:
- 使用 \`rankdir=LR\` 实现水平流转布局
- 初始状态使用 \`point\` 形状
- 终止状态使用 \`doublecircle\` 形状
- 颜色表达状态进度(蓝色系→绿色成功/红色失败)
- 所有路径最终汇聚到终止状态

### 示例 2: TCP 连接状态机(中等复杂度)
**用户需求**:TCP 连接的标准状态转换

**生成代码**:
\`\`\`dot
digraph TCPState {
  rankdir=TB;
  node [shape=circle, style=filled, fillcolor="#e1f5fe"];
  edge [color="#01579b", fontsize=9];

  // 状态定义
  CLOSED [fillcolor="#b0bec5"];
  LISTEN [fillcolor="#90caf9"];
  SYN_SENT [fillcolor="#64b5f6"];
  SYN_RCVD [fillcolor="#42a5f5"];
  ESTABLISHED [fillcolor="#4caf50"];
  FIN_WAIT_1 [fillcolor="#ffb74d"];
  FIN_WAIT_2 [fillcolor="#ffa726"];
  CLOSE_WAIT [fillcolor="#ff9800"];
  CLOSING [fillcolor="#f57c00"];
  LAST_ACK [fillcolor="#e65100"];
  TIME_WAIT [fillcolor="#d84315"];

  // 连接建立
  CLOSED -> LISTEN [label="被动打开"];
  CLOSED -> SYN_SENT [label="主动打开/发送SYN"];
  LISTEN -> SYN_RCVD [label="收到SYN/发送SYN+ACK"];
  SYN_SENT -> ESTABLISHED [label="收到SYN+ACK/发送ACK"];
  SYN_RCVD -> ESTABLISHED [label="收到ACK"];

  // 连接关闭
  ESTABLISHED -> FIN_WAIT_1 [label="主动关闭/发送FIN"];
  ESTABLISHED -> CLOSE_WAIT [label="收到FIN/发送ACK"];

  FIN_WAIT_1 -> FIN_WAIT_2 [label="收到ACK"];
  FIN_WAIT_1 -> CLOSING [label="收到FIN/发送ACK"];

  FIN_WAIT_2 -> TIME_WAIT [label="收到FIN/发送ACK"];
  CLOSING -> TIME_WAIT [label="收到ACK"];

  CLOSE_WAIT -> LAST_ACK [label="发送FIN"];
  LAST_ACK -> CLOSED [label="收到ACK"];
  TIME_WAIT -> CLOSED [label="2MSL超时"];

  // 异常情况
  LISTEN -> CLOSED [label="关闭", style=dashed];
  SYN_SENT -> CLOSED [label="超时", style=dashed, color="red"];
}
\`\`\`

**关键点**:
- 使用 \`rankdir=TB\` 实现垂直分层布局
- 颜色渐变表达状态阶段(建立→运行→关闭)
- 虚线表示异常或特殊路径
- 标签详细说明触发事件和发送报文

### 示例 3: 文档审批流程(高级场景)
**用户需求**:多级审批的文档状态流转,包含并行审批

**生成代码**:
\`\`\`dot
digraph DocumentApproval {
  rankdir=TB;
  node [shape=circle, style=filled];
  edge [color="#333", fontsize=9];

  // 初始和终止
  start [label="", shape=point, width=0.2];
  end [label="", shape=doublecircle, width=0.3, fillcolor="black"];

  // 主要状态
  draft [label="草稿", fillcolor="#e3f2fd"];
  submitted [label="已提交", fillcolor="#90caf9"];

  // 审批状态(复合状态)
  manager_review [label="经理审批中", shape=box, style="rounded,filled", fillcolor="#fff9c4"];
  director_review [label="总监审批中", shape=box, style="rounded,filled", fillcolor="#fff9c4"];
  ceo_review [label="CEO审批中", shape=box, style="rounded,filled", fillcolor="#fff9c4"];

  // 结果状态
  approved [label="已批准", fillcolor="#a5d6a7"];
  rejected [label="已拒绝", fillcolor="#ef9a9a"];

  // 特殊状态
  revising [label="修订中", fillcolor="#ffcc80"];

  // 流程定义
  start -> draft;
  draft -> submitted [label="提交"];

  submitted -> manager_review;
  manager_review -> rejected [label="拒绝"];
  manager_review -> director_review [label="通过"];
  manager_review -> revising [label="需修改"];

  director_review -> rejected [label="拒绝"];
  director_review -> ceo_review [label="通过"];
  director_review -> revising [label="需修改"];

  ceo_review -> approved [label="批准"];
  ceo_review -> rejected [label="拒绝"];
  ceo_review -> revising [label="需修改"];

  revising -> submitted [label="重新提交"];

  approved -> end;
  rejected -> end;

  // 撤回功能
  submitted -> draft [label="撤回", style=dashed, color="blue"];
}
\`\`\`

**关键点**:
- 使用 \`box\` 形状表示复合审批状态
- 多级审批流程清晰展示层级关系
- 修订循环使用不同颜色标识
- 撤回路径使用虚线区分

## 常见错误

### 错误 1: 初始/终止状态不明确
**❌ 错误写法**:
\`\`\`dot
digraph {
  idle -> active -> complete;
}
\`\`\`

**✅ 正确写法**:
\`\`\`dot
digraph {
  start [label="", shape=point];
  end [label="", shape=doublecircle];
  start -> idle -> active -> complete -> end;
}
\`\`\`

**原因**:状态机必须有明确的初始状态和终止状态。

### 错误 2: 状态节点使用方框
**❌ 错误写法**:
\`\`\`dot
digraph {
  state1 [label="状态1", shape=box];
}
\`\`\`

**✅ 正确写法**:
\`\`\`dot
digraph {
  state1 [label="状态1", shape=circle];
}
\`\`\`

**原因**:圆形是状态图的标准形状,方框用于复合状态。

### 错误 3: 转换缺少触发事件
**❌ 错误写法**:
\`\`\`dot
digraph {
  A -> B;
}
\`\`\`

**✅ 正确写法**:
\`\`\`dot
digraph {
  A -> B [label="事件/动作"];
}
\`\`\`

**原因**:状态转换应该明确标注触发事件或执行动作。

### 错误 4: 存在孤立状态
**❌ 错误写法**:
\`\`\`dot
digraph {
  A -> B -> C;
  D -> E;  // 孤立的状态链
}
\`\`\`

**✅ 正确写法**:
\`\`\`dot
digraph {
  start -> A -> B -> C;
  C -> D -> E -> end;
}
\`\`\`

**原因**:所有状态应该连接到主状态机,避免孤立子图。

### 错误 5: 自循环未标注条件
**❌ 错误写法**:
\`\`\`dot
digraph {
  A -> A;
}
\`\`\`

**✅ 正确写法**:
\`\`\`dot
digraph {
  A -> A [label="重试/内部事件"];
}
\`\`\`

**原因**:自循环必须明确说明是什么事件导致状态保持。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后,逐项检查:

- [ ] **图类型正确**:使用 \`digraph\` 声明
- [ ] **有明确初始状态**:使用 point 或小圆形标识
- [ ] **有明确终止状态**:使用 doublecircle 标识
- [ ] **状态用圆形**:普通状态使用 circle,复合状态用 box
- [ ] **转换有标签**:所有边标注触发事件或动作
- [ ] **无孤立状态**:所有状态连接到主状态机
- [ ] **颜色语义化**:不同阶段状态使用不同颜色
- [ ] **自循环有条件**:状态内转换明确标注原因
- [ ] **布局方向合理**:水平流转用 LR,分层用 TB
- [ ] **代码可渲染**:语法正确,可直接通过 Kroki 渲染

**任何检查项不通过,立即修正后重新生成**
`;

/**
 * Token 估算: 约 1170 tokens
 *
 * 分配明细:
 * - 专家视角: 100 tokens
 * - 核心语法: 230 tokens
 * - 生成示例: 590 tokens(3个示例,每个约 195 tokens)
 * - 常见错误: 200 tokens(5个错误,每个约 40 tokens)
 * - 检查清单: 50 tokens
 */
