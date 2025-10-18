/**
 * GET /api/prompts - 获取用户所有自定义的提示词位置
 * POST /api/prompts - 创建新版本的提示词
 */

import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { PromptRepository } from "@/lib/repositories/PromptRepository";
import { getDatabaseInstance } from "@/lib/db/client";
import { successResponse, errorResponse, validationErrorResponse } from "@/lib/utils/api-response";
import { CreatePromptSchema } from "@/lib/validations/prompts";
import { logger } from "@/lib/utils/logger";
import type { UserPublic } from "@/types/database";

/**
 * GET /api/prompts
 * 获取所有自定义的提示词位置 (全局共享)
 */
export const GET = withAuth(async (_request: NextRequest, _user: UserPublic) => {
  try {
    const db = getDatabaseInstance();
    const repo = new PromptRepository(db);

    const positions = repo.findAllCustomizedPositions();

    logger.info("[/api/prompts] 获取自定义位置列表", {
      count: positions.length,
    });

    return successResponse(positions);
  } catch (error) {
    logger.error("[/api/prompts] 获取自定义位置失败:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return errorResponse("获取自定义位置失败", "PROMPT_QUERY_FAILED", 500, errorMessage);
  }
});

/**
 * POST /api/prompts
 * 创建新版本的提示词 (全局共享, 所有登录用户可创建)
 */
export const POST = withAuth(async (request: NextRequest, user: UserPublic) => {
  try {
    // 1. 解析 JSON
    let body: unknown;
    try {
      body = await request.json();
    } catch (jsonError) {
      logger.error("[/api/prompts] JSON 解析失败:", jsonError);
      return errorResponse(
        "请求体不是有效的 JSON 格式",
        "INVALID_REQUEST",
        400,
        jsonError instanceof Error ? jsonError.message : String(jsonError)
      );
    }

    // 2. 验证请求参数
    const validation = CreatePromptSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;

    // 3. 创建提示词
    const db = getDatabaseInstance();
    const repo = new PromptRepository(db);

    // 3.1 构建创建参数 (根据层级构建正确的参数类型)
    const createParams =
      data.prompt_level === 1
        ? {
            prompt_level: 1 as const,
            name: data.name,
            description: data.description,
            content: data.content,
            is_active: data.is_active ?? true,
            created_by: user.id,
          }
        : data.prompt_level === 2 && data.render_language
          ? {
              prompt_level: 2 as const,
              render_language: data.render_language as any,
              name: data.name,
              description: data.description,
              content: data.content,
              is_active: data.is_active ?? true,
              created_by: user.id,
            }
          : {
              prompt_level: 3 as const,
              render_language: data.render_language! as any,
              diagram_type: data.diagram_type!,
              name: data.name,
              description: data.description,
              content: data.content,
              is_active: data.is_active ?? true,
              created_by: user.id,
            };

    // 3.2 创建提示词 (自动生成版本号)
    const promptId = repo.create(createParams);

    logger.info("[/api/prompts] 创建提示词成功", {
      createdBy: user.id,
      promptId,
      level: data.prompt_level,
    });

    return successResponse({ id: promptId }, 201);
  } catch (error) {
    logger.error("[/api/prompts] 创建提示词失败:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return errorResponse("创建提示词失败", "PROMPT_CREATE_FAILED", 500, errorMessage);
  }
});
