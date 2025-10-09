/**
 * Excalidraw 提示词导出索引
 *
 * 用途：统一导出 Excalidraw 所有提示词
 */

export { EXCALIDRAW_COMMON_PROMPT } from "./common";
export { EXCALIDRAW_SKETCH_PROMPT } from "./sketch";
export { EXCALIDRAW_WIREFRAME_PROMPT } from "./wireframe";
export { EXCALIDRAW_DIAGRAM_PROMPT } from "./diagram";

// ============================================
// PromptConfig 导出（供主 index.ts 使用）
// ============================================

import type { DiagramType } from "@/lib/constants/diagram-types";
import type { PromptConfig } from "../types";
import { UNIVERSAL_PROMPT } from "../common";
import { EXCALIDRAW_COMMON_PROMPT } from "./common";
import { EXCALIDRAW_SKETCH_PROMPT } from "./sketch";
import { EXCALIDRAW_WIREFRAME_PROMPT } from "./wireframe";
import { EXCALIDRAW_DIAGRAM_PROMPT } from "./diagram";

/**
 * 获取 Excalidraw 图表的完整提示词（L1 + L2 + L3）
 */
function getExcalidrawPrompt(diagramType: DiagramType): string {
  const l1 = UNIVERSAL_PROMPT;
  const l2 = EXCALIDRAW_COMMON_PROMPT;
  
  const promptMap: Record<string, string> = {
    sketch: EXCALIDRAW_SKETCH_PROMPT,
    wireframe: EXCALIDRAW_WIREFRAME_PROMPT,
    diagram: EXCALIDRAW_DIAGRAM_PROMPT,
  };
  
  const l3 = promptMap[diagramType] || EXCALIDRAW_DIAGRAM_PROMPT;
  
  return [l1, l2, l3]
    .filter((p) => p.length > 0)
    .join("\n\n---\n\n");
}

/**
 * Excalidraw Prompts 配置对象
 * 
 * 实现 PromptConfig<"excalidraw"> 接口，供 DIAGRAM_PROMPTS 使用
 */
export const excalidrawPrompts: PromptConfig<"excalidraw"> = {
  generate: (diagramType) => {
    return getExcalidrawPrompt(diagramType);
  },
};

