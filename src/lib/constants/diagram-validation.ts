/**
 * 图表类型运行时验证 Schema
 *
 * 用于验证外部输入（API 请求、用户配置）的有效性
 */

import { z } from "zod";
import { LANGUAGE_DIAGRAM_TYPES, RENDER_LANGUAGES, type RenderLanguage } from "./diagram-types";

/**
 * 渲染语言 Zod Schema
 *
 * 从 RENDER_LANGUAGES 动态生成，保证与系统配置一致
 *
 * @example
 * ```ts
 * RenderLanguageSchema.parse('mermaid'); // ✅ 通过
 * RenderLanguageSchema.parse('invalid');  // ❌ 抛出错误
 * ```
 */
export const RenderLanguageSchema = z.enum(
  RENDER_LANGUAGES.map((lang) => lang.value) as [RenderLanguage, ...RenderLanguage[]]
);

/**
 * 提取所有有效的图表类型值
 */
const allDiagramTypes = Object.values(LANGUAGE_DIAGRAM_TYPES).flatMap((types) =>
  types.map((t) => t.value)
);

/**
 * 图表类型 Zod Schema
 *
 * 验证规则: 必须是任意渲染语言支持的图表类型之一
 *
 * @example
 * ```ts
 * DiagramTypeSchema.parse('flowchart'); // ✅ 通过
 * DiagramTypeSchema.parse('invalid');    // ❌ 抛出错误
 * ```
 */
export const DiagramTypeSchema = z.string().refine((val) => allDiagramTypes.includes(val), {
  message: `无效的图表类型，支持的类型: ${allDiagramTypes.join(", ")}`,
});

/**
 * 图表生成请求 Schema
 *
 * 用于验证 /api/chat/generate 请求体
 *
 * @example
 * ```ts
 * const validated = DiagramGenerationSchema.parse({
 *   renderLanguage: 'mermaid',
 *   diagramType: 'flowchart',
 *   inputText: '...',
 *   modelId: 1
 * });
 * ```
 */
export const DiagramGenerationSchema = z.object({
  renderLanguage: RenderLanguageSchema,
  diagramType: DiagramTypeSchema,
  inputText: z.string().min(1, "输入文本不能为空"),
  modelId: z.number().int().positive("模型 ID 必须为正整数"),
});

/**
 * 图表调整请求 Schema
 *
 * 用于验证 /api/chat/adjust 请求体
 */
export const DiagramAdjustmentSchema = z.object({
  sessionId: z.number().int().positive("会话 ID 必须为正整数"),
  adjustmentRequest: z.string().min(1, "调整要求不能为空"),
  modelId: z.number().int().positive("模型 ID 必须为正整数"),
});

/**
 * 验证渲染语言和图表类型的组合是否有效
 *
 * @param renderLanguage 渲染语言
 * @param diagramType 图表类型
 * @returns 验证结果和错误信息
 *
 * @example
 * ```ts
 * const result = validateDiagramCombination('mermaid', 'flowchart');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateDiagramCombination(
  renderLanguage: string,
  diagramType: string
): { valid: boolean; error?: string } {
  // 验证渲染语言
  const langResult = RenderLanguageSchema.safeParse(renderLanguage);
  if (!langResult.success) {
    return { valid: false, error: `无效的渲染语言: ${renderLanguage}` };
  }

  // 验证图表类型是否属于该渲染语言
  const supportedTypes = LANGUAGE_DIAGRAM_TYPES[langResult.data];
  const isSupported = supportedTypes.some((t) => t.value === diagramType);

  if (!isSupported) {
    const validTypes = supportedTypes.map((t) => t.value).join(", ");
    return {
      valid: false,
      error: `渲染语言 ${renderLanguage} 不支持图表类型 ${diagramType}。支持的类型: ${validTypes}`,
    };
  }

  return { valid: true };
}

/**
 * 类型守卫: 检查是否为有效的渲染语言
 * 返回类型从 constants 动态推导
 */
export function isValidRenderLanguage(value: unknown): value is RenderLanguage {
  return RenderLanguageSchema.safeParse(value).success;
}

/**
 * 类型守卫: 检查是否为有效的图表类型
 */
export function isValidDiagramType(value: unknown): value is string {
  return DiagramTypeSchema.safeParse(value).success;
}
