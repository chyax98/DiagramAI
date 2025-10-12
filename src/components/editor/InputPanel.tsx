/** 需求输入面板 - 多行输入框+生成按钮,支持动态Placeholder和状态提示 */

"use client";

import { useState } from "react";
import { Sparkles, Loader2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getPlaceholder } from "@/lib/constants/placeholders";
import type { DiagramType, RenderLanguage } from "@/lib/constants/diagram-types";
import { MAX_INPUT_TEXT_LENGTH } from "@/lib/constants/env";
import { useRecommendation } from "@/hooks/useRecommendation";
import { RecommendationCard } from "@/components/RecommendationCard";
import { useDiagramStore } from "@/lib/stores/diagram-store";

interface InputPanelProps {
  onGenerate: (inputText: string) => Promise<void>;
  isGenerating: boolean;
  disabled?: boolean;
  renderLanguage?: RenderLanguage;
  diagramType?: DiagramType;
}

export function InputPanel({
  onGenerate,
  isGenerating,
  disabled,
  renderLanguage,
  diagramType,
}: InputPanelProps) {
  const [inputText, setInputText] = useState("");
  const { handleRecommend, applyRecommendation, isRecommending, recommendation } =
    useRecommendation();

  const handleGenerate = async () => {
    if (!inputText.trim() || isGenerating) return;

    await onGenerate(inputText.trim());
    // 保留输入内容,方便用户基于当前需求迭代优化
  };

  const handleRecommendClick = async () => {
    if (!inputText.trim() || isRecommending) return;
    await handleRecommend(inputText.trim());
  };

  const handleApplyRecommendation = () => {
    applyRecommendation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="relative flex flex-col gap-4 border-b border-border bg-gradient-to-b from-card/95 to-card p-6 backdrop-blur-sm">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300" />

        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder(renderLanguage, diagramType)}
          disabled={isGenerating || disabled}
          className="relative w-full resize-none rounded-xl
                   backdrop-blur-sm
                   px-5 py-4 text-sm leading-relaxed
                   shadow-lg"
          rows={6}
        />

        <div className="absolute bottom-3 right-3 text-xs font-medium text-muted-foreground bg-muted/80 px-2 py-1 rounded-md backdrop-blur-sm">
          {inputText.length}
          <span className="opacity-60"> / {MAX_INPUT_TEXT_LENGTH.toLocaleString()}</span>
        </div>
      </div>

      {/* 推荐卡片 - 移到外层避免被 overflow 裁剪 */}
      {recommendation && (
        <div className="relative -mt-2">
          <RecommendationCard
            recommendation={recommendation}
            onApply={handleApplyRecommendation}
            onClose={() => {
              // 关闭时清除推荐
              const { setRecommendation } = useDiagramStore.getState();
              setRecommendation(null);
            }}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isGenerating || isRecommending ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 dark:border-indigo-400/20 rounded-lg animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400 dark:text-indigo-300" />
              <span className="text-sm font-medium text-indigo-300 dark:text-indigo-200">
                {isGenerating ? "AI 生成中..." : "AI 分析中..."}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-indigo-500/50 dark:text-indigo-400/50" />
              <span>提示:按</span>
              <kbd className="inline-flex items-center gap-1 rounded bg-muted border border-input px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground shadow-sm">
                Ctrl/Cmd + Enter
              </kbd>
              <span>快速生成</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 智能推荐按钮 */}
          <Button
            onClick={handleRecommendClick}
            disabled={!inputText.trim() || isRecommending || isGenerating || disabled}
            variant="outline"
            size="sm"
          >
            {isRecommending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-medium">分析中</span>
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4" />
                <span className="font-medium">智能推荐</span>
              </>
            )}
          </Button>

          {/* 生成图表按钮 */}
          <Button
            onClick={handleGenerate}
            disabled={!inputText.trim() || isGenerating || isRecommending || disabled}
            variant="gradient"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-medium">生成中</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">生成图表</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
