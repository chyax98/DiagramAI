# DiagramAI 代码风格与约定

## TypeScript 配置

### 严格模式 (全部启用)

- `strict: true` - 启用所有严格类型检查
- `noImplicitAny: true` - 禁止隐式 any
- `strictNullChecks: true` - null/undefined 严格检查
- `strictFunctionTypes: true` - 函数参数类型严格检查
- `noUnusedLocals: true` - 禁止未使用的局部变量
- `noUnusedParameters: true` - 禁止未使用的函数参数
- `noImplicitReturns: true` - 函数所有路径都要有返回值
- `noUncheckedIndexedAccess: true` - 索引访问返回 T | undefined

### 路径别名

```typescript
@/*                 → ./src/*
@/components/*      → ./src/components/*
@/lib/*             → ./src/lib/*
@/types/*           → ./src/types/*
@/contexts/*        → ./src/contexts/*
@/hooks/*           → ./src/hooks/*
@/app/*             → ./src/app/*
```

## Prettier 格式化规则

```json
{
  "semi": true, // 使用分号
  "singleQuote": false, // 使用双引号
  "tabWidth": 2, // 2 空格缩进
  "trailingComma": "es5", // ES5 拖尾逗号
  "printWidth": 100, // 行宽 100 字符
  "arrowParens": "always", // 箭头函数参数始终加括号
  "endOfLine": "lf", // LF 换行符
  "bracketSpacing": true, // 对象花括号加空格
  "jsxSingleQuote": false, // JSX 使用双引号
  "proseWrap": "preserve" // Markdown 保持原样
}
```

## ESLint 规则要点

### TypeScript 规则

- **允许未使用的变量/参数**: 以 `_` 开头的变量允许未使用
- **允许 any**: 开发时允许 `any` (上线前建议改为 warn)
- **允许非空断言**: `!` 非空断言允许使用

### React 规则

- **不需要导入 React**: React 17+ 自动导入
- **不需要 prop-types**: TypeScript 已提供类型检查
- **Hooks 规则**: 严格遵守 Hooks 规则 (error)
- **列表渲染**: 必须有 key (error)
- **组件命名**: 必须使用 PascalCase (error)
- **自闭合标签**: 推荐使用自闭合 (warn)

### 代码质量规则

- **禁止 var**: 必须使用 const/let (error)
- **优先 const**: 不变的变量使用 const (warn)
- **禁止重复导入**: 同一模块不能重复导入 (error)
- **Console**: 允许 console.warn/error/info (warn)

### 安全性规则

- **禁止 eval**: 禁止所有形式的 eval (error)
- **禁止 Function 构造器**: 禁止 new Function() (error)
- **禁止 javascript: URL**: 禁止 javascript: 协议 (error)

### Import 顺序规则

```
1. builtin    - Node.js 内置模块
2. external   - npm 包
3. internal   - 内部模块
4. parent     - 父级目录
5. sibling    - 同级目录
6. index      - index 文件
7. object     - 命名空间导入
8. type       - 类型导入

特殊规则:
- @/** 模式归类为 internal (内部模块)
```

## 命名约定

### 文件命名

- **组件**: PascalCase (例: `DiagramEditor.tsx`, `ModelSelector.tsx`)
- **工具函数**: kebab-case (例: `code-cleaner.ts`, `prompt-loader.ts`)
- **类型定义**: kebab-case (例: `diagram-types.ts`, `database.ts`)
- **Repository**: PascalCase (例: `UserRepository.ts`, `ModelRepository.ts`)
- **Service**: PascalCase (例: `DiagramGenerationService.ts`)

### 变量命名

- **组件**: PascalCase (例: `DiagramEditor`, `ModelForm`)
- **函数**: camelCase (例: `generateKrokiURL`, `cleanCode`)
- **常量**: UPPER_SNAKE_CASE (例: `MAX_RETRIES`, `DEFAULT_TEMPERATURE`)
- **类型/接口**: PascalCase (例: `User`, `AIModel`, `GenerationHistory`)
- **枚举**: PascalCase (例: `RenderLanguage`, `DiagramType`)

### 特殊约定

- **私有变量**: 以 `_` 开头 (例: `_internalState`)
- **未使用参数**: 以 `_` 开头 (例: `_unusedParam`)
- **React Hooks**: 以 `use` 开头 (例: `useEditorActions`, `usePrompt`)
- **Context**: 以 `Context` 结尾 (例: `AuthContext`, `ThemeContext`)

## 注释约定

### 文件头注释

```typescript
/**
 * 模块名称 - 简短描述
 *
 * 详细说明模块功能和用途
 */
```

### 函数注释

```typescript
/**
 * 函数功能描述
 *
 * @param paramName - 参数说明
 * @returns 返回值说明
 * @throws 可能抛出的错误
 */
```

### 行内注释

```typescript
// 单行注释使用中文,解释"为什么"而非"是什么"
const result = complexCalculation(); // 计算复杂逻辑的原因
```

## 组件结构约定

### React 组件标准结构

```typescript
// 1. Import 声明 (按 import 顺序规则)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Props } from "./types";

// 2. 类型定义
interface ComponentProps {
  // ...
}

// 3. 常量定义
const DEFAULT_VALUE = "...";

// 4. 组件定义
export function Component({ props }: ComponentProps) {
  // 4.1 Hooks (useState, useEffect, custom hooks)
  const [state, setState] = useState();

  // 4.2 事件处理函数
  const handleClick = () => {
    // ...
  };

  // 4.3 渲染逻辑
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 5. 辅助函数/子组件
function HelperComponent() {
  // ...
}
```

## 架构约定

### Repository 层

- **职责**: 仅处理数据库操作,不包含业务逻辑
- **返回值**: 返回数据库实体或 null,不抛出错误
- **事务**: 使用 better-sqlite3 的事务 API

### Service 层

- **职责**: 处理业务逻辑,协调多个 Repository
- **错误处理**: 抛出有意义的业务错误
- **依赖**: 通过构造函数注入 Repository

### API 层

- **响应格式**: 使用 `apiSuccess()` 和 `apiError()` 统一格式
- **认证**: 使用 `withAuth` 中间件保护路由
- **验证**: 使用 Zod 验证请求参数

### 前端组件

- **状态管理**: 优先使用 Zustand,局部状态使用 useState
- **数据获取**: 使用自定义 Hook 封装 API 调用
- **表单**: 使用 React Hook Form + Zod 验证
- **UI 组件**: 基于 shadcn/ui + Radix UI

## Git 提交规范

### Conventional Commits

```
feat: 新功能
fix: 修复 bug
docs: 文档修改
refactor: 重构 (不改变功能)
test: 测试相关
chore: 构建/工具配置
perf: 性能优化
style: 代码格式 (不影响逻辑)
```

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

示例:

```
feat(prompt): 添加用户自定义提示词功能

- 新增 custom_prompts 数据库表
- 实现 PromptRepository 数据访问层
- 添加 6 个 API 端点支持 CRUD 操作
- 实现版本管理和激活版本功能

Close #123
```
