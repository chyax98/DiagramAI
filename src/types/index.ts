/** 类型定义索引 - 统一导出common+database+diagram+API响应类型 */

export * from "./common";
export * from "./database";
export * from "./diagram";

export type {
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiErrorDetails,
} from "@/lib/utils/api-response";
export { ErrorCodes } from "@/lib/utils/api-response";
