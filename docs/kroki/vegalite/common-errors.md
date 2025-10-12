# Vega-Lite 常见错误和解决方案

> 更新时间: 2025-10-13
> 基于 GitHub Issues、Stack Overflow 和社区反馈整理

---

## 🚨 规范错误 (Specification Errors)

### 1. Schema 验证失败

**症状**:
```
SchemaValidationError: Invalid specification
altair.vegalite.v4.api.Chart, validating 'required'
```

**原因**:
- 缺少必需字段
- 字段类型不匹配
- 拼写错误

**解决方案**:
```json
// ❌ 错误: 缺少 type
{
  "encoding": {
    "x": { "field": "date" }
  }
}

// ✅ 正确: 显式指定 type
{
  "encoding": {
    "x": { "field": "date", "type": "temporal" }
  }
}

// ❌ 错误: mark 类型拼写错误
{ "mark": "barr" }

// ✅ 正确
{ "mark": "bar" }
```

**调试技巧**:
```python
# Python (Altair)
import altair as alt

try:
    chart.to_dict()
except alt.SchemaValidationError as e:
    print(e)
```

---

### 2. 数据格式错误

**症状**:
```
Cannot use 'in' operator to search for 'url' in undefined
```

**原因**:
- `data` 对象格式错误
- 在 Streamlit 中使用内联数据

**解决方案**:
```json
// ❌ 错误: 直接传递数据
{
  "data": [{"a": 1, "b": 2}]
}

// ✅ 正确: 使用 values
{
  "data": {
    "values": [{"a": 1, "b": 2}]
  }
}

// ✅ 或使用 URL
{
  "data": {
    "url": "data.json"
  }
}
```

**Streamlit 特殊处理**:
```python
# ❌ 不要在 spec 中包含 data
spec = {
    "data": {"values": df.to_dict('records')},
    ...
}

# ✅ 将 data 单独传递
spec = {
    "mark": "bar",
    "encoding": {...}
}
st.vega_lite_chart(df, spec)
```

**GitHub Issue**: [streamlit/streamlit#4062](https://github.com/streamlit/streamlit/issues/4062)

---

## 📊 数据和编码错误

### 3. 无限范围错误

**症状**:
```
Warning: Infinite extent for field "value": [Infinity, -Infinity]
```

**原因**:
- 字段包含 `null`, `NaN`, `Infinity` 值
- 数据类型不匹配

**解决方案**:
```json
// 1. 过滤无效数据
{
  "transform": [{
    "filter": "isValid(datum.value)"
  }]
}

// 2. 使用 invalid 处理
{
  "mark": { "type": "bar", "invalid": "filter" }
}

// 3. 检查数据类型
{
  "encoding": {
    "x": {
      "field": "value",
      "type": "quantitative",  // 确保类型正确
      "scale": { "zero": false }
    }
  }
}
```

**数据检查**:
```javascript
// 检查数据问题
const data = [...];
data.forEach((d, i) => {
  if (!isFinite(d.value)) {
    console.error(`Invalid value at index ${i}:`, d);
  }
});
```

**参考**: [Elastic Docs - Vega Debugging](https://www.elastic.co/docs/explore-analyze/visualize/custom-visualizations-with-vega)

---

### 4. 时区问题 (Facet Headers)

**症状**:
- 分面列/行标题不考虑时区
- 日期显示偏移一天

**原因**:
- Vega-Lite 默认使用 UTC 时间
- 本地时间与 UTC 时间不一致

**解决方案**:
```json
// 方案 1: 使用 utc 时间单位
{
  "encoding": {
    "x": {
      "field": "date",
      "type": "temporal",
      "timeUnit": "utcyearmonthdate"  // 注意 utc 前缀
    }
  }
}

// 方案 2: 配置全局时区
{
  "config": {
    "timeFormat": "%Y-%m-%d",
    "axis": {
      "labelExpr": "timeFormat(datum.value, '%Y-%m-%d')"
    }
  }
}

// 方案 3: 转换为本地时间
{
  "transform": [{
    "calculate": "datetime(year(datum.date), month(datum.date), date(datum.date))",
    "as": "local_date"
  }],
  "encoding": {
    "x": { "field": "local_date", "type": "temporal" }
  }
}
```

**GitHub Issue**: [vega/vega-lite#9612](https://github.com/vega/vega-lite/issues/9612)

---

### 5. 序数日期偏移问题 (errorband)

**症状**:
- 使用 `errorband` 标记时,X 轴日期偏移一天
- 仅影响序数日期刻度

**原因**:
- errorband 与序数日期刻度的交互 bug

**解决方案**:
```json
// ❌ 避免: 序数日期 + errorband
{
  "mark": "errorband",
  "encoding": {
    "x": { "field": "date", "type": "ordinal" }
  }
}

// ✅ 使用 temporal 类型
{
  "mark": "errorband",
  "encoding": {
    "x": { "field": "date", "type": "temporal" }
  }
}

// ✅ 或使用 line + area 组合
{
  "layer": [
    {
      "mark": { "type": "area", "opacity": 0.3 },
      "encoding": {
        "y": { "field": "lower", "type": "quantitative" },
        "y2": { "field": "upper" }
      }
    },
    {
      "mark": "line",
      "encoding": {
        "y": { "field": "mean", "type": "quantitative" }
      }
    }
  ]
}
```

**GitHub Issue**: [vega/vega-lite#9613](https://github.com/vega/vega-lite/issues/9613)

---

## 🎨 样式和渲染错误

### 6. 刻度名称冲突 (非 ASCII 字符)

**症状**:
```
Unrecognized scale name: "child_layer_0_y"
Error: Duplicate scale or projection name
```

**原因**:
- 字段名包含非 ASCII 字符 (中文、日文等)
- `resolve: scaled` + `facet` 组合导致名称冲突

**解决方案**:
```json
// 方案 1: 重命名字段 (使用 ASCII)
{
  "transform": [{
    "calculate": "datum['中文字段']",
    "as": "chinese_field"
  }],
  "encoding": {
    "x": { "field": "chinese_field", "type": "quantitative" }
  }
}

// 方案 2: 避免 resolve + facet 组合
{
  "facet": { "field": "category", "type": "nominal" },
  "spec": {
    // 不使用 resolve
    ...
  }
}

// 方案 3: 使用 repeat 替代 facet
{
  "repeat": { "row": ["field1", "field2"] },
  "spec": { ... }
}
```

**GitHub Issue**: [vega/vega-lite#9614](https://github.com/vega/vega-lite/issues/9614)

---

### 7. 颜色方案不可自定义 (diverging scale)

**症状**:
- 使用 `diverging` scale 类型时无法自定义颜色
- `scheme` 和 `range` 都不起作用

**原因**:
- Vega-Lite 对 diverging scale 的限制

**解决方案**:
```json
// ❌ 不生效
{
  "encoding": {
    "color": {
      "field": "value",
      "type": "quantitative",
      "scale": {
        "type": "diverging",
        "scheme": "redblue"  // 不生效
      }
    }
  }
}

// ✅ 使用 linear scale + 自定义 domain
{
  "encoding": {
    "color": {
      "field": "value",
      "type": "quantitative",
      "scale": {
        "type": "linear",
        "domain": [-100, 0, 100],
        "range": ["blue", "white", "red"]
      }
    }
  }
}

// ✅ 或使用 threshold scale
{
  "encoding": {
    "color": {
      "field": "value",
      "type": "quantitative",
      "scale": {
        "type": "threshold",
        "domain": [-50, 0, 50],
        "range": ["blue", "lightblue", "pink", "red"]
      }
    }
  }
}
```

**GitHub Issue**: [vega/vega-lite#9611](https://github.com/vega/vega-lite/issues/9611)

---

### 8. 双图例问题 (strokeDash + color)

**症状**:
- 同时使用自定义颜色和 `strokeDash` 时生成两个图例
- 预期只有一个图例

**原因**:
- Vega-Lite 将 `color` 和 `strokeDash` 视为独立通道

**解决方案**:
```json
// ❌ 会生成两个图例
{
  "encoding": {
    "color": {
      "field": "category",
      "type": "nominal",
      "scale": { "range": ["red", "blue"] }
    },
    "strokeDash": {
      "field": "category",
      "type": "nominal"
    }
  }
}

// ✅ 方案 1: 只使用一个通道
{
  "encoding": {
    "color": {
      "field": "category",
      "type": "nominal",
      "scale": { "range": ["red", "blue"] },
      "legend": { "title": "Category" }
    }
  }
}

// ✅ 方案 2: 合并图例
{
  "encoding": {
    "color": { "field": "category", "type": "nominal" },
    "strokeDash": {
      "field": "category",
      "type": "nominal",
      "legend": null  // 隐藏 strokeDash 图例
    }
  }
}
```

**GitHub Issue**: [vega/vega-lite#9615](https://github.com/vega/vega-lite/issues/9615)

---

## 🔧 交互和缩放错误

### 9. 缩放范围限制

**症状**:
- 希望限制缩放范围 (例如 X 轴 0-1000)
- `clamp: true` 不起作用

**原因**:
- Vega-Lite 的交互式缩放绕过 scale 的 clamp

**解决方案**:
```json
// ❌ clamp 对交互无效
{
  "params": [{
    "name": "zoom",
    "select": { "type": "interval", "bind": "scales" }
  }],
  "encoding": {
    "x": {
      "field": "value",
      "scale": {
        "domain": [0, 1000],
        "clamp": true  // 无效
      }
    }
  }
}

// ✅ 方案 1: 过滤数据
{
  "transform": [{
    "filter": "datum.value >= 0 && datum.value <= 1000"
  }]
}

// ✅ 方案 2: 使用 Vega (低级 API)
{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "signals": [
    {
      "name": "xDomain",
      "on": [{
        "events": {"type": "zoom"},
        "update": "clampRange(xDomain, 0, 1000)"
      }]
    }
  ]
}
```

**GitHub Issue**: [vega/vega-lite#4886](https://github.com/vega/vega-lite/issues/4886)

---

### 10. 信号引用问题 (Selection)

**症状**:
```
Error: signal reference not found
```

**原因**:
- 在 selection 的 event stream 中使用信号引用

**解决方案**:
```json
// ❌ 不支持信号引用
{
  "params": [{
    "name": "select",
    "select": {
      "type": "point",
      "on": "mySignal"  // 错误
    }
  }]
}

// ✅ 使用固定事件
{
  "params": [{
    "name": "select",
    "select": {
      "type": "point",
      "on": "click"
    }
  }]
}

// ✅ 或使用 Vega (支持信号)
{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "signals": [
    { "name": "myEvent", "value": "click" }
  ],
  "marks": [{
    "type": "symbol",
    "encode": {
      "update": {
        "fill": {
          "signal": "mySignal"
        }
      }
    }
  }]
}
```

**GitHub Issue**: [vega/vega-lite#3090](https://github.com/vega/vega-lite/issues/3090)

---

## 📐 布局和尺寸错误

### 11. 文本换行导致堆叠条形图错位

**症状**:
- 轴标签换行后,堆叠条形图布局错乱
- 条形位置不对齐

**原因**:
- 文本换行改变了 Y 轴分类的映射

**解决方案**:
```json
// ❌ 避免: 文本换行 + 堆叠
{
  "mark": "bar",
  "encoding": {
    "y": {
      "field": "category",
      "type": "nominal",
      "axis": {
        "labelLimit": 100,
        "labelExpr": "split(datum.label, ' ')"  // 换行
      }
    },
    "x": { "field": "value", "type": "quantitative" },
    "color": { "field": "group", "type": "nominal" }
  }
}

// ✅ 方案 1: 预处理数据 (添加换行符)
{
  "transform": [{
    "calculate": "replace(datum.category, ' ', '\\n')",
    "as": "category_wrapped"
  }],
  "encoding": {
    "y": { "field": "category_wrapped", "type": "nominal" }
  }
}

// ✅ 方案 2: 使用短标签
{
  "transform": [{
    "calculate": "slice(datum.category, 0, 20) + '...'",
    "as": "category_short"
  }]
}

// ✅ 方案 3: 旋转标签
{
  "encoding": {
    "y": {
      "field": "category",
      "axis": { "labelAngle": -45 }
    }
  }
}
```

**GitHub Issue**: [vega/vega-lite#9441](https://github.com/vega/vega-lite/issues/9441)

---

### 12. 图表打印时不调整大小

**症状**:
- 网页打印时 Vega-Lite 图表大小不变
- PDF 导出时图表被截断

**原因**:
- Vega-Lite 使用固定像素尺寸
- 打印媒体查询未触发调整

**解决方案**:
```json
// ✅ 使用响应式尺寸
{
  "width": "container",
  "height": 400,
  "autosize": {
    "type": "fit",
    "contains": "padding"
  }
}

// ✅ 或使用打印 CSS
<style>
@media print {
  .vega-embed {
    width: 100% !important;
    height: auto !important;
  }
  .vega-embed canvas {
    max-width: 100%;
    height: auto;
  }
}
</style>

// ✅ JavaScript 动态调整
window.addEventListener('beforeprint', () => {
  vegaView.width(800).height(600).run();
});
```

**GitHub Issue**: [vega/vega-lite#9616](https://github.com/vega/vega-lite/issues/9616)

---

## 🔍 调试技巧

### 1. Vega Debug 工具

```javascript
// 在浏览器控制台
VEGA_DEBUG.view.data('source_0')  // 原始数据
VEGA_DEBUG.view.data('data_0')    // 编码数据
VEGA_DEBUG.view.signal('width')   // 信号值
VEGA_DEBUG.vega_spec              // 编译后的 Vega 规范
```

### 2. 启用日志

```javascript
// Vega 视图
const view = new vega.View(...)
  .logLevel(vega.Warn)  // None, Warn, Info, Debug
  .run();

// 调试表达式
{
  "transform": [{
    "calculate": "warn('Value:', datum.value)",  // 打印到控制台
    "as": "debug"
  }]
}
```

### 3. 验证规范

```python
# Python (Altair)
import altair as alt

chart = alt.Chart(...)
spec = chart.to_dict()

# 验证 schema
alt.Chart.from_dict(spec)  # 会抛出验证错误
```

```javascript
// JavaScript
const Ajv = require('ajv');
const schema = require('vega-lite/build/vega-lite-schema.json');

const ajv = new Ajv();
const validate = ajv.compile(schema);
const valid = validate(spec);

if (!valid) {
  console.error(validate.errors);
}
```

### 4. 渐进式调试

```json
// 1. 最小规范
{
  "mark": "bar",
  "encoding": {
    "x": { "field": "a", "type": "nominal" },
    "y": { "field": "b", "type": "quantitative" }
  }
}

// 2. 添加数据
{
  "data": { "values": [...] },
  ...
}

// 3. 添加样式
{
  "mark": { "type": "bar", "color": "steelblue" },
  ...
}

// 4. 添加交互
{
  "params": [...],
  ...
}
```

---

## 📚 参考资源

### 官方调试文档
- [Vega-Lite Debugging Guide](https://vega.github.io/vega-lite/usage/debugging.html)
- [Vega Debugging Guide](https://vega.github.io/vega/docs/api/debugging/)
- [Altair Debugging](https://idl.uw.edu/visualization-curriculum/altair_debugging.html)

### 常见问题
- [Stack Overflow - vega-lite](https://stackoverflow.com/questions/tagged/vega-lite)
- [GitHub Issues](https://github.com/vega/vega-lite/issues)
- [Slack Community](https://bit.ly/join-vega-slack)

### 相关工具
- [Vega Editor](https://vega.github.io/editor/) - 在线调试
- [JSONLint](https://jsonlint.com/) - JSON 语法验证
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) - 浏览器调试

---

## 🏆 故障排查清单

### 规范错误
- [ ] 检查 `$schema` 版本
- [ ] 验证必需字段 (`mark`, `encoding`)
- [ ] 检查字段拼写和大小写
- [ ] 确认数据类型 (`type`)

### 数据错误
- [ ] 检查 `data.values` 格式
- [ ] 验证字段名存在
- [ ] 过滤无效值 (`null`, `NaN`, `Infinity`)
- [ ] 确认数据类型匹配

### 渲染错误
- [ ] 检查浏览器控制台错误
- [ ] 使用 Vega Editor 测试
- [ ] 验证 Vega/Vega-Lite 版本
- [ ] 检查 CSS 冲突

### 交互错误
- [ ] 验证 `params` 语法
- [ ] 检查 selection 绑定
- [ ] 测试事件触发
- [ ] 检查条件表达式

---

**最后更新**: 2025-10-13
**适用版本**: Vega-Lite v6.4+, Vega v5.30+
