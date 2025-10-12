# Vega-Lite 语法规则和规范

> 更新时间: 2025-10-13
> 适用版本: Vega-Lite v6.4+

---

## 📐 基础语法结构

### 1. 最小规范

```json
{
  "mark": "bar",
  "encoding": {
    "x": { "field": "a", "type": "nominal" },
    "y": { "field": "b", "type": "quantitative" }
  }
}
```

### 2. 完整规范结构

```json
{
  // 版本声明 (推荐)
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

  // 元数据
  "title": "图表标题",
  "description": "图表描述",

  // 数据
  "data": { ... },

  // 数据转换
  "transform": [ ... ],

  // 图形标记
  "mark": "bar" | { "type": "bar", ... },

  // 编码映射
  "encoding": { ... },

  // 参数 (交互)
  "params": [ ... ],

  // 视图尺寸
  "width": 400,
  "height": 300,

  // 全局配置
  "config": { ... }
}
```

---

## 📊 Mark (标记) 规则

### 基础 Mark 类型

#### 1. Bar (柱状图)
```json
{
  "mark": "bar",
  // 或
  "mark": {
    "type": "bar",
    "color": "steelblue",
    "opacity": 0.8,
    "cornerRadius": 4,
    "tooltip": true
  }
}
```

**方向规则**:
- X 轴 = nominal/ordinal, Y 轴 = quantitative → 垂直柱状图
- X 轴 = quantitative, Y 轴 = nominal/ordinal → 水平柱状图

#### 2. Line (折线图)
```json
{
  "mark": {
    "type": "line",
    "point": true,  // 显示数据点
    "strokeWidth": 3,
    "interpolate": "monotone"  // 平滑曲线
  }
}
```

**插值选项**: `linear`, `step`, `step-before`, `step-after`, `basis`, `cardinal`, `catmull-rom`, `monotone`

#### 3. Point (散点图)
```json
{
  "mark": {
    "type": "point",
    "filled": true,
    "size": 100,
    "shape": "circle"  // circle, square, cross, diamond, triangle-up, etc.
  }
}
```

#### 4. Area (面积图)
```json
{
  "mark": {
    "type": "area",
    "opacity": 0.7,
    "line": true,  // 显示边界线
    "interpolate": "monotone"
  }
}
```

#### 5. Arc (饼图/环形图)
```json
{
  "mark": {
    "type": "arc",
    "innerRadius": 0,      // 0 = 饼图, >0 = 环形图
    "outerRadius": 100,
    "cornerRadius": 5,
    "padAngle": 0.02
  }
}
```

#### 6. Text (文本标记)
```json
{
  "mark": {
    "type": "text",
    "align": "center",
    "baseline": "middle",
    "dx": 0,
    "dy": -10,
    "fontSize": 14,
    "fontWeight": "bold"
  }
}
```

#### 7. Rect (矩形 - 热力图)
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

#### 8. Rule (参考线)
```json
{
  "mark": {
    "type": "rule",
    "strokeDash": [6, 4],
    "strokeWidth": 2,
    "color": "red"
  }
}
```

### 复合 Mark 类型

#### 1. Boxplot (箱线图)
```json
{
  "mark": {
    "type": "boxplot",
    "extent": 1.5,  // IQR 倍数
    "size": 14      // 箱体宽度
  }
}
```

#### 2. Errorbar (误差条)
```json
{
  "mark": {
    "type": "errorbar",
    "extent": "ci",  // ci (置信区间) | stderr | stdev | iqr
    "ticks": true
  }
}
```

#### 3. Errorband (误差带)
```json
{
  "mark": {
    "type": "errorband",
    "extent": "ci",
    "borders": true
  }
}
```

---

## 🎨 Encoding (编码) 规则

### 位置通道 (Position Channels)

#### X 和 Y
```json
{
  "encoding": {
    "x": {
      "field": "date",
      "type": "temporal",
      "axis": { "title": "日期", "format": "%Y-%m" },
      "scale": { "domain": ["2020-01-01", "2025-12-31"] }
    },
    "y": {
      "field": "value",
      "type": "quantitative",
      "axis": { "title": "值" },
      "scale": { "zero": true }  // Y 轴从 0 开始
    }
  }
}
```

#### X2 和 Y2 (范围)
```json
// 用于 bar, rect, area, rule
{
  "encoding": {
    "x": { "field": "start", "type": "temporal" },
    "x2": { "field": "end", "type": "temporal" },
    "y": { "field": "category", "type": "nominal" }
  }
}
```

### 标记属性通道 (Mark Property Channels)

#### Color
```json
{
  "encoding": {
    "color": {
      "field": "category",
      "type": "nominal",
      "scale": {
        "scheme": "category10",  // 颜色方案
        // 或自定义
        "range": ["#1f77b4", "#ff7f0e", "#2ca02c"]
      },
      "legend": {
        "title": "类别",
        "orient": "right"
      }
    }
  }
}
```

**颜色方案**: `category10`, `category20`, `tableau10`, `tableau20`, `accent`, `dark2`, `paired`, `pastel1`, `pastel2`, `set1`, `set2`, `set3`, `viridis`, `magma`, `inferno`, `plasma`, `cividis`, `turbo`, `blues`, `greens`, `greys`, `oranges`, `purples`, `reds`, `blueorange`, `brownbluegreen`, `purplegreen`, `pinkyellowgreen`, `purpleorange`, `redblue`, `redgrey`, `redyellowblue`, `redyellowgreen`, `spectral`

#### Size
```json
{
  "encoding": {
    "size": {
      "field": "population",
      "type": "quantitative",
      "scale": {
        "range": [10, 1000],
        "type": "sqrt"  // sqrt | log | linear
      },
      "legend": { "title": "人口" }
    }
  }
}
```

#### Opacity
```json
{
  "encoding": {
    "opacity": {
      "field": "confidence",
      "type": "quantitative",
      "scale": { "range": [0.2, 1] }
    }
  }
}
```

#### Shape (仅 point 标记)
```json
{
  "mark": "point",
  "encoding": {
    "shape": {
      "field": "type",
      "type": "nominal",
      "scale": {
        "range": ["circle", "square", "cross", "diamond", "triangle-up"]
      }
    }
  }
}
```

#### StrokeDash (线条样式)
```json
{
  "mark": "line",
  "encoding": {
    "strokeDash": {
      "field": "type",
      "type": "nominal",
      "scale": {
        "range": [[1, 0], [8, 8], [2, 2]]  // 实线, 虚线, 点线
      }
    }
  }
}
```

### 文本通道 (Text Channels)

#### Text
```json
{
  "mark": "text",
  "encoding": {
    "text": {
      "field": "value",
      "type": "quantitative",
      "format": ".2f"  // 格式化为两位小数
    }
  }
}
```

#### Tooltip
```json
{
  "encoding": {
    "tooltip": [
      { "field": "name", "type": "nominal" },
      { "field": "value", "type": "quantitative", "format": ",.0f" }
    ]
  }
}
```

### 排序通道 (Order Channel)

```json
{
  "mark": "line",
  "encoding": {
    "x": { "field": "date", "type": "temporal" },
    "y": { "field": "value", "type": "quantitative" },
    "order": { "field": "date", "type": "temporal" }  // 确保按日期排序
  }
}
```

---

## 🔄 Transform (转换) 规则

### 1. Aggregate (聚合)
```json
{
  "transform": [{
    "aggregate": [{
      "op": "mean",    // sum, mean, median, min, max, count, stdev, variance, etc.
      "field": "price",
      "as": "avg_price"
    }],
    "groupby": ["category"]
  }]
}
```

**聚合操作**: `count`, `valid`, `missing`, `distinct`, `sum`, `product`, `mean`, `average`, `variance`, `variancep`, `stdev`, `stdevp`, `stderr`, `median`, `q1`, `q3`, `ci0`, `ci1`, `min`, `max`, `argmin`, `argmax`

### 2. Bin (分箱)
```json
{
  "transform": [{
    "bin": {
      "maxbins": 20,
      "extent": [0, 100],
      "step": 5
    },
    "field": "price",
    "as": ["price_bin_start", "price_bin_end"]
  }]
}

// 或在 encoding 中
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

### 3. Calculate (计算)
```json
{
  "transform": [{
    "calculate": "datum.price * 1.1",
    "as": "price_with_tax"
  }]
}
```

**表达式函数**: `abs()`, `ceil()`, `floor()`, `round()`, `exp()`, `log()`, `sqrt()`, `pow()`, `sin()`, `cos()`, `tan()`, `year()`, `month()`, `date()`, `day()`, `hours()`, `minutes()`, `seconds()`, `if()`, `isNaN()`, `isFinite()`, `isValid()`, `length()`, `toDate()`, `toString()`, `toNumber()`, `datum.*`, `indexof()`, `substring()`, `upper()`, `lower()`, `replace()`, `split()`, `join()`, `slice()`

### 4. Filter (过滤)
```json
{
  "transform": [{
    "filter": "datum.price > 100"
  }]
}

// 或使用对象语法
{
  "transform": [{
    "filter": {
      "field": "category",
      "oneOf": ["A", "B", "C"]
    }
  }]
}

// 或使用逻辑表达式
{
  "transform": [{
    "filter": {
      "and": [
        { "field": "price", "gte": 100 },
        { "field": "price", "lte": 500 }
      ]
    }
  }]
}
```

### 5. Lookup (连接)
```json
{
  "transform": [{
    "lookup": "country",
    "from": {
      "data": { "url": "data/countries.csv" },
      "key": "id",
      "fields": ["name", "population"]
    }
  }]
}
```

### 6. Fold (透视)
```json
{
  "data": {
    "values": [
      { "country": "USA", "gold": 10, "silver": 20 },
      { "country": "China", "gold": 15, "silver": 10 }
    ]
  },
  "transform": [{
    "fold": ["gold", "silver"],
    "as": ["medal", "count"]
  }]
  // 结果:
  // { "country": "USA", "medal": "gold", "count": 10 }
  // { "country": "USA", "medal": "silver", "count": 20 }
  // ...
}
```

### 7. TimeUnit (时间单位)
```json
{
  "transform": [{
    "timeUnit": "yearmonth",
    "field": "date",
    "as": "yearmonth_date"
  }]
}

// 或在 encoding 中
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

**时间单位**: `year`, `quarter`, `month`, `date`, `week`, `day`, `dayofyear`, `hours`, `minutes`, `seconds`, `milliseconds`, `yearquarter`, `yearquartermonth`, `yearmonth`, `yearmonthdate`, `yearmonthdatehours`, `yearmonthdatehoursminutes`, `yearmonthdatehoursminutesseconds`, `quartermonth`, `monthdate`, `monthdatehours`, `hoursminutes`, `hoursminutesseconds`, `minutesseconds`, `secondsmilliseconds`

### 8. Window (窗口函数)
```json
{
  "transform": [{
    "window": [{
      "op": "rank",
      "as": "rank"
    }],
    "sort": [{ "field": "value", "order": "descending" }],
    "groupby": ["category"]
  }]
}
```

**窗口操作**: `row_number`, `rank`, `dense_rank`, `percent_rank`, `cume_dist`, `ntile`, `lag`, `lead`, `first_value`, `last_value`, `nth_value`

---

## 🎯 数据类型规则

### 类型推断规则

```json
// 自动推断
{ "field": "price" }
// → 如果值是数字 → quantitative
// → 如果值是字符串 → nominal
// → 如果值是日期字符串 → temporal

// 显式指定 (推荐)
{ "field": "price", "type": "quantitative" }
```

### 类型转换

```json
// 数值转为有序分类
{
  "field": "rating",
  "type": "ordinal",
  "scale": {
    "domain": [1, 2, 3, 4, 5]
  }
}

// 字符串转为时间
{
  "transform": [{
    "calculate": "toDate(datum.date_string)",
    "as": "date"
  }],
  "encoding": {
    "x": { "field": "date", "type": "temporal" }
  }
}
```

---

## 📏 Scale (比例尺) 规则

### Scale 类型

| Scale Type | 适用数据类型 | 说明 |
|-----------|------------|------|
| `linear` | quantitative | 线性映射 (默认) |
| `log` | quantitative | 对数映射 |
| `pow` | quantitative | 幂次映射 |
| `sqrt` | quantitative | 平方根映射 |
| `symlog` | quantitative | 对称对数映射 |
| `time` | temporal | 时间映射 (默认) |
| `utc` | temporal | UTC 时间映射 |
| `ordinal` | ordinal, nominal | 有序/无序映射 |
| `band` | ordinal, nominal | 分段映射 (柱状图) |
| `point` | ordinal, nominal | 点映射 (散点图) |

### Scale 属性

```json
{
  "encoding": {
    "y": {
      "field": "value",
      "type": "quantitative",
      "scale": {
        "type": "linear",
        "domain": [0, 100],        // 数据域
        "range": [0, 300],         // 视觉域
        "clamp": true,             // 限制在域内
        "nice": true,              // 优化刻度
        "zero": true,              // 从 0 开始
        "padding": 0.1,            // band/point 的间距
        "reverse": false,          // 反转方向
        "exponent": 2              // pow 的指数
      }
    }
  }
}
```

---

## 🎨 Axis (坐标轴) 规则

```json
{
  "encoding": {
    "x": {
      "field": "date",
      "type": "temporal",
      "axis": {
        "title": "日期",
        "titleFontSize": 14,
        "titlePadding": 10,

        "labelAngle": -45,
        "labelFontSize": 12,
        "labelLimit": 100,
        "labelOverlap": true,

        "format": "%Y-%m",
        "formatType": "time",

        "grid": true,
        "gridDash": [2, 2],
        "gridOpacity": 0.3,

        "ticks": true,
        "tickCount": 10,
        "tickSize": 5,

        "domain": true,
        "domainWidth": 1,
        "domainColor": "#333",

        "orient": "bottom"  // top, bottom, left, right
      }
    }
  }
}
```

---

## 🏷️ Legend (图例) 规则

```json
{
  "encoding": {
    "color": {
      "field": "category",
      "type": "nominal",
      "legend": {
        "title": "类别",
        "titleFontSize": 14,
        "titlePadding": 10,

        "labelFontSize": 12,
        "labelLimit": 100,

        "orient": "right",  // left, right, top, bottom
        "direction": "vertical",  // horizontal, vertical

        "symbolType": "circle",  // circle, square, etc.
        "symbolSize": 100,
        "symbolStrokeWidth": 2,

        "columns": 1,
        "columnPadding": 10,
        "rowPadding": 5,

        "offset": 10
      }
    }
  }
}
```

---

## 🔀 Condition (条件) 规则

### 基于选择的条件
```json
{
  "params": [{
    "name": "select",
    "select": { "type": "point" }
  }],
  "encoding": {
    "color": {
      "condition": {
        "param": "select",
        "field": "category",
        "type": "nominal"
      },
      "value": "lightgray"
    }
  }
}
```

### 基于测试的条件
```json
{
  "encoding": {
    "color": {
      "condition": {
        "test": "datum.value > 50",
        "value": "red"
      },
      "value": "blue"
    }
  }
}
```

### 多重条件
```json
{
  "encoding": {
    "color": {
      "condition": [
        { "test": "datum.value > 100", "value": "red" },
        { "test": "datum.value > 50", "value": "orange" },
        { "test": "datum.value > 0", "value": "green" }
      ],
      "value": "gray"
    }
  }
}
```

---

## ✅ 最佳实践

### 1. 使用 Schema
```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  ...
}
```

### 2. 显式类型
```json
// ❌ 避免依赖自动推断
{ "field": "date" }

// ✅ 显式指定类型
{ "field": "date", "type": "temporal" }
```

### 3. 数据格式化
```json
// ✅ 使用 format 格式化
{
  "field": "value",
  "type": "quantitative",
  "axis": { "format": ",.2f" }  // 千位分隔符 + 两位小数
}
```

### 4. 交互性
```json
// ✅ 默认启用 tooltip
{
  "mark": { "type": "bar", "tooltip": true }
}

// ✅ 或自定义 tooltip
{
  "encoding": {
    "tooltip": [
      { "field": "name", "type": "nominal" },
      { "field": "value", "type": "quantitative" }
    ]
  }
}
```

### 5. 性能优化
```json
// ✅ 大数据集采样
{
  "transform": [{ "sample": 5000 }]
}

// ✅ 或聚合
{
  "transform": [{
    "aggregate": [{ "op": "mean", "field": "value" }],
    "groupby": ["category"]
  }]
}
```

---

## 📚 参考资源

- [Mark 文档](https://vega.github.io/vega-lite/docs/mark.html)
- [Encoding 文档](https://vega.github.io/vega-lite/docs/encoding.html)
- [Transform 文档](https://vega.github.io/vega-lite/docs/transform.html)
- [Scale 文档](https://vega.github.io/vega-lite/docs/scale.html)
- [类型定义](https://github.com/vega/vega-lite/blob/next/src/spec/index.ts)

---

**最后更新**: 2025-10-13
