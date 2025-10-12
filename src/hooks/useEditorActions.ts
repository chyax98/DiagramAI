/** 编辑器操作 - 图表生成/调整/修复/保存 */

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDiagramStore } from "@/lib/stores/diagram-store";
import { toast } from "@/components/ui/toast";
import { dialog } from "@/components/ui/dialog";
import { apiClient } from "@/lib/utils/api-client";
import type { RenderLanguage } from "@/types/database";

import { logger } from "@/lib/utils/logger";
export function useEditorActions() {
  const router = useRouter();

  const {
    code,
    renderLanguage,
    diagramType,
    selectedModelId,
    currentSessionId,
    setCode,
    setLanguageWithCascade,
    startGeneration,
    finishGeneration,
    setError,
    setSessionId,
  } = useDiagramStore();

  const handleGenerate = useCallback(
    async (inputText: string) => {
      if (!selectedModelId) {
        toast.error("请先在模型管理页面添加 AI 模型配置");
        return;
      }

      const currentState = useDiagramStore.getState();
      if (currentState.isGenerating) {
        return;
      }

      startGeneration();
      setCode("");

      try {
        const result = await apiClient.post<{ code: string; sessionId: number }>("/api/chat", {
          userMessage: inputText,
          renderLanguage,
          diagramType,
          modelId: selectedModelId,
          taskType: "generate", // ⭐ 显式指定：生成按钮
        });

        const { code: generatedCode, sessionId } = result;

        let currentCode = "";
        const chars = generatedCode.split("");
        const chunkSize = Math.max(1, Math.floor(chars.length / 20));

        for (let i = 0; i < chars.length; i += chunkSize) {
          const chunk = chars.slice(i, i + chunkSize).join("");
          currentCode += chunk;
          setCode(currentCode);
          await new Promise((resolve) => setTimeout(resolve, 30));
        }

        finishGeneration(generatedCode);
        setSessionId(sessionId);
        toast.success("图表生成成功！");
      } catch (error) {
        const message = error instanceof Error ? error.message : "未知错误";
        setError(message);
        toast.error(`生成失败：${message}`);
        // 保留原有代码,不清空
        finishGeneration(code);
      }
    },
    [
      selectedModelId,
      renderLanguage,
      diagramType,
      startGeneration,
      setCode,
      finishGeneration,
      setError,
      setSessionId,
    ]
  );

  const handleLanguageChange = useCallback(
    async (newLanguage: RenderLanguage) => {
      if (code.trim()) {
        const confirmed = await dialog.confirm({
          title: "切换语言",
          description: "切换语言将清空当前代码，是否继续？",
          confirmText: "确认",
          cancelText: "取消",
          variant: "destructive",
        });

        if (!confirmed) {
          return;
        }
        setCode("");
      }

      setLanguageWithCascade(newLanguage);
    },
    [code, setCode, setLanguageWithCascade]
  );

  const handleAdjust = useCallback(
    async (adjustInput: string) => {
      if (!adjustInput.trim()) return;

      const currentState = useDiagramStore.getState();
      if (currentState.isGenerating) {
        return;
      }

      startGeneration();

      try {
        // 使用统一的 /api/chat 接口
        const result = await apiClient.post<{
          code: string;
          sessionId: number;
          roundCount: number;
        }>("/api/chat", {
          sessionId: currentSessionId,
          userMessage: adjustInput,
          renderLanguage: renderLanguage,
          modelId: selectedModelId,
          taskType: "adjust", // ⭐ 显式指定：调整按钮
        });

        const { code: newCode, sessionId } = result;
        finishGeneration(newCode);
        setSessionId(sessionId);
        toast.success("图表调整成功！");
      } catch (error) {
        const message = error instanceof Error ? error.message : "未知错误";
        setError(message);
        toast.error(`调整失败：${message}`);
      }
    },
    [
      renderLanguage,
      selectedModelId,
      currentSessionId,
      startGeneration,
      finishGeneration,
      setError,
      setSessionId,
    ]
  );

  /**
   * 修复渲染错误
   *
   * 设计理由：
   * 1. 依赖任务标记 <<<SYSTEM_INSTRUCTION: FIX_SYNTAX_ERRORS_ONLY>>> 指导 AI 行为
   * 2. L1 prompt 中已详细说明修复任务的执行策略和禁止项
   * 3. 用户消息只需提供错误信息，避免冗余指令（减少 token 消耗）
   *
   * @param renderError - Kroki 渲染器返回的错误信息
   *
   * @example
   * // Kroki 返回错误: "Syntax error: invalid node ID '开始'"
   * handleFix("Syntax error: invalid node ID '开始'")
   * // AI 收到的完整消息：
   * // <<<SYSTEM_INSTRUCTION: FIX_SYNTAX_ERRORS_ONLY>>>
   * // 渲染错误：Syntax error: invalid node ID '开始'
   */
  const handleFix = useCallback(
    async (renderError: string) => {
      if (!renderError) return;

      const currentState = useDiagramStore.getState();
      if (currentState.isGenerating) {
        return;
      }

      // ✅ 简化消息：只提供错误信息，依赖任务标记 + L1 prompt 指导行为
      const fixMessage = `渲染错误：${renderError}`;

      startGeneration();

      try {
        const result = await apiClient.post<{ code: string; sessionId: number }>("/api/chat", {
          sessionId: currentSessionId,
          userMessage: fixMessage, // ✅ 简化后的修复消息（节省 ~100 tokens）
          renderLanguage: renderLanguage,
          modelId: selectedModelId,
          taskType: "fix", // ⭐ 显式指定：修复按钮（会注入任务标记）
          renderError: renderError, // ⭐ 传递渲染错误，用于自动记录失败日志
        });

        const { code: fixedCode, sessionId } = result;
        finishGeneration(fixedCode);
        setSessionId(sessionId);
        setError(null);
        toast.success("图表修复成功！");
      } catch (error) {
        const message = error instanceof Error ? error.message : "未知错误";
        setError(message);
        toast.error(`修复失败：${message}`);
      }
    },
    [
      renderLanguage,
      selectedModelId,
      currentSessionId,
      startGeneration,
      finishGeneration,
      setError,
      setSessionId,
    ]
  );

  const handleSave = useCallback(async () => {
    if (!code || !code.trim()) {
      toast.error("图表代码不能为空，请先生成或编辑图表内容");
      return;
    }

    try {
      await apiClient.post("/api/history", {
        inputText: "手动编辑",
        renderLanguage: renderLanguage,
        diagramType,
        generatedCode: code,
        modelId: selectedModelId,
      });

      toast.success("保存成功！", { duration: 3000 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      logger.error("❌ 保存失败:", error);
      toast.error(message);
    }
  }, [code, renderLanguage, diagramType, selectedModelId]);

  const handleNavigateModels = useCallback(() => {
    router.push("/models");
  }, [router]);

  const handleNavigateHistory = useCallback(() => {
    router.push("/history");
  }, [router]);

  return {
    handleGenerate,
    handleLanguageChange,
    handleAdjust,
    handleFix,
    handleSave,
    handleNavigateModels,
    handleNavigateHistory,
  };
}
