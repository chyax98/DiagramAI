/**
 * POST /api/recommend - 智能推荐图表语言和类型
 *
 * 功能:
 * - 接收用户需求描述
 * - 调用 AI 分析并推荐最佳的 renderLanguage + diagramType 组合
 * - 返回推荐结果(包含匹配度、理由和备选方案)
 */

import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { generateText } from "ai";
import { getDatabaseInstance } from "@/lib/db/client";
import { ModelRepository } from "@/lib/repositories/ModelRepository";
import { getAIProvider, validateProviderConfig } from "@/lib/ai/provider-factory";
import { getRecommendPrompt } from "@/lib/constants/prompts/recommend";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/utils/api-response";
import { LANGUAGE_DIAGRAM_TYPES } from "@/lib/constants/diagram-types";
import type { UserPublic } from "@/types/database";
import type { RecommendationResult } from "@/types/recommendation";
import { logger } from "@/lib/utils/logger";
import { MAX_INPUT_TEXT_LENGTH } from "@/lib/constants/env";
export const POST = withAuth(async (request: NextRequest, user: UserPublic) => {
  try {
    const body = await request.json();
    const { inputText, modelId } = body;

    // 验证输入
    if (!inputText || typeof inputText !== "string" || !inputText.trim()) {
      return errorResponse("输入内容不能为空", ErrorCodes.VALIDATION_ERROR, 400);
    }

    if (!modelId || typeof modelId !== "number") {
      return errorResponse("模型 ID 不能为空", ErrorCodes.VALIDATION_ERROR, 400);
    }

    if (inputText.length > MAX_INPUT_TEXT_LENGTH) {
      return errorResponse(
        `输入内容过长，当前 ${inputText.length.toLocaleString()} 字符，限制 ${MAX_INPUT_TEXT_LENGTH.toLocaleString()} 字符`,
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    logger.info(`[/api/recommend] 请求推荐:`, {
      userId: user.id,
      modelId,
      inputLength: inputText.length,
    });

    // 获取 AI 模型配置
    const db = getDatabaseInstance();
    const modelRepo = new ModelRepository(db);
    const modelConfig = modelRepo.findById(modelId);

    if (!modelConfig || modelConfig.user_id !== user.id) {
      return errorResponse("AI 模型不存在或无权访问", ErrorCodes.NOT_FOUND, 404);
    }

    // 验证模型配置
    validateProviderConfig({
      provider: modelConfig.provider,
      model_id: modelConfig.model_id,
      api_key: modelConfig.api_key,
    });

    // 获取 AI Provider
    const model = getAIProvider({
      provider: modelConfig.provider,
      model_id: modelConfig.model_id,
      api_key: modelConfig.api_key,
      api_endpoint: modelConfig.api_endpoint,
    });

    // 调用 AI 进行推荐
    const { text: resultText } = await generateText({
      model,
      system: getRecommendPrompt(),
      messages: [
        {
          role: "user",
          content: inputText.trim(),
        },
      ],
      temperature: 0.3, // 推荐需要稳定性,使用较低温度
      maxRetries: 2,
    });

    // 解析 JSON 结果
    let recommendation: RecommendationResult;
    try {
      // 提取 JSON (可能包含在代码块中)
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("无法从 AI 响应中提取 JSON");
      }

      recommendation = JSON.parse(jsonMatch[0]);

      // 容错处理: 将 renderLanguage 转换为小写 (AI 可能返回 "NwDiag" 而非 "nwdiag")
      if (recommendation.renderLanguage) {
        recommendation.renderLanguage = recommendation.renderLanguage.toLowerCase() as any;
      }
      // 容错处理: alternatives 中的 language 也要转换
      if (recommendation.alternatives) {
        recommendation.alternatives = recommendation.alternatives.map((alt) => ({
          ...alt,
          language: alt.language.toLowerCase() as any,
        }));
      }

      // 验证必需字段
      if (
        !recommendation.renderLanguage ||
        !recommendation.diagramType ||
        typeof recommendation.confidence !== "number" ||
        !Array.isArray(recommendation.reasons)
      ) {
        throw new Error("AI 返回的推荐格式不完整");
      }

      // 确保 confidence 在 0-1 范围
      recommendation.confidence = Math.max(0, Math.min(1, recommendation.confidence));

      // 验证推荐的语言-类型组合是否合法
      const supportedTypes = LANGUAGE_DIAGRAM_TYPES[recommendation.renderLanguage];
      if (!supportedTypes) {
        logger.error("[/api/recommend] 推荐的渲染语言不支持:", {
          language: recommendation.renderLanguage,
        });
        throw new Error(`不支持的渲染语言: ${recommendation.renderLanguage}`);
      }

      const isValidType = supportedTypes.some((type) => type.value === recommendation.diagramType);
      if (!isValidType) {
        logger.error("[/api/recommend] 推荐的图表类型不匹配:", {
          language: recommendation.renderLanguage,
          type: recommendation.diagramType,
          supportedTypes: supportedTypes.map((t) => t.value),
        });
        throw new Error(
          `图表类型 "${recommendation.diagramType}" 不适用于渲染语言 "${recommendation.renderLanguage}"`
        );
      }
    } catch (parseError) {
      logger.error("[/api/recommend] JSON 解析失败:", {
        error: parseError,
        rawText: resultText,
      });
      return errorResponse(
        "AI 推荐结果解析失败,请重试",
        ErrorCodes.GENERATION_FAILED,
        500,
        parseError instanceof Error ? parseError.message : "Unknown error"
      );
    }

    logger.info(`[/api/recommend] 推荐成功:`, {
      userId: user.id,
      recommendation: {
        language: recommendation.renderLanguage,
        type: recommendation.diagramType,
        confidence: recommendation.confidence,
      },
    });

    return successResponse(recommendation);
  } catch (error) {
    logger.error("[/api/recommend] 推荐失败:", error);

    return errorResponse(
      "智能推荐失败",
      ErrorCodes.GENERATION_FAILED,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
