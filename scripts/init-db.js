#!/usr/bin/env node

/**
 * 数据库初始化脚本
 *
 * 功能:
 * 1. 读取 schema.sql 文件
 * 2. 创建 SQLite 数据库文件
 * 3. 执行 SQL 语句创建表和索引
 * 4. 验证表创建成功
 *
 * 使用方法:
 *   npm run db:init
 *   或
 *   node scripts/init-db.js
 */

import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// 获取当前文件路径(ESM 模块)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 项目根目录
const ROOT_DIR = join(__dirname, "..");

// 数据库文件路径
const DB_PATH = join(ROOT_DIR, "data", "diagram-ai.db");

// Schema SQL 文件路径
const SCHEMA_PATH = join(ROOT_DIR, "src", "lib", "db", "schema.sql");

/**
 * 主函数: 初始化数据库
 */
function initDatabase() {
  console.log("🚀 开始初始化数据库...\n");

  try {
    console.log(`📖 读取 Schema 文件: ${SCHEMA_PATH}`);
    const schema = readFileSync(SCHEMA_PATH, "utf-8");

    console.log(`💾 创建数据库: ${DB_PATH}`);
    const db = new Database(DB_PATH);

    console.log("🔧 启用外键约束...");
    db.pragma("foreign_keys = ON");

    console.log("⚙️  执行 SQL Schema...");
    db.exec(schema);

    console.log("\n✅ 验证表结构:");
    const tables = db
      .prepare(
        `
      SELECT name, type
      FROM sqlite_master
      WHERE type IN ('table', 'view', 'index', 'trigger')
      ORDER BY type, name
    `
      )
      .all();

    const grouped = {
      table: [],
      view: [],
      index: [],
      trigger: [],
    };

    tables.forEach((item) => {
      if (grouped[item.type]) {
        grouped[item.type].push(item.name);
      }
    });

    console.log("\n📊 数据表:");
    grouped.table.forEach((name) => console.log(`  - ${name}`));

    console.log("\n👁️  视图:");
    grouped.view.forEach((name) => console.log(`  - ${name}`));

    console.log("\n🔍 索引:");
    grouped.index
      .filter((name) => !name.startsWith("sqlite_")) // 排除系统索引
      .forEach((name) => console.log(`  - ${name}`));

    console.log("\n⚡ 触发器:");
    grouped.trigger.forEach((name) => console.log(`  - ${name}`));

    console.log("\n📋 表结构详情:");

    const tablesToShow = ["users", "ai_models", "generation_histories"];
    tablesToShow.forEach((tableName) => {
      console.log(`\n【${tableName}】`);
      const columns = db.pragma(`table_info(${tableName})`);
      columns.forEach((col) => {
        console.log(
          `  ${col.name.padEnd(20)} ${col.type.padEnd(10)} ${col.notnull ? "NOT NULL" : ""} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ""}`
        );
      });
    });

    db.close();

    console.log("\n✅ 数据库初始化完成!");
    console.log(`📂 数据库位置: ${DB_PATH}`);
    console.log("\n💡 后续步骤:");
    console.log("  1. 运行应用: npm run dev");
    console.log("  2. 访问页面: http://localhost:3000");
  } catch (error) {
    console.error("\n❌ 数据库初始化失败:");
    console.error(error.message);
    console.error("\n详细错误信息:");
    console.error(error);
    process.exit(1);
  }
}

// 执行初始化
initDatabase();
