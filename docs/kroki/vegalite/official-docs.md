# Vega-Lite 官方文档汇总

> 更新时间: 2025-10-13
> 数据来源: Vega-Lite 官方文档、GitHub 仓库

---

## 📚 核心文档资源

### 官方网站
- **主页**: https://vega.github.io/vega-lite/
- **GitHub 仓库**: https://github.com/vega/vega-lite
- **在线编辑器**: https://vega.github.io/editor/
- **示例库**: https://vega.github.io/vega-lite/examples/

### 关键文档链接
- **教程**:
  - [Getting Started](https://vega.github.io/vega-lite/tutorials/getting_started.html)
  - [Exploring Data](https://vega.github.io/vega-lite/tutorials/explore.html)
- **文档**:
  - [Specification](https://vega.github.io/vega-lite/docs/spec.html)
  - [Mark Types](https://vega.github.io/vega-lite/docs/mark.html)
  - [Encoding](https://vega.github.io/vega-lite/docs/encoding.html)
  - [Transform](https://vega.github.io/vega-lite/docs/transform.html)
- **API**:
  - [Vega-Lite API](https://vega.github.io/vega-lite-api/)
  - [Altair (Python)](https://altair-viz.github.io/)

---

## 🎯 Vega-Lite 概述

### 定位
Vega-Lite 是一个**高级声明式语法**,用于创建交互式数据可视化。它是 Vega 的简化版本,专注于快速创建常见统计图表。

### 核心特点
- ✅ **声明式语法**: JSON 格式定义可视化
- ✅ **自动推断**: 自动生成坐标轴、图例、比例尺
- ✅ **简洁表达**: 比 Vega 代码减少 90%
- ✅ **交互支持**: 内置选择、缩放、平移
- ✅ **编译到 Vega**: 最终渲染为 Vega 规范
- ✅ **多语言绑定**: JavaScript, Python, R, Julia

### 适用场景
- 探索性数据分析 (EDA)
- 统计图表快速生成
- 仪表板和报表
- 学术论文可视化
- Web 应用嵌入图表

---

## 🏗️ 核心概念

### 1. Specification 结构

Vega-Lite 规范是一个 JSON 对象:

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "A simple bar chart",
  "data": { ... },
  "mark": "bar",
  "encoding": { ... },
  "transform": [ ... ],
  "config": { ... }
}
```

#### 必需属性
- `mark` - 图形类型 (必需)
- `encoding` - 数据到视觉的映射 (可选但常用)

#### 可选属性
- `$schema` - 规范版本 (推荐)
- `description` - 图表描述
- `data` - 数据源
- `transform` - 数据转换
- `title` - 标题
- `width` / `height` - 尺寸
- `config` - 全局配置

---

### 2. Data (数据)

#### 内联数据
```json
{
  "data": {
    "values": [
      {"a": "A", "b": 28},
      {"a": "B", "b": 55},
      {"a": "C", "b": 43}
    ]
  }
}
```

#### 外部数据
```json
{
  "data": {
    "url": "data/cars.json",
    "format": {
      "type": "json"
    }
  }
}
```

#### 支持格式
- **JSON** - 对象数组
- **CSV** - 逗号分隔值
- **TSV** - 制表符分隔值
- **DSV** - 自定义分隔符
- **TopoJSON** - 地理数据

---

### 3. Mark (图形标记)

#### 基础 Mark 类型
```json
// 柱状图
{ "mark": "bar" }

// 折线图
{ "mark": "line" }

// 散点图
{ "mark": "point" }

// 面积图
{ "mark": "area" }

// 其他: circle, square, tick, rect, rule, text, geoshape
```

#### 复合 Mark 类型
```json
// 箱线图
{ "mark": "boxplot" }

// 误差带
{ "mark": "errorband" }

// 误差条
{ "mark": "errorbar" }
```

#### Mark 定义对象
```json
{
  "mark": {
    "type": "bar",
    "color": "steelblue",
    "opacity": 0.7,
    "tooltip": true
  }
}
```

---

### 4. Encoding (编码)

Encoding 将数据字段映射到视觉属性:

#### 位置通道
```json
{
  "encoding": {
    "x": { "field": "category", "type": "nominal" },
    "y": { "field": "value", "type": "quantitative" }
  }
}
```

#### 颜色通道
```json
{
  "encoding": {
    "color": {
      "field": "category",
      "type": "nominal",
      "scale": { "scheme": "category10" }
    }
  }
}
```

#### 大小通道
```json
{
  "encoding": {
    "size": {
      "field": "population",
      "type": "quantitative"
    }
  }
}
```

#### 形状通道
```json
{
  "encoding": {
    "shape": {
      "field": "type",
      "type": "nominal"
    }
  }
}
```

---

### 5. Data Types (数据类型)

Vega-Lite 支持 4 种数据类型:

| 类型 | 说明 | 示例 | 常用通道 |
|------|------|------|---------|
| `quantitative` | 连续数值 | 100, 3.14 | x, y, size, color |
| `temporal` | 时间 | "2023-01-01" | x, y, color |
| `ordinal` | 有序分类 | "low", "medium", "high" | x, y, color |
| `nominal` | 无序分类 | "A", "B", "C" | x, y, color, shape |

#### 自动类型推断
```json
// 自动推断为 quantitative
{ "field": "price" }

// 显式指定类型
{ "field": "date", "type": "temporal" }
```

---

### 6. Transform (数据转换)

#### 聚合 (Aggregate)
```json
{
  "transform": [{
    "aggregate": [{
      "op": "mean",
      "field": "price",
      "as": "avg_price"
    }],
    "groupby": ["category"]
  }]
}
```

#### 过滤 (Filter)
```json
{
  "transform": [{
    "filter": "datum.price > 100"
  }]
}
```

#### 计算 (Calculate)
```json
{
  "transform": [{
    "calculate": "datum.price * 1.1",
    "as": "price_with_tax"
  }]
}
```

#### 分箱 (Bin)
```json
{
  "encoding": {
    "x": {
      "field": "price",
      "type": "quantitative",
      "bin": { "maxbins": 20 }
    }
  }
}
```

#### 时间单位 (TimeUnit)
```json
{
  "encoding": {
    "x": {
      "field": "date",
      "type": "temporal",
      "timeUnit": "yearmonth"
    }
  }
}
```

---

## 📊 常用图表类型

### 1. 柱状图 (Bar Chart)
```json
{
  "mark": "bar",
  "encoding": {
    "x": { "field": "category", "type": "nominal" },
    "y": { "field": "value", "type": "quantitative" }
  }
}
```

### 2. 折线图 (Line Chart)
```json
{
  "mark": "line",
  "encoding": {
    "x": { "field": "date", "type": "temporal" },
    "y": { "field": "price", "type": "quantitative" }
  }
}
```

### 3. 散点图 (Scatter Plot)
```json
{
  "mark": "point",
  "encoding": {
    "x": { "field": "weight", "type": "quantitative" },
    "y": { "field": "height", "type": "quantitative" },
    "color": { "field": "gender", "type": "nominal" }
  }
}
```

### 4. 饼图 (Pie Chart)
```json
{
  "mark": { "type": "arc", "innerRadius": 0 },
  "encoding": {
    "theta": { "field": "value", "type": "quantitative" },
    "color": { "field": "category", "type": "nominal" }
  }
}
```

### 5. 直方图 (Histogram)
```json
{
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "price",
      "type": "quantitative",
      "bin": { "maxbins": 20 }
    },
    "y": { "aggregate": "count" }
  }
}
```

### 6. 热力图 (Heatmap)
```json
{
  "mark": "rect",
  "encoding": {
    "x": { "field": "hour", "type": "ordinal" },
    "y": { "field": "day", "type": "ordinal" },
    "color": { "field": "value", "type": "quantitative" }
  }
}
```

### 7. 箱线图 (Box Plot)
```json
{
  "mark": "boxplot",
  "encoding": {
    "x": { "field": "category", "type": "nominal" },
    "y": { "field": "value", "type": "quantitative" }
  }
}
```

---

## 🔄 组合视图

### 1. 图层 (Layer)
```json
{
  "layer": [
    {
      "mark": "line",
      "encoding": {
        "x": { "field": "date", "type": "temporal" },
        "y": { "field": "value", "type": "quantitative" }
      }
    },
    {
      "mark": "point",
      "encoding": {
        "x": { "field": "date", "type": "temporal" },
        "y": { "field": "value", "type": "quantitative" }
      }
    }
  ]
}
```

### 2. 拼接 (Concat)
```json
{
  "hconcat": [
    { "mark": "bar", ... },
    { "mark": "line", ... }
  ]
}

// 或垂直拼接
{ "vconcat": [...] }
```

### 3. 分面 (Facet)
```json
{
  "facet": { "field": "category", "type": "nominal" },
  "spec": {
    "mark": "bar",
    "encoding": { ... }
  }
}
```

### 4. 重复 (Repeat)
```json
{
  "repeat": {
    "row": ["price", "weight"],
    "column": ["height", "width"]
  },
  "spec": {
    "mark": "point",
    "encoding": {
      "x": { "field": { "repeat": "column" }, "type": "quantitative" },
      "y": { "field": { "repeat": "row" }, "type": "quantitative" }
    }
  }
}
```

---

## 🎨 交互功能

### 1. 选择 (Selection)

#### 点选
```json
{
  "params": [{
    "name": "point_select",
    "select": { "type": "point" }
  }],
  "mark": "point",
  "encoding": {
    "color": {
      "condition": {
        "param": "point_select",
        "value": "red"
      },
      "value": "grey"
    }
  }
}
```

#### 区间选择
```json
{
  "params": [{
    "name": "brush",
    "select": { "type": "interval" }
  }],
  "mark": "point",
  "encoding": {
    "opacity": {
      "condition": {
        "param": "brush",
        "value": 1
      },
      "value": 0.2
    }
  }
}
```

### 2. 绑定到输入 (Bind)
```json
{
  "params": [{
    "name": "year_select",
    "value": 2020,
    "bind": {
      "input": "range",
      "min": 2000,
      "max": 2025,
      "step": 1
    }
  }],
  "transform": [{
    "filter": "datum.year == year_select"
  }]
}
```

### 3. 缩放和平移
```json
{
  "params": [{
    "name": "zoom",
    "select": { "type": "interval", "bind": "scales" }
  }],
  "mark": "point",
  "encoding": { ... }
}
```

---

## ⚙️ 配置 (Config)

### 全局配置
```json
{
  "config": {
    "view": { "stroke": "transparent" },
    "axis": {
      "labelFontSize": 12,
      "titleFontSize": 14
    },
    "legend": {
      "labelFontSize": 12,
      "titleFontSize": 14
    },
    "mark": {
      "tooltip": true
    }
  }
}
```

### Mark 配置
```json
{
  "config": {
    "bar": {
      "cornerRadius": 4,
      "opacity": 0.8
    },
    "line": {
      "strokeWidth": 3
    }
  }
}
```

### 颜色方案
```json
{
  "config": {
    "range": {
      "category": { "scheme": "tableau10" },
      "diverging": { "scheme": "blueorange" },
      "heatmap": { "scheme": "viridis" }
    }
  }
}
```

---

## 🔌 集成方式

### 1. JavaScript (浏览器)
```html
<script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>

<div id="vis"></div>

<script>
  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "data": { "url": "data.json" },
    "mark": "bar",
    "encoding": {
      "x": { "field": "a", "type": "nominal" },
      "y": { "field": "b", "type": "quantitative" }
    }
  };

  vegaEmbed('#vis', spec);
</script>
```

### 2. Python (Altair)
```python
import altair as alt
import pandas as pd

df = pd.DataFrame({
    'a': ['A', 'B', 'C'],
    'b': [28, 55, 43]
})

chart = alt.Chart(df).mark_bar().encode(
    x='a:N',
    y='b:Q'
)

chart.save('chart.html')
```

### 3. R (vegawidget)
```r
library(vegawidget)

spec <- list(
  `$schema` = vega_schema(),
  data = list(values = mtcars),
  mark = "point",
  encoding = list(
    x = list(field = "wt", type = "quantitative"),
    y = list(field = "mpg", type = "quantitative")
  )
)

vw_as_json(spec)
```

### 4. Jupyter Notebook
```python
import altair as alt

alt.Chart(df).mark_bar().encode(
    x='category:N',
    y='value:Q'
).interactive()
```

---

## 📈 高级特性

### 1. 多数据源
```json
{
  "data": { "name": "source" },
  "datasets": {
    "source": [...],
    "lookup": [...]
  },
  "transform": [{
    "lookup": "key",
    "from": {
      "data": { "name": "lookup" },
      "key": "id",
      "fields": ["name", "value"]
    }
  }]
}
```

### 2. 参数表达式
```json
{
  "params": [{
    "name": "threshold",
    "value": 50,
    "bind": { "input": "range" }
  }],
  "encoding": {
    "color": {
      "condition": {
        "test": "datum.value > threshold",
        "value": "red"
      },
      "value": "blue"
    }
  }
}
```

### 3. 地图可视化
```json
{
  "data": {
    "url": "data/us-10m.json",
    "format": { "type": "topojson", "feature": "states" }
  },
  "projection": { "type": "albersUsa" },
  "mark": "geoshape",
  "encoding": {
    "color": { "field": "id", "type": "quantitative" }
  }
}
```

---

## 🎯 最佳实践

### 1. 数据准备
```javascript
// ✅ 推荐: 长格式数据
const data = [
  { "category": "A", "value": 28, "group": "G1" },
  { "category": "B", "value": 55, "group": "G1" },
  { "category": "A", "value": 43, "group": "G2" }
];

// ❌ 避免: 宽格式数据 (需转换)
const wideData = [
  { "category": "A", "G1": 28, "G2": 43 },
  { "category": "B", "G1": 55, "G2": 32 }
];
```

### 2. 性能优化
```json
// 限制数据点数量
{
  "transform": [{
    "sample": 1000  // 随机采样 1000 个点
  }]
}

// 聚合后再渲染
{
  "transform": [{
    "aggregate": [{
      "op": "mean",
      "field": "value",
      "as": "avg_value"
    }],
    "groupby": ["category"]
  }]
}
```

### 3. 响应式设计
```json
{
  "width": "container",
  "height": 400,
  "autosize": {
    "type": "fit",
    "contains": "padding"
  }
}
```

---

## 🔗 相关资源

### 官方文档
- [Vega-Lite 文档](https://vega.github.io/vega-lite/docs/)
- [Vega 文档](https://vega.github.io/vega/docs/)
- [示例库](https://vega.github.io/vega-lite/examples/)

### 工具和编辑器
- [在线编辑器](https://vega.github.io/editor/)
- [Observable Notebook](https://observablehq.com/@vega/vega-lite)
- [Altair Python](https://altair-viz.github.io/)

### 社区资源
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vega-lite)
- [Slack 社区](https://bit.ly/join-vega-slack)
- [GitHub Discussions](https://github.com/vega/vega-lite/discussions)

---

## 📚 进阶学习

### 教程系列
1. [Getting Started](https://vega.github.io/vega-lite/tutorials/getting_started.html) - 15 分钟入门
2. [Exploring Data](https://vega.github.io/vega-lite/tutorials/explore.html) - 数据探索技巧
3. [Interactive Visualization](https://www.youtube.com/watch?v=yAHa9uL4dhY) - YouTube 视频教程

### 参考书籍
- **"Vega-Lite: A Grammar of Interactive Graphics"** (官方论文)
- **"Interactive Data Visualization for the Web"** (D3.js 书籍,相关概念)

### 课程
- [UW Visualization Curriculum](https://idl.uw.edu/visualization-curriculum/)
- [Data Visualization with Vega-Lite](https://www.coursera.org/) - Coursera

---

**最后更新**: 2025-10-13
**Vega-Lite 版本**: v6.4.1 (2025-09-23)
**Vega 版本**: v5.30.0
