# GraphViz TOML Conversion Summary

## Task 6: GraphViz (L2 + 核心L3)

### 📋 Overview

Successfully converted GraphViz prompts from TXT to TOML format following the template structure.

### ✅ Files Created

**L2 (Language Level)**:
- `data/L2/graphviz.toml` (6.6 KB)
  - 5 强制规则 (Mandatory Rules)
  - DOT 语言核心约束
  - 布局引擎和样式系统
  - Kroki 兼容性要求

**L3 (Diagram Type Level)**:
- `data/L3/graphviz/flowchart.toml` (6.4 KB)
  - 流程图专用规范
  - 决策节点和分支处理
  - 循环流程控制
  
- `data/L3/graphviz/state.toml` (6.0 KB)
  - 状态机设计规范
  - 状态转换逻辑
  - 初始/终止状态标准
  
- `data/L3/graphviz/tree.toml` (5.7 KB)
  - 树形结构规范
  - 层次关系和对齐
  - 布局引擎选择 (dot/sfdp)
  
- `data/L3/graphviz/er.toml` (6.5 KB)
  - ER 图专业规范
  - Record 节点语法
  - 主键/外键标识
  - 关系基数标注

### 🔑 Key Features

**L2 Common.txt → graphviz.toml**:
- ✅ 5 强制规则完整转换 (连接符匹配、分号结尾、子图命名、ID 引号、配置顺序)
- ✅ DOT 语言核心语法规范
- ✅ 布局引擎选择指南 (dot/neato/circo/fdp/twopi/osage)
- ✅ 高级布局属性 (constraint/rank/weight/ranksep/nodesep)
- ✅ Record 节点、端口系统、HTML Labels 参考引导

**L3 Diagram Types**:

**Flowchart (流程图)**:
- ✅ 决策节点使用菱形 (diamond)
- ✅ 循环流程使用 constraint=false
- ✅ 边权重 (weight) 强调主流程
- ✅ 布局方向选择 (TB/LR)

**State (状态图)**:
- ✅ 初始状态 (shape=point)
- ✅ 终止状态 (shape=doublecircle)
- ✅ 状态转换标注触发事件
- ✅ 颜色语义化 (蓝色系→绿色成功/红色失败)

**Tree (树形结构)**:
- ✅ 强制 TB 布局 (rankdir=TB)
- ✅ 同级节点对齐 (rank=same)
- ✅ 根节点突出显示
- ✅ 布局引擎选择 (dot/sfdp/twopi)
- ✅ 无循环引用约束

**ER (实体关系图)**:
- ✅ 强制使用 shape=record
- ✅ 字段左对齐 (\l)
- ✅ 主键/外键标识 ((PK)/(FK) + 端口)
- ✅ 关系基数标注 (1:1/1:N/M:N)
- ✅ 多对多必须用关联表

### 📊 Content Structure

Each file follows the standard template:

```toml
[meta]
level = "L2" / "L3"
language = "graphviz"
diagram_type = "..."  # L3 only
version = "1.0.0"
description = "..."
author = "DiagramAI Team"
created_at = "2025-10-19"
updated_at = "2025-10-19"

[D_role]
additional_roles = [...]

[E_constraints]
items = [...]  # 5-8 constraints

[P_process]
items = [...]  # 5 process steps

[H_quality]
items = [...]  # 4 quality standards
```

### 🎯 GraphViz Specific Features

**强制规则 (Mandatory Rules)**:
1. ⚠️ digraph 必须使用 `->`，graph 必须使用 `--`
2. ⚠️ 所有语句必须以分号结尾
3. ⚠️ 聚类子图必须以 `cluster_` 开头
4. ⚠️ 节点 ID 包含空格或特殊字符必须用引号
5. ⚠️ rankdir 和全局样式必须在所有节点和边定义之前

**布局引擎**:
- `dot`: 层次化布局 (默认，适合流程图)
- `neato`: 弹簧模型 (适合无向图)
- `circo`: 环形布局 (适合网络拓扑)
- `fdp`: 力导向布局 (适合大型图)
- `twopi`: 径向布局 (适合中心辐射)
- `sfdp`: 大规模树形结构 (100-1000 节点)

**高级属性**:
- `constraint`: 控制边是否影响节点层级
- `rank`: 强制多个节点处于同一水平层级
- `weight`: 控制边的布局优先级
- `ranksep`: 层级间距
- `nodesep`: 节点间距
- `splines`: 边路径形状 (true/false/ortho/polyline/curved)

### ✅ Validation Results

All files validated:
- ✅ TOML syntax correct
- ✅ Required sections present (meta, D_role, E_constraints, P_process, H_quality)
- ✅ Meta fields complete (level, language, diagram_type for L3)
- ✅ Constraint count: 5-8 items (meeting template requirements)
- ✅ Process count: 5 items
- ✅ Quality count: 4 items
- ✅ Additional roles: 2-3 items

### 📝 Content Quality

**From TXT to TOML**:
- ✅ Preserved all 5 强制规则 (Mandatory Rules)
- ✅ Converted detailed syntax explanations to structured constraints
- ✅ Extracted process steps from generation examples
- ✅ Transformed quality checks into validation standards
- ✅ Maintained GraphViz-specific terminology (DOT, digraph, shape=record)
- ✅ Added cross-references to L2 for advanced features

**GraphViz Specifics**:
- ✅ Record 节点语法 (shape=record, \l, |)
- ✅ 端口连接系统 (9 方位端口 + 命名端口)
- ✅ HTML-Like Labels 参考
- ✅ 布局控制高级属性引导
- ✅ 性能优化建议

### 🎨 Diagram Type Characteristics

| Type | Complexity | Target Length | Key Feature |
|------|-----------|---------------|-------------|
| Flowchart | Medium | 2800 | Decision nodes (diamond), constraint=false for loops |
| State | Medium | 2600 | Initial (point), Final (doublecircle), Event labels |
| Tree | Medium | 2700 | TB layout mandatory, rank=same alignment |
| ER | High | 3200 | shape=record, \l alignment, PK/FK ports |

### 🔗 Cross-References

All L3 files include references to L2 common features:
- Record 节点详解 → L2 "Record节点详细说明"
- 端口连接系统 → L2 "端口连接系统"
- HTML Labels → L2 "HTML-Like Labels"
- 布局控制属性 → L2 "布局控制高级属性"
- 注释语法 → L2 "注释语法"
- 常见错误 → L2 "常见错误"

### 📁 File Locations

```
Promote-V4/
├── data/
│   ├── L2/
│   │   └── graphviz.toml (6.6 KB)
│   └── L3/
│       └── graphviz/
│           ├── flowchart.toml (6.4 KB)
│           ├── state.toml (6.0 KB)
│           ├── tree.toml (5.7 KB)
│           └── er.toml (6.5 KB)
```

Total: 5 files, 31.2 KB

### ✨ Next Steps

Task 6 完成！核心文件已创建：
- ✅ L2: graphviz.toml
- ✅ L3: flowchart.toml
- ✅ L3: state.toml
- ✅ L3: tree.toml
- ✅ L3: er.toml

其他非核心类型 (architecture, network) 可以后续补充。

---

**Created**: 2025-10-19  
**Author**: DiagramAI Team  
**Status**: ✅ Complete
