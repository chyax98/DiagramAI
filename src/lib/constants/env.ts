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
 * Kroki 服务 URL (后端代理统一访问)
 *
 * DiagramAI 使用后端代理统一访问 Kroki 服务:
 * - 前端: 通过 /api/kroki (避免 CORS)
 * - 后端: 直接访问 KROKI_URL 配置的服务
 *
 * @default 'https://kroki.io'
 * @env KROKI_URL
 */
export const KROKI_URL = process.env.KROKI_URL || "https://kroki.io";

/**
 * Kroki 最大重试次数
 *
 * @default 3
 * @env KROKI_MAX_RETRIES
 */
export const KROKI_MAX_RETRIES = parseInt(process.env.KROKI_MAX_RETRIES || "3", 10);

/**
 * Kroki 重试延迟时间（毫秒）
 *
 * @default 1000
 * @env KROKI_RETRY_DELAY
 */
export const KROKI_RETRY_DELAY = parseInt(process.env.KROKI_RETRY_DELAY || "1000", 10);

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
 * JWT 过期时间
 *
 * 格式: 数字+单位 (如 '7d', '24h', '3600s')
 *
 * @default '7d'
 * @env JWT_EXPIRES_IN
 */
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * 失败日志记录开关
 *
 * 用于控制是否记录渲染失败日志
 *
 * @default true
 * @env ENABLE_FAILURE_LOGGING
 */
export const ENABLE_FAILURE_LOGGING = process.env.ENABLE_FAILURE_LOGGING !== "false";

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
  KROKI_MAX_RETRIES,
  KROKI_RETRY_DELAY,
  DB_PATH,
  APP_URL,
  API_TEST_TIMEOUT,
  JWT_EXPIRES_IN,
  ENABLE_FAILURE_LOGGING,
} as const;

/**
 * Prompts 目录路径 (项目常量,非环境变量)
 *
 * 用于加载 AI Prompts 文件
 */
export const PROMPTS_DIR = "src/lib/constants/prompts";
