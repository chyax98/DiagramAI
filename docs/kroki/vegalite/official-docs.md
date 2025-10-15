# Vega-Lite 官方文档汇总

> **更新时间**: 2025-01-13  
> **官方网站**: https://vega.github.io/vega-lite/  
> **GitHub**: https://github.com/vega/vega-lite

---

## 📚 核心资源

### 官方文档

- **主文档**: https://vega.github.io/vega-lite/docs/
- **示例库**: https://vega.github.io/vega-lite/examples/
- **在线编辑器**: https://vega.github.io/editor/
- **教程**: https://vega.github.io/vega-lite/tutorials/getting_started.html

### GitHub

- **Vega-Lite**: https://github.com/vega/vega-lite (4.9k stars)
- **Vega (底层)**: https://github.com/vega/vega
- **编辑器**: https://github.com/vega/editor

---

## 🎯 核心概念

### 可视化语法

Vega-Lite 基于 **Grammar of Graphics**:

```
数据 → 变换 → 编码 → 标记 → 可视化
Data → Transform → Encoding → Mark → Visualization
```

### 基础结构

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { "url": "data.csv" },
  "mark": "bar",
  "encoding": {
    "x": { "field": "category", "type": "nominal" },
    "y": { "field": "value", "type": "quantitative" }
  }
}
```

---

## 📊 标记类型 (Mark)

### 基础标记

- `bar`: 柱状图
- `line`: 折线图
- `point`: 散点图
- `area`: 面积图
- `rect`: 矩形
- `circle`: 圆形
- `square`: 方形
- `text`: 文本

### 组合标记

- `boxplot`: 箱线图
- `errorband`: 误差带
- `errorbar`: 误差条

---

## 🎨 编码通道 (Encoding)

### 位置通道

- `x`, `y`: X/Y 坐标
- `x2`, `y2`: 区间端点

### 视觉通道

- `color`: 颜色
- `opacity`: 透明度
- `size`: 大小
- `shape`: 形状

### 其他通道

- `detail`: 分组细节
- `tooltip`: 提示信息
- `href`: 超链接

---

## 🔄 数据变换

### 聚合 (Aggregate)

```json
{
  "encoding": {
    "y": {
      "field": "value",
      "aggregate": "mean" // sum, count, median, min, max
    }
  }
}
```

### 分箱 (Bin)

```json
{
  "encoding": {
    "x": {
      "field": "age",
      "bin": { "maxbins": 20 }
    }
  }
}
```

### 过滤 (Filter)

```json
{
  "transform": [{ "filter": "datum.value > 100" }]
}
```

---

## 📐 图表组合

### 分层 (Layer)

```json
{
  "layer": [
    {"mark": "line", "encoding": {...}},
    {"mark": "point", "encoding": {...}}
  ]
}
```

### 拼接 (Concat)

```json
{
  "hconcat": [
    {"mark": "bar", ...},
    {"mark": "line", ...}
  ]
}
```

### 分面 (Facet)

```json
{
  "facet": {"field": "category"},
  "spec": {"mark": "bar", ...}
}
```

---

## 🎯 交互性

### 选择 (Selection)

```json
{
  "params": [
    {
      "name": "brush",
      "select": { "type": "interval" }
    }
  ],
  "encoding": {
    "color": {
      "condition": {
        "param": "brush",
        "field": "category"
      },
      "value": "gray"
    }
  }
}
```

---

## 🔧 工具集成

### JavaScript

```html
<script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>

<div id="vis"></div>

<script>
  vegaEmbed("#vis", spec);
</script>
```

### Python (Altair)

```python
import altair as alt

chart = alt.Chart(data).mark_bar().encode(
    x='category',
    y='value'
)
```

### R (vegawidget)

```r
library(vegawidget)
as_vegaspec(spec) %>% vw_autosize()
```

---

## 📚 学习资源

### 官方教程

1. **入门**: https://vega.github.io/vega-lite/tutorials/getting_started.html
2. **示例库**: https://vega.github.io/vega-lite/examples/
3. **完整文档**: https://vega.github.io/vega-lite/docs/

### 社区课程

- **Visualization Curriculum**: https://idl.uw.edu/visualization-curriculum/
- **Observable 教程**: https://observablehq.com/@jonfroehlich/intro-to-vega-lite
- **Data Europa**: https://data.europa.eu/apps/data-visualisation-guide/grammar-of-graphics-in-practice-vega-lite

---

## 📖 参考论文

**"Vega-Lite: A Grammar of Interactive Graphics"**  
_IEEE TVCG 2017_  
https://vis.csail.mit.edu/pubs/vega-lite/

---

## 🔗 重要链接

- 官网: https://vega.github.io/vega-lite/
- GitHub: https://github.com/vega/vega-lite
- 编辑器: https://vega.github.io/editor/
- 示例: https://vega.github.io/vega-lite/examples/
- 论文: https://vis.csail.mit.edu/pubs/vega-lite/
