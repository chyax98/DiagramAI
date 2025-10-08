/**
 * L2: Mermaid 语言通用提示词
 *
 * 作用：定义 Mermaid 语言的通用语法规范和最佳实践
 * Token 预算：200-500 tokens
 * 适用范围：所有 Mermaid 图表类型（flowchart、sequence、class 等）
 *
 * 注：此层可选，如果语法规范可以在 L3 中简洁说明则可省略
 */

export const MERMAID_LANGUAGE_PROMPT = `
# Mermaid 语言通用规范

## 语法要求

### 基础语法
- **注释**: 使用 \`%%\` 开头的单行注释
  \`\`\`
  %% 这是一个注释
  \`\`\`

- **分隔符**: 指令之间使用换行分隔，不需要分号

- **字符串**: 节点文本支持中文，但避免使用特殊字符 \`[]\` \`{}\` \`()\`

## 命名规范

### 节点 ID 命名
- ✅ **必须使用**：英文字母（A-Z, a-z）或数字（0-9）
- ✅ **可以使用**：下划线 \`_\` 和连字符 \`-\`
- ❌ **禁止使用**：中文、空格、特殊符号

**示例**：
\`\`\`
✅ 正确: A, start, node1, user_login, api-call
❌ 错误: 开始, user login, @api, node#1
\`\`\`

### 节点标签
- 使用中文描述，清晰表达节点含义
- 避免过长文本，建议 ≤ 15 个汉字
- 特殊字符需要用引号包裹: \`"包含 [] 的文本"\`

## 样式系统

### 通用样式语法
\`\`\`mermaid
%% 单个节点样式
style nodeId fill:#f9f,stroke:#333,stroke-width:2px

%% 样式类（可复用）
classDef className fill:#f96,stroke:#333
class node1,node2 className
\`\`\`

### 常用样式属性
- \`fill\`: 填充颜色 (如: #f9f, #bbf, lightblue)
- \`stroke\`: 边框颜色
- \`stroke-width\`: 边框宽度
- \`color\`: 文字颜色

## 常见错误

### 错误 1: 节点 ID 使用中文
**❌ 错误**:
\`\`\`mermaid
graph TD
    开始 --> 结束
\`\`\`

**✅ 正确**:
\`\`\`mermaid
graph TD
    start[开始] --> end[结束]
\`\`\`

**原因**: 节点 ID 必须是英文，中文作为标签放在 \`[]\` 中

### 错误 2: 特殊字符未转义
**❌ 错误**:
\`\`\`mermaid
graph TD
    A[用户[管理员]] --> B
\`\`\`

**✅ 正确**:
\`\`\`mermaid
graph TD
    A["用户[管理员]"] --> B[下一步]
\`\`\`

**原因**: 标签中包含 \`[]\` 等特殊字符时，整个标签需要用引号包裹

### 错误 3: 箭头语法错误
**❌ 错误**:
\`\`\`mermaid
graph TD
    A -> B    %% 单箭头语法错误
\`\`\`

**✅ 正确**:
\`\`\`mermaid
graph TD
    A --> B   %% 使用双箭头
\`\`\`

**原因**: Mermaid flowchart 使用 \`-->\` 表示箭头，不是 \`->\`

### 错误 4: 缺少节点声明
**❌ 错误**:
\`\`\`mermaid
graph TD
    A --> B --> C
    B --> D[决策]    %% B 只在箭头中出现，没有明确样式
\`\`\`

**✅ 正确**:
\`\`\`mermaid
graph TD
    A[开始] --> B{判断}
    B --> C[路径1]
    B --> D[路径2]
\`\`\`

**原因**: 虽然可以隐式声明节点，但明确声明节点类型（如判断节点用 \`{}\`）更清晰

### 错误 5: 语法顺序混乱
**❌ 错误**:
\`\`\`mermaid
graph TD
    A --> B
    style A fill:#f9f
    A --> C    %% 在样式后又添加连接
\`\`\`

**✅ 建议**:
\`\`\`mermaid
graph TD
    A[节点A] --> B[节点B]
    A --> C[节点C]

    %% 所有节点和连接定义完后，再统一设置样式
    style A fill:#f9f
\`\`\`

**原因**: 保持代码结构清晰，先定义结构，后设置样式
`;

/**
 * Token 估算: 约 450 tokens
 *
 * 分配明细:
 * - 语法要求: 80 tokens
 * - 命名规范: 100 tokens
 * - 样式系统: 70 tokens
 * - 常见错误: 200 tokens
 */
