# DiagramAI

> 基于 AI 的智能图表生成工具 - 自然语言描述,一键生成专业图表

[English](./README.en.md) | 简体中文

---

## ✨ 核心特性

- 🤖 **多 AI 提供商** - OpenAI、Claude、Gemini、DeepSeek 等
- 📊 **23 种图表语言** - Mermaid、PlantUML、D2、Graphviz、BPMN、Structurizr 等
- 💬 **多轮对话优化** - 基于上下文连续调整图表
- 🎨 **实时预览** - Kroki 渲染引擎,即时可视化
- 🔐 **用户认证** - JWT + bcrypt 完整方案
- 💾 **历史管理** - 自动保存,支持筛选搜索
- 🌓 **主题切换** - 深色/浅色模式
- 📦 **多格式导出** - SVG、PNG、PDF、JSON
- 🔧 **智能修复** - 语法错误自动修复,失败案例自动记录
- 📈 **智能推荐** - 根据输入推荐最适合的图表类型

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
# 编辑 .env.local,设置 JWT_SECRET(必需)
# 生成密钥: openssl rand -base64 64

# 4. 初始化数据库
npm run db:init

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000 开始使用。

---

## 🏗️ 技术栈

- **前端**: Next.js + React + TypeScript
- **UI**: Tailwind CSS + Shadcn/ui
- **状态管理**: Zustand
- **代码编辑**: CodeMirror
- **数据库**: SQLite (better-sqlite3)
- **认证**: JWT + bcrypt
- **AI**: Vercel AI SDK (多提供商)
- **图表渲染**: Kroki (23 种语言)

详细架构和开发指南请查看 **[CLAUDE.md](CLAUDE.md)**

---

## 🎨 支持的图表语言

DiagramAI 支持 **23 种图表渲染语言**,涵盖各种应用场景:

### 主流语言 (10 种)

1. **Mermaid** - 14 种图表类型 (流程图、时序图、类图、ER 图、甘特图、思维导图等)
2. **PlantUML** - 8 种 UML 图表 (时序图、类图、用例图、活动图等)
3. **D2** - 6 种现代化图表 (流程图、时序图、ER 图、类图、架构图、网络拓扑图)
4. **Graphviz** - 5 种图形可视化 (流程图、状态图、树形结构等)
5. **WaveDrom** - 3 种数字信号图 (时序波形、信号图、寄存器图)
6. **Nomnoml** - 3 种简化 UML 图 (类图、组件图、架构图)
7. **Excalidraw** - 3 种手绘风格图表 (草图、线框图、通用图表)
8. **C4-PlantUML** - 4 种 C4 架构图 (上下文图、容器图、组件图、时序图)
9. **Vega-Lite** - 6 种数据可视化 (柱状图、折线图、散点图、饼图、热力图等)
10. **DBML** - 4 种数据库图表 (完整 Schema、单表设计、ER 图、数据库迁移)

### 专业扩展 (13 种)

11. **BPMN** - 业务流程建模标准 (BPMN 2.0)
12. **Ditaa** - ASCII 艺术转图形
13. **NwDiag** - 网络拓扑图 (网络结构、机架布局、数据包图)
14. **BlockDiag** - 块状流程图
15. **ActDiag** - 活动图 (泳道图)
16. **PacketDiag** - 网络数据包图 (协议栈)
17. **RackDiag** - 数据中心机柜图
18. **SeqDiag** - 简化时序图 (BlockDiag 风格)
19. **Structurizr** - C4 架构建模 DSL (7 种视图)
20. **Erd** - 简洁 ER 图语法
21. **Pikchr** - 图表脚本语言
22. **SvgBob** - ASCII 转 SVG 美化
23. **UMLet** - 轻量级 UML 工具

---

## 🚀 生产环境部署

### 快速部署 (3 步)

#### 1. 部署 Kroki 服务

```bash
# 最小化部署 (推荐,支持主流图表语言)
docker run -d --name kroki --restart unless-stopped -p 8000:8000 yuzutech/kroki:latest
```

详细的 Kroki 部署方案 (完整部署、远程部署等) 请查看 **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)**

#### 2. 部署 DiagramAI

```bash
# 克隆并安装
git clone https://github.com/chyax98/DiagramAI.git
cd DiagramAI
npm ci

# 配置环境变量
cp env.example .env.local
# 编辑 .env.local:
#   - JWT_SECRET: openssl rand -base64 64
#   - BCRYPT_SALT_ROUNDS: 12
#   - KROKI_INTERNAL_URL: http://localhost:8000

# 初始化数据库
npm run db:init

# 构建并启动
npm run build
npm install -g pm2
pm2 start npm --name "diagramai" -- start
pm2 save
```

#### 3. 配置反向代理 (可选)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

启用 HTTPS: `sudo certbot --nginx -d your-domain.com`

### 环境变量说明

```bash
# 必须配置
JWT_SECRET=<64+ 字符强密钥>
BCRYPT_SALT_ROUNDS=12              # 生产环境推荐 12

# Kroki 配置
NEXT_PUBLIC_KROKI_URL=/api/kroki           # 客户端代理
KROKI_INTERNAL_URL=http://localhost:8000   # 服务端直连

# 可选配置
AI_TEMPERATURE=0.7
AI_MAX_RETRIES=3
API_TEST_TIMEOUT=30000             # 模型测试超时 (毫秒)
NEXT_PUBLIC_MAX_INPUT_CHARS=20000
NEXT_PUBLIC_MAX_CHAT_ROUNDS=10
ENABLE_FAILURE_LOGGING=true        # 启用失败日志记录
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

详细部署指南和故障排查请查看 **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)**

---

## 📖 使用指南

### 基础流程

1. **注册账号** - 首次使用需要注册
2. **配置 AI 模型** - 在「模型配置」页面添加 AI Provider
   - 支持 OpenAI、Claude、Gemini、DeepSeek 等
   - 可配置多个模型
3. **生成图表**
   - 选择图表语言 (如 Mermaid)
   - 选择图表类型 (如 流程图)
   - 输入自然语言描述
   - 点击「生成」按钮
4. **多轮调整** - 基于已生成图表继续优化
   - 「调整」: 修改内容、添加元素等
   - 「修复」: 自动修复语法错误
5. **导出图表** - 支持多种格式
   - SVG: 矢量图 (可缩放)
   - PNG: 位图 (指定分辨率)
   - JSON: 原始数据
   - 代码: 复制源代码

### 高级功能

#### 智能推荐

系统会根据你的输入描述,自动推荐最合适的图表语言和类型:

```
输入: "展示用户登录流程"
推荐: Mermaid 时序图

输入: "数据库表结构"
推荐: DBML Schema 图
```

#### 失败日志记录

当图表渲染失败时,点击「修复」按钮会:

- 自动记录失败案例 (用于后续优化)
- 要求 AI 修复语法错误
- 保持图表逻辑不变

#### 多轮对话优化

支持最多 10 轮对话调整（可以配置）:

- 保留完整对话历史
- 上下文感知的智能调整
- 任务类型智能识别 (生成/调整/修复)

---

## 🛠️ 开发命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run clean            # 清理缓存
npm run rebuild          # 清理并重启

# 代码质量
npm run lint             # ESLint 检查
npm run format           # Prettier 格式化
npm run format:check     # 格式检查
npm run type-check       # TypeScript 类型检查

# 构建部署
npm run build            # 生产构建
npm start                # 启动生产服务器

# 数据库
npm run db:init          # 初始化数据库
npm run db:seed          # 填充测试数据 (开发用)

# 综合检查
npm run ci               # 格式 + Lint + 类型检查
```

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议!

### 贡献步骤

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 提交规范

使用 Conventional Commits 格式:

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

### 代码规范

- TypeScript strict 模式
- ESLint + Prettier
- 中文注释
- 单元测试覆盖

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
- [Zustand](https://zustand-demo.pmnd.rs/) - 状态管理
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - SQLite 驱动

---

## 📚 文档

### 用户文档

- **[README.md](README.md)** - 快速开始和基本使用 (本文档)
- **[README.en.md](README.en.md)** - English version
- **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)** - Kroki 服务部署指南
- **[env.example](env.example)** - 环境变量配置参考

### 开发文档

- **[CLAUDE.md](CLAUDE.md)** - 架构设计和开发指南

---

## 🔗 相关链接

- [GitHub Repository](https://github.com/chyax98/DiagramAI)
- [Issue Tracker](https://github.com/chyax98/DiagramAI/issues)
- [Discussions](https://github.com/chyax98/DiagramAI/discussions)

---

## 💡 常见问题

### Q: 支持哪些 AI 模型?

A: 支持主流 AI 提供商:

- **OpenAI**: 支持所有 GPT 系列模型
- **Anthropic**: 支持所有 Claude 系列模型
- **Google**: 支持所有 Gemini 系列模型
- **OpenAI Compatible**: DeepSeek, SiliconFlow, Together AI, Groq 等兼容 OpenAI API 的服务

### Q: 如何自托管 Kroki?

A: 查看 [KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md) 获取详细部署指南。最简单的方式:

```bash
docker run -d --name kroki --restart unless-stopped -p 8000:8000 yuzutech/kroki:latest
```

### Q: 数据存储在哪里?

A: 所有数据 (用户、模型配置、历史记录) 存储在本地 SQLite 数据库 (`data/diagram-ai.db`),不会上传到任何服务器。

### Q: AI API Key 安全吗?

A: API Key 明文存储在数据库中 (自用场景),不会离开你的服务器。请确保:

- 设置强 JWT_SECRET
- 使用 HTTPS
- 定期备份数据库
- 限制服务器访问权限

### Q: 支持离线使用吗?

A: 部分支持:

- Kroki 可以本地部署 (完全离线)
- AI 模型需要联网 (调用 API)

---

DiagramAI - AI 驱动的专业图表生成工具
