/** 类型定义索引 - 统一导出common+database+diagram+API响应+错误处理类型 */

export * from "./common";
export * from "./database";
export * from "./diagram";

export type {
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiErrorDetails,
} from "@/lib/utils/api-response";
export { ErrorCodes } from "@/lib/utils/api-response";
export { ErrorCode, AppError } from "@/lib/utils/error-handler";
export type { createError } from "@/lib/utils/error-handler";
