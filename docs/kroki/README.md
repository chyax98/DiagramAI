# Kroki 渲染语言官方文档索引

本目录维护 DiagramAI 支持的所有渲染语言的官方文档、语法规范和常见问题。

## 📁 目录结构

每种渲染语言一个子目录，包含以下标准文件：

```
kroki/
├── README.md (本文件)
├── mermaid/
│   ├── official-docs.md      # 官方文档链接和核心语法
│   ├── syntax-rules.md        # 强制语法规则
│   ├── common-errors.md       # 常见错误和解决方案
│   └── community-issues.md    # 社区问题和 GitHub Issues
├── plantuml/
│   ├── official-docs.md
│   ├── syntax-rules.md
│   ├── common-errors.md
│   └── community-issues.md
└── ... (其他 21 种语言)
```

## 🎯 文档维护原则

1. **数据来源优先级**
   - 官方文档 > 官方 GitHub > 社区讨论
   - 使用 Context7 / Tavily / WebFetch 工具验证
   - 记录验证时间和来源链接

2. **内容要求**
   - 聚焦 **Kroki 环境** 的兼容性
   - 记录真实失败案例和错误信息
   - 避免主观臆断，所有规则必须有来源

3. **更新机制**
   - 发现新的渲染失败时更新对应语言文档
   - 定期检查官方更新（每季度）
   - 版本号变更时重新验证

## 📊 支持的渲染语言 (23 种)

### 主流语言 (前 10)
- [x] mermaid - 14 种图表类型
- [x] plantuml - 8 种 UML 图表
- [x] c4plantuml - 4 种 C4 架构图
- [ ] d2 - 6 种现代化图表
- [ ] graphviz - 5 种图形可视化
- [ ] wavedrom - 3 种数字信号图
- [ ] nomnoml - 3 种简化 UML 图
- [ ] excalidraw - 3 种手绘风格图表
- [ ] vegalite - 6 种数据可视化
- [ ] dbml - 4 种数据库图表

### 扩展语言 (13 种)
- [ ] bpmn - 业务流程建模
- [ ] ditaa - ASCII 艺术转图形
- [ ] nwdiag - 网络拓扑图
- [ ] blockdiag - 块状流程图
- [ ] actdiag - 活动图（泳道图）
- [ ] packetdiag - 网络数据包图
- [ ] rackdiag - 机柜图
- [ ] seqdiag - 时序图（BlockDiag 风格）
- [ ] structurizr - C4 架构建模 DSL
- [ ] erd - 简洁 ER 图语法
- [ ] pikchr - 图表脚本语言
- [ ] svgbob - ASCII 转 SVG 美化
- [ ] umlet - 轻量级 UML 工具

## 🔄 使用方式

1. **开发新 Prompt 时**
   ```bash
   # 先查阅对应语言的官方文档
   cat docs/kroki/<language>/official-docs.md
   cat docs/kroki/<language>/syntax-rules.md
   ```

2. **调试渲染失败时**
   ```bash
   # 查看常见错误和解决方案
   cat docs/kroki/<language>/common-errors.md

   # 搜索相关的社区问题
   cat docs/kroki/<language>/community-issues.md
   ```

3. **更新文档时**
   - 使用 Context7/Tavily 搜索最新信息
   - 记录验证时间和来源
   - 添加真实失败案例

## 📝 维护日志

- 2025-10-13: 创建文档索引结构
- 2025-10-13: 完成 C4-PlantUML 官方语法验证

---

**注意**: 本目录是 AI 助手的知识库，用于生成准确的 Prompt。所有内容必须基于官方文档验证。
