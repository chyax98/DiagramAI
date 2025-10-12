# PlantUML 官方文档资源

> 收集时间: 2025-10-13
> 数据来源: PlantUML 官方网站、GitHub、社区论坛

---

## 📚 核心官方文档

### 主文档站点
- **官方网站**: https://plantuml.com
  - 完整的语言参考和示例
  - 支持所有图表类型的详细说明

- **语言参考指南 (PDF)**: https://plantuml.com/guide
  - PlantUML Language Reference Guide (1.2025.0)
  - 606 页完整参考手册
  - 涵盖所有图表类型的语法规则

### 图表类型文档

#### UML 图表
- **时序图**: https://plantuml.com/sequence-diagram
  - 参与者声明、消息传递、激活框
  - 循环、分支、并行结构
  - 注释和样式定制

- **类图**: https://plantuml.com/class-diagram
  - 类、接口、抽象类
  - 关系类型（继承、实现、关联、依赖）
  - 可见性修饰符

- **用例图**: https://plantuml.com/use-case-diagram
  - 参与者和用例
  - 关系（包含、扩展、泛化）
  - 系统边界

- **活动图 (新语法)**: https://plantuml.com/activity-diagram-beta
  - 开始/结束节点
  - 条件分支 (if/then/else)
  - 并行处理 (fork/join)
  - 泳道和分区

- **活动图 (旧语法)**: https://plantuml.com/activity-diagram-legacy
  - 传统活动图语法
  - 向后兼容支持

- **组件图**: https://plantuml.com/component-diagram
  - 组件和接口
  - 端口和连接器
  - 包和分组

- **部署图**: https://plantuml.com/deployment-diagram
  - 节点和制品
  - 部署关系
  - 物理架构

- **状态图**: https://plantuml.com/state-diagram
  - 状态和转换
  - 复合状态
  - 历史状态和并发状态

- **对象图**: https://plantuml.com/object-diagram
  - 对象实例
  - 对象关系
  - 属性值

- **时序图 (Timing)**: https://plantuml.com/timing-diagram
  - 时间轴表示
  - 状态变化
  - 约束和事件

#### 非 UML 图表
- **实体关系图 (ER)**: https://plantuml.com/ie-diagram
  - 实体和属性
  - 关系类型（一对一、一对多、多对多）
  - 基数约束

- **甘特图**: https://plantuml.com/gantt-diagram
  - 任务定义
  - 依赖关系
  - 里程碑和资源

- **思维导图**: https://plantuml.com/mindmap-diagram
  - 分层结构
  - 节点样式
  - 颜色和图标

- **工作分解结构 (WBS)**: https://plantuml.com/wbs-diagram
  - 层次分解
  - 任务编号
  - 样式定制

- **网络图 (nwdiag)**: https://plantuml.com/nwdiag
  - 网络拓扑
  - 设备和连接
  - IP 地址标注

- **线框图**: https://plantuml.com/salt
  - UI 原型
  - 表单和控件
  - 布局和分组

- **架构图 (Archimate)**: https://plantuml.com/archimate-diagram
  - 企业架构
  - 业务、应用、技术层
  - 关系和依赖

- **规范描述语言 (SDL)**: https://plantuml.com/activity-diagram-beta
  - 系统行为规范
  - 消息流和状态

- **Ditaa 图**: https://plantuml.com/ditaa
  - ASCII 艺术转图形
  - 文本框和箭头
  - 自动美化

- **JSON 数据**: https://plantuml.com/json
  - JSON 结构可视化
  - 数据类型标注
  - 嵌套对象

- **YAML 数据**: https://plantuml.com/yaml
  - YAML 结构可视化
  - 层次关系
  - 数据类型

- **数学公式**: https://plantuml.com/ascii-math
  - AsciiMath 支持
  - JLaTeXMath 支持
  - 公式渲染

---

## 🔧 语法和功能文档

### 通用语法
- **关键字参考**: https://plantuml-documentation.readthedocs.io/en/latest/
  - Ashley's PlantUML Documentation
  - 所有图表通用关键字
  - @startuml / @enduml / @startditaa 等

- **标准库**: https://plantuml.com/stdlib
  - Amazon AWS 图标库
  - Cloudogu 服务库
  - Office 图标库
  - Elastic 图标库
  - 自定义 Sprite 和宏

### 样式和主题
- **Skinparam**: https://plantuml.com/skinparam
  - 全局样式参数
  - 颜色、字体、边框
  - 图表特定参数

- **主题**: https://plantuml.com/theme
  - 内置主题
  - 自定义主题
  - 主题继承

- **颜色**: https://plantuml.com/color
  - 颜色名称
  - RGB / HEX 格式
  - 渐变色

### 高级功能
- **预处理**: https://plantuml.com/preprocessing
  - 变量定义 (!define)
  - 条件包含 (!if/!else/!endif)
  - 文件包含 (!include)
  - 宏定义 (!procedure)

- **国际化**: https://plantuml.com/unicode
  - Unicode 支持
  - 多语言文本
  - 字体配置

- **链接和工具提示**: https://plantuml.com/link
  - 超链接
  - 工具提示
  - 交互式 SVG

---

## 🐛 故障排查和 FAQ

### 官方 FAQ
- **常见问题**: https://plantuml.com/faq
  - 布局问题解决方案
  - 性能优化建议
  - 社区论坛链接

### 社区资源
- **官方论坛**: https://forum.plantuml.net
  - 用户讨论
  - 问题解答
  - 功能请求

- **Stack Overflow**: https://stackoverflow.com/questions/tagged/plantuml
  - PlantUML 标签
  - 实际问题案例
  - 社区解决方案

---

## 📦 工具和集成

### 开发工具
- **GitHub 仓库**: https://github.com/plantuml/plantuml
  - 源代码
  - Issue 跟踪: https://github.com/plantuml/plantuml/issues
  - 功能增强: https://github.com/plantuml/plantuml/labels/enhancement

- **PlantUML Server**: https://github.com/plantuml/plantuml-server
  - 服务器部署
  - Web 编辑器
  - API 接口

### 在线工具
- **官方在线编辑器**: http://www.plantuml.com/plantuml/uml
  - 实时预览
  - 多种输出格式
  - 分享链接

- **VS Code 扩展**: https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml
  - 实时预览
  - 自动补全
  - 导出功能

---

## 📝 示例和教程

### 官方示例
- **示例库**: https://plantuml.com/commons
  - 各类图表示例
  - 最佳实践
  - 模板代码

### 第三方教程
- **ChatUML 文档**: https://docs.chatuml.com/docs/overview/dealing-with-syntax-errors
  - AI 辅助生成
  - 语法错误处理
  - 常见问题修复

---

## 🔗 相关资源

### Kroki 集成
- **Kroki 官网**: https://kroki.io
  - PlantUML 渲染支持
  - API 文档
  - 多语言 SDK

### 依赖工具
- **Graphviz**: https://graphviz.org
  - 某些图表类型需要
  - 布局引擎
  - 安装指南

---

## 📊 版本信息

- **当前版本**: 1.2025.0 (截至 2025-10-13)
- **更新日志**: https://plantuml.com/changes
- **版本兼容性**: https://plantuml.com/versioning

---

## 🎯 学习路径建议

### 初学者
1. 从**时序图**开始 - 语法最简单
2. 学习**类图** - 理解关系类型
3. 掌握**活动图** - 了解流程控制

### 进阶用户
1. 学习**预处理**功能 - 提高代码复用
2. 使用**标准库** - 减少重复工作
3. 自定义**主题** - 统一视觉风格

### 高级用户
1. 编写**宏和函数** - 创建 DSL
2. 集成**CI/CD** - 自动生成文档
3. 贡献**开源社区** - 提交 PR 和 Issue

---

*最后更新: 2025-10-13*
*维护者: DiagramAI Team*
