/**
 * 渲染失败日志 API
 *
 * GET /api/render-failures - 查询失败日志列表
 * POST /api/render-failures - 创建失败日志 (用户手动报告)
 */

import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/utils/api-response";
import { RenderFailureLogRepository } from "@/lib/repositories/RenderFailureLogRepository";
import { PromptRepository } from "@/lib/repositories/PromptRepository";
import { getDatabaseInstance } from "@/lib/db/client";
import { z } from "zod";

/**
 * 查询参数验证
 */
const querySchema = z.object({
  limit: z.coerce.number().min(1).max(200).default(50),
  renderLanguage: z.string().optional(),
  diagramType: z.string().optional(),
});

/**
 * GET /api/render-failures
 *
 * 查询当前用户的渲染失败日志列表
 *
 * Query 参数:
 * - limit: 返回数量 (默认 50, 最大 200)
 * - renderLanguage: 按渲染语言筛选 (可选)
 * - diagramType: 按图表类型筛选 (可选)
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     "logs": [RenderFailureLog],
 *     "total": number
 *   }
 * }
 */
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const params = querySchema.parse({
      limit: searchParams.get("limit"),
      renderLanguage: searchParams.get("renderLanguage"),
      diagramType: searchParams.get("diagramType"),
    });

    const db = getDatabaseInstance();
    const repo = new RenderFailureLogRepository(db);

    let logs;

    // 根据筛选条件查询
    if (params.renderLanguage && params.diagramType) {
      // 按语言和类型筛选
      logs = repo.findByLanguageAndType(params.renderLanguage, params.diagramType, params.limit);
    } else {
      // 查询用户所有失败日志
      logs = repo.findByUserId(user.id, params.limit);
    }

    // 统计总数
    const total = repo.countByUserId(user.id);

    return successResponse({
      logs,
      total,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("查询参数验证失败", ErrorCodes.VALIDATION_ERROR, 400, error.errors);
    }

    return errorResponse(
      error instanceof Error ? error.message : "查询失败日志失败",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
});

/**
 * 创建失败日志请求体验证
 */
const createSchema = z.object({
  userInput: z.string().min(1),
  renderLanguage: z.string().min(1),
  diagramType: z.string().min(1),
  generatedCode: z.string().min(1),
  errorMessage: z.string().min(1),
  aiProvider: z.string().min(1),
  aiModel: z.string().min(1),
});

/**
 * POST /api/render-failures
 *
 * 创建失败日志 (用户手动报告失败案例)
 *
 * Request Body:
 * {
 *   "userInput": string,
 *   "renderLanguage": string,
 *   "diagramType": string,
 *   "generatedCode": string,
 *   "errorMessage": string,
 *   "aiProvider": string,
 *   "aiModel": string
 * }
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": { "id": number }
 * }
 */
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const validated = createSchema.parse(body);

    const db = getDatabaseInstance();
    const failureRepo = new RenderFailureLogRepository(db);
    const promptRepo = new PromptRepository(db);

    // 查询当前激活的 Prompt ID (用于记录使用的 Prompt 版本)
    const l1 = promptRepo.findActive(1);
    const l2 = promptRepo.findActive(2, validated.renderLanguage);
    const l3 = promptRepo.findActive(3, validated.renderLanguage, validated.diagramType);

    // 创建失败日志
    const logId = failureRepo.create({
      user_id: user.id,
      user_input: validated.userInput,
      render_language: validated.renderLanguage,
      diagram_type: validated.diagramType,
      generated_code: validated.generatedCode,
      error_message: validated.errorMessage,
      ai_provider: validated.aiProvider,
      ai_model: validated.aiModel,
      prompt_l1_id: l1?.id ?? null,
      prompt_l2_id: l2?.id ?? null,
      prompt_l3_id: l3?.id ?? null,
    });

    return successResponse({ id: logId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("请求参数验证失败", ErrorCodes.VALIDATION_ERROR, 400, error.errors);
    }

    return errorResponse(
      error instanceof Error ? error.message : "创建失败日志失败",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
});
