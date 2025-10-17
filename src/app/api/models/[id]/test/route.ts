import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { withAuthParams } from "@/lib/auth/middleware";
import { getDatabaseInstance } from "@/lib/db/client";
import { ModelRepository } from "@/lib/repositories/ModelRepository";
import { getAIProvider, validateProviderConfig } from "@/lib/ai/provider-factory";
import { API_TEST_TIMEOUT } from "@/lib/constants/env";
import { logger } from "@/lib/utils/logger";

export const POST = withAuthParams(async (_request: NextRequest, user, params) => {
  const modelId = parseInt(params.id as string, 10);

  if (isNaN(modelId)) {
    return NextResponse.json({ success: false, error: "无效的模型 ID" }, { status: 400 });
  }

  try {
    const db = getDatabaseInstance();
    const modelRepo = new ModelRepository(db);
    const modelConfig = modelRepo.findById(modelId);

    if (!modelConfig) {
      return NextResponse.json({ success: false, error: "模型不存在" }, { status: 404 });
    }

    // 权限检查
    if (modelConfig.user_id !== user.id) {
      return NextResponse.json({ success: false, error: "无权访问该模型" }, { status: 403 });
    }

    // 验证配置
    validateProviderConfig({
      provider: modelConfig.provider,
      model_id: modelConfig.model_id,
      api_key: modelConfig.api_key,
    });

    // 创建 AI Provider (使用 Vercel AI SDK)
    const model = getAIProvider({
      provider: modelConfig.provider,
      model_id: modelConfig.model_id,
      api_key: modelConfig.api_key,
      api_endpoint: modelConfig.api_endpoint,
    });

    const testPrompt = '你好,这是一条测试消息,请回复"OK"。';

    // 使用 Promise.race 实现超时控制
    const TIMEOUT_MS = API_TEST_TIMEOUT;
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `API 请求超时(${TIMEOUT_MS / 1000}秒) - 请检查 API 密钥、网络连接或 API 端点是否正确`
          )
        );
      }, TIMEOUT_MS);
    });

    // 使用 AI SDK 的 generateText 进行测试
    // maxRetries: 2 表示失败后会自动重试 2 次 (总共 3 次尝试)
    const result = await Promise.race([
      generateText({
        model,
        messages: [{ role: "user", content: testPrompt }],
        maxRetries: 2, // 自动重试 2 次,提高连接成功率
      }),
      timeoutPromise,
    ]);

    // 如果没有抛出错误,则连接成功
    return NextResponse.json({
      success: true,
      message: "连接测试成功",
      response: result.text.substring(0, 100), // 只返回前 100 个字符
    });
  } catch (error) {
    logger.error("测试连接失败", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "测试连接失败",
      },
      { status: 500 }
    );
  }
});
