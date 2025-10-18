#!/usr/bin/env tsx
/**
 * 系统默认提示词初始化脚本
 *
 * 功能:
 * 1. 扫描 data/prompts/ 目录下所有 .txt 文件
 * 2. 解析文件路径确定 (level, language, type)
 * 3. 批量插入数据库 (user_id=0, version=v1.0.0, is_active=1)
 *
 * 使用方法:
 *   npm run db:init-prompts              # 正常导入
 *   npm run db:init-prompts:preview      # 预览模式
 *   npm run db:init-prompts:force        # 强制覆盖
 *
 * @author DiagramAI Team
 * @version 1.0.0
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import Database from "better-sqlite3";

// ============================================================================
// 类型定义
// ============================================================================

interface PromptFile {
  /** 文件绝对路径 */
  filePath: string;
  /** 相对路径 (相对于 prompts 目录) */
  relativePath: string;
  /** Prompt 层级 (1/2/3) */
  level: 1 | 2 | 3;
  /** 渲染语言 (L2/L3 必填, L1 为 null) */
  language: string | null;
  /** 图表类型 (L3 必填, L1/L2 为 null) */
  type: string | null;
  /** 文件内容 */
  content: string;
  /** 文件大小 (字节) */
  size: number;
}

interface ImportStats {
  /** 扫描到的文件总数 */
  totalFiles: number;
  /** 成功导入的文件数 */
  successCount: number;
  /** 跳过的文件数 (已存在) */
  skippedCount: number;
  /** 失败的文件数 */
  failedCount: number;
  /** L1 级别文件数 */
  l1Count: number;
  /** L2 级别文件数 */
  l2Count: number;
  /** L3 级别文件数 */
  l3Count: number;
  /** 失败的文件列表 */
  failures: Array<{ file: string; error: string }>;
}

interface CommandOptions {
  /** 预览模式 (不实际插入数据库) */
  dryRun: boolean;
  /** 强制覆盖 (删除已存在的记录) */
  force: boolean;
}

// ============================================================================
// 常量配置
// ============================================================================

const PROMPTS_DIR = join(process.cwd(), "data/prompts");
const DB_PATH = join(process.cwd(), "data/diagram-ai.db");
const DEFAULT_USER_ID = 0; // 系统默认用户
const DEFAULT_VERSION = "v1.0.0";
const VERSION_NAME = "系统默认提示词";

// 支持的渲染语言 (与 diagram-types.ts 对齐)
const SUPPORTED_LANGUAGES = [
  "mermaid",
  "plantuml",
  "d2",
  "graphviz",
  "wavedrom",
  "nomnoml",
  "excalidraw",
  "c4plantuml",
  "vegalite",
  "dbml",
  "bpmn",
  "ditaa",
  "nwdiag",
  "blockdiag",
  "actdiag",
  "packetdiag",
  "rackdiag",
  "seqdiag",
  "structurizr",
  "erd",
  "pikchr",
  "svgbob",
  "umlet",
] as const;

// ============================================================================
// 核心功能函数
// ============================================================================

/**
 * 递归扫描目录下所有 .txt 文件
 */
function scanPromptFiles(dir: string, basePath: string = dir): PromptFile[] {
  const files: PromptFile[] = [];

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // 递归扫描子目录
      files.push(...scanPromptFiles(fullPath, basePath));
    } else if (entry.isFile() && entry.name.endsWith(".txt")) {
      // 跳过非 prompt 文件
      if (["index.txt", "types.txt", "recommend.txt"].includes(entry.name)) {
        continue;
      }

      try {
        const relativePath = relative(basePath, fullPath);
        const parsed = parsePromptPath(relativePath);

        if (parsed) {
          const content = readFileSync(fullPath, "utf-8");
          const stats = statSync(fullPath);

          files.push({
            filePath: fullPath,
            relativePath,
            level: parsed.level,
            language: parsed.language,
            type: parsed.type,
            content,
            size: stats.size,
          });
        }
      } catch (error) {
        console.warn(
          `⚠️  跳过文件 ${fullPath}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  }

  return files;
}

/**
 * 解析文件路径,确定 (level, language, type)
 *
 * 路径规则:
 * - universal.txt              → L1, NULL, NULL
 * - {language}/common.txt      → L2, {language}, NULL
 * - {language}/{type}.txt      → L3, {language}, {type}
 */
function parsePromptPath(
  relativePath: string
): { level: 1 | 2 | 3; language: string | null; type: string | null } | null {
  const parts = relativePath.replace(/\\/g, "/").split("/");

  // L1: universal.txt
  if (parts.length === 1 && parts[0] === "universal.txt") {
    return { level: 1, language: null, type: null };
  }

  // L2: {language}/common.txt
  if (parts.length === 2 && parts[1] === "common.txt") {
    const language = parts[0];
    if (SUPPORTED_LANGUAGES.includes(language as any)) {
      return { level: 2, language, type: null };
    }
  }

  // L3: {language}/{type}.txt
  if (parts.length === 2 && parts[1] !== "common.txt") {
    const language = parts[0];
    const type = parts[1].replace(".txt", "");

    if (SUPPORTED_LANGUAGES.includes(language as any)) {
      return { level: 3, language, type };
    }
  }

  return null;
}

/**
 * 批量导入 Prompt 文件到数据库
 */
function importPrompts(
  db: Database.Database,
  files: PromptFile[],
  options: CommandOptions
): ImportStats {
  const stats: ImportStats = {
    totalFiles: files.length,
    successCount: 0,
    skippedCount: 0,
    failedCount: 0,
    l1Count: 0,
    l2Count: 0,
    l3Count: 0,
    failures: [],
  };

  // 预览模式: 只显示将要导入的内容
  if (options.dryRun) {
    console.log("\n🔍 预览模式: 将导入以下 Prompt 文件:\n");
    files.forEach((file) => {
      console.log(
        `  [L${file.level}] ${file.language || "universal"}/${file.type || "common"} (${formatBytes(file.size)})`
      );
      if (file.level === 1) stats.l1Count++;
      if (file.level === 2) stats.l2Count++;
      if (file.level === 3) stats.l3Count++;
    });
    return stats;
  }

  // 强制覆盖模式: 清空已存在的记录
  if (options.force) {
    console.log("\n🔄 强制覆盖模式: 删除 user_id=0 的所有记录...");
    const deleteStmt = db.prepare("DELETE FROM custom_prompts WHERE user_id = ?");
    const result = deleteStmt.run(DEFAULT_USER_ID);
    console.log(`   ✅ 已删除 ${result.changes} 条记录\n`);
  }

  // 准备插入语句
  const insertStmt = db.prepare(`
    INSERT INTO custom_prompts (
      user_id,
      prompt_level,
      render_language,
      diagram_type,
      content,
      version,
      version_name,
      is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);

  // 检查是否存在的语句
  const checkStmt = db.prepare(`
    SELECT id FROM custom_prompts
    WHERE user_id = ?
      AND prompt_level = ?
      AND (render_language = ? OR (render_language IS NULL AND ? IS NULL))
      AND (diagram_type = ? OR (diagram_type IS NULL AND ? IS NULL))
    LIMIT 1
  `);

  // 使用事务批量插入 (性能优化)
  const transaction = db.transaction((files: PromptFile[]) => {
    for (const file of files) {
      try {
        // 检查是否已存在
        const exists = checkStmt.get(
          DEFAULT_USER_ID,
          file.level,
          file.language,
          file.language,
          file.type,
          file.type
        );

        if (exists && !options.force) {
          stats.skippedCount++;
          console.log(
            `  ⏭️  跳过: [L${file.level}] ${file.language || "universal"}/${file.type || "common"} (已存在)`
          );
          continue;
        }

        // 插入记录
        insertStmt.run(
          DEFAULT_USER_ID,
          file.level,
          file.language || null,
          file.type || null,
          file.content,
          DEFAULT_VERSION,
          VERSION_NAME
        );

        stats.successCount++;
        if (file.level === 1) stats.l1Count++;
        if (file.level === 2) stats.l2Count++;
        if (file.level === 3) stats.l3Count++;

        console.log(
          `  ✅ 导入: [L${file.level}] ${file.language || "universal"}/${file.type || "common"} (${formatBytes(file.size)})`
        );
      } catch (error) {
        stats.failedCount++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        stats.failures.push({
          file: file.relativePath,
          error: errorMsg,
        });
        console.error(`  ❌ 失败: ${file.relativePath} - ${errorMsg}`);
      }
    }
  });

  // 执行事务
  console.log("\n📥 开始批量导入...\n");
  transaction(files);

  return stats;
}

/**
 * 生成导入摘要报告
 */
function generateReport(stats: ImportStats, options: CommandOptions): void {
  console.log("\n" + "=".repeat(60));
  console.log("📊 导入摘要报告");
  console.log("=".repeat(60));

  if (options.dryRun) {
    console.log("\n⚠️  预览模式 (未实际导入)\n");
  }

  console.log(`📁 扫描文件总数: ${stats.totalFiles}`);
  console.log(`✅ 成功导入: ${stats.successCount}`);
  console.log(`⏭️  跳过 (已存在): ${stats.skippedCount}`);
  console.log(`❌ 失败: ${stats.failedCount}`);

  console.log(`\n📊 层级分布:`);
  console.log(`   L1 (通用): ${stats.l1Count}`);
  console.log(`   L2 (语言): ${stats.l2Count}`);
  console.log(`   L3 (类型): ${stats.l3Count}`);

  if (stats.failures.length > 0) {
    console.log(`\n❌ 失败详情:`);
    stats.failures.forEach((failure) => {
      console.log(`   - ${failure.file}: ${failure.error}`);
    });
  }

  console.log("\n" + "=".repeat(60) + "\n");
}

/**
 * 格式化字节数为可读格式
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * 解析命令行参数
 */
function parseCommandLineArgs(): CommandOptions {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes("--dry-run"),
    force: args.includes("--force"),
  };
}

/**
 * 验证数据库表是否存在
 */
function validateDatabase(db: Database.Database): void {
  const tableExists = db
    .prepare(
      `
    SELECT name FROM sqlite_master
    WHERE type='table' AND name='custom_prompts'
  `
    )
    .get();

  if (!tableExists) {
    console.error("\n❌ 错误: custom_prompts 表不存在");
    console.error("   请先运行数据库迁移脚本: npm run db:migrate\n");
    process.exit(1);
  }
}

/**
 * 确保系统默认用户 (user_id=0) 存在
 */
function ensureSystemUser(db: Database.Database): void {
  // 检查 user_id=0 是否存在
  const systemUser = db.prepare("SELECT id FROM users WHERE id = 0").get();

  if (!systemUser) {
    console.log("\n🔧 创建系统默认用户 (user_id=0)...");

    // bcrypt 固定长度 60 字符的占位密码 (无法登录)
    // 实际值: "$2a$10$" (7字符) + 53个字符 = 60 字符
    const PLACEHOLDER_HASH = "$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    // 插入系统用户 (需要显式指定 id=0)
    db.prepare(
      `
      INSERT INTO users (id, username, password_hash, created_at)
      VALUES (0, 'system', ?, datetime('now'))
    `
    ).run(PLACEHOLDER_HASH);

    console.log("   ✅ 系统用户创建成功\n");
  }
}

// ============================================================================
// 主函数
// ============================================================================

function main() {
  console.log("\n🚀 DiagramAI 系统提示词初始化脚本\n");

  // 解析命令行参数
  const options = parseCommandLineArgs();

  console.log("⚙️  配置信息:");
  console.log(`   - Prompts 目录: ${PROMPTS_DIR}`);
  console.log(`   - 数据库路径: ${DB_PATH}`);
  console.log(`   - 预览模式: ${options.dryRun ? "是" : "否"}`);
  console.log(`   - 强制覆盖: ${options.force ? "是" : "否"}`);
  console.log(`   - 默认用户 ID: ${DEFAULT_USER_ID}`);
  console.log(`   - 默认版本: ${DEFAULT_VERSION}\n`);

  // 扫描文件
  console.log("🔍 扫描 Prompt 文件...\n");
  const files = scanPromptFiles(PROMPTS_DIR);
  console.log(`   ✅ 发现 ${files.length} 个 Prompt 文件\n`);

  if (files.length === 0) {
    console.error("❌ 错误: 未找到任何 Prompt 文件");
    process.exit(1);
  }

  // 连接数据库
  let db: Database.Database | null = null;

  if (!options.dryRun) {
    try {
      db = new Database(DB_PATH);
      db.pragma("foreign_keys = ON");
      validateDatabase(db);
      ensureSystemUser(db);
    } catch (error) {
      console.error("\n❌ 数据库连接失败:", error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  // 导入文件
  const stats = importPrompts(db!, files, options);

  // 关闭数据库连接
  if (db) {
    db.close();
  }

  // 生成报告
  generateReport(stats, options);

  // 退出码
  const exitCode = stats.failedCount > 0 ? 1 : 0;
  process.exit(exitCode);
}

// ============================================================================
// 脚本入口
// ============================================================================

main();
