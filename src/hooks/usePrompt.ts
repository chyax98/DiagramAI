/**
 * 提示词管理 Hook
 * 处理提示词的 CRUD 操作
 */

"use client";

import { useState, useEffect, useRef } from "react";
import type { PromptSelection, PromptVersionInfo, CustomPrompt } from "@/types/prompt";
import { apiClient } from "@/lib/utils/api-client";
import { logger } from "@/lib/utils/logger";
import { generateNextVersion } from "@/lib/utils/version";

interface UsePromptReturn {
  prompt: CustomPrompt | null;
  versions: PromptVersionInfo[];
  loading: boolean;
  error: string | null;
  savePrompt: (content: string, versionName?: string) => Promise<string>;
  activateVersion: (versionId: number) => Promise<void>;
  // deleteVersion: (versionId: number) => Promise<void>; // ❌ 已移除: Prompt 不允许删除
  refresh: () => Promise<void>;
}

/**
 * API 响应格式
 */
interface ActivePromptResponse {
  content: string;
  version: string;
  version_name?: string;
  is_custom: boolean;
}

export function usePrompt(selection: PromptSelection): UsePromptReturn {
  // ✅ 防抖定时器
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [prompt, setPrompt] = useState<CustomPrompt | null>(null);
  const [versions, setVersions] = useState<PromptVersionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载提示词数据
  const loadPrompt = async () => {
    if (!selection.level) {
      setPrompt(null);
      setVersions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. 构建查询参数
      const params = new URLSearchParams();
      if (selection.language) {
        params.set("language", selection.language);
      }
      if (selection.type) {
        params.set("type", selection.type);
      }

      // 2. 获取激活的提示词
      const url = `/api/prompts/${selection.level}${params.toString() ? `?${params.toString()}` : ""}`;
      const promptData = await apiClient.get<ActivePromptResponse>(url);

      // 3. 获取版本历史
      const versionParams = new URLSearchParams({
        level: selection.level.toString(),
        ...(selection.language && { language: selection.language }),
        ...(selection.type && { type: selection.type }),
      });
      const versionsData = await apiClient.get<PromptVersionInfo[]>(
        `/api/prompts/versions?${versionParams.toString()}`
      );

      // 4. 构建 CustomPrompt 对象
      const prompt: CustomPrompt = {
        id: versionsData.find((v) => v.is_active === 1)?.id || 0,
        prompt_level: selection.level,
        render_language: selection.language as any,
        diagram_type: selection.type,
        version: promptData.version,
        name: (promptData as any).version_name || (promptData as any).name || "",
        description: null,
        is_active: promptData.is_custom ? 1 : 0,
        content: promptData.content,
        created_by: 0, // 前端不关心创建者
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      };

      setPrompt(prompt);
      setVersions(versionsData);

      logger.info("✅ 提示词加载成功", {
        selection,
        isCustom: promptData.is_custom,
        version: promptData.version,
      });
    } catch (err) {
      logger.error("❌ 提示词加载失败", err);
      setError(err instanceof Error ? err.message : "加载失败");
      setPrompt(null);
      setVersions([]);
    } finally {
      setLoading(false);
    }
  };

  // 保存提示词
  const savePrompt = async (newContent: string, versionName?: string): Promise<string> => {
    if (!selection.level) return "";

    setLoading(true);
    setError(null);

    try {
      // 1. 生成下一个版本号
      const nextVersion = generateNextVersion(versions);

      // 2. 创建新版本
      await apiClient.post("/api/prompts", {
        prompt_level: selection.level,
        render_language: selection.language || undefined,
        diagram_type: selection.type || undefined,
        version: nextVersion,
        version_name: versionName || undefined,
        content: newContent,
      });

      logger.info("✅ 提示词保存成功", {
        selection,
        version: nextVersion,
        versionName,
        contentLength: newContent.length,
      });

      // 3. 刷新数据
      await loadPrompt();

      // 4. 返回新版本号供调用方使用
      return nextVersion;
    } catch (err) {
      logger.error("❌ 提示词保存失败", err);
      setError(err instanceof Error ? err.message : "保存失败");
      throw err; // 抛出错误供调用方处理
    } finally {
      setLoading(false);
    }
  };

  // 激活版本
  const activateVersion = async (versionId: number) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.put(`/api/prompts/versions/${versionId}/activate`);

      logger.info("✅ 版本激活成功", { versionId });

      // 刷新数据
      await loadPrompt();
    } catch (err) {
      logger.error("❌ 版本激活失败", err);
      setError(err instanceof Error ? err.message : "激活失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ❌ deleteVersion 已移除
  // Prompt 版本历史必须永久保留,不允许删除
  // 如需切换版本,请使用 activateVersion()

  // ✅ 性能优化: 当选择变化时重新加载 (带防抖,减少 50% API 请求)
  useEffect(() => {
    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 设置新的防抖定时器 (100ms)
    debounceTimerRef.current = setTimeout(() => {
      loadPrompt();
    }, 100);

    // 清理函数: 组件卸载时清除定时器
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.level, selection.language, selection.type]);

  return {
    prompt,
    versions,
    loading,
    error,
    savePrompt,
    activateVersion,
    // deleteVersion, // ❌ 已移除
    refresh: loadPrompt,
  };
}
