/**
 * L3: Vega-Lite Pie Chart 生成提示词
 *
 * 作用：定义饼图的生成规则、示例和最佳实践
 * Token 预算：800-1200 tokens
 * 图表类型：Vega-Lite Pie Chart（饼图）
 *
 * 用途：
 * - 比例展示（如市场份额、预算分配）
 * - 构成分析（如流量来源、销售渠道）
 * - 分类占比（如产品类别分布、用户性别比例）
 * - 环形图（Donut Chart，中空饼图）
 *
 * @example
 * 用户输入："展示市场份额分布，A公司 40%，B公司 30%，C公司 20%，其他 10%"
 * 输出：完整的 Vega-Lite Pie Chart JSON 代码
 */

export const VEGALITE_PIE_PROMPT = `
# Vega-Lite Pie Chart 生成要求

## 专家视角 (Simplified DEPTH - D)

作为饼图专家，你需要同时扮演：

1. **比例数据可视化专家**
   - 识别适合饼图的数据类型（百分比、比例、构成）
   - 判断饼图是否合适（类别数建议 ≤ 7 个）
   - 选择饼图或环形图（根据美观性和可读性）

2. **Vega-Lite JSON 工程师**
   - 精通 arc mark 的使用（饼图使用 arc 标记）
   - 掌握 theta 编码通道（角度映射）
   - 熟悉环形图的实现（innerRadius 和 outerRadius）

3. **代码质量审查员**
   - 确保 theta 通道使用 quantitative 类型
   - 验证 color 通道使用 nominal 类型
   - 检查 view.stroke 设置（去除外边框）

## 核心语法

### 基础饼图

\`\`\`json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "基础饼图",
  "data": {
    "values": [
      {"category": "A", "value": 40},
      {"category": "B", "value": 30}
    ]
  },
  "mark": {
    "type": "arc",
    "tooltip": true
  },
  "encoding": {
    "theta": {
      "field": "value",
      "type": "quantitative"      // 数值决定角度大小
    },
    "color": {
      "field": "category",
      "type": "nominal",          // 类别决定颜色
      "legend": {"title": "类别"}
    }
  },
  "view": {"stroke": null}        // 去除外边框
}
\`\`\`

### 环形图（Donut Chart）

\`\`\`json
{
  "mark": {
    "type": "arc",
    "innerRadius": 50,    // 内半径（创建中空效果）
    "tooltip": true
  },
  "encoding": {
    "theta": {"field": "value", "type": "quantitative"},
    "color": {"field": "category", "type": "nominal"}
  },
  "view": {"stroke": null}
}
\`\`\`

### 带百分比标签的饼图

\`\`\`json
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
\`\`\`

### 自定义颜色

\`\`\`json
{
  "encoding": {
    "color": {
      "field": "category",
      "type": "nominal",
      "scale": {
        "range": ["#4285f4", "#ea4335", "#fbbc04", "#34a853"]
      }
    }
  }
}
\`\`\`

## 生成示例

### 示例 1: 基础饼图（简单场景）
**用户需求**：展示市场份额分布，A公司 40%，B公司 30%，C公司 20%，其他 10%

**生成代码**：
\`\`\`json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "市场份额分布饼图",
  "data": {
    "values": [
      {"company": "A公司", "share": 40},
      {"company": "B公司", "share": 30},
      {"company": "C公司", "share": 20},
      {"company": "其他", "share": 10}
    ]
  },
  "mark": {
    "type": "arc",
    "tooltip": true,
    "outerRadius": 120
  },
  "encoding": {
    "theta": {
      "field": "share",
      "type": "quantitative"
    },
    "color": {
      "field": "company",
      "type": "nominal",
      "legend": {"title": "公司"},
      "scale": {
        "range": ["#4285f4", "#ea4335", "#fbbc04", "#34a853"]
      }
    }
  },
  "view": {"stroke": null},
  "width": 300,
  "height": 300
}
\`\`\`

**关键点**：
- 使用 \`arc\` 标记类型（饼图的核心）
- \`theta\` 通道使用 \`quantitative\` 类型（数值决定角度）
- \`color\` 通道使用 \`nominal\` 类型（类别决定颜色）
- \`view.stroke: null\` 去除外边框
- 使用 \`scale.range\` 自定义颜色

### 示例 2: 环形图（中等复杂度）
**用户需求**：展示流量来源分布（环形图），搜索引擎 45%，直接访问 25%，社交媒体 20%，广告 10%

**生成代码**：
\`\`\`json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "流量来源分布环形图",
  "data": {
    "values": [
      {"source": "搜索引擎", "percentage": 45},
      {"source": "直接访问", "percentage": 25},
      {"source": "社交媒体", "percentage": 20},
      {"source": "广告", "percentage": 10}
    ]
  },
  "mark": {
    "type": "arc",
    "innerRadius": 60,
    "outerRadius": 120,
    "tooltip": true
  },
  "encoding": {
    "theta": {
      "field": "percentage",
      "type": "quantitative"
    },
    "color": {
      "field": "source",
      "type": "nominal",
      "legend": {"title": "流量来源"}
    }
  },
  "view": {"stroke": null},
  "width": 300,
  "height": 300
}
\`\`\`

**关键点**：
- 使用 \`innerRadius\` 创建中空效果（环形图）
- \`innerRadius\` 和 \`outerRadius\` 控制环的宽度
- 环形图比饼图更现代、更易读
- 中心空白可以放置总计等信息

### 示例 3: 带百分比标签的饼图（高级场景）
**用户需求**：展示销售渠道占比（带百分比标签），线上 55%，线下门店 30%，代理商 15%

**生成代码**：
\`\`\`json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "销售渠道占比（带标签）",
  "data": {
    "values": [
      {"channel": "线上", "value": 55, "label": "55%"},
      {"channel": "线下门店", "value": 30, "label": "30%"},
      {"channel": "代理商", "value": 15, "label": "15%"}
    ]
  },
  "layer": [
    {
      "mark": {
        "type": "arc",
        "tooltip": true,
        "outerRadius": 120
      },
      "encoding": {
        "theta": {
          "field": "value",
          "type": "quantitative"
        },
        "color": {
          "field": "channel",
          "type": "nominal",
          "legend": {"title": "销售渠道"},
          "scale": {
            "range": ["#4285f4", "#34a853", "#fbbc04"]
          }
        }
      }
    },
    {
      "mark": {
        "type": "text",
        "radius": 140,
        "fontSize": 14,
        "fontWeight": "bold"
      },
      "encoding": {
        "text": {"field": "label", "type": "nominal"},
        "theta": {
          "field": "value",
          "type": "quantitative",
          "stack": true
        }
      }
    }
  ],
  "view": {"stroke": null},
  "width": 300,
  "height": 300
}
\`\`\`

**关键点**：
- 使用 \`layer\` 叠加多层（饼图 + 文本标签）
- 第一层是 arc（饼图本体）
- 第二层是 text（百分比标签）
- \`radius\` 控制标签位置（大于 outerRadius 显示在外侧）
- data 中需要包含 label 字段

## 常见错误

### 错误 1: 使用 bar 而非 arc
**❌ 错误写法**：
\`\`\`json
{
  "mark": "bar",
  "encoding": {
    "x": {"field": "category", "type": "nominal"},
    "y": {"field": "value", "type": "quantitative"}
  }
}
\`\`\`

**✅ 正确写法**：
\`\`\`json
{
  "mark": "arc",
  "encoding": {
    "theta": {"field": "value", "type": "quantitative"},
    "color": {"field": "category", "type": "nominal"}
  }
}
\`\`\`

**原因**：饼图必须使用 \`arc\` 标记类型，不能使用 \`bar\`。

### 错误 2: theta 通道类型错误
**❌ 错误写法**：
\`\`\`json
{
  "encoding": {
    "theta": {"field": "value", "type": "nominal"}
  }
}
\`\`\`

**✅ 正确写法**：
\`\`\`json
{
  "encoding": {
    "theta": {"field": "value", "type": "quantitative"}
  }
}
\`\`\`

**原因**：\`theta\` 通道必须使用 \`quantitative\` 类型（数值决定角度大小）。

### 错误 3: 缺少 view.stroke: null
**❌ 错误写法**：
\`\`\`json
{
  "mark": "arc",
  "encoding": { ... }
  // 缺少 view 配置
}
\`\`\`

**✅ 正确写法**：
\`\`\`json
{
  "mark": "arc",
  "encoding": { ... },
  "view": {"stroke": null}
}
\`\`\`

**原因**：默认会有外边框，使用 \`view.stroke: null\` 去除边框更美观。

### 错误 4: 环形图 innerRadius 过大
**❌ 错误写法**：
\`\`\`json
{
  "mark": {
    "type": "arc",
    "innerRadius": 110,
    "outerRadius": 120
  }
}
\`\`\`

**✅ 正确写法**：
\`\`\`json
{
  "mark": {
    "type": "arc",
    "innerRadius": 60,
    "outerRadius": 120
  }
}
\`\`\`

**原因**：innerRadius 应远小于 outerRadius，建议比例约 1:2，否则环太细不易辨识。

### 错误 5: 类别数过多
**❌ 错误写法**：
\`\`\`json
{
  "data": {
    "values": [
      {"category": "A", "value": 10},
      {"category": "B", "value": 9},
      // ... 15 个类别
    ]
  }
}
\`\`\`

**✅ 正确写法**：
\`\`\`json
{
  "data": {
    "values": [
      {"category": "A", "value": 40},
      {"category": "B", "value": 30},
      {"category": "C", "value": 20},
      {"category": "其他", "value": 10}
    ]
  }
}
\`\`\`

**原因**：饼图适合 3-7 个类别，过多类别应合并为"其他"，或改用柱状图。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **$schema 声明**：必须包含 \`"$schema": "https://vega.github.io/schema/vega-lite/v5.json"\`
- [ ] **JSON 格式合法**：使用 JSON 验证器检查语法
- [ ] **data.values 是对象数组**：每个元素是 \`{"field": value}\` 格式
- [ ] **mark 类型正确**：使用 \`"arc"\`（不是 bar 或 point）
- [ ] **theta 通道正确**：使用 \`quantitative\` 类型
- [ ] **color 通道正确**：使用 \`nominal\` 类型
- [ ] **去除外边框**：使用 \`view: { stroke: null }\`
- [ ] **类别数合理**：3-7 个类别，过多应合并
- [ ] **环形图半径合理**：innerRadius 约为 outerRadius 的 1/2
- [ ] **代码可渲染**：确保能通过 Kroki 正确渲染

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1150 tokens
 *
 * 分配明细:
 * - 专家视角: 110 tokens
 * - 核心语法: 240 tokens
 * - 生成示例: 540 tokens（3个示例，每个约 180 tokens）
 * - 常见错误: 200 tokens（5个错误，每个约 40 tokens）
 * - 检查清单: 60 tokens
 */
