/**
 * POST /api/chat - 统一的图表对话接口
 * 处理首次生成和多轮调整,根据sessionId自动路由
 */

import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { DiagramGenerationService } from "@/lib/services/DiagramGenerationService";
import { ChatRequestSchema } from "@/lib/validations/chat";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  ErrorCodes,
} from "@/lib/utils/api-response";
import type { UserPublic } from "@/types/database";

import { logger } from "@/lib/utils/logger";

export const POST = withAuth(async (request: NextRequest, user: UserPublic) => {
  let body: any;
  let hasSessionId = false;

  try {
    body = await request.json();
    hasSessionId = !!body.sessionId;

    // 验证请求参数
    const validation = ChatRequestSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;

    // 参数标准化
    const params = {
      userId: user.id,
      userMessage: data.userMessage,
      renderLanguage: data.renderLanguage,
      modelId: data.modelId,
      sessionId: data.sessionId || undefined,
      diagramType: data.diagramType,
    };

    logger.info(`[/api/chat] 请求参数:`, {
      userId: user.id,
      hasSessionId: !!data.sessionId,
      renderLanguage: data.renderLanguage,
      diagramType: data.diagramType,
      messageLength: data.userMessage.length,
    });

    // 使用统一的 chat() 接口
    const service = new DiagramGenerationService();
    const result = await service.chat(params);

    logger.info(`[/api/chat] 生成成功:`, {
      sessionId: result.sessionId,
      roundCount: result.roundCount,
      codeLength: result.code.length,
    });

    return successResponse({
      code: result.code,
      sessionId: result.sessionId,
      roundCount: result.roundCount,
    });
  } catch (error) {
    logger.error("[/api/chat] 请求失败:", error);

    // 根据 sessionId 判断是生成还是调整失败
    const errorMessage = (error as Error).message || "未知错误";
    const isGeneration = !hasSessionId;

    return errorResponse(
      isGeneration ? "生成失败" : "调整失败",
      isGeneration ? ErrorCodes.GENERATION_FAILED : ErrorCodes.ADJUSTMENT_FAILED,
      500,
      errorMessage
    );
  }
});
