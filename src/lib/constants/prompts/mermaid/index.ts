/**
 * Mermaid 提示词统一导出
 *
 * 导出结构：
 * - MERMAID_LANGUAGE_PROMPT: L2 Mermaid 语言通用规范
 * - MERMAID_[TYPE]_PROMPT: L3 各图表类型生成要求
 * - getMermaidPrompt: 辅助函数，根据图表类型获取完整提示词
 */

import type { DiagramType } from "@/lib/constants/diagram-types";
import { UNIVERSAL_PROMPT } from "../common";
import { MERMAID_LANGUAGE_PROMPT } from "./common";
import { MERMAID_FLOWCHART_PROMPT } from "./flowchart";
import { MERMAID_SEQUENCE_PROMPT } from "./sequence";
import { MERMAID_CLASS_PROMPT } from "./class";
import { MERMAID_STATE_PROMPT } from "./state";
import { MERMAID_ER_PROMPT } from "./er";
import { MERMAID_GANTT_PROMPT } from "./gantt";
import { MERMAID_PIE_PROMPT } from "./pie";
import { MERMAID_MINDMAP_PROMPT } from "./mindmap";
import { MERMAID_TIMELINE_PROMPT } from "./timeline";
import { MERMAID_QUADRANT_PROMPT } from "./quadrant";
import { MERMAID_SANKEY_PROMPT } from "./sankey";
import { MERMAID_XYCHART_PROMPT } from "./xychart";

// ============================================
// L2: Mermaid 语言通用规范
// ============================================
export { MERMAID_LANGUAGE_PROMPT };

// ============================================
// L3: 各图表类型生成要求
// ============================================
export { MERMAID_FLOWCHART_PROMPT };
export { MERMAID_SEQUENCE_PROMPT } from "./sequence";
export { MERMAID_CLASS_PROMPT } from "./class";
export { MERMAID_STATE_PROMPT } from "./state";
export { MERMAID_ER_PROMPT } from "./er";
export { MERMAID_GANTT_PROMPT } from "./gantt";
export { MERMAID_PIE_PROMPT } from "./pie";
export { MERMAID_MINDMAP_PROMPT } from "./mindmap";
export { MERMAID_TIMELINE_PROMPT } from "./timeline";
export { MERMAID_QUADRANT_PROMPT } from "./quadrant";
export { MERMAID_SANKEY_PROMPT } from "./sankey";
export { MERMAID_XYCHART_PROMPT } from "./xychart";

// ============================================
// 图表类型映射
// ============================================

/**
 * Mermaid 图表类型枚举
 */
const MermaidDiagramType = {
  FLOWCHART: "flowchart",
  SEQUENCE: "sequence",
  CLASS: "class",
  STATE: "state",
  ER: "er",
  GANTT: "gantt",
  PIE: "pie",
  MINDMAP: "mindmap",
  TIMELINE: "timeline",
  QUADRANT: "quadrant",
  SANKEY: "sankey",
  XYCHART: "xychart",
} as const;

/**
 * Mermaid 图表类型到 L3 提示词的映射
 */
const DIAGRAM_PROMPT_MAP: Record<string, string> = {
  [MermaidDiagramType.FLOWCHART]: MERMAID_FLOWCHART_PROMPT,
  [MermaidDiagramType.SEQUENCE]: MERMAID_SEQUENCE_PROMPT,
  [MermaidDiagramType.CLASS]: MERMAID_CLASS_PROMPT,
  [MermaidDiagramType.STATE]: MERMAID_STATE_PROMPT,
  [MermaidDiagramType.ER]: MERMAID_ER_PROMPT,
  [MermaidDiagramType.GANTT]: MERMAID_GANTT_PROMPT,
  [MermaidDiagramType.PIE]: MERMAID_PIE_PROMPT,
  [MermaidDiagramType.MINDMAP]: MERMAID_MINDMAP_PROMPT,
  [MermaidDiagramType.TIMELINE]: MERMAID_TIMELINE_PROMPT,
  [MermaidDiagramType.QUADRANT]: MERMAID_QUADRANT_PROMPT,
  [MermaidDiagramType.SANKEY]: MERMAID_SANKEY_PROMPT,
  [MermaidDiagramType.XYCHART]: MERMAID_XYCHART_PROMPT,
};

// ============================================
// 辅助函数
// ============================================

/**
 * 获取 Mermaid 图表的完整提示词（L1 + L2 + L3）
 *
 * @param diagramType - 图表类型（如 "flowchart", "sequence"）
 * @returns 完整的三层提示词
 *
 * @example
 * ```typescript
 * const prompt = getMermaidPrompt("flowchart");
 * // 返回: L1 通用规范 + L2 Mermaid 语言 + L3 Flowchart 要求
 * ```
 */
export function getMermaidPrompt(diagramType: DiagramType): string {
  // L1: 通用规范（所有图表共享）
  const l1 = UNIVERSAL_PROMPT;

  // L2: Mermaid 语言规范（可选，所有 Mermaid 图表共享）
  const l2 = MERMAID_LANGUAGE_PROMPT;

  // L3: 图表类型特定要求
  const l3 = DIAGRAM_PROMPT_MAP[diagramType];

  // 如果找不到对应的 L3 提示词，使用默认提示
  if (!l3) {
    console.warn(
      `[Mermaid Prompt] 未找到图表类型 "${diagramType}" 的 L3 提示词，使用默认提示`
    );
    return [l1, l2, getDefaultMermaidPrompt(diagramType)]
      .filter((p) => p.length > 0)
      .join("\n\n---\n\n");
  }

  // 组合三层提示词
  return [l1, l2, l3]
    .filter((p) => p.length > 0)
    .join("\n\n---\n\n");
}

/**
 * 获取默认 Mermaid 提示词（当 L3 提示词未开发时的回退方案）
 *
 * @param diagramType - 图表类型
 * @returns 基础提示词
 */
function getDefaultMermaidPrompt(diagramType: string): string {
  return `
# Mermaid ${diagramType} 生成要求

⚠️ **注意**: 该图表类型的专用提示词尚未开发完成，使用默认提示。

## 基础要求

1. **语法规范**: 严格遵循 Mermaid ${diagramType} 官方语法
2. **节点 ID**: 使用英文字母或数字，不使用中文
3. **节点标签**: 使用清晰的中文描述
4. **可渲染性**: 确保代码可以直接通过 Kroki 渲染

## 参考资源

- [Mermaid 官方文档](https://mermaid.js.org/syntax/${diagramType}.html)
- [Kroki 渲染测试](https://kroki.io/)

## 输出格式

直接输出 Mermaid 代码，不添加任何额外说明。
`;
}

/**
 * 获取所有已支持的 Mermaid 图表类型
 *
 * @returns 已支持的图表类型列表
 */
export function getSupportedMermaidTypes(): string[] {
  return Object.keys(DIAGRAM_PROMPT_MAP);
}

/**
 * 检查指定图表类型是否已支持
 *
 * @param diagramType - 图表类型
 * @returns 是否已支持
 */
export function isMermaidTypeSupported(diagramType: string): boolean {
  return diagramType in DIAGRAM_PROMPT_MAP;
}
