/**
 * WaveDrom 提示词统一导出
 *
 * 导出结构：
 * - WAVEDROM_COMMON_PROMPT: L2 WaveDrom 语言通用规范
 * - WAVEDROM_[TYPE]_PROMPT: L3 各图表类型生成要求
 * - getWaveDromPrompt: 辅助函数，根据图表类型获取完整提示词
 */

import type { DiagramType } from "@/lib/constants/diagram-types";
import { UNIVERSAL_PROMPT } from "../common";
import { WAVEDROM_COMMON_PROMPT } from "./common";
import { WAVEDROM_TIMING_PROMPT } from "./timing";
import { WAVEDROM_SIGNAL_PROMPT } from "./signal";
import { WAVEDROM_REGISTER_PROMPT } from "./register";

// ============================================
// L2: WaveDrom 语言通用规范
// ============================================
export { WAVEDROM_COMMON_PROMPT };

// ============================================
// L3: 各图表类型生成要求
// ============================================
export { WAVEDROM_TIMING_PROMPT };
export { WAVEDROM_SIGNAL_PROMPT };
export { WAVEDROM_REGISTER_PROMPT };

// ============================================
// 图表类型映射
// ============================================

/**
 * WaveDrom 图表类型枚举
 */
const WaveDromDiagramType = {
  TIMING: "timing",
  SIGNAL: "signal",
  REGISTER: "register",
} as const;

/**
 * WaveDrom 图表类型到 L3 提示词的映射
 */
const DIAGRAM_PROMPT_MAP: Record<string, string> = {
  [WaveDromDiagramType.TIMING]: WAVEDROM_TIMING_PROMPT,
  [WaveDromDiagramType.SIGNAL]: WAVEDROM_SIGNAL_PROMPT,
  [WaveDromDiagramType.REGISTER]: WAVEDROM_REGISTER_PROMPT,
};

// ============================================
// 辅助函数
// ============================================

/**
 * 获取 WaveDrom 图表的完整提示词（L1 + L2 + L3）
 *
 * @param diagramType - 图表类型（如 "timing", "signal", "register"）
 * @returns 完整的三层提示词
 *
 * @example
 * ```typescript
 * const prompt = getWaveDromPrompt("timing");
 * // 返回: L1 通用规范 + L2 WaveDrom 语言 + L3 Timing 要求
 * ```
 */
export function getWaveDromPrompt(diagramType: DiagramType): string {
  // L1: 通用规范（所有图表共享）
  const l1 = UNIVERSAL_PROMPT;

  // L2: WaveDrom 语言规范（所有 WaveDrom 图表共享）
  const l2 = WAVEDROM_COMMON_PROMPT;

  // L3: 图表类型特定要求
  const l3 = DIAGRAM_PROMPT_MAP[diagramType];

  // 如果找不到对应的 L3 提示词，使用默认提示
  if (!l3) {
    console.warn(
      `[WaveDrom Prompt] 未找到图表类型 "${diagramType}" 的 L3 提示词，使用默认提示`
    );
    return [l1, l2, getDefaultWaveDromPrompt(diagramType)]
      .filter((p) => p.length > 0)
      .join("\n\n---\n\n");
  }

  // 组合三层提示词
  return [l1, l2, l3]
    .filter((p) => p.length > 0)
    .join("\n\n---\n\n");
}

/**
 * 获取默认 WaveDrom 提示词（回退方案）
 *
 * @param diagramType - 图表类型
 * @returns 基础提示词
 */
function getDefaultWaveDromPrompt(diagramType: string): string {
  return `
# WaveDrom ${diagramType} 生成要求

⚠️ **注意**: 该图表类型的专用提示词尚未开发完成，使用默认提示。

## 基础要求

1. **JSON 格式**: 必须是严格的 JSON 格式，所有键和字符串值使用双引号
2. **Wave 长度**: 同一时序图中所有信号的 wave 字符串长度必须相同
3. **数据标签**: 使用 2-9 数据符号时，必须提供对应的 data 数组
4. **可渲染性**: 确保代码可以直接通过 Kroki 渲染

## 参考资源

- [WaveDrom 官方文档](https://wavedrom.com/)
- [Kroki 渲染测试](https://kroki.io/)

## 输出格式

直接输出 JSON 代码，不添加任何额外说明。
`;
}

/**
 * 获取所有已支持的 WaveDrom 图表类型
 *
 * @returns 已支持的图表类型列表
 */
export function getSupportedWaveDromTypes(): string[] {
  return Object.keys(DIAGRAM_PROMPT_MAP);
}

/**
 * 检查指定图表类型是否已支持
 *
 * @param diagramType - 图表类型
 * @returns 是否已支持
 */
export function isWaveDromTypeSupported(diagramType: string): boolean {
  return diagramType in DIAGRAM_PROMPT_MAP;
}

