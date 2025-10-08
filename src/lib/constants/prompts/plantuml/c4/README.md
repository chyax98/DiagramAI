# C4-PlantUML 提示词文档

## 📋 概述

本目录包含 C4-PlantUML 的完整提示词系统，基于 DEPTH 方法论和三层提示词架构。

### 架构层次

```
L1: 通用规范 (Universal Standards)
  ↓
L2a: PlantUML 语言规范 (../../plantuml/common.ts)
  ↓
L2b: C4-PlantUML 语言规范 (./common.ts)
  ↓
L3: C4 子图类型 (5 种子图)
  ├─ Context (系统上下文图)
  ├─ Container (容器图)
  ├─ Component (组件图)
  ├─ Dynamic (动态图)
  └─ Deployment (部署图)
```

## 📂 文件结构

```
c4/
├── README.md                    # 本文档
├── common.ts                    # L2: C4-PlantUML 语言规范 (~480 tokens)
├── context.ts                   # L3: System Context 图 (~1180 tokens)
├── container.ts                 # L3: Container 图 (~1190 tokens)
├── component.ts                 # L3: Component 图 (~1180 tokens)
├── dynamic.ts                   # L3: Dynamic 图 (~1160 tokens)
├── deployment.ts                # L3: Deployment 图 (~1180 tokens)
└── index.ts                     # 统一导出和辅助函数
```

## 🎯 各子图类型说明

### 1. Context (系统上下文图)
**文件**: `context.ts`  
**用途**: 展示系统与外部用户、外部系统的交互关系  
**适用场景**: 
- 系统整体概览
- 向非技术人员展示系统边界
- 识别外部依赖

**关键元素**:
- `Person` / `Person_Ext`: 用户
- `System` / `System_Ext`: 系统

### 2. Container (容器图)
**文件**: `container.ts`  
**用途**: 展示系统内部的高层技术构成（应用、服务、数据库等）  
**适用场景**:
- 微服务架构设计
- 技术栈选型说明
- 系统模块划分

**关键元素**:
- `Container`: 应用、服务
- `ContainerDb`: 数据库
- `ContainerQueue`: 消息队列
- `System_Boundary`: 系统边界

### 3. Component (组件图)
**文件**: `component.ts`  
**用途**: 展示容器内部的组件划分和代码结构  
**适用场景**:
- 代码架构设计
- 分层架构说明（MVC、DDD）
- 组件职责划分

**关键元素**:
- `Component`: 业务组件
- `ComponentDb`: 数据组件
- `Container_Boundary`: 容器边界

### 4. Dynamic (动态图)
**文件**: `dynamic.ts`  
**用途**: 展示特定场景下的运行时交互和时序  
**适用场景**:
- 业务流程说明
- 时序交互展示
- 调用链路分析

**关键元素**:
- `RelIndex`: 带序号的关系
- 所有 Context/Container/Component 元素

### 5. Deployment (部署图)
**文件**: `deployment.ts`  
**用途**: 展示系统在物理基础设施上的部署架构  
**适用场景**:
- 生产环境架构
- 云服务部署方案
- 容器编排（K8s）

**关键元素**:
- `Deployment_Node`: 部署节点（服务器、虚拟机、集群）
- `Container`: 运行的应用实例

## 🔧 使用方法

### 基础用法

```typescript
import { getC4PlantUMLPrompt } from './index';

// 获取 Context 图的完整提示词
const contextPrompt = getC4PlantUMLPrompt('c4-context');

// 获取 Container 图的完整提示词
const containerPrompt = getC4PlantUMLPrompt('c4-container');
```

### 检查支持

```typescript
import { isC4TypeSupported, getSupportedC4Types } from './index';

// 检查是否支持特定类型
if (isC4TypeSupported('c4-context')) {
  // 支持
}

// 获取所有支持的类型
const types = getSupportedC4Types();
// ['c4-context', 'c4-container', 'c4-component', 'c4-dynamic', 'c4-deployment']
```

## 📊 Token 预算

| 层级 | 文件 | Token 数 | 状态 |
|------|------|----------|------|
| L1 | common.ts (根目录) | ~750 | ✅ |
| L2a | plantuml/common.ts | ~450 | ✅ |
| L2b | c4/common.ts | ~480 | ✅ |
| L3 | context.ts | ~1180 | ✅ |
| L3 | container.ts | ~1190 | ✅ |
| L3 | component.ts | ~1180 | ✅ |
| L3 | dynamic.ts | ~1160 | ✅ |
| L3 | deployment.ts | ~1180 | ✅ |

**总预算**: 约 1680-2900 tokens（L1 + L2a + L2b + L3）

## ✅ 质量标准

所有提示词均符合 PROMPT_WRITING_GUIDE.md 规范：

### DEPTH 框架实现
- ✅ **D** (Define Multiple Perspectives): 3 个专家角色
- ✅ **E** (Establish Success Metrics): 可量化的成功标准
- ✅ **P** (Provide Context Layers): 分层上下文（L1 + L2 + L3）
- ✅ **T** (Task Breakdown): 清晰的任务分解
- ✅ **H** (Human Feedback Loop): 生成检查清单

### 内容完整性
- ✅ 专家视角（3 个角色）
- ✅ 核心语法说明
- ✅ 生成示例（2-3 个）
- ✅ 常见错误（4-6 个）
- ✅ 检查清单（5-8 个检查点）

### Token 控制
- ✅ L2: 480 tokens (预算 200-500)
- ✅ L3: 1160-1190 tokens (预算 800-1200)

## 🔗 相关资源

### 官方文档
- [C4 Model 官方网站](https://c4model.com/)
- [C4-PlantUML GitHub](https://github.com/plantuml-stdlib/C4-PlantUML)
- [PlantUML 官方文档](https://plantuml.com/)
- [Kroki 渲染服务](https://kroki.io/)

### 项目文档
- [PROMPT_WRITING_GUIDE.md](../../../../../../../../claudedocs/PROMPT_WRITING_GUIDE.md) - 提示词编写规范
- [PROMPT_TEAM_TASKS.md](../../../../../../../../claudedocs/PROMPT_TEAM_TASKS.md) - 团队任务分配

## 📝 开发记录

**开发日期**: 2025-01-08  
**开发者**: Droid (AI Assistant)  
**版本**: v1.0

### 完成内容
- ✅ L2: C4-PlantUML 语言规范
- ✅ L3: Context 子图 prompt
- ✅ L3: Container 子图 prompt
- ✅ L3: Component 子图 prompt
- ✅ L3: Dynamic 子图 prompt
- ✅ L3: Deployment 子图 prompt
- ✅ 统一导出和辅助函数

### 测试状态
- ⏳ 待进行人工测试（3 个场景 × 5 种子图）
- ⏳ 待验证 Kroki 渲染
- ⏳ 待集成到主系统

## 🎓 最佳实践

### 1. 选择合适的图表类型
- **Context**: 系统边界和外部交互
- **Container**: 技术架构和模块划分
- **Component**: 代码结构和组件设计
- **Dynamic**: 业务流程和时序交互
- **Deployment**: 部署架构和基础设施

### 2. 保持层次一致性
- 每个图表聚焦单一抽象层次
- 不在 Context 图中使用 Container 元素
- 不在 Container 图中使用 Component 元素

### 3. 完整的技术标注
- Container 和 Component 必须包含技术栈
- Deployment 必须标注环境和实例数
- 关系描述应包含通信协议

### 4. 合理的粒度控制
- Context: 5-10 个系统
- Container: 5-15 个容器
- Component: 5-20 个组件
- Dynamic: 5-15 个步骤
- Deployment: 避免嵌套超过 3 层

## 📞 问题反馈

如有问题或建议，请联系项目维护者或提交 GitHub Issue。

---

**版本**: v1.0  
**最后更新**: 2025-01-08
