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

## 🏗️ 技术栈

- **前端**: Next.js 15 + React 19 + TypeScript 5
- **UI**: Tailwind CSS 4.0 + Shadcn/ui
- **状态管理**: Zustand 5.0
- **数据库**: SQLite (better-sqlite3)
- **认证**: JWT + bcrypt
- **AI**: Vercel AI SDK (多提供商)
- **图表渲染**: Kroki

详细架构和开发指南请查看 **[CLAUDE.md](CLAUDE.md)**

---

## 🚀 生产环境部署

### 快速部署（3 步）

#### 1. 部署 Kroki 服务

```bash
# 最小化部署（推荐）
docker run -d --name kroki --restart unless-stopped -p 8000:8000 yuzutech/kroki:latest
```

详细的 Kroki 部署方案（完整部署、远程部署等）请查看 **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)**

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

#### 3. 配置反向代理（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

启用 HTTPS：`sudo certbot --nginx -d your-domain.com`

### 环境变量说明

```bash
# 必须配置
JWT_SECRET=<64+ 字符强密钥>
BCRYPT_SALT_ROUNDS=12

# Kroki 配置
NEXT_PUBLIC_KROKI_URL=/api/kroki           # 客户端代理
KROKI_INTERNAL_URL=http://localhost:8000   # 服务端直连

# 可选配置
AI_TEMPERATURE=0.7
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

详细部署指南和故障排查请查看 **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)**

---

## 📖 使用指南

1. **注册账号** - 首次使用需要注册
2. **配置 AI 模型** - 在「模型配置」页面添加 AI Provider（OpenAI、Claude、Gemini 等）
3. **生成图表** - 选择图表语言和类型，输入自然语言描述
4. **多轮调整** - 基于已生成图表继续优化（"添加注释"、"改变颜色" 等）
5. **导出图表** - 支持 SVG、PNG、JSON、代码格式

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

### 用户文档

- **[README.md](README.md)** - 快速开始和基本使用
- **[README.en.md](README.en.md)** - English version
- **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)** - Kroki 服务部署指南
- **[env.example](env.example)** - 环境变量配置参考

### 开发文档

- **[CLAUDE.md](CLAUDE.md)** - 架构设计和开发指南
- **[claudedocs/L3_PROMPT_REVIEW_README.md](claudedocs/L3_PROMPT_REVIEW_README.md)** - L3 提示词审查方案使用指南
- **[claudedocs/L3_PROMPT_REVIEW_GUIDE.md](claudedocs/L3_PROMPT_REVIEW_GUIDE.md)** - L3 提示词审查完整方案
- **[claudedocs/L3_PROMPT_REVIEW_CHECKLIST.md](claudedocs/L3_PROMPT_REVIEW_CHECKLIST.md)** - L3 提示词审查快速清单

---

**注意**：本项目仅供学习和研究使用，请遵守各 AI Provider 的使用条款。
