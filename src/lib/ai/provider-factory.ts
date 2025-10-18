/**
 * AI Provider 工厂函数
 *
 * 设计要点：
 * - 基于 Vercel AI SDK 提供统一的 LanguageModel 接口
 * - 支持主流 AI Provider（OpenAI, Anthropic, Google）及 OpenAI 兼容服务
 * - 支持 Cerebras、DeepSeek、SiliconFlow、Together AI、Groq 等兼容服务
 * - 从数据库模型配置创建 Provider 实例
 */

import { createOpenAI } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

/**
 * 从数据库模型配置创建 AI Provider
 *
 * @param config - 模型配置（来自 ai_models 表）
 * @returns Vercel AI SDK LanguageModel 实例
 * @throws 不支持的 Provider 或配置无效时抛出错误
 *
 * @example
 * const model = getAIProvider(modelConfig);
 * const result = await generateText({ model, prompt: '生成流程图' });
 */
export function getAIProvider(config: {
  provider: string;
  model_id: string;
  api_key: string;
  api_endpoint?: string | null;
}): LanguageModel {
  const provider = config.provider.toLowerCase();

  switch (provider) {
    case "openai": {
      const openai = createOpenAI({
        apiKey: config.api_key,
        baseURL: config.api_endpoint || undefined,
      });
      return openai(config.model_id);
    }

    case "anthropic": {
      const anthropic = createAnthropic({
        apiKey: config.api_key,
        baseURL: config.api_endpoint || undefined,
      });
      return anthropic(config.model_id);
    }

    case "gemini": {
      const gemini = createGoogleGenerativeAI({
        apiKey: config.api_key,
        baseURL: config.api_endpoint || undefined,
      });
      return gemini(config.model_id);
    }

    case "cerebras": {
      // Cerebras 完全兼容 OpenAI API,使用 OpenAI Compatible 接口
      // 官方文档: https://inference-docs.cerebras.ai/api-reference/chat-completions
      const cerebras = createOpenAICompatible({
        name: "cerebras",
        apiKey: config.api_key,
        baseURL: config.api_endpoint || "https://api.cerebras.ai/v1",
      });
      return cerebras(config.model_id);
    }

    case "openai-compatible": {
      // OpenAI 兼容的第三方服务（DeepSeek, SiliconFlow, Together AI, Groq 等）
      if (!config.api_endpoint) {
        throw new Error("OpenAI-compatible provider requires an API endpoint");
      }
      const compatible = createOpenAICompatible({
        name: "openai-compatible",
        apiKey: config.api_key,
        baseURL: config.api_endpoint,
      });
      return compatible(config.model_id);
    }

    default:
      // 对于未明确支持的 provider，尝试使用 OpenAI 兼容接口
      // 这允许用户添加任何 OpenAI 兼容的服务
      if (!config.api_endpoint) {
        throw new Error(
          `未知的 AI Provider: ${config.provider}。如果是 OpenAI 兼容服务，请提供 API 端点。`
        );
      }
      const fallback = createOpenAICompatible({
        name: provider,
        apiKey: config.api_key,
        baseURL: config.api_endpoint,
      });
      return fallback(config.model_id);
  }
}

/**
 * Provider 元数据管理函数 - 从 providers-registry.ts 导出
 */
export {
  getProviderDisplayName,
  getProviderDefaultEndpoint,
  hasDefaultEndpoint,
  getProviderColor,
  requiresCustomEndpoint,
  getAllProviders,
  getProviderById,
} from "./providers-registry";

/**
 * 验证 Provider 配置是否完整
 *
 * @param config - 模型配置
 * @throws Error 如果配置无效
 */
export function validateProviderConfig(config: {
  provider: string;
  model_id: string;
  api_key: string;
}): void {
  if (!config.provider || config.provider.trim().length === 0) {
    throw new Error("Provider 不能为空");
  }

  if (!config.model_id || config.model_id.trim().length === 0) {
    throw new Error("模型 ID 不能为空");
  }

  if (!config.api_key || config.api_key.trim().length === 0) {
    throw new Error("API Key 不能为空");
  }

  // 不再限制 Provider 类型，支持任意 OpenAI 兼容服务
  // 主流支持: openai, anthropic, gemini, cerebras, openai-compatible
  // 其他 OpenAI 兼容服务会自动使用 fallback 逻辑
}
