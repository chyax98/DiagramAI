# Graphviz 社区问题汇总

> **数据来源**: Forum, GitLab Issues  
> **最后更新**: 2025-01-13

---

## 🔥 热门需求

### 1. 更好的布局控制
**状态**: 持续改进

**需求**:
- 精确节点位置
- 自定义排序
- 避免边交叉

**官方建议**:
- 使用 `rank`, `ordering` 属性
- 调整 `weight` 权重
- 尝试不同布局引擎

---

### 2. 性能优化 (大规模图)
**问题**: 1000+ 节点渲染缓慢

**解决方案**:
```bash
# 使用 sfdp (多尺度力导向)
sfdp -Tsvg large.dot

# 调整参数
neato -Gmaxiter=100 large.dot
```

---

### 3. GitHub 原生支持
**现状**: GitHub 支持 Mermaid,不支持 DOT

**临时方案**:
1. 渲染为 SVG 提交
2. 使用 GitHub Actions 自动化
3. 在 README 链接外部编辑器

---

## 🐛 常见Bug

### 1. dotty 语法错误
**问题**: dotty 工具已废弃

**解决**: 使用现代工具
- VSCode 插件
- 在线编辑器
- Python `graphviz` 库

---

### 2. macOS 依赖过多
**Issue**: Homebrew 安装依赖多

**替代方案**:
```bash
# 使用 MacPorts
sudo port install graphviz

# 或下载预编译二进制
```

---

### 3. Windows 路径问题
**问题**: 反斜杠转义

**解决**:
```dot
// 使用正斜杠
"C:/path/to/file"

// 或转义反斜杠
"C:\\path\\to\\file"
```

---

## 💡 社区技巧

### 1. 调试网络简化算法
- 使用 `-v` 详细模式
- 检查 `trouble in init_rank` 错误
- 分析约束循环

### 2. HTML Label 最佳实践
- 使用表格布局
- 避免过度嵌套
- 测试不同渲染器

### 3. 大图优化
```dot
graph {
  # 减少边交叉
  mclimit=2.0
  
  # 调整节点间距
  nodesep=0.5
  ranksep=1.0
}
```

---

## 🆚 Graphviz vs Mermaid

| 特性 | Graphviz | Mermaid |
|------|----------|---------|
| 历史 | 1990s, 成熟 | 2014, 现代 |
| 学习曲线 | 陡峭 | 平缓 |
| 自定义能力 | 极强 | 中等 |
| GitHub 支持 | ❌ | ✅ |
| 图表类型 | 通用图 | 多种专用图 |

**社区共识**:
- 复杂自定义 → Graphviz
- 快速原型 → Mermaid

---

## 📚 学习资源

- 官方文档: https://graphviz.org/documentation/
- 论坛: https://forum.graphviz.org/
- Stack Overflow: `[graphviz]` 标签
- Python API: https://graphviz.readthedocs.io/

---

## 🔗 追踪渠道

- GitLab: https://gitlab.com/graphviz/graphviz/-/issues
- 论坛: https://forum.graphviz.org/
- Stack Overflow: https://stackoverflow.com/questions/tagged/graphviz
