#!/usr/bin/env node

/**
 * 数据库迁移 006: 添加 custom_prompts 表
 *
 * 功能:
 * 1. 创建 custom_prompts 表及索引
 * 2. 支持三层提示词管理 (L1/L2/L3)
 * 3. 支持版本控制 (语义化版本号)
 * 4. 支持激活版本管理
 *
 * 使用方法:
 *   node scripts/migrations/006_add_custom_prompts.js
 */

import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// 获取当前文件路径 (ESM 模块)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 项目根目录
const ROOT_DIR = join(__dirname, "..", "..");

// 数据库文件路径
const DB_PATH = join(ROOT_DIR, "data", "diagram-ai.db");

// Schema SQL 文件路径
const SCHEMA_PATH = join(ROOT_DIR, "src", "lib", "db", "schema-prompts.sql");

/**
 * 检查迁移是否已执行
 *
 * @param {Database.Database} db - 数据库实例
 * @returns {boolean} 如果已执行返回 true,否则返回 false
 */
function isMigrationApplied(db) {
  try {
    const result = db
      .prepare(
        `
      SELECT name FROM sqlite_master
      WHERE type='table' AND name='custom_prompts'
    `
      )
      .get();

    return result !== undefined;
  } catch (error) {
    console.error("检查迁移状态失败:", error.message);
    return false;
  }
}

/**
 * 执行迁移
 *
 * @param {Database.Database} db - 数据库实例
 */
function runMigration(db) {
  console.log("\n🚀 开始执行迁移 006: 添加 custom_prompts 表...\n");

  try {
    // 1. 读取 schema 文件
    console.log(`📖 读取 Schema 文件: ${SCHEMA_PATH}`);
    const schema = readFileSync(SCHEMA_PATH, "utf-8");

    // 2. 启用外键约束
    console.log("🔧 启用外键约束...");
    db.pragma("foreign_keys = ON");

    // 3. 执行 SQL Schema
    console.log("⚙️  执行 SQL Schema...");
    db.exec(schema);

    // 4. 验证表创建成功
    console.log("\n✅ 验证表结构:");

    const tableInfo = db.pragma("table_info(custom_prompts)");
    console.log("\n【custom_prompts 表结构】");
    tableInfo.forEach((col) => {
      const notNull = col.notnull ? "NOT NULL" : "";
      const defaultValue = col.dflt_value ? `DEFAULT ${col.dflt_value}` : "";
      console.log(`  ${col.name.padEnd(20)} ${col.type.padEnd(10)} ${notNull} ${defaultValue}`);
    });

    // 5. 验证索引创建成功
    console.log("\n📊 索引列表:");
    const indexes = db
      .prepare(
        `
      SELECT name, sql FROM sqlite_master
      WHERE type='index' AND tbl_name='custom_prompts'
      ORDER BY name
    `
      )
      .all();

    indexes
      .filter((idx) => !idx.name.startsWith("sqlite_")) // 排除系统索引
      .forEach((idx) => {
        console.log(`  - ${idx.name}`);
      });

    // 6. 验证触发器创建成功
    console.log("\n⚡ 触发器列表:");
    const triggers = db
      .prepare(
        `
      SELECT name FROM sqlite_master
      WHERE type='trigger' AND tbl_name='custom_prompts'
      ORDER BY name
    `
      )
      .all();

    triggers.forEach((trigger) => {
      console.log(`  - ${trigger.name}`);
    });

    console.log("\n✅ 迁移 006 执行成功!");
  } catch (error) {
    console.error("\n❌ 迁移 006 执行失败:");
    console.error(error.message);
    console.error("\n详细错误信息:");
    console.error(error);
    throw error;
  }
}

/**
 * 回滚迁移
 *
 * @param {Database.Database} db - 数据库实例
 */
function rollbackMigration(db) {
  console.log("\n⚠️  开始回滚迁移 006...\n");

  try {
    // 1. 删除触发器
    console.log("删除触发器...");
    db.exec("DROP TRIGGER IF EXISTS update_custom_prompts_timestamp;");

    // 2. 删除索引
    console.log("删除索引...");
    db.exec("DROP INDEX IF EXISTS idx_prompts_active_unique;");
    db.exec("DROP INDEX IF EXISTS idx_prompts_user;");
    db.exec("DROP INDEX IF EXISTS idx_prompts_lookup;");
    db.exec("DROP INDEX IF EXISTS idx_prompts_version;");
    db.exec("DROP INDEX IF EXISTS idx_prompts_active;");

    // 3. 删除表
    console.log("删除表...");
    db.exec("DROP TABLE IF EXISTS custom_prompts;");

    console.log("\n✅ 迁移 006 回滚成功!");
  } catch (error) {
    console.error("\n❌ 迁移 006 回滚失败:");
    console.error(error.message);
    throw error;
  }
}

/**
 * 主函数
 */
function main() {
  // 解析命令行参数
  const args = process.argv.slice(2);
  const isRollback = args.includes("--rollback");

  console.log("========================================");
  console.log("  数据库迁移 006: custom_prompts 表");
  console.log("========================================");

  try {
    // 打开数据库连接
    console.log(`\n📂 数据库位置: ${DB_PATH}`);
    const db = new Database(DB_PATH);

    if (isRollback) {
      // 回滚模式
      rollbackMigration(db);
    } else {
      // 迁移模式
      if (isMigrationApplied(db)) {
        console.log("\n⚠️  迁移 006 已经执行过,无需重复执行");
        console.log("💡 提示: 使用 --rollback 参数可以回滚此迁移");
      } else {
        runMigration(db);
      }
    }

    // 关闭数据库连接
    db.close();

    console.log("\n========================================");
    console.log("  迁移完成");
    console.log("========================================\n");
  } catch (error) {
    console.error("\n❌ 执行失败");
    console.error(error);
    process.exit(1);
  }
}

// 执行主函数
main();
