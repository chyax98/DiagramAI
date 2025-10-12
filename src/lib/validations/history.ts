/**
 * 历史记录相关的 Zod 验证 schemas
 *
 * 用于验证历史记录保存等请求
 */

import { z } from "zod";
import { RENDER_LANGUAGES } from "@/lib/constants/diagram-types";
import type { RenderLanguage } from "@/types/diagram";

/**
 * 渲染语言验证（从 RENDER_LANGUAGES 动态生成，遵循 SSOT 原则）
 */
const renderLanguageValues = RENDER_LANGUAGES.map((lang) => lang.value) as [
  RenderLanguage,
  ...RenderLanguage[],
];

const RenderLanguageSchema = z.enum(renderLanguageValues, {
  errorMap: () => ({
    message: `渲染语言必须是以下之一: ${renderLanguageValues.join("、")}`,
  }),
});

/**
 * 保存历史记录请求验证
 */
export const SaveHistoryRequestSchema = z.object({
  inputText: z.string().min(1, "输入文本不能为空").max(5000, "输入文本最多 5000 个字符"),
  renderLanguage: RenderLanguageSchema,
  diagramType: z.string().max(50, "图表类型最多 50 个字符").optional().nullable(),
  generatedCode: z.string().min(1, "图表代码不能为空"),
  modelId: z
    .number()
    .int("模型 ID 必须是整数")
    .positive("模型 ID 必须是正数")
    .optional()
    .nullable(),
});

export type SaveHistoryRequest = z.infer<typeof SaveHistoryRequestSchema>;
