/**
 * 统一错误处理系统
 *
 * 设计要点：
 * - 提供一致的错误创建、处理和报告机制
 * - 区分可操作错误和系统错误
 * - 支持错误代码分类和 HTTP 状态码映射
 */

/**
 * 错误代码枚举（用于分类和识别不同类型的错误）
 */
export enum ErrorCode {
  // 通用错误 (1000-1099)
  UNKNOWN = "UNKNOWN_ERROR",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  NETWORK_ERROR = "NETWORK_ERROR",

  // 认证错误 (1100-1199)
  AUTH_FAILED = "AUTH_FAILED",
  UNAUTHORIZED = "UNAUTHORIZED",
  TOKEN_INVALID = "TOKEN_INVALID",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",

  // 图表生成错误 (1200-1299)
  DIAGRAM_GENERATION_FAILED = "DIAGRAM_GENERATION_FAILED",
  MERMAID_RENDER_FAILED = "MERMAID_RENDER_FAILED",
  PLANTUML_RENDER_FAILED = "PLANTUML_RENDER_FAILED",
  INVALID_DIAGRAM_CODE = "INVALID_DIAGRAM_CODE",
  INPUT_TOO_LONG = "INPUT_TOO_LONG",

  // AI 服务错误 (1300-1399)
  AI_SERVICE_ERROR = "AI_SERVICE_ERROR",
  AI_TIMEOUT = "AI_TIMEOUT",
  AI_RATE_LIMIT = "AI_RATE_LIMIT",
  INVALID_API_KEY = "INVALID_API_KEY",

  // 数据库错误 (1400-1499)
  DATABASE_ERROR = "DATABASE_ERROR",
  RECORD_NOT_FOUND = "RECORD_NOT_FOUND",
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",

  // 文件处理错误 (1500-1599)
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  FILE_PARSE_ERROR = "FILE_PARSE_ERROR",
}

/**
 * 自定义应用错误类
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  /**
   * 创建应用错误
   *
   * @param message - 错误消息（用户友好）
   * @param code - 错误代码
   * @param statusCode - HTTP 状态码
   * @param details - 错误详细信息（可选）
   * @param isOperational - 是否为可操作错误（默认 true）
   */
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN,
    statusCode: number = 500,
    details?: unknown,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    // 保持正确的堆栈跟踪
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * 转换为 JSON 格式（用于 API 响应）
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

/**
 * 错误处理器
 */
export class ErrorHandler {
  /**
   * 处理未知错误并转换为 AppError
   *
   * @param error - 未知错误
   * @returns AppError 实例
   */
  static handle(error: unknown): AppError {
    // 已经是 AppError,直接返回
    if (error instanceof AppError) {
      return error;
    }

    // 标准 Error 对象
    if (error instanceof Error) {
      return new AppError(error.message, ErrorCode.UNKNOWN, 500, {
        originalError: error.name,
        stack: error.stack,
      });
    }

    // 字符串错误
    if (typeof error === "string") {
      return new AppError(error, ErrorCode.UNKNOWN, 500);
    }

    return new AppError("发生未知错误", ErrorCode.UNKNOWN, 500, { rawError: error });
  }

  /**
   * 判断错误是否为可操作错误
   *
   * @param error - 错误对象
   */
  static isOperational(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  /**
   * 记录错误到日志系统
   *
   * @param error - 错误对象
   * @param context - 上下文信息
   */
  static log(error: AppError, context?: Record<string, unknown>): void {
    const errorLog = {
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
      stack: error.stack,
      context,
    };

    // 使用统一的 logger 工具
    // 动态导入以避免循环依赖
    import("./logger").then(({ logger }) => {
      if (error.statusCode >= 500) {
        logger.error("应用错误", errorLog);
      } else if (error.statusCode >= 400) {
        logger.warn("客户端错误", errorLog);
      } else {
        logger.info("信息", errorLog);
      }
    });
  }
}

/**
 * 错误工厂函数（快速创建特定类型的错误）
 */
export const createError = {
  authFailed: (message: string = "认证失败", details?: unknown) =>
    new AppError(message, ErrorCode.AUTH_FAILED, 401, details),

  unauthorized: (message: string = "未授权访问", details?: unknown) =>
    new AppError(message, ErrorCode.UNAUTHORIZED, 403, details),

  invalidToken: (message: string = "无效的访问令牌", details?: unknown) =>
    new AppError(message, ErrorCode.TOKEN_INVALID, 401, details),

  expiredToken: (message: string = "访问令牌已过期", details?: unknown) =>
    new AppError(message, ErrorCode.TOKEN_EXPIRED, 401, details),

  diagramFailed: (message: string = "图表生成失败", details?: unknown) =>
    new AppError(message, ErrorCode.DIAGRAM_GENERATION_FAILED, 500, details),

  mermaidFailed: (message: string = "Mermaid 图表渲染失败", details?: unknown) =>
    new AppError(message, ErrorCode.MERMAID_RENDER_FAILED, 500, details),

  plantUMLFailed: (message: string = "PlantUML 图表渲染失败", details?: unknown) =>
    new AppError(message, ErrorCode.PLANTUML_RENDER_FAILED, 500, details),

  inputTooLong: (maxLength: number, actualLength: number) =>
    new AppError(
      `输入文本过长,最多 ${maxLength} 字符,当前 ${actualLength} 字符`,
      ErrorCode.INPUT_TOO_LONG,
      400,
      { maxLength, actualLength }
    ),

  validation: (message: string, details?: unknown) =>
    new AppError(message, ErrorCode.VALIDATION_FAILED, 400, details),

  network: (message: string = "网络请求失败", details?: unknown) =>
    new AppError(message, ErrorCode.NETWORK_ERROR, 503, details),

  aiService: (message: string = "AI 服务错误", details?: unknown) =>
    new AppError(message, ErrorCode.AI_SERVICE_ERROR, 500, details),

  aiTimeout: (message: string = "AI 服务响应超时", details?: unknown) =>
    new AppError(message, ErrorCode.AI_TIMEOUT, 504, details),

  aiRateLimit: (message: string = "AI 服务请求过于频繁", details?: unknown) =>
    new AppError(message, ErrorCode.AI_RATE_LIMIT, 429, details),

  database: (message: string = "数据库操作失败", details?: unknown) =>
    new AppError(message, ErrorCode.DATABASE_ERROR, 500, details, false),

  notFound: (resource: string = "资源") =>
    new AppError(`${resource}不存在`, ErrorCode.RECORD_NOT_FOUND, 404),

  duplicate: (resource: string = "记录") =>
    new AppError(`${resource}已存在`, ErrorCode.DUPLICATE_ENTRY, 409),

  fileTooLarge: (maxSize: number, actualSize: number) =>
    new AppError(
      `文件过大,最大 ${maxSize} MB,当前 ${actualSize} MB`,
      ErrorCode.FILE_TOO_LARGE,
      413,
      { maxSize, actualSize }
    ),

  invalidFileType: (allowedTypes: string[], actualType: string) =>
    new AppError(
      `不支持的文件类型,仅支持: ${allowedTypes.join(", ")}`,
      ErrorCode.INVALID_FILE_TYPE,
      400,
      { allowedTypes, actualType }
    ),
};

/**
 * 异步错误包装器（自动捕获异步函数中的错误并转换为 AppError）
 */
export function catchAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return (await fn(...args)) as ReturnType<T>;
    } catch (error) {
      throw ErrorHandler.handle(error);
    }
  };
}
