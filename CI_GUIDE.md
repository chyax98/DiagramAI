# CI/CD 质量检查指南

本项目配置了完整的 CI/CD 质量检查流程,以减少代码缺陷。

## 🔍 本地检查命令

### 快速检查 (推荐在提交前运行)
```bash
npm run precommit
```
包含:
- ✅ 代码格式检查 (Prettier)
- ✅ ESLint 规则检查
- ✅ TypeScript 类型检查

### 完整 CI 检查
```bash
npm run ci
```
包含上述检查 + 死代码检测 (knip)

### 最完整检查 (包含构建)
```bash
npm run ci:full
```
包含所有检查 + 生产构建验证

## 🛠️ 单项检查命令

| 命令 | 说明 | 修复命令 |
|------|------|----------|
| `npm run format:check` | 检查代码格式 | `npm run format` |
| `npm run lint` | ESLint 检查 | `npm run lint -- --fix` |
| `npm run type-check` | TypeScript 类型检查 | 手动修复类型错误 |
| `npm run dead-code` | 检测未使用代码 | 手动清理或更新 knip 配置 |
| `npm run dead-code:exports` | 仅检测未使用导出 | - |
| `npm run dead-code:deps` | 仅检测未使用依赖 | `npm uninstall <package>` |

## 🤖 自动化检查

### Git Hooks (Husky)
项目配置了 pre-commit hook,在每次提交前自动运行:
- 代码格式检查
- ESLint 检查
- TypeScript 类型检查

如果检查失败,提交将被阻止。

**跳过 hooks** (不推荐):
```bash
git commit --no-verify -m "your message"
```

### GitHub Actions CI
每次 push 或 PR 到 `main`/`develop` 分支时自动运行:

#### 1. **代码质量检查** (quality-checks)
- 在 Node.js 18.x 和 20.x 上测试
- 运行所有质量检查工具
- 死代码检测 (允许失败,仅警告)

#### 2. **构建测试** (build)
- 验证生产构建成功
- 检查构建产物完整性

#### 3. **依赖安全审计** (dependency-audit)
- npm audit 安全漏洞检查
- depcheck 未使用依赖检测

## 📋 质量标准

所有代码必须通过以下检查才能合并:

- ✅ **格式规范**: 符合 Prettier 配置
- ✅ **代码规范**: 通过 ESLint 检查
- ✅ **类型安全**: 通过 TypeScript 严格模式
- ✅ **可构建**: 生产构建成功
- ⚠️ **无死代码**: knip 检测 (建议,非强制)
- ⚠️ **依赖安全**: 无高危漏洞 (建议,非强制)

## 🔧 配置文件

| 文件 | 说明 |
|------|------|
| `.github/workflows/ci.yml` | GitHub Actions CI 配置 |
| `.husky/pre-commit` | Git pre-commit hook |
| `knip.json` | 死代码检测配置 |
| `.prettierrc` | 代码格式配置 |
| `eslint.config.mjs` | ESLint 配置 |
| `tsconfig.json` | TypeScript 配置 |

## 🚨 常见问题

### 1. Pre-commit hook 太慢
可以临时跳过 (不推荐):
```bash
git commit --no-verify -m "your message"
```

或优化检查范围 (仅检查暂存文件):
```bash
# 修改 .husky/pre-commit 使用 lint-staged
```

### 2. Knip 误报未使用代码
编辑 `knip.json` 添加忽略规则:
```json
{
  "ignore": ["src/lib/your-file.ts"]
}
```

### 3. CI 构建失败但本地成功
- 检查 Node.js 版本一致性
- 确保 `package-lock.json` 已提交
- 验证环境变量配置

## 📚 最佳实践

1. **提交前**: 运行 `npm run precommit` 快速检查
2. **重大改动**: 运行 `npm run ci:full` 完整验证
3. **定期清理**: 每月运行 `npm run dead-code` 检查废弃代码
4. **依赖更新**: 更新后运行 `npm audit` 检查安全性

---

**目标**: 通过自动化检查,在代码合并前发现和修复问题,保持代码库高质量。
