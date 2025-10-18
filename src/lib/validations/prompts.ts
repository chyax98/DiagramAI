/**
 * Prompt 管理相关验证 Schema
 */

import { z } from "zod";

/**
 * 创建提示词验证 Schema (前端请求)
 *
 * 说明:
 * - created_by 由 API 从 JWT 自动设置,前端不需要传递
 */
export const CreatePromptSchema = z.object({
  prompt_level: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    errorMap: () => ({ message: "提示词层级必须是 1, 2 或 3" }),
  }),

  render_language: z.string().optional(), // 不做枚举校验

  diagram_type: z.string().optional(), // 不做枚举校验

  name: z.string().min(1, "名称不能为空").max(100, "名称最多 100 个字符"),

  description: z.string().max(500, "描述最多 500 个字符").optional(),

  content: z.string().min(1, "提示词内容不能为空").max(50000, "提示词内容最多 50000 个字符"),

  is_active: z.boolean().optional(),
});

/**
 * 查询提示词验证 Schema
 */
export const QueryPromptSchema = z.object({
  level: z.coerce.number().int("层级必须是整数").min(1, "层级最小为 1").max(3, "层级最大为 3"),

  language: z.string().min(1, "渲染语言不能为空").optional(),

  type: z.string().min(1, "图表类型不能为空").optional(),
});

/**
 * 激活提示词版本验证 Schema
 */
export const ActivatePromptSchema = z.object({
  id: z.coerce.number().int("ID 必须是整数").positive("ID 必须大于 0"),
});

/**
 * 导出类型定义
 */
export type CreatePromptData = z.infer<typeof CreatePromptSchema>;
export type QueryPromptData = z.infer<typeof QueryPromptSchema>;
export type ActivatePromptData = z.infer<typeof ActivatePromptSchema>;
