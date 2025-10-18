# DiagramAI 开发命令速查

## 日常开发

### 启动与运行

```bash
# 开发环境 (http://localhost:3000)
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm run start
```

### 代码质量检查

```bash
# 完整 CI 检查 (推荐在提交前运行)
npm run ci
# 等价于: format:check + lint + type-check + dead-code

# 完整 CI + 构建验证
npm run ci:full
# 等价于: format:check + lint + type-check + dead-code + build

# 单独检查项
npm run format:check      # 检查代码格式
npm run lint              # ESLint 检查
npm run type-check        # TypeScript 类型检查
npm run dead-code         # 检测未使用的代码
npm run dead-code:exports # 检测未使用的导出
npm run dead-code:deps    # 检测未使用的依赖
```

### 代码格式化

```bash
# 自动格式化所有文件
npm run format

# 检查格式 (不修改文件)
npm run format:check
```

### 预提交检查

```bash
# Git commit 前自动运行
npm run precommit
# 等价于: format:check + lint + type-check
```

## 数据库操作

### 初始化与迁移

```bash
# 初始化数据库 (创建表结构)
npm run db:init

# 运行数据库迁移 (v5 → v6)
npm run db:migrate

# 填充测试数据
npm run db:seed
```

### 提示词管理

```bash
# 导入默认提示词到数据库
npm run db:seed-prompts

# 强制重新导入 (覆盖现有数据)
npm run db:seed-prompts:force

# 预览导入操作 (不实际执行)
npm run db:seed-prompts:preview
```

## 项目维护

### 清理与重建

```bash
# 清理缓存
npm run clean

# 完全重建 (清理 + 重启)
npm run rebuild
```

### 依赖管理

```bash
# 安装依赖
npm install

# 检查未使用的依赖
npm run dead-code:deps

# 查看依赖树 (顶层)
npm ls --depth=0

# 清理未使用的依赖
npm prune
```

## 常用 Git 操作

### 基础操作

```bash
# 查看状态和当前分支
git status
git branch

# 创建功能分支
git checkout -b feature/your-feature-name

# 提交代码 (遵循 Conventional Commits)
git add .
git commit -m "feat(scope): 描述"
git push
```

### 分支管理

```bash
# 切换分支
git checkout main
git checkout feat/refactor-recommend-system

# 合并分支
git merge feature/your-feature

# 删除本地分支
git branch -d feature/old-feature

# 删除远程分支
git push origin --delete feature/old-feature
```

## 开发工具脚本

### 测试脚本 (scripts/)

```bash
# Prompt Repository 单元测试
npx tsx scripts/test-prompt-repository-simple.ts

# Prompt 性能基准测试
npx tsx scripts/benchmark-prompt-loading.ts

# 数据库迁移脚本
npx tsx scripts/migrate-db.ts

# 提示词导入脚本
npx tsx scripts/seed-default-prompts.ts

# 查看脚本说明文档
cat scripts/README-seed-prompts.md
```

## 系统命令 (macOS)

### 文件操作

```bash
# 列出文件 (详细信息)
ls -la

# 搜索文件
find . -name "*.ts" -type f

# 搜索文件内容
grep -r "pattern" src/

# 查看文件
cat file.txt
head -n 20 file.txt
tail -n 20 file.txt

# 编辑文件 (使用默认编辑器)
open -e file.txt
```

### 进程管理

```bash
# 查看端口占用
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 后台运行
npm run dev &
```

### 磁盘与目录

```bash
# 查看磁盘使用
du -sh .
du -sh node_modules

# 创建目录
mkdir -p path/to/dir

# 删除文件/目录
rm file.txt
rm -rf directory/
```

## 任务完成后的检查清单

### 提交前检查

```bash
# 1. 运行完整 CI 检查
npm run ci

# 2. 确认所有修改
git status
git diff

# 3. 提交代码
git add .
git commit -m "feat(scope): 描述"

# 4. 推送到远程
git push
```

### 功能完成检查

- [ ] 代码格式化通过 (`npm run format:check`)
- [ ] ESLint 检查通过 (`npm run lint`)
- [ ] TypeScript 类型检查通过 (`npm run type-check`)
- [ ] 无死代码 (`npm run dead-code`)
- [ ] 构建成功 (`npm run build`)
- [ ] 手动测试功能正常
- [ ] Git commit message 符合规范
- [ ] 更新相关文档 (CLAUDE.md 等)

## 环境变量配置

### 必需配置 (.env.local)

```bash
# JWT 密钥 (64+ 字符)
JWT_SECRET=your-secret-key

# 可选配置
BCRYPT_SALT_ROUNDS=10
AI_TEMPERATURE=0.7
ENABLE_FAILURE_LOGGING=true
```

### 环境变量模板

```bash
# 复制示例配置
cp env.example .env.local

# 编辑配置
open -e .env.local
```

## 常见问题排查

### 端口被占用

```bash
# 查找占用 3000 端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或使用其他端口
PORT=3001 npm run dev
```

### 依赖问题

```bash
# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 构建失败

```bash
# 清理缓存后重新构建
npm run clean
npm run build
```

### 数据库问题

```bash
# 重新初始化数据库
rm diagram.db
npm run db:init
npm run db:seed
```

## 性能分析

### 构建分析

```bash
# 分析构建产物大小
npm run build
# 查看 .next/analyze 目录

# 分析包体积
npx next build --profile
```

### 依赖分析

```bash
# 查看依赖树
npm ls

# 查找重复依赖
npm dedupe
```
