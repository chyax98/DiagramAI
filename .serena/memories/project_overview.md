# DiagramAI 项目概览

## 项目简介

DiagramAI 是一个 AI 驱动的专业图表生成工具,支持 23 种渲染语言和 80+ 种图表类型。

## 核心功能

### 1. 多语言图表支持

- **23 种渲染语言**: Mermaid, PlantUML, D2, Graphviz, WaveDrom, Nomnoml, Excalidraw, C4-PlantUML, Vega-Lite, DBML, BPMN, Ditaa, NwDiag, BlockDiag, ActDiag, PacketDiag, RackDiag, SeqDiag, Structurizr, Erd, Pikchr, SvgBob, UMLet
- **80+ 图表类型**: 流程图, 时序图, 类图, ER 图, 甘特图等

### 2. AI 提供商支持

- OpenAI (GPT-4o, GPT-4o-mini, GPT-4-turbo, GPT-3.5-turbo)
- Anthropic (Claude-3.5-sonnet, Claude-3-opus, Claude-3-sonnet)
- Google (Gemini-1.5-pro, Gemini-1.5-flash)
- OpenAI-Compatible (DeepSeek, SiliconFlow, Together AI, Groq)

### 3. Prompt 管理系统

- **L1 通用规范**: 所有图表共享的基础规范
- **L2 语言规范**: 特定渲染语言的规范 (23 种)
- **L3 类型规范**: 特定图表类型的规范 (80+ 类型)
- **版本控制**: 语义化版本 + 历史回溯
- **智能 Fallback**: 用户自定义 → 系统默认

### 4. 核心功能

- 实时代码预览 (Kroki API 渲染)
- 多格式导出 (PNG, SVG, PDF)
- 多轮对话调整 (基于上下文优化)
- 语法自动修复 (AI 辅助纠错)
- 生成历史管理 (收藏, 搜索, 筛选)
- 推荐系统 (智能推荐相似图表)

## 技术架构

### 前端技术栈

- **框架**: Next.js 15 + React 19 + TypeScript 5
- **状态管理**: Zustand
- **样式**: Tailwind CSS 4 + shadcn/ui
- **编辑器**: CodeMirror 6
- **表单验证**: Zod

### 后端技术栈

- **数据库**: SQLite (better-sqlite3) + Schema v7.0.0
- **认证**: JWT + bcrypt
- **AI SDK**: Vercel AI SDK
- **图表渲染**: Kroki API

### 架构模式

- **Repository Pattern**: 数据访问层抽象
- **Service Pattern**: 业务逻辑层封装
- **Factory Pattern**: AI 提供商抽象

## 数据库 Schema v7.0.0

### 核心表

1. **users** - 用户认证
2. **ai_models** - AI 模型配置
3. **generation_histories** - 生成历史
4. **chat_sessions** - 多轮对话
5. **custom_prompts** - 用户自定义提示词
6. **render_failure_logs** - 失败案例收集

### 关键特性

- 完整的外键约束
- 性能索引优化
- 软删除支持
- 审计追踪

## 目录结构

```
src/
├── app/          # Next.js App Router (页面 + API)
├── components/   # React 组件库 (10+ 子模块)
├── lib/          # 核心业务逻辑
│   ├── ai/       # AI 提供商抽象
│   ├── auth/     # 认证系统
│   ├── db/       # 数据库层
│   ├── repositories/  # 数据访问层 (6 个)
│   ├── services/      # 业务逻辑层 (3 个)
│   └── stores/        # 状态管理
├── types/        # TypeScript 类型定义
├── hooks/        # 自定义 Hooks (5 个)
└── contexts/     # React Contexts (2 个)

data/
├── prompts/      # 提示词文件 (113 个)
└── diagram-ai.db # SQLite 数据库
```

## 性能优化

- API 请求防抖
- React 渲染优化 (useMemo + useCallback)
- Kroki 结果缓存 (1 小时)
- 代码分割和懒加载
- 数据库索引优化

## 安全特性

- JWT 认证 (7 天过期)
- bcrypt 密码哈希 (10 轮)
- API 路由保护中间件
- Zod 输入验证
- SQL 注入防护

## 开发工具

- TypeScript strict 模式
- ESLint + Prettier
- Husky Git Hooks
- Conventional Commits
- 中文注释和文档
