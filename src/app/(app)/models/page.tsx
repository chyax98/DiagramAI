"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ModelDialog } from "@/components/models/ModelDialog";
import { TestConnectionButton } from "@/components/models/TestConnectionButton";
import { apiClient } from "@/lib/utils/api-client";
import { dialog } from "@/components/ui/dialog/dialog";
import { ProviderIcon } from "@/components/icons";

interface AIModel {
  id: number;
  name: string;
  provider: "openai" | "anthropic" | "gemini" | "openai-compatible";
  api_endpoint: string;
  model_id: string;
  created_at: string;
}

export default function ModelsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 对话框状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModel | undefined>(undefined);

  // 获取 Provider 显示名称
  const getProviderName = (provider: string): string => {
    const providerNames: Record<string, string> = {
      openai: "OpenAI",
      anthropic: "Anthropic Claude",
      gemini: "Google Gemini",
      "openai-compatible": "OpenAI Compatible",
    };
    return providerNames[provider] || provider;
  };

  // 获取 Provider 颜色主题
  const getProviderColor = (provider: string): string => {
    const colors: Record<string, string> = {
      openai: "text-green-600",
      anthropic: "text-orange-600",
      gemini: "text-blue-600",
      "openai-compatible": "text-indigo-600",
    };
    return colors[provider] || "text-gray-600";
  };

  // 加载模型列表
  const fetchModels = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 使用统一 API 客户端 (自动添加 Authorization header)
      const result = await apiClient.get<{ models: AIModel[] }>("/api/models");
      setModels(result.models || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载模型列表失败");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchModels();
  }, [user, authLoading, router]);

  // 打开添加模型对话框
  const handleAddModel = () => {
    setEditingModel(undefined); // 清空编辑模型
    setIsDialogOpen(true);
  };

  // 打开编辑模型对话框
  const handleEditModel = (model: AIModel) => {
    setEditingModel(model);
    setIsDialogOpen(true);
  };

  // 对话框成功后的回调 (刷新列表)
  // Bug 2 修复: 返回 Promise 以便 ModelDialog 可以等待刷新完成
  const handleDialogSuccess = async () => {
    await fetchModels(); // 等待刷新完成
  };

  // 删除模型
  const handleDelete = async (modelId: number, modelName: string) => {
    const confirmed = await dialog.confirm({
      title: "删除模型",
      description: `确定要删除模型 "${modelName}" 吗？此操作不可恢复。`,
      confirmText: "删除",
      cancelText: "取消",
      variant: "destructive",
    });

    if (!confirmed) {
      return;
    }

    try {
      // 使用统一 API 客户端 (自动添加 Authorization header)
      await apiClient.delete(`/api/models/${modelId}`);

      // 刷新列表
      setModels(models.filter((m) => m.id !== modelId));
    } catch (err) {
      await dialog.alert("删除失败", err instanceof Error ? err.message : "删除失败，请重试");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-lg text-slate-700">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 页面头部 */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">AI 模型管理</h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                管理您的 AI 模型配置,支持 OpenAI、Gemini、Claude、OpenAI-Compatible 类型
              </p>
            </div>
            <button
              onClick={handleAddModel}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg
                       hover:bg-primary/90 transition-colors duration-200
                       flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">添加模型</span>
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {models.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-indigo-50">
                <ProviderIcon provider="openai-compatible" className="w-16 h-16 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">暂无 AI 模型</h3>
            <p className="text-slate-600 mb-6">添加您的第一个 AI 模型配置以开始使用</p>
            <button
              onClick={handleAddModel}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg
                       hover:bg-primary/90 transition-colors duration-200"
            >
              添加第一个模型
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <div
                key={model.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg
                         transition-shadow duration-200 p-6"
              >
                {/* 模型头部 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-slate-50 ${getProviderColor(model.provider)}`}
                    >
                      <ProviderIcon provider={model.provider} className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{model.name}</h3>
                      <p className="text-sm text-slate-500">{getProviderName(model.provider)}</p>
                    </div>
                  </div>
                </div>

                {/* 模型详情 */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Model ID:</span>
                    <code
                      className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono text-xs"
                      title={model.model_id}
                    >
                      {model.model_id}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">端点:</span>
                    <span className="text-slate-700 truncate" title={model.api_endpoint}>
                      {model.api_endpoint}
                    </span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  {/* 测试连接按钮 (T107) */}
                  <TestConnectionButton modelId={model.id} modelName={model.name} />

                  {/* 编辑和删除按钮 */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditModel(model)}
                      className="flex-1 px-3 py-2 text-sm bg-slate-100 text-slate-700
                               rounded-md hover:bg-slate-200 transition-colors duration-200"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(model.id, model.name)}
                      className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700
                               rounded-md hover:bg-red-200 transition-colors duration-200"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ModelDialog 组件 */}
      <ModelDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleDialogSuccess}
        model={editingModel}
      />
    </div>
  );
}
