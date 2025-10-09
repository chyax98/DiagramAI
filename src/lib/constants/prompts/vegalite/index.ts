/**
 * Vega-Lite Prompts Index
 *
 * 导出所有 Vega-Lite 子图的 prompt
 * 架构：L2（语言规范） + L3（各子图）
 *
 * 支持的图表类型：
 * - Bar Chart（柱状图）- P0
 * - Line Chart（折线图）- P0
 * - Scatter Plot（散点图）- P1
 * - Area Chart（面积图）- P1
 * - Pie Chart（饼图）- P1
 * - Heatmap（热力图）- P2
 */

// L2: Vega-Lite 语言规范
export { VEGALITE_COMMON_SPEC } from "./common";

// L3: 各子图类型 prompt
export { VEGALITE_BAR_PROMPT } from "./bar";
export { VEGALITE_LINE_PROMPT } from "./line";
export { VEGALITE_POINT_PROMPT } from "./point";
export { VEGALITE_AREA_PROMPT } from "./area";
export { VEGALITE_PIE_PROMPT } from "./pie";
export { VEGALITE_HEATMAP_PROMPT } from "./heatmap";

// 内部函数导入
import { VEGALITE_COMMON_SPEC } from "./common";
import { VEGALITE_BAR_PROMPT } from "./bar";
import { VEGALITE_LINE_PROMPT } from "./line";
import { VEGALITE_POINT_PROMPT } from "./point";
import { VEGALITE_AREA_PROMPT } from "./area";
import { VEGALITE_PIE_PROMPT } from "./pie";
import { VEGALITE_HEATMAP_PROMPT } from "./heatmap";

/**
 * Vega-Lite 子图映射表
 *
 * 用于根据 diagramType 动态获取对应的 prompt
 */
export const VEGALITE_PROMPTS_MAP = {
  bar: "VEGALITE_BAR_PROMPT",
  line: "VEGALITE_LINE_PROMPT",
  point: "VEGALITE_POINT_PROMPT",
  scatter: "VEGALITE_POINT_PROMPT", // scatter 是 point 的别名（符合 diagram-types.ts）
  area: "VEGALITE_AREA_PROMPT",
  pie: "VEGALITE_PIE_PROMPT",
  arc: "VEGALITE_PIE_PROMPT", // arc 是 pie 的底层标记
  heatmap: "VEGALITE_HEATMAP_PROMPT",
  rect: "VEGALITE_HEATMAP_PROMPT", // rect 可用于热力图
} as const;

/**
 * 获取 Vega-Lite 完整 prompt
 *
 * @param diagramType - 图表类型（bar、line、scatter 等）
 * @returns 完整的 prompt（L1 + L2 + L3）
 *
 * @example
 * ```ts
 * const prompt = getVegalitePrompt("bar");
 * // 返回: COMMON_PROMPT + VEGALITE_COMMON_SPEC + VEGALITE_BAR_PROMPT
 * ```
 */
export function getVegalitePrompt(diagramType: string): string {
  // L1 通用规范需要从上层导入
  // 这里仅返回 L2 + L3
  const normalizedType = diagramType.toLowerCase();

  let l3Prompt = "";

  switch (normalizedType) {
    case "bar":
      l3Prompt = VEGALITE_BAR_PROMPT;
      break;
    case "line":
      l3Prompt = VEGALITE_LINE_PROMPT;
      break;
    case "point":
    case "scatter":
      l3Prompt = VEGALITE_POINT_PROMPT;
      break;
    case "area":
      l3Prompt = VEGALITE_AREA_PROMPT;
      break;
    case "pie":
    case "arc":
      l3Prompt = VEGALITE_PIE_PROMPT;
      break;
    case "heatmap":
    case "rect":
      l3Prompt = VEGALITE_HEATMAP_PROMPT;
      break;
    default:
      // 默认使用柱状图 prompt
      l3Prompt = VEGALITE_BAR_PROMPT;
  }

  // 组合 L2 + L3
  return `${VEGALITE_COMMON_SPEC}\n\n${l3Prompt}`;
}

/**
 * Vega-Lite 图表类型列表
 */
export const VEGALITE_CHART_TYPES = [
  { value: "bar", label: "柱状图 (Bar Chart)", priority: "P0" },
  { value: "line", label: "折线图 (Line Chart)", priority: "P0" },
  { value: "scatter", label: "散点图 (Scatter Plot)", priority: "P1" },
  { value: "area", label: "面积图 (Area Chart)", priority: "P1" },
  { value: "pie", label: "饼图 (Pie Chart)", priority: "P1" },
  { value: "heatmap", label: "热力图 (Heatmap)", priority: "P2" },
] as const;

// ============================================
// PromptConfig 导出（供主 index.ts 使用）
// ============================================

import type { PromptConfig } from "../types";
import { UNIVERSAL_PROMPT } from "../common";

/**
 * 获取 Vega-Lite 图表的完整提示词（L1 + L2 + L3）
 */
function getVegalitePromptComplete(diagramType: string): string {
  const l1 = UNIVERSAL_PROMPT;
  const l2 = VEGALITE_COMMON_SPEC;
  const l3 = getVegalitePrompt(diagramType);
  
  return [l1, l2, l3]
    .filter((p) => p.length > 0)
    .join("\n\n---\n\n");
}

/**
 * Vega-Lite Prompts 配置对象
 * 
 * 实现 PromptConfig<"vegalite"> 接口，供 DIAGRAM_PROMPTS 使用
 */
export const vegalitePrompts: PromptConfig<"vegalite"> = {
  generate: (diagramType) => {
    return getVegalitePromptComplete(diagramType);
  },
};

