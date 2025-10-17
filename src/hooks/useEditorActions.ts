/**
 * 编辑器操作 Hook - UI 交互层
 *
 * 职责：
 * - 调用 DiagramEditorService 处理业务逻辑
 * - 管理 UI 状态 (loading、error)
 * - 显示用户提示 (toast、dialog)
 * - 处理路由导航
 * - 实现打字机效果
 *
 * 不包含：
 * - 业务逻辑 (已迁移到 Service 层)
 * - API 调用 (已迁移到 Service 层)
 */

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDiagramStore } from "@/lib/stores/diagram-store";
import { toast } from "@/components/ui/toast";
import { dialog } from "@/components/ui/dialog";
import { diagramEditorService } from "@/lib/services/DiagramEditorService";
import type { RenderLanguage } from "@/types/database";

// ========== 工具函数 ==========

/**
 * 打字机效果 - 逐字符显示代码
 *
 * @param code - 完整代码
 * @param setCode - 设置代码的函数
 */
async function _typewriterEffect(code: string, setCode: (code: string) => void): Promise<void> {
  let currentCode = "";
  const chars = code.split("");
  const chunkSize = Math.max(1, Math.floor(chars.length / 20));

  for (let i = 0; i < chars.length; i += chunkSize) {
    const chunk = chars.slice(i, i + chunkSize).join("");
    currentCode += chunk;
    setCode(currentCode);
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}

// ========== 类型定义 ==========

/**
 * useEditorActions Hook 返回类型
 */
export interface EditorActions {
  /** 生成新图表 */
  handleGenerate: (inputText: string) => Promise<void>;
  /** 切换渲染语言 */
  handleLanguageChange: (newLanguage: RenderLanguage) => Promise<void>;
  /** 调整现有图表 */
  handleAdjust: (adjustInput: string) => Promise<void>;
  /** 修复渲染错误 */
  handleFix: (renderError: string) => Promise<void>;
  /** 保存图表到历史记录 */
  handleSave: () => Promise<void>;
  /** 导航到模型配置页面 */
  handleNavigateModels: () => void;
  /** 导航到历史记录页面 */
  handleNavigateHistory: () => void;
}

// ========== Hook ==========

export function useEditorActions(): EditorActions {
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

  /**
   * 生成新图表
   *
   * UI 逻辑：
   * - 验证模型配置
   * - 启动 loading 状态
   * - 清空当前代码
   * - 实现打字机效果
   * - 显示成功/失败提示
   */
  const handleGenerate = useCallback(
    async (inputText: string) => {
      // 1. UI 验证
      if (!selectedModelId) {
        toast.error("请先在模型管理页面添加 AI 模型配置");
        return;
      }

      const currentState = useDiagramStore.getState();
      if (currentState.isGenerating) {
        return;
      }

      // 2. 启动 loading
      startGeneration();
      setCode("");

      try {
        // 3. 调用业务逻辑层
        const { code: generatedCode, sessionId } = await diagramEditorService.generate({
          input: inputText,
          renderLanguage,
          diagramType,
          modelId: selectedModelId,
        });

        // 4. 打字机效果
        await _typewriterEffect(generatedCode, setCode);

        // 5. 更新状态
        finishGeneration(generatedCode);
        setSessionId(sessionId);

        // 6. 成功提示
        toast.success("图表生成成功！");
      } catch (error) {
        // 7. 错误处理
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
      code,
      startGeneration,
      setCode,
      finishGeneration,
      setError,
      setSessionId,
    ]
  );

  /**
   * 切换渲染语言
   *
   * UI 逻辑：
   * - 如果有代码，弹出确认对话框
   * - 清空当前代码
   * - 切换语言并级联更新图表类型
   */
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

  /**
   * 调整现有图表
   *
   * UI 逻辑：
   * - 验证输入不为空
   * - 启动 loading 状态
   * - 直接更新代码（不使用打字机效果）
   * - 显示成功/失败提示
   */
  const handleAdjust = useCallback(
    async (adjustInput: string) => {
      // 1. UI 验证
      if (!adjustInput.trim()) return;

      if (!selectedModelId) {
        toast.error("请先在模型管理页面添加 AI 模型配置");
        return;
      }

      const currentState = useDiagramStore.getState();
      if (currentState.isGenerating) {
        return;
      }

      // 2. 启动 loading
      startGeneration();

      try {
        // 3. 调用业务逻辑层
        const { code: newCode, sessionId } = await diagramEditorService.adjust({
          input: adjustInput,
          sessionId: currentSessionId,
          renderLanguage,
          modelId: selectedModelId,
        });

        // 4. 更新状态（调整不使用打字机效果，直接更新）
        finishGeneration(newCode);
        setSessionId(sessionId);

        // 5. 成功提示
        toast.success("图表调整成功！");
      } catch (error) {
        // 6. 错误处理
        const message = error instanceof Error ? error.message : "未知错误";
        setError(message);
        toast.error(`调整失败：${message}`);
      }
    },
    [
      selectedModelId,
      renderLanguage,
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
   * UI 逻辑：
   * - 验证错误信息不为空
   * - 启动 loading 状态
   * - 直接更新代码（不使用打字机效果）
   * - 清除错误状态
   * - 显示成功/失败提示
   */
  const handleFix = useCallback(
    async (renderError: string) => {
      // 1. UI 验证
      if (!renderError) return;

      if (!selectedModelId) {
        toast.error("请先在模型管理页面添加 AI 模型配置");
        return;
      }

      const currentState = useDiagramStore.getState();
      if (currentState.isGenerating) {
        return;
      }

      // 2. 启动 loading
      startGeneration();

      try {
        // 3. 调用业务逻辑层
        const { code: fixedCode, sessionId } = await diagramEditorService.fix({
          renderError,
          sessionId: currentSessionId,
          renderLanguage,
          modelId: selectedModelId,
        });

        // 4. 更新状态（修复不使用打字机效果，直接更新）
        finishGeneration(fixedCode);
        setSessionId(sessionId);
        setError(null); // 清除错误状态

        // 5. 成功提示
        toast.success("图表修复成功！");
      } catch (error) {
        // 6. 错误处理
        const message = error instanceof Error ? error.message : "未知错误";
        setError(message);
        toast.error(`修复失败：${message}`);
      }
    },
    [
      selectedModelId,
      renderLanguage,
      currentSessionId,
      startGeneration,
      finishGeneration,
      setError,
      setSessionId,
    ]
  );

  /**
   * 保存图表到历史记录
   *
   * UI 逻辑：
   * - 验证代码不为空
   * - 显示成功/失败提示
   */
  const handleSave = useCallback(async () => {
    // 1. UI 验证
    if (!code || !code.trim()) {
      toast.error("图表代码不能为空，请先生成或编辑图表内容");
      return;
    }

    try {
      // 2. 调用业务逻辑层
      await diagramEditorService.save({
        code,
        renderLanguage,
        diagramType,
        modelId: selectedModelId ?? undefined, // null 转换为 undefined
      });

      // 3. 成功提示
      toast.success("保存成功！", { duration: 3000 });
    } catch (error) {
      // 4. 错误处理
      const message = error instanceof Error ? error.message : "未知错误";
      toast.error(`保存失败：${message}`);
    }
  }, [code, renderLanguage, diagramType, selectedModelId]);

  /**
   * 导航到模型配置页面
   */
  const handleNavigateModels = useCallback(() => {
    router.push("/models");
  }, [router]);

  /**
   * 导航到历史记录页面
   */
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
