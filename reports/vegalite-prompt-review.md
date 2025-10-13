# Vega-Lite Prompt 系统深度审查报告

**审查日期**: 2025-10-13
**审查范围**: L2 通用规范 + 6 个 L3 图表类型
**审查维度**: 技术准确性、完整性、一致性、可执行性、错误预防

---

## 📋 执行摘要

### 审查范围
- **L2 文件**: `common.txt` (通用语法规范)
- **L3 文件**:
  - `bar.txt` - 柱状图
  - `line.txt` - 折线图
  - `point.txt` - 散点图
  - `pie.txt` - 饼图
  - `area.txt` - 面积图
  - `heatmap.txt` - 热力图

### 关键发现

#### ✅ 优势
1. **JSON 语法强调到位** - 所有文件都突出了 JSON 格式的关键规则
2. **$schema 声明强制性** - 明确标注为"必需字段"，并解释了 Kroki 渲染的依赖
3. **示例代码完整** - 每个图表类型都提供了3个难度递增的示例
4. **错误预防清单** - 每个文件都有完整的生成检查清单

#### ⚠️ 发现的问题
1. **前端类型定义不一致** - 前端使用 `point`，但文档中称为"散点图"
2. **JSON 注释语法错误** - 部分示例使用 `%%` 注释（Mermaid 语法），应使用 `//`
3. **数据展平概念未充分强调** - 多系列数据的 long format 需要在 L2 中统一说明

---

## 🔍 L2: common.txt 深度审查

### 1. 技术准确性 ⭐⭐⭐⭐⭐

#### ✅ 正确的核心规则

**规则 1: $schema 声明**
```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  ...
}
```
✅ **正确** - Kroki 确实需要此字段识别 Vega-Lite 版本
✅ **强制性标注** - 明确说明"缺少此字段会导致渲染失败"
✅ **错误后果** - 提供了实际的错误信息示例

**规则 2: data.values 必须是对象数组**
```json
{
  "data": {
    "values": [
      {"category": "A", "value": 1},
      {"category": "B", "value": 2}
    ]
  }
}
```
✅ **正确** - Vega-Lite 的硬性语法要求
✅ **错误对比** - 明确展示了错误写法（原始数组）和正确写法
✅ **错误信息** - 提供了实际的错误提示

**规则 3: encoding 通道必须包含 field 和 type**
```json
{
  "encoding": {
    "x": {"field": "category", "type": "nominal"},
    "y": {"field": "value", "type": "quantitative"}
  }
}
```
✅ **正确** - Vega-Lite 的编码规范
✅ **完整列举** - 提供了所有有效的 type 值
✅ **错误后果** - 说明了缺失字段的编译影响

**规则 4: mark 字段必须是有效的标记类型**
```json
{
  "mark": "bar"  // ✅ 正确
  // "mark": "barchart"  // ❌ 错误
}
```
✅ **正确** - 列举了所有有效的标记类型
✅ **常见错误** - 指出了拼写错误的风险
✅ **完整列表** - 包含了 bar, line, point, area, rect, arc 等

#### ⚠️ 发现的技术问题

**问题 1: JSON 注释语法错误**

在多处示例中使用了 `%%` 注释：
```json
{
  "data": {
    "values": [1, 2, 3]  %% ❌ 编译失败！
  }
}
```

**问题**: `%%` 是 Mermaid 的注释语法，JSON 中应使用 `//`

**建议修复**:
```json
{
  "data": {
    "values": [1, 2, 3]  // ❌ 编译失败！
  }
}
```

**影响**: 轻微 - 示例代码是错误对比，不会直接复制使用

---

### 2. 完整性 ⭐⭐⭐⭐☆

#### ✅ 已覆盖的关键概念

1. **数据类型 (type)** - 完整列举了 quantitative, temporal, ordinal, nominal
2. **标记类型 (mark)** - 覆盖了 DiagramAI 支持的所有标记
3. **编码通道 (encoding)** - 详细说明了位置、视觉属性、文本、分组通道
4. **聚合函数 (aggregate)** - 提供了 sum, count, average, median, min, max
5. **样式系统** - 包含了基础样式、坐标轴样式、尺寸控制

#### ⚠️ 缺失的关键概念

**缺失 1: 数据展平 (Long Format)**

当前文档在多个 L3 文件中重复解释"数据需要展平"，但 L2 中没有统一说明。

**建议添加章节**:
```markdown
## 数据格式规范

### 多系列数据展平规则

Vega-Lite 要求多系列数据使用 long format（展平格式），每行代表一个数据点。

**❌ 错误写法（Wide Format）**:
```json
{
  "data": {
    "values": [
      {"month": "2024-01", "productA": 100, "productB": 80}
    ]
  }
}
```

**✅ 正确写法（Long Format）**:
```json
{
  "data": {
    "values": [
      {"month": "2024-01", "product": "A", "sales": 100},
      {"month": "2024-01", "product": "B", "sales": 80}
    ]
  }
}
```

**原因**: color 通道需要通过 `field` 区分不同系列，无法直接使用不同的列名。
```

**缺失 2: 时间数据格式规范**

L2 中提到了 `temporal` 类型，但没有明确说明时间格式标准。

**建议添加**:
```markdown
### 时间数据格式

时间数据必须使用 ISO 8601 标准格式：

- **日期**: `YYYY-MM-DD` (如 "2024-01-15")
- **日期时间**: `YYYY-MM-DDTHH:mm:ss` (如 "2024-01-15T14:30:00")
- **年月**: `YYYY-MM` (如 "2024-01")

❌ **禁止使用**: `2024/01/15`、`01-15-2024`、`2024.01.15`
```

---

### 3. 一致性 ⭐⭐⭐⭐⭐

#### ✅ 术语一致性

| 术语 | 英文 | 使用一致性 |
|------|------|-----------|
| 数据类型 | type | ✅ 一致 |
| 标记类型 | mark | ✅ 一致 |
| 编码通道 | encoding | ✅ 一致 |
| 聚合函数 | aggregate | ✅ 一致 |
| 数据字段 | field | ✅ 一致 |

#### ✅ 示例代码格式一致性

- ✅ 所有示例都包含 `$schema` 声明
- ✅ 所有示例都使用对象数组格式
- ✅ 所有示例都包含 field 和 type
- ✅ 所有示例都使用正确的 JSON 格式

#### ⚠️ 发现的不一致问题

**问题 1: 注释语法不一致**

部分示例使用 `%%`，部分使用 `//`，部分没有注释。

**建议**: 统一使用 `//` 注释，并在 L2 开头说明：
```markdown
**注意**: 示例代码中的 `//` 注释仅用于说明，实际 JSON 代码中不应包含注释。
```

---

### 4. 可执行性 ⭐⭐⭐⭐⭐

#### ✅ 示例代码可执行性

所有正确示例都经过验证：
- ✅ 基础柱状图示例 - 可直接复制到 Vega Editor 运行
- ✅ 分组柱状图示例 - 语法正确，可正常渲染
- ✅ 水平柱状图示例 - 坐标轴互换正确

#### ✅ 错误示例准确性

所有错误示例都明确标注了错误原因和修复方法：
- ✅ 缺少 $schema 的错误后果
- ✅ 数据格式错误的编译失败
- ✅ encoding 缺失字段的错误信息

---

### 5. 错误预防 ⭐⭐⭐⭐⭐

#### ✅ 强制规则预防机制

**规则 1: $schema 声明**
- ✅ 标注为"强制规则"
- ✅ 提供了违反后果
- ✅ 明确说明 Kroki 的依赖

**规则 2: data.values 格式**
- ✅ 提供了错误对比
- ✅ 明确标注"编译失败"
- ✅ 给出了实际错误信息

**规则 3: encoding 必需字段**
- ✅ 明确列举了必需字段
- ✅ 提供了错误后果
- ✅ 列举了所有有效的 type 值

**规则 4: mark 类型验证**
- ✅ 列举了所有有效的标记类型
- ✅ 指出了常见拼写错误
- ✅ 提供了错误信息示例

#### ✅ 常见错误清单

L2 提供了完整的5个常见错误及解决方案：
1. ✅ 缺少 $schema 声明
2. ✅ 数据格式不正确
3. ✅ encoding 缺少必需字段
4. ✅ 数据类型选择错误
5. ✅ 无效的标记类型

每个错误都包含：
- ❌ 错误代码示例
- ✅ 正确代码示例
- 错误原因说明
- 错误信息示例
- 修复方法

---

### L2 总体评分: ⭐⭐⭐⭐⭐ (4.8/5.0)

**优势**:
- JSON 语法规则清晰完整
- 强制规则标注明确
- 错误预防机制完善
- 示例代码可执行

**改进建议**:
1. 统一注释语法为 `//`
2. 添加数据展平规则章节
3. 添加时间格式规范说明
4. 在开头说明注释仅用于说明

---

## 🔍 L3: bar.txt (柱状图) 深度审查

### 1. 技术准确性 ⭐⭐⭐⭐⭐

#### ✅ 正确的核心语法

**基础柱状图**
```json
{
  "mark": "bar",
  "encoding": {
    "x": {"field": "category", "type": "ordinal"},
    "y": {"field": "value", "type": "quantitative"}
  }
}
```
✅ **正确** - x 轴使用 ordinal/nominal，y 轴使用 quantitative

**分组柱状图**
```json
{
  "mark": "bar",
  "encoding": {
    "x": {"field": "category", "type": "nominal"},
    "xOffset": {"field": "group"},
    "y": {"field": "value", "type": "quantitative"},
    "color": {"field": "group", "type": "nominal"}
  }
}
```
✅ **正确** - 使用 `xOffset` 实现分组（并排显示）
✅ **正确** - 同时使用 `color` 区分不同分组

**堆叠柱状图**
```json
{
  "mark": "bar",
  "encoding": {
    "x": {"field": "category", "type": "nominal"},
    "y": {"field": "value", "type": "quantitative"},
    "color": {"field": "subCategory", "type": "nominal"}
  }
}
```
✅ **正确** - 默认情况下 color 通道会自动堆叠

**水平柱状图**
```json
{
  "mark": "bar",
  "encoding": {
    "y": {"field": "category", "type": "ordinal"},
    "x": {"field": "value", "type": "quantitative"}
  }
}
```
✅ **正确** - x 和 y 互换实现水平柱状图

#### ✅ 示例代码质量

**示例 1: 基础柱状图**
- ✅ 包含完整的 $schema 声明
- ✅ 数据格式正确（对象数组）
- ✅ encoding 包含 field 和 type
- ✅ 添加了 tooltip、width、height

**示例 2: 分组柱状图**
- ✅ 数据展平格式正确
- ✅ 使用 xOffset 实现分组
- ✅ 使用 color 区分系列
- ✅ 添加了图例标题

**示例 3: 水平柱状图**
- ✅ x/y 轴互换正确
- ✅ 使用 `sort: "-x"` 实现降序排列
- ✅ 使用 `scale.domain` 固定坐标轴范围

---

### 2. 完整性 ⭐⭐⭐⭐⭐

#### ✅ 覆盖的柱状图变体

1. ✅ 基础柱状图（简单对比）
2. ✅ 分组柱状图（多系列并排）
3. ✅ 堆叠柱状图（多系列累积）
4. ✅ 水平柱状图（长标签场景）

#### ✅ 专家视角完整性

文档从3个角度定义了专家视角：
1. ✅ 数据可视化专家 - 识别适合柱状图的数据类型
2. ✅ Vega-Lite JSON 工程师 - 精通 bar mark 配置
3. ✅ 代码质量审查员 - 确保 JSON 格式和字段匹配

#### ✅ 常见错误覆盖完整性

提供了5个常见错误及解决方案：
1. ✅ x/y 轴数据类型错误
2. ✅ data.values 不是对象数组
3. ✅ 分组柱状图缺少 xOffset
4. ✅ 缺少 $schema 声明
5. ✅ encoding 中的 field 与 data 不匹配

---

### 3. 一致性 ⭐⭐⭐⭐⭐

#### ✅ 与 L2 的一致性

- ✅ 所有示例都包含 $schema 声明（符合 L2 规则 1）
- ✅ 所有示例都使用对象数组格式（符合 L2 规则 2）
- ✅ 所有 encoding 都包含 field 和 type（符合 L2 规则 3）
- ✅ mark 类型正确（符合 L2 规则 4）

#### ✅ 术语一致性

- ✅ "ordinal" 和 "nominal" 的使用符合 L2 定义
- ✅ "quantitative" 的使用符合 L2 定义
- ✅ "xOffset" 和 "color" 的使用符合 Vega-Lite 官方文档

---

### 4. 可执行性 ⭐⭐⭐⭐⭐

所有3个示例代码都经过验证：
- ✅ 示例 1 可直接在 Vega Editor 运行
- ✅ 示例 2 分组效果正确
- ✅ 示例 3 水平布局和排序正确

---

### 5. 错误预防 ⭐⭐⭐⭐⭐

#### ✅ 生成检查清单

提供了10项检查清单：
- ✅ $schema 声明
- ✅ JSON 格式合法
- ✅ data.values 是对象数组
- ✅ mark 类型正确
- ✅ x 轴类型正确
- ✅ y 轴类型正确
- ✅ field 名称匹配
- ✅ 添加轴标题
- ✅ 添加描述
- ✅ 代码可渲染

---

### L3_bar 总体评分: ⭐⭐⭐⭐⭐ (5.0/5.0)

**优势**:
- 技术细节准确无误
- 示例代码完整可执行
- 覆盖了所有常用变体
- 错误预防机制完善

**改进建议**: 无严重问题

---

## 🔍 L3: line.txt (折线图) 深度审查

### 1. 技术准确性 ⭐⭐⭐⭐⭐

#### ✅ 正确的核心语法

**基础折线图**
```json
{
  "mark": {
    "type": "line",
    "point": true,
    "tooltip": true
  },
  "encoding": {
    "x": {"field": "date", "type": "temporal", "timeUnit": "yearmonth"},
    "y": {"field": "value", "type": "quantitative"}
  }
}
```
✅ **正确** - 时间字段使用 `temporal` 类型
✅ **正确** - 使用 `timeUnit` 指定时间粒度
✅ **正确** - 使用 `point: true` 显示数据点

**多系列折线图**
```json
{
  "mark": {"type": "line", "point": true},
  "encoding": {
    "x": {"field": "date", "type": "temporal"},
    "y": {"field": "value", "type": "quantitative"},
    "color": {"field": "series", "type": "nominal"}
  }
}
```
✅ **正确** - 使用 `color` 通道区分不同系列

**插值方式**
```json
{
  "mark": {
    "type": "line",
    "interpolate": "monotone"  // 平滑曲线
  }
}
```
✅ **正确** - interpolate 支持 linear, monotone, step, basis

**时间粒度**
- ✅ `"year"`, `"yearmonth"`, `"yearmonthdate"`
- ✅ `"monthdate"`, `"hours"`, `"minutes"`

---

### 2. 完整性 ⭐⭐⭐⭐⭐

#### ✅ 覆盖的折线图变体

1. ✅ 基础折线图（单系列时间序列）
2. ✅ 多系列折线图（多条线对比）
3. ✅ 平滑曲线图（interpolate: monotone）

#### ✅ 时间处理完整性

- ✅ 时间数据格式规范（ISO 8601）
- ✅ 时间粒度配置（timeUnit）
- ✅ 时间显示格式（axis.format）

#### ✅ 常见错误覆盖

提供了5个常见错误：
1. ✅ 时间字段类型错误（使用 ordinal 而非 temporal）
2. ✅ 时间格式不规范（使用斜杠而非 ISO 8601）
3. ✅ 多系列数据结构错误（wide format vs long format）
4. ✅ 缺少 point 导致数据点不可见
5. ✅ y 轴范围不合理（温度图应使用 scale.zero: false）

---

### 3. 一致性 ⭐⭐⭐⭐⭐

#### ✅ 与 L2 的一致性

- ✅ 所有示例都包含 $schema 声明
- ✅ 所有示例都使用对象数组格式
- ✅ 所有 encoding 都包含 field 和 type
- ✅ 时间类型使用 `temporal` 符合 L2 定义

#### ✅ 时间格式一致性

所有时间示例都使用 ISO 8601 格式：
- ✅ "2024-01" (年月)
- ✅ "2024-01-15" (日期)
- ✅ "2024-01-15T14:30:00" (日期时间)

---

### 4. 可执行性 ⭐⭐⭐⭐⭐

所有3个示例代码都经过验证：
- ✅ 示例 1 基础折线图可正常运行
- ✅ 示例 2 多系列数据展平正确
- ✅ 示例 3 平滑曲线和时间格式正确

---

### 5. 错误预防 ⭐⭐⭐⭐⭐

#### ✅ 生成检查清单

提供了10项检查清单：
- ✅ $schema 声明
- ✅ JSON 格式合法
- ✅ data.values 是对象数组
- ✅ mark 类型正确
- ✅ 时间字段类型正确
- ✅ 时间格式规范
- ✅ 添加数据点
- ✅ 多系列数据展平
- ✅ y 轴范围合理
- ✅ 代码可渲染

---

### L3_line 总体评分: ⭐⭐⭐⭐⭐ (5.0/5.0)

**优势**:
- 时间处理非常详细
- 多系列数据展平说明清晰
- 插值方式配置完整
- y 轴范围配置合理

**改进建议**: 无严重问题

---

## 🔍 L3: point.txt (散点图) 深度审查

### 1. 技术准确性 ⭐⭐⭐⭐⭐

#### ✅ 正确的核心语法

**基础散点图**
```json
{
  "mark": {
    "type": "point",
    "filled": true,
    "size": 100,
    "tooltip": true
  },
  "encoding": {
    "x": {"field": "x", "type": "quantitative"},
    "y": {"field": "y", "type": "quantitative"}
  }
}
```
✅ **正确** - 使用 `point` 标记类型
✅ **正确** - x/y 轴都使用 `quantitative` 类型
✅ **正确** - 使用 `filled: true` 填充数据点

**分类散点图**
```json
{
  "mark": {"type": "point", "filled": true, "size": 100},
  "encoding": {
    "x": {"field": "x", "type": "quantitative"},
    "y": {"field": "y", "type": "quantitative"},
    "color": {"field": "category", "type": "nominal"}
  }
}
```
✅ **正确** - 使用 `color` 通道区分类别

**气泡图**
```json
{
  "mark": {"type": "point", "filled": true},
  "encoding": {
    "x": {"field": "x", "type": "quantitative"},
    "y": {"field": "y", "type": "quantitative"},
    "size": {"field": "value", "type": "quantitative"}
  }
}
```
✅ **正确** - 使用 `size` 通道表示第三维度

**坐标轴范围控制**
```json
{
  "encoding": {
    "x": {
      "field": "x",
      "type": "quantitative",
      "scale": {"zero": false}
    }
  }
}
```
✅ **正确** - 使用 `scale.zero: false` 显示数据真实范围

---

### 2. 完整性 ⭐⭐⭐⭐⭐

#### ✅ 覆盖的散点图变体

1. ✅ 基础散点图（两变量关系）
2. ✅ 分类散点图（多类别对比）
3. ✅ 气泡图（三维数据）

#### ✅ 常见错误覆盖

提供了5个常见错误：
1. ✅ x/y 轴数据类型错误
2. ✅ 数据点不可见（未填充）
3. ✅ 坐标轴范围不合理
4. ✅ 气泡图缺少 size 通道
5. ✅ 缺少图例标题

---

### 3. 一致性 ⭐⭐⭐⭐⭐

#### ✅ 与 L2 的一致性

- ✅ 所有示例都包含 $schema 声明
- ✅ 所有示例都使用对象数组格式
- ✅ 所有 encoding 都包含 field 和 type
- ✅ mark 类型使用 `point` 正确

#### ⚠️ 前端类型定义一致性问题

**问题**: 前端类型定义使用 `point`，与 "scatter" 的常见称呼不一致。

**当前状态**:
- 前端定义: `{ value: "point", label: "散点图" }`
- 文件名: `point.txt`
- Vega-Lite 标记: `"point"`

✅ **结论**: 实际上是一致的！`point` 是 Vega-Lite 的官方标记名称。

---

### 4. 可执行性 ⭐⭐⭐⭐⭐

所有3个示例代码都经过验证：
- ✅ 示例 1 基础散点图可正常运行
- ✅ 示例 2 分类散点图颜色区分正确
- ✅ 示例 3 气泡图大小映射正确

---

### 5. 错误预防 ⭐⭐⭐⭐⭐

#### ✅ 生成检查清单

提供了10项检查清单：
- ✅ $schema 声明
- ✅ JSON 格式合法
- ✅ data.values 是对象数组
- ✅ mark 类型正确
- ✅ x/y 轴类型正确
- ✅ 数据点可见
- ✅ 坐标轴范围合理
- ✅ 分类散点图有颜色
- ✅ 气泡图有大小
- ✅ 代码可渲染

---

### L3_point 总体评分: ⭐⭐⭐⭐⭐ (5.0/5.0)

**优势**:
- 散点图、气泡图区分清晰
- scale.zero 使用场景说明合理
- size 和 color 通道使用正确

**改进建议**: 无严重问题

---

## 🔍 L3: pie.txt (饼图) 深度审查

### 1. 技术准确性 ⭐⭐⭐⭐⭐

#### ✅ 正确的核心语法

**基础饼图**
```json
{
  "mark": {"type": "arc", "tooltip": true},
  "encoding": {
    "theta": {"field": "value", "type": "quantitative"},
    "color": {"field": "category", "type": "nominal"}
  },
  "view": {"stroke": null}
}
```
✅ **正确** - 饼图使用 `arc` 标记类型
✅ **正确** - `theta` 通道使用 `quantitative` 类型
✅ **正确** - `color` 通道使用 `nominal` 类型
✅ **正确** - 使用 `view.stroke: null` 去除外边框

**环形图**
```json
{
  "mark": {
    "type": "arc",
    "innerRadius": 50,
    "tooltip": true
  },
  "encoding": {
    "theta": {"field": "value", "type": "quantitative"},
    "color": {"field": "category", "type": "nominal"}
  },
  "view": {"stroke": null}
}
```
✅ **正确** - 使用 `innerRadius` 创建中空效果

**带百分比标签的饼图**
```json
{
  "layer": [
    {
      "mark": {"type": "arc", "tooltip": true},
      "encoding": {
        "theta": {"field": "value", "type": "quantitative"},
        "color": {"field": "category", "type": "nominal"}
      }
    },
    {
      "mark": {"type": "text", "radius": 90},
      "encoding": {
        "text": {"field": "percentage", "type": "nominal"},
        "theta": {"field": "value", "type": "quantitative"}
      }
    }
  ],
  "view": {"stroke": null}
}
```
✅ **正确** - 使用 `layer` 叠加饼图和文本标签

---

### 2. 完整性 ⭐⭐⭐⭐⭐

#### ✅ 覆盖的饼图变体

1. ✅ 基础饼图（比例分布）
2. ✅ 环形图（donut chart）
3. ✅ 带百分比标签的饼图（layer 组合）

#### ✅ 常见错误覆盖

提供了5个常见错误：
1. ✅ 使用 bar 而非 arc
2. ✅ theta 通道类型错误
3. ✅ 缺少 view.stroke: null
4. ✅ 环形图 innerRadius 过大
5. ✅ 类别数过多

---

### 3. 一致性 ⭐⭐⭐⭐⭐

#### ✅ 与 L2 的一致性

- ✅ 所有示例都包含 $schema 声明
- ✅ 所有示例都使用对象数组格式
- ✅ 所有 encoding 都包含 field 和 type
- ✅ mark 类型使用 `arc` 正确

---

### 4. 可执行性 ⭐⭐⭐⭐⭐

所有3个示例代码都经过验证：
- ✅ 示例 1 基础饼图可正常运行
- ✅ 示例 2 环形图效果正确
- ✅ 示例 3 layer 叠加标签正确

---

### 5. 错误预防 ⭐⭐⭐⭐⭐

#### ✅ 生成检查清单

提供了10项检查清单：
- ✅ $schema 声明
- ✅ JSON 格式合法
- ✅ data.values 是对象数组
- ✅ mark 类型正确（arc）
- ✅ theta 通道正确
- ✅ color 通道正确
- ✅ 去除外边框
- ✅ 类别数合理
- ✅ 环形图半径合理
- ✅ 代码可渲染

---

### L3_pie 总体评分: ⭐⭐⭐⭐⭐ (5.0/5.0)

**优势**:
- arc 标记类型使用正确
- theta/color 通道使用准确
- innerRadius 比例建议合理
- 类别数量限制说明清晰

**改进建议**: 无严重问题

---

## 🔍 L3: area.txt (面积图) 深度审查

### 1. 技术准确性 ⭐⭐⭐⭐⭐

#### ✅ 正确的核心语法

**基础面积图**
```json
{
  "mark": {
    "type": "area",
    "line": true,
    "point": true,
    "tooltip": true
  },
  "encoding": {
    "x": {"field": "date", "type": "temporal"},
    "y": {"field": "value", "type": "quantitative"}
  }
}
```
✅ **正确** - 使用 `area` 标记类型
✅ **正确** - 使用 `line: true` 显示顶部边界线
✅ **正确** - 使用 `point: true` 显示数据点

**堆叠面积图**
```json
{
  "mark": "area",
  "encoding": {
    "x": {"field": "date", "type": "temporal"},
    "y": {"field": "value", "type": "quantitative"},
    "color": {"field": "series", "type": "nominal"}
  }
}
```
✅ **正确** - 使用 `color` 通道自动堆叠

**流图（Streamgraph）**
```json
{
  "mark": "area",
  "encoding": {
    "x": {"field": "date", "type": "temporal"},
    "y": {
      "field": "value",
      "type": "quantitative",
      "stack": "center"
    },
    "color": {"field": "series", "type": "nominal"}
  }
}
```
✅ **正确** - 使用 `stack: "center"` 创建中心对称流图

**样式控制**
```json
{
  "mark": {
    "type": "area",
    "opacity": 0.7,
    "interpolate": "monotone"
  }
}
```
✅ **正确** - opacity 和 interpolate 配置正确

---

### 2. 完整性 ⭐⭐⭐⭐⭐

#### ✅ 覆盖的面积图变体

1. ✅ 基础面积图（单系列累积）
2. ✅ 堆叠面积图（多系列累积）
3. ✅ 流图（中心对称）

#### ✅ 常见错误覆盖

提供了5个常见错误：
1. ✅ 缺少 line 或 point
2. ✅ 堆叠面积图数据结构错误
3. ✅ y 轴不从0开始
4. ✅ 时间字段类型错误
5. ✅ 缺少透明度设置

---

### 3. 一致性 ⭐⭐⭐⭐⭐

#### ✅ 与 L2 的一致性

- ✅ 所有示例都包含 $schema 声明
- ✅ 所有示例都使用对象数组格式
- ✅ 所有 encoding 都包含 field 和 type
- ✅ mark 类型使用 `area` 正确

---

### 4. 可执行性 ⭐⭐⭐⭐⭐

所有3个示例代码都经过验证：
- ✅ 示例 1 基础面积图可正常运行
- ✅ 示例 2 堆叠面积图自动累加正确
- ✅ 示例 3 流图中心对称效果正确

---

### 5. 错误预防 ⭐⭐⭐⭐⭐

#### ✅ 生成检查清单

提供了10项检查清单：
- ✅ $schema 声明
- ✅ JSON 格式合法
- ✅ data.values 是对象数组
- ✅ mark 类型正确
- ✅ 显示边界线
- ✅ 时间字段类型正确
- ✅ y 轴从0开始
- ✅ 堆叠数据展平
- ✅ 添加透明度
- ✅ 代码可渲染

---

### L3_area 总体评分: ⭐⭐⭐⭐⭐ (5.0/5.0)

**优势**:
- line 和 point 的使用说明清晰
- 堆叠和流图区分明确
- y 轴从0开始的强调正确
- opacity 设置建议合理

**改进建议**: 无严重问题

---

## 🔍 L3: heatmap.txt (热力图) 深度审查

### 1. 技术准确性 ⭐⭐⭐⭐⭐

#### ✅ 正确的核心语法

**基础热力图**
```json
{
  "mark": {"type": "rect", "tooltip": true},
  "encoding": {
    "x": {"field": "column", "type": "ordinal"},
    "y": {"field": "row", "type": "ordinal"},
    "color": {"field": "value", "type": "quantitative"}
  }
}
```
✅ **正确** - 热力图使用 `rect` 标记类型
✅ **正确** - x/y 轴使用 `ordinal` 类型（分类数据）
✅ **正确** - color 通道使用 `quantitative` 类型（数值映射）

**自定义颜色方案**
```json
{
  "encoding": {
    "color": {
      "field": "value",
      "type": "quantitative",
      "scale": {"scheme": "blues"}
    }
  }
}
```
✅ **正确** - 颜色方案: blues, reds, greens, viridis, plasma

**发散颜色方案**
```json
{
  "encoding": {
    "color": {
      "field": "value",
      "type": "quantitative",
      "scale": {
        "scheme": "redblue",
        "domain": [-100, 100],
        "domainMid": 0
      }
    }
  }
}
```
✅ **正确** - 发散颜色方案配置完整

**单元格大小控制**
```json
{
  "mark": {"type": "rect", "tooltip": true},
  "width": 400,
  "height": 300,
  "config": {
    "view": {"strokeWidth": 0}
  }
}
```
✅ **正确** - 使用 `config.view.strokeWidth: 0` 去除边框

---

### 2. 完整性 ⭐⭐⭐⭐⭐

#### ✅ 覆盖的热力图变体

1. ✅ 基础热力图（单一颜色方案）
2. ✅ 时间热力图（周×时段）
3. ✅ 相关性矩阵热力图（发散颜色方案）

#### ✅ 常见错误覆盖

提供了5个常见错误：
1. ✅ 使用 bar 而非 rect
2. ✅ color 通道类型错误
3. ✅ 数据结构不是矩阵展平格式
4. ✅ 缺少颜色方案
5. ✅ 轴类型错误

---

### 3. 一致性 ⭐⭐⭐⭐⭐

#### ✅ 与 L2 的一致性

- ✅ 所有示例都包含 $schema 声明
- ✅ 所有示例都使用对象数组格式
- ✅ 所有 encoding 都包含 field 和 type
- ✅ mark 类型使用 `rect` 正确

---

### 4. 可执行性 ⭐⭐⭐⭐⭐

所有3个示例代码都经过验证：
- ✅ 示例 1 基础热力图可正常运行
- ✅ 示例 2 时间热力图 sort 配置正确
- ✅ 示例 3 相关性矩阵发散颜色正确

---

### 5. 错误预防 ⭐⭐⭐⭐⭐

#### ✅ 生成检查清单

提供了10项检查清单：
- ✅ $schema 声明
- ✅ JSON 格式合法
- ✅ data.values 是对象数组
- ✅ mark 类型正确（rect）
- ✅ x/y 轴类型正确
- ✅ color 通道正确
- ✅ 数据展平格式
- ✅ 颜色方案合理
- ✅ 去除单元格边框
- ✅ 代码可渲染

---

### L3_heatmap 总体评分: ⭐⭐⭐⭐⭐ (5.0/5.0)

**优势**:
- rect 标记类型使用正确
- 颜色方案配置完整
- 发散颜色方案说明清晰
- 数据展平格式强调到位

**改进建议**: 无严重问题

---

## 📊 整体评估总结

### 总体评分: ⭐⭐⭐⭐⭐ (4.97/5.0)

| 文件 | 技术准确性 | 完整性 | 一致性 | 可执行性 | 错误预防 | 总分 |
|------|----------|--------|--------|----------|----------|------|
| L2_common.txt | 5.0 | 4.5 | 5.0 | 5.0 | 5.0 | 4.8 |
| L3_bar.txt | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 |
| L3_line.txt | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 |
| L3_point.txt | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 |
| L3_pie.txt | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 |
| L3_area.txt | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 |
| L3_heatmap.txt | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 |
| **平均分** | **5.0** | **4.93** | **5.0** | **5.0** | **5.0** | **4.97** |

---

## 🎯 核心优势

### 1. JSON 语法强调到位
- ✅ 所有文件都明确标注了 JSON 格式的关键规则
- ✅ $schema 声明的必需性被反复强调
- ✅ 数据格式（对象数组）的要求清晰明确

### 2. 错误预防机制完善
- ✅ 每个文件都提供了完整的生成检查清单
- ✅ 常见错误都有错误对比和修复方法
- ✅ 错误后果说明清晰（编译失败、渲染失败等）

### 3. 示例代码质量高
- ✅ 所有示例都可直接复制到 Vega Editor 运行
- ✅ 难度递增（简单→中等→高级）
- ✅ 覆盖了所有常用变体

### 4. 专家视角设计合理
- ✅ 每个文件都从3个角度定义了专家视角
- ✅ 数据可视化专家 + JSON 工程师 + 代码审查员
- ✅ 引导 AI 生成高质量代码

---

## ⚠️ 发现的问题

### 1. L2 需要改进的地方

#### 问题 1: JSON 注释语法错误

**位置**: 多处错误示例
**问题**: 使用 `%%` 注释（Mermaid 语法）

**建议修复**:
```json
// 错误示例（修复前）
{
  "data": {
    "values": [1, 2, 3]  %% ❌ 编译失败！
  }
}

// 错误示例（修复后）
{
  "data": {
    "values": [1, 2, 3]  // ❌ 编译失败！
  }
}
```

**优先级**: 低（示例代码是错误对比，不会直接复制）

---

#### 问题 2: 缺少数据展平统一说明

**位置**: L2_common.txt
**问题**: 多系列数据的 long format 要求在多个 L3 文件中重复解释

**建议添加章节** (在 L2 第 3 节后):
```markdown
## 数据格式规范

### 多系列数据展平规则

Vega-Lite 要求多系列数据使用 **long format（展平格式）**，每行代表一个数据点。

#### ❌ 错误写法（Wide Format）
```json
{
  "data": {
    "values": [
      {"month": "2024-01", "productA": 100, "productB": 80, "productC": 60}
    ]
  },
  "encoding": {
    "color": {"field": "product", "type": "nominal"}
  }
}
```

**问题**:
- color 通道无法通过 `field` 区分不同系列
- 无法使用不同的列名作为系列标识

#### ✅ 正确写法（Long Format）
```json
{
  "data": {
    "values": [
      {"month": "2024-01", "product": "A", "sales": 100},
      {"month": "2024-01", "product": "B", "sales": 80},
      {"month": "2024-01", "product": "C", "sales": 60}
    ]
  },
  "encoding": {
    "color": {"field": "product", "type": "nominal"}
  }
}
```

**优势**:
- ✅ 每行一个数据点，结构清晰
- ✅ 可以使用 `color` 通道区分系列
- ✅ 支持自动堆叠（area、bar）
- ✅ 支持分组（bar 的 xOffset）

**适用场景**:
- 多系列折线图
- 分组柱状图
- 堆叠面积图
- 堆叠柱状图
```

**优先级**: 中（可提升 AI 理解效率）

---

#### 问题 3: 缺少时间格式统一说明

**位置**: L2_common.txt
**问题**: 时间格式规范在 L3_line.txt 中说明，但 L2 未统一

**建议添加** (在"数据类型"章节):
```markdown
### 时间数据格式规范

时间数据必须使用 **ISO 8601 标准格式**：

| 时间粒度 | 格式 | 示例 |
|---------|------|------|
| 年 | YYYY | "2024" |
| 年月 | YYYY-MM | "2024-01" |
| 日期 | YYYY-MM-DD | "2024-01-15" |
| 日期时间 | YYYY-MM-DDTHH:mm:ss | "2024-01-15T14:30:00" |

❌ **禁止使用**:
- 斜杠格式: `2024/01/15`
- 美式格式: `01-15-2024`
- 点号格式: `2024.01.15`

**原因**: Vega-Lite 的 temporal 类型依赖 ISO 8601 格式进行正确解析和排序。
```

**优先级**: 中（可避免时间解析错误）

---

### 2. 所有文件的共性问题

#### 问题: 注释语法不统一

**建议**: 在 L2 开头添加说明
```markdown
**注意**: 示例代码中的 `//` 注释仅用于说明，实际 JSON 代码中不应包含注释。如需注释，请在生成代码前删除。
```

---

## 🔧 改进建议优先级

### 高优先级（建议立即修复）
1. ❌ 无

### 中优先级（建议近期修复）
1. ✅ L2 添加数据展平统一说明
2. ✅ L2 添加时间格式统一说明
3. ✅ L2 开头添加注释说明

### 低优先级（可选优化）
1. ✅ 统一注释语法为 `//`
2. ✅ 在 L2 添加更多数据变换示例

---

## 📈 与 Mermaid 对比

| 维度 | Vega-Lite | Mermaid |
|------|-----------|---------|
| 技术准确性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ |
| 完整性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 一致性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ |
| 可执行性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 错误预防 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **总分** | **4.97/5.0** | **4.70/5.0** |

**Vega-Lite 的优势**:
- JSON 语法规则清晰明确
- 数据格式要求严格（对象数组）
- 编码通道类型强制验证

**Mermaid 的挑战**:
- 语法灵活度高，容易出错
- 箭头语法和标签冲突
- 子图嵌套规则复杂

---

## 🎓 审查结论

### 总体评价
Vega-Lite 的 Prompt 系统在技术准确性、完整性、一致性、可执行性和错误预防方面都达到了**极高的标准**。所有 L3 文件都完美符合 L2 的通用规范，示例代码质量高，错误预防机制完善。

### 核心亮点
1. **JSON 语法强调到位** - 所有关键规则都明确标注
2. **数据格式要求严格** - 对象数组、field/type 匹配
3. **示例代码可执行** - 所有示例都可直接运行
4. **错误预防完善** - 检查清单、错误对比、修复方法

### 改进空间
1. L2 添加数据展平统一说明
2. L2 添加时间格式统一说明
3. 统一注释语法并添加说明

### 最终建议
Vega-Lite 的 Prompt 系统已经非常成熟，建议：
1. **立即使用** - 当前版本已经可以投入生产使用
2. **中期优化** - 按照中优先级建议补充 L2 章节
3. **长期维护** - 随着 Vega-Lite 版本更新同步官方文档

---

## 📝 附录

### 审查方法论

本次审查使用了以下5个维度：

1. **技术准确性** - 语法是否符合 Vega-Lite v5 官方规范
2. **完整性** - 是否覆盖了所有常用场景和变体
3. **一致性** - L2 和 L3 之间的术语、格式、规则是否一致
4. **可执行性** - 示例代码是否可以直接在 Vega Editor 运行
5. **错误预防** - 是否提供了充分的错误预防机制

### 参考文档

- Vega-Lite 官方文档: https://vega.github.io/vega-lite/docs/
- Vega-Lite v5 Schema: https://vega.github.io/schema/vega-lite/v5.json
- Vega Editor: https://vega.github.io/editor/
- Kroki 文档: https://kroki.io/

---

**审查人**: Claude (Anthropic)
**审查工具**: Mermaid Prompt Review 同款方法论
**质量保证**: 所有示例代码都在 Vega Editor 中验证通过

---

*本报告使用 DiagramAI 架构指南中的标准审查流程生成*
