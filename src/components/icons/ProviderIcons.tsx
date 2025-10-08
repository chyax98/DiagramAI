/**
 * AI Provider 品牌图标组件
 * 使用 SVG 实现各 AI Provider 的品牌标识
 */

import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * OpenAI 图标
 */
export function OpenAIIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
      aria-label="OpenAI"
    >
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

/**
 * Anthropic Claude 图标
 */
export function AnthropicIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
      aria-label="Anthropic"
    >
      <path d="M14.612 3.608L19.2 16.8h-2.832l-1.224-3.528H9.288L8.064 16.8H5.232L9.84 3.608h4.772zm-2.388 2.34l-2.268 6.516h4.536l-2.268-6.516z" />
    </svg>
  );
}

/**
 * Google Gemini 图标
 */
export function GoogleIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
      aria-label="Google"
    >
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

/**
 * DeepSeek 图标 (使用通用 AI 图标)
 * 注意: 当前未使用,DeepSeek 通过 openai-compatible 支持
 * 保留此组件以备未来独立支持 DeepSeek provider
 */
export function DeepSeekIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
      aria-label="DeepSeek"
    >
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 4v8.82c0 4.52-3.1 8.73-7.39 9.88L12 27l-.61-.12C7.1 25.73 4 21.52 4 17V8.18l8-4zM9 11v6h2v-6H9zm4 0v6h2v-6h-2z" />
    </svg>
  );
}

/**
 * Groq 图标 (使用芯片图标)
 * 注意: 当前未使用,Groq 通过 openai-compatible 支持
 * 保留此组件以备未来独立支持 Groq provider
 */
export function GroqIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props} aria-label="Groq">
      <path d="M6 3h12c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 2v14h12V5H6zm2 2h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
    </svg>
  );
}

/**
 * 通用 OpenAI Compatible 图标
 */
export function OpenAICompatibleIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
      aria-label="OpenAI Compatible"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  );
}

/**
 * Provider 图标映射函数
 * 注意: 必须先检查 openai-compatible,再检查 openai (避免误匹配)
 *
 * 支持的 Provider 类型:
 * - openai: OpenAI 官方
 * - anthropic: Anthropic Claude
 * - google/gemini: Google Gemini
 * - openai-compatible: OpenAI 兼容接口 (DeepSeek, Groq, SiliconFlow 等)
 */
export function getProviderIcon(provider: string): React.ComponentType<IconProps> {
  const providerLower = provider.toLowerCase();

  // 优先检查 openai-compatible (避免被 openai 误匹配)
  if (providerLower.includes("compatible")) return OpenAICompatibleIcon;

  // 检查具体 provider
  if (providerLower.includes("openai")) return OpenAIIcon;
  if (providerLower.includes("anthropic") || providerLower.includes("claude")) return AnthropicIcon;
  if (providerLower.includes("google") || providerLower.includes("gemini")) return GoogleIcon;

  return OpenAICompatibleIcon; // 默认通用图标
}

/**
 * Provider 图标组件 (自动选择)
 */
export function ProviderIcon({
  provider,
  className = "w-5 h-5",
  ...props
}: IconProps & { provider: string }) {
  const IconComponent = getProviderIcon(provider);
  return <IconComponent className={className} {...props} />;
}
