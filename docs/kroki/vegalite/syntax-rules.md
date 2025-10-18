# Vega-Lite 语法规则

> **Vega-Lite 版本**: v5.x  
> **最后更新**: 2025-01-13

---

## 🎯 基础结构

### 必需字段

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {...},
  "mark": "...",
  "encoding": {...}
}
```

### Schema 版本

- **v5**: 当前稳定版
- **v4**: 旧版本
- **v6**: 开发中

⚠️ **版本必须匹配** - 使用编辑器建议的版本

---

## 📊 数据规范

### 内联数据

```json
{
  "data": {
    "values": [
      { "category": "A", "value": 28 },
      { "category": "B", "value": 55 }
    ]
  }
}
```

### 外部数据

```json
{
  "data": {
    "url": "data.csv",
    "format": { "type": "csv" }
  }
}
```

### 数据源类型

- CSV: `{"type": "csv"}`
- JSON: `{"type": "json"}`
- TopoJSON: `{"type": "topojson"}`

---

## 🎨 标记 (Mark) 规则

### 简单标记

```json
{ "mark": "bar" }
```

### 配置标记

```json
{
  "mark": {
    "type": "bar",
    "color": "steelblue",
    "opacity": 0.7,
    "cornerRadius": 5
  }
}
```

### 标记属性

- `type`: 标记类型
- `color`, `opacity`, `size`
- `filled`, `stroke`, `strokeWidth`

---

## 🔢 编码 (Encoding) 规则

### 字段定义

```json
{
  "encoding": {
    "x": {
      "field": "fieldName", // 字段名
      "type": "quantitative" // 数据类型
    }
  }
}
```

### 数据类型 (Type)

- `"quantitative"`: 数值型
- `"temporal"`: 时间型
- `"ordinal"`: 有序分类
- `"nominal"`: 无序分类
- `"geojson"`: 地理数据

### 聚合函数

```json
{
  "y": {
    "field": "value",
    "aggregate": "mean"
  }
}
```

支持: `count`, `sum`, `mean`, `median`, `min`, `max`, `stdev`

---

## 📐 比例尺 (Scale)

### 基础比例尺

```json
{
  "x": {
    "field": "value",
    "type": "quantitative",
    "scale": {
      "type": "log", // linear, log, sqrt, pow
      "domain": [0, 100], // 定义域
      "range": [0, 500] // 值域
    }
  }
}
```

### 颜色比例尺

```json
{
  "color": {
    "field": "category",
    "scale": {
      "scheme": "category10" // 颜色方案
    }
  }
}
```

---

## 🔄 变换 (Transform)

### 过滤

```json
{
  "transform": [{ "filter": "datum.value > 50" }]
}
```

### 计算字段

```json
{
  "transform": [
    {
      "calculate": "datum.value * 2",
      "as": "doubled"
    }
  ]
}
```

### 分箱

```json
{
  "transform": [
    {
      "bin": { "maxbins": 10 },
      "field": "value",
      "as": "binned_value"
    }
  ]
}
```

---

## 📊 图表组合

### Layer (分层)

```json
{
  "layer": [
    {"mark": "line", "encoding": {...}},
    {"mark": "point", "encoding": {...}}
  ]
}
```

### Concat (拼接)

```json
{
  "hconcat": [
    {"mark": "bar", ...},
    {"mark": "line", ...}
  ]
}
```

### Facet (分面)

```json
{
  "facet": {
    "field": "category",
    "type": "nominal"
  },
  "spec": {
    "mark": "bar",
    "encoding": {...}
  }
}
```

---

## 🎯 交互参数

### Selection (v4-)

```json
{
  "selection": {
    "brush": { "type": "interval" }
  }
}
```

### Params (v5+)

```json
{
  "params": [
    {
      "name": "brush",
      "select": { "type": "interval" }
    }
  ]
}
```

### 选择类型

- `"point"`: 单选
- `"interval"`: 区间选择
- `"multi"`: 多选

---

## 📋 语法检查清单

- [ ] `$schema` 版本正确?
- [ ] 数据类型 (`type`) 正确?
- [ ] 字段名 (`field`) 存在?
- [ ] 标记类型有效?
- [ ] 编码通道适配标记?
- [ ] JSON 格式正确?

---

## 🔗 参考

- 完整语法: https://vega.github.io/vega-lite/docs/
- 编码: https://vega.github.io/vega-lite/docs/encoding.html
- 变换: https://vega.github.io/vega-lite/docs/transform.html
- 组合: https://vega.github.io/vega-lite/docs/composition.html
