import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuthParams } from "@/lib/auth/middleware";
import { getDatabaseInstance } from "@/lib/db/client";
import { ModelRepository } from "@/lib/repositories/ModelRepository";

import { logger } from "@/lib/utils/logger";

const UpdateModelSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  provider: z.enum(["openai", "anthropic", "gemini", "openai-compatible"]).optional(),
  api_endpoint: z.string().url().optional(),
  api_key: z.string().min(1).optional(),
  model_id: z.string().min(1).optional(),
  parameters: z.string().optional(),
});

export const GET = withAuthParams(async (_request: NextRequest, user, params) => {
  const modelId = parseInt(params.id as string, 10);

  if (isNaN(modelId)) {
    return NextResponse.json({ error: "无效的模型 ID" }, { status: 400 });
  }

  try {
    const db = getDatabaseInstance();
    const modelRepo = new ModelRepository(db);
    const model = modelRepo.findById(modelId);

    if (!model) {
      return NextResponse.json({ error: "模型不存在" }, { status: 404 });
    }

    // 权限检查
    if (model.user_id !== user.id) {
      return NextResponse.json({ error: "无权访问该模型" }, { status: 403 });
    }

    return NextResponse.json(
      { model },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    logger.error("获取模型失败:", error);
    return NextResponse.json({ error: "服务器错误,请稍后重试" }, { status: 500 });
  }
});

export const PATCH = withAuthParams(async (request: NextRequest, user, params) => {
  const modelId = parseInt(params.id as string, 10);

  if (isNaN(modelId)) {
    return NextResponse.json({ error: "无效的模型 ID" }, { status: 400 });
  }

  try {
    // 验证请求体
    const body = await request.json();
    const validation = UpdateModelSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("; ");

      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const db = getDatabaseInstance();
    const modelRepo = new ModelRepository(db);
    const model = modelRepo.findById(modelId);

    if (!model) {
      return NextResponse.json({ error: "模型不存在" }, { status: 404 });
    }

    // 权限检查
    if (model.user_id !== user.id) {
      return NextResponse.json({ error: "无权访问该模型" }, { status: 403 });
    }

    // 更新模型
    modelRepo.update(modelId, validation.data);

    // 返回更新后的模型
    const updatedModel = modelRepo.findById(modelId);

    return NextResponse.json({ model: updatedModel });
  } catch (error) {
    logger.error("更新模型失败:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "更新模型失败" },
      { status: 500 }
    );
  }
});

export const DELETE = withAuthParams(async (_request: NextRequest, user, params) => {
  const modelId = parseInt(params.id as string, 10);

  if (isNaN(modelId)) {
    return NextResponse.json({ error: "无效的模型 ID" }, { status: 400 });
  }

  try {
    const db = getDatabaseInstance();
    const modelRepo = new ModelRepository(db);
    const model = modelRepo.findById(modelId);

    if (!model) {
      return NextResponse.json({ error: "模型不存在" }, { status: 404 });
    }

    // 权限检查
    if (model.user_id !== user.id) {
      return NextResponse.json({ error: "无权访问该模型" }, { status: 403 });
    }

    // 删除模型
    modelRepo.delete(modelId);

    return NextResponse.json({ message: "模型已删除" });
  } catch (error) {
    logger.error("删除模型失败:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "删除模型失败" },
      { status: 500 }
    );
  }
});
