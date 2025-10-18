# DiagramAI 任务完成检查清单

## 代码修改后的必做步骤

### 1. 代码质量检查 (必需)

```bash
# 运行完整 CI 检查 (推荐)
npm run ci

# 或分步检查
npm run format:check  # Prettier 格式检查
npm run lint          # ESLint 代码检查
npm run type-check    # TypeScript 类型检查
npm run dead-code     # 死代码检测
```

**要求**:

- ✅ 所有检查必须通过 (0 errors, 0 warnings)
- ✅ 如果有 warnings,必须确认是可接受的
- ❌ 不允许有 TypeScript 类型错误
- ❌ 不允许有 ESLint errors

### 2. 构建验证 (重要功能修改时)

```bash
# 验证生产构建
npm run build

# 如果构建失败,检查错误信息并修复
# 常见原因:
# - TypeScript 类型错误
# - 未使用的导入
# - 环境变量缺失
```

**要求**:

- ✅ 构建必须成功完成
- ✅ 无 build-time 错误或警告
- ✅ 检查 .next 目录生成正常

### 3. 手动功能测试 (必需)

**基础测试流程**:

```bash
# 1. 启动开发服务器
npm run dev

# 2. 访问 http://localhost:3000
# 3. 执行以下测试
```

**测试检查项**:

- [ ] 登录/注册功能正常
- [ ] 主编辑器页面加载正常
- [ ] 图表生成功能正常
- [ ] 修改的功能模块工作正常
- [ ] 无控制台错误 (F12 检查)
- [ ] UI 无明显样式问题

### 4. Git 提交前检查

```bash
# 1. 查看修改内容
git status
git diff

# 2. 确认修改符合预期
# - 没有意外修改的文件
# - 没有提交临时文件或调试代码
# - 没有提交敏感信息 (.env.local 等)

# 3. 检查 .gitignore
# - .env.local 已忽略
# - node_modules/ 已忽略
# - .next/ 已忽略
# - diagram.db 已忽略 (如果是测试数据)
```

### 5. 提交代码

```bash
# 1. 暂存修改
git add .

# 2. 提交 (遵循 Conventional Commits)
git commit -m "feat(scope): 功能描述"

# 提交类型:
# - feat: 新功能
# - fix: 修复 bug
# - docs: 文档修改
# - refactor: 重构
# - test: 测试
# - chore: 构建/工具配置
# - perf: 性能优化
# - style: 代码格式

# 3. 推送到远程
git push
```

## 特定场景的额外检查

### A. 添加新 API 端点

**额外检查**:

- [ ] 使用 `withAuth` 中间件保护 (如需认证)
- [ ] 使用 Zod 验证请求参数
- [ ] 使用 `apiSuccess()` 和 `apiError()` 统一响应格式
- [ ] 添加错误处理 (try-catch)
- [ ] 在 Postman/curl 测试 API 端点
- [ ] 检查 HTTP 状态码正确 (200, 400, 401, 500)
- [ ] 验证错误消息有意义

**测试示例**:

```bash
# 测试 API 端点
curl -X POST http://localhost:3000/api/your-endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### B. 修改数据库 Schema

**额外检查**:

- [ ] 创建迁移脚本 (`src/lib/db/migrations/`)
- [ ] 更新 Schema 文件 (`schema.sql`)
- [ ] 更新 TypeScript 类型 (`src/types/database.ts`)
- [ ] 运行迁移脚本测试 (`npm run db:migrate`)
- [ ] 备份现有数据库
- [ ] 验证迁移可以回滚
- [ ] 更新相关 Repository 代码

**迁移测试**:

```bash
# 1. 备份数据库
cp diagram.db diagram.db.backup

# 2. 运行迁移
npm run db:migrate

# 3. 验证数据完整性
# - 检查表结构
# - 检查数据是否保留
# - 测试相关功能

# 4. 如果失败,恢复备份
cp diagram.db.backup diagram.db
```

### C. 添加新图表语言

**额外检查**:

- [ ] 在 `diagram-types.ts` 添加类型定义
- [ ] 创建 Prompt 目录和文件
- [ ] 更新数据库 Schema 枚举
- [ ] 添加语言图标 (`public/icons/languages/`)
- [ ] 测试生成功能
- [ ] 测试 Kroki 渲染
- [ ] 验证三层 Prompt 加载正常

**测试流程**:

```bash
# 1. 启动服务
npm run dev

# 2. 测试新语言
# - 选择新语言
# - 选择图表类型
# - 生成图表
# - 检查渲染结果

# 3. 检查 Prompt 加载
# - 查看开发者工具 Network
# - 确认 Prompt 正确拼接
```

### D. 修改 AI 提示词

**额外检查**:

- [ ] 保持三层结构 (L1 + L2 + L3)
- [ ] 测试生成质量
- [ ] 对比修改前后的输出
- [ ] 验证不同图表类型
- [ ] 检查是否影响其他语言

**测试流程**:

```bash
# 1. 修改 Prompt 文件
# 2. 重启服务 (Prompt 会重新加载)
npm run dev

# 3. 生成测试图表
# 4. 评估质量
# - 是否符合预期
# - 是否引入新问题
# - 语法是否正确
```

### E. 添加/修改 UI 组件

**额外检查**:

- [ ] 遵循组件命名约定 (PascalCase)
- [ ] 使用 TypeScript 定义 Props
- [ ] 添加必要的错误处理
- [ ] 测试不同屏幕尺寸 (响应式)
- [ ] 测试深色/浅色主题
- [ ] 检查无障碍性 (a11y)
- [ ] 验证 Loading 和 Error 状态

**测试流程**:

```bash
# 1. 开发者工具 (F12)
# - 切换设备模式 (手机/平板/桌面)
# - 测试不同屏幕尺寸

# 2. 主题切换
# - 测试浅色主题
# - 测试深色主题

# 3. 交互测试
# - 点击按钮
# - 输入表单
# - 查看错误状态
```

### F. 性能优化

**额外检查**:

- [ ] 使用 React DevTools Profiler 分析
- [ ] 检查不必要的重渲染
- [ ] 使用 memo/useMemo/useCallback 优化
- [ ] 验证构建体积 (bundle size)
- [ ] 测试页面加载速度
- [ ] 检查网络请求数量

**性能测试**:

```bash
# 1. 构建并分析
npm run build

# 2. 查看构建报告
# - 检查 .next 目录大小
# - 查看页面 bundle 大小
# - 识别大型依赖

# 3. Lighthouse 分析
# - 打开 Chrome DevTools
# - 运行 Lighthouse
# - 查看性能分数
```

## 提交前最终检查清单

### 代码质量

- [ ] `npm run ci` 全部通过
- [ ] `npm run build` 构建成功
- [ ] 手动测试功能正常
- [ ] 无控制台错误或警告
- [ ] 代码符合项目规范

### 文档更新

- [ ] 更新 CLAUDE.md (如果架构变更)
- [ ] 更新 README.md (如果功能变更)
- [ ] 添加代码注释 (复杂逻辑)
- [ ] 更新 API 文档 (如果 API 变更)

### Git 提交

- [ ] commit message 符合规范
- [ ] 没有提交临时文件
- [ ] 没有提交敏感信息
- [ ] 修改已暂存 (`git add`)

### 测试覆盖

- [ ] 手动测试新功能
- [ ] 回归测试相关功能
- [ ] 测试错误处理
- [ ] 测试边界情况

## 发布前检查 (生产环境)

### 安全检查

- [ ] 环境变量已配置 (.env.local)
- [ ] JWT_SECRET 已更新为生产密钥
- [ ] BCRYPT_SALT_ROUNDS >= 12
- [ ] 无硬编码密钥或密码
- [ ] API 路由已正确保护

### 性能检查

- [ ] 生产构建优化已启用
- [ ] 静态资源已压缩
- [ ] 图片已优化
- [ ] 使用 CDN (如适用)
- [ ] 数据库索引已优化

### 功能检查

- [ ] 所有核心功能正常
- [ ] 认证系统正常
- [ ] AI 生成功能正常
- [ ] 图表渲染正常
- [ ] 历史记录功能正常

### 监控检查

- [ ] 日志记录已启用
- [ ] 错误监控已配置
- [ ] 性能监控已配置
- [ ] 数据库备份已配置

## 快速检查命令

```bash
# 完整检查 (推荐)
npm run ci:full

# 快速检查 (不含构建)
npm run ci

# 格式化后检查
npm run format && npm run ci
```

## 常见问题排查

### ESLint 错误

```bash
# 自动修复简单问题
npm run lint -- --fix

# 查看详细错误
npm run lint
```

### TypeScript 错误

```bash
# 详细类型检查
npm run type-check

# 使用 IDE (VSCode) 查看错误
# - 安装 ESLint 和 TypeScript 扩展
# - 查看 Problems 面板
```

### 构建失败

```bash
# 清理后重新构建
npm run clean
npm run build

# 检查环境变量
cat .env.local
```

### 测试失败

```bash
# 重启开发服务器
# Ctrl+C 停止
npm run dev

# 清除浏览器缓存
# Cmd+Shift+R (macOS)
# Ctrl+Shift+R (Windows/Linux)
```
