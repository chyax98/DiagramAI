# DiagramAI 架构模式与设计原则

## 核心架构模式

### 1. Repository Pattern (数据访问层)

**职责**: 封装所有数据库操作,提供清晰的数据访问接口

**实现位置**: `src/lib/repositories/`

**核心 Repository**:

- `UserRepository.ts` - 用户数据管理
- `ModelRepository.ts` - AI 模型配置管理
- `HistoryRepository.ts` - 生成历史管理
- `ChatSessionRepository.ts` - 聊天会话管理
- `PromptRepository.ts` - 自定义提示词管理

**设计原则**:

- ✅ 所有数据库操作必须通过 Repository
- ✅ Repository 只处理数据持久化,不包含业务逻辑
- ✅ 返回数据库实体或 null,不抛出错误
- ✅ 使用 better-sqlite3 的事务 API 保证原子性
- ❌ 不要在 Repository 中进行数据转换或业务验证

**典型方法**:

```typescript
class UserRepository {
  create(data: CreateUserData): User;
  findById(userId: number): User | null;
  findByUsername(username: string): User | null;
  update(userId: number, data: UpdateUserData): void;
  delete(userId: number): void;
}
```

### 2. Service Pattern (业务逻辑层)

**职责**: 实现核心业务逻辑,协调多个 Repository 和外部服务

**实现位置**: `src/lib/services/`

**核心 Service**:

- `DiagramGenerationService.ts` - 图表生成核心服务
- `DiagramEditorService.ts` - 前端编辑器业务逻辑
- `FailureLogService.ts` - 失败日志记录服务

**设计原则**:

- ✅ Service 通过构造函数注入 Repository 依赖
- ✅ 包含完整的业务逻辑和流程控制
- ✅ 抛出有意义的业务错误供上层处理
- ✅ 协调多个 Repository 和外部 API 调用
- ❌ 不直接操作数据库,必须通过 Repository

**典型方法**:

```typescript
class DiagramGenerationService {
  constructor(
    private historyRepo: HistoryRepository,
    private sessionRepo: ChatSessionRepository
  ) {}

  async chat(params: ChatParams): Promise<ChatResult> {
    // 1. 任务类型决策
    // 2. AI 调用
    // 3. 代码清理
    // 4. 会话管理
    // 5. 失败日志
  }
}
```

### 3. Factory Pattern (AI 提供商)

**职责**: 创建不同 AI 提供商的统一接口

**实现位置**: `src/lib/ai/provider-factory.ts`

**支持的提供商**:

- OpenAI (GPT-3.5, GPT-4, GPT-4o 等)
- Anthropic (Claude 3.5 Sonnet, Claude 3 Opus 等)
- Google (Gemini Pro, Gemini 1.5 等)
- OpenAI-Compatible (DeepSeek, SiliconFlow, Together AI, Groq 等)

**设计原则**:

- ✅ 统一的 AI 模型接口 (基于 Vercel AI SDK)
- ✅ 根据 provider 类型动态创建对应的客户端
- ✅ 支持自定义 API 端点 (OpenAI-Compatible)
- ✅ 统一的错误处理和重试逻辑

**使用示例**:

```typescript
const model = getAIProvider({
  provider: "openai",
  model_id: "gpt-4o",
  api_key: "sk-...",
  api_endpoint: "https://api.openai.com/v1", // 可选
});
```

## 分层架构

### 请求流程 (自上而下)

```
用户请求
    ↓
API 层 (/app/api/)
    ↓ (验证 + 认证)
Service 层 (/lib/services/)
    ↓ (业务逻辑)
Repository 层 (/lib/repositories/)
    ↓ (数据访问)
Database (SQLite)
```

### 层次职责

**API 层** (`src/app/api/`)

- 接收 HTTP 请求
- 使用 Zod 验证请求参数
- 调用 Service 层处理业务逻辑
- 使用 `apiSuccess()` 和 `apiError()` 统一响应格式
- 使用 `withAuth` 中间件保护路由

**Service 层** (`src/lib/services/`)

- 实现核心业务逻辑
- 协调多个 Repository
- 调用外部 API (AI 提供商, Kroki 等)
- 数据转换和业务验证
- 错误处理和日志记录

**Repository 层** (`src/lib/repositories/`)

- 封装数据库操作
- 提供 CRUD 接口
- 处理数据持久化
- 事务管理
- 不包含业务逻辑

## 前端架构

### 组件层次

```
Pages/Routes (app/)
    ↓
UI Components (components/)
    ↓
Custom Hooks (hooks/)
    ↓
Service Layer (lib/services/)
    ↓
API Client (lib/utils/api-client.ts)
    ↓
API Routes (app/api/)
```

### 状态管理

**全局状态** (Zustand)

- `diagram-store.ts` - 图表编辑器状态
- 包含: 当前代码, 渲染语言, 图表类型, 会话 ID 等

**局部状态** (useState)

- 组件内部的 UI 状态
- 表单输入状态
- 临时 UI 控制状态

**表单状态** (React Hook Form)

- 登录/注册表单
- 模型配置表单
- 使用 Zod 进行验证

### 数据获取模式

**自定义 Hook 封装**

```typescript
// hooks/useEditorActions.ts
export function useEditorActions() {
  const generate = async (params) => {
    const service = new DiagramEditorService();
    return await service.generate(params);
  };

  return { generate, adjust, fix, save };
}
```

**API 客户端工具**

```typescript
// lib/utils/api-client.ts
export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

## Prompt 系统架构 (已简化)

### ⚠️ 架构清理后的变更 (2025-10-18)

**旧架构**: 双模式 (文件系统 + 数据库)  
**新架构**: 纯数据库模式

**删除的功能**:

- ❌ 文件系统 Fallback
- ❌ 双路径加载逻辑
- ❌ 向后兼容代码 (239 行)

**保留的功能**:

- ✅ 三层提示词系统 (L1 + L2 + L3)
- ✅ 用户自定义提示词
- ✅ 版本管理和历史回溯
- ✅ 数据库优先加载

### 三层提示词系统

**层级结构**:

**L1 - 通用规范** (`data/prompts/universal.txt`)

- 所有图表共享的通用规范
- 641 行,包含所有语言的基础要求
- 只有一个文件

**L2 - 语言规范** (`data/prompts/{language}/common.txt`)

- 每种语言的通用规范
- 21/23 种语言有此文件
- 可选层级

**L3 - 类型规范** (`data/prompts/{language}/{type}.txt`)

- 特定图表类型的规范
- 必需层级
- 80+ 个文件

### 提示词位置 (⚠️ 重要变更)

**旧位置** (已删除): `src/lib/constants/prompts/`  
**新位置** (当前): `data/prompts/`

**迁移影响**:

- ✅ 初始化脚本已更新 (`init-db.js`, `seed-default-prompts.ts`)
- ✅ 所有代码引用已更新
- ✅ 提示词与代码清晰分离

### 加载逻辑 (简化后)

**纯数据库模式** (`src/lib/utils/prompt-loader.ts`):

```typescript
export async function loadPrompt(
  renderLanguage: RenderLanguage,
  diagramType: DiagramType,
  userId: number
): Promise<string> {
  // 1. 从数据库加载用户自定义提示词
  const L1 = await PromptRepository.getActivePrompt(userId, "L1", null, null);
  const L2 = await PromptRepository.getActivePrompt(userId, "L2", renderLanguage, null);
  const L3 = await PromptRepository.getActivePrompt(userId, "L3", renderLanguage, diagramType);

  // 2. 拼接三层 Prompt
  return `${L1}\n---\n${L2}\n---\n${L3}`;
}
```

**说明**:

- ✅ 所有提示词从数据库加载
- ✅ 简化为单一路径,无 Fallback
- ✅ 代码从 350 行减少到 111 行 (↓68%)

### SSOT (Single Source of Truth)

**类型定义**: `src/lib/constants/diagram-types.ts`

**三方对齐关系**:

```
前端类型定义 (diagram-types.ts)
     ↓
必须完全匹配
     ↓
提示词文件 (data/prompts/{language}/{type}.txt)
     ↓
必须完全匹配
     ↓
数据库枚举 (schema.sql)
```

## 数据库设计

### Schema 版本管理 (已简化)

**当前版本**: 统一 Schema (无版本号)

**架构清理后的变更**:

- ✅ 合并 3 个 Schema 文件 → 1 个统一文件
- ✅ 删除所有迁移脚本 (7 个)
- ✅ 直接使用最新 Schema,无版本历史

**Schema 文件**:

- `src/lib/db/schema.sql` - 统一 Schema (包含所有表)

**说明**:

- ❌ 无 `schema-prompts.sql` (已合并)
- ❌ 无 `schema-prompts-v2.sql` (已合并)
- ❌ 无 `migrations/` 目录 (已删除)

### 关系设计

```
users (1) ─────── (N) ai_models
  │                      │
  │                      │
  ├─────── (N) generation_histories
  │                      │
  │                      │
  ├─────── (N) chat_sessions
  │
  │
  └─────── (N) custom_prompts
```

**外键约束**:

- 所有外键使用 `ON DELETE CASCADE`
- 删除用户时自动删除关联数据
- 保证数据一致性

**数据表**:

- `users` - 用户账户
- `ai_models` - AI 提供商配置
- `generation_histories` - 生成的图表
- `chat_sessions` - 多轮对话会话
- `custom_prompts` - 用户自定义提示词

## 错误处理策略

### API 层错误处理

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. 验证请求
    const body = await request.json();
    const validated = schema.parse(body);

    // 2. 调用 Service
    const result = await service.handle(validated);

    // 3. 返回成功响应
    return apiSuccess(result);
  } catch (error) {
    // 4. 统一错误处理
    if (error instanceof z.ZodError) {
      return apiError("验证失败", 400, error.errors);
    }

    return apiError(error.message || "服务器错误", 500);
  }
}
```

### Service 层错误处理

```typescript
class DiagramGenerationService {
  async chat(params: ChatParams): Promise<ChatResult> {
    try {
      // 业务逻辑
    } catch (error) {
      // 记录日志
      logger.error("图表生成失败", error);

      // 抛出业务错误
      throw new Error(`生成失败: ${error.message}`);
    }
  }
}
```

### 前端错误处理

```typescript
async function handleGenerate() {
  try {
    const result = await service.generate(params);
    // 成功处理
  } catch (error) {
    // 显示错误消息
    toast.error(error.message);
  }
}
```

## 安全设计

### 认证与授权

**JWT 认证**:

- 使用 jose 库生成和验证 JWT
- 7 天过期时间
- 存储在 HttpOnly Cookie (生产环境)

**密码哈希**:

- 使用 bcrypt 进行密码哈希
- 10 轮哈希 (生产环境建议 12 轮)

**API 路由保护**:

```typescript
// 使用 withAuth 中间件
const handler = withAuth(async (request, user) => {
  // 只有认证用户可以访问
  // user 包含用户信息
});
```

### 输入验证

**Zod 验证**:

- 所有 API 输入使用 Zod 验证
- 防止 SQL 注入和 XSS 攻击
- 验证模式定义在 `src/lib/validations/`

**参数化查询**:

- 所有 SQL 查询使用参数化
- 防止 SQL 注入攻击

## 性能优化

### 代码层面

**Lazy Loading**:

- 大型组件使用动态导入
- 减少初始加载时间

**Memoization**:

- 使用 React.memo 避免不必要的重渲染
- 使用 useMemo/useCallback 优化计算和函数

### 数据库层面

**索引优化**:

- 所有外键添加索引
- 常用查询字段添加索引
- 复合索引优化复杂查询

**查询优化**:

- 使用 EXPLAIN 分析查询计划
- 避免 N+1 查询问题
- 使用事务减少数据库往返

### API 层面

**缓存策略**:

- Kroki 图表缓存 1 小时
- 静态资源使用 CDN 缓存

**流式响应**:

- AI 生成使用流式响应 (未来计划)
- 改善用户体验

## 架构清理成果 (2025-10-18)

### 简化统计

| 维度             | 清理前 | 清理后   | 改进        |
| ---------------- | ------ | -------- | ----------- |
| Prompt 加载模式  | 双模式 | 纯数据库 | ↓50% 复杂度 |
| Schema 文件      | 3 个   | 1 个     | ↓67%        |
| prompt-loader.ts | 350 行 | 111 行   | ↓68%        |
| 迁移脚本         | 7 个   | 0 个     | ↓100%       |

### 架构优势

1. **简洁性** - 单一数据源,无 Fallback 逻辑
2. **可维护性** - 代码量减少 68%,逻辑清晰
3. **一致性** - 统一 Schema,无版本碎片
4. **扩展性** - 纯数据库模式,易于扩展

### 重要提示

**对未来开发者**:

1. **Prompt 加载**: 纯数据库模式,无文件系统 Fallback
2. **Schema**: 统一文件,无迁移脚本
3. **代码修改**: 避免引入向后兼容逻辑
4. **提示词位置**: `data/prompts/`,不在 `src/lib/constants/`
