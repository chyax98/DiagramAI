/**
 * 全局错误边界
 * 捕获运行时错误,防止应用崩溃
 */

"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

import { logger } from "@/lib/utils/logger";
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        {/* 错误图标 */}
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>

        {/* 标题 */}
        <h1 className="mb-3 text-3xl font-bold text-slate-900">应用遇到了问题</h1>

        {/* 错误信息 */}
        <p className="mb-2 text-slate-600">{error.message || "未知错误，请稍后重试"}</p>

        {/* 错误 ID（用于追踪） */}
        {error.digest && <p className="mb-6 text-sm text-slate-500">错误 ID: {error.digest}</p>}

        {/* 详细错误信息（仅开发环境） */}
        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
              查看技术详情
            </summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-800">
              {error.stack}
            </pre>
          </details>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 transition-colors hover:bg-primary/90"
          >
            <RefreshCcw className="h-4 w-4" />
            重新尝试
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Home className="h-4 w-4" />
            返回首页
          </button>
        </div>

        {/* 帮助信息 */}
        <p className="mt-6 text-sm text-slate-500">
          如果问题持续存在，请联系技术支持或
          <a
            href="https://github.com/chyax98/DiagramAI/issues"
            className="text-indigo-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            报告问题
          </a>
        </p>
      </div>
    </div>
  );
}
