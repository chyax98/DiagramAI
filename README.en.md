# DiagramAI

> AI-powered diagram generation tool - Natural language to professional diagrams

English | [简体中文](./README.md)

---

## ✨ Features

- 🤖 **Multi AI Providers** - OpenAI, Claude, Gemini, DeepSeek, and more
- 📊 **23 Diagram Languages** - Mermaid, PlantUML, D2, Graphviz, BPMN, Structurizr, and more
- 💬 **Multi-turn Conversations** - Context-aware diagram refinements
- 🎨 **Live Preview** - Instant visualization with Kroki rendering engine
- 🔐 **User Authentication** - JWT + bcrypt complete solution
- 💾 **History Management** - Auto-save with search and filtering
- 🌓 **Theme Switching** - Dark/Light mode
- 📦 **Multi-format Export** - SVG, PNG, PDF, JSON
- 🔧 **Smart Fixes** - Auto-fix syntax errors, auto-log failure cases
- 📈 **Smart Recommendations** - Suggest best diagram type based on input

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

Visit http://localhost:3000 to start.

---

## 🏗️ Tech Stack

- **Frontend**: Next.js + React + TypeScript
- **UI**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Code Editor**: CodeMirror
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT + bcrypt
- **AI**: Vercel AI SDK (Multi-provider)
- **Diagram Rendering**: Kroki (23 languages)

For detailed architecture and development guide, see **[CLAUDE.md](CLAUDE.md)**

---

## 🎨 Supported Diagram Languages

DiagramAI supports **23 diagram rendering languages** for various use cases:

### Mainstream Languages (10)

1. **Mermaid** - 14 diagram types (flowchart, sequence, class, ER, gantt, mindmap, etc.)
2. **PlantUML** - 8 UML diagrams (sequence, class, use case, activity, etc.)
3. **D2** - 6 modern diagrams (flowchart, sequence, ER, class, architecture, network)
4. **Graphviz** - 5 graph visualizations (flowchart, state, tree structure, etc.)
5. **WaveDrom** - 3 digital signal diagrams (timing wave, signal, register)
6. **Nomnoml** - 3 simplified UML diagrams (class, component, architecture)
7. **Excalidraw** - 3 hand-drawn style diagrams (sketch, wireframe, generic)
8. **C4-PlantUML** - 4 C4 architecture diagrams (context, container, component, sequence)
9. **Vega-Lite** - 6 data visualizations (bar, line, scatter, pie, heatmap, etc.)
10. **DBML** - 4 database diagrams (full schema, single table, ER, database migration)

### Professional Extensions (13)

11. **BPMN** - Business Process Modeling Notation (BPMN 2.0)
12. **Ditaa** - ASCII art to diagrams
13. **NwDiag** - Network topology diagrams (network structure, rack layout, packet diagram)
14. **BlockDiag** - Block flowcharts
15. **ActDiag** - Activity diagrams (swimlane diagrams)
16. **PacketDiag** - Network packet diagrams (protocol stack)
17. **RackDiag** - Data center rack diagrams
18. **SeqDiag** - Simplified sequence diagrams (BlockDiag style)
19. **Structurizr** - C4 architecture modeling DSL (7 views)
20. **Erd** - Concise ER diagram syntax
21. **Pikchr** - Diagram scripting language
22. **SvgBob** - ASCII to SVG beautification
23. **UMLet** - Lightweight UML tool

---

## 🚀 Production Deployment

### Quick Deployment (3 Steps)

#### 1. Deploy Kroki Service

```bash
# Minimal deployment (recommended, supports mainstream diagram languages)
docker run -d --name kroki --restart unless-stopped -p 8000:8000 yuzutech/kroki:latest
```

For detailed Kroki deployment options (complete deployment, remote deployment, etc.), see **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)**

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
BCRYPT_SALT_ROUNDS=12              # Recommended 12 for production

# Kroki Configuration
NEXT_PUBLIC_KROKI_URL=/api/kroki           # Client proxy
KROKI_INTERNAL_URL=http://localhost:8000   # Server direct connection

# Optional
AI_TEMPERATURE=0.7
AI_MAX_RETRIES=3
API_TEST_TIMEOUT=30000             # Model test timeout (ms)
NEXT_PUBLIC_MAX_INPUT_CHARS=20000
NEXT_PUBLIC_MAX_CHAT_ROUNDS=10
ENABLE_FAILURE_LOGGING=true        # Enable failure logging
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

For detailed deployment guide and troubleshooting, see **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)**

---

## 📖 Usage Guide

### Basic Workflow

1. **Register Account** - First-time users need to register
2. **Configure AI Model** - Add AI Provider in "Models" page
   - Supports OpenAI, Claude, Gemini, DeepSeek, etc.
   - Multiple models can be configured
3. **Generate Diagram**
   - Select diagram language (e.g., Mermaid)
   - Select diagram type (e.g., Flowchart)
   - Enter natural language description
   - Click "Generate" button
4. **Multi-turn Refinement** - Continue optimizing based on generated diagram
   - "Adjust": Modify content, add elements, etc.
   - "Fix": Auto-fix syntax errors
5. **Export Diagram** - Multiple format support
   - SVG: Vector graphics (scalable)
   - PNG: Bitmap (specify resolution)
   - JSON: Raw data
   - Code: Copy source code

### Advanced Features

#### Smart Recommendations

The system automatically recommends the most suitable diagram language and type based on your input:

```
Input: "Show user login flow"
Recommendation: Mermaid Sequence Diagram

Input: "Database table structure"
Recommendation: DBML Schema Diagram
```

#### Failure Logging

When diagram rendering fails, clicking the "Fix" button will:

- Auto-log failure cases (for future optimization)
- Request AI to fix syntax errors
- Maintain diagram logic unchanged

#### Multi-turn Conversation Optimization

Supports up to 10 rounds of conversation adjustments (configurable):

- Preserve complete conversation history
- Context-aware intelligent adjustments
- Smart task type identification (generate/adjust/fix)

---

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run clean            # Clean cache
npm run rebuild          # Clean and restart

# Code Quality
npm run lint             # ESLint check
npm run format           # Prettier formatting
npm run format:check     # Format check
npm run type-check       # TypeScript type check

# Build & Deploy
npm run build            # Production build
npm start                # Start production server

# Database
npm run db:init          # Initialize database
npm run db:seed          # Seed test data (for development)

# Comprehensive Check
npm run ci               # Format + Lint + Type check
```

---

## 🤝 Contributing

Contributions are welcome! Report issues or suggest improvements.

### Contributing Steps

1. Fork this repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Commit Convention

Use Conventional Commits format:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `refactor`: Code refactoring
- `test`: Testing related
- `chore`: Build/tooling related

### Code Standards

- TypeScript strict mode
- ESLint + Prettier
- Unit test coverage

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React full-stack framework
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration toolkit
- [Kroki](https://kroki.io/) - Diagram rendering service
- [Shadcn/ui](https://ui.shadcn.com/) - React component library
- [CodeMirror](https://codemirror.net/) - Code editor
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - SQLite driver

---

## 📚 Documentation

### User Documentation

- **[README.md](README.md)** - Quick start and basic usage (Chinese)
- **[README.en.md](README.en.md)** - English version (this file)
- **[KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md)** - Kroki service deployment guide
- **[env.example](env.example)** - Environment configuration reference

### Developer Documentation

- **[CLAUDE.md](CLAUDE.md)** - Architecture design and development guide

---

## 🔗 Links

- [GitHub Repository](https://github.com/chyax98/DiagramAI)
- [Issue Tracker](https://github.com/chyax98/DiagramAI/issues)
- [Discussions](https://github.com/chyax98/DiagramAI/discussions)

---

## 💡 FAQ

### Q: Which AI models are supported?

A: Supports mainstream AI providers:

- **OpenAI**: All GPT series models
- **Anthropic**: All Claude series models
- **Google**: All Gemini series models
- **OpenAI Compatible**: DeepSeek, SiliconFlow, Together AI, Groq, and other OpenAI API compatible services

### Q: How to self-host Kroki?

A: See [KROKI_DEPLOYMENT.md](KROKI_DEPLOYMENT.md) for detailed deployment guide. Simplest way:

```bash
docker run -d --name kroki --restart unless-stopped -p 8000:8000 yuzutech/kroki:latest
```

### Q: Where is data stored?

A: All data (users, model configurations, history records) is stored in local SQLite database (`data/diagram-ai.db`), not uploaded to any server.

### Q: Is AI API Key secure?

A: API Keys are stored in plaintext in the database (for personal use scenarios), and never leave your server. Please ensure:

- Set strong JWT_SECRET
- Use HTTPS
- Regular database backups
- Restrict server access

### Q: Does it support offline use?

A: Partial support:

- Kroki can be deployed locally (fully offline)
- AI models require internet (API calls)

---

DiagramAI - AI-powered professional diagram generation tool
