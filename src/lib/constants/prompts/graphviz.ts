/**
 * Graphviz/DOT Prompt v4.0 - 基于 DEPTH 方法论的三层架构
 *
 * 架构说明:
 * - L1: common.ts (通用规范，所有图表共享)
 * - L2: graphviz/common.ts (DOT 语言规范)
 * - L3: graphviz/[type].ts (各图表类型的具体规则)
 *
 * 改进:
 * 1. 采用 DEPTH 方法论，提高提示词质量
 * 2. 分离语言规范和图表规范，提高复用性
 * 3. 针对不同图表类型提供专门的提示词
 * 4. Token 预算优化：L1(750) + L2(480) + L3(1180) = 2410 tokens
 */

import { type PromptConfig } from "./types";
import { getDiagramTypesPromptText } from "@/lib/constants/diagram-types";
import {
  COMMON_TASK_RECOGNITION,
  COMMON_SUCCESS_CRITERIA,
  COMMON_GENERATION_FLOW,
  COMMON_ADJUSTMENT_FLOW,
  COMMON_OUTPUT_RULES,
} from "./common";
import {
  GRAPHVIZ_COMMON_PROMPT,
  GRAPHVIZ_DIGRAPH_PROMPT,
  GRAPHVIZ_GRAPH_PROMPT,
} from "./graphviz/index";

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

export const graphvizPrompts: PromptConfig<"graphviz"> = {
  generate: (diagramType) => `你是 Graphviz/DOT 图表设计专家，精通图论和可视化算法。

${COMMON_TASK_RECOGNITION}

**当前图表类型**: ${diagramType}

${COMMON_SUCCESS_CRITERIA}

${COMMON_GENERATION_FLOW}

${COMMON_ADJUSTMENT_FLOW}

---

## L2: Graphviz DOT 语言通用规范

${GRAPHVIZ_COMMON_PROMPT}

---

## L3: ${diagramType} 图表专项要求

${getGraphvizL3Prompt(diagramType)}

---

## 支持的图表类型
${getDiagramTypesPromptText("graphviz")}

${COMMON_OUTPUT_RULES}`,
};
