# DiagramAI

> AI-powered diagram generation tool - Natural language to professional diagrams

English | [简体中文](./README.md)

---

## ✨ Features

- 🤖 **Multi AI Providers** - OpenAI, Claude, Gemini, DeepSeek
- 📊 **10+ Diagram Languages** - Mermaid, PlantUML, D2, Graphviz, etc.
- 💬 **Multi-turn Conversations** - Context-aware refinements
- 🎨 **Live Preview** - Instant visualization with Kroki
- 🔐 **Authentication** - JWT + bcrypt
- 💾 **History Management** - Auto-save and search
- 🌓 **Theme Support** - Dark/Light mode
- 📦 **Export** - SVG, PNG, PDF, JSON

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/chyax98/DiagramAI.git
cd DiagramAI

# 2. Install dependencies
npm install

# 3. Configure environment
cp env.example .env.local
# Edit .env.local, set JWT_SECRET (required)
# Generate secret: openssl rand -base64 64

# 4. Initialize database
npm run db:init

# 5. Start development server
npm run dev
```

Visit http://localhost:3000

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript 5
- **UI**: Tailwind CSS 4.0 + Shadcn/ui
- **State**: Zustand 5.0
- **Database**: SQLite (better-sqlite3)
- **Auth**: JWT + bcrypt
- **AI**: Vercel AI SDK (Multi-provider)
- **Rendering**: Kroki

For detailed architecture and development guide, see **[CLAUDE.md](CLAUDE.md)**

---

## 🚀 Production Deployment

### Quick Deployment (3 Steps)

#### 1. Deploy Kroki Service

```bash
# Minimal deployment (recommended)
docker run -d --name kroki --restart unless-stopped -p 8000:8000 yuzutech/kroki:latest
```

For full deployment options (complete features, remote deployment), see **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)**

#### 2. Deploy DiagramAI

```bash
# Clone and install
git clone https://github.com/chyax98/DiagramAI.git
cd DiagramAI
npm ci

# Configure environment
cp env.example .env.local
# Edit .env.local:
#   - JWT_SECRET: openssl rand -base64 64
#   - BCRYPT_SALT_ROUNDS: 12
#   - KROKI_INTERNAL_URL: http://localhost:8000

# Initialize database
npm run db:init

# Build and start
npm run build
npm install -g pm2
pm2 start npm --name "diagramai" -- start
pm2 save
```

#### 3. Configure Reverse Proxy (Optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

Enable HTTPS: `sudo certbot --nginx -d your-domain.com`

### Environment Variables

```bash
# Required
JWT_SECRET=<64+ chars strong key>
BCRYPT_SALT_ROUNDS=12

# Kroki Configuration
NEXT_PUBLIC_KROKI_URL=/api/kroki           # Client proxy
KROKI_INTERNAL_URL=http://localhost:8000   # Server direct

# Optional
AI_TEMPERATURE=0.7
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

For detailed deployment guide and troubleshooting, see **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)**

---

## 📖 Usage Guide

1. **Register Account** - First-time users need to register
2. **Configure AI Model** - Add AI Provider in "Models" page (OpenAI, Claude, Gemini, etc.)
3. **Generate Diagram** - Select diagram language and type, enter natural language description
4. **Refine** - Continue optimizing based on generated diagram ("add comments", "change colors", etc.)
5. **Export** - Support SVG, PNG, JSON, code formats

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

**Commit Convention**: `feat` / `fix` / `docs` / `refactor` / `test` / `chore`

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration
- [Kroki](https://kroki.io/) - Diagram rendering
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [CodeMirror](https://codemirror.net/) - Code editor

---

## 📚 Documentation

- **[README.md](README.md)** - Quick start and basic usage (Chinese)
- **[README.en.md](README.en.md)** - English version (this file)
- **[CLAUDE.md](CLAUDE.md)** - Architecture design and development guide
- **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)** - Kroki service deployment guide
- **[env.example](env.example)** - Environment configuration reference

---

**Note**: This project is for learning and research purposes. Please comply with AI provider terms of service.
