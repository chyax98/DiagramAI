/**
 * /api/history - 历史记录列表和保存
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { getDatabaseInstance } from "@/lib/db/client";
import { HistoryRepository } from "@/lib/repositories/HistoryRepository";
import { SaveHistoryRequestSchema } from "@/lib/validations/history";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  ErrorCodes,
} from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";

export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const db = getDatabaseInstance();
    const historyRepo = new HistoryRepository(db);

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const language = searchParams.get("language") || "all";
    const sort = searchParams.get("sort") || "newest";

    // 计算偏移量
    const offset = (page - 1) * limit;

    // 获取历史记录（带分页）
    let histories;
    let total;

    if (language === "all") {
      histories = historyRepo.findRecentByUserId(user.id, limit, offset);
      total = historyRepo.countByUserId(user.id);
    } else {
      // 如果指定了语言，使用语言筛选
      const allHistories = historyRepo.findRecentByUserId(user.id, 1000, 0); // 获取足够多的记录
      const filtered = allHistories.filter((h) => h.render_language === language); // ✅ 统一命名

      // 排序
      filtered.sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sort === "newest" ? timeB - timeA : timeA - timeB;
      });

      total = filtered.length;
      // 手动分页
      histories = filtered.slice(offset, offset + limit);
    }

    return NextResponse.json({
      histories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error("获取历史记录失败", error);
    return NextResponse.json({ error: "服务器错误,请稍后重试" }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();

    // 验证请求参数
    const validation = SaveHistoryRequestSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { inputText, renderLanguage, diagramType, generatedCode, modelId } = validation.data;

    const db = getDatabaseInstance();
    const historyRepo = new HistoryRepository(db);

    // 创建历史记录
    const historyId = historyRepo.create({
      user_id: user.id,
      input_text: inputText,
      render_language: renderLanguage,
      diagram_type: diagramType ?? null,
      generated_code: generatedCode,
      model_id: modelId ?? null,
    });

    return successResponse(
      {
        message: "保存成功",
        historyId,
      },
      201
    );
  } catch (error) {
    logger.error("保存历史记录失败", error);
    return errorResponse("服务器错误,请稍后重试", ErrorCodes.INTERNAL_ERROR, 500);
  }
});
