# TOML 文件创建任务标准模板

## 🎯 任务目标

为指定的图表语言创建缺失的 L3 TOML Prompt 文件。

---

## 📂 输入信息

每个任务包含以下信息：

1. **语言名称**: 如 `mermaid`, `plantuml`, `graphviz` 等
2. **需要创建的类型列表**: 具体的图表类型值（如 `gitgraph`, `activity` 等）
3. **类型定义**: 每个类型的 label 和 description（从前端获取）
4. **输出目录**: `Promote-V4/data/L3/{语言名称}/`

---

## 📝 执行步骤

### 步骤 1: 准备工作

1. 阅读模板文件: `Promote-V4/templates/L3.template.toml`
2. 阅读参考文件: `Promote-V4/data/L3/{语言名称}/` 下的现有文件（至少读 2 个）
3. 理解 TOML 语法规范，特别是反斜杠转义规则

### 步骤 2: 创建文件

对于每个需要创建的图表类型：

1. **文件路径**: `Promote-V4/data/L3/{语言名称}/{类型值}.toml`

2. **Metadata 填写**:
   ```toml
   [meta]
   level = "L3"
   version = "1.0.0"
   description = "L3: {语言名称} - {类型 label} 图表生成规范"
   author = "DiagramAI Team"
   created_at = "2025-10-19"
   updated_at = "2025-10-19"
   language = "{语言名称}"
   diagram_type = "{类型值}"
   ```

3. **内容填写**（严格按照 L3 模板的 5 个 Section）:

   **[D_role]** - 角色定义:
   - `additional_roles`: 3-5 条，针对该图表类型的专业角色描述

   **[E_constraints]** - 约束条件:
   - `items`: 7-10 条，包括：
     - 语法约束（基于 {语言名称} 官方语法）
     - 该图表类型的特殊约束
     - 数据合理性约束
     - 可读性约束

   **[P_process]** - 执行流程:
   - `items`: 5-7 条，从需求分析到代码生成的完整流程

   **[H_quality]** - 质量标准:
   - `items`: 4-6 条，覆盖正确性、完整性、可维护性

   **[[use_cases]]** - 使用场景:
   - 至少 3 个真实业务场景
   - 每个场景包含 title, scenario, key_points

4. **语法检查**:
   - 确保所有反斜杠正确转义（`\` → `\\`）
   - 确保所有多行字符串正确格式化
   - 确保数组项以逗号分隔

### 步骤 3: 验证

1. **TOML 语法验证**: 尝试用 `@iarna/toml` 或 Python `tomli` 解析文件
2. **内容完整性**: 检查 5 个必需 Section 都存在
3. **专业性检查**: 确保内容针对该图表类型，不是通用模板

---

## ✅ 验收标准

### 必需标准（Must Have）

- [ ] 所有文件已创建在正确路径
- [ ] 所有文件 TOML 语法正确（可被解析）
- [ ] Metadata 完整且正确
- [ ] 5 个 Section 全部存在且非空
- [ ] 内容使用中文
- [ ] 反斜杠正确转义

### 质量标准（Should Have）

- [ ] `E_constraints.items` 至少 7 条
- [ ] `P_process.items` 至少 5 条
- [ ] `H_quality.items` 至少 4 条
- [ ] `use_cases` 至少 3 个
- [ ] 内容针对性强，非通用模板

### 优秀标准（Nice to Have）

- [ ] 包含真实业务场景示例
- [ ] 包含该图表类型的最佳实践
- [ ] 包含常见错误提示

---

## 🚫 禁止事项

1. ❌ **禁止抄袭**: 不要直接复制其他图表类型的内容
2. ❌ **禁止通用化**: 内容必须针对该图表类型，不能太泛化
3. ❌ **禁止遗漏**: 5 个 Section 缺一不可
4. ❌ **禁止英文**: 所有内容使用中文（除了 metadata 的 key）
5. ❌ **禁止语法错误**: TOML 必须能正确解析
6. ❌ **禁止跨任务**: 只创建分配给你的类型，不要处理其他人的

---

## 📊 输出格式

完成后，返回以下报告：

```markdown
## 任务完成报告

### ✅ 已创建文件

1. `{语言名称}/{类型1}.toml` - {类型 label} ({文件大小})
2. `{语言名称}/{类型2}.toml` - {类型 label} ({文件大小})
...

### 📊 统计信息

- 创建文件数: X 个
- 总行数: XXX 行
- 平均文件大小: XX KB

### ✅ 验收检查

- [x] TOML 语法验证通过
- [x] Metadata 完整
- [x] 5 个 Section 完整
- [x] 内容中文化
- [x] 专业性检查通过

### ⚠️ 问题（如有）

- 无问题

### 💡 特殊说明（可选）

- ...
```

---

## 📚 参考资源

1. **L3 模板**: `Promote-V4/templates/L3.template.toml`
2. **前端类型定义**: `src/lib/constants/diagram-types.ts`
3. **现有示例**: `Promote-V4/data/L3/{语言名称}/` 下的任何文件
4. **官方文档**:
   - Mermaid: https://mermaid.js.org/
   - PlantUML: https://plantuml.com/
   - GraphViz: https://graphviz.org/

---

**版本**: 1.0.0
**创建日期**: 2025-10-19
**更新日期**: 2025-10-19
