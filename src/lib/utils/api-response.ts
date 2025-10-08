/**
 * 统一的 API 响应格式工具
 *
 * 设计要点：
 * - 统一所有 API 的响应结构（success + data/error）
 * - 提供类型安全的响应构造函数
 * - 简化错误处理，支持 Zod 验证错误格式化
 */

import { NextResponse } from "next/server";
import type { ZodError } from "zod";

/**
 * 成功响应接口
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

/**
 * 错误详情接口
 */
export interface ApiErrorDetails {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * 错误响应接口
 */
export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetails;
}

/**
 * 标准错误代码枚举
 */
export const ErrorCodes = {
  // 认证错误 (401)
  UNAUTHORIZED: "UNAUTHORIZED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",

  // 权限错误 (403)
  FORBIDDEN: "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",

  // 请求错误 (400)
  BAD_REQUEST: "BAD_REQUEST",
  INVALID_REQUEST: "INVALID_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  MISSING_REQUIRED_FIELDS: "MISSING_REQUIRED_FIELDS",

  // 冲突错误 (409)
  CONFLICT: "CONFLICT",
  DUPLICATE_RESOURCE: "DUPLICATE_RESOURCE",

  // 资源错误 (404)
  NOT_FOUND: "NOT_FOUND",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  MODEL_NOT_FOUND: "MODEL_NOT_FOUND",
  HISTORY_NOT_FOUND: "HISTORY_NOT_FOUND",
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",

  // 业务逻辑错误 (422)
  BUSINESS_ERROR: "BUSINESS_ERROR",
  GENERATION_FAILED: "GENERATION_FAILED",
  ADJUSTMENT_FAILED: "ADJUSTMENT_FAILED",
  MAX_ROUNDS_EXCEEDED: "MAX_ROUNDS_EXCEEDED",

  // 服务器错误 (500)
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
} as const;

/**
 * 创建成功响应
 *
 * @param data - 响应数据
 * @param status - HTTP 状态码（默认 200）
 */
export function successResponse<T = unknown>(
  data: T,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * 创建错误响应
 *
 * @param message - 用户友好的错误信息
 * @param code - 错误代码（默认 INTERNAL_ERROR）
 * @param status - HTTP 状态码（默认 500）
 * @param details - 详细错误信息（可选，仅开发环境）
 */
export function errorResponse(
  message: string,
  code: string = ErrorCodes.INTERNAL_ERROR,
  status = 500,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };

  // 只在开发环境包含详细错误信息
  if (details && process.env.NODE_ENV === "development") {
    response.error.details = details;
  }

  return NextResponse.json(response, { status });
}

/**
 * 创建验证错误响应（Zod 专用）
 *
 * @param zodError - Zod 验证错误对象
 */
export function validationErrorResponse(zodError: ZodError): NextResponse<ApiErrorResponse> {
  // 格式化 Zod 错误信息
  const formattedErrors = zodError.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  // 生成用户友好的错误信息
  const message = formattedErrors.map((err) => `${err.field}: ${err.message}`).join("; ");

  return errorResponse(
    message || "请求参数验证失败",
    ErrorCodes.VALIDATION_ERROR,
    400,
    formattedErrors
  );
}

/**
 * 创建未授权响应
 *
 * @param message - 错误信息（默认：未授权访问）
 * @param code - 错误代码（默认：UNAUTHORIZED）
 */
export function unauthorizedResponse(
  message = "未授权访问",
  code = ErrorCodes.UNAUTHORIZED
): NextResponse<ApiErrorResponse> {
  return errorResponse(message, code, 401);
}

/**
 * 创建禁止访问响应
 *
 * @param message - 错误信息（默认：禁止访问）
 */
export function forbiddenResponse(message = "禁止访问"): NextResponse<ApiErrorResponse> {
  return errorResponse(message, ErrorCodes.FORBIDDEN, 403);
}

/**
 * 创建未找到响应
 *
 * @param message - 错误信息（默认：资源不存在）
 * @param code - 错误代码（默认：NOT_FOUND）
 */
export function notFoundResponse(
  message = "资源不存在",
  code = ErrorCodes.NOT_FOUND
): NextResponse<ApiErrorResponse> {
  return errorResponse(message, code, 404);
}

/**
 * 创建业务逻辑错误响应
 *
 * @param message - 错误信息
 * @param code - 错误代码（默认：BUSINESS_ERROR）
 */
export function businessErrorResponse(
  message: string,
  code = ErrorCodes.BUSINESS_ERROR
): NextResponse<ApiErrorResponse> {
  return errorResponse(message, code, 422);
}
