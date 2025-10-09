/**
 * L2: Nomnoml 语言规范
 *
 * 作用：定义 Nomnoml 图表语言的通用语法和最佳实践
 * Token 预算：200-500 tokens
 * 适用范围：所有 Nomnoml 图表类型（类图、组件图、架构图）
 *
 * Nomnoml 是一个轻量级的 UML 图表工具，使用简洁的文本语法
 * 来绘制类图、组件图和架构图等，语法直观易学。
 */

export const NOMNOML_COMMON_PROMPT = `
# Nomnoml 语言通用规范

## 语法基础

### 1. 基本结构
\`\`\`nomnoml
[ClassA] -> [ClassB]    // 最简单的关联
\`\`\`

### 2. 类的完整定义
\`\`\`nomnoml
[ClassName|
  attribute1: Type;
  attribute2: Type
|
  method1(): ReturnType;
  method2(param: Type): void
]
\`\`\`

**格式**：\`[名称| 属性区 | 方法区]\`
- 使用 \`|\` 分隔三个区域
- 属性和方法用分号 \`;\` 或换行分隔

### 3. 关联类型（最常用）

\`\`\`nomnoml
[A] -> [B]              // 关联（Association）
[A] --> [B]             // 依赖（Dependency）
[A] -:> [B]             // 继承/泛化（Generalization），A 继承 B
[A] <:- [B]             // 继承/泛化，B 继承 A
[A] --:> [B]            // 实现（Implementation）
[A] +-> [B]             // 组合（Composition），强拥有关系
[A] o-> [B]             // 聚合（Aggregation），弱拥有关系
[A] -- [B]              // 注释连接
[A] -/- [B]             // 隐藏连接
\`\`\`

### 4. 分类器类型（常用）

\`\`\`nomnoml
[NormalClass]                    // 普通类
[<abstract> AbstractClass]       // 抽象类
[<instance> objectInstance]      // 实例
[<package> com.example]          // 包
[<frame> SystemFrame]            // 框架
[<database> Database]            // 数据库
[<note> This is a note]          // 注释

// 组件图专用
[<socket> Socket]                // 套接字
[<lollipop> Interface]           // 棒棒糖接口

// 流程图专用
[<start> Start]                  // 开始
[<end> End]                      // 结束
[<state> State]                  // 状态
[<choice> Choice]                // 选择

// 用例图专用
[<actor> User]                   // 角色
[<usecase> Login]                // 用例
\`\`\`

### 5. 指令（样式控制）

\`\`\`nomnoml
#direction: down              // 布局方向：down（默认）| right
#stroke: #333333              // 线条颜色
#fill: #ffffff                // 填充颜色
#background: #f5f5f5          // 背景颜色
#fontSize: 12                 // 字体大小
#spacing: 40                  // 节点间距
#padding: 8                   // 节点内边距
\`\`\`

## 命名规范

### 类名和属性
- **类名**：使用 PascalCase（如 \`Person\`、\`OrderService\`）
- **属性**：使用 camelCase（如 \`name\`、\`phoneNumber\`）
- **方法**：使用 camelCase（如 \`getName()\`、\`setAge()\`）
- **包名**：使用点分隔的小写（如 \`com.example.service\`）

### 关联标签
- 保持简洁，使用动词或名词
- 示例：\`owns\`、\`uses\`、\`depends on\`

## 常见错误

### 错误 1: 分隔符使用错误
**❌ 错误**：使用逗号分隔属性
\`\`\`nomnoml
[Person| name: String, age: int]
\`\`\`

**✅ 正确**：使用分号或换行
\`\`\`nomnoml
[Person| name: String; age: int]
\`\`\`

### 错误 2: 继承方向错误
**❌ 错误**：箭头方向混乱
\`\`\`nomnoml
[Parent] <:- [Child]    // 容易混淆
\`\`\`

**✅ 正确**：子类指向父类
\`\`\`nomnoml
[Child] -:> [Parent]    // 清晰：Child 继承 Parent
\`\`\`

### 错误 3: 注释位置错误
**❌ 错误**：行中注释
\`\`\`nomnoml
[ClassA] -> [ClassB] // 不支持行中注释
\`\`\`

**✅ 正确**：注释必须在行首
\`\`\`nomnoml
// 正确的注释方式
[ClassA] -> [ClassB]
\`\`\`

### 错误 4: 嵌套结构缩进混乱
**❌ 错误**：嵌套没有缩进
\`\`\`nomnoml
[Engine|
[Cylinder] -> [Piston]
]
\`\`\`

**✅ 正确**：使用缩进增强可读性
\`\`\`nomnoml
[Engine|
  [Cylinder] -> [Piston]
  [Cylinder] -> [Valve]
]
\`\`\`

## 生成原则

1. **简洁优先**：Nomnoml 的优势是简洁，避免过度复杂
2. **方向一致**：使用 \`#direction\` 统一布局方向
3. **类型标签**：合理使用 \`<abstract>\`、\`<package>\` 等标签
4. **关联清晰**：优先使用标准 UML 关联类型
5. **注释辅助**：对复杂关系使用 \`<note>\` 标签说明
`;

/**
 * Token 估算: 约 450 tokens
 *
 * 分配明细:
 * - 语法基础: 200 tokens
 * - 命名规范: 50 tokens
 * - 常见错误: 150 tokens
 * - 生成原则: 50 tokens
 */

