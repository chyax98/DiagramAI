/**
 * Nomnoml 提示词统一导出
 *
 * 导出结构：
 * - NOMNOML_COMMON_PROMPT: L2 Nomnoml 语言通用规范
 * - NOMNOML_[TYPE]_PROMPT: L3 各图表类型生成要求
 * - getNomnomlPrompt: 辅助函数，根据图表类型获取完整提示词
 * - nomnomlPrompts: PromptConfig 对象，供 DiagramGenerationService 使用
 */

import type { DiagramType } from "@/lib/constants/diagram-types";
import type { PromptConfig } from "../types";
import { UNIVERSAL_PROMPT } from "../common";
import { NOMNOML_COMMON_PROMPT } from "./common";
import { NOMNOML_CLASS_PROMPT } from "./class";
import { NOMNOML_COMPONENT_PROMPT } from "./component";
import { NOMNOML_ARCHITECTURE_PROMPT } from "./architecture";

// ============================================
// L2: Nomnoml 语言通用规范
// ============================================
export { NOMNOML_COMMON_PROMPT };

// ============================================
// L3: 各图表类型生成要求
// ============================================
export { NOMNOML_CLASS_PROMPT };
export { NOMNOML_COMPONENT_PROMPT };
export { NOMNOML_ARCHITECTURE_PROMPT };

// ============================================
// 图表类型映射
// ============================================

/**
 * Nomnoml 图表类型枚举
 */
const NomnomlDiagramType = {
  CLASS: "class",
  COMPONENT: "component",
  ARCHITECTURE: "architecture",
} as const;

/**
 * Nomnoml 图表类型到 L3 提示词的映射
 */
const DIAGRAM_PROMPT_MAP: Record<string, string> = {
  [NomnomlDiagramType.CLASS]: NOMNOML_CLASS_PROMPT,
  [NomnomlDiagramType.COMPONENT]: NOMNOML_COMPONENT_PROMPT,
  [NomnomlDiagramType.ARCHITECTURE]: NOMNOML_ARCHITECTURE_PROMPT,
};

// ============================================
// 辅助函数
// ============================================

/**
 * 获取 Nomnoml 图表的完整提示词（L1 + L2 + L3）
 *
 * @param diagramType - 图表类型（如 "class", "component", "architecture"）
 * @returns 完整的三层提示词
 *
 * @example
 * ```typescript
 * const prompt = getNomnomlPrompt("class");
 * // 返回: L1 通用规范 + L2 Nomnoml 语言 + L3 Class 要求
 * ```
 */
export function getNomnomlPrompt(diagramType: DiagramType): string {
  // L1: 通用规范（所有图表共享）
  const l1 = UNIVERSAL_PROMPT;

  // L2: Nomnoml 语言规范（所有 Nomnoml 图表共享）
  const l2 = NOMNOML_COMMON_PROMPT;

  // L3: 图表类型特定要求
  const l3 = DIAGRAM_PROMPT_MAP[diagramType];

  // 如果找不到对应的 L3 提示词，使用默认提示
  if (!l3) {
    console.warn(
      `[Nomnoml Prompt] 未找到图表类型 "${diagramType}" 的 L3 提示词，使用默认提示`
    );
    return [l1, l2, getDefaultNomnomlPrompt(diagramType)]
      .filter((p) => p.length > 0)
      .join("\n\n---\n\n");
  }

  // 组合三层提示词
  return [l1, l2, l3]
    .filter((p) => p.length > 0)
    .join("\n\n---\n\n");
}

/**
 * 获取默认 Nomnoml 提示词（当 L3 提示词未开发时的回退方案）
 *
 * @param diagramType - 图表类型
 * @returns 基础提示词
 */
function getDefaultNomnomlPrompt(diagramType: string): string {
  return `
# Nomnoml ${diagramType} 生成要求

⚠️ **注意**: 该图表类型的专用提示词尚未开发完成，使用默认提示。

## 基础要求

1. **语法规范**: 严格遵循 Nomnoml 官方语法
2. **类名规范**: 类名使用 PascalCase，属性和方法使用 camelCase
3. **关联类型**: 正确使用 ->、-->、-:>、+->、o-> 等关联符号
4. **可渲染性**: 确保代码可以直接通过 Kroki 渲染

## 参考资源

- [Nomnoml 官网](https://www.nomnoml.com/)
- [Nomnoml GitHub](https://github.com/skanaar/nomnoml)
- [Kroki 渲染测试](https://kroki.io/)

## 输出格式

直接输出 Nomnoml 代码，不添加任何额外说明。
`;
}

/**
 * 获取所有已支持的 Nomnoml 图表类型
 *
 * @returns 已支持的图表类型列表
 */
export function getSupportedNomnomlTypes(): string[] {
  return Object.keys(DIAGRAM_PROMPT_MAP);
}

/**
 * 检查指定图表类型是否已支持
 *
 * @param diagramType - 图表类型
 * @returns 是否已支持
 */
export function isNomnomlTypeSupported(diagramType: string): boolean {
  return diagramType in DIAGRAM_PROMPT_MAP;
}

// ============================================
// PromptConfig 导出（供 DiagramGenerationService 使用）
// ============================================

/**
 * Nomnoml Prompts 配置对象
 *
 * 实现 PromptConfig<"nomnoml"> 接口，供 DIAGRAM_PROMPTS 使用
 */
export const nomnomlPrompts: PromptConfig<"nomnoml"> = {
  generate: (diagramType) => {
    return getNomnomlPrompt(diagramType);
  },
};

