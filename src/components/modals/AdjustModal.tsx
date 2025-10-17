/** 调整图表模态框 - 允许用户输入调整需求 */

"use client";

import { useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MAX_INPUT_TEXT_LENGTH } from "@/lib/constants/env";

interface AdjustModalProps {
  isOpen: boolean;
  adjustInput: string;
  onInputChange: (text: string) => void;
  onClose: () => void;
  onApply: () => void;
  isLoading?: boolean;
}

const PLACEHOLDER_TEXT = `调整示例（功能性修改）：
- 将"用户注册"节点改为"新用户注册"
- 在"验证信息"和"创建账户"之间添加"发送验证码"步骤
- 调整流程图布局方向（从左到右 → 从上到下）
- 修改连接线样式（实线 → 虚线）
- 添加新的分支逻辑或条件判断

请描述您想要的调整内容，AI 将基于当前代码进行精确修改。

⚠️ 注意：如果只是修复语法错误（如节点 ID 非法、缺少符号），
请关闭此对话框，使用工具栏的"修复"按钮。`;

export function AdjustModal({
  isOpen,
  adjustInput,
  onInputChange,
  onClose,
  onApply,
  isLoading = false,
}: AdjustModalProps) {
  const isDisabled = !adjustInput.trim() || isLoading;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !isDisabled) {
        e.preventDefault();
        onApply();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDisabled, onApply]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl animate-in fade-in-0 zoom-in-95 rounded-lg bg-card border border-border p-6 shadow-2xl duration-200">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">调整图表（功能修改）</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              描述您想要调整的内容，AI 将修改图表的<strong>内容、结构或样式</strong>。
            </p>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              💡 如果只是修复语法错误，请使用工具栏的&ldquo;修复&rdquo;按钮
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-6">
          <label htmlFor="adjust-input" className="mb-2 block text-sm font-medium text-foreground">
            调整需求
          </label>
          <Textarea
            id="adjust-input"
            value={adjustInput}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={PLACEHOLDER_TEXT}
            className="min-h-[280px] resize-none text-sm"
            maxLength={MAX_INPUT_TEXT_LENGTH}
            disabled={isLoading}
          />
          <div className="mt-2 text-right text-xs text-muted-foreground">
            {adjustInput.length} / {MAX_INPUT_TEXT_LENGTH.toLocaleString()} 字符
          </div>
        </div>

        <div className="flex items-center justify-between">
          {!isLoading && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-indigo-500/50 dark:text-indigo-400/50" />
              <span>提示:按</span>
              <kbd className="inline-flex items-center gap-1 rounded bg-muted border border-input px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground shadow-sm">
                Ctrl/Cmd + Enter
              </kbd>
              <span>快速提交</span>
            </div>
          )}

          <div className="flex gap-3 ml-auto">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              取消
            </Button>

            <Button onClick={onApply} disabled={isDisabled} variant="gradient">
              {isLoading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  调整中...
                </>
              ) : (
                "应用调整"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
