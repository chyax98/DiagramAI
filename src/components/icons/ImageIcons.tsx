/**
 * 基于 public 资源的图标组件 (向后兼容层)
 * 使用通用 Icon 组件,消除重复代码
 *
 * 注意: 此文件仅用于向后兼容,新代码请直接使用:
 * - Icon 组件
 * - ProviderIcon 组件
 * - LanguageIcon 组件
 * - Logo 组件
 */

"use client";

import { Icon, ProviderIcon, LanguageIcon, Logo } from "./Icon";
import type { ImgHTMLAttributes } from "react";

/**
 * 图标属性类型(向后兼容)
 */
interface ImageIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  className?: string;
  size?: number;
}

/**
 * AI Provider 图标 (Image 版本) - 向后兼容导出
 */
export function OpenAIImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="providers" name="openai" className={className} size={size} />;
}

export function AnthropicImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="providers" name="anthropic" className={className} size={size} />;
}

export function GoogleImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="providers" name="google" className={className} size={size} />;
}

export function DeepSeekImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="providers" name="deepseek" className={className} size={size} />;
}

export function GroqImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="providers" name="groq" className={className} size={size} />;
}

export function OpenAICompatibleImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="providers" name="openai-compatible" className={className} size={size} />;
}

/**
 * 图表语言图标 (Image 版本) - 向后兼容导出
 */
export function MermaidImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="mermaid" className={className} size={size} />;
}

export function PlantUMLImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="plantuml" className={className} size={size} />;
}

export function D2ImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="d2" className={className} size={size} />;
}

export function GraphvizImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="graphviz" className={className} size={size} />;
}

export function WaveDromImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="wavedrom" className={className} size={size} />;
}

export function NomnomlImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="nomnoml" className={className} size={size} />;
}

export function ExcalidrawImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="excalidraw" className={className} size={size} />;
}

export function C4PlantUMLImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="c4plantuml" className={className} size={size} />;
}

export function VegaLiteImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="vegalite" className={className} size={size} />;
}

export function DBMLImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="dbml" className={className} size={size} />;
}

export function BPMNImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="bpmn" className={className} size={size} />;
}

export function DitaaImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="ditaa" className={className} size={size} />;
}

export function NwDiagImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="nwdiag" className={className} size={size} />;
}

export function BlockDiagImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="blockdiag" className={className} size={size} />;
}

export function ActDiagImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="actdiag" className={className} size={size} />;
}

export function PacketDiagImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="packetdiag" className={className} size={size} />;
}

export function RackDiagImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="rackdiag" className={className} size={size} />;
}

export function SeqDiagImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="seqdiag" className={className} size={size} />;
}

export function StructurizrImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="structurizr" className={className} size={size} />;
}

export function ErdImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="erd" className={className} size={size} />;
}

export function PikchrImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="pikchr" className={className} size={size} />;
}

export function SvgBobImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="svgbob" className={className} size={size} />;
}

export function UmletImageIcon({ className = "", size = 20 }: ImageIconProps) {
  return <Icon category="languages" name="umlet" className={className} size={size} />;
}

/**
 * Provider 图标映射函数 (向后兼容)
 */
export function getProviderImageIcon(provider: string): React.ComponentType<ImageIconProps> {
  // 返回一个包装组件
  return function ProviderImageIconWrapper({ className = "", size = 20 }: ImageIconProps) {
    return <ProviderIcon provider={provider} className={className} size={size} />;
  };
}

/**
 * Provider 图标组件 (向后兼容)
 */
export function ProviderImageIcon({
  provider,
  className = "",
  size = 20,
}: ImageIconProps & { provider: string }) {
  return <ProviderIcon provider={provider} className={className} size={size} />;
}

/**
 * 语言图标映射函数 (向后兼容)
 */
export function getLanguageImageIcon(language: string): React.ComponentType<ImageIconProps> {
  // 返回一个包装组件
  return function LanguageImageIconWrapper({ className = "", size = 20 }: ImageIconProps) {
    return <LanguageIcon language={language} className={className} size={size} />;
  };
}

/**
 * 语言图标组件 (向后兼容)
 */
export function LanguageImageIcon({
  language,
  className = "",
  size = 20,
}: ImageIconProps & { language: string }) {
  return <LanguageIcon language={language} className={className} size={size} />;
}

/**
 * 项目 Logo (向后兼容)
 */
export function DiagramAILogo({ className = "", size = 120 }: ImageIconProps) {
  return <Logo className={className} size={size} />;
}
