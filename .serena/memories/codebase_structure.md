# DiagramAI 代码库结构

## 顶级目录结构

```
DiagramAI/
├── src/                    # 源代码目录
├── public/                 # 静态资源
├── data/                   # 数据目录 (提示词文件)
├── scripts/                # 工具脚本
├── logs/                   # 日志目录
├── .next/                  # Next.js 构建产物
├── node_modules/           # 依赖包
├── .serena/                # Serena MCP 项目记忆
├── .husky/                 # Git Hooks
├── .github/                # GitHub 配置
└── data/diagram-ai.db      # SQLite 数据库
```

## src/ 源代码结构

### app/ (Next.js App Router)

- **(app)/** - 保护路由 (需要认证): 主编辑器, 历史记录, 模型配置, Prompt 管理
- **(auth)/** - 认证路由 (公开): 登录, 注册
- **api/** - API 端点: auth, chat, models, history, prompts, recommend, kroki

### components/ (React 组件)

- **auth/** - 认证组件: LoginForm, RegisterForm
- **editor/** - 编辑器组件: CodeEditor, DiagramPreview, InputPanel
- **history/** - 历史记录组件
- **icons/** - 图标系统 (统一 Icon 组件)
- **layout/** - 布局组件: EditorHeader, Header
- **modals/** - 模态对话框
- **models/** - 模型配置组件
- **prompts/** - Prompt 管理组件 (6 个组件)
- **selectors/** - 选择器组件
- **shared/** - 共享组件: Logo, UserMenu
- **theme/** - 主题组件
- **ui/** - 基础 UI 组件 (shadcn/ui)

### lib/ (核心业务逻辑)

- **ai/** - AI 提供商抽象: provider-factory, providers-registry
- **auth/** - 认证系统: jwt, password, middleware
- **constants/** - 常量定义: diagram-types, env, placeholders, prompts
- **db/** - 数据库层: client, schema.sql
- **repositories/** - 数据访问层 (6 个 Repository)
- **services/** - 业务逻辑层 (3 个 Service)
- **stores/** - Zustand 状态管理
- **themes/** - 主题配置
- **utils/** - 工具函数 (10+ 工具)
- **validations/** - Zod 验证模式

### types/ (TypeScript 类型)

- database.ts, diagram.ts, prompt.ts, recommendation.ts 等

### hooks/ (自定义 Hooks)

- useEditorActions, useExportActions, usePrompt, useRecommendation, useReportFailure

### contexts/ (React Context)

- AuthContext, ThemeContext

## data/ 数据目录

```
data/
├── prompts/                # 提示词文件 (113 个文件)
│   ├── universal.txt       # L1 通用规范
│   ├── {language}/         # L2 语言规范 (23 种语言)
│   │   ├── common.txt      # 语言通用规范
│   │   └── {type}.txt      # L3 特定图表类型 (80+ 类型)
│   └── recommend.ts        # 推荐系统提示词
└── diagram-ai.db           # SQLite 数据库
```

## scripts/ 工具脚本

- **init-db.js** - 数据库初始化
- **init-prompts.ts** - Prompt 数据初始化 (从文件系统导入到数据库)
- **analyze-complexity.ts** - 代码复杂度分析

## 关键设计模式

### Repository Pattern (数据访问层)

所有数据库操作通过 Repository 进行:
- UserRepository, ModelRepository, HistoryRepository
- ChatSessionRepository, PromptRepository, RenderFailureLogRepository

### Service Pattern (业务逻辑层)

- DiagramGenerationService - 核心图表生成逻辑
- DiagramEditorService - 编辑器业务逻辑
- FailureLogService - 失败日志收集

### Factory Pattern (AI 提供商)

- provider-factory.ts - 统一的 AI 提供商抽象
- 支持 OpenAI, Anthropic, Google, OpenAI-Compatible

### Store Pattern (状态管理)

- Zustand diagram-store - 图表编辑器状态管理
