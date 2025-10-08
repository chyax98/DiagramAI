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
git clone https://github.com/your-username/DiagramAI.git
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

## 📖 Usage Guide

### 1. Register Account

Create an account on first visit.

### 2. Configure AI Model

Go to "Models" page and add your AI provider:

- **Provider**: OpenAI / Anthropic / Google / OpenAI Compatible
- **Model ID**: e.g., `gpt-4o`, `claude-3-5-sonnet-20241022`
- **API Key**: Your API key
- **Endpoint**: Optional, for custom APIs (e.g., DeepSeek: `https://api.deepseek.com`)

### 3. Generate Diagram

1. Select diagram language (e.g., Mermaid)
2. Select diagram type (e.g., Flowchart)
3. Enter natural language description
4. Click "Generate"

### 4. Refine with Conversation

Continue with refinement requests:

- "Add error handling"
- "Use different colors"
- "Add comments"

The system refines based on current diagram context.

### 5. Export

Export as SVG, PNG, JSON, or code.

---

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript 5
- **State**: Zustand 5.0
- **UI**: Tailwind CSS 4.0 + Shadcn/ui
- **Editor**: CodeMirror 6
- **Database**: SQLite (better-sqlite3)
- **Auth**: JWT + bcrypt
- **AI**: Vercel AI SDK
- **Rendering**: Kroki

### Project Structure

```
DiagramAI/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (app)/            # Protected routes
│   │   ├── (auth)/           # Auth routes
│   │   └── api/              # API endpoints
│   ├── components/           # React components
│   ├── lib/                  # Core libraries
│   │   ├── ai/               # AI provider factory
│   │   ├── auth/             # Authentication
│   │   ├── constants/        # Constants & prompts
│   │   ├── repositories/     # Data access layer
│   │   ├── services/         # Business logic
│   │   ├── stores/           # Zustand stores
│   │   └── validations/      # Zod schemas
│   └── types/                # TypeScript types
├── data/                     # SQLite database
└── scripts/                  # Utility scripts

Total: 126+ source files, 246 test cases
```

**Architecture Pattern**: Repository + Service + Factory

See [CLAUDE.md](CLAUDE.md) for detailed architecture with Mermaid diagrams.

---

## 💾 Database Schema

**4 Core Tables**:

- `users` - User accounts (JWT + bcrypt)
- `ai_models` - AI provider configurations
- `generation_histories` - Generated diagrams
- `chat_sessions` - Conversation history

See `src/lib/db/schema.sql` for complete schema.

---

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:coverage # Coverage report
npm run type-check    # TypeScript check
npm run lint          # Linting
```

**Coverage**: 246+ tests across components, services, and utilities.

---

## 🔧 Development

### Code Standards

- TypeScript strict mode
- ESLint + Prettier
- Chinese comments required
- Repository pattern for database
- Conventional Commits

### Add New Diagram Language

1. Update `src/lib/constants/diagram-types.ts`
2. Create prompt in `src/lib/constants/prompts/`
3. Register in `src/lib/constants/prompts/index.ts`
4. Update database schema enum

### Add New AI Provider

1. Add to `src/lib/ai/provider-factory.ts`
2. Update database schema provider enum
3. Add frontend configuration UI

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

- **README.md** - Quick start guide (Chinese)
- **[README.en.md](README.en.md)** (this file) - English version
- **[CLAUDE.md](CLAUDE.md)** - Architecture guide with Mermaid diagrams
- **[env.example](env.example)** - Environment configuration

---

**Note**: This project is for learning and research purposes. Please comply with AI provider terms of service.
