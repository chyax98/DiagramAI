/**
 * 导入 Promote-V3 提示词到 custom_prompts 表
 * 版本: v1.0.0
 * 说明: 从 Promote-V3/ 目录读取 Markdown 文件,导入为用户自定义提示词
 */

import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

// 配置
const PROMPTS_DIR = path.join(process.cwd(), "Promote-V3");
const DB_PATH = path.join(process.cwd(), "data", "diagram-ai.db");
const VERSION = "v1.1.0";
const VERSION_NAME = "Promote-V3 修复版 (添加明确的语言和类型声明)";

// 系统用户ID (用于存储V3提示词,如果不存在则创建)
const SYSTEM_USER_ID = 1;
const SYSTEM_USERNAME = "system";
const SYSTEM_PASSWORD_HASH = "$2b$10$placeholder"; // 占位符,系统用户不用于登录

interface PromptFile {
  level: 1 | 2 | 3;
  renderLanguage: string | null;
  diagramType: string | null;
  content: string;
  fileName: string;
}

/**
 * 解析文件名获取提示词信息
 */
function parseFileName(fileName: string): Omit<PromptFile, "content"> {
  // L1.md
  if (fileName === "L1.md") {
    return {
      level: 1,
      renderLanguage: null,
      diagramType: null,
      fileName,
    };
  }

  // L2-{language}.md
  const l2Match = fileName.match(/^L2-(.+)\.md$/);
  if (l2Match) {
    return {
      level: 2,
      renderLanguage: l2Match[1],
      diagramType: null,
      fileName,
    };
  }

  // L3-{language}-{type}.md
  const l3Match = fileName.match(/^L3-(.+?)-(.+)\.md$/);
  if (l3Match) {
    return {
      level: 3,
      renderLanguage: l3Match[1],
      diagramType: l3Match[2],
      fileName,
    };
  }

  throw new Error(`无法解析文件名: ${fileName}`);
}

/**
 * 读取所有提示词文件
 */
function readPromptFiles(): PromptFile[] {
  const files = fs.readdirSync(PROMPTS_DIR);
  const promptFiles: PromptFile[] = [];

  for (const file of files) {
    // 跳过非 Markdown 文件
    if (!file.endsWith(".md") || file.includes("Spec") || file.includes("REPORT")) {
      continue;
    }

    try {
      const info = parseFileName(file);
      const content = fs.readFileSync(path.join(PROMPTS_DIR, file), "utf-8");

      promptFiles.push({
        ...info,
        content: content.trim(),
      });
    } catch (error) {
      console.warn(`⚠️  跳过文件 ${file}: ${error}`);
    }
  }

  return promptFiles;
}

/**
 * 导入提示词到数据库
 */
function importPrompts() {
  console.log("🚀 开始导入 Promote-V3 提示词到 custom_prompts 表\n");

  // 打开数据库
  const db = new Database(DB_PATH);

  try {
    // 检查系统用户是否存在,不存在则创建
    let systemUser = db.prepare("SELECT id FROM users WHERE id = ?").get(SYSTEM_USER_ID) as
      | { id: number }
      | undefined;

    if (!systemUser) {
      console.log(`📝 创建系统用户 (id=${SYSTEM_USER_ID}, username=${SYSTEM_USERNAME})\n`);
      db.prepare(`INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)`).run(
        SYSTEM_USER_ID,
        SYSTEM_USERNAME,
        SYSTEM_PASSWORD_HASH
      );

      systemUser = db.prepare("SELECT id FROM users WHERE id = ?").get(SYSTEM_USER_ID) as
        | { id: number }
        | undefined;

      if (!systemUser) {
        console.error("❌ 创建系统用户失败");
        process.exit(1);
      }
    } else {
      console.log(`✅ 系统用户已存在 (id=${SYSTEM_USER_ID})\n`);
    }

    // 读取所有提示词文件
    const promptFiles = readPromptFiles();
    console.log(`📋 发现 ${promptFiles.length} 个提示词文件\n`);

    // 分组统计
    const stats = {
      l1: 0,
      l2: 0,
      l3: 0,
      total: 0,
      skipped: 0,
      inserted: 0,
    };

    // 准备插入语句
    const insertStmt = db.prepare(`
      INSERT INTO custom_prompts (
        user_id,
        prompt_level,
        render_language,
        diagram_type,
        version,
        version_name,
        is_active,
        content
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 开始事务
    const insertMany = db.transaction((prompts: PromptFile[]) => {
      for (const prompt of prompts) {
        try {
          // 检查是否已存在相同版本
          const existing = db
            .prepare(
              `
            SELECT id FROM custom_prompts
            WHERE user_id = ?
              AND prompt_level = ?
              AND (render_language IS ? OR (render_language IS NULL AND ? IS NULL))
              AND (diagram_type IS ? OR (diagram_type IS NULL AND ? IS NULL))
              AND version = ?
          `
            )
            .get(
              SYSTEM_USER_ID,
              prompt.level,
              prompt.renderLanguage,
              prompt.renderLanguage,
              prompt.diagramType,
              prompt.diagramType,
              VERSION
            ) as { id: number } | undefined;

          if (existing) {
            console.log(`   ⏭️  跳过 ${prompt.fileName} (版本 ${VERSION} 已存在)`);
            stats.skipped++;
            continue;
          }

          // 插入新记录
          insertStmt.run(
            SYSTEM_USER_ID,
            prompt.level,
            prompt.renderLanguage,
            prompt.diagramType,
            VERSION,
            VERSION_NAME,
            1, // 设置为激活版本
            prompt.content
          );

          // 统计
          if (prompt.level === 1) stats.l1++;
          else if (prompt.level === 2) stats.l2++;
          else if (prompt.level === 3) stats.l3++;
          stats.inserted++;

          const location = prompt.renderLanguage
            ? prompt.diagramType
              ? `${prompt.renderLanguage}/${prompt.diagramType}`
              : prompt.renderLanguage
            : "通用";
          console.log(`   ✅ L${prompt.level} ${location} - ${prompt.content.length} 字符`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`   ❌ ${prompt.fileName}: ${errorMessage}`);
        }
      }
    });

    // 执行批量插入
    insertMany(promptFiles);

    stats.total = promptFiles.length;

    // 输出统计
    console.log("\n======================================================================");
    console.log("📊 导入统计报告");
    console.log("======================================================================");
    console.log(`✅ 成功插入: ${stats.inserted} 个`);
    console.log(`⏭️  跳过重复: ${stats.skipped} 个`);
    console.log(`📋 总计文件: ${stats.total} 个`);
    console.log("");
    console.log("按层级统计:");
    console.log(`  - L1 (通用层): ${stats.l1} 个`);
    console.log(`  - L2 (语言层): ${stats.l2} 个`);
    console.log(`  - L3 (类型层): ${stats.l3} 个`);
    console.log("");
    console.log(`📌 版本号: ${VERSION}`);
    console.log(`📝 版本名称: ${VERSION_NAME}`);
    console.log(`👤 用户ID: ${SYSTEM_USER_ID}`);
    console.log(`🔄 激活状态: 全部设置为激活`);
    console.log("======================================================================\n");

    // 验证导入结果
    const count = db
      .prepare(
        `
      SELECT COUNT(*) as count FROM custom_prompts
      WHERE user_id = ? AND version = ?
    `
      )
      .get(SYSTEM_USER_ID, VERSION) as { count: number };

    console.log(`✨ 数据库验证: custom_prompts 表中共有 ${count.count} 条 ${VERSION} 版本记录\n`);

    if (count.count !== stats.inserted) {
      console.warn(`⚠️  警告: 插入数量 (${stats.inserted}) 与数据库记录 (${count.count}) 不一致`);
    } else {
      console.log("🎉 导入完成! 所有提示词已成功导入并激活\n");
    }
  } finally {
    db.close();
  }
}

// 执行导入
importPrompts();
