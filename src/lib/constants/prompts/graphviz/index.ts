/**
 * Graphviz 提示词模块导出
 *
 * 包含：
 * - L2 语言规范（common.ts）
 * - L3 图表类型（digraph.ts、graph.ts）
 */

export { GRAPHVIZ_COMMON_PROMPT } from './common';
export { GRAPHVIZ_DIGRAPH_PROMPT } from './digraph';
export { GRAPHVIZ_GRAPH_PROMPT } from './graph';

// ============================================
// PromptConfig 导出（供主 index.ts 使用）
// ============================================

import type { DiagramType } from "@/lib/constants/diagram-types";
import type { PromptConfig } from "../types";
import { UNIVERSAL_PROMPT } from "../common";
import { GRAPHVIZ_COMMON_PROMPT } from "./common";
import { GRAPHVIZ_DIGRAPH_PROMPT } from "./digraph";
import { GRAPHVIZ_GRAPH_PROMPT } from "./graph";

/**
 * 根据图表类型选择合适的 L3 提示词
 */
function getGraphvizL3Prompt(diagramType: string): string {
  switch (diagramType) {
    case "flowchart":
    case "state":
    case "tree":
    case "architecture":
      // 有向图类型使用 digraph prompt
      return GRAPHVIZ_DIGRAPH_PROMPT;
    
    case "network":
      // 网络拓扑使用 graph prompt（无向图）
      return GRAPHVIZ_GRAPH_PROMPT;
    
    default:
      // 默认使用有向图
      return GRAPHVIZ_DIGRAPH_PROMPT;
  }
}

/**
 * 获取 Graphviz 图表的完整提示词（L1 + L2 + L3）
 */
function getGraphvizPrompt(diagramType: DiagramType): string {
  const l1 = UNIVERSAL_PROMPT;
  const l2 = GRAPHVIZ_COMMON_PROMPT;
  const l3 = getGraphvizL3Prompt(diagramType);
  
  return [l1, l2, l3]
    .filter((p) => p.length > 0)
    .join("\n\n---\n\n");
}

/**
 * Graphviz Prompts 配置对象
 * 
 * 实现 PromptConfig<"graphviz"> 接口，供 DIAGRAM_PROMPTS 使用
 */
export const graphvizPrompts: PromptConfig<"graphviz"> = {
  generate: (diagramType) => {
    return getGraphvizPrompt(diagramType);
  },
};

