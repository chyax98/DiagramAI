# Vega-Lite 常见错误与解决方案

> **最后更新**: 2025-01-13

---

## 🔴 Schema 错误

### 1. Schema 版本不匹配

```json
// ❌ 错误: 使用旧版语法但指定新版 schema
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "selection": {...}  // v4 语法
}

// ✅ 正确: 版本匹配
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "params": [{...}]   // v5 语法
}
```

**错误信息**: Schema validation error

**解决**: 使用编辑器推荐的 schema 版本

---

### 2. Schema URL 错误

```json
// ❌ 错误
"$schema": "https://vega.github.io/schema/vega-lite/v5"

// ✅ 正确
"$schema": "https://vega.github.io/schema/vega-lite/v5.json"
```

---

## 🟡 数据问题

### 1. 字段名不存在

```json
{
  "data": {
    "values": [{ "name": "A", "value": 10 }]
  },
  "encoding": {
    "x": { "field": "category" } // ❌ 字段不存在
  }
}
```

**错误**: 图表为空或警告

**解决**: 使用 Inspector 检查数据

---

### 2. 数据类型错误

```json
// ❌ 错误: 日期字段标记为数值
{
  "x": {
    "field": "date",
    "type": "quantitative"  // 应该是 temporal
  }
}

// ✅ 正确
{
  "x": {
    "field": "date",
    "type": "temporal",
    "timeUnit": "yearmonth"
  }
}
```

---

## 🟠 编码错误

### 1. 通道与标记不兼容

```json
// ❌ 错误: bar 不支持 shape
{
  "mark": "bar",
  "encoding": {
    "shape": {"field": "category"}
  }
}

// ✅ 正确: 使用 color
{
  "mark": "bar",
  "encoding": {
    "color": {"field": "category"}
  }
}
```

**Vega-Lite 会忽略不兼容属性** (浏览器控制台有警告)

---

### 2. 缺失必需通道

```json
// ❌ 错误: bar 需要 x 或 y
{
  "mark": "bar",
  "encoding": {
    "color": {"field": "category"}
  }
}

// ✅ 正确
{
  "mark": "bar",
  "encoding": {
    "x": {"field": "category"},
    "y": {"field": "value"}
  }
}
```

---

## 🔵 比例尺问题

### 1. 发散比例尺配色不可定制

**Issue**: #9611

```json
// ⚠️ 当前无法自定义
{
  "color": {
    "scale": {
      "type": "diverging",
      "scheme": "custom" // 不生效
    }
  }
}
```

**Workaround**: 使用其他比例尺类型

---

### 2. 时区问题

**Issue**: #9651

**现象**: 分面标题日期错误

**临时方案**: 手动转换时区

---

## 🟣 交互错误

### 1. 参数命名冲突

```json
// ❌ 错误: 重复名称
{
  "params": [
    {"name": "brush", ...},
    {"name": "brush", ...}  // 冲突
  ]
}
```

**错误信息**: Duplicate parameter name

---

### 2. Selection 引用错误

```json
// ❌ 错误: v5 使用旧语法
{
  "selection": {...}
}

// ✅ 正确
{
  "params": [{...}]
}
```

---

## 🟤 调试技巧

### 1. 使用 Vega Editor

- 打开: https://vega.github.io/editor/
- 查看数据: Data Viewer
- 检查错误: Console 面板
- 查看信号: Signal Viewer

### 2. 浏览器开发者工具

```bash
# Mac: Cmd+Option+I
# Windows/Linux: Ctrl+Shift+I
```

查看 Console 警告信息

### 3. 启用日志

```js
vega.logger(vega.Warn); // 显示警告
```

---

### 4. 验证 Schema

```bash
# 在线验证
https://vega.github.io/editor/

# 或使用 VS Code 插件
# 安装: Vega Viewer
```

---

## 📋 调试清单

- [ ] Schema 版本正确?
- [ ] 数据加载成功?
- [ ] 字段名存在且拼写正确?
- [ ] 数据类型匹配?
- [ ] 编码通道与标记兼容?
- [ ] 参数名无冲突?
- [ ] 浏览器控制台无警告?

---

## 🔗 参考

- 调试指南: https://vega.github.io/vega-lite/usage/debugging.html
- 常见问题: https://vega.github.io/vega-lite/docs/
- GitHub Issues: https://github.com/vega/vega-lite/issues
- Altair 调试: https://idl.uw.edu/visualization-curriculum/altair_debugging.html
