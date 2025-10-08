/**
 * AI Provider 工厂函数
 *
 * 设计要点：
 * - 基于 Vercel AI SDK 提供统一的 LanguageModel 接口
 * - 支持主流 AI Provider（OpenAI, Anthropic, Google）及 OpenAI 兼容服务
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

    case "google":
    case "gemini": {
      const google = createGoogleGenerativeAI({
        apiKey: config.api_key,
        baseURL: config.api_endpoint || undefined,
      });
      return google(config.model_id);
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
      throw new Error(
        `不支持的 AI Provider: ${config.provider}。支持的选项: openai, anthropic, google/gemini, openai-compatible`
      );
  }
}

/**
 * 获取 Provider 显示名称
 *
 * @param provider - Provider 类型标识符
 * @returns 用户友好的显示名称
 */
export function getProviderDisplayName(provider: string): string {
  const providerMap: Record<string, string> = {
    openai: "OpenAI",
    anthropic: "Anthropic",
    google: "Google Gemini",
    gemini: "Google Gemini",
    "openai-compatible": "OpenAI Compatible",
  };

  return providerMap[provider.toLowerCase()] || provider;
}

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

  // 验证 Provider 是否支持
  const supportedProviders = ["openai", "anthropic", "google", "gemini", "openai-compatible"];
  if (!supportedProviders.includes(config.provider.toLowerCase())) {
    throw new Error(
      `不支持的 Provider: ${config.provider}。支持的选项: ${supportedProviders.join(", ")}`
    );
  }
}
