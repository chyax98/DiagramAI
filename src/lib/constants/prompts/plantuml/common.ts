/**
 * L2: PlantUML 语言规范
 *
 * 作用：定义 PlantUML 通用语法和最佳实践
 * Token 预算：200-500 tokens
 *
 * 适用范围：所有 PlantUML 图表类型共享
 *
 * @example
 * 与 L1 通用规范和 L3 图表要求组合使用
 */

export const PLANTUML_LANGUAGE_PROMPT = `
# PlantUML 语言规范

## 核心语法

PlantUML 是一种基于文本描述的 UML 图表语言，支持多种图表类型。

### 通用规则

1. **图表声明**
   - 所有图表必须以 \`@startuml\` 开始
   - 所有图表必须以 \`@enduml\` 结束

2. **注释语法**
   - 单行注释：使用 \`'\` 开头
   - 多行注释：使用 \`/' ... '/\` 包裹

3. **元素命名**
   - **元素 ID**: 使用英文字母、数字、下划线
   - **标签/描述**: 使用双引号包裹，可包含中文和特殊字符
   - **别名**: 使用 \`as\` 关键字定义简短别名

**示例**：
\`\`\`plantuml
@startuml
' 这是单行注释

/' 
这是多行注释
可以跨越多行
'/

actor "用户" as User
usecase "登录系统" as UC1
User --> UC1
@enduml
\`\`\`

## 样式系统

### skinparam 样式定制

PlantUML 使用 \`skinparam\` 命令定制图表外观：

\`\`\`plantuml
@startuml
skinparam backgroundColor #EEEBDC
skinparam handwritten false
skinparam sequenceParticipantBackgroundColor #87CEEB
skinparam sequenceArrowColor #333333
@enduml
\`\`\`

### 内联样式

可以直接为元素添加颜色：

\`\`\`plantuml
@startuml
Alice -> Bob #red : 红色箭头
Alice -> Bob #blue;line.bold : 蓝色粗线箭头
@enduml
\`\`\`

## 渲染注意事项

1. **Kroki 兼容性**
   - Kroki 对语法错误零容忍，必须确保语法完全正确
   - 特殊字符（如 []、{}、()）在标签中必须用双引号包裹

2. **避免实验性语法**
   - 使用稳定的、广泛支持的语法
   - 避免使用过新的实验性特性

3. **方向控制**
   - 使用 \`left to right direction\` 设置水平布局
   - 使用 \`top to bottom direction\` 设置垂直布局（默认）

## 常见错误

### 错误 1: 忘记图表声明
❌ **错误写法**：
\`\`\`plantuml
Alice -> Bob: Hello
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
Alice -> Bob: Hello
@enduml
\`\`\`

**原因**：PlantUML 必须使用 \`@startuml\` 和 \`@enduml\` 包裹所有图表内容。

### 错误 2: 特殊字符未转义
❌ **错误写法**：
\`\`\`plantuml
@startuml
Alice -> Bob: Hello [World]
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
Alice -> Bob: "Hello [World]"
@enduml
\`\`\`

**原因**：方括号等特殊字符在 PlantUML 中有特殊含义，必须用双引号包裹。

### 错误 3: 元素 ID 使用中文
❌ **错误写法**：
\`\`\`plantuml
@startuml
用户 -> 系统: 请求
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
User -> System: 请求
' 或使用别名
actor "用户" as User
actor "系统" as System
User -> System: 请求
@enduml
\`\`\`

**原因**：元素 ID 应使用英文，中文应作为标签放在双引号中，或使用 \`as\` 定义别名。
`;

/**
 * Token 估算: 约 450 tokens
 *
 * 分配明细:
 * - 核心语法: 150 tokens
 * - 样式系统: 100 tokens
 * - 渲染注意事项: 100 tokens
 * - 常见错误: 100 tokens
 */

