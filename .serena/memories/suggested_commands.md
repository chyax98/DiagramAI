# DiagramAI 常用命令

## 开发环境

```bash
npm run dev              # 启动开发服务器 (http://localhost:3000)
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
```

## 代码质量

```bash
npm run lint             # ESLint 检查
npm run format           # Prettier 格式化
npm run format:check     # 检查格式
npm run type-check       # TypeScript 检查
npm run ci               # 完整 CI 检查 (format + lint + type-check)
```

## 数据库

```bash
npm run db:init          # 初始化数据库 (创建表结构)
```

## 清理与重建

```bash
npm run clean            # 清理缓存和构建产物
npm run rebuild          # 完全重建项目
```

## 部署 (PM2)

```bash
pm2 start ecosystem.config.cjs  # 启动生产服务
pm2 stop diagram-ai             # 停止服务
pm2 restart diagram-ai          # 重启服务
pm2 logs diagram-ai             # 查看日志
```

## 常用组合

```bash
# 开发前检查
npm run ci

# 生产部署流程
npm run build && pm2 restart diagram-ai

# 数据库重置 (开发环境)
rm data/diagram-ai.db && npm run db:init
```
