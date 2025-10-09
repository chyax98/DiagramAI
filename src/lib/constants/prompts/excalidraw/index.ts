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
 * 获取 Excalidraw 图表的完整提示词（任务上下文 + L1 + L2 + L3）
 */
function getExcalidrawPrompt(diagramType: DiagramType): string {
  const taskContext = buildTaskContext("excalidraw", diagramType);
  const l1 = UNIVERSAL_PROMPT;
  const l2 = EXCALIDRAW_COMMON_PROMPT;

  const promptMap: Record<string, string> = {
    sketch: EXCALIDRAW_SKETCH_PROMPT,
    wireframe: EXCALIDRAW_WIREFRAME_PROMPT,
    diagram: EXCALIDRAW_DIAGRAM_PROMPT,
  };

  const l3 = promptMap[diagramType] || EXCALIDRAW_DIAGRAM_PROMPT;

  return [taskContext, l1, l2, l3].filter((p) => p.length > 0).join("\n\n---\n\n");
}

/**
 * 构建任务上下文
 */
function buildTaskContext(renderLanguage: string, diagramType: string): string {
  return `# 当前任务

你正在生成 **${renderLanguage.toUpperCase()} ${diagramType}** 代码。

## 任务参数

- **渲染语言**: ${renderLanguage}
- **图表类型**: ${diagramType}
- **渲染引擎**: Kroki
- **输出格式**: \`\`\`${renderLanguage}\n[你的代码]\n\`\`\`

## 执行要求

请基于以上任务参数，严格执行下方的生成规范。`;
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
