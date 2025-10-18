/**
 * 数据库客户端单例
 *
 * 功能:
 * 1. 提供全局唯一的数据库连接
 * 2. 自动启用外键约束
 * 3. 提供连接关闭和测试重置方法
 *
 * 设计模式: 单例模式(模块单例)
 *
 * 使用示例:
 *   import { getDatabaseInstance } from '@/lib/db/client';
 *   const db = getDatabaseInstance();
 *   const users = db.prepare('SELECT * FROM users').all();
 */

import { join } from "path";

import Database from "better-sqlite3";

import type { DatabaseConfig } from "@/types/database";
import { DB_TIMEOUT, DB_PATH } from "@/lib/constants/env";
import { logger } from "@/lib/utils/logger";

// 配置

/**
 * 默认数据库配置
 */
const DEFAULT_CONFIG: DatabaseConfig = {
  // 数据库文件路径 - 从环境变量读取
  // 生产环境: ./data/diagram-ai.db
  // 测试环境: ./data/diagram-ai-test.db
  path: join(process.cwd(), DB_PATH),

  // 非只读模式
  readonly: false,

  // 文件不必存在(首次运行时自动创建)
  fileMustExist: false,

  // 超时时间: 从环境变量读取，默认 5 秒（5000ms）
  timeout: DB_TIMEOUT,

  // 开发环境启用调试日志
  verbose:
    process.env.NODE_ENV === "development"
      ? (message?: unknown, ...args: unknown[]) => logger.warn(message, ...args)
      : undefined,
};

// 单例实例

/**
 * 数据库连接实例(单例)
 * 初始值为 null,首次调用 getDatabaseInstance() 时创建
 */
let instance: Database.Database | null = null;

/**
 * 测试数据库实例(仅用于测试环境)
 *
 * 说明:
 * - 测试时通过 setTestDatabaseInstance() 注入测试数据库
 * - 生产环境保持为 null
 */
let testInstance: Database.Database | null = null;

// 公开 API

/**
 * 设置测试数据库实例(仅用于测试环境)
 *
 * 说明:
 * - 允许测试注入自己的数据库实例
 * - getDatabaseInstance() 会优先返回测试数据库
 *
 * @param db - 测试数据库实例
 *
 * @example
 * ```typescript
 * // 在测试中
 * const testDb = createTestDatabase();
 * setTestDatabaseInstance(testDb);
 * ```
 */
export function setTestDatabaseInstance(db: Database.Database | null): void {
  testInstance = db;
}

/**
 * 获取数据库连接实例(单例模式)
 *
 * @param config - 可选的数据库配置,仅在首次调用时生效
 * @returns Database 实例
 *
 * @example
 * ```typescript
 * // 首次调用,使用默认配置
 * const db = getDatabaseInstance();
 *
 * // 后续调用,返回同一实例(config 参数被忽略)
 * const db2 = getDatabaseInstance();
 * console.log(db === db2); // true
 * ```
 */
export function getDatabaseInstance(config: Partial<DatabaseConfig> = {}): Database.Database {
  // 测试环境:优先返回测试数据库
  if (testInstance) {
    return testInstance;
  }

  // 如果实例已存在,直接返回(单例核心逻辑)
  if (instance) {
    return instance;
  }

  // 首次创建: 合并配置
  const finalConfig: DatabaseConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    // 创建数据库连接
    instance = new Database(finalConfig.path, {
      readonly: finalConfig.readonly,
      fileMustExist: finalConfig.fileMustExist,
      timeout: finalConfig.timeout,
      verbose: finalConfig.verbose,
    });

    // 启用外键约束(SQLite 默认关闭)
    // 这对于维护数据完整性至关重要
    instance.pragma("foreign_keys = ON");

    // 设置 WAL 模式(Write-Ahead Logging)
    // 优点: 更好的并发性能,更快的写入
    instance.pragma("journal_mode = WAL");

    // 设置同步模式为 NORMAL(平衡性能和安全性)
    instance.pragma("synchronous = NORMAL");

    // 日志输出
    if (process.env.NODE_ENV !== "test") {
      logger.info("数据库连接成功", { path: finalConfig.path });
    }

    return instance;
  } catch (error) {
    logger.error("数据库连接失败", error);
    throw new Error(
      `Failed to connect to database at ${finalConfig.path}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * 关闭数据库连接
 *
 * 注意: 关闭后,instance 会被重置为 null
 * 下次调用 getDatabaseInstance() 会创建新连接
 *
 * @example
 * ```typescript
 * closeDatabaseConnection();
 * // 现在 instance = null
 * const db = getDatabaseInstance(); // 创建新连接
 * ```
 */
export function closeDatabaseConnection(): void {
  if (instance) {
    try {
      instance.close();
      instance = null;
      if (process.env.NODE_ENV !== "test") {
        logger.info("数据库连接已关闭");
      }
    } catch (error) {
      logger.error("关闭数据库连接失败", error);
      throw error;
    }
  }
}

/**
 * 重置数据库连接(测试专用)
 *
 * 作用:
 * 1. 关闭当前连接
 * 2. 重置 instance 为 null
 * 3. 下次 getDatabaseInstance() 会创建新连接
 *
 * 使用场景: 单元测试中,每个测试用例需要独立的数据库连接
 *
 * @example
 * ```typescript
 * // 测试文件
 * afterEach(() => {
 *   resetDatabaseConnection(); // 每个测试后重置
 * });
 * ```
 */
export function resetDatabaseConnection(): void {
  closeDatabaseConnection();
}

/**
 * 检查数据库连接是否存在
 *
 * @returns true 如果连接已创建,false 如果还未创建
 */
export function isDatabaseConnected(): boolean {
  return instance !== null;
}

/**
 * 执行数据库健康检查
 *
 * 检查项:
 * 1. 数据库连接是否正常
 * 2. 外键约束是否启用
 * 3. 核心表是否存在
 *
 * @returns 健康检查结果
 */
export function healthCheck(): {
  connected: boolean;
  foreignKeys: boolean;
  tables: string[];
  error?: string;
} {
  try {
    const db = getDatabaseInstance();

    // 检查外键约束
    const foreignKeysResult = db.pragma("foreign_keys", { simple: true });
    const foreignKeys = foreignKeysResult === 1;

    // 检查核心表是否存在
    const tables = db
      .prepare(
        `
      SELECT name FROM sqlite_master
      WHERE type='table' AND name IN ('users', 'ai_models', 'generation_histories')
      ORDER BY name
    `
      )
      .all() as { name: string }[];

    return {
      connected: true,
      foreignKeys,
      tables: tables.map((t) => t.name),
    };
  } catch (error) {
    return {
      connected: false,
      foreignKeys: false,
      tables: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
