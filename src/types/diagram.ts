/** 图表类型 - 生成请求+响应+样式+验证+渲染配置 */

import type { RenderLanguage, DiagramType } from "@/lib/constants/diagram-types";

export type { RenderLanguage, DiagramType };

export interface DiagramGenerationRequest {
  inputText: string;
  renderLanguage: RenderLanguage;
  diagramType?: DiagramType;
  styleOptions?: DiagramStyleOptions;
}

export interface DiagramGenerationResponse {
  code: string;
  renderLanguage: RenderLanguage;
  diagramType: DiagramType;
  generationTime: number;
}

export interface DiagramStyleOptions {
  theme?: "default" | "forest" | "dark" | "neutral" | "base";
  direction?: "TB" | "BT" | "LR" | "RL";
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export interface DiagramValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface MermaidRenderOptions {
  theme?: "default" | "forest" | "dark" | "neutral" | "base";
  logLevel?: "debug" | "info" | "warn" | "error" | "fatal";
  secureMode?: boolean;
}

export interface PlantUMLRenderOptions {
  format?: "svg" | "png";
  serverUrl?: string;
  retries?: number;
}

export interface DiagramExportOptions {
  format: "svg" | "png" | "pdf";
  filename?: string;
  quality?: number;
  scale?: number;
}
