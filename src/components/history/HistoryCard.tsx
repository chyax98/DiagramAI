"use client";

import { useState } from "react";
import type { GenerationHistory } from "@/types/database";
import { RENDER_LANGUAGES, type RenderLanguage } from "@/lib/constants/diagram-types";
import { IconDownload, IconCopy, IconTrash, IconLoading } from "@/components/icons";
import { Clock } from "lucide-react";
import { copyTextToClipboard } from "@/lib/utils/clipboard";

import { logger } from "@/lib/utils/logger";
interface HistoryCardProps {
  history: GenerationHistory;
  onLoad: (historyId: number) => void;
  onDelete: (historyId: number) => void;
}

// 仅定义样式配置，label 从 RENDER_LANGUAGES 获取
const LANGUAGE_BADGE_STYLES: Record<RenderLanguage, string> = {
  mermaid: "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200",
  plantuml: "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200",
  d2: "bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-200",
  graphviz: "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200",
  wavedrom: "bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200",
  nomnoml: "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200",
  excalidraw: "bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-200",
  c4plantuml: "bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200",
  vegalite: "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200",
  dbml: "bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200",
};

export function HistoryCard({ history, onLoad, onDelete }: HistoryCardProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = async () => {
    try {
      setIsCopying(true);

      const success = await copyTextToClipboard(history.generated_code);

      if (success) {
        setTimeout(() => setIsCopying(false), 1500);
      } else {
        setIsCopying(false);
      }
    } catch (err) {
      logger.error("复制失败:", err);
      setIsCopying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除这条历史记录吗?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(history.id);
    } catch (err) {
      logger.error("删除失败:", err);
      setIsDeleting(false);
    }
  };

  const formatTime = (isoString: string) => {
    // 数据库存储的是 UTC 时间，需要标记为 UTC 后由浏览器自动转换为本地时区
    const utcString = isoString.endsWith("Z") ? isoString : isoString + "Z";
    const date = new Date(utcString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 从单一数据源获取 label
  const languageInfo = RENDER_LANGUAGES.find((lang) => lang.value === history.render_language);
  const badgeLabel = languageInfo?.label || history.render_language;
  const badgeClassName = LANGUAGE_BADGE_STYLES[history.render_language];

  const truncatedInput =
    history.input_text.length > 80
      ? history.input_text.substring(0, 80) + "..."
      : history.input_text;

  const codeLines = history.generated_code.split("\n").slice(0, 6);
  const truncatedCode =
    codeLines.join("\n") + (history.generated_code.split("\n").length > 6 ? "\n..." : "");

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-slate-900 line-clamp-2">{truncatedInput}</h3>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClassName}`}
        >
          {badgeLabel}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-xs text-slate-600 line-clamp-2">{history.input_text}</p>
      </div>

      <div className="mb-3 rounded bg-slate-50 p-2">
        <pre className="text-xs text-slate-700 overflow-x-auto">{truncatedCode}</pre>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          <span>{formatTime(history.created_at)}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onLoad(history.id)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="加载到编辑器"
          >
            <IconDownload className="w-3.5 h-3.5" />
            <span>加载</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={isCopying}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100"
            aria-label="复制代码"
          >
            {isCopying ? (
              <>
                <IconCopy className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600">已复制</span>
              </>
            ) : (
              <>
                <IconCopy className="w-3.5 h-3.5" />
                <span>复制</span>
              </>
            )}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100"
            aria-label="删除记录"
          >
            {isDeleting ? (
              <IconLoading className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <IconTrash className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
