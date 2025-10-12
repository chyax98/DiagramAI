/**
 * 主页面 - 图表编辑器工作台
 * 集成编辑器、预览和工具栏,通过Zustand管理状态
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "@/components/ui/toast";

// 禁用静态生成 - 此页面需要认证,不能预渲染
export const dynamic = "force-dynamic";

// Hooks
import { useDiagramStore } from "@/lib/stores/diagram-store";
import { useEditorActions } from "@/hooks/useEditorActions";

// Components
import { CodeEditor, DiagramPreview, InputPanel } from "@/components/editor";
import { AdjustModal, ExportModal } from "@/components/modals";
import { EditorHeader } from "@/components/layout";

// Types
import type { RenderLanguage } from "@/types/database";

import { logger } from "@/lib/utils/logger";

export default function HomePage() {
  // 从 Store 获取状态（精确订阅）
  const code = useDiagramStore((state) => state.code);
  const renderLanguage = useDiagramStore((state) => state.renderLanguage);
  const diagramType = useDiagramStore((state) => state.diagramType);
  const isGenerating = useDiagramStore((state) => state.isGenerating);
  const renderError = useDiagramStore((state) => state.renderError);

  // 从 Store 获取 actions
  const { setCode, setError, setSelection } = useDiagramStore();

  // 使用业务逻辑 Hook
  const {
    handleGenerate,
    handleLanguageChange,
    handleAdjust,
    handleFix,
    handleSave,
    handleNavigateModels,
    handleNavigateHistory,
  } = useEditorActions();

  // 模态框状态
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustInput, setAdjustInput] = useState("");
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // SVG 内容状态（用于本地导出）
  const [renderedSvg, setRenderedSvg] = useState<string>("");

  // 调整图表 - 打开模态框
  const handleAdjustClick = useCallback(() => {
    setAdjustInput("");
    setAdjustModalOpen(true);
  }, []);

  // 调整图表 - 应用调整
  const handleApplyAdjustment = useCallback(async () => {
    if (!adjustInput.trim()) return;

    await handleAdjust(adjustInput);
    setAdjustModalOpen(false);
    setAdjustInput("");
  }, [adjustInput, handleAdjust]);

  // 修复图表 - 点击处理
  const handleFixClick = useCallback(() => {
    if (renderError) {
      handleFix(renderError);
    }
  }, [renderError, handleFix]);

  // 导出图表 - 打开模态框
  const handleExportClick = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  useEffect(() => {
    const loadHistoryId = localStorage.getItem("loadHistoryId");
    if (!loadHistoryId) return;

    const loadHistory = async () => {
      try {
        // 检查是否已登录
        const token = localStorage.getItem("token");
        if (!token) {
          logger.warn("⚠️ 未登录，无法加载历史记录");
          localStorage.removeItem("loadHistoryId");
          return;
        }

        // 动态导入 apiClient（避免顶层导入导致的循环依赖）
        const { apiClient } = await import("@/lib/utils/api-client");

        const history = await apiClient.get<{
          render_language: RenderLanguage;
          diagram_type: string | null;
          model_id: number | null;
          generated_code: string;
        }>(`/api/history/${loadHistoryId}`);

        // 使用 setSelection 批量更新状态
        setSelection({
          renderLanguage: history.render_language,
          diagramType: history.diagram_type ?? undefined,
          modelId: history.model_id ?? undefined,
        });

        // 填充代码
        setCode(history.generated_code);

        // 清除标记
        localStorage.removeItem("loadHistoryId");
        toast.success("历史记录加载成功");
      } catch (error) {
        logger.error("Load history error:", error);
        toast.error("加载历史记录失败");
        // 清除标记，避免无限重试
        localStorage.removeItem("loadHistoryId");
      }
    };

    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDiagramError = useCallback(
    (error: string | null) => {
      setError(error);
    },
    [setError]
  );

  // 处理 SVG 渲染完成回调
  const handleSvgRendered = useCallback((svg: string) => {
    setRenderedSvg(svg);
    logger.info("✅ [HomePage] SVG 已缓存，可用于本地导出");
  }, []);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* 顶部工具栏 - 使用 EditorHeader 组件 */}
      <EditorHeader
        onLanguageChange={handleLanguageChange}
        onAdjustClick={handleAdjustClick}
        onFixClick={handleFixClick}
        onSaveClick={handleSave}
        onExportClick={handleExportClick}
        onModelsClick={handleNavigateModels}
        onHistoryClick={handleNavigateHistory}
      />

      {/* 主编辑区 */}
      <main className="flex flex-1 overflow-hidden">
        {/* 左侧：输入框 + 编辑器（40% 比例宽度 + 约束）*/}
        <div className="flex h-full w-2/5 min-w-[420px] max-w-[640px] flex-col border-r border-border bg-card">
          {/* 初始输入面板（顶部）*/}
          <InputPanel
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            disabled={false}
            diagramType={diagramType}
          />

          {/* 代码编辑器（剩余空间）*/}
          <CodeEditor
            code={code}
            onChange={setCode}
            language={renderLanguage}
            readOnly={isGenerating}
          />
        </div>

        {/* 右侧预览 flex-1 */}
        <DiagramPreview
          code={code}
          renderLanguage={renderLanguage}
          onError={handleDiagramError}
          onSvgRendered={handleSvgRendered}
        />
      </main>

      {/* 调整模态框 */}
      <AdjustModal
        isOpen={adjustModalOpen}
        adjustInput={adjustInput}
        onInputChange={setAdjustInput}
        onClose={() => setAdjustModalOpen(false)}
        onApply={handleApplyAdjustment}
        isLoading={isGenerating}
      />

      {/* 导出模态框 */}
      <ExportModal
        isOpen={exportModalOpen}
        code={code}
        renderLanguage={renderLanguage}
        svgContent={renderedSvg}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
