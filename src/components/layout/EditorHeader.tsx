/** 编辑器工具栏 - 集成选择器/操作按钮/导航,直接从Zustand获取状态减少props传递 */

"use client";

import { Wand2, Wrench, Save, Download, Settings, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDiagramStore } from "@/lib/stores/diagram-store";
import {
  AIModelSelector,
  RenderLanguageSelector,
  DiagramTypeSelector,
} from "@/components/selectors";
import { Logo, UserMenu } from "@/components/shared";
import type { RenderLanguage } from "@/types/database";

interface EditorHeaderProps {
  onLanguageChange: (language: RenderLanguage) => void;
  onAdjustClick: () => void;
  onFixClick: () => void;
  onSaveClick: () => void;
  onExportClick: () => void;
  onModelsClick: () => void;
  onHistoryClick: () => void;
}

export function EditorHeader({
  onLanguageChange,
  onAdjustClick,
  onFixClick,
  onSaveClick,
  onExportClick,
  onModelsClick,
  onHistoryClick,
}: EditorHeaderProps) {
  const selectedModelId = useDiagramStore((state) => state.selectedModelId);
  const renderLanguage = useDiagramStore((state) => state.renderLanguage);
  const diagramType = useDiagramStore((state) => state.diagramType);
  const renderError = useDiagramStore((state) => state.renderError);
  const code = useDiagramStore((state) => state.code);

  const { setModel, setDiagramType } = useDiagramStore();

  const isSaveDisabled = !code || !code.trim();

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-6">
      <Logo />
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <AIModelSelector value={selectedModelId} onChange={setModel} />
        <RenderLanguageSelector value={renderLanguage} onChange={onLanguageChange} />
        <DiagramTypeSelector
          renderLanguage={renderLanguage}
          value={diagramType}
          onChange={setDiagramType}
        />
      </div>
      <div className="flex-1" />
      <Button variant="ghost" size="sm" onClick={onAdjustClick}>
        <Wand2 className="mr-1.5 h-4 w-4" />
        调整
      </Button>
      <Button variant="ghost" size="sm" onClick={onFixClick} disabled={!renderError}>
        <Wrench className="mr-1.5 h-4 w-4" />
        修复
      </Button>
      <Button variant="ghost" size="sm" onClick={onSaveClick} disabled={isSaveDisabled}>
        <Save className="mr-1.5 h-4 w-4" />
        保存
      </Button>
      <Button variant="ghost" size="sm" onClick={onExportClick}>
        <Download className="mr-1.5 h-4 w-4" />
        导出
      </Button>
      <Button variant="ghost" size="sm" onClick={onModelsClick}>
        <Settings className="mr-1.5 h-4 w-4" />
        模型管理
      </Button>
      <Button variant="ghost" size="sm" onClick={onHistoryClick}>
        <History className="mr-1.5 h-4 w-4" />
        历史记录
      </Button>
      <UserMenu />
    </header>
  );
}
