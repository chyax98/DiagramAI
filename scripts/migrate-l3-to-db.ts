#!/usr/bin/env tsx
/**
 * 将所有 L3 TOML 文件迁移到数据库 custom_prompts 表
 *
 * 执行: npm run migrate:l3
 * 或: tsx scripts/migrate-l3-to-db.ts
 */

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

// 递归查找 TOML 文件
function findTomlFiles(dir: string): string[] {
  const results: string[] = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results.push(...findTomlFiles(fullPath));
    } else if (file.name.endsWith('.toml')) {
      results.push(fullPath);
    }
  }

  return results;
}

// 数据库连接
const dbPath = path.join(process.cwd(), 'data/diagram-ai.db');
const db = new Database(dbPath);

// 系统管理员用户 ID (user_id = 1, 通常是第一个注册的用户或管理员)
const SYSTEM_USER_ID = 1;

interface MigrationStats {
  total: number;
  success: number;
  skip: number;
  error: number;
  errors: Array<{ file: string; error: string }>;
}

async function migrateL3ToDatabase() {
  console.log('🚀 开始迁移 L3 TOML 文件到数据库...\n');

  const stats: MigrationStats = {
    total: 0,
    success: 0,
    skip: 0,
    error: 0,
    errors: []
  };

  try {
    // 1. 确认系统用户存在
    const systemUser = db.prepare('SELECT id FROM users WHERE id = ?').get(SYSTEM_USER_ID);
    if (!systemUser) {
      console.error(`❌ 错误: 系统用户 (id=${SYSTEM_USER_ID}) 不存在!`);
      console.error('请先创建系统管理员用户或修改 SYSTEM_USER_ID 常量');
      process.exit(1);
    }

    // 2. 查找所有 L3 TOML 文件
    const l3Dir = path.join(process.cwd(), 'Promote-V4/data/L3');
    const l3Files = findTomlFiles(l3Dir);
    stats.total = l3Files.length;

    console.log(`📁 找到 ${stats.total} 个 L3 TOML 文件\n`);

    // 3. 准备 SQL 语句
    const checkStmt = db.prepare(`
      SELECT id FROM custom_prompts
      WHERE user_id = ?
        AND prompt_level = 3
        AND render_language = ?
        AND diagram_type = ?
        AND version = ?
    `);

    const insertStmt = db.prepare(`
      INSERT INTO custom_prompts (
        user_id,
        prompt_level,
        render_language,
        diagram_type,
        version,
        version_name,
        is_active,
        content,
        meta_info
      ) VALUES (?, 3, ?, ?, ?, ?, 1, ?, ?)
    `);

    // 4. 开始事务
    const migrate = db.transaction(() => {
      for (const filePath of l3Files) {
        try {
          // 解析文件路径
          // 例如: Promote-V4/data/L3/mermaid/flowchart.toml
          const parts = filePath.split(path.sep);
          const renderLanguage = parts[parts.length - 2];  // mermaid
          const diagramType = path.basename(filePath, '.toml');  // flowchart

          // 读取文件内容
          const content = fs.readFileSync(filePath, 'utf-8');

          // 简单解析版本号 (从 TOML meta 部分)
          const versionMatch = content.match(/version\s*=\s*"([^"]+)"/);
          const version = versionMatch ? versionMatch[1] : '1.0.0';

          // 解析 description 作为 version_name
          const descMatch = content.match(/description\s*=\s*"([^"]+)"/);
          const versionName = descMatch ? descMatch[1] : null;

          // 检查是否已存在
          const existing = checkStmt.get(
            SYSTEM_USER_ID,
            renderLanguage,
            diagramType,
            version
          );

          if (existing) {
            console.log(`⏭️  跳过: ${renderLanguage}/${diagramType} v${version} (已存在)`);
            stats.skip++;
            continue;
          }

          // 构建 meta_info JSON
          const metaInfo = JSON.stringify({
            source: 'file_migration',
            original_path: filePath,
            migrated_at: new Date().toISOString()
          });

          // 插入数据库
          insertStmt.run(
            SYSTEM_USER_ID,
            renderLanguage,
            diagramType,
            version,
            versionName,
            content,
            metaInfo
          );

          console.log(`✅ 插入: ${renderLanguage}/${diagramType} v${version}`);
          stats.success++;

        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          console.error(`❌ 错误: ${filePath} - ${errorMsg}`);
          stats.error++;
          stats.errors.push({ file: filePath, error: errorMsg });
        }
      }
    });

    // 5. 执行事务
    migrate();

    // 6. 输出统计
    console.log('\n📊 迁移统计:');
    console.log(`   📁 总计: ${stats.total} 个文件`);
    console.log(`   ✅ 成功: ${stats.success} 个`);
    console.log(`   ⏭️  跳过: ${stats.skip} 个 (已存在)`);
    console.log(`   ❌ 失败: ${stats.error} 个`);

    if (stats.errors.length > 0) {
      console.log('\n❌ 错误详情:');
      stats.errors.forEach(({ file, error }) => {
        console.log(`   - ${file}`);
        console.log(`     ${error}`);
      });
    }

    console.log('\n🎉 迁移完成!');

    // 7. 验证结果
    const count = db.prepare(`
      SELECT COUNT(*) as count FROM custom_prompts
      WHERE user_id = ? AND prompt_level = 3
    `).get(SYSTEM_USER_ID) as { count: number };

    console.log(`\n✅ 数据库验证: 共 ${count.count} 条 L3 记录`);

  } catch (error) {
    console.error('\n❌ 迁移失败:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// 执行迁移
migrateL3ToDatabase();
