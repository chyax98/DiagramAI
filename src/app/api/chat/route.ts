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
  try {
    // 1. 解析 JSON (可能抛出 SyntaxError)
    let body: unknown;
    try {
      body = await request.json();
    } catch (jsonError) {
      logger.error("[/api/chat] JSON 解析失败:", jsonError);
      return errorResponse(
        "请求体不是有效的 JSON 格式",
        ErrorCodes.INVALID_REQUEST,
        400,
        jsonError instanceof Error ? jsonError.message : String(jsonError)
      );
    }

    // 2. 验证请求参数 (使用 Zod)
    const validation = ChatRequestSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;

    // 3. 构建服务层参数
    const params = {
      userId: user.id,
      userMessage: data.userMessage,
      renderLanguage: data.renderLanguage,
      modelId: data.modelId,
      sessionId: data.sessionId || undefined,
      diagramType: data.diagramType,
      taskType: data.taskType,
      renderError: data.renderError,
    };

    logger.info(`[/api/chat] 请求参数:`, {
      userId: user.id,
      hasSessionId: !!data.sessionId,
      taskType: data.taskType,
      renderLanguage: data.renderLanguage,
      diagramType: data.diagramType,
      messageLength: data.userMessage.length,
    });

    // 4. 调用业务逻辑层
    const service = new DiagramGenerationService();
    const result = await service.chat(params);

    logger.info(`[/api/chat] 生成成功:`, {
      sessionId: result.sessionId,
      roundCount: result.roundCount,
      codeLength: result.code.length,
    });

    // 5. 返回成功响应
    return successResponse({
      code: result.code,
      sessionId: result.sessionId,
      roundCount: result.roundCount,
    });
  } catch (error) {
    logger.error("[/api/chat] 请求失败:", error);

    // 提取错误信息
    const errorMessage = error instanceof Error ? error.message : "未知错误";

    // 统一返回业务错误 (HTTP 500)
    // 不再区分"生成"和"调整"失败,因为任务类型已在 taskType 中明确
    return errorResponse("图表处理失败", ErrorCodes.GENERATION_FAILED, 500, errorMessage);
  }
});
