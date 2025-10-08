/**
 * /api/history/[id] - 单条历史记录操作
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuthParams } from "@/lib/auth/middleware";
import { getDatabaseInstance } from "@/lib/db/client";
import { HistoryRepository } from "@/lib/repositories/HistoryRepository";

import { logger } from "@/lib/utils/logger";

export const GET = withAuthParams<{ id: string }>(async (_request: NextRequest, user, params) => {
  try {
    const historyId = parseInt(params.id);

    if (isNaN(historyId)) {
      return NextResponse.json({ error: "无效的历史记录 ID" }, { status: 400 });
    }

    const db = getDatabaseInstance();
    const historyRepo = new HistoryRepository(db);

    const history = historyRepo.findById(historyId);

    if (!history) {
      return NextResponse.json({ error: "历史记录不存在" }, { status: 404 });
    }

    // 验证所有权
    if (history.user_id !== user.id) {
      return NextResponse.json({ error: "无权访问此历史记录" }, { status: 403 });
    }

    return NextResponse.json(history);
  } catch (error) {
    logger.error("获取历史记录失败:", error);
    return NextResponse.json({ error: "服务器错误,请稍后重试" }, { status: 500 });
  }
});

export const DELETE = withAuthParams<{ id: string }>(
  async (_request: NextRequest, user, params) => {
    try {
      const historyId = parseInt(params.id);

      if (isNaN(historyId)) {
        return NextResponse.json({ error: "无效的历史记录 ID" }, { status: 400 });
      }

      const db = getDatabaseInstance();
      const historyRepo = new HistoryRepository(db);

      // 先查询验证所有权
      const history = historyRepo.findById(historyId);

      if (!history) {
        return NextResponse.json({ error: "历史记录不存在" }, { status: 404 });
      }

      if (history.user_id !== user.id) {
        return NextResponse.json({ error: "无权删除此历史记录" }, { status: 403 });
      }

      // 删除
      historyRepo.delete(historyId);

      return NextResponse.json({ message: "删除成功" });
    } catch (error) {
      logger.error("删除历史记录失败:", error);
      return NextResponse.json({ error: "服务器错误,请稍后重试" }, { status: 500 });
    }
  }
);
