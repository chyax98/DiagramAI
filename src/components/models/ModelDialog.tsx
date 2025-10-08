"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateModelSchema,
  EditModelSchema,
  type CreateModelData,
  type EditModelData,
} from "@/lib/validations/models";
import { apiClient } from "@/lib/utils/api-client";
import { dialog } from "@/components/ui/dialog/dialog";
import { ProviderIcon, IconCopy, IconRefresh } from "@/components/icons";

interface AIModel {
  id: number;
  name: string;
  provider: "openai" | "gemini" | "claude" | "openai-compatible";
  api_endpoint: string;
  api_key?: string; // 编辑时可能不返回完整密钥
  model_id: string;
  parameters?: string;
}

interface ModelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  model?: AIModel;
}

const PROVIDER_OPTIONS = [
  { value: "openai", label: "OpenAI", color: "text-green-600" },
  { value: "gemini", label: "Google Gemini", color: "text-blue-600" },
  { value: "claude", label: "Anthropic Claude", color: "text-orange-600" },
  {
    value: "openai-compatible",
    label: "OpenAI 兼容 (DeepSeek, SiliconFlow, Together AI, Groq 等)",
    color: "text-indigo-600",
  },
] as const;

const DEFAULT_API_ENDPOINTS: Record<string, string> = {
  openai: "https://api.openai.com/v1",
  gemini: "https://generativelanguage.googleapis.com/v1beta",
  claude: "https://api.anthropic.com/v1",
  "openai-compatible": "", // 用户自定义
};

export function ModelDialog({ isOpen, onClose, onSuccess, model }: ModelDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchInput, setBatchInput] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("openai");

  const isMountedRef = useRef(true);

  const isEditMode = !!model;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateModelData | EditModelData>({
    resolver: zodResolver(isEditMode ? EditModelSchema : CreateModelSchema),
    defaultValues: model
      ? {
          name: model.name,
          provider: model.provider,
          api_endpoint: model.api_endpoint,
          api_key: "", // 编辑时留空表示不修改
          model_id: model.model_id,
          parameters: model.parameters || "",
        }
      : {
          name: "",
          provider: "openai",
          api_endpoint: "",
          api_key: "",
          model_id: "",
          parameters: "",
        },
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const onSubmit = async (data: CreateModelData | EditModelData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        const payload = {
          ...data,
          api_key: data.api_key?.trim() || undefined,
        };
        await apiClient.patch(`/api/models/${model.id}`, payload);
      } else {
        await apiClient.post("/api/models", data);
      }

      if (!isMountedRef.current) return;

      reset();
      await onSuccess();
      onClose();
    } catch (err) {
      // Bug 6 修复: 检查组件是否已卸载
      if (!isMountedRef.current) return;

      setError(err instanceof Error ? err.message : "操作失败,请重试");
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleBatchSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const lines = batchInput
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      if (lines.length === 0) {
        throw new Error("请输入至少一行模型信息");
      }

      const models: CreateModelData[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]?.trim();
        if (!line) continue;

        const parts = line.split("|").map((p) => p.trim());

        if (parts.length < 5) {
          throw new Error(
            `第 ${i + 1} 行格式错误: 至少需要 5 个字段(模型名称|服务商|API端点|API密钥|模型ID)`
          );
        }

        const name = parts[0]!;
        const provider = parts[1]!;
        const api_endpoint = parts[2]!;
        const api_key = parts[3]!;
        const model_id = parts[4]!;
        const parameters = parts[5];

        if (!["openai", "gemini", "claude", "openai-compatible"].includes(provider)) {
          throw new Error(
            `第 ${i + 1} 行错误: 服务商必须是 openai, gemini, claude 或 openai-compatible`
          );
        }

        models.push({
          name,
          provider: provider as "openai" | "gemini" | "claude" | "openai-compatible",
          api_endpoint,
          api_key,
          model_id,
          parameters: parameters || "",
        });
      }

      const results = {
        success: [] as string[],
        failed: [] as { name: string; error: string }[],
      };

      for (const modelData of models) {
        try {
          await apiClient.post("/api/models", modelData);
          results.success.push(modelData.name);
        } catch (err) {
          results.failed.push({
            name: modelData.name,
            error: err instanceof Error ? err.message : "未知错误",
          });
        }
      }

      if (!isMountedRef.current) return;

      if (results.failed.length === 0) {
        await dialog.alert("批量添加成功", `成功添加 ${results.success.length} 个模型`);
      } else if (results.success.length === 0) {
        const message = [
          `所有 ${results.failed.length} 个模型添加失败`,
          "",
          "失败详情:",
          ...results.failed.map((f) => `• ${f.name}: ${f.error}`),
        ].join("\n");
        await dialog.alert("批量添加失败", message);
      } else {
        const message = [
          `成功: ${results.success.length} 个`,
          `失败: ${results.failed.length} 个`,
          "",
          "成功的模型:",
          ...results.success.map((name) => `✓ ${name}`),
          "",
          "失败的模型:",
          ...results.failed.map((f) => `✗ ${f.name}: ${f.error}`),
        ].join("\n");
        await dialog.alert("批量添加部分失败", message);
      }

      if (!isMountedRef.current) return;

      if (results.success.length > 0) {
        await onSuccess();
      }

      if (!isMountedRef.current) return;

      setBatchInput("");
      onClose();
    } catch (err) {
      // Bug 6 修复: 检查组件是否已卸载
      if (!isMountedRef.current) return;

      setError(err instanceof Error ? err.message : "批量添加失败,请重试");
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    setBatchInput("");
    setIsBatchMode(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
      setError(null);
      setBatchInput("");
      setIsBatchMode(false);
      setSelectedProvider("openai");
    } else if (isEditMode && model) {
      setSelectedProvider(model.provider);
      reset({
        name: model.name,
        provider: model.provider,
        api_endpoint: model.api_endpoint,
        api_key: "",
        model_id: model.model_id,
        parameters: model.parameters || "",
      });
    } else if (!isEditMode && isOpen) {
      setSelectedProvider("openai");
      reset({
        name: "",
        provider: "openai",
        api_endpoint: "",
        api_key: "",
        model_id: "",
        parameters: "",
      });
    }
  }, [isOpen, isEditMode, model, reset]);

  useEffect(() => {
    if (!isEditMode && selectedProvider && isOpen) {
      const defaultEndpoint = DEFAULT_API_ENDPOINTS[selectedProvider];
      if (defaultEndpoint !== undefined) {
        setValue("api_endpoint", defaultEndpoint, { shouldValidate: false });
      }
    }
  }, [selectedProvider, isEditMode, isOpen, setValue]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={handleClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {isEditMode ? "编辑 AI 模型" : "添加 AI 模型"}
              </h2>
              {!isEditMode && (
                <button
                  onClick={() => setIsBatchMode(!isBatchMode)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center gap-2 ${
                    isBatchMode
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  {isBatchMode ? (
                    <>
                      <IconCopy className="w-4 h-4" />
                      <span>批量模式</span>
                    </>
                  ) : (
                    <>
                      <IconRefresh className="w-4 h-4" />
                      <span>切换批量</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {isBatchMode ? (
            <div className="p-6 space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                  <IconCopy className="w-4 h-4" />
                  <span>批量添加格式说明</span>
                </h3>
                <p className="text-xs text-indigo-800 dark:text-indigo-200 mb-2">
                  每行一个模型,字段用竖线{" "}
                  <code className="bg-indigo-200 dark:bg-indigo-900 px-1 rounded">|</code> 分隔:
                </p>
                <code className="block text-xs bg-indigo-100 dark:bg-indigo-900 p-2 rounded text-indigo-900 dark:text-indigo-100">
                  模型名称|服务商|API端点|API密钥|模型ID|参数(可选)
                </code>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-2">
                  <strong>服务商</strong>: openai, gemini, claude, openai-compatible
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                  <strong>示例</strong>:
                </p>
                <code className="block text-xs bg-indigo-100 dark:bg-indigo-900 p-2 rounded text-indigo-900 dark:text-indigo-100 mt-1">
                  DeepSeek
                  V3|openai-compatible|https://ai.hybgzs.com|sk-xxx|deepseek-ai/DeepSeek-V3.1
                </code>
              </div>

              <div>
                <label
                  htmlFor="batch_input"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  批量输入 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="batch_input"
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  placeholder="DeepSeek V3|openai-compatible|https://ai.hybgzs.com|sk-xxx|deepseek-ai/DeepSeek-V3.1&#10;GPT-4|openai|https://api.openai.com/v1|sk-xxx|gpt-4"
                />
                <p className="mt-1 text-xs text-slate-500">
                  已输入{" "}
                  {
                    batchInput
                      .trim()
                      .split("\n")
                      .filter((line) => line.trim()).length
                  }{" "}
                  行
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-lg
                           text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleBatchSubmit}
                  disabled={isSubmitting || !batchInput.trim()}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium
                           transition-all duration-200 flex items-center justify-center gap-2
                           ${
                             isSubmitting || !batchInput.trim()
                               ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                               : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg"
                           }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
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
                      <span>批量添加中...</span>
                    </>
                  ) : (
                    <span>批量添加模型</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  模型名称 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.name ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="例如: GPT-4 模型"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-slate-700 mb-2">
                  AI 服务商 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="provider"
                    {...register("provider")}
                    onChange={(e) => {
                      register("provider").onChange(e);
                      setSelectedProvider(e.target.value);
                    }}
                    className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none ${
                      errors.provider ? "border-red-500" : "border-slate-300"
                    }`}
                  >
                    {PROVIDER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ProviderIcon
                      provider={selectedProvider}
                      className={`w-6 h-6 ${PROVIDER_OPTIONS.find((p) => p.value === selectedProvider)?.color || "text-gray-600"}`}
                    />
                  </div>
                </div>
                {errors.provider && (
                  <p className="mt-1 text-sm text-red-600">{errors.provider.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="api_endpoint"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  API 端点 <span className="text-red-500">*</span>
                </label>
                <input
                  id="api_endpoint"
                  type="url"
                  {...register("api_endpoint")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.api_endpoint ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="https://api.openai.com/v1"
                />
                {errors.api_endpoint && (
                  <p className="mt-1 text-sm text-red-600">{errors.api_endpoint.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="api_key" className="block text-sm font-medium text-slate-700 mb-2">
                  API 密钥 <span className="text-red-500">*</span>
                  {isEditMode && (
                    <span className="ml-2 text-xs text-slate-500">(留空表示不修改)</span>
                  )}
                </label>
                <input
                  id="api_key"
                  type="password"
                  {...register("api_key")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.api_key ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder={isEditMode ? "留空表示不修改" : "输入 API 密钥"}
                />
                {errors.api_key && (
                  <p className="mt-1 text-sm text-red-600">{errors.api_key.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="model_id" className="block text-sm font-medium text-slate-700 mb-2">
                  模型 ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="model_id"
                  type="text"
                  {...register("model_id")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.model_id ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="例如: gpt-4, gemini-pro"
                />
                {errors.model_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.model_id.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="parameters"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  参数 (可选, JSON 格式)
                </label>
                <textarea
                  id="parameters"
                  {...register("parameters")}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.parameters ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder='{"temperature": 0.7, "max_tokens": 2000}'
                />
                {errors.parameters && (
                  <p className="mt-1 text-sm text-red-600">{errors.parameters.message}</p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-lg
                         text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium
                         transition-all duration-200 flex items-center justify-center gap-2
                         ${
                           isSubmitting
                             ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                             : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg"
                         }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
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
                      <span>保存中...</span>
                    </>
                  ) : (
                    <span>{isEditMode ? "保存修改" : "添加模型"}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
