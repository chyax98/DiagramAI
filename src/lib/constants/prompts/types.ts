/** Prompt配置类型定义 - v3.0 统一多轮对话架构 */

import { LANGUAGE_DIAGRAM_TYPES, type RenderLanguage } from "@/lib/constants/diagram-types";

export type ExtractDiagramTypes<Lang extends RenderLanguage> =
  (typeof LANGUAGE_DIAGRAM_TYPES)[Lang][number]["value"];

export interface PromptConfig<Lang extends RenderLanguage = RenderLanguage> {
  generate: (diagramType: ExtractDiagramTypes<Lang>) => string;
  /** @deprecated v3.0 已废弃 adjust 字段，统一使用 generate */
  adjust?: string;
}
