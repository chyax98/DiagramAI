/**
 * Prompt 配置统一导出
 */

import type { RenderLanguage, DiagramType } from "@/lib/constants/diagram-types";
import { promptLoader } from "@/lib/utils/prompt-loader";

export * from "./types";
export { promptLoader };

/**
 * 获取生成 prompt
 *
 * 返回完整的 prompt: L1 + L2 + L3
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
  return promptLoader.buildFullPromptWithoutUserInput(renderLanguage, diagramType);
}
