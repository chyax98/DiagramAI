# Phase 2: 类型定义集中化 + L3 数据库迁移

**规划日期**: 2025-10-19
**预计工期**: 1-2 周
**优先级**: 高

---

## 🎯 目标

### 目标 1: 类型定义集中化管理

**问题**:
- 当前 `diagram-types.ts` 类型定义分散
- 启用/禁用图表类型需要修改多处
- 维护成本高,容易出错

**解决方案**:
- 创建单一数据源 (SSOT) 配置文件
- 所有语言和类型定义统一管理
- 支持通过注释单行来启用/禁用
- 自动生成 TypeScript 类型定义

### 目标 2: L3 Prompt 写入数据库

**问题**:
- L3 Prompt 存储在文件系统,无法动态修改
- 无法支持用户自定义 Prompt
- 无法支持版本管理和 A/B 测试

**解决方案**:
- 将所有 86 个 L3 TOML 文件内容迁移到 `custom_prompts` 表
- 系统默认 Prompt 的 `user_id` 为 `NULL`
- 支持版本管理 (v1.0.0 → v1.0.1)
- 支持用户自定义覆盖系统默认

---

## 📋 实施计划

### 阶段 1: 类型定义集中化 (3-5 天)

#### 1.1 创建集中配置文件

**文件**: `src/lib/constants/diagram-config.ts`

```typescript
/**
 * 图表语言和类型的集中配置 - SSOT
 *
 * 维护说明:
 * - 要禁用某个语言,设置 enabled: false
 * - 要禁用某个图表类型,设置该类型的 enabled: false
 * - 修改后会自动生成 TypeScript 类型定义
 */

export interface DiagramTypeConfig {
  value: string;
  label: string;
  description: string;
  enabled: boolean;  // ⭐ 新增: 一键启用/禁用
}

export interface LanguageConfig {
  value: string;
  label: string;
  description: string;
  iconPath: string;
  enabled: boolean;  // ⭐ 新增: 一键启用/禁用
  types: DiagramTypeConfig[];
}

export const DIAGRAM_CONFIG: Record<string, LanguageConfig> = {
  // ===== Tier 1: 核心语言 =====
  mermaid: {
    value: "mermaid",
    label: "Mermaid",
    description: "流程图、时序图、类图等 14 种图表",
    iconPath: "/icons/languages/mermaid.svg",
    enabled: true,  // ⭐ 要禁用整个语言,设置为 false
    types: [
      { value: "flowchart", label: "流程图", description: "展示流程、步骤和决策", enabled: true },
      { value: "sequence", label: "时序图", description: "展示对象间的交互时序", enabled: true },
      { value: "class", label: "类图", description: "展示类的结构和关系", enabled: true },
      // ... 其他类型
    ]
  },

  // ... 其他 22 种语言

} as const;
```

#### 1.2 自动生成类型定义

**文件**: `scripts/generate-diagram-types.ts`

```typescript
/**
 * 从 diagram-config.ts 自动生成 diagram-types.ts
 *
 * 运行: npm run generate:types
 */

import { DIAGRAM_CONFIG } from '../src/lib/constants/diagram-config';

function generateTypes() {
  // 1. 过滤启用的语言
  const enabledLanguages = Object.values(DIAGRAM_CONFIG)
    .filter(lang => lang.enabled);

  // 2. 生成 RenderLanguage 类型
  const renderLanguageType = enabledLanguages
    .map(lang => `  | "${lang.value}"`)
    .join('\n');

  // 3. 生成 RENDER_LANGUAGES 数组
  const renderLanguagesArray = enabledLanguages
    .map(lang => `  {
    value: "${lang.value}",
    label: "${lang.label}",
    description: "${lang.description}",
    iconPath: "${lang.iconPath}",
  }`)
    .join(',\n');

  // 4. 生成 LANGUAGE_DIAGRAM_TYPES 对象
  const languageDiagramTypes = enabledLanguages
    .map(lang => {
      const enabledTypes = lang.types.filter(t => t.enabled);
      const typesArray = enabledTypes
        .map(type => `    { value: "${type.value}", label: "${type.label}", description: "${type.description}" }`)
        .join(',\n');
      return `  ${lang.value}: [\n${typesArray}\n  ] as const`;
    })
    .join(',\n\n');

  // 5. 生成完整文件
  const output = `/**
 * 此文件自动生成,请勿手动编辑!
 * 生成时间: ${new Date().toISOString()}
 * 生成命令: npm run generate:types
 * 源文件: src/lib/constants/diagram-config.ts
 */

export type RenderLanguage =
${renderLanguageType};

export interface DiagramTypeInfo {
  value: string;
  label: string;
  description: string;
}

export interface RenderLanguageInfo {
  value: RenderLanguage;
  label: string;
  description: string;
  iconPath: string;
}

export const RENDER_LANGUAGES: readonly RenderLanguageInfo[] = [
${renderLanguagesArray}
] as const;

export const LANGUAGE_DIAGRAM_TYPES: Record<RenderLanguage, readonly DiagramTypeInfo[]> = {
${languageDiagramTypes}
} as const;

// ... 其他辅助函数
`;

  // 6. 写入文件
  fs.writeFileSync('src/lib/constants/diagram-types.ts', output);
  console.log('✅ diagram-types.ts 生成成功!');
}

generateTypes();
```

#### 1.3 添加 npm 脚本

**文件**: `package.json`

```json
{
  "scripts": {
    "generate:types": "tsx scripts/generate-diagram-types.ts",
    "predev": "npm run generate:types",
    "prebuild": "npm run generate:types"
  }
}
```

#### 1.4 验收标准

- [ ] `diagram-config.ts` 包含所有 23 种语言的配置
- [ ] 每种语言都有 `enabled` 字段
- [ ] 每个图表类型都有 `enabled` 字段
- [ ] 自动生成脚本正常工作
- [ ] 生成的 `diagram-types.ts` TypeScript 检查通过
- [ ] 注释一个语言/类型,重新生成后前端不显示该选项

---

### 阶段 2: L3 Prompt 数据库迁移 (2-3 天)

#### 2.1 数据库准备

**验证 `custom_prompts` 表结构**:

```sql
-- 检查表是否存在
SELECT * FROM sqlite_master WHERE type='table' AND name='custom_prompts';

-- 检查索引
SELECT * FROM sqlite_master WHERE type='index' AND tbl_name='custom_prompts';
```

**表结构 (应该已存在)**:

```sql
CREATE TABLE custom_prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,  -- NULL 表示系统默认
  level TEXT NOT NULL CHECK (level IN ('L1', 'L2', 'L3')),
  render_language TEXT CHECK (
    render_language IS NULL OR
    render_language IN (
      'mermaid', 'plantuml', 'd2', 'graphviz', ..., 'umlet'
    )
  ),
  diagram_type TEXT,  -- L3 必需
  content TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  is_active BOOLEAN NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE (user_id, level, render_language, diagram_type, version),
  CHECK (
    (level = 'L1' AND render_language IS NULL AND diagram_type IS NULL) OR
    (level = 'L2' AND render_language IS NOT NULL AND diagram_type IS NULL) OR
    (level = 'L3' AND render_language IS NOT NULL AND diagram_type IS NOT NULL)
  )
);
```

#### 2.2 数据迁移脚本

**文件**: `scripts/migrate-l3-to-db.ts`

```typescript
/**
 * 将所有 L3 TOML 文件迁移到数据库
 *
 * 运行: npm run migrate:l3
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import * as toml from '@iarna/toml';
import { db } from '../src/lib/db/client';

async function migrateL3ToDatabase() {
  console.log('🚀 开始迁移 L3 TOML 文件到数据库...\n');

  // 1. 查找所有 L3 TOML 文件
  const l3Files = glob.sync('Promote-V4/data/L3/**/*.toml');
  console.log(`📁 找到 ${l3Files.length} 个 L3 TOML 文件\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const filePath of l3Files) {
    try {
      // 2. 解析文件路径获取 language 和 type
      // 例如: Promote-V4/data/L3/mermaid/flowchart.toml
      const parts = filePath.split('/');
      const renderLanguage = parts[parts.length - 2];  // mermaid
      const diagramType = path.basename(filePath, '.toml');  // flowchart

      // 3. 读取 TOML 文件内容
      const content = fs.readFileSync(filePath, 'utf-8');

      // 4. 解析 TOML 获取版本号
      const parsed = toml.parse(content) as any;
      const version = parsed.meta?.version || '1.0.0';

      // 5. 检查数据库中是否已存在
      const existing = db.prepare(`
        SELECT id FROM custom_prompts
        WHERE user_id IS NULL
          AND level = 'L3'
          AND render_language = ?
          AND diagram_type = ?
          AND version = ?
      `).get(renderLanguage, diagramType, version);

      if (existing) {
        console.log(`⏭️  跳过: ${renderLanguage}/${diagramType} v${version} (已存在)`);
        skipCount++;
        continue;
      }

      // 6. 插入数据库 (user_id 为 NULL 表示系统默认)
      db.prepare(`
        INSERT INTO custom_prompts (
          user_id,
          level,
          render_language,
          diagram_type,
          content,
          version,
          is_active
        ) VALUES (NULL, 'L3', ?, ?, ?, ?, 1)
      `).run(renderLanguage, diagramType, content, version);

      console.log(`✅ 插入: ${renderLanguage}/${diagramType} v${version}`);
      successCount++;

    } catch (error) {
      console.error(`❌ 错误: ${filePath}`, error);
      errorCount++;
    }
  }

  console.log('\n📊 迁移统计:');
  console.log(`   ✅ 成功: ${successCount} 个`);
  console.log(`   ⏭️  跳过: ${skipCount} 个`);
  console.log(`   ❌ 失败: ${errorCount} 个`);
  console.log('\n🎉 迁移完成!');
}

migrateL3ToDatabase();
```

#### 2.3 更新 Prompt 加载器

**文件**: `src/lib/utils/prompt-toml-loader.ts`

```typescript
/**
 * 修改 loadL3Prompt 函数,优先从数据库加载
 */

export function loadL3Prompt(
  renderLanguage: RenderLanguage,
  diagramType: string
): string | null {
  // 1. 优先从数据库加载 (用户自定义 > 系统默认)
  const dbPrompt = db.prepare(`
    SELECT content FROM custom_prompts
    WHERE level = 'L3'
      AND render_language = ?
      AND diagram_type = ?
      AND is_active = 1
    ORDER BY
      user_id IS NOT NULL DESC,  -- 用户自定义优先
      version DESC                -- 最新版本优先
    LIMIT 1
  `).get(renderLanguage, diagramType) as { content: string } | undefined;

  if (dbPrompt) {
    return dbPrompt.content;
  }

  // 2. Fallback: 从文件系统加载 (兼容性)
  const filePath = path.join(
    process.cwd(),
    'Promote-V4/data/L3',
    renderLanguage,
    `${diagramType}.toml`
  );

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  return null;
}
```

#### 2.4 验收标准

- [ ] 所有 86 个 L3 TOML 文件成功迁移到数据库
- [ ] `user_id` 为 `NULL` 的记录表示系统默认
- [ ] `version` 字段正确 (从 TOML meta 读取)
- [ ] `is_active` 字段默认为 `TRUE`
- [ ] Prompt 加载器优先从数据库读取
- [ ] Fallback 到文件系统正常工作
- [ ] 生成图表功能正常 (使用数据库 Prompt)

---

## 🚀 执行顺序

**建议按以下顺序执行**:

1. **阶段 1.1-1.3**: 创建集中配置和自动生成脚本 (2 天)
   - 创建 `diagram-config.ts`
   - 编写 `generate-diagram-types.ts`
   - 添加 npm 脚本

2. **阶段 1.4**: 验证类型定义集中化 (1 天)
   - 测试启用/禁用语言
   - 测试启用/禁用图表类型
   - TypeScript 类型检查

3. **阶段 2.1-2.2**: 数据库迁移准备和执行 (1 天)
   - 验证表结构
   - 编写迁移脚本
   - 执行迁移

4. **阶段 2.3-2.4**: 更新加载器和验证 (1 天)
   - 修改 Prompt 加载器
   - 测试数据库加载
   - 测试 Fallback 机制

---

## 📊 预期成果

### 改进点 1: 维护性提升

**之前**:
```typescript
// 要禁用 Mermaid 的 gitgraph 类型,需要修改 3 处:
export type RenderLanguage = ... | "mermaid" | ...;  // 不能注释
export const RENDER_LANGUAGES = [{ value: "mermaid" }];  // 不能注释
export const LANGUAGE_DIAGRAM_TYPES = {
  mermaid: [
    { value: "gitgraph", ... },  // 需要删除或注释这一行
  ]
};
```

**之后**:
```typescript
// 只需在 diagram-config.ts 修改 1 处:
mermaid: {
  types: [
    { value: "gitgraph", enabled: false },  // ⭐ 只改这里!
  ]
}
```

### 改进点 2: 动态 Prompt 管理

**之前**:
- L3 Prompt 存储在文件系统
- 修改需要重启服务
- 无法支持用户自定义
- 无法版本管理

**之后**:
- L3 Prompt 存储在数据库
- 修改立即生效
- 支持用户自定义 (通过 UI 界面)
- 支持版本管理和回滚
- 支持 A/B 测试

---

## ⚠️ 风险和注意事项

### 风险 1: 数据库迁移失败

**缓解措施**:
- 迁移前备份数据库
- 保留文件系统 Prompt 作为 Fallback
- 分批迁移,验证一批再迁移下一批

### 风险 2: 类型生成脚本错误

**缓解措施**:
- 先在测试环境验证
- 保留当前 `diagram-types.ts` 作为备份
- 添加完整的单元测试

### 风险 3: 性能影响

**缓解措施**:
- 数据库查询添加索引
- Prompt 加载结果缓存 (内存或 Redis)
- 压测验证性能

---

**创建日期**: 2025-10-19
**状态**: 待执行
**优先级**: 高
**预计完成时间**: 1-2 周
