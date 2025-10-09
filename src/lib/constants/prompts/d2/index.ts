/**
 * D2 提示词模块导出
 *
 * 组织结构：
 * - L2: common.ts - D2 语言通用规范
 * - L3: 各种图表类型的具体要求（符合 diagram-types.ts 定义）
 *   - flowchart.ts - 流程图
 *   - sequence.ts - 时序图
 *   - architecture.ts - 系统架构图
 *   - network.ts - 网络拓扑图
 */

export { D2_COMMON_PROMPT } from "./common";
export { D2_FLOWCHART_PROMPT } from "./flowchart";
export { D2_SEQUENCE_PROMPT } from "./sequence";
export { D2_ARCHITECTURE_PROMPT } from "./architecture";
export { D2_NETWORK_PROMPT } from "./network";

// ============================================
// PromptConfig 导出（供主 index.ts 使用）
// ============================================

import type { DiagramType } from "@/lib/constants/diagram-types";
import type { PromptConfig } from "../types";
import { UNIVERSAL_PROMPT } from "../common";
import { D2_COMMON_PROMPT } from "./common";
import { D2_FLOWCHART_PROMPT } from "./flowchart";
import { D2_SEQUENCE_PROMPT } from "./sequence";
import { D2_ARCHITECTURE_PROMPT } from "./architecture";
import { D2_NETWORK_PROMPT } from "./network";

/**
 * 获取 D2 图表的完整提示词（L1 + L2 + L3）
 */
function getD2Prompt(diagramType: DiagramType): string {
  const l1 = UNIVERSAL_PROMPT;
  const l2 = D2_COMMON_PROMPT;
  
  const promptMap: Record<string, string> = {
    flowchart: D2_FLOWCHART_PROMPT,
    sequence: D2_SEQUENCE_PROMPT,
    architecture: D2_ARCHITECTURE_PROMPT,
    network: D2_NETWORK_PROMPT,
  };
  
  const l3 = promptMap[diagramType] || D2_FLOWCHART_PROMPT;
  
  return [l1, l2, l3]
    .filter((p) => p.length > 0)
    .join("\n\n---\n\n");
}

/**
 * D2 Prompts 配置对象
 * 
 * 实现 PromptConfig<"d2"> 接口，供 DIAGRAM_PROMPTS 使用
 */
export const d2Prompts: PromptConfig<"d2"> = {
  generate: (diagramType) => {
    return getD2Prompt(diagramType);
  },
};

