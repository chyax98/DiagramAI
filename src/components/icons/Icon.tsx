/**
 * 通用图标组件 - 数据驱动的图标系统
 * 自动从 public/icons 加载 SVG 文件,消除重复代码
 */

"use client";

import Image from "next/image";
import type { ImgHTMLAttributes } from "react";

/**
 * 图标类型定义
 */
export type IconCategory = "providers" | "languages" | "app" | "types";

/**
 * Provider 类型
 */
export type ProviderType =
  | "openai"
  | "anthropic"
  | "google"
  | "deepseek"
  | "groq"
  | "openai-compatible";

/**
 * 渲染语言类型
 */
export type LanguageType =
  | "mermaid"
  | "plantuml"
  | "d2"
  | "graphviz"
  | "wavedrom"
  | "nomnoml"
  | "excalidraw"
  | "c4plantuml"
  | "vegalite"
  | "dbml"
  | "bpmn"
  | "ditaa"
  | "nwdiag"
  | "blockdiag"
  | "actdiag"
  | "packetdiag"
  | "rackdiag"
  | "seqdiag"
  | "structurizr"
  | "erd"
  | "pikchr"
  | "svgbob"
  | "umlet";

/**
 * 图表类型
 */
export type DiagramTypeIcon = "flowchart" | "sequence" | "class" | "er" | "state" | "gantt";

/**
 * 应用图标
 */
export type AppIcon = "logo";

/**
 * 图标名称类型
 */
export type IconName = ProviderType | LanguageType | DiagramTypeIcon | AppIcon;

/**
 * 图标组件属性
 */
export interface IconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  /** 图标分类 */
  category: IconCategory;
  /** 图标名称 */
  name: IconName;
  /** 自定义类名 */
  className?: string;
  /** 图标大小(宽高相同) */
  size?: number;
  /** 可选的 alt 文本,默认使用 name */
  alt?: string;
}

/**
 * 通用图标组件
 *
 * @example
 * ```tsx
 * <Icon category="providers" name="openai" size={20} />
 * <Icon category="languages" name="mermaid" size={24} />
 * <Icon category="app" name="logo" size={120} />
 * ```
 */
export function Icon({ category, name, className = "", size = 20, alt }: IconProps) {
  const iconPath = `/icons/${category}/${name}.svg`;
  const altText = alt || name;

  return <Image src={iconPath} alt={altText} width={size} height={size} className={className} />;
}

/**
 * Provider 图标映射
 * 自动识别 provider 字符串并返回对应的 ProviderType
 *
 * @param provider - Provider 名称字符串
 * @returns ProviderType - 标准化的 Provider 类型
 */
export function getProviderType(provider: string): ProviderType {
  const providerLower = provider.toLowerCase();

  // 优先检查 openai-compatible (避免被 openai 误匹配)
  if (providerLower.includes("compatible")) return "openai-compatible";

  // 检查具体 provider
  if (providerLower.includes("openai")) return "openai";
  if (providerLower.includes("anthropic") || providerLower.includes("claude")) return "anthropic";
  if (providerLower.includes("gemini") || providerLower.includes("google")) return "google";
  if (providerLower.includes("deepseek")) return "deepseek";
  if (providerLower.includes("groq")) return "groq";

  // 默认返回 openai-compatible
  return "openai-compatible";
}

/**
 * Provider 图标组件(自动选择)
 *
 * @example
 * ```tsx
 * <ProviderIcon provider="openai" size={20} />
 * <ProviderIcon provider="anthropic" size={24} />
 * ```
 */
export interface ProviderIconProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  provider: string;
  className?: string;
  size?: number;
}

export function ProviderIcon({ provider, className = "", size = 20 }: ProviderIconProps) {
  const providerType = getProviderType(provider);
  return <Icon category="providers" name={providerType} className={className} size={size} />;
}

/**
 * 语言图标映射表
 * 支持精确匹配和别名
 */
const LANGUAGE_ALIASES: Record<string, LanguageType> = {
  // 精确匹配
  mermaid: "mermaid",
  plantuml: "plantuml",
  d2: "d2",
  graphviz: "graphviz",
  wavedrom: "wavedrom",
  nomnoml: "nomnoml",
  excalidraw: "excalidraw",
  c4plantuml: "c4plantuml",
  vegalite: "vegalite",
  dbml: "dbml",
  bpmn: "bpmn",
  ditaa: "ditaa",
  nwdiag: "nwdiag",
  blockdiag: "blockdiag",
  actdiag: "actdiag",
  packetdiag: "packetdiag",
  rackdiag: "rackdiag",
  seqdiag: "seqdiag",
  structurizr: "structurizr",
  erd: "erd",
  pikchr: "pikchr",
  svgbob: "svgbob",
  umlet: "umlet",
  // 别名映射
  dot: "graphviz",
  vega: "vegalite",
};

/**
 * 语言图标映射函数
 *
 * @param language - 语言名称字符串
 * @returns LanguageType - 标准化的语言类型
 */
export function getLanguageType(language: string): LanguageType {
  const langLower = language.toLowerCase();

  // 精确匹配
  if (LANGUAGE_ALIASES[langLower]) {
    return LANGUAGE_ALIASES[langLower];
  }

  // 模糊匹配(包含关键字)
  for (const [key, type] of Object.entries(LANGUAGE_ALIASES)) {
    if (langLower.includes(key)) {
      return type;
    }
  }

  // 默认返回 mermaid(最流行的图表语言)
  return "mermaid";
}

/**
 * 语言图标组件(自动选择)
 *
 * @example
 * ```tsx
 * <LanguageIcon language="mermaid" size={20} />
 * <LanguageIcon language="plantuml" size={24} />
 * ```
 */
export interface LanguageIconProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  language: string;
  className?: string;
  size?: number;
}

export function LanguageIcon({ language, className = "", size = 20 }: LanguageIconProps) {
  const languageType = getLanguageType(language);
  return <Icon category="languages" name={languageType} className={className} size={size} />;
}

/**
 * Logo 组件
 *
 * @example
 * ```tsx
 * <Logo size={120} />
 * ```
 */
export interface LogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 120 }: LogoProps) {
  return <Icon category="app" name="logo" className={className} size={size} />;
}
