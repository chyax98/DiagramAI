/** 推荐功能 Hook - 封装推荐业务逻辑 */

import { useCallback } from "react";
import { useDiagramStore } from "@/lib/stores/diagram-store";
import { toast } from "@/components/ui/toast";
import { logger } from "@/lib/utils/logger";
import { MAX_INPUT_TEXT_LENGTH } from "@/lib/constants/env";
/**
 * 推荐功能 Hook
 *
 * 提供:
 * - handleRecommend: 调用 API 获取推荐
 * - applyRecommendation: 应用推荐到选择器
 * - isRecommending: 推荐状态
 * - recommendation: 推荐结果
 */
export function useRecommendation() {
  const {
    startRecommending,
    finishRecommending,
    applyRecommendation: applyRecommendationAction,
    selectedModelId,
    isRecommending,
    recommendation,
  } = useDiagramStore();

  /**
   * 调用推荐 API
   */
  const handleRecommend = useCallback(
    async (inputText: string) => {
      // 验证模型已选择
      if (!selectedModelId) {
        toast.error("请先选择 AI 模型");
        return;
      }

      // 验证输入
      if (!inputText || !inputText.trim()) {
        toast.error("请输入需求描述");
        return;
      }

      if (inputText.length > MAX_INPUT_TEXT_LENGTH) {
        toast.error(
          `输入内容过长，当前 ${inputText.length.toLocaleString()} 字符，限制 ${MAX_INPUT_TEXT_LENGTH.toLocaleString()} 字符`
        );
        return;
      }

      startRecommending();

      try {
        logger.info("[useRecommendation] 开始推荐", {
          inputLength: inputText.length,
          modelId: selectedModelId,
        });

        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            inputText: inputText.trim(),
            modelId: selectedModelId,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "推荐失败");
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("推荐结果格式错误");
        }

        logger.info("[useRecommendation] 推荐成功", {
          language: result.data.renderLanguage,
          type: result.data.diagramType,
          confidence: result.data.confidence,
        });

        finishRecommending(result.data);
        toast.success("AI 推荐完成");
      } catch (error) {
        logger.error("[useRecommendation] 推荐失败", error);

        const errorMessage = error instanceof Error ? error.message : "推荐失败,请重试";

        toast.error(errorMessage);
        finishRecommending(null);
      }
    },
    [selectedModelId, startRecommending, finishRecommending]
  );

  /**
   * 应用推荐到选择器
   */
  const applyRecommendation = useCallback(async () => {
    if (!recommendation) {
      logger.warn("[useRecommendation] 无推荐可应用");
      return;
    }

    logger.info("[useRecommendation] 应用推荐", {
      language: recommendation.renderLanguage,
      type: recommendation.diagramType,
    });

    // 动态导入获取语言和类型的显示名称
    const { RENDER_LANGUAGES, LANGUAGE_DIAGRAM_TYPES } = await import(
      "@/lib/constants/diagram-types"
    );
    const languageInfo = RENDER_LANGUAGES.find((l) => l.value === recommendation.renderLanguage);
    const typeInfo = LANGUAGE_DIAGRAM_TYPES[recommendation.renderLanguage]?.find(
      (t) => t.value === recommendation.diagramType
    );

    applyRecommendationAction();

    toast.success(
      `已应用推荐: ${languageInfo?.label || recommendation.renderLanguage} - ${
        typeInfo?.label || recommendation.diagramType
      }`
    );
  }, [recommendation, applyRecommendationAction]);

  return {
    handleRecommend,
    applyRecommendation,
    isRecommending,
    recommendation,
  };
}
