# DiagramAI 技术栈详解

## 运行环境

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **系统**: macOS (Darwin)

## 核心依赖

### 前端框架

```
next: ^15.3.0                  # Next.js 框架
react: ^19.1.0                 # React UI 库
react-dom: ^19.1.0             # React DOM 渲染
```

### AI 集成

```
ai: ^5.0.60                    # Vercel AI SDK (核心)
@ai-sdk/openai: ^2.0.42        # OpenAI 提供商
@ai-sdk/anthropic: ^2.0.23     # Anthropic (Claude) 提供商
@ai-sdk/google: ^2.0.17        # Google (Gemini) 提供商
@ai-sdk/cerebras: ^1.0.25      # Cerebras 提供商
@ai-sdk/openai-compatible: ^1.0.19  # OpenAI 兼容提供商 (DeepSeek, SiliconFlow 等)
```

### 数据库与认证

```
better-sqlite3: ^12.4.0        # SQLite 数据库
jose: ^6.1.0                   # JWT 令牌处理
bcrypt: ^6.0.0                 # 密码哈希
zod: ^3.25.76                  # 数据验证
```

### UI 组件

```
@radix-ui/react-label: ^2.1.7  # Radix UI Label
@radix-ui/react-select: ^2.2.6 # Radix UI Select
lucide-react: ^0.544.0         # 图标库
class-variance-authority: ^0.7.1  # CSS 变体管理
clsx: ^2.1.1                   # 条件类名
tailwind-merge: ^3.3.1         # Tailwind 类名合并
```

### 代码编辑器

```
@uiw/react-codemirror: ^4.25.2 # CodeMirror React 包装
@uiw/codemirror-themes: ^4.25.2  # CodeMirror 主题
@codemirror/lang-javascript: ^6.2.4  # JavaScript 语言支持
@codemirror/lang-markdown: ^6.4.0    # Markdown 语言支持
```

### 状态管理与表单

```
zustand: ^5.0.8                # 状态管理
react-hook-form: ^7.64.0       # 表单管理
@hookform/resolvers: ^3.10.0   # 表单验证解析器
```

### 工具库

```
pako: ^2.1.0                   # Deflate 压缩 (Kroki URL 编码)
file-saver: ^2.0.5             # 文件保存
canvg: ^4.0.3                  # Canvas SVG 渲染
mermaid: ^11.12.0              # Mermaid 图表库
react-zoom-pan-pinch: ^3.7.0   # 缩放平移组件
```

### 样式系统

```
tailwindcss: ^4.0.0            # Tailwind CSS
@tailwindcss/postcss: ^4.1.14  # PostCSS 插件
postcss: ^8.4.50               # PostCSS
autoprefixer: ^10.4.20         # CSS 前缀
critters: ^0.0.23              # CSS 内联优化
```

## 开发工具

### TypeScript 与类型

```
typescript: ^5.9.0             # TypeScript 编译器
@types/node: ^20.17.0          # Node.js 类型
@types/react: ^19.1.0          # React 类型
@types/react-dom: ^19.1.0      # React DOM 类型
@types/bcrypt: ^5.0.2          # bcrypt 类型
@types/better-sqlite3: ^7.6.12 # SQLite 类型
@types/file-saver: ^2.0.7      # file-saver 类型
@types/pako: ^2.0.4            # pako 类型
```

### 代码质量

```
eslint: ^9.20.0                # ESLint 代码检查
eslint-config-next: ^15.3.0    # Next.js ESLint 配置
prettier: ^3.4.2               # 代码格式化
knip: ^5.65.0                  # 死代码检测
depcheck: ^1.4.7               # 依赖检查
```

## 架构模式

### Repository Pattern (数据访问层)

- `UserRepository` - 用户数据
- `ModelRepository` - AI 模型配置
- `HistoryRepository` - 生成历史
- `ChatSessionRepository` - 聊天会话
- `PromptRepository` - 自定义提示词

### Service Pattern (业务逻辑层)

- `DiagramGenerationService` - 核心图表生成服务
- `DiagramEditorService` - 前端编辑器服务
- `FailureLogService` - 失败日志服务

### Factory Pattern (AI 提供商)

- `getAIProvider()` - 统一的 AI 提供商工厂函数
- 支持 4 种提供商: OpenAI, Anthropic, Google, OpenAI-Compatible

## 数据库 Schema 版本

**当前版本**: v6.0.0

**主要表结构**:

- `users` - 用户账户
- `ai_models` - AI 提供商配置
- `generation_histories` - 生成的图表
- `chat_sessions` - 多轮对话会话
- `custom_prompts` - 用户自定义提示词 (v6.0.0 新增)
