#!/usr/bin/env tsx

/**
 * 迁移 data/prompts/ 目录中的所有 prompt 文件到数据库
 *
 * 用途: 将文件系统中的 prompt 迁移到 custom_prompts 表
 * 使用: npx tsx scripts/migrate-prompts-to-db.ts
 */

import fs from "fs";
import path from "path";
import { getDatabaseInstance } from "../src/lib/db/client";
import { PromptRepository } from "../src/lib/repositories/PromptRepository";

const PROMPTS_DIR = path.join(process.cwd(), "data", "prompts");
const SYSTEM_USER_ID = 0; // 系统用户 ID (用于存储默认 prompts)

interface PromptFile {
  level: 1 | 2 | 3;
  language?: string;
  type?: string;
  filePath: string;
  content: string;
}

/**
 * 扫描 prompts 目录
 */
function scanPromptsDirectory(): PromptFile[] {
  const prompts: PromptFile[] = [];

  // L1: universal.txt
  const universalPath = path.join(PROMPTS_DIR, "universal.txt");
  if (fs.existsSync(universalPath)) {
    prompts.push({
      level: 1,
      filePath: universalPath,
      content: fs.readFileSync(universalPath, "utf-8"),
    });
  }

  // L2/L3: 扫描所有语言目录
  const languageDirs = fs
    .readdirSync(PROMPTS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const language of languageDirs) {
    const languageDir = path.join(PROMPTS_DIR, language);
    const files = fs.readdirSync(languageDir);

    for (const file of files) {
      if (!file.endsWith(".txt")) continue;

      const filePath = path.join(languageDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const typeName = file.replace(".txt", "");

      if (typeName === "common") {
        // L2: 语言通用 prompt
        prompts.push({
          level: 2,
          language,
          filePath,
          content,
        });
      } else {
        // L3: 特定类型 prompt
        prompts.push({
          level: 3,
          language,
          type: typeName,
          filePath,
          content,
        });
      }
    }
  }

  return prompts;
}

/**
 * 迁移 prompts 到数据库
 */
async function migratePrompts() {
  console.log("🚀 开始迁移 prompts 到数据库...\n");

  const db = getDatabaseInstance();
  const repo = new PromptRepository(db);

  // 清空现有数据
  db.prepare("DELETE FROM custom_prompts WHERE user_id = ?").run(SYSTEM_USER_ID);
  console.log("✅ 清空现有系统 prompts\n");

  // 扫描文件
  const prompts = scanPromptsDirectory();
  console.log(`📂 发现 ${prompts.length} 个 prompt 文件\n`);

  let successCount = 0;
  let errorCount = 0;

  // 迁移每个 prompt
  for (const prompt of prompts) {
    try {
      const displayName =
        prompt.level === 1
          ? "L1 (Universal)"
          : prompt.level === 2
            ? `L2 (${prompt.language})`
            : `L3 (${prompt.language}/${prompt.type})`;

      // 直接插入数据库 (避免 Repository 的版本生成逻辑)
      const stmt = db.prepare(`
        INSERT INTO custom_prompts (
          user_id, prompt_level, render_language, diagram_type,
          version, version_name, is_active, content, meta_info
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        SYSTEM_USER_ID,
        prompt.level,
        prompt.language || null,
        prompt.type || null,
        "v1.0.0",
        "System Default",
        1,
        prompt.content,
        JSON.stringify({
          source: "file_migration",
          original_path: prompt.filePath,
          migrated_at: new Date().toISOString(),
        })
      );

      console.log(`✅ ${displayName}`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${prompt.filePath}: ${error}`);
      errorCount++;
    }
  }

  console.log(`\n📊 迁移完成:`);
  console.log(`   ✅ 成功: ${successCount}`);
  console.log(`   ❌ 失败: ${errorCount}`);
  console.log(`   📝 总计: ${prompts.length}`);

  // 验证
  const count = db
    .prepare("SELECT COUNT(*) as count FROM custom_prompts WHERE user_id = ?")
    .get(SYSTEM_USER_ID) as { count: number };
  console.log(`\n✅ 数据库中共有 ${count.count} 条系统 prompts`);
}

// 执行迁移
migratePrompts()
  .then(() => {
    console.log("\n🎉 迁移成功完成!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ 迁移失败:", error);
    process.exit(1);
  });
