/**
 * API 错误处理中间件
 *
 * 设计要点：
 * - 统一捕获 API 路由错误，返回标准格式
 * - 支持中间件组合（日志、验证等）
 */

import type { NextRequest, NextResponse } from "next/server";

import {
  errorResponse,
  type ApiSuccessResponse,
  type ApiErrorResponse,
  ErrorCodes,
} from "@/lib/utils/api-response";
import { AppError, ErrorCode, ErrorHandler } from "@/lib/utils/error-handler";

import { logger } from "@/lib/utils/logger";

export type ApiHandler<T = unknown> = (
  request: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<Response | NextResponse<ApiSuccessResponse<T> | ApiErrorResponse>>;

/**
 * 错误处理中间件 - 自动捕获并返回统一错误响应
 */
export function withErrorHandler<T = unknown>(handler: ApiHandler<T>): ApiHandler<T> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      // 处理并转换错误
      const appError = ErrorHandler.handle(error);
      ErrorHandler.log(appError);

      // 返回统一的错误响应
      return errorResponse(
        appError.message,
        appError.code || ErrorCodes.INTERNAL_ERROR,
        appError.statusCode,
        appError.details
      );
    }
  };
}

/**
 * 组合多个中间件
 */
export function compose(...middlewares: Array<(handler: ApiHandler) => ApiHandler>) {
  return (handler: ApiHandler): ApiHandler => {
    return middlewares.reduceRight((wrapped, middleware) => middleware(wrapped), handler);
  };
}

/**
 * 请求日志中间件
 */
export function withLogging(handler: ApiHandler): ApiHandler {
  return async (request, context) => {
    const startTime = Date.now();
    const { method, url } = request;

    logger.info(`[API] ${method} ${url} - Started`);

    try {
      const response = await handler(request, context);
      const duration = Date.now() - startTime;
      logger.info(`[API] ${method} ${url} - Completed in ${duration}ms`);
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`[API] ${method} ${url} - Failed in ${duration}ms`, error);
      throw error;
    }
  };
}

interface ValidatedRequest extends NextRequest {
  validatedData?: unknown;
}

/**
 * 请求验证中间件 - 使用 Zod schema 验证请求体
 */
export function withValidation<T extends Record<string, unknown>>(schema: {
  parse: (data: unknown) => T;
}) {
  return (handler: ApiHandler): ApiHandler => {
    return async (request, context) => {
      try {
        const body = await request.json();
        const validatedData = schema.parse(body);

        // 将验证后的数据附加到请求上
        (request as ValidatedRequest).validatedData = validatedData;

        return handler(request, context);
      } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
          throw new AppError("请求数据验证失败", ErrorCode.VALIDATION_FAILED, 400, error);
        }
        throw error;
      }
    };
  };
}
