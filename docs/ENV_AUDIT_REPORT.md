# 环境变量审查报告

**审查日期**: 2025-10-19
**审查范围**: DiagramAI 项目全部环境变量
**审查目标**: 发现遗留、冗余、命名不一致、硬编码配置等问题

---

## 📊 审查总结

### 问题统计

- ✅ **已修复**: Kroki 相关变量已完成清理
- ⚠️ **需要修复**: 8 个问题
- 🔍 **需要评估**: 3 个问题

### 严重性分级

- 🔴 **高**: 2 个 (命名不一致、遗留变量)
- 🟡 **中**: 4 个 (硬编码配置、未定义变量)
- 🟢 **低**: 2 个 (未使用变量、文档不同步)

---

## 🔴 高优先级问题

### 1. Kroki 环境变量命名不一致 ⚠️ CRITICAL

**问题描述**:

- **env.ts 定义**: `KROKI_URL` (服务端变量)
- **env.d.ts 类型**: `NEXT_PUBLIC_KROKI_URL` (客户端变量)
- **实际使用**: 前端通过硬编码 `/api/kroki` 访问

**影响**:

- 类型定义与实际使用不匹配
- env.d.ts 中的旧变量未清理

**位置**:

```typescript
// src/lib/constants/env.ts:70
export const KROKI_URL = process.env.KROKI_URL || "https://kroki.io";

// src/types/env.d.ts:99-123 (遗留定义)
NEXT_PUBLIC_KROKI_URL?: string;
NEXT_PUBLIC_KROKI_TIMEOUT?: string;        // ❌ 已废弃
NEXT_PUBLIC_KROKI_MAX_RETRIES?: string;    // ❌ 命名不一致
NEXT_PUBLIC_KROKI_RETRY_DELAY?: string;    // ❌ 命名不一致
```

**修复建议**:

```typescript
// src/types/env.d.ts - 需要更新为:
KROKI_URL?: string;                        // ✅ 后端统一访问
KROKI_MAX_RETRIES?: string;                // ✅ 去除 NEXT_PUBLIC_ 前缀
KROKI_RETRY_DELAY?: string;                // ✅ 去除 NEXT_PUBLIC_ 前缀
// ❌ 删除 NEXT_PUBLIC_KROKI_TIMEOUT (已废弃)
```

---

### 2. 未定义但使用的环境变量 🔴

**问题描述**:
`ENABLE_FAILURE_LOGGING` 在代码中使用,但未在 `env.d.ts` 中定义类型

**位置**:

```typescript
// src/lib/services/FailureLogService.ts:59
this.enabled = process.env.ENABLE_FAILURE_LOGGING !== "false";

// env.example:79
ENABLE_FAILURE_LOGGING = true;

// ❌ src/types/env.d.ts - 缺失定义
```

**影响**:

- 缺少 TypeScript 类型检查
- IDE 无法提供自动补全

**修复建议**:

```typescript
// src/types/env.d.ts - 添加:
/**
 * 失败日志开关
 *
 * 用途: 是否记录图表渲染失败日志
 * 默认值: 'true'
 */
ENABLE_FAILURE_LOGGING?: string;
```

---

## 🟡 中优先级问题

### 3. JWT 过期时间硬编码 🟡

**问题描述**:
JWT 有效期硬编码为 7 天,无法通过环境变量配置

**位置**:

```typescript
// src/lib/auth/jwt.ts:37
const JWT_EXPIRATION = "7d"; // 7 天有效期 - ❌ 硬编码
```

**影响**:

- 生产环境无法调整 Token 过期时间
- 开发/生产环境无法使用不同配置

**修复建议**:

```typescript
// src/lib/constants/env.ts - 添加:
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "7d";

// env.example - 添加:
# JWT Token 有效期 (默认 7 天)
# 格式: 数字+单位 (s=秒, m=分钟, h=小时, d=天)
# JWT_EXPIRATION=7d

// src/types/env.d.ts - 添加:
JWT_EXPIRATION?: string;
```

---

### 4. 未使用的 CUSTOM_KEY 🟡

**问题描述**:
`next.config.ts` 中定义了 `CUSTOM_KEY` 但项目中未使用

**位置**:

```typescript
// next.config.ts:145
env: {
  CUSTOM_KEY: process.env.CUSTOM_KEY,  // ❌ 无实际用途
},
```

**影响**:

- 代码混乱,增加维护成本
- 可能是测试代码遗留

**修复建议**:

```typescript
// next.config.ts - 删除整个 env 配置块:
// env: {
//   CUSTOM_KEY: process.env.CUSTOM_KEY,
// },
```

---

### 5. Kroki 重试变量命名不一致 🟡

**问题描述**:

- **env.ts**: `KROKI_MAX_RETRIES`, `KROKI_RETRY_DELAY` (无前缀)
- **env.d.ts**: `NEXT_PUBLIC_KROKI_MAX_RETRIES`, `NEXT_PUBLIC_KROKI_RETRY_DELAY` (有前缀)

**实际影响**:

- 类型定义与运行时不匹配
- 可能导致配置错误

**修复**: 已在问题 #1 中包含

---

### 6. 硬编码的前端代理路径 🟡

**问题描述**:
前端 Kroki 请求硬编码为 `/api/kroki`,无法配置

**位置**:

```typescript
// src/lib/utils/kroki.ts:33
const response = await fetch(`/api/kroki/${diagramType}/${outputFormat}`, {
  // ❌ 硬编码路径
```

**影响**:

- 无法支持不同部署环境 (如子路径部署)
- 降低灵活性

**修复建议**:

```typescript
// src/lib/constants/env.ts - 添加:
export const KROKI_PROXY_PATH = process.env.NEXT_PUBLIC_KROKI_PROXY_PATH || "/api/kroki";

// src/lib/utils/kroki.ts - 修改:
import { KROKI_PROXY_PATH } from "@/lib/constants/env";
const response = await fetch(`${KROKI_PROXY_PATH}/${diagramType}/${outputFormat}`, {

// env.example - 添加:
# Kroki 前端代理路径 (默认 /api/kroki)
# NEXT_PUBLIC_KROKI_PROXY_PATH=/api/kroki
```

---

## 🟢 低优先级问题

### 7. env.example 与 env.d.ts 不同步 🟢

**问题描述**:
`env.example` 中的部分注释与 `env.d.ts` 中的文档不一致

**示例**:

```bash
# env.example
# bcrypt 加密轮数（8=开发, 10=默认, 12=生产）

# env.d.ts (更详细)
# 性能参考:
# - 8 轮: ~25ms (开发环境推荐)
# - 10 轮: ~100ms (生产环境默认)
# - 12 轮: ~400ms (高安全性场景)
```

**修复建议**:

- 使用自动化脚本从 `env.d.ts` 生成 `env.example` 的注释
- 或保持 `env.example` 简洁,详细文档放在 `env.d.ts`

---

### 8. PROMPTS_DIR 不应该是环境变量 🟢

**问题描述**:
`PROMPTS_DIR` 是项目内部路径,不应该作为环境变量

**位置**:

```typescript
// src/lib/constants/env.ts:124
export const PROMPTS_DIR = "src/lib/constants/prompts"; // ❌ 硬编码,不需要环境变量
```

**影响**:

- 混淆了配置和常量的概念
- 增加了不必要的灵活性

**修复建议**:

```typescript
// 移动到 src/lib/constants/paths.ts (新建文件):
export const PROMPTS_DIR = "src/lib/constants/prompts";
export const DATA_DIR = "./data";
export const UPLOADS_DIR = "./uploads";

// src/lib/constants/env.ts - 移除 PROMPTS_DIR
```

---

## 🔍 需要评估的问题

### 1. NODE_ENV 的使用是否规范? 🔍

**当前使用**:

```typescript
// 多处直接使用 process.env.NODE_ENV
if (process.env.NODE_ENV === "development") {
}
if (process.env.NODE_ENV === "test") {
}
```

**问题**:

- 未统一管理
- 没有类型安全

**建议**:

```typescript
// src/lib/constants/env.ts - 添加:
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_TEST = process.env.NODE_ENV === "test";

// 使用时:
if (IS_DEVELOPMENT) {
} // ✅ 更清晰
```

---

### 2. 是否需要添加环境验证? 🔍

**问题**:

- 缺少启动时的环境变量验证
- 可能导致运行时错误

**建议**:

```typescript
// src/lib/constants/env.ts - 添加:
export function validateEnv() {
  const required = ["JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`缺少必需的环境变量: ${missing.join(", ")}`);
  }
}

// 在 app 启动时调用
```

---

### 3. 是否需要环境变量分类管理? 🔍

**当前问题**:

- 所有变量混在一起
- 难以区分核心配置和可选配置

**建议结构**:

```typescript
// src/lib/constants/env.ts
export const ENV = {
  // 核心配置 (必需)
  security: {
    JWT_SECRET,
    BCRYPT_SALT_ROUNDS,
  },

  // 数据库配置
  database: {
    DB_PATH,
    DB_TIMEOUT,
  },

  // 外部服务
  services: {
    KROKI_URL,
    KROKI_MAX_RETRIES,
    KROKI_RETRY_DELAY,
  },

  // AI 配置
  ai: {
    AI_TEMPERATURE,
    AI_MAX_RETRIES,
    API_TEST_TIMEOUT,
  },

  // 应用配置
  app: {
    MAX_INPUT_TEXT_LENGTH,
    MAX_CHAT_ROUNDS,
    APP_URL,
  },
} as const;
```

---

## 📋 修复优先级建议

### 立即修复 (本次迁移)

1. ✅ **Kroki 环境变量类型定义** - 同步 env.d.ts
2. ✅ **删除 CUSTOM_KEY** - 清理无用代码
3. ✅ **添加 ENABLE_FAILURE_LOGGING 类型** - 补充缺失定义

### 下一步修复 (后续优化)

4. **JWT_EXPIRATION 可配置化** - 提升灵活性
5. **PROMPTS_DIR 移至 paths.ts** - 分离配置和常量
6. **添加 KROKI_PROXY_PATH** - 支持灵活部署

### 长期改进 (架构优化)

7. **环境变量分类管理** - 提升可维护性
8. **添加启动时验证** - 提前发现配置错误
9. **NODE_ENV 统一管理** - 提升类型安全

---

## 📊 环境变量完整清单

### 当前有效的环境变量 (14 个)

#### 安全配置 (必需)

- `JWT_SECRET` - JWT 签名密钥 ✅
- `BCRYPT_SALT_ROUNDS` - 密码加密轮数 ✅

#### 数据库配置

- `DB_PATH` - SQLite 文件路径 ✅
- `DB_TIMEOUT` - 数据库超时 ✅

#### AI 配置

- `AI_TEMPERATURE` - 生成温度 ✅
- `AI_MAX_RETRIES` - 重试次数 ✅
- `API_TEST_TIMEOUT` - 连接测试超时 ✅

#### Kroki 配置

- `KROKI_URL` - 服务地址 ✅
- `KROKI_MAX_RETRIES` - 重试次数 ✅
- `KROKI_RETRY_DELAY` - 重试延迟 ✅

#### 应用配置

- `NEXT_PUBLIC_MAX_INPUT_CHARS` - 最大输入字符 ✅
- `NEXT_PUBLIC_MAX_CHAT_ROUNDS` - 最大对话轮次 ✅
- `NEXT_PUBLIC_APP_URL` - 应用 URL ✅

#### 功能开关

- `ENABLE_FAILURE_LOGGING` - 失败日志开关 ⚠️ (未定义类型)

---

### 遗留/废弃的环境变量 (4 个)

- ❌ `NEXT_PUBLIC_KROKI_URL` - 已改为 `KROKI_URL`
- ❌ `NEXT_PUBLIC_KROKI_TIMEOUT` - 已移除超时配置
- ❌ `KROKI_INTERNAL_URL` - 已合并到 `KROKI_URL`
- ❌ `CUSTOM_KEY` - 测试代码遗留

---

## 🎯 建议的修复 PR

### PR #1: 清理 Kroki 遗留变量

- 更新 `env.d.ts` 中的 Kroki 类型定义
- 删除 `NEXT_PUBLIC_KROKI_TIMEOUT`
- 统一命名为 `KROKI_*` (去除 NEXT*PUBLIC* 前缀)

### PR #2: 补充缺失定义

- 添加 `ENABLE_FAILURE_LOGGING` 类型定义
- 添加 `JWT_EXPIRATION` 可配置支持
- 添加 `KROKI_PROXY_PATH` 前端路径配置

### PR #3: 代码清理

- 删除 `next.config.ts` 中的 `CUSTOM_KEY`
- 移动 `PROMPTS_DIR` 到 `paths.ts`
- 统一 `NODE_ENV` 使用方式

---

## 📝 总结

DiagramAI 的环境变量管理总体较为规范,但存在以下主要问题:

1. **Kroki 迁移不彻底** - 类型定义与实际使用不匹配
2. **缺少类型定义** - `ENABLE_FAILURE_LOGGING` 等变量未定义
3. **硬编码配置** - JWT 过期时间、前端代理路径等应可配置
4. **遗留代码** - `CUSTOM_KEY` 等无用变量需清理

建议按照优先级逐步修复,先解决高优先级的命名不一致和缺失定义问题,再进行架构优化。
