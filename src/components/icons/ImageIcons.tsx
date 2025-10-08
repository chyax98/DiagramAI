/**
 * 基于 public 资源的图标组件
 * 使用 Next.js Image 组件加载官方 logo
 */

"use client";

import Image from "next/image";
import type { ImgHTMLAttributes } from "react";

interface ImageIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  className?: string;
  size?: number;
}

/**
 * AI Provider 图标 (Image 版本)
 */
export function OpenAIImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/providers/openai.svg"
      alt="OpenAI"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function AnthropicImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/providers/anthropic.svg"
      alt="Anthropic"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function GoogleImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/providers/google.svg"
      alt="Google"
      width={size}
      height={size}
      className={className}
    />
  );
}

/**
 * DeepSeek 图标 (Image 版本)
 * 注意: 当前未使用,DeepSeek 通过 openai-compatible 支持
 * 保留此组件以备未来独立支持 DeepSeek provider
 */
export function DeepSeekImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/providers/deepseek.svg"
      alt="DeepSeek"
      width={size}
      height={size}
      className={className}
    />
  );
}

/**
 * Groq 图标 (Image 版本)
 * 注意: 当前未使用,Groq 通过 openai-compatible 支持
 * 保留此组件以备未来独立支持 Groq provider
 */
export function GroqImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/providers/groq.svg"
      alt="Groq"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function OpenAICompatibleImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/providers/openai-compatible.svg"
      alt="OpenAI Compatible"
      width={size}
      height={size}
      className={className}
    />
  );
}

/**
 * 图表语言图标 (Image 版本)
 */
export function MermaidImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/languages/mermaid.svg"
      alt="Mermaid"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function PlantUMLImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/languages/plantuml.svg"
      alt="PlantUML"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function D2ImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/languages/d2.svg"
      alt="D2"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function GraphvizImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/languages/graphviz.svg"
      alt="Graphviz"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function WaveDromImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/languages/wavedrom.svg"
      alt="WaveDrom"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function NomnomlImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/languages/nomnoml.svg"
      alt="Nomnoml"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function ExcalidrawImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/languages/excalidraw.svg"
      alt="Excalidraw"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function C4PlantUMLImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/languages/c4plantuml.svg"
      alt="C4-PlantUML"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function VegaLiteImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/languages/vegalite.svg"
      alt="Vega-Lite"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function DBMLImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return (
    <Image
      src="/icons/languages/dbml.svg"
      alt="DBML"
      width={size}
      height={size}
      className={className}
    />
  );
}

/**
 * Provider 图标映射函数 (Image 版本)
 * 注意: 必须先检查 openai-compatible,再检查 openai (避免误匹配)
 *
 * 支持的 Provider 类型:
 * - openai: OpenAI 官方
 * - anthropic: Anthropic Claude
 * - google/gemini: Google Gemini
 * - openai-compatible: OpenAI 兼容接口 (DeepSeek, Groq, SiliconFlow 等)
 */
export function getProviderImageIcon(provider: string): React.ComponentType<ImageIconProps> {
  const providerLower = provider.toLowerCase();

  // 优先检查 openai-compatible (避免被 openai 误匹配)
  if (providerLower.includes("compatible")) return OpenAICompatibleImageIcon;

  // 检查具体 provider
  if (providerLower.includes("openai")) return OpenAIImageIcon;
  if (providerLower.includes("anthropic") || providerLower.includes("claude"))
    return AnthropicImageIcon;
  if (providerLower.includes("google") || providerLower.includes("gemini")) return GoogleImageIcon;

  return OpenAICompatibleImageIcon; // 默认
}

/**
 * Provider 图标组件 (Image 版本，自动选择)
 */
export function ProviderImageIcon({
  provider,
  className = "",
  size = 20,
}: ImageIconProps & { provider: string }) {
  const IconComponent = getProviderImageIcon(provider);
  return <IconComponent className={className} size={size} />;
}

/**
 * 语言图标映射函数 (Image 版本)
 */
export function getLanguageImageIcon(language: string): React.ComponentType<ImageIconProps> {
  const langLower = language.toLowerCase();

  if (langLower.includes("mermaid")) return MermaidImageIcon;
  if (langLower.includes("plantuml") && langLower.includes("c4")) return C4PlantUMLImageIcon;
  if (langLower.includes("plantuml")) return PlantUMLImageIcon;
  if (langLower.includes("d2")) return D2ImageIcon;
  if (langLower.includes("graphviz") || langLower.includes("dot")) return GraphvizImageIcon;
  if (langLower.includes("wavedrom")) return WaveDromImageIcon;
  if (langLower.includes("nomnoml")) return NomnomlImageIcon;
  if (langLower.includes("excalidraw")) return ExcalidrawImageIcon;
  if (langLower.includes("c4")) return C4PlantUMLImageIcon;
  if (langLower.includes("vegalite") || langLower.includes("vega")) return VegaLiteImageIcon;
  if (langLower.includes("dbml")) return DBMLImageIcon;

  return MermaidImageIcon; // 默认
}

/**
 * 语言图标组件 (Image 版本，自动选择)
 */
export function LanguageImageIcon({
  language,
  className = "",
  size = 20,
}: ImageIconProps & { language: string }) {
  const IconComponent = getLanguageImageIcon(language);
  return <IconComponent className={className} size={size} />;
}

/**
 * 项目 Logo
 */
export function DiagramAILogo({ className = "", size = 120 }: ImageIconProps) {
  return (
    <Image
      src="/icons/app/logo.svg"
      alt="DiagramAI"
      width={size}
      height={size}
      className={className}
    />
  );
}
