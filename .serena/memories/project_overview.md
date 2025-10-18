# DiagramAI 项目概览

## 项目简介

DiagramAI 是一个 AI 驱动的专业图表生成工具,支持 23 种图表渲染语言和 80+ 种图表类型。用户通过自然语言描述,AI 自动生成专业图表代码,支持实时渲染和导出。

## 核心特性

- **多 AI 提供商**: 支持 OpenAI、Anthropic、Google、OpenAI-Compatible (DeepSeek, SiliconFlow 等)
- **23 种图表语言**: Mermaid、PlantUML、D2、Graphviz、WaveDrom、Excalidraw、C4-PlantUML、Vega-Lite、DBML 等
- **用户自定义提示词**: 三层提示词系统 (L1 通用 + L2 语言 + L3 类型),支持版本管理
- **多轮对话优化**: 支持生成、调整、修复三种任务类型,保持会话上下文
- **实时渲染**: 通过 Kroki 代理实现无 CORS 问题的图表渲染
- **历史记录**: 完整的生成历史,支持收藏和重新编辑
- **认证系统**: JWT + bcrypt 安全认证

## 技术栈

### 核心框架

- **Next.js 15** - React 框架 (App Router)
- **React 19** - UI 库
- **TypeScript 5** - 类型安全
- **Tailwind CSS 4** - 样式系统
- **shadcn/ui** - UI 组件库

### 后端技术

- **SQLite** - 数据库 (better-sqlite3)
- **JWT** - 认证 (jose)
- **bcrypt** - 密码哈希
- **Zod** - 数据验证

### AI 集成

- **Vercel AI SDK** - 统一 AI 接口
- **多提供商**: OpenAI, Anthropic, Google, OpenAI-Compatible

### 图表渲染

- **Kroki** - 图表渲染引擎 (23 种语言)
- **Mermaid** - 前端实时预览
- **pako** - 代码压缩 (deflate + base64url)

### 状态管理

- **Zustand** - 轻量级状态管理
- **React Hook Form** - 表单管理
- **CodeMirror** - 代码编辑器

## 项目规模

- **代码行数**: ~27,500 行 (架构清理后)
- **组件数量**: 50+ React 组件
- **API 端点**: 20+ 个
- **数据库表**: 5 个 (users, ai_models, generation_histories, chat_sessions, custom_prompts)
- **提示词文件**: 113 个 (23 种语言,位于 data/prompts/)

## 开发团队规范

- **代码语言**: TypeScript (严格模式)
- **注释语言**: 中文
- **提交规范**: Conventional Commits (feat/fix/docs/refactor/test/chore)
- **架构模式**: Repository + Service + Factory Pattern

## 当前状态 (2025-10-18)

### ✅ 架构清理已完成

**日期**: 2025-10-18  
**状态**: ✅ 生产就绪  
**评分**: 8.1/10 (优秀)  
**分支**: feat/clean-architecture

**关键改进**:

- ✅ 架构简化 - 从双模式 → 纯数据库 (↓50% 复杂度)
- ✅ 代码精简 - 净减少 1,500 行 (↓5.2%)
- ✅ 文档重写 - 删除所有演进历史,呈现首次发布状态
- ✅ 目录优化 - 提示词迁移到 data/prompts/ (113 个文件)
- ✅ 质量保证 - TypeScript + ESLint 全部通过

**清理统计**:

- 删除文件: 137+ 个
- 修改文件: 30+ 个
- 净减少代码: ~1,500 行 (35%)
- 并行 Agent: 22 个
- 执行时间: ~2 小时

## 重要提示

### 对新加入的开发者

**DiagramAI 现在是一个全新的、无历史包袱的代码库！**

1. **架构**: 纯数据库模式,无文件系统 Fallback
2. **提示词**: 全部在 `data/prompts/` 目录
3. **Schema**: 统一在 `src/lib/db/schema.sql`
4. **迁移**: 无迁移脚本,直接使用最新 Schema
5. **文档**: 首次发布状态,无演进历史

### 维护建议

1. **添加新提示词**:
   - 文件放在 `data/prompts/{language}/`
   - 通过 `seed-default-prompts.ts` 导入数据库
   - 更新 `diagram-types.ts` 类型定义

2. **修改 Schema**:
   - 直接修改 `schema.sql`
   - 运行 `init-db.js` 重新初始化
   - 无需创建迁移脚本

3. **代码修改**:
   - 遵循现有架构模式
   - 保持纯数据库模式
   - 避免引入向后兼容代码

## 详细信息

完整的项目信息请查看其他记忆文件:

- `tech_stack.md` - 技术栈详解
- `architecture_patterns.md` - 架构模式详解
- `codebase_structure.md` - 代码库结构
- `code_style_conventions.md` - 代码规范
- `suggested_commands.md` - 常用命令
- `task_completion_checklist.md` - 任务检查清单
- `key_features_and_workflows.md` - 核心功能详解
- `architecture_cleanup_history.md` - 架构清理历史 (2025-10-18)
