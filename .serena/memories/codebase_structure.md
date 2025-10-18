# DiagramAI 代码库结构详解

## 顶级目录结构

```
DiagramAI/
├── src/                    # 源代码目录
├── public/                 # 静态资源
├── data/                   # 数据目录 (提示词文件)
├── scripts/                # 工具脚本
├── claudedocs/             # 架构文档
├── logs/                   # 日志目录
├── .next/                  # Next.js 构建产物
├── node_modules/           # 依赖包
├── .serena/                # Serena MCP 项目记忆
├── .husky/                 # Git Hooks
├── .github/                # GitHub 配置
└── diagram.db              # SQLite 数据库
```

## 重要变更 (2025-10-18)

### ⚠️ 提示词目录迁移

**旧位置**: `src/lib/constants/prompts/` (已删除)  
**新位置**: `data/prompts/` (当前)

**原因**:

- 提示词是数据文件,不是代码常量
- 统一数据管理策略
- 清晰的职责分离

**影响的文件**:

- `scripts/seed-default-prompts.ts` - 已更新路径
- `scripts/init-db.js` - 已更新路径
- 所有测试文件 - 已更新引用

### 🗑️ 已删除的目录

```
已删除:
├── src/lib/constants/prompts/  # 提示词已迁移到 data/prompts/
├── src/lib/db/migrations/      # 迁移脚本已删除 (纯数据库模式)
└── claudedocs/PROMPT_*.md      # 演进文档已删除
```

## src/ 目录详解

### app/ (Next.js App Router)

```
app/
├── (app)/                  # 保护路由组 (需要认证)
│   ├── page.tsx            # 主图表编辑器页面
│   ├── layout.tsx          # 应用布局
│   ├── history/            # 生成历史页面
│   │   └── page.tsx
│   ├── models/             # 模型配置页面
│   │   └── page.tsx
│   └── prompts/            # 提示词管理页面
│       └── page.tsx
│
├── (auth)/                 # 认证路由组 (公开访问)
│   ├── login/              # 登录页面
│   │   └── page.tsx
│   └── register/           # 注册页面
│       └── page.tsx
│
├── api/                    # API 端点
│   ├── auth/               # 认证 API
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   └── logout/route.ts
│   ├── chat/               # 图表生成 API
│   │   └── route.ts
│   ├── models/             # 模型管理 API
│   │   ├── route.ts        # 列表 + 创建
│   │   ├── [id]/route.ts   # 更新 + 删除
│   │   └── test/route.ts   # 模型测试
│   ├── history/            # 历史记录 API
│   │   ├── route.ts        # 列表 + 创建
│   │   └── [id]/route.ts   # 查询 + 更新 + 删除
│   ├── recommend/          # 推荐 API
│   │   └── route.ts
│   ├── kroki/              # Kroki 代理 API
│   │   └── [[...path]]/route.ts
│   └── prompts/            # 提示词管理 API
│       ├── route.ts        # 获取激活的提示词
│       ├── versions/route.ts  # 获取版本历史
│       └── [id]/
│           └── activate/route.ts  # 激活版本
│
├── layout.tsx              # 根布局
├── globals.css             # 全局样式
├── error.tsx               # 错误页面
└── not-found.tsx           # 404 页面
```

**路由组说明**:

- `(app)`: 使用括号创建路由组,共享 layout,但不影响 URL 路径
- `(auth)`: 认证相关页面,独立的布局

### components/ (React 组件)

```
components/
├── auth/                   # 认证组件
│   ├── LoginForm.tsx       # 登录表单
│   ├── RegisterForm.tsx    # 注册表单
│   └── AuthGuard.tsx       # 认证守卫
│
├── editor/                 # 编辑器组件
│   ├── DiagramEditor.tsx   # 主编辑器
│   ├── DiagramPreview.tsx  # 图表预览
│   ├── CodeEditor.tsx      # 代码编辑器
│   ├── PromptInput.tsx     # 提示输入
│   ├── ActionButtons.tsx   # 操作按钮
│   └── ExportMenu.tsx      # 导出菜单
│
├── history/                # 历史记录组件
│   ├── HistoryList.tsx     # 历史列表
│   ├── HistoryCard.tsx     # 历史卡片
│   └── HistoryFilter.tsx   # 历史过滤
│
├── icons/                  # 图标组件
│   ├── DiagramIcons.tsx    # 图表图标
│   └── LanguageIcons.tsx   # 语言图标
│
├── layout/                 # 布局组件
│   ├── Header.tsx          # 顶部导航
│   ├── Sidebar.tsx         # 侧边栏
│   └── Footer.tsx          # 页脚
│
├── modals/                 # 模态对话框
│   ├── SaveModal.tsx       # 保存对话框
│   ├── DeleteModal.tsx     # 删除确认
│   └── ExportModal.tsx     # 导出对话框
│
├── models/                 # 模型配置组件
│   ├── ModelList.tsx       # 模型列表
│   ├── ModelCard.tsx       # 模型卡片
│   ├── ModelForm.tsx       # 模型表单
│   └── ModelTest.tsx       # 模型测试
│
├── prompts/                # 提示词管理组件
│   ├── PromptEditor.tsx    # 提示词编辑器
│   ├── PromptList.tsx      # 提示词列表
│   ├── LevelSelector.tsx   # 层级选择器
│   ├── VersionSelector.tsx # 版本选择器
│   ├── VersionHistory.tsx  # 版本历史
│   ├── VersionSaveDialog.tsx  # 版本保存对话框
│   └── PromptPreview.tsx   # 提示词预览
│
├── selectors/              # 选择器组件
│   ├── LanguageSelector.tsx    # 语言选择器
│   ├── DiagramTypeSelector.tsx # 图表类型选择器
│   └── ModelSelector.tsx       # 模型选择器
│
├── shared/                 # 共享组件
│   ├── LoadingSpinner.tsx  # 加载动画
│   ├── ErrorMessage.tsx    # 错误消息
│   ├── Toast.tsx           # 提示消息
│   └── EmptyState.tsx      # 空状态
│
├── theme/                  # 主题组件
│   └── ThemeToggle.tsx     # 主题切换
│
└── ui/                     # 基础 UI 组件 (shadcn/ui)
    ├── button.tsx
    ├── input.tsx
    ├── select.tsx
    ├── label.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── tabs.tsx
    └── ...
```

### lib/ (核心库)

```
lib/
├── ai/                     # AI 集成
│   └── provider-factory.ts # AI 提供商工厂
│
├── auth/                   # 认证
│   ├── jwt.ts              # JWT 令牌处理
│   ├── password.ts         # 密码哈希
│   └── middleware.ts       # 认证中间件
│
├── constants/              # 常量配置
│   ├── env.ts              # 环境变量
│   ├── diagram-types.ts    # 图表类型定义 (SSOT)
│   ├── diagram-validation.ts  # 图表验证规则
│   └── placeholders.ts     # 占位符文本
│   # ⚠️ prompts/ 目录已迁移到 data/prompts/
│
├── db/                     # 数据库
│   ├── client.ts           # SQLite 客户端
│   └── schema.sql          # 数据库 Schema (统一版本)
│   # ⚠️ migrations/ 目录已删除 (纯数据库模式)
│   # ⚠️ schema-prompts*.sql 已合并到 schema.sql
│
├── repositories/           # 数据访问层
│   ├── UserRepository.ts
│   ├── ModelRepository.ts
│   ├── HistoryRepository.ts
│   ├── ChatSessionRepository.ts
│   └── PromptRepository.ts
│
├── services/               # 业务逻辑层
│   ├── DiagramGenerationService.ts  # 核心生成服务
│   ├── DiagramEditorService.ts      # 前端编辑器服务
│   └── FailureLogService.ts         # 失败日志服务
│
├── stores/                 # 状态管理
│   └── diagram-store.ts    # 图表编辑器状态
│
├── themes/                 # 主题配置
│   └── codemirror-theme.ts # CodeMirror 主题
│
├── utils/                  # 工具函数
│   ├── api-client.ts       # API 客户端
│   ├── api-response.ts     # API 响应工具
│   ├── clipboard.ts        # 剪贴板工具
│   ├── code-cleaner.ts     # 代码清理
│   ├── download.ts         # 下载工具
│   ├── kroki.ts            # Kroki URL 生成
│   ├── logger.ts           # 日志工具
│   ├── prompt-loader.ts    # Prompt 加载器 (纯数据库模式)
│   └── svg-to-image.ts     # SVG 转图片
│
└── validations/            # 数据验证 (Zod)
    ├── auth.ts             # 认证验证
    ├── chat.ts             # 聊天验证
    ├── models.ts           # 模型验证
    ├── history.ts          # 历史验证
    └── prompts.ts          # 提示词验证
```

### types/ (TypeScript 类型)

```
types/
├── ai.ts                   # AI 相关类型
│   ├── AIProvider          # AI 提供商枚举
│   ├── AIModel             # AI 模型接口
│   └── ChatMessage         # 聊天消息接口
│
├── common.ts               # 通用类型
│   ├── ApiResponse<T>      # API 响应类型
│   ├── PaginationParams    # 分页参数
│   └── SortParams          # 排序参数
│
├── database.ts             # 数据库类型
│   ├── User                # 用户实体
│   ├── AIModel             # AI 模型实体
│   ├── GenerationHistory   # 生成历史实体
│   ├── ChatSession         # 聊天会话实体
│   └── CustomPrompt        # 自定义提示词实体
│
├── diagram.ts              # 图表类型
│   ├── RenderLanguage      # 渲染语言枚举
│   ├── DiagramType         # 图表类型枚举
│   ├── KrokiDiagramType    # Kroki 图表类型
│   └── DiagramConfig       # 图表配置接口
│
├── prompt.ts               # 提示词类型
│   ├── PromptLevel         # 提示词层级 (L1/L2/L3)
│   ├── PromptMetadata      # 提示词元数据
│   └── PromptVersion       # 提示词版本
│
├── prompt-meta.ts          # 提示词元数据扩展
│
├── recommendation.ts       # 推荐类型
│   └── RecommendationResult
│
└── env.d.ts                # 环境变量类型声明
```

### contexts/ (React Context)

```
contexts/
├── AuthContext.tsx         # 认证上下文
│   ├── AuthProvider        # 认证提供者
│   ├── useAuth             # 认证 Hook
│   └── AuthState           # 认证状态
│
└── ThemeContext.tsx        # 主题上下文
    ├── ThemeProvider       # 主题提供者
    ├── useTheme            # 主题 Hook
    └── ThemeMode           # 主题模式 (light/dark)
```

### hooks/ (自定义 Hooks)

```
hooks/
├── useAuthRedirect.ts      # 认证重定向 Hook
├── useEditorActions.ts     # 编辑器操作 Hook
├── useExportActions.ts     # 导出操作 Hook
├── useRecommendation.ts    # 推荐 Hook
└── usePrompt.ts            # 提示词管理 Hook
```

## data/ 提示词数据目录 (新增)

```
data/
└── prompts/                # 提示词文件 (从 src/lib/constants/ 迁移)
    ├── universal.txt       # L1: 通用规范 (641 行)
    │
    ├── mermaid/            # Mermaid 提示词 (14 种类型)
    │   ├── common.txt      # L2: 语言规范
    │   ├── flowchart.txt   # L3: 流程图
    │   ├── sequence.txt    # L3: 时序图
    │   ├── class.txt       # L3: 类图
    │   └── ...
    │
    ├── plantuml/           # PlantUML 提示词 (8 种类型)
    │   ├── common.txt
    │   ├── sequence.txt
    │   └── ...
    │
    ├── d2/                 # D2 提示词 (7 种类型)
    ├── graphviz/           # Graphviz 提示词 (6 种类型)
    ├── wavedrom/           # WaveDrom 提示词 (4 种类型)
    ├── nomnoml/            # Nomnoml 提示词 (4 种类型)
    ├── excalidraw/         # Excalidraw 提示词 (5 种类型)
    ├── c4/                 # C4-PlantUML 提示词 (4 种类型)
    ├── vegalite/           # Vega-Lite 提示词 (6 种类型)
    ├── dbml/               # DBML 提示词 (4 种类型)
    │
    └── ... (其他 13 种扩展语言)

总计: 113 个提示词文件 (23 种语言)
```

**重要说明**:

- ⚠️ 所有提示词文件已从 `src/lib/constants/prompts/` 迁移到 `data/prompts/`
- ⚠️ 代码引用已全部更新
- ✅ 数据目录与代码目录清晰分离

## public/ 静态资源

```
public/
├── icons/
│   └── languages/          # 语言图标 (23 个 SVG)
│       ├── mermaid.svg
│       ├── plantuml.svg
│       ├── d2.svg
│       └── ...
└── favicon.ico             # 网站图标
```

## scripts/ 工具脚本

```
scripts/
├── init-db.js              # 初始化数据库 (已更新路径)
├── seed-db.js              # 填充测试数据
└── seed-default-prompts.ts # 导入默认提示词 (已更新路径)

# ⚠️ 已删除的脚本:
# - migrate-db.ts (迁移脚本,纯数据库模式不需要)
# - test-prompt-repository*.ts (临时测试脚本)
# - benchmark-prompt-loading.ts (性能测试脚本)
# - verify-types.ts (类型验证脚本)
# - README-seed-prompts.md (临时文档)
```

## claudedocs/ 架构文档

```
claudedocs/
├── ARCHITECTURE_CLEANUP_FINAL_REPORT.md    # 架构清理报告
├── PROMPTS_DIRECTORY_MIGRATION_REPORT.md   # 提示词迁移报告
├── FINAL_CLEANUP_COMPLETE_REPORT.md        # 完整总结报告
└── ... (其他技术文档)

# ⚠️ 已删除的演进文档 (12 个):
# - PROMPT_ARCHITECTURE_V2.md
# - PROMPT_MIGRATION_REPORT.md
# - PROMPT_INTEGRATION_TEST.md
# - ARCHITECTURE_CLEANUP_*.md (演进历史)
# 等...
```

## 配置文件

```
根目录/
├── package.json            # 依赖和脚本
├── tsconfig.json           # TypeScript 配置
├── eslint.config.mjs       # ESLint 配置
├── .prettierrc             # Prettier 配置
├── .prettierignore         # Prettier 忽略
├── next.config.ts          # Next.js 配置
├── postcss.config.mjs      # PostCSS 配置
├── tailwind.config.ts      # Tailwind 配置 (通过 postcss)
├── components.json         # shadcn/ui 配置
├── knip.json               # Knip 死代码检测配置
├── .gitignore              # Git 忽略文件
├── .npmrc                  # npm 配置
├── env.example             # 环境变量示例
├── .env.local              # 环境变量 (本地,不提交)
├── README.md               # 项目说明
├── README.en.md            # 英文说明
├── CLAUDE.md               # 架构指南 (主文档)
├── KROKI_DEPLOYMENT.md     # Kroki 部署指南
├── LICENSE                 # 开源协议
└── ecosystem.config.cjs    # PM2 配置
```

## 关键文件定位

### 需要频繁修改的文件

**添加新功能**:

- `src/app/api/` - 添加新 API 端点
- `src/lib/services/` - 添加新业务逻辑
- `src/components/` - 添加新 UI 组件

**添加新图表语言**:

- `src/lib/constants/diagram-types.ts` - 定义新类型
- `data/prompts/{language}/` - 添加提示词文件 ⚠️ 注意新路径
- `src/lib/db/schema.sql` - 更新 Schema 枚举

**修改 AI 提示词**:

- `data/prompts/` - 修改提示词文件 ⚠️ 注意新路径
- 或通过 `/prompts` 页面在线编辑

**修改样式**:

- `src/app/globals.css` - 全局样式
- `src/components/` - 组件内联样式
- Tailwind classes - 组件中的 className

### 不建议修改的文件

**核心架构**:

- `src/lib/auth/` - 认证系统 (除非安全需求)
- `src/lib/db/client.ts` - 数据库客户端
- `src/lib/ai/provider-factory.ts` - AI 工厂 (除非新增提供商)
- `src/lib/utils/prompt-loader.ts` - Prompt 加载器 (纯数据库模式)

**生成文件**:

- `.next/` - Next.js 构建产物
- `node_modules/` - 依赖包
- `tsconfig.tsbuildinfo` - TypeScript 增量编译缓存

## 文件命名约定

### 组件文件

- React 组件: PascalCase (例: `DiagramEditor.tsx`, `ModelSelector.tsx`)
- 页面组件: `page.tsx`, `layout.tsx`, `error.tsx`
- API 路由: `route.ts`

### 工具文件

- 工具函数: kebab-case (例: `code-cleaner.ts`, `prompt-loader.ts`)
- 类型定义: kebab-case (例: `diagram-types.ts`, `database.ts`)
- Repository: PascalCase (例: `UserRepository.ts`, `ModelRepository.ts`)
- Service: PascalCase (例: `DiagramGenerationService.ts`)

### 配置文件

- Next.js: `next.config.ts`
- TypeScript: `tsconfig.json`
- ESLint: `eslint.config.mjs`
- Prettier: `.prettierrc`

## 代码搜索技巧

### 查找组件定义

```bash
grep -r "export function ComponentName" src/components/
```

### 查找类型定义

```bash
grep -r "interface TypeName" src/types/
grep -r "type TypeName" src/types/
```

### 查找 API 端点

```bash
find src/app/api -name "route.ts"
```

### 查找 Repository 方法

```bash
grep -r "class.*Repository" src/lib/repositories/
```

### 查找提示词文件 (⚠️ 注意新路径)

```bash
# 新路径
find data/prompts -name "*.txt"

# 旧路径 (已删除,不要使用)
# find src/lib/constants/prompts -name "*.txt"
```

## 架构清理后的变更总结

### ✅ 已删除

1. **迁移脚本**: `src/lib/db/migrations/` (7 个文件)
2. **旧 Schema**: `schema-prompts.sql`, `schema-prompts-v2.sql`
3. **临时脚本**: 6 个测试和性能脚本
4. **演进文档**: 12 个历史文档
5. **旧提示词目录**: `src/lib/constants/prompts/` (113 个文件)

### ✅ 已迁移

1. **提示词文件**: `src/lib/constants/prompts/` → `data/prompts/` (113 个文件)

### ✅ 已更新

1. **初始化脚本**: `init-db.js`, `seed-default-prompts.ts` (路径引用)
2. **核心代码**: `prompt-loader.ts` (删除 239 行向后兼容代码)
3. **文档**: CLAUDE.md, README.md (删除版本历史)

### ⚠️ 重要提示

对未来开发者:

1. **提示词位置**: 全部在 `data/prompts/`,不在 `src/lib/constants/`
2. **Schema**: 统一在 `schema.sql`,无迁移脚本
3. **加载模式**: 纯数据库,无文件系统 Fallback
4. **代码引用**: 所有路径已更新,使用新路径
