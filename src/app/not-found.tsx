/**
 * 404 页面
 * 当访问不存在的路由时显示
 */

"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

// 禁用静态生成
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="max-w-md text-center">
        {/* 404 图标 */}
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-slate-300 dark:text-slate-700">404</h1>
        </div>

        {/* 标题 */}
        <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-slate-100">页面未找到</h2>

        {/* 描述 */}
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          抱歉，您访问的页面不存在或已被移除
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            返回首页
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            返回上一页
          </button>
        </div>
      </div>
    </div>
  );
}
