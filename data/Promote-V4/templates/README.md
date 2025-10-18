# Promote-V4 模板使用说明

## 📋 概述

本目录包含 Promote-V4 的 TOML 模板文件,用于定义 AI 图表生成的提示词规范。

## 📁 模板文件

| 文件 | 层级 | 说明 | 示例语言/类型 |
|------|------|------|--------------|
| `L1.template.toml` | 通用层 | 所有图表共享的基础规范 | 通用 |
| `L2.template.toml` | 语言层 | 特定语言的通用规范 | Mermaid |
| `L3.template.toml` | 类型层 | 特定图表类型的规范 | Mermaid Flowchart |

## 🏗️ 三层架构

```
L1 (通用层)
  ↓ 继承
L2 (语言层)
  ↓ 继承
L3 (类型层)
```

**最终 AI 收到的内容**: L1 + L2 + L3 (TOML 格式直接拼接)

## 📐 固定 Section 结构

### L1 模板 (6 个 Section)

```toml
[meta]              # 元数据
[D_role]            # 角色定义 (base_roles)
[E_constraints]     # 约束条件 (通用约束)
[P_process]         # 流程规范 (通用流程)
[H_quality]         # 质量标准 (通用标准)
```

### L2 模板 (5 个 Section)

```toml
[meta]              # 元数据 (language)
[D_role]            # 角色定义 (additional_roles)
[E_constraints]     # 约束条件 (语言特定)
[P_process]         # 流程规范 (语言特定)
[H_quality]         # 质量标准 (语言特定)
```

### L3 模板 (5 个 Section)

```toml
[meta]              # 元数据 (language + diagram_type)
[D_role]            # 角色定义 (additional_roles)
[E_constraints]     # 约束条件 (类型特定)
[P_process]         # 流程规范 (类型特定)
[H_quality]         # 质量标准 (类型特定)
```

## 🔑 关键字段说明

### [meta] - 元数据

| 字段 | L1 | L2 | L3 | 说明 |
|------|----|----|----|----|
| `level` | ✅ | ✅ | ✅ | 层级标识 ("L1"/"L2"/"L3") |
| `language` | ❌ | ✅ | ✅ | 语言名称 (必须在 RENDER_LANGUAGES 中) |
| `diagram_type` | ❌ | ❌ | ✅ | 图表类型 (必须在 LANGUAGE_DIAGRAM_TYPES 中) |
| `version` | ✅ | ✅ | ✅ | 版本号 (语义化版本) |
| `description` | ✅ | ✅ | ✅ | 简短描述 |

### [D_role] - 角色定义

| 字段 | L1 | L2 | L3 | 说明 |
|------|----|----|----|----|
| `target_task` | ✅ | ❌ | ❌ | 总体目标描述 (仅 L1) |
| `base_roles` | ✅ | ❌ | ❌ | 基础角色列表 (仅 L1,至少 3 个) |
| `additional_roles` | ❌ | ✅ | ✅ | 附加角色列表 (L2 至少 2 个,L3 至少 1 个) |

### [E_constraints], [P_process], [H_quality] - 内容段落

| 字段 | 类型 | 最小数量 | 说明 |
|------|------|----------|------|
| `items` | 数组 | 见下表 | 内容条目列表 |

**最小数量要求**:
- L1: E(5条), P(3条), H(3条)
- L2: E(3条), P(2条), H(2条)
- L3: E(5条), P(3条), H(2条)

## 🚀 使用指南

### 1. 创建新的语言 (L2)

**步骤**:

1. 复制 `L2.template.toml`
2. 重命名为 `../data/L2/{language}.toml`
3. 修改 `[meta].language` 为目标语言
4. 修改 `[D_role].additional_roles` 为语言特定角色
5. 修改 `[E_constraints].items` 为语言特定约束
6. 修改 `[P_process].items` 为语言特定流程
7. 修改 `[H_quality].items` 为语言特定标准

**示例** (PlantUML):

```toml
[meta]
level = "L2"
language = "plantuml"
version = "1.0.0"

[D_role]
additional_roles = [
  "PlantUML 语法专家",
  "UML 建模专家"
]

[E_constraints]
items = [
  "必须使用 PlantUML 官方语法",
  "使用 @startuml/@enduml 包裹",
  "节点关系必须明确 (继承、组合、聚合、依赖)",
]
# ... 更多内容
```

### 2. 创建新的图表类型 (L3)

**步骤**:

1. 复制 `L3.template.toml`
2. 重命名为 `../data/L3/{language}/{diagram_type}.toml`
3. 修改 `[meta].language` 和 `diagram_type`
4. 确保 `diagram_type` 在 `src/lib/constants/diagram-types.ts` 的 `LANGUAGE_DIAGRAM_TYPES` 中存在
5. 修改各 Section 为类型特定内容

**示例** (Mermaid Sequence Diagram):

```toml
[meta]
level = "L3"
language = "mermaid"
diagram_type = "sequence"
version = "1.0.0"

[D_role]
additional_roles = [
  "时序图专家",
  "交互设计师"
]

[E_constraints]
items = [
  "必须使用 sequenceDiagram 语法",
  "参与者必须明确声明 (participant)",
  "消息传递使用 ->>、-->> 等语法",
  "支持激活/失活 (activate/deactivate)",
  "支持循环、分支、并行 (loop/alt/par)",
]
# ... 更多内容
```

### 3. 验证 TOML 语法

**在线验证**:
- https://www.toml-lint.com/
- https://toml-to-json.orchard.blog/

**命令行验证** (需要安装 `toml-cli`):
```bash
npm install -g @iarna/toml
toml verify data/L2/mermaid.toml
```

## 📚 字段编写最佳实践

### 1. 约束条件 (E_constraints)

✅ **好的约束**:
```toml
items = [
  "必须使用 flowchart TD/LR 语法,不得使用已废弃的 graph 语法",
  "节点 ID 必须唯一且语义化,使用字母、数字、下划线",
]
```

❌ **不好的约束**:
```toml
items = [
  "代码要好",  # 太笼统
  "flowchart",  # 不完整
]
```

### 2. 流程规范 (P_process)

✅ **好的流程**:
```toml
items = [
  "1. 识别流程要素: 起点、终点、关键步骤、决策点",
  "2. 提取流程逻辑: 主流程、分支流程、异常流程",
]
```

❌ **不好的流程**:
```toml
items = [
  "先分析",  # 太简单
  "然后写代码",  # 不具体
]
```

### 3. 质量标准 (H_quality)

✅ **好的标准**:
```toml
items = [
  "流程逻辑完整性: 所有路径都有终点,无悬空分支",
  "决策节点清晰度: 使用菱形,判断条件明确",
]
```

❌ **不好的标准**:
```toml
items = [
  "代码质量好",  # 不可验证
  "流程清晰",  # 太主观
]
```

## ⚠️ 常见错误

### 1. TOML 语法错误

❌ **错误**: 忘记三引号
```toml
items = [
  "第一行
  第二行"  # 语法错误!
]
```

✅ **正确**: 使用三引号
```toml
items = [
  """
  第一行
  第二行
  """
]
```

### 2. 字段命名错误

❌ **错误**: 使用错误的字段名
```toml
[D_role]
roles = [...]  # 错误! 应该是 base_roles 或 additional_roles
```

✅ **正确**:
```toml
[D_role]
base_roles = [...]  # L1
additional_roles = [...]  # L2/L3
```

### 3. 层级不对齐

❌ **错误**: L3 的 diagram_type 不在前端定义中
```toml
[meta]
language = "mermaid"
diagram_type = "custom_flowchart"  # 错误! 前端没有这个类型
```

✅ **正确**: 使用前端已定义的类型
```toml
[meta]
language = "mermaid"
diagram_type = "flowchart"  # 正确! 在 LANGUAGE_DIAGRAM_TYPES 中
```

## 🔗 相关文档

- 完整编写指南: `../docs/TOML_TEMPLATE_GUIDE.md`
- 架构说明: `../docs/V4_ARCHITECTURE.md`
- V3 迁移指南: `../docs/MIGRATION_V3_TO_V4.md`

## 📞 联系方式

如有问题,请查阅详细文档或提交 Issue。
