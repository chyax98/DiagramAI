/**
 * Graphviz 提示词模块导出
 *
 * 包含：
 * - L2 语言规范（common.ts）
 * - L3 图表类型（flowchart.ts、state.ts、tree.ts、architecture.ts、network.ts）
 */

export { GRAPHVIZ_COMMON_PROMPT } from "./common";
export { GRAPHVIZ_FLOWCHART_PROMPT } from "./flowchart";
export { GRAPHVIZ_STATE_PROMPT } from "./state";
export { GRAPHVIZ_TREE_PROMPT } from "./tree";
export { GRAPHVIZ_ARCHITECTURE_PROMPT } from "./architecture";
export { GRAPHVIZ_NETWORK_PROMPT } from "./network";

// ============================================
// PromptConfig 导出（供主 index.ts 使用）
// ============================================

import type { DiagramType } from "@/lib/constants/diagram-types";
import type { PromptConfig } from "../types";
import { UNIVERSAL_PROMPT } from "../common";
import { GRAPHVIZ_COMMON_PROMPT } from "./common";
import { GRAPHVIZ_FLOWCHART_PROMPT } from "./flowchart";
import { GRAPHVIZ_STATE_PROMPT } from "./state";
import { GRAPHVIZ_TREE_PROMPT } from "./tree";
import { GRAPHVIZ_ARCHITECTURE_PROMPT } from "./architecture";
import { GRAPHVIZ_NETWORK_PROMPT } from "./network";

/**
 * 根据图表类型选择合适的 L3 提示词
 * 每种图表类型对应一个专用的 L3 Prompt
 */
function getGraphvizL3Prompt(diagramType: string): string {
  switch (diagramType) {
    case "flowchart":
      return GRAPHVIZ_FLOWCHART_PROMPT;

    case "state":
      return GRAPHVIZ_STATE_PROMPT;

    case "tree":
      return GRAPHVIZ_TREE_PROMPT;

    case "architecture":
      return GRAPHVIZ_ARCHITECTURE_PROMPT;

    case "network":
      return GRAPHVIZ_NETWORK_PROMPT;

    default:
      // 默认使用流程图
      return GRAPHVIZ_FLOWCHART_PROMPT;
  }
}

/**
 * 获取 Graphviz 图表的完整提示词（任务上下文 + L1 + L2 + L3）
 */
function getGraphvizPrompt(diagramType: DiagramType): string {
  const taskContext = buildTaskContext("graphviz", diagramType);
  const l1 = UNIVERSAL_PROMPT;
  const l2 = GRAPHVIZ_COMMON_PROMPT;
  const l3 = getGraphvizL3Prompt(diagramType);

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
 * Graphviz Prompts 配置对象
 *
 * 实现 PromptConfig<"graphviz"> 接口，供 DIAGRAM_PROMPTS 使用
 */
export const graphvizPrompts: PromptConfig<"graphviz"> = {
  generate: (diagramType) => {
    return getGraphvizPrompt(diagramType);
  },
};
