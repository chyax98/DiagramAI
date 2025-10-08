/**
 * 环境变量常量
 *
 * 统一管理从环境变量读取的配置常量
 */

/**
 * 最大输入文本长度（字符数）
 *
 * @default 20000
 * @env NEXT_PUBLIC_MAX_INPUT_CHARS
 */
export const MAX_INPUT_TEXT_LENGTH = parseInt(
  process.env.NEXT_PUBLIC_MAX_INPUT_CHARS || "20000",
  10
);

/**
 * 最大对话轮次
 *
 * 达到最大轮次后,不再允许继续对话,需要创建新的会话
 *
 * @default 10
 * @env NEXT_PUBLIC_MAX_CHAT_ROUNDS
 */
export const MAX_CHAT_ROUNDS = parseInt(process.env.NEXT_PUBLIC_MAX_CHAT_ROUNDS || "10", 10);

/**
 * AI 生成温度参数（0.0-2.0）
 *
 * @default 0.7
 * @env AI_TEMPERATURE
 */
export const AI_TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || "0.7");

/**
 * AI 请求最大重试次数
 *
 * @default 3
 * @env AI_MAX_RETRIES
 */
export const AI_MAX_RETRIES = parseInt(process.env.AI_MAX_RETRIES || "3", 10);

/**
 * bcrypt 加密轮数
 *
 * @default 10
 * @env BCRYPT_SALT_ROUNDS
 */
export const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

/**
 * 数据库操作超时时间（毫秒）
 *
 * @default 5000
 * @env DB_TIMEOUT
 */
export const DB_TIMEOUT = parseInt(process.env.DB_TIMEOUT || "5000", 10);

/**
 * Kroki 客户端 URL (浏览器访问)
 *
 * 客户端始终通过 API 代理访问,避免 CORS 问题
 *
 * @default '/api/kroki'
 * @env NEXT_PUBLIC_KROKI_URL
 */
export const KROKI_URL = process.env.NEXT_PUBLIC_KROKI_URL || "/api/kroki";

/**
 * Kroki 服务端 URL (服务器端访问)
 *
 * 默认使用公共 Kroki 服务
 *
 * @default 'https://kroki.io'
 * @env KROKI_INTERNAL_URL
 */
export const KROKI_INTERNAL_URL = process.env.KROKI_INTERNAL_URL || "https://kroki.io";

/**
 * Kroki 请求超时时间（毫秒）
 *
 * @default 5000
 * @env NEXT_PUBLIC_KROKI_TIMEOUT
 */
export const KROKI_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_KROKI_TIMEOUT || "5000", 10);

/**
 * Kroki 最大重试次数
 *
 * @default 3
 * @env NEXT_PUBLIC_KROKI_MAX_RETRIES
 */
export const KROKI_MAX_RETRIES = parseInt(process.env.NEXT_PUBLIC_KROKI_MAX_RETRIES || "3", 10);

/**
 * Kroki 重试延迟时间（毫秒）
 *
 * @default 1000
 * @env NEXT_PUBLIC_KROKI_RETRY_DELAY
 */
export const KROKI_RETRY_DELAY = parseInt(process.env.NEXT_PUBLIC_KROKI_RETRY_DELAY || "1000", 10);

/**
 * 数据库文件路径
 *
 * @default './data/diagram-ai.db' (生产) | './data/diagram-ai-test.db' (测试)
 * @env DB_PATH
 */
export const DB_PATH =
  process.env.DB_PATH ||
  (process.env.NODE_ENV === "test" ? "./data/diagram-ai-test.db" : "./data/diagram-ai.db");

/**
 * 应用 URL
 *
 * @default 'http://localhost:3000'
 * @env NEXT_PUBLIC_APP_URL
 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * API 连接测试超时时间（毫秒）
 *
 * 用于模型连接测试的超时限制
 * 设置为 30 秒以适应推理模型（如 o1）的响应时间
 *
 * @default 30000
 * @env API_TEST_TIMEOUT
 */
export const API_TEST_TIMEOUT = parseInt(process.env.API_TEST_TIMEOUT || "30000", 10);

/**
 * 所有环境变量的导出对象
 *
 * 方便统一访问和类型推导
 */
export const ENV = {
    MAX_INPUT_TEXT_LENGTH,
    MAX_CHAT_ROUNDS,
    AI_TEMPERATURE,
    AI_MAX_RETRIES,
    BCRYPT_SALT_ROUNDS,
    DB_TIMEOUT,
    KROKI_URL,
    KROKI_INTERNAL_URL,
    KROKI_TIMEOUT,
    KROKI_MAX_RETRIES,
    KROKI_RETRY_DELAY,
    DB_PATH,
    APP_URL,
    API_TEST_TIMEOUT,
} as const;
