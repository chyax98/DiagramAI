import { z } from "zod";

const BaseModelSchema = z.object({
  name: z.string().min(1, "模型名称不能为空").max(50, "模型名称最多 50 个字符"),

  provider: z.string().min(1, "请选择 AI 服务商"),

  api_endpoint: z
    .string()
    .url("请输入有效的 API 端点 URL")
    .startsWith("http", "API 端点必须以 http 或 https 开头"),

  model_id: z.string().min(1, "模型 ID 不能为空").max(100, "模型 ID 最多 100 个字符"),

  parameters: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "参数必须是有效的 JSON 格式" }
    ),
});

export const CreateModelSchema = BaseModelSchema.extend({
  api_key: z.string().min(1, "API 密钥不能为空").min(10, "API 密钥至少 10 个字符"),
});

export const EditModelSchema = BaseModelSchema.extend({
  api_key: z
    .string()
    .optional()
    .refine(
      (val) => {
        // 如果提供了密钥,至少 10 个字符
        if (val && val.trim() !== "") {
          return val.length >= 10;
        }
        return true;
      },
      { message: "API 密钥至少 10 个字符" }
    ),
});

export const ModelFormSchema = CreateModelSchema;

export type ModelFormData = z.infer<typeof ModelFormSchema>;
export type CreateModelData = z.infer<typeof CreateModelSchema>;
export type EditModelData = z.infer<typeof EditModelSchema>;
