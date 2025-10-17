"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { GenerationHistory, RenderLanguage } from "@/types/database";

// 禁用静态生成 - 此页面需要认证,不能预渲染
export const dynamic = "force-dynamic";
import { HistoryCard } from "@/components/history/HistoryCard";
import { SkeletonCard } from "@/components/shared";
import { apiClient } from "@/lib/utils/api-client";
import { dialog } from "@/components/ui/dialog/dialog";
import { RENDER_LANGUAGES } from "@/lib/constants/diagram-types";

import { logger } from "@/lib/utils/logger";

// eslint-disable-next-line max-lines-per-function -- 页面组件包含完整的 UI 逻辑,拆分会降低可读性
export default function HistoryPage() {
  const router = useRouter();
  const [histories, setHistories] = useState<GenerationHistory[]>([]);
  const [filteredHistories, setFilteredHistories] = useState<GenerationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 分页状态 - 分开存储避免不必要的重新渲染
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // 每页 12 条（3x4 网格）- 固定值
  const [total, setTotal] = useState(0);

  // 筛选和排序状态
  const [searchText, setSearchText] = useState("");
  const [languageFilter, setLanguageFilter] = useState<RenderLanguage | "all">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // 获取历史记录（带分页）
  const fetchHistories = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.get<{
        histories: GenerationHistory[];
        total: number;
      }>(`/api/history?page=${page}&limit=${limit}&language=${languageFilter}&sort=${sortOrder}`);

      setHistories(data.histories || []);
      setTotal(data.total || 0);
    } catch (err) {
      logger.error("获取历史记录失败:", err);
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, languageFilter, sortOrder]);

  // 应用前端搜索过滤（实时）
  useEffect(() => {
    let filtered = [...histories];

    // 搜索过滤（前端实时搜索）
    if (searchText) {
      filtered = filtered.filter((h) =>
        h.input_text.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredHistories(filtered);
  }, [histories, searchText]);

  // 加载历史记录到编辑器
  const handleLoad = (historyId: number) => {
    // 使用 localStorage 传递 historyId 到主页面
    localStorage.setItem("loadHistoryId", String(historyId));
    router.push("/");
  };

  // 删除历史记录
  const handleDelete = async (historyId: number) => {
    const confirmed = await dialog.confirm({
      title: "删除历史记录",
      description: "确定要删除这条历史记录吗？此操作不可恢复。",
      confirmText: "删除",
      cancelText: "取消",
      variant: "destructive",
    });

    if (!confirmed) {
      return;
    }

    try {
      await apiClient.delete(`/api/history/${historyId}`);

      // 从列表中移除
      setHistories((prev) => prev.filter((h) => h.id !== historyId));
    } catch (err) {
      logger.error("删除历史记录失败:", err);
      await dialog.alert("删除失败", "删除失败，请重试");
    }
  };

  // 导出全部历史记录
  const handleExportAll = () => {
    const exportData = JSON.stringify(filteredHistories, null, 2);
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `history-export-${new Date().toISOString()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // 清空全部历史记录
  const handleClearAll = async () => {
    const confirmed = await dialog.confirm({
      title: "清空所有历史记录",
      description: "确定要清空所有历史记录吗？此操作不可恢复！",
      confirmText: "清空",
      cancelText: "取消",
      variant: "destructive",
    });

    if (!confirmed) {
      return;
    }

    try {
      await apiClient.delete("/api/history");

      setHistories([]);
    } catch (err) {
      logger.error("清空历史记录失败:", err);
      await dialog.alert("清空失败", "清空失败，请重试");
    }
  };

  // 骨架屏加载状态
  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="h-10 w-64 animate-pulse rounded-md bg-slate-200" />
            <div className="h-10 w-32 animate-pulse rounded-md bg-slate-200" />
            <div className="h-10 w-32 animate-pulse rounded-md bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG 图标,无需优化 */}
          <img
            src="/icons/alert-circle.svg"
            alt="错误"
            className="mx-auto h-12 w-12 text-red-500"
          />
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* 页面标题 */}
        <div className="mb-6">
          {/* 返回按钮 */}
          <button
            onClick={() => router.push("/")}
            className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">返回主页</span>
          </button>

          <h1 className="text-2xl font-bold text-slate-900">历史记录</h1>
          <p className="mt-1 text-sm text-slate-600">共 {filteredHistories.length} 条记录</p>
        </div>

        {/* 控制栏 */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          {/* 刷新按钮 */}
          <button
            onClick={() => fetchHistories()}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg
                     hover:bg-slate-200 transition-colors duration-200
                     flex items-center gap-2 shadow-sm disabled:opacity-50"
            title="刷新列表"
          >
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">刷新</span>
          </button>

          {/* 搜索框 */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索历史记录..."
            className="flex-1 min-w-[200px] rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* 语言筛选 */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value as RenderLanguage | "all")}
            className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">所有语言</option>
            {RENDER_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* 排序 */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">最新优先</option>
            <option value="oldest">最旧优先</option>
          </select>

          {/* 批量操作 */}
          <div className="flex gap-2">
            <button
              onClick={handleExportAll}
              disabled={filteredHistories.length === 0}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              导出全部
            </button>
            <button
              onClick={handleClearAll}
              disabled={histories.length === 0}
              className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              清空全部
            </button>
          </div>
        </div>

        {/* 历史记录网格 */}
        {filteredHistories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHistories.map((history) => (
              <HistoryCard
                key={history.id}
                history={history}
                onLoad={handleLoad}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white">
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG 图标,无需优化 */}
              <img src="/icons/inbox.svg" alt="空白" className="mx-auto h-16 w-16 opacity-40" />
              <p className="mt-4 text-lg font-medium text-slate-900">暂无历史记录</p>
              <p className="mt-2 text-sm text-slate-600">
                {searchText || languageFilter !== "all"
                  ? "没有符合筛选条件的记录"
                  : "生成图表后会自动保存到这里"}
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-6 inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                创建图表
              </button>
            </div>
          </div>
        )}

        {/* 分页控制 */}
        {total > limit && (
          <div className="mt-8 space-y-4">
            {/* 页码按钮 */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                上一页
              </button>

              {/* 页码列表 */}
              <div className="flex items-center gap-2">
                {(() => {
                  const totalPages = Math.ceil(total / limit);

                  // 显示策略：始终显示首页、末页、当前页及其相邻页
                  const showPages = [1];

                  if (totalPages <= 7) {
                    // 页数少于7页，显示全部
                    for (let i = 2; i <= totalPages; i++) {
                      showPages.push(i);
                    }
                  } else {
                    // 显示当前页附近的页码
                    const start = Math.max(2, page - 1);
                    const end = Math.min(totalPages - 1, page + 1);

                    if (start > 2) showPages.push(-1); // 省略号

                    for (let i = start; i <= end; i++) {
                      showPages.push(i);
                    }

                    if (end < totalPages - 1) showPages.push(-2); // 省略号
                    if (totalPages > 1) showPages.push(totalPages);
                  }

                  return showPages.map((pageNum, idx) => {
                    if (pageNum < 0) {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2 text-slate-500">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        disabled={loading}
                        className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                          page === pageNum
                            ? "bg-primary text-primary-foreground"
                            : "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {pageNum}
                      </button>
                    );
                  });
                })()}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(Math.ceil(total / limit), p + 1))}
                disabled={page >= Math.ceil(total / limit)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                下一页
              </button>
            </div>

            {/* 分页信息 */}
            <div className="text-center text-sm text-slate-600">
              共 {total} 条记录，第 {page} / {Math.ceil(total / limit)} 页
              {loading && <span className="ml-2 text-indigo-600">加载中...</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
