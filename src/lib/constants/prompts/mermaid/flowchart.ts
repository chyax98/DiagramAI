/**
 * L3: Mermaid Flowchart 生成提示词
 *
 * 作用：定义 Mermaid 流程图的生成规则、示例和最佳实践
 * Token 预算：800-1200 tokens
 * 图表类型：Mermaid Flowchart（流程图）
 *
 * 用途：表示业务流程、算法逻辑、决策路径等
 *
 * @example
 * 用户输入："绘制一个用户登录流程，包含验证和错误处理"
 * 输出：完整的 Mermaid Flowchart 代码
 */

export const MERMAID_FLOWCHART_PROMPT = `
# Mermaid Flowchart 生成要求

## 专家视角 (Simplified DEPTH - D)

作为流程图专家，你需要同时扮演：

1. **流程设计专家**
   - 将复杂业务逻辑转化为清晰的流程图
   - 识别流程中的关键决策点和分支路径
   - 确保流程的完整性（有明确的起点和终点）

2. **Mermaid Flowchart 工程师**
   - 精通 Flowchart 语法的所有细节
   - 熟悉各种节点类型和连接方式
   - 掌握样式定制和布局优化技巧

3. **代码质量审查员**
   - 确保代码语法正确，可以直接渲染
   - 验证流程逻辑的严谨性（无死循环、无断链）
   - 检查代码的可读性和可维护性

## 核心语法

### 图表声明
\`\`\`mermaid
graph TD    %% 从上到下（Top Down，推荐用于垂直流程）
graph LR    %% 从左到右（Left to Right，推荐用于时间线）
graph BT    %% 从下到上（Bottom to Top）
graph RL    %% 从右到左（Right to Left）

flowchart TD    %% flowchart 是 graph 的新语法，功能更强大
\`\`\`

**选择建议**：
- 垂直流程（如审批流程）→ \`graph TD\`
- 时间线流程（如软件生命周期）→ \`graph LR\`
- 一般推荐使用 \`graph TD\`

### 节点类型
\`\`\`mermaid
%% 1. 方形节点（默认）- 用于普通步骤
A[方形节点]

%% 2. 圆角矩形 - 用于开始/结束
B(圆角矩形)

%% 3. 体育场形 - 用于开始/结束（更圆润）
C([体育场形])

%% 4. 菱形 - 用于判断/决策
D{判断条件?}

%% 5. 圆形 - 用于连接点
E((圆形))

%% 6. 平行四边形 - 用于输入/输出
F[/输入输出/]
G[\\输出数据\\]

%% 7. 梯形 - 用于手动操作
H[/梯形\\]
\`\`\`

**使用建议**：
- 起点/终点：圆角矩形 \`()\` 或体育场形 \`([])\`
- 普通步骤：方形 \`[]\`
- 判断分支：菱形 \`{}\`

### 连接线类型
\`\`\`mermaid
%% 1. 实线箭头（最常用）
A --> B

%% 2. 虚线箭头
A -.-> B

%% 3. 粗线箭头
A ==> B

%% 4. 带文字的箭头
A -->|成功| B
A -->|失败| C

%% 5. 无箭头实线
A --- B

%% 6. 链式连接
A --> B --> C --> D
\`\`\`

**使用建议**：
- 主要流程：实线箭头 \`-->\`
- 条件分支：带标签箭头 \`-->|条件|\`
- 异常流程：虚线箭头 \`-.-> \`

## 生成示例

### 示例 1: 基础登录流程（简单场景）
**用户需求**：用户登录流程，包含验证和错误处理

**生成代码**：
\`\`\`mermaid
graph TD
    start([开始]) --> input[输入用户名密码]
    input --> validate{验证}
    validate -->|成功| success[登录成功]
    validate -->|失败| error[显示错误信息]
    error --> input
    success --> end([结束])
\`\`\`

**关键点**：
- 使用 \`{}\` 表示判断节点
- 条件分支用 \`|文字|\` 标注
- 失败路径可以回到输入步骤形成循环
- 起点和终点使用圆角矩形 \`([])\`

### 示例 2: 订单处理流程（中等复杂度）
**用户需求**：电商订单处理流程，包括库存检查、支付、发货

**生成代码**：
\`\`\`mermaid
graph TD
    start([开始]) --> receive[接收订单]
    receive --> checkStock{检查库存}

    checkStock -->|库存充足| checkPayment{检查支付}
    checkStock -->|库存不足| notifyOut[通知缺货]
    notifyOut --> end([结束])

    checkPayment -->|已支付| ship[发货]
    checkPayment -->|未支付| waitPayment[等待支付]
    waitPayment --> timeout{超时?}
    timeout -->|是| cancel[取消订单]
    timeout -->|否| checkPayment

    ship --> updateInventory[更新库存]
    updateInventory --> notifySuccess[通知发货成功]
    notifySuccess --> end

    cancel --> end
\`\`\`

**关键点**：
- 多个判断节点组成复杂流程
- 包含循环逻辑（等待支付 → 检查支付）
- 多个出口路径汇聚到同一个结束节点
- 节点 ID 使用有意义的英文命名

### 示例 3: 审批流程（高级场景，含样式）
**用户需求**：多级审批流程，部门经理和总经理两级审批

**生成代码**：
\`\`\`mermaid
graph TD
    start([提交申请]) --> deptReview{部门经理审批}

    deptReview -->|通过| ceoReview{总经理审批}
    deptReview -->|拒绝| reject[申请被拒绝]

    ceoReview -->|通过| approve[申请通过]
    ceoReview -->|拒绝| reject

    reject --> end([结束])
    approve --> end

    %% 样式定义
    classDef successStyle fill:#90EE90,stroke:#333,stroke-width:2px
    classDef rejectStyle fill:#FFB6C1,stroke:#333,stroke-width:2px
    classDef processStyle fill:#87CEEB,stroke:#333,stroke-width:2px

    class approve successStyle
    class reject rejectStyle
    class deptReview,ceoReview processStyle
\`\`\`

**关键点**：
- 使用 \`classDef\` 定义样式类
- 使用 \`class\` 将样式应用到节点
- 不同状态使用不同颜色（通过/拒绝/审批中）
- 多条路径汇聚到同一个结束节点

## 常见错误

### 错误 1: 节点 ID 使用中文
**❌ 错误写法**：
\`\`\`mermaid
graph TD
    开始 --> 结束
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
graph TD
    start[开始] --> end[结束]
\`\`\`

**原因**：Mermaid 节点 ID 必须是英文字母或数字，中文会导致渲染失败。中文应作为节点标签放在 \`[]\` 中。

### 错误 2: 判断节点未使用菱形语法
**❌ 错误写法**：
\`\`\`mermaid
graph TD
    A[判断条件] --> B
    A --> C
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
graph TD
    A{判断条件?} --> B
    A --> C
\`\`\`

**原因**：判断节点应该使用 \`{}\` 语法，视觉上呈现为菱形，更清晰地表示这是一个决策点。

### 错误 3: 条件分支没有标签
**❌ 错误写法**：
\`\`\`mermaid
graph TD
    A{验证} --> B[成功路径]
    A --> C[失败路径]
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
graph TD
    A{验证} -->|成功| B[成功路径]
    A -->|失败| C[失败路径]
\`\`\`

**原因**：判断节点的分支应该明确标注条件，使用 \`-->|条件|\` 语法，让流程更清晰。

### 错误 4: 流程没有明确的结束点
**❌ 错误写法**：
\`\`\`mermaid
graph TD
    A[开始] --> B{判断}
    B -->|是| C[处理]
    B -->|否| D[其他处理]
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
graph TD
    A([开始]) --> B{判断}
    B -->|是| C[处理]
    B -->|否| D[其他处理]
    C --> end([结束])
    D --> end
\`\`\`

**原因**：完整的流程图应该有明确的起点和终点，所有路径最终都应该汇聚到结束节点。

### 错误 5: 箭头方向混乱
**❌ 错误写法**：
\`\`\`mermaid
graph TD
    A --> B
    C --> B
    B --> D
    A --> D    %% 跳过中间节点，流程不清晰
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
graph TD
    A[步骤1] --> B[步骤2]
    C[步骤3] --> B
    B --> D[步骤4]
\`\`\`

**原因**：流程图应该清晰地表示步骤之间的顺序关系，避免跳跃式的连接导致流程混乱。

### 错误 6: 特殊字符未转义
**❌ 错误写法**：
\`\`\`mermaid
graph TD
    A[用户[管理员]] --> B
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
graph TD
    A["用户[管理员]"] --> B[下一步]
\`\`\`

**原因**：节点标签中包含 \`[]\` 等特殊字符时，整个标签需要用双引号包裹。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **图表声明正确**：使用 \`graph TD/LR\` 或 \`flowchart TD/LR\`
- [ ] **节点 ID 合法**：所有节点 ID 使用英文字母或数字，无中文
- [ ] **判断节点使用菱形**：所有决策点使用 \`{}\` 语法
- [ ] **条件分支有标签**：判断节点的分支使用 \`-->|条件|\` 标注
- [ ] **流程完整**：有明确的起点和终点，无断链
- [ ] **无死循环**：所有循环都有退出条件
- [ ] **连接线方向正确**：箭头方向清晰，流程逻辑合理
- [ ] **代码可渲染**：语法正确，可以直接通过 Kroki 渲染

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1150 tokens
 *
 * 分配明细:
 * - 专家视角: 120 tokens
 * - 核心语法: 280 tokens
 * - 生成示例: 500 tokens（3个示例，每个约 160-170 tokens）
 * - 常见错误: 200 tokens（6个错误，每个约 30-35 tokens）
 * - 检查清单: 50 tokens
 */
