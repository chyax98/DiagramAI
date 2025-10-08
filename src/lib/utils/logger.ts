/** 统一日志工具 - 开发环境输出所有日志,生产环境仅警告和错误 */
export const logger = {
  info: (message?: unknown, ...args: unknown[]): void => {
    if (process.env.NODE_ENV === "development") {
      console.info(message, ...args);
    }
  },

  warn: (message?: unknown, ...args: unknown[]): void => {
    console.warn(message, ...args);
  },

  error: (message?: unknown, ...args: unknown[]): void => {
    console.error(message, ...args);
  },
};
