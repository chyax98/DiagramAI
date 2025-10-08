# Graphviz 提示词模块

> 基于 DEPTH 方法论的三层提示词架构
> 版本：v1.0
> 创建日期：2025-01-08

---

## 📋 目录结构

```
graphviz/
├── README.md          # 本文档
├── common.ts          # L2: Graphviz/DOT 语言规范
├── digraph.ts         # L3: 有向图生成要求
├── graph.ts           # L3: 无向图生成要求
└── index.ts           # 模块导出
```

---

## 🎯 架构说明

### L2: 语言规范 (`common.ts`)

**作用**：定义 Graphviz DOT 语言的通用规则和最佳实践

**内容**：
- 基础语法（digraph、graph、节点、边）
- 命名规范（节点 ID、标签）
- 样式系统（全局样式、布局引擎）
- 子图语法（cluster、rank）
- 常见错误（3 个）
- Kroki 渲染注意事项

**Token 预算**：480 tokens

---

### L3: 图表类型

#### 1. Digraph - 有向图 (`digraph.ts`)

**用途**：流程图、状态机、依赖关系图、组织结构、数据流

**内容**：
- 专家视角（流程设计、DOT 工程师、可视化设计师）
- 核心语法（图声明、节点、边、子图）
- 生成示例（3 个）
  - 订单处理流程（基础）
  - 系统架构依赖图（中等）
  - 状态机（高级）
- 常见错误（6 个）
- 生成检查清单（9 项）

**Token 预算**：1180 tokens

**特点**：
- 使用 `digraph` 和 `->`
- 支持层次化布局（dot）
- 适合表达方向性关系

#### 2. Graph - 无向图 (`graph.ts`)

**用途**：网络拓扑、社交关系、协作关系、知识图谱

**内容**：
- 专家视角（关系设计、DOT 工程师、网络可视化）
- 核心语法（图声明、节点、边、布局引擎）
- 生成示例（3 个）
  - 办公室网络拓扑（基础）
  - 社交网络关系（中等）
  - 知识图谱（高级）
- 常见错误（6 个）
- 生成检查清单（9 项）

**Token 预算**：1170 tokens

**特点**：
- 使用 `graph` 和 `--`
- 支持多种布局引擎（neato、circo、fdp、twopi）
- 适合表达对称关系

---

## 📊 布局引擎选择指南

### 有向图（Digraph）

| 布局引擎 | 适用场景 | 特点 |
|---------|---------|------|
| **dot** | 流程图、依赖图 | 层次化布局，边保持同一方向 |
| **neato** | 有向网络 | 弹簧模型，适合小型图 |

### 无向图（Graph）

| 布局引擎 | 适用场景 | 特点 |
|---------|---------|------|
| **neato** | 社交网络、关系图 | 弹簧模型，节点均匀分布 |
| **circo** | 网络拓扑 | 环形布局，中心辐射 |
| **fdp** | 大型复杂图 | 力导向布局 |
| **twopi** | 知识图谱 | 径向布局，需指定根节点 |

---

## 🎨 样式设计规范

### 节点形状语义

| 形状 | 语义 | 使用场景 |
|------|------|----------|
| `box` | 矩形 | 普通步骤、模块、组件 |
| `circle` | 圆形 | 状态、人物、概念 |
| `ellipse` | 椭圆 | 默认形状、终端设备 |
| `diamond` | 菱形 | 判断、特殊设备 |
| `doublecircle` | 双圆 | 结束状态、最终节点 |
| `cylinder` | 圆柱 | 数据库、存储 |
| `plaintext` | 纯文本 | 标注、说明 |

### 颜色使用建议

| 颜色类型 | 色值示例 | 语义 |
|---------|---------|------|
| 蓝色系 | `#2196f3`, `#e3f2fd` | 主流程、正常状态 |
| 绿色系 | `#4caf50`, `#c8e6c9` | 成功、开始、活跃 |
| 红色系 | `#f44336`, `#ffcdd2` | 错误、结束、警告 |
| 黄色系 | `#fff9c4` | 等待、判断、提示 |
| 橙色系 | `#ff6f00` | 重要、核心、强调 |

---

## ✅ 质量自评标准

### 框架完整性（8/10 分以上）

- [ ] 包含专家视角
- [ ] 核心语法完整
- [ ] 示例覆盖 3 个复杂度
- [ ] 常见错误 ≥ 6 个
- [ ] 检查清单完整

### 示例质量（9/10 分以上）

- [ ] 所有示例可直接渲染
- [ ] 覆盖基础、中等、高级场景
- [ ] 包含详细的关键点说明
- [ ] 代码注释清晰

### 错误覆盖（8/10 分以上）

- [ ] 包含语法错误
- [ ] 包含语义错误
- [ ] 包含布局错误
- [ ] 每个错误有对比示例
- [ ] 原因说明清晰

### Token 效率（7/10 分以上）

- [ ] L2 ≤ 500 tokens
- [ ] L3 ≤ 1200 tokens
- [ ] 无冗余内容
- [ ] 表达简洁清晰

---

## 🚀 使用方法

### 在代码中引用

```typescript
import {
  GRAPHVIZ_COMMON_PROMPT,
  GRAPHVIZ_DIGRAPH_PROMPT,
  GRAPHVIZ_GRAPH_PROMPT,
} from '@/lib/constants/prompts/graphviz';

// 组合 L1 + L2 + L3
const fullPrompt = `
${UNIVERSAL_PROMPT}

${GRAPHVIZ_COMMON_PROMPT}

${GRAPHVIZ_DIGRAPH_PROMPT}
`;
```

### 测试示例

```typescript
// 测试有向图生成
const userInput = "绘制一个订单处理流程，从下单到完成";
const response = await generateDiagram(fullPrompt, userInput);

// 预期输出：完整的 Graphviz Digraph 代码
```

---

## 📚 参考资源

### 官方文档

- [Graphviz 官方网站](https://graphviz.org/)
- [DOT 语言规范](https://graphviz.org/doc/info/lang.html)
- [布局引擎文档](https://graphviz.org/docs/layouts/)
- [属性参考](https://graphviz.org/doc/info/attrs.html)

### Kroki 集成

- [Kroki 官方文档](https://kroki.io/)
- [Graphviz 在 Kroki 中的支持](https://kroki.io/#support)

### 项目文档

- [提示词编写规范](../../../../claudedocs/PROMPT_WRITING_GUIDE.md)
- [团队任务分配](../../../../claudedocs/PROMPT_TEAM_TASKS.md)

---

## 📝 更新日志

### v1.0 (2025-01-08)

- ✅ 创建 L2 语言规范（common.ts）
- ✅ 创建 L3 有向图（digraph.ts）
- ✅ 创建 L3 无向图（graph.ts）
- ✅ 完成模块导出（index.ts）
- ✅ 编写项目文档（README.md）

---

## 👥 贡献者

- **开发者**：DiagramAI Team
- **审核者**：待审核
- **版本**：v1.0

---

**注意**：本模块严格遵循 DEPTH 方法论和项目提示词编写规范。

