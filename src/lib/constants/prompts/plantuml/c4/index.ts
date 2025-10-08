/**
 * C4-PlantUML 提示词统一导出
 *
 * 导出结构：
 * - C4_PLANTUML_LANGUAGE_PROMPT: L2 C4-PlantUML 语言通用规范
 * - C4_[TYPE]_PROMPT: L3 各子图类型生成要求
 * - getC4PlantUMLPrompt: 辅助函数，根据图表类型获取完整提示词
 */

import type { DiagramType } from "@/lib/constants/diagram-types";
import { UNIVERSAL_PROMPT } from "../../common";
import { PLANTUML_LANGUAGE_PROMPT } from "../common";
import { C4_PLANTUML_LANGUAGE_PROMPT } from "./common";
import { C4_CONTEXT_PROMPT } from "./context";
import { C4_CONTAINER_PROMPT } from "./container";
import { C4_COMPONENT_PROMPT } from "./component";
import { C4_DYNAMIC_PROMPT } from "./dynamic";
import { C4_DEPLOYMENT_PROMPT } from "./deployment";

// ============================================
// L2: C4-PlantUML 语言通用规范
// ============================================
export { C4_PLANTUML_LANGUAGE_PROMPT };

// ============================================
// L3: 各子图类型生成要求
// ============================================
export { C4_CONTEXT_PROMPT };
export { C4_CONTAINER_PROMPT };
export { C4_COMPONENT_PROMPT };
export { C4_DYNAMIC_PROMPT };
export { C4_DEPLOYMENT_PROMPT };

// ============================================
// 图表类型映射
// ============================================

/**
 * C4-PlantUML 子图类型枚举
 */
const C4DiagramType = {
  CONTEXT: "c4-context",
  CONTAINER: "c4-container",
  COMPONENT: "c4-component",
  DYNAMIC: "c4-dynamic",
  DEPLOYMENT: "c4-deployment",
} as const;

/**
 * C4-PlantUML 子图类型到 L3 提示词的映射
 */
const DIAGRAM_PROMPT_MAP: Record<string, string> = {
  [C4DiagramType.CONTEXT]: C4_CONTEXT_PROMPT,
  [C4DiagramType.CONTAINER]: C4_CONTAINER_PROMPT,
  [C4DiagramType.COMPONENT]: C4_COMPONENT_PROMPT,
  [C4DiagramType.DYNAMIC]: C4_DYNAMIC_PROMPT,
  [C4DiagramType.DEPLOYMENT]: C4_DEPLOYMENT_PROMPT,
};

// ============================================
// 辅助函数
// ============================================

/**
 * 获取 C4-PlantUML 图表的完整提示词（L1 + L2 PlantUML + L2 C4 + L3）
 *
 * @param diagramType - 图表类型（如 "c4-context", "c4-container"）
 * @returns 完整的提示词
 *
 * @example
 * ```typescript
 * const prompt = getC4PlantUMLPrompt("c4-context");
 * // 返回: L1 通用规范 + L2 PlantUML 语言 + L2 C4 语言 + L3 Context 要求
 * ```
 */
export function getC4PlantUMLPrompt(diagramType: DiagramType): string {
  // L1: 通用规范（所有图表共享）
  const l1 = UNIVERSAL_PROMPT;

  // L2a: PlantUML 语言规范（所有 PlantUML 图表共享）
  const l2a = PLANTUML_LANGUAGE_PROMPT;

  // L2b: C4-PlantUML 语言规范（所有 C4 图表共享）
  const l2b = C4_PLANTUML_LANGUAGE_PROMPT;

  // L3: 图表类型特定要求
  const l3 = DIAGRAM_PROMPT_MAP[diagramType];

  // 如果找不到对应的 L3 提示词，使用默认提示
  if (!l3) {
    console.warn(
      `[C4-PlantUML Prompt] 未找到图表类型 "${diagramType}" 的 L3 提示词，使用默认提示`
    );
    return [l1, l2a, l2b, getDefaultC4Prompt(diagramType)]
      .filter((p) => p.length > 0)
      .join("\n\n---\n\n");
  }

  // 组合提示词
  return [l1, l2a, l2b, l3]
    .filter((p) => p.length > 0)
    .join("\n\n---\n\n");
}

/**
 * 获取默认 C4-PlantUML 提示词（当 L3 提示词未开发时的回退方案）
 *
 * @param diagramType - 图表类型
 * @returns 基础提示词
 */
function getDefaultC4Prompt(diagramType: string): string {
  return `
# C4-PlantUML ${diagramType} 生成要求

⚠️ **注意**: 该图表类型的专用提示词尚未开发完成，使用默认提示。

## 基础要求

1. **语法规范**: 严格遵循 C4-PlantUML 官方语法
2. **include 声明**: 必须包含正确的 C4-PlantUML include
3. **元素定义**: 使用正确的 C4 元素类型（Person、System、Container、Component等）
4. **技术标注**: 包含完整的技术栈和描述信息
5. **可渲染性**: 确保代码可以直接通过 Kroki 渲染

## 参考资源

- [C4-PlantUML GitHub](https://github.com/plantuml-stdlib/C4-PlantUML)
- [C4 Model 官方文档](https://c4model.com/)
- [Kroki 渲染测试](https://kroki.io/)

## 输出格式

直接输出 C4-PlantUML 代码，不添加任何额外说明。
`;
}

/**
 * 获取所有已支持的 C4-PlantUML 图表类型
 *
 * @returns 已支持的图表类型列表
 */
export function getSupportedC4Types(): string[] {
  return Object.keys(DIAGRAM_PROMPT_MAP);
}

/**
 * 检查指定图表类型是否已支持
 *
 * @param diagramType - 图表类型
 * @returns 是否已支持
 */
export function isC4TypeSupported(diagramType: string): boolean {
  return diagramType in DIAGRAM_PROMPT_MAP;
}
