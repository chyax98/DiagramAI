# DiagramAI

> 基于 AI 的智能图表生成工具 - 自然语言描述，一键生成专业图表

[English](./README.en.md) | 简体中文

---

## ✨ 核心特性

- 🤖 **多 AI 提供商** - 支持 OpenAI、Claude、Gemini、DeepSeek 等
- 📊 **10+ 图表语言** - Mermaid、PlantUML、D2、Graphviz 等
- 💬 **多轮对话优化** - 基于上下文连续调整图表
- 🎨 **实时预览** - Kroki 渲染引擎，即时可视化
- 🔐 **用户认证** - JWT + bcrypt 完整方案
- 💾 **历史管理** - 自动保存，支持筛选搜索
- 🌓 **主题切换** - 深色/浅色模式
- 📦 **多格式导出** - SVG、PNG、PDF、JSON

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/chyax98/DiagramAI.git
cd DiagramAI

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp env.example .env.local
# 编辑 .env.local，设置 JWT_SECRET（必需）
# 生成密钥：openssl rand -base64 64

# 4. 初始化数据库
npm run db:init

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000 开始使用。

---

## 📖 使用指南

### 1. 注册账号

首次使用需要注册账号。

### 2. 配置 AI 模型

进入「模型配置」页面，添加 AI 模型：

- **Provider**：OpenAI / Anthropic / Google / OpenAI Compatible
- **Model ID**：如 `gpt-4o`、`claude-3-5-sonnet-20241022`
- **API Key**：你的 API 密钥
- **Endpoint**：可选，自定义端点（如 DeepSeek: `https://api.deepseek.com`）

### 3. 生成图表

1. 选择图表语言（如 Mermaid）
2. 选择图表类型（如流程图）
3. 输入自然语言描述
4. 点击「生成图表」

### 4. 多轮调整

生成后可继续输入调整需求：

- "添加错误处理分支"
- "使用不同的颜色"
- "增加注释说明"

系统会基于当前图表优化，无需重新生成。

### 5. 导出图表

支持导出格式：SVG、PNG、JSON、代码。

---

## 🏗️ 技术架构

### 技术栈

- **前端**：Next.js 15 + React 19 + TypeScript 5
- **状态管理**：Zustand 5.0
- **UI 框架**：Tailwind CSS 4.0 + Shadcn/ui
- **代码编辑**：CodeMirror 6
- **数据库**：SQLite (better-sqlite3)
- **认证**：JWT + bcrypt
- **AI 集成**：Vercel AI SDK
- **图表渲染**：Kroki

### 项目结构

```
DiagramAI/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (app)/            # 主应用路由（需认证）
│   │   ├── (auth)/           # 认证路由
│   │   └── api/              # API 端点
│   ├── components/           # React 组件
│   ├── lib/                  # 核心库
│   │   ├── ai/               # AI Provider 工厂
│   │   ├── auth/             # 认证模块
│   │   ├── constants/        # 常量和 Prompts
│   │   ├── repositories/     # 数据访问层
│   │   ├── services/         # 业务逻辑层
│   │   ├── stores/           # Zustand 状态
│   │   └── validations/      # Zod 验证
│   └── types/                # TypeScript 类型
├── data/                     # SQLite 数据库
└── scripts/                  # 工具脚本

总计：126+ 源文件，246 测试用例
```

**架构模式**：Repository + Service + Factory

详细架构说明请参考 [CLAUDE.md](CLAUDE.md)（包含 Mermaid 架构图）。

---

## 💾 数据库设计

**4 张核心表**：

- `users` - 用户账号（JWT + bcrypt）
- `ai_models` - AI 模型配置
- `generation_histories` - 生成历史
- `chat_sessions` - 对话会话

完整 Schema 请查看 `src/lib/db/schema.sql`。

---

## 🧪 测试

```bash
npm test              # 运行所有测试
npm run test:coverage # 测试覆盖率
npm run type-check    # TypeScript 检查
npm run lint          # 代码检查
```

**测试覆盖**：246+ 测试用例，覆盖组件、服务、工具函数。

---

## 🔧 开发指南

### 代码规范

- TypeScript 严格模式
- ESLint + Prettier
- 中文注释（必需）
- Repository 模式（数据库操作）
- Conventional Commits

### 添加新图表语言

1. 更新 `src/lib/constants/diagram-types.ts`
2. 创建 Prompt：`src/lib/constants/prompts/`
3. 注册 Prompt：`src/lib/constants/prompts/index.ts`
4. 更新数据库 schema 枚举

### 添加新 AI Provider

1. 添加到 `src/lib/ai/provider-factory.ts`
2. 更新数据库 schema provider 枚举
3. 添加前端配置 UI

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 贡献步骤

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'feat: 添加某个功能'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启 Pull Request

**提交规范**：`feat` / `fix` / `docs` / `refactor` / `test` / `chore`

---

## 📝 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI 集成工具
- [Kroki](https://kroki.io/) - 图表渲染服务
- [Shadcn/ui](https://ui.shadcn.com/) - React 组件库
- [CodeMirror](https://codemirror.net/) - 代码编辑器

---

## 📚 文档

- **README.md**（本文件）- 快速开始和使用指南
- **[README.en.md](README.en.md)** - English version
- **[CLAUDE.md](CLAUDE.md)** - 架构详解（含 Mermaid 图表）
- **[env.example](env.example)** - 环境变量配置

---

**注意**：本项目仅供学习和研究使用，请遵守各 AI Provider 的使用条款。
