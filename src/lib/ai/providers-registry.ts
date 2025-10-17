/**
 * AI Provider 注册中心
 *
 * 单一职责原则 (SSOT - Single Source of Truth):
 * - 所有 Provider 元数据集中管理
 * - 添加新 Provider 只需在此文件添加配置
 * - 前端和后端自动同步
 */

import type { AIProvider } from "@/types/database";

/**
 * Provider 配置接口
 */
export interface ProviderConfig {
    /** Provider ID (数据库值) */
    id: AIProvider;
    /** 用户友好的显示名称 */
    displayName: string;
    /** 默认 API 端点 (null 表示需要用户手动填写) */
    defaultEndpoint: string | null;
    /** Tailwind 颜色类 (用于图标和标签) */
    color: string;
    /** Provider 描述 (可选) */
    description?: string;
    /** 是否必须手动填写端点 */
    requiresCustomEndpoint: boolean;
}

/**
 * Provider 注册表
 *
 * 添加新 Provider 步骤:
 * 1. 在此数组添加配置
 * 2. 确保 provider-factory.ts 支持该 Provider
 * 3. 更新数据库 Schema (如果需要)
 */
export const PROVIDERS: readonly ProviderConfig[] = [
    {
        id: "openai",
        displayName: "OpenAI",
        defaultEndpoint: "https://api.openai.com/v1",
        color: "text-green-600",
        description: "GPT-4, GPT-3.5 等模型",
        requiresCustomEndpoint: false,
    },
    {
        id: "anthropic",
        displayName: "Anthropic",
        defaultEndpoint: "https://api.anthropic.com/v1",
        color: "text-orange-600",
        description: "Claude 系列模型",
        requiresCustomEndpoint: false,
    },
    {
        id: "gemini",
        displayName: "Google Gemini",
        defaultEndpoint: "https://generativelanguage.googleapis.com/v1beta",
        color: "text-blue-600",
        description: "Gemini Pro 等模型",
        requiresCustomEndpoint: false,
    },
    {
        id: "cerebras",
        displayName: "Cerebras",
        defaultEndpoint: "https://api.cerebras.ai/v1",
        color: "text-purple-600",
        description: "Llama 系列模型 (超快推理)",
        requiresCustomEndpoint: false,
    },
    {
        id: "openai-compatible",
        displayName: "OpenAI 兼容",
        defaultEndpoint: null,
        color: "text-indigo-600",
        description: "DeepSeek, SiliconFlow, Together AI, Groq 等",
        requiresCustomEndpoint: true,
    },
] as const;

/**
 * 创建 Provider ID 到配置的映射 (用于快速查找)
 */
const PROVIDER_MAP = new Map<AIProvider, ProviderConfig>(
    PROVIDERS.map((config) => [config.id, config])
);

/**
 * 获取所有 Provider 配置
 */
export function getAllProviders(): readonly ProviderConfig[] {
    return PROVIDERS;
}

/**
 * 根据 ID 获取 Provider 配置
 *
 * @param id - Provider ID
 * @returns Provider 配置，如果不存在则返回 undefined
 */
export function getProviderById(id: string): ProviderConfig | undefined {
    return PROVIDER_MAP.get(id as AIProvider);
}

/**
 * 获取 Provider 显示名称
 *
 * @param id - Provider ID
 * @returns 显示名称，如果不存在则返回原始 ID
 */
export function getProviderDisplayName(id: string): string {
    const config = getProviderById(id);
    return config?.displayName ?? id;
}

/**
 * 获取 Provider 默认端点
 *
 * @param id - Provider ID
 * @returns 默认端点 URL，如果没有默认端点则返回 null
 */
export function getProviderDefaultEndpoint(id: string): string | null {
    const config = getProviderById(id);
    return config?.defaultEndpoint ?? null;
}

/**
 * 获取 Provider 颜色类
 *
 * @param id - Provider ID
 * @returns Tailwind 颜色类，如果不存在则返回默认颜色
 */
export function getProviderColor(id: string): string {
    const config = getProviderById(id);
    return config?.color ?? "text-gray-600";
}

/**
 * 检查 Provider 是否有默认端点
 *
 * @param id - Provider ID
 * @returns 是否有默认端点
 */
export function hasDefaultEndpoint(id: string): boolean {
    return getProviderDefaultEndpoint(id) !== null;
}

/**
 * 检查 Provider 是否需要自定义端点
 *
 * @param id - Provider ID
 * @returns 是否需要用户手动填写端点
 */
export function requiresCustomEndpoint(id: string): boolean {
    const config = getProviderById(id);
    return config?.requiresCustomEndpoint ?? false;
}

/**
 * 获取 Provider 描述
 *
 * @param id - Provider ID
 * @returns Provider 描述，如果不存在则返回空字符串
 */
export function getProviderDescription(id: string): string {
    const config = getProviderById(id);
    return config?.description ?? "";
}
