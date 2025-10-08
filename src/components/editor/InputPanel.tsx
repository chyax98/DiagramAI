/** 需求输入面板 - 多行输入框+生成按钮,支持动态Placeholder和状态提示 */

"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlaceholder } from "@/lib/constants/placeholders";
import type { DiagramType } from "@/lib/constants/diagram-types";
import { MAX_INPUT_TEXT_LENGTH } from "@/lib/constants/env";

interface InputPanelProps {
  onGenerate: (inputText: string) => Promise<void>;
  isGenerating: boolean;
  disabled?: boolean;
  diagramType?: DiagramType;
}

export function InputPanel({ onGenerate, isGenerating, disabled, diagramType }: InputPanelProps) {
  const [inputText, setInputText] = useState("");

  const handleGenerate = async () => {
    if (!inputText.trim() || isGenerating) return;

    await onGenerate(inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b border-border bg-gradient-to-b from-card/95 to-card p-6 backdrop-blur-sm">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300" />

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder(diagramType)}
          disabled={isGenerating || disabled}
          className="relative w-full resize-none rounded-xl border border-input
                   bg-background backdrop-blur-sm
                   px-5 py-4 text-sm leading-relaxed text-foreground
                   placeholder:text-muted-foreground
                   transition-all duration-200
                   focus:border-ring
                   focus:outline-none focus:ring-2 focus:ring-ring/20
                   disabled:cursor-not-allowed disabled:opacity-50
                   shadow-lg"
          rows={6}
        />

        <div className="absolute bottom-3 right-3 text-xs font-medium text-muted-foreground bg-muted/80 px-2 py-1 rounded-md backdrop-blur-sm">
          {inputText.length}
          <span className="opacity-60"> / {MAX_INPUT_TEXT_LENGTH.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isGenerating ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 dark:border-indigo-400/20 rounded-lg animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400 dark:text-indigo-300" />
              <span className="text-sm font-medium text-indigo-300 dark:text-indigo-200">
                AI 生成中...
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

        <Button
          onClick={handleGenerate}
          disabled={!inputText.trim() || isGenerating || disabled}
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
  );
}
