/**
 * 单条渲染失败日志 API
 *
 * GET /api/render-failures/[id] - 查询单条失败日志详情 (包含完整 Prompt 内容)
 * DELETE /api/render-failures/[id] - 删除单条失败日志
 */

import { NextRequest } from "next/server";
import { withAuthParams } from "@/lib/auth/middleware";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/utils/api-response";
import { RenderFailureLogRepository } from "@/lib/repositories/RenderFailureLogRepository";
import { getDatabaseInstance } from "@/lib/db/client";

/**
 * GET /api/render-failures/[id]
 *
 * 查询单条失败日志详情,包含完整的 Prompt 内容 (L1/L2/L3)
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": {
 *     ...RenderFailureLog,
 *     "prompt_l1_content": string | null,
 *     "prompt_l2_content": string | null,
 *     "prompt_l3_content": string | null
 *   }
 * }
 */
export const GET = withAuthParams<{ id: string }>(async (_request: NextRequest, user, params) => {
  try {
    const logId = parseInt(params.id, 10);

    if (isNaN(logId)) {
      return errorResponse("无效的日志 ID", ErrorCodes.BAD_REQUEST, 400);
    }

    const db = getDatabaseInstance();
    const repo = new RenderFailureLogRepository(db);

    // 查询失败日志并 JOIN 获取 Prompt 内容
    const log = repo.findWithPrompts(logId);

    if (!log) {
      return errorResponse("失败日志不存在", ErrorCodes.NOT_FOUND, 404);
    }

    // 验证权限: 只能查看自己的日志
    if (log.user_id !== user.id) {
      return errorResponse("无权访问此日志", ErrorCodes.FORBIDDEN, 403);
    }

    return successResponse(log);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "查询失败日志详情失败",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
});

/**
 * DELETE /api/render-failures/[id]
 *
 * 删除单条失败日志
 *
 * 响应:
 * {
 *   "success": true,
 *   "data": { "deleted": true }
 * }
 */
export const DELETE = withAuthParams<{ id: string }>(
  async (_request: NextRequest, user, params) => {
    try {
      const logId = parseInt(params.id, 10);

      if (isNaN(logId)) {
        return errorResponse("无效的日志 ID", ErrorCodes.BAD_REQUEST, 400);
      }

      const db = getDatabaseInstance();
      const repo = new RenderFailureLogRepository(db);

      // 先查询日志,验证权限
      const log = repo.findById(logId);

      if (!log) {
        return errorResponse("失败日志不存在", ErrorCodes.NOT_FOUND, 404);
      }

      // 验证权限: 只能删除自己的日志
      if (log.user_id !== user.id) {
        return errorResponse("无权删除此日志", ErrorCodes.FORBIDDEN, 403);
      }

      // 执行删除
      const deleted = repo.delete(logId);

      if (!deleted) {
        return errorResponse("删除失败", ErrorCodes.INTERNAL_ERROR, 500);
      }

      return successResponse({ deleted: true });
    } catch (error) {
      return errorResponse(
        error instanceof Error ? error.message : "删除失败日志失败",
        ErrorCodes.INTERNAL_ERROR,
        500
      );
    }
  }
);
