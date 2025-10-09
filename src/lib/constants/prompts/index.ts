/**
 * Prompt 配置统一导出 - 新版本 (使用 .txt 文件)
 *
 * 迁移完成后，将此文件重命名为 index.ts 替换旧版本
 */

import type { RenderLanguage, DiagramType } from "@/lib/constants/diagram-types";
import { promptLoader } from "./loaders/prompt-loader";
import { getAutoSelectPrompt } from "./auto-select";

export * from "./types";
export { getAutoSelectPrompt };
export { promptLoader };

/**
 * DIAGRAM_PROMPTS 对象 - 保持向后兼容
 *
 * 注意: 这是兼容层，实际使用 promptLoader
 */
export const DIAGRAM_PROMPTS = {
  mermaid: {
    generate: (diagramType: DiagramType) => promptLoader.getPrompt("mermaid", diagramType),
  },
  plantuml: {
    generate: (diagramType: DiagramType) => promptLoader.getPrompt("plantuml", diagramType),
  },
  d2: {
    generate: (diagramType: DiagramType) => promptLoader.getPrompt("d2", diagramType),
  },
  graphviz: {
    generate: (diagramType: DiagramType) => promptLoader.getPrompt("graphviz", diagramType),
  },
  wavedrom: {
    generate: (diagramType: DiagramType) => promptLoader.getPrompt("wavedrom", diagramType),
  },
  nomnoml: {
    generate: (diagramType: DiagramType) => promptLoader.getPrompt("nomnoml", diagramType),
  },
  excalidraw: {
    generate: (diagramType: DiagramType) => promptLoader.getPrompt("excalidraw", diagramType),
  },
  c4plantuml: {
    generate: (diagramType: DiagramType) => promptLoader.getPrompt("plantuml/c4", diagramType),
  },
  vegalite: {
    generate: (diagramType: DiagramType) => promptLoader.getPrompt("vegalite", diagramType),
  },
  dbml: {
    generate: (diagramType: DiagramType) => promptLoader.getPrompt("dbml", diagramType),
  },
} as const;

/**
 * 获取生成 prompt (向后兼容)
 *
 * 返回完整的 prompt: 任务上下文 + L1 + L2 + L3
 * 不包含用户输入（用户输入由 AI 服务单独传递）
 *
 * @param renderLanguage - 渲染语言
 * @param diagramType - 图表类型
 * @returns 完整的 prompt 文本
 */
export function getGeneratePrompt(
  renderLanguage: RenderLanguage,
  diagramType: DiagramType
): string {
  // 构建完整 prompt（不包含用户输入）
  return promptLoader.buildFullPromptWithoutUserInput(renderLanguage, diagramType);
}

/**
 * 获取完整 prompt (推荐使用)
 *
 * @param renderLanguage - 渲染语言
 * @param diagramType - 图表类型
 * @param userInput - 用户输入
 * @returns 完整的 prompt 文本
 *
 * @example
 * ```typescript
 * const prompt = getFullPrompt('mermaid', 'flowchart', '用户登录流程');
 * ```
 */
export function getFullPrompt(
  renderLanguage: RenderLanguage,
  diagramType: DiagramType,
  userInput: string
): string {
  return promptLoader.buildFullPrompt(renderLanguage, diagramType, userInput);
}
