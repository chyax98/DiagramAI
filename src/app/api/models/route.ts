import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/auth/middleware";
import { getDatabaseInstance } from "@/lib/db/client";
import { ModelRepository } from "@/lib/repositories/ModelRepository";
import { logger } from "@/lib/utils/logger";

const CreateModelSchema = z.object({
  name: z.string().min(1, "模型名称不能为空").max(50, "模型名称最多 50 个字符"),
  provider: z.enum(["openai", "gemini", "claude", "openai-compatible"]),
  api_endpoint: z.string().url("API 端点必须是有效的 URL"),
  api_key: z.string().min(1, "API Key 不能为空"),
  model_id: z.string().min(1, "模型 ID 不能为空"),
  parameters: z.string().optional(),
});

export const GET = withAuth(async (_request: NextRequest, user) => {
  try {
    const db = getDatabaseInstance();
    const modelRepo = new ModelRepository(db);
    const models = modelRepo.findByUserId(user.id);

    return NextResponse.json({ models });
  } catch (error) {
    logger.error("获取模型列表失败", error);
    return NextResponse.json({ error: "服务器错误,请稍后重试" }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    // 验证请求体
    const body = await request.json();
    const validation = CreateModelSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("; ");

      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { name, provider, api_endpoint, api_key, model_id, parameters } = validation.data;

    // 创建模型
    const db = getDatabaseInstance();
    const modelRepo = new ModelRepository(db);

    const modelId = modelRepo.create({
      user_id: user.id,
      name,
      provider,
      api_endpoint,
      api_key,
      model_id,
      parameters,
    });

    // 返回创建的模型
    const model = modelRepo.findById(modelId);

    return NextResponse.json({ model }, { status: 201 });
  } catch (error) {
    logger.error("创建模型失败", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "创建模型失败" },
      { status: 500 }
    );
  }
});
