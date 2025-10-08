/**
 * 图表对话 API 验证 schemas
 *
 * 设计要点：
 * - 智能路由：sessionId 为空时要求 diagramType，否则可选
 * - 长度限制：userMessage 最大 MAX_INPUT_TEXT_LENGTH
 */

import { z } from "zod";
import { MAX_INPUT_TEXT_LENGTH } from "@/lib/constants/env";
import { RenderLanguageSchema } from "@/lib/constants/diagram-validation";

export const ChatRequestSchema = z
  .object({
    userMessage: z
      .string()
      .min(1, "用户消息不能为空")
      .max(
        MAX_INPUT_TEXT_LENGTH,
        `用户消息不能超过 ${MAX_INPUT_TEXT_LENGTH.toLocaleString()} 个字符`
      ),

    sessionId: z
      .number()
      .int("会话 ID 必须是整数")
      .positive("会话 ID 必须是正数")
      .optional()
      .nullable(),

    renderLanguage: RenderLanguageSchema,

    diagramType: z.string().min(1, "图表类型不能为空").max(50, "图表类型最多 50 个字符").optional(),

    modelId: z.number().int("模型 ID 必须是整数").positive("模型 ID 必须是正数"),
  })
  .refine(
    (data) => {
      // 首次生成（无 sessionId）时必须提供 diagramType
      if (!data.sessionId) {
        return !!data.diagramType;
      }
      return true;
    },
    {
      message: "首次生成时必须提供 diagramType",
      path: ["diagramType"],
    }
  );

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
