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
import { ProviderIcon } from "@/components/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AIModel {
  id: number;
  name: string;
  provider: "openai" | "anthropic" | "gemini" | "openai-compatible";
  api_endpoint: string;
  api_key?: string; // 编辑时可能不返回完整密钥
  model_id: string;
  parameters?: string;
}

interface ModelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
  model?: AIModel;
}

const PROVIDER_OPTIONS = [
  { value: "openai", label: "OpenAI", color: "text-green-600" },
  { value: "anthropic", label: "Anthropic Claude", color: "text-orange-600" },
  { value: "gemini", label: "Google Gemini", color: "text-blue-600" },
  {
    value: "openai-compatible",
    label: "OpenAI 兼容 (DeepSeek, SiliconFlow, Together AI, Groq 等)",
    color: "text-indigo-600",
  },
] as const;

const DEFAULT_API_ENDPOINTS: Record<string, string> = {
  openai: "https://api.openai.com/v1",
  anthropic: "https://api.anthropic.com/v1",
  gemini: "https://generativelanguage.googleapis.com/v1beta",
  "openai-compatible": "https://api.openai.com/v1", // 用户自定义
};

export function ModelDialog({ isOpen, onClose, onSuccess, model }: ModelDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

      // 先等待刷新完成
      await onSuccess();

      // 然后关闭对话框和重置表单
      reset();
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

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
      setError(null);
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
          className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isEditMode ? "编辑 AI 模型" : "添加 AI 模型"}
            </h2>
            <button
              onClick={handleClose}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
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

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                模型名称 <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                placeholder="例如: GPT-4 模型"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="provider"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                AI 服务商 <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedProvider}
                onValueChange={(value) => {
                  setSelectedProvider(value);
                  setValue("provider", value as CreateModelData["provider"], {
                    shouldValidate: true,
                  });
                }}
              >
                <SelectTrigger
                  className={`w-full transition-colors ${errors.provider ? "border-red-500" : ""}`}
                  aria-label="选择 AI 服务商"
                >
                  <SelectValue>
                    {selectedProvider && (
                      <div className="flex items-center gap-2.5">
                        <ProviderIcon
                          provider={selectedProvider}
                          className={`w-5 h-5 shrink-0 ${PROVIDER_OPTIONS.find((p) => p.value === selectedProvider)?.color || "text-gray-600"}`}
                        />
                        <span className="font-medium">
                          {PROVIDER_OPTIONS.find((p) => p.value === selectedProvider)?.label}
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {PROVIDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                      <div className="flex items-center gap-3 py-0.5">
                        <ProviderIcon
                          provider={option.value}
                          className={`w-6 h-6 shrink-0 ${option.color}`}
                        />
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sm leading-tight text-foreground">
                            {option.label}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.provider && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.provider.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="api_endpoint"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                API 端点 <span className="text-red-500">*</span>
              </label>
              <Input
                id="api_endpoint"
                type="url"
                {...register("api_endpoint")}
                className={
                  errors.api_endpoint ? "border-destructive focus-visible:ring-destructive" : ""
                }
                placeholder="https://api.openai.com/v1"
              />
              {errors.api_endpoint && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.api_endpoint.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="api_key"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                API 密钥 <span className="text-red-500">*</span>
                {isEditMode && (
                  <span className="ml-2 text-xs text-slate-500">(留空表示不修改)</span>
                )}
              </label>
              <Input
                id="api_key"
                type="password"
                {...register("api_key")}
                className={
                  errors.api_key ? "border-destructive focus-visible:ring-destructive" : ""
                }
                placeholder={isEditMode ? "留空表示不修改" : "输入 API 密钥"}
              />
              {errors.api_key && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.api_key.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="model_id"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                模型 ID <span className="text-red-500">*</span>
              </label>
              <Input
                id="model_id"
                type="text"
                {...register("model_id")}
                className={
                  errors.model_id ? "border-destructive focus-visible:ring-destructive" : ""
                }
                placeholder="例如: gpt-4, gemini-pro"
              />
              {errors.model_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.model_id.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="parameters"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                参数 (可选, JSON 格式)
              </label>
              <Textarea
                id="parameters"
                {...register("parameters")}
                rows={3}
                className={
                  errors.parameters ? "border-destructive focus-visible:ring-destructive" : ""
                }
                placeholder='{"temperature": 0.7, "max_tokens": 2000}'
              />
              {errors.parameters && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.parameters.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                         text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
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
        </div>
      </div>
    </>
  );
}
