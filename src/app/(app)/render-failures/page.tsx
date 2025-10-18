/**
 * 渲染失败日志页面
 *
 * 功能:
 * - 展示渲染失败的日志列表
 * - 用于分析和优化 AI Prompt
 * - 支持查看详细的失败信息
 */

"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout";
import type { RenderFailureLog } from "@/types/prompt";
import { toast } from "@/components/ui/toast";

export default function RenderFailuresPage() {
  const [logs, setLogs] = useState<RenderFailureLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/render-failures?limit=50");

      if (!response.ok) {
        throw new Error("获取失败日志失败");
      }

      const result = await response.json();

      if (result.success) {
        setLogs(result.data.logs);
        setTotal(result.data.total);
      } else {
        throw new Error(result.message || "获取失败日志失败");
      }
    } catch (error) {
      console.error("获取失败日志失败:", error);
      toast.error(error instanceof Error ? error.message : "获取失败日志失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这条失败日志吗?")) {
      return;
    }

    try {
      const response = await fetch(`/api/render-failures/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("删除失败");
      }

      toast.success("删除成功");
      fetchLogs(); // 重新加载列表
    } catch (error) {
      console.error("删除失败:", error);
      toast.error(error instanceof Error ? error.message : "删除失败");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">渲染失败日志</h1>
          <p className="text-muted-foreground">共 {total} 条失败记录,用于分析和优化 AI Prompt</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground">暂无失败日志</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {log.render_language}
                      </span>
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                        {log.diagram_type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString("zh-CN")}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">用户输入: {log.user_input}</p>
                    <p className="text-sm text-destructive">错误: {log.error_message}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    删除
                  </button>
                </div>

                <div className="bg-muted/50 rounded p-3 mt-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    AI 模型: {log.ai_provider} / {log.ai_model}
                  </p>
                  <details className="mt-2">
                    <summary className="text-xs text-primary cursor-pointer hover:underline">
                      查看生成代码
                    </summary>
                    <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto max-h-64">
                      {log.generated_code}
                    </pre>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
