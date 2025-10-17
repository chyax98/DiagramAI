/** AI模型选择器 - 使用shadcn/ui Select,直接调用/api/models从session获取用户ID */

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import type { AIModel } from "@/types/database";
import { apiClient } from "@/lib/utils/api-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProviderIcon } from "@/components/icons";
import { getProviderDisplayName, getProviderColor } from "@/lib/ai/providers-registry";
import { logger } from "@/lib/utils/logger";
interface AIModelSelectorProps {
  value: number | null;
  onChange: (modelId: number | null) => void;
  disabled?: boolean;
  className?: string;
}

export function AIModelSelector({
  value,
  onChange,
  disabled = false,
  className = "",
}: AIModelSelectorProps) {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.get<{ models: AIModel[] }>("/api/models");
      setModels(data.models || []);

      if (data.models && data.models.length > 0 && !value) {
        const firstModel = data.models[0];
        if (firstModel) {
          onChangeRef.current(firstModel.id);
        }
      }
    } catch (err) {
      logger.error("获取模型列表失败:", err);
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  }, [value]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleValueChange = (selectedValue: string) => {
    onChange(selectedValue ? Number(selectedValue) : null);
  };

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className={`w-full ${className}`}>
          <div className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin text-indigo-500" />
            <span className="text-muted-foreground">加载模型...</span>
          </div>
        </SelectTrigger>
      </Select>
    );
  }

  if (error) {
    return (
      <Select disabled>
        <SelectTrigger className={`w-full border-red-500 ${className}`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-red-500" />
            <span className="text-red-500">{error}</span>
          </div>
        </SelectTrigger>
      </Select>
    );
  }

  if (models.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className={`w-full border-yellow-500 ${className}`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-yellow-500" />
            <span className="text-yellow-500">请先添加模型</span>
          </div>
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value?.toString() || ""} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger
        className={`w-full bg-card border-input hover:bg-accent hover:text-accent-foreground focus:border-ring focus:ring-ring/20 ${className}`}
        aria-label="选择 AI 模型"
      >
        <SelectValue placeholder="选择 AI 模型" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => {
          const providerDisplayName = getProviderDisplayName(model.provider);
          const providerColor = getProviderColor(model.provider);

          return (
            <SelectItem key={model.id} value={model.id.toString()}>
              <div className="flex items-center gap-2">
                <ProviderIcon provider={model.provider} className={`size-4 ${providerColor}`} />
                <span className="font-medium">{model.name}</span>
                <span className={`text-xs ${providerColor}`}>({providerDisplayName})</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
