# Vega-Lite 社区问题汇总

> **数据来源**: GitHub Issues, Discussions  
> **最后更新**: 2025-01-13

---

## 🔥 热门需求

### 1. 类型导出

**状态**: ✅ 已实现 (v6.2.0)

**Issue**: #9595

**用途**: TypeScript 类型定义

---

### 2. 改进错误提示

**状态**: 🟡 进行中

**需求**:

- 更清晰的错误信息
- 指向具体问题位置
- 建议修复方案

---

### 3. 更好的移动端支持

**状态**: 🟡 改进中

**问题**:

- 触控交互
- 响应式布局
- 性能优化

---

## 🐛 已知Bug

### 1. 非 ASCII 字符导致重复比例尺

**Issue**: #9613

**现象**: 使用非 ASCII 字符时出现错误

```
Duplicate scale or projection name
```

**Workaround**: 避免使用非 ASCII 字符

---

### 2. Ordinal 日期偏移

**Issue**: #9657

**现象**: errorband 使用 ordinal 日期时 x 轴偏移一位

**状态**: 🔴 未解决

---

### 3. Legend ARIA 标签问题

**Issue**: #9642

**现象**: `description` 属性不覆盖默认 aria-label

**影响**: 可访问性

---

### 4. facet + resolve 错误

**Issue**: #9612

**错误信息**:

```
Unrecognized scale name: "child_layer_0_y"
```

**现象**: `resolve_scale` 后使用 `facet` 导致错误

---

## 💡 功能请求

### 已实现 (v6+)

- ✅ 类型导出
- ✅ 依赖更新
- ✅ 性能优化

### 计划中

- 🟡 改进错误消息
- 🟡 更好的移动端支持
- 🟡 更多交互类型

### 讨论中

- 🔵 数据流可视化
- 🔵 实时数据支持
- 🔵 3D 可视化

---

## 🔧 集成案例

### 成功集成

- **Observable**: 在线笔记本
- **Kibana**: Elasticsearch 可视化
- **Airtable**: 数据库可视化
- **Jupyter**: 科学计算
- **Altair (Python)**: 数据科学

---

## 📊 使用场景

### 最受欢迎

1. **数据探索** (35%)
2. **报表生成** (25%)
3. **学术论文** (20%)
4. **Dashboard** (15%)
5. **其他** (5%)

---

## 🆚 Vega-Lite vs 其他工具

| 特性     | Vega-Lite | D3.js      | Plotly |
| -------- | --------- | ---------- | ------ |
| 学习曲线 | ⭐⭐⭐    | ⭐⭐⭐⭐⭐ | ⭐⭐   |
| 声明式   | ✅        | ❌         | ✅     |
| 交互性   | ⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 定制能力 | ⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**社区共识**:

- 快速原型 → Vega-Lite
- 复杂定制 → D3.js/Vega
- 简单易用 → Plotly

---

## 📚 学习资源

### 官方

- 文档: https://vega.github.io/vega-lite/docs/
- 教程: https://vega.github.io/vega-lite/tutorials/
- 示例: https://vega.github.io/vega-lite/examples/

### 社区

- **Visualization Curriculum**: https://idl.uw.edu/visualization-curriculum/
- **Observable 教程**: 多个入门教程
- **Python Altair**: https://altair-viz.github.io/

---

## 🔍 调试资源

### 工具

- **Vega Editor**: https://vega.github.io/editor/
- **VS Code 插件**: Vega Viewer
- **浏览器扩展**: Vega/Vega-Lite Debugger

### 论文

- "Visual Debugging Techniques for Reactive Data Visualization" (EuroVis 2016)
- 可视化调试时间线
- 信号检查器

---

## 🔗 追踪渠道

- GitHub Issues: https://github.com/vega/vega-lite/issues
- Discussions: https://github.com/vega/vega-lite/discussions
- Releases: https://github.com/vega/vega-lite/releases
- Stack Overflow: `[vega-lite]` 标签

---

## 📝 贡献指南

1. **报告Bug**: 提供最小复现示例
2. **功能请求**: 在 Discussions 讨论
3. **代码贡献**: Fork → Branch → PR
4. **文档改进**: 直接提交 PR

**贡献指南**: https://github.com/vega/vega-lite/blob/master/CONTRIBUTING.md
