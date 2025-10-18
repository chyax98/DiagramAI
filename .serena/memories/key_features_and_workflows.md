# DiagramAI 核心功能与工作流程

## 核心功能概览

### 1. AI 驱动的图表生成

**功能描述**: 用户输入自然语言描述,AI 自动生成专业图表代码

**支持的操作**:

- **Generate (生成)**: 从自然语言描述生成全新图表
- **Adjust (调整)**: 基于现有图表进行优化和调整
- **Fix (修复)**: 修复图表语法错误,保持逻辑不变

**技术实现**:

- 使用三层 Prompt 系统 (L1 通用 + L2 语言 + L3 类型)
- 多轮对话上下文管理 (ChatSession)
- 任务类型自动识别 (通过 taskType 参数)
- 代码清理和格式化 (cleanCode)

**工作流程**:

```
用户输入描述
    ↓
选择渲染语言 + 图表类型
    ↓
DiagramGenerationService.chat()
    ↓
加载 L1 + L2 + L3 Prompt
    ↓
调用 AI Provider (OpenAI/Anthropic/Google/...)
    ↓
清理生成的代码 (移除 markdown 标记)
    ↓
保存到 generation_histories
    ↓
更新/创建 ChatSession
    ↓
返回生成的代码
    ↓
前端渲染图表 (通过 Kroki)
```

### 2. 23 种图表语言支持

**主流语言** (前 10):

1. **Mermaid** - 14 种图表类型
2. **PlantUML** - 8 种 UML 图表
3. **D2** - 7 种现代化图表
4. **Graphviz** - 6 种图形可视化
5. **WaveDrom** - 4 种数字信号图
6. **Nomnoml** - 4 种简化 UML 图
7. **Excalidraw** - 5 种手绘风格图表
8. **C4-PlantUML** - 4 种 C4 架构图
9. **Vega-Lite** - 6 种数据可视化
10. **DBML** - 4 种数据库图表

**扩展语言** (13 种):
BPMN, Ditaa, NwDiag, BlockDiag, ActDiag, PacketDiag, RackDiag, SeqDiag, Structurizr, Erd, Pikchr, SvgBob, UMLet

**总计**: 80+ 种图表类型

**实现要点**:

- 类型定义在 `diagram-types.ts` (SSOT)
- Prompt 文件在 `prompts/{language}/{type}.txt`
- 必须保持三方对齐: 前端定义 ↔ Prompt 文件 ↔ 数据库枚举

### 3. 多 AI 提供商支持

**支持的提供商**:

- **OpenAI**: GPT-3.5, GPT-4, GPT-4o, GPT-4o-mini
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **Google**: Gemini Pro, Gemini 1.5 Pro, Gemini 1.5 Flash
- **OpenAI-Compatible**: DeepSeek, SiliconFlow, Together AI, Groq, 零一万物, Moonshot AI

**技术实现**:

- AI Provider Factory 模式 (`provider-factory.ts`)
- 基于 Vercel AI SDK 的统一接口
- 支持自定义 API 端点 (OpenAI-Compatible)
- 统一的错误处理和重试逻辑

**配置管理**:

- 用户可配置多个 AI 模型 (AIModel 表)
- 每个模型独立配置: provider, api_key, api_endpoint, model_id, parameters
- 支持模型测试功能 (test/route.ts)

### 4. 实时图表渲染

**渲染引擎**: Kroki (https://kroki.io)

**架构特点**:

- **代理模式**: 前端请求通过 Next.js API 代理到 Kroki
- **CORS 解决**: 避免浏览器直接访问 Kroki 的 CORS 问题
- **URL 编码**: deflate 压缩 + base64url 编码
- **缓存优化**: 1 小时浏览器缓存

**渲染流程**:

```
DiagramPreview 组件
    ↓
generateKrokiURL(code, language, format)
    ↓
pako.deflate(code, { level: 9 })
    ↓
base64UrlEncode(compressed)
    ↓
/api/kroki/{language}/{format}/{encoded}
    ↓
Next.js Proxy (route.ts)
    ↓
Kroki Internal URL (https://kroki.io 或本地 Docker)
    ↓
返回 SVG/PNG 图像
    ↓
浏览器渲染并缓存
```

### 5. 用户自定义提示词 (v6.0.0)

**功能特性**:

- **版本管理**: 语义化版本号 (v1.0.0, v1.0.1, ...)
- **历史回溯**: 激活任意历史版本
- **实时编辑**: CodeMirror 编辑器
- **用户隔离**: 每个用户的自定义提示词独立
- **智能 Fallback**: 数据库优先 → 文件系统默认

**三层提示词系统**:

- **L1 (通用)**: 所有图表共享 (universal.txt)
- **L2 (语言)**: 特定语言规范 (如 mermaid/common.txt)
- **L3 (类型)**: 特定图表类型 (如 mermaid/flowchart.txt)

**工作流程**:

```
访问 /prompts 页面
    ↓
选择层级 (L1/L2/L3) + 语言 + 类型
    ↓
加载当前激活版本 (GET /api/prompts/:level)
    ↓
CodeMirror 编辑器编辑
    ↓
保存新版本 (POST /api/prompts)
    ↓
版本号自动递增 (v1.0.0 → v1.0.1)
    ↓
激活新版本 (PUT /api/prompts/:id/activate)
    ↓
返回主编辑器测试效果
```

### 6. 生成历史管理

**功能描述**: 保存所有生成的图表,支持查看、收藏、重新编辑

**数据模型**:

```typescript
interface GenerationHistory {
  id: number;
  user_id: number;
  input_text: string; // 用户输入的描述
  render_language: string; // 渲染语言 (mermaid, plantuml 等)
  diagram_type: string; // 图表类型 (flowchart, sequence 等)
  generated_code: string; // 生成的代码
  model_id: number; // 使用的 AI 模型
  is_saved: boolean; // 是否收藏
  render_error: string | null; // 渲染错误 (如有)
  created_at: string; // 创建时间
}
```

**API 端点**:

- `GET /api/history` - 获取历史列表 (支持过滤和分页)
- `GET /api/history/:id` - 获取单条历史
- `PUT /api/history/:id` - 更新历史 (如收藏状态)
- `DELETE /api/history/:id` - 删除历史

**过滤功能**:

- 按渲染语言过滤
- 按图表类型过滤
- 按收藏状态过滤
- 按时间范围过滤

### 7. 多轮对话优化

**功能描述**: 保持对话上下文,支持连续优化图表

**数据模型**:

```typescript
interface ChatSession {
  id: number;
  user_id: number;
  generation_history_id: number; // 关联的历史记录
  session_data: string; // JSON 格式的消息历史
  round_count: number; // 对话轮数
  created_at: string;
  updated_at: string;
}
```

**会话数据结构**:

```typescript
interface SessionData {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  metadata: {
    render_language: string;
    diagram_type: string;
    task_type: "generate" | "adjust" | "fix";
  };
}
```

**工作流程**:

```
首次生成 (Generate)
    ↓
创建 ChatSession
    ↓
保存消息历史
    ↓
用户请求调整 (Adjust)
    ↓
加载 ChatSession
    ↓
追加新消息
    ↓
AI 基于上下文生成
    ↓
更新 ChatSession (round_count++)
    ↓
返回优化后的代码
```

### 8. AI 模型配置管理

**功能描述**: 用户可配置和管理多个 AI 模型

**数据模型**:

```typescript
interface AIModel {
  id: number;
  user_id: number;
  name: string; // 模型名称 (用户自定义)
  provider: string; // openai, anthropic, google, openai-compatible
  api_endpoint: string; // API 端点
  api_key: string; // API 密钥
  model_id: string; // 模型 ID (gpt-4o, claude-3-5-sonnet 等)
  parameters: string; // JSON 格式的参数 (temperature, max_tokens 等)
  created_at: string;
}
```

**API 端点**:

- `GET /api/models` - 获取用户的所有模型
- `POST /api/models` - 创建新模型
- `PUT /api/models/:id` - 更新模型
- `DELETE /api/models/:id` - 删除模型
- `POST /api/models/test` - 测试模型连接

**配置参数**:

```typescript
interface ModelParameters {
  temperature?: number; // 0.0 - 2.0 (默认 0.7)
  max_tokens?: number; // 最大生成 token 数
  top_p?: number; // 0.0 - 1.0
  frequency_penalty?: number; // -2.0 - 2.0
  presence_penalty?: number; // -2.0 - 2.0
}
```

### 9. 导出功能

**支持的格式**:

- **SVG**: 矢量图,适合印刷
- **PNG**: 位图,适合网页
- **代码**: 图表源代码

**导出流程**:

```
用户点击导出按钮
    ↓
选择导出格式 (SVG/PNG/Code)
    ↓
SVG/PNG: 通过 Kroki 获取渲染图像
    ↓
Code: 直接使用生成的代码
    ↓
使用 file-saver 下载文件
    ↓
文件名格式: diagram-{timestamp}.{ext}
```

**技术实现**:

- SVG: 直接下载 Kroki 返回的 SVG
- PNG: SVG → Canvas → PNG (使用 canvg)
- Code: 使用 Blob 创建下载链接

### 10. 认证系统

**认证方式**: JWT + bcrypt

**用户流程**:

```
注册
    ↓
输入用户名 + 密码
    ↓
密码 bcrypt 哈希 (10 轮)
    ↓
保存到 users 表
    ↓
登录
    ↓
验证用户名 + 密码
    ↓
生成 JWT (7 天有效期)
    ↓
返回 token
    ↓
前端保存 token (localStorage)
    ↓
后续请求携带 token (Authorization header)
    ↓
API 使用 withAuth 中间件验证
    ↓
解析 token 获取用户信息
    ↓
执行业务逻辑
```

**安全特性**:

- 密码哈希 (bcrypt, 10-12 轮)
- JWT 签名验证
- 7 天 token 过期
- API 路由保护 (withAuth)
- HttpOnly Cookie (生产环境推荐)

## 典型使用场景

### 场景 1: 快速生成流程图

```
1. 用户访问主页 (/)
2. 选择 "Mermaid" 渲染语言
3. 选择 "Flowchart" 图表类型
4. 输入描述: "用户登录流程,包括验证和错误处理"
5. 点击 "Generate" 按钮
6. AI 生成 Mermaid 流程图代码
7. 实时渲染显示图表
8. 用户可导出 SVG/PNG 或保存到历史
```

### 场景 2: 多轮优化图表

```
1. 首次生成图表 (同场景 1)
2. 用户查看图表,发现需要调整
3. 输入新的描述: "添加密码重置流程"
4. 点击 "Adjust" 按钮
5. AI 基于现有代码和上下文优化
6. 更新渲染图表
7. 重复 2-6 步直到满意
8. 保存到历史记录
```

### 场景 3: 修复语法错误

```
1. 用户手动编辑代码
2. 引入了语法错误
3. Kroki 渲染失败,显示错误
4. 点击 "Fix" 按钮
5. AI 分析错误,修复语法
6. 保持原有逻辑不变
7. 重新渲染成功
8. 记录失败日志 (用于改进)
```

### 场景 4: 配置新 AI 模型

```
1. 访问 /models 页面
2. 点击 "Add Model" 按钮
3. 填写表单:
   - Name: "My GPT-4"
   - Provider: "OpenAI"
   - API Key: "sk-..."
   - Model ID: "gpt-4o"
4. 点击 "Test" 测试连接
5. 测试成功后保存
6. 在主编辑器选择新模型
7. 使用新模型生成图表
```

### 场景 5: 自定义提示词

```
1. 访问 /prompts 页面
2. 选择层级: L3 (类型规范)
3. 选择语言: Mermaid
4. 选择类型: Flowchart
5. 查看当前激活版本
6. 在 CodeMirror 编辑器中修改
7. 点击 "Save" 创建新版本
8. 版本号自动递增: v1.0.0 → v1.0.1
9. 新版本自动激活
10. 返回主编辑器测试效果
11. 如不满意,切换回旧版本
```

### 场景 6: 查看和管理历史

```
1. 访问 /history 页面
2. 查看所有生成历史
3. 使用过滤器:
   - 按语言: Mermaid
   - 按类型: Flowchart
   - 仅收藏: true
4. 点击某条历史查看详情
5. 点击 "Load" 加载到编辑器
6. 继续编辑或重新生成
7. 点击 "Star" 收藏重要图表
8. 点击 "Delete" 删除不需要的历史
```

## 关键技术点

### 1. 三层 Prompt 加载机制

**加载优先级**:

1. 数据库查询用户自定义 (custom_prompts 表)
2. 如果没有自定义,从文件系统加载默认
3. 拼接 L1 + L2 + L3 (用 `---` 分隔)

**代码示例** (`prompt-loader.ts`):

```typescript
export async function loadPrompt(
  renderLanguage: RenderLanguage,
  diagramType: DiagramType,
  userId?: number
): Promise<string> {
  let L1, L2, L3;

  if (userId) {
    // 尝试从数据库加载
    L1 = await loadFromDatabase("L1", null, null, userId);
    L2 = await loadFromDatabase("L2", renderLanguage, null, userId);
    L3 = await loadFromDatabase("L3", renderLanguage, diagramType, userId);
  }

  // Fallback 到文件系统
  if (!L1) L1 = await loadFromFile("universal.txt");
  if (!L2) L2 = await loadFromFile(`${renderLanguage}/common.txt`);
  if (!L3) L3 = await loadFromFile(`${renderLanguage}/${diagramType}.txt`);

  return `${L1}\n---\n${L2}\n---\n${L3}`;
}
```

### 2. 任务类型决策逻辑

**决策规则** (`DiagramGenerationService.ts`):

```typescript
// 1. 优先使用显式指定的 taskType
if (taskType) {
  return taskType;
}

// 2. 如果有 sessionId,说明是多轮对话
if (sessionId) {
  // 根据历史判断是 adjust 还是 fix
  if (hasRenderError) {
    return "fix";
  }
  return "adjust";
}

// 3. 默认为首次生成
return "generate";
```

### 3. 代码清理逻辑

**清理规则** (`code-cleaner.ts`):

````typescript
export function cleanCode(code: string): string {
  let cleaned = code;

  // 1. 移除 markdown 代码块标记
  cleaned = cleaned.replace(/^```[\w]*\n/gm, "");
  cleaned = cleaned.replace(/\n```$/gm, "");

  // 2. 移除多余空行
  cleaned = cleaned.replace(/\n\n+/g, "\n\n");

  // 3. 移除首尾空白
  cleaned = cleaned.trim();

  return cleaned;
}
````

### 4. Kroki URL 生成

**编码流程** (`kroki.ts`):

```typescript
export function generateKrokiURL(
  code: string,
  diagramType: KrokiDiagramType,
  outputFormat: "svg" | "png" = "svg"
): string {
  // 1. Deflate 压缩 (level 9)
  const compressed = pako.deflate(code, { level: 9 });

  // 2. Base64 URL 编码
  const encoded = base64UrlEncode(compressed);

  // 3. 构造 URL
  return `/api/kroki/${diagramType}/${outputFormat}/${encoded}`;
}

function base64UrlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
```
