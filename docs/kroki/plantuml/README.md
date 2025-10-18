# PlantUML 渲染语言文档

> DiagramAI 项目 - PlantUML 官方文档、语法规范和社区资源汇总
>
> 收集时间: 2025-10-13
> 维护者: DiagramAI Team

---

## 📚 文档概览

本目录包含 PlantUML 渲染语言的完整参考文档，涵盖官方资源、语法规则、常见错误和社区问题。

### 文档列表

| 文档                                             | 内容               | 行数 | 用途                   |
| ------------------------------------------------ | ------------------ | ---- | ---------------------- |
| **[official-docs.md](./official-docs.md)**       | 官方文档链接汇总   | 292  | 快速查找官方资源       |
| **[syntax-rules.md](./syntax-rules.md)**         | 强制语法规则       | 584  | 学习核心语法           |
| **[common-errors.md](./common-errors.md)**       | 常见错误手册       | 662  | 调试和错误修复         |
| **[community-issues.md](./community-issues.md)** | 社区问题与解决方案 | 471  | 了解已知问题和最佳实践 |

**总计**: 2,009 行文档

---

## 🎯 快速导航

### 📖 我是新手，从哪里开始？

1. **阅读 [syntax-rules.md](./syntax-rules.md)**
   - 学习基本语法规则
   - 了解图表声明格式
   - 掌握箭头和关系语法

2. **参考 [official-docs.md](./official-docs.md)**
   - 查找具体图表类型的官方文档
   - 访问在线编辑器实时验证
   - 下载 PDF 语言参考指南

3. **遇到错误时查看 [common-errors.md](./common-errors.md)**
   - 12 大类语法错误详解
   - 每种错误的正确示例
   - 调试技巧和工具推荐

---

### 🐛 我遇到了错误，如何解决？

#### 步骤 1: 识别错误类型

```bash
# 检查是否是以下常见错误之一：
✓ 缺少 @startuml/@enduml 标记
✓ 箭头语法不正确
✓ 参与者名称包含特殊字符
✓ 关系符号方向错误
✓ if/endif 或 fork/end fork 不匹配
```

#### 步骤 2: 查找解决方案

1. **[common-errors.md](./common-errors.md)** - 662 行常见错误手册
   - 12 大错误类别
   - 具体错误示例和正确代码
   - 错误速查表

2. **[community-issues.md](./community-issues.md)** - 471 行社区问题库
   - GitHub 开放问题
   - 性能优化技巧
   - 布局问题解决方案

#### 步骤 3: 使用调试工具

- **在线编辑器**: http://www.plantuml.com/plantuml/uml
- **VS Code 扩展**: 实时语法检查
- **注释调试法**: 逐步注释代码定位问题

---

### 🚀 我想了解高级功能

#### 预处理和宏定义

参考 [syntax-rules.md](./syntax-rules.md) 第 8 节：

- `!define` 变量定义
- `!include` 文件包含
- `!procedure` 宏定义
- `!if/!else/!endif` 条件编译

#### 性能优化

参考 [community-issues.md](./community-issues.md) 第 6、13 节：

- 避免宏括号不匹配（性能杀手）
- 拆分大型图表
- 使用延迟加载 `!include`
- JRE 版本兼容性

#### 布局控制

参考 [community-issues.md](./community-issues.md) 第 7 节：

- 设置布局方向（`left to right direction`）
- 调整间距（`skinparam nodesep/ranksep`）
- 使用隐藏箭头优化布局
- 参与者顺序控制

---

## 📊 PlantUML 支持的图表类型

### UML 图表（9 种）

- ✅ 时序图 (Sequence Diagram)
- ✅ 类图 (Class Diagram)
- ✅ 用例图 (Use Case Diagram)
- ✅ 活动图 (Activity Diagram)
- ✅ 组件图 (Component Diagram)
- ✅ 部署图 (Deployment Diagram)
- ✅ 状态图 (State Diagram)
- ✅ 对象图 (Object Diagram)
- ✅ 时序图 (Timing Diagram)

### 非 UML 图表（15+ 种）

- ✅ 实体关系图 (ER Diagram)
- ✅ 甘特图 (Gantt Chart)
- ✅ 思维导图 (MindMap)
- ✅ 工作分解结构 (WBS)
- ✅ 网络图 (nwdiag)
- ✅ 线框图 (Salt)
- ✅ 架构图 (Archimate)
- ✅ 规范描述语言 (SDL)
- ✅ Ditaa 图 (ASCII Art)
- ✅ JSON/YAML 数据可视化
- ✅ 数学公式 (AsciiMath/LaTeX)

详细文档请查看 [official-docs.md](./official-docs.md)

---

## 🔧 工具和资源

### 在线工具

- **官方编辑器**: http://www.plantuml.com/plantuml/uml
- **在线渲染**: https://kroki.io (支持 PlantUML)

### IDE 集成

- **VS Code**: [PlantUML 扩展](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml)
- **IntelliJ IDEA**: PlantUML Integration 插件
- **Eclipse**: PlantUML Eclipse Plugin

### 文档和学习

- **官方网站**: https://plantuml.com
- **语言参考 (PDF)**: https://plantuml.com/guide (606 页)
- **官方论坛**: https://forum.plantuml.net
- **GitHub**: https://github.com/plantuml/plantuml

---

## 📈 版本信息

### 当前版本

- **PlantUML**: v1.2025.0 (截至 2025-10-13)
- **文档基于**: PlantUML Language Reference Guide 1.2025.0

### 最新改进（v1.2025.x）

- ✅ JRE 21 性能优化
- ✅ 甘特图布局修复
- ✅ Teoz 时序图增强
- ✅ Javadoc 改进

详细更新日志: https://plantuml.com/changes

---

## 🔗 相关文档

### DiagramAI 项目文档

- **主架构文档**: `/root/Diagram/DiagramAI/CLAUDE.md`
- **Kroki 部署指南**: `/root/Diagram/DiagramAI/KROKI_DEPLOYMENT.md`

### 其他渲染语言文档

```
/root/Diagram/DiagramAI/docs/kroki/
├── mermaid/        # Mermaid 文档
├── plantuml/       # PlantUML 文档（当前）
├── d2/             # D2 文档
└── ...             # 其他 20+ 种渲染语言
```

---

## 🤝 贡献指南

### 发现文档错误或需要更新？

1. 检查官方文档是否有更新
2. 提交 Issue 或 Pull Request
3. 标注数据来源和收集时间

### 报告 PlantUML Bug

1. 访问 https://github.com/plantuml/plantuml/issues
2. 提供最小可复现示例
3. 说明版本和环境信息

---

## 📝 许可和致谢

- **PlantUML**: Apache License 2.0
- **文档编写**: DiagramAI Team
- **数据来源**: PlantUML 官方、GitHub、Stack Overflow、社区论坛

---

_最后更新: 2025-10-13_
_文档维护: DiagramAI Team_
