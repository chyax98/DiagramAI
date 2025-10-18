declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * JWT Secret Key
       *
       * 用途: JWT Token 签名和验证
       * 必需: 是
       * 默认值: 无（必须在 .env.local 中配置）
       * 生成方式: openssl rand -base64 64
       */
      JWT_SECRET: string;

      /**
       * 数据库文件路径
       *
       * 用途: SQLite 数据库文件位置
       * 默认值: './data/diagram-ai.db'
       *
       * 注意: 路径相对于项目根目录
       */
      DB_PATH?: string;

      /**
       * 数据库操作超时时间
       *
       * 用途: SQLite 数据库操作超时（毫秒）
       * 默认值: '5000' (5秒)
       *
       * 调优建议:
       * - 开发环境: 5000 (快速反馈)
       * - 生产环境: 10000 (允许更长查询)
       * - 测试环境: 2000 (快速失败)
       */
      DB_TIMEOUT?: string;

      /**
       * bcrypt 加密轮数
       *
       * 用途: 密码加密的安全强度
       * 默认值: '10'
       *
       * 性能参考:
       * - 8 轮: ~25ms (开发环境推荐)
       * - 10 轮: ~100ms (生产环境默认)
       * - 12 轮: ~400ms (高安全性场景)
       */
      BCRYPT_SALT_ROUNDS?: string;

      /**
       * API 连接测试超时时间
       *
       * 用途: AI 模型连接测试的超时限制（毫秒）
       * 默认值: '30000' (30秒)
       *
       * 说明: 设置为 30 秒以适应推理模型（如 o1, DeepSeek-R1）的响应时间
       */
      API_TEST_TIMEOUT?: string;

      /**
       * AI 生成温度参数
       *
       * 用途: 控制 AI 生成的随机性（0.0-2.0）
       * 默认值: '0.7'
       *
       * 说明:
       * - 0.0: 确定性输出（相同输入=相同输出）
       * - 0.7: 平衡创造性和一致性（推荐）
       * - 1.0-2.0: 更高随机性和创造性
       */
      AI_TEMPERATURE?: string;

      /**
       * AI 请求最大重试次数
       *
       * 用途: AI 请求失败后的重试次数
       * 默认值: '3'
       */
      AI_MAX_RETRIES?: string;

      /**
       * JWT 过期时间
       *
       * 用途: JWT Token 的有效期
       * 格式: 数字+单位 (如 '7d', '24h', '3600s')
       * 默认值: '7d' (7天)
       */
      JWT_EXPIRES_IN?: string;

      /**
       * 失败日志记录开关
       *
       * 用途: 是否记录渲染失败日志
       * 值: 'true' | 'false'
       * 默认值: 'true'
       */
      ENABLE_FAILURE_LOGGING?: string;

      /**
       * Node 环境
       *
       * 值: 'development' | 'production' | 'test'
       * 默认值: 'development'
       */
      NODE_ENV?: "development" | "production" | "test";

      // ===== 外部服务配置 =====

      /**
       * Kroki 服务 URL (后端专用)
       *
       * 用途: 后端代理访问 Kroki 图表渲染服务
       * 默认值: 'https://kroki.io'
       *
       * 说明:
       * - 前端通过 /api/kroki 代理访问，无需配置客户端变量
       * - 可选: 本地部署时使用 'http://localhost:8000'
       */
      KROKI_URL?: string;

      /**
       * Kroki 最大重试次数
       *
       * 用途: Kroki 请求失败后的重试次数
       * 默认值: '3'
       */
      KROKI_MAX_RETRIES?: string;

      /**
       * Kroki 重试延迟时间
       *
       * 用途: Kroki 请求失败后的重试延迟（毫秒）
       * 默认值: '1000' (1秒)
       */
      KROKI_RETRY_DELAY?: string;

      // ===== 客户端可访问变量 (NEXT_PUBLIC_*) =====

      /**
       * 最大输入字符数
       *
       * 用途: 用户输入文本的最大长度限制
       * 默认值: '20000'
       */
      NEXT_PUBLIC_MAX_INPUT_CHARS?: string;

      /**
       * 最大对话轮次
       *
       * 用途: 单个会话的最大对话轮数限制
       * 默认值: '10'
       */
      NEXT_PUBLIC_MAX_CHAT_ROUNDS?: string;

      /**
       * 应用部署 URL
       *
       * 用途: 完整的应用 URL
       * 默认值: 'http://localhost:3000'
       */
      NEXT_PUBLIC_APP_URL?: string;
    }
  }
}

/**
 * 环境变量辅助函数
 *
 * 提供类型安全的环境变量访问
 */

// 注意: 以下工具函数已移除(未被项目使用):
// - getClientEnv() - 直接使用 process.env.NEXT_PUBLIC_* 访问
// - getServerEnv() - 直接使用 process.env.* 访问
// - parseEnvNumber() - 使用时直接 parseInt()
// - parseEnvBoolean() - 使用时直接判断字符串
// - validateEnv() - 未在启动时调用

// 导出空对象以使文件被视为模块
export {};
