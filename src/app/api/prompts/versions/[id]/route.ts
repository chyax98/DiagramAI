/**
 * PUT /api/prompts/versions/:id/activate - 激活某个版本
 * DELETE /api/prompts/versions/:id - 删除某个版本
 */

import { NextRequest } from "next/server";
import { withAuthParams } from "@/lib/auth/middleware";
import { PromptRepository } from "@/lib/repositories/PromptRepository";
import { getDatabaseInstance } from "@/lib/db/client";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import type { UserPublic } from "@/types/database";

/**
 * PUT /api/prompts/:id/activate
 * 激活某个版本
 */
export const PUT = withAuthParams<{ id: string }>(
  async (_request: NextRequest, _user: UserPublic, params) => {
    try {
      const promptId = parseInt(params.id, 10);

      if (isNaN(promptId)) {
        return errorResponse("无效的 ID", "INVALID_ID", 400);
      }

      const db = getDatabaseInstance();
      const repo = new PromptRepository(db);

      // 验证提示词是否存在
      const prompt = repo.findById(promptId);
      if (!prompt) {
        return notFoundResponse("提示词不存在");
      }

      // 激活版本
      repo.activate(promptId);

      logger.info("[/api/prompts/:id/activate] 激活版本", {
        promptId,
        version: prompt.version,
      });

      return successResponse({ message: "版本已激活", version: prompt.version });
    } catch (error) {
      logger.error("[/api/prompts/:id/activate] 激活版本失败:", error);
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      return errorResponse("激活版本失败", "PROMPT_ACTIVATE_FAILED", 500, errorMessage);
    }
  }
);

/**
 * DELETE /api/prompts/:id
 * 删除某个版本
 */
export const DELETE = withAuthParams<{ id: string }>(
  async (_request: NextRequest, _user: UserPublic, params) => {
    try {
      const promptId = parseInt(params.id, 10);

      if (isNaN(promptId)) {
        return errorResponse("无效的 ID", "INVALID_ID", 400);
      }

      const db = getDatabaseInstance();
      const repo = new PromptRepository(db);

      // 验证提示词是否存在
      const prompt = repo.findById(promptId);
      if (!prompt) {
        return notFoundResponse("提示词不存在");
      }

      // 软删除版本
      repo.delete(promptId);

      logger.info("[/api/prompts/:id] 删除版本", {
        promptId,
        version: prompt.version,
      });

      return successResponse({ message: "版本已删除", version: prompt.version });
    } catch (error) {
      logger.error("[/api/prompts/:id] 删除版本失败:", error);
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      return errorResponse("删除版本失败", "PROMPT_DELETE_FAILED", 500, errorMessage);
    }
  }
);
