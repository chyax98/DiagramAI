/**
 * GET /api/prompts/:level?language&type
 * 获取激活的提示词
 *
 * Examples:
 * - GET /api/prompts/1
 * - GET /api/prompts/2?language=mermaid
 * - GET /api/prompts/3?language=mermaid&type=flowchart
 *
 * 说明:
 * - 仅查询数据库中的提示词 (包括官方 v0 和用户自定义版本)
 * - 官方提示词通过 scripts/import-official-prompts.js 导入 (版本号 v0)
 * - 用户自定义版本号从 v1 开始递增
 */

import { NextRequest } from "next/server";
import { withAuthParams } from "@/lib/auth/middleware";
import { PromptRepository } from "@/lib/repositories/PromptRepository";
import { getDatabaseInstance } from "@/lib/db/client";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import type { UserPublic } from "@/types/database";
import type { RenderLanguage, DiagramType } from "@/lib/constants/diagram-types";

export const GET = withAuthParams<{ level: string }>(
  async (request: NextRequest, _user: UserPublic, params) => {
    try {
      // 1. 解析参数
      const level = parseInt(params.level, 10) as 1 | 2 | 3;
      if (![1, 2, 3].includes(level)) {
        return errorResponse("层级必须是 1, 2 或 3", "INVALID_LEVEL", 400);
      }

      const searchParams = request.nextUrl.searchParams;
      const language = searchParams.get("language") || undefined;
      const type = searchParams.get("type") || undefined;

      // 2. 查询数据库
      const db = getDatabaseInstance();
      const repo = new PromptRepository(db);

      const prompt = repo.findActive(
        level,
        language as RenderLanguage | undefined,
        type as DiagramType | undefined
      );

      // 3. 处理 L2 特殊情况 (L2 提示词可选)
      if (!prompt && level === 2) {
        logger.info("[/api/prompts/:level] L2 提示词不存在,返回空内容", {
          level,
          language,
        });
        return successResponse({
          content: "",
          version: "none",
          name: "无 L2 提示词",
          description: "该语言没有 L2 通用提示词",
          created_at: new Date().toISOString(),
          is_custom: false,
        });
      }

      // 4. L1 和 L3 必须存在
      if (!prompt) {
        logger.warn("[/api/prompts/:level] 提示词不存在", {
          level,
          language,
          type,
        });
        return errorResponse("该层级的提示词不存在", "PROMPT_NOT_FOUND", 404);
      }

      logger.info("[/api/prompts/:level] 返回提示词", {
        level,
        version: prompt.version,
        is_official: prompt.version === "v0",
      });

      // 5. 返回完整响应
      return successResponse({
        content: prompt.content,
        version: prompt.version,
        name: prompt.name,
        description: prompt.description,
        created_at: prompt.created_at,
        is_custom: prompt.version !== "v0", // v0 是官方版本
      });
    } catch (error) {
      logger.error("[/api/prompts/:level] 获取提示词失败:", error);
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      return errorResponse("获取提示词失败", "PROMPT_QUERY_FAILED", 500, errorMessage);
    }
  }
);
