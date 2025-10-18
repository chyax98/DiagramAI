/**
 * GET /api/prompts/versions?level=3&language=mermaid&type=flowchart
 * 获取版本历史列表
 */

import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { PromptRepository } from "@/lib/repositories/PromptRepository";
import { getDatabaseInstance } from "@/lib/db/client";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import type { UserPublic } from "@/types/database";
import type { RenderLanguage, DiagramType } from "@/lib/constants/diagram-types";

export const GET = withAuth(async (request: NextRequest, __user: UserPublic) => {
  try {
    // 1. 解析查询参数
    const searchParams = request.nextUrl.searchParams;
    const levelStr = searchParams.get("level");

    if (!levelStr) {
      return errorResponse("缺少 level 参数", "MISSING_LEVEL", 400);
    }

    const level = parseInt(levelStr, 10) as 1 | 2 | 3;
    if (![1, 2, 3].includes(level)) {
      return errorResponse("层级必须是 1, 2 或 3", "INVALID_LEVEL", 400);
    }

    const language = searchParams.get("language") || undefined;
    const type = searchParams.get("type") || undefined;

    // 2. 查询版本历史
    const db = getDatabaseInstance();
    const repo = new PromptRepository(db);

    const versions = repo.findVersionInfos(
      level,
      language as RenderLanguage | undefined,
      type as DiagramType | undefined
    );

    logger.info("[/api/prompts/versions] 获取版本历史", {
      level,
      language,
      type,
      count: versions.length,
    });

    return successResponse(versions);
  } catch (error) {
    logger.error("[/api/prompts/versions] 获取版本历史失败:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return errorResponse("获取版本历史失败", "PROMPT_QUERY_FAILED", 500, errorMessage);
  }
});
