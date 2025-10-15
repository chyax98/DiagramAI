# Mermaid 渲染语言文档集

> DiagramAI 项目 - Kroki + Mermaid 集成参考文档
> 创建时间: 2025-10-13

---

## 📚 文档结构

### 1. [official-docs.md](./official-docs.md)

**Mermaid 官方文档资源**

- 官方网站、GitHub 仓库、文档链接
- 最新版本信息 (v11.4.1)
- 支持的 14+ 种图表类型
- Kroki 集成配置和 API 端点
- 安装方式和工具集成
- 学习资源和社区渠道

**关键信息**:

- Mermaid 官网: https://mermaid.js.org/
- Kroki 主站: https://kroki.io/
- Docker 镜像: `yuzutech/kroki-mermaid`

---

### 2. [syntax-rules.md](./syntax-rules.md)

**Mermaid 强制语法规则**

- 代码块包裹规则 (Markdown/HTML)
- 图表类型声明规范
- 节点与连接语法
- 方向与布局规则
- 样式与主题配置
- Frontmatter YAML 配置
- Kroki 特定限制
- 保留关键字列表
- 特殊字符转义
- 版本差异说明

**核心规则**:

- 必须以图表类型开头 (`graph`, `sequenceDiagram`, `classDiagram` 等)
- 保留关键字必须用引号包裹 (`"end"`, `"start"`, `"class"`)
- Kroki URL 使用 deflate + base64url 编码

---

### 3. [common-errors.md](./common-errors.md)

**Mermaid 常见错误案例**

基于 DiagramAI 生产环境失败日志的真实案例分析:

#### 错误案例

1. **保留关键字 `end` 冲突** (40%)
   - 错误: `Parse error on line 32: got 'end'`
   - 解决: 使用 `"end"` 或改名为 `endNode`

2. **空消息在序列图最后一行** (15%)
   - 错误: Kroki 渲染失败
   - 解决: 将空消息移到中间或添加占位文本

3. **C4-PlantUML 缺少 include** (30%)
   - 错误: `cannot include (line: 1)`
   - 解决: 添加 `!include https://raw.githubusercontent.com/.../C4_Context.puml`

4. **PlantUML 组件图语法错误** (15%)
   - 错误: `Syntax Error? (Assumed diagram type: class)`
   - 解决: 分离样式定义,先定义组件再设置颜色

**数据来源**:

- 失败日志: `/root/Diagram/DiagramAI/logs/render-failures/2025-10-12.jsonl`
- 分析案例: 6 个真实失败案例

---

### 4. [community-issues.md](./community-issues.md)

**Mermaid + Kroki 社区问题汇总**

从 GitHub、Reddit、Stack Overflow 收集的 12 个已知问题:

#### 渲染质量问题

- PNG 导出图像模糊 (Kroki Issue)
- 文本超出边界 (Mermaid #2485)
- 中文字符渲染 (需要字体配置)

#### 功能限制

- Block Diagram 支持缺失 (等待 Kroki 更新)
- ELK/TIDY TREE 布局缺失 (版本依赖)

#### 兼容性问题

- GitLab 不支持 Kroki Mermaid (Issue #498764)
- GitHub Pages 不支持 Mermaid (Jekyll 限制)
- Asciidoctor 集成问题 (已修复 v2.7.16)

#### 性能与稳定性

- 高并发渲染不稳定 (容量问题)
- Docker 容器权限问题 (UID 1001)

#### 集成问题

- Marp 文本缩放问题 (技术限制)
- KeenWrite 前缀语法提案 (避免关键字冲突)

**优先级矩阵**:

- P1 高优先级: PNG 模糊、高并发不稳定
- P2 中优先级: 中文渲染、Block Diagram、Docker UID
- P3 低优先级: GitLab 集成、Marp 缩放

---

## 🎯 使用指南

### 场景 1: 快速查找官方文档

→ 查看 [official-docs.md](./official-docs.md)

### 场景 2: 排查语法错误

→ 查看 [syntax-rules.md](./syntax-rules.md) 和 [common-errors.md](./common-errors.md)

### 场景 3: 解决渲染失败

1. 检查 [common-errors.md](./common-errors.md) 是否有类似案例
2. 查看 [syntax-rules.md](./syntax-rules.md) 验证语法
3. 搜索 [community-issues.md](./community-issues.md) 是否有已知问题

### 场景 4: 生产环境部署

→ 参考 [community-issues.md](./community-issues.md) 的最佳实践部分

---

## 📊 文档统计

| 文档                | 大小        | 章节数 | 案例数  | 链接数  |
| ------------------- | ----------- | ------ | ------- | ------- |
| official-docs.md    | 5.6 KB      | 9      | 0       | 20+     |
| syntax-rules.md     | 6.7 KB      | 10     | 15+     | 10+     |
| common-errors.md    | 7.2 KB      | 8      | 4       | 8+      |
| community-issues.md | 9.9 KB      | 12     | 12      | 15+     |
| **总计**            | **29.4 KB** | **39** | **31+** | **53+** |

---

## 🔄 维护计划

### 更新频率

- **官方文档**: 每季度检查版本更新
- **语法规则**: Mermaid 大版本发布后更新
- **错误案例**: 每月从失败日志提取新案例
- **社区问题**: 每两周检查 GitHub Issues

### 数据来源

- **官方文档**: Mermaid 官网、Kroki 文档
- **语法规则**: 官方语法参考、实战经验
- **错误案例**: DiagramAI 失败日志
- **社区问题**: GitHub Issues、Reddit、Stack Overflow

### 验证工具

- **Tavily 搜索引擎**: 验证最新信息
- **Mermaid Live**: https://mermaid.live/
- **Kroki 测试**: https://kroki.io/#try

---

## 🤝 贡献指南

### 添加新错误案例

1. 从 `/root/Diagram/DiagramAI/logs/render-failures/` 提取失败日志
2. 分析错误原因和解决方案
3. 添加到 [common-errors.md](./common-errors.md)

### 报告新问题

1. 验证问题可复现
2. 搜索 GitHub/Reddit 确认是已知问题
3. 添加到 [community-issues.md](./community-issues.md)

### 更新语法规则

1. 关注 Mermaid 官方 Release Notes
2. 测试新语法特性
3. 更新 [syntax-rules.md](./syntax-rules.md)

---

## 📞 联系方式

- **项目位置**: `/root/Diagram/DiagramAI`
- **文档位置**: `/root/Diagram/DiagramAI/docs/kroki/mermaid/`
- **失败日志**: `/root/Diagram/DiagramAI/logs/render-failures/`
- **分析日志**: `/root/Diagram/DiagramAI/logs/failcause/`

---

**文档版本**: v1.0.0
**创建时间**: 2025-10-13
**最后更新**: 2025-10-13
**维护者**: DiagramAI Team
