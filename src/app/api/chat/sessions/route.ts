import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { getDatabaseInstance } from "@/lib/db/client";
import { ChatSessionRepository } from "@/lib/repositories/ChatSessionRepository";
import type { UserPublic } from "@/types/database";

import { logger } from "@/lib/utils/logger";

export const POST = withAuth(async (request: NextRequest, user: UserPublic) => {
  try {
    const body = await request.json();
    const { generationHistoryId, sessionData, roundCount = 0 } = body;

    if (!sessionData) {
      return NextResponse.json({ error: "缺少必需参数: sessionData" }, { status: 400 });
    }

    const db = getDatabaseInstance();
    const sessionRepo = new ChatSessionRepository(db);

    const session = sessionRepo.create({
      userId: user.id,
      generationHistoryId,
      sessionData: typeof sessionData === "string" ? sessionData : JSON.stringify(sessionData),
      roundCount,
    });

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    logger.error("创建会话失败:", error);

    return NextResponse.json(
      {
        error: "创建失败",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
});

export const GET = withAuth(async (_request: NextRequest, user: UserPublic) => {
  try {
    const db = getDatabaseInstance();
    const sessionRepo = new ChatSessionRepository(db);

    const sessions = sessionRepo.findByUser(user.id);

    return NextResponse.json({
      success: true,
      sessions,
      total: sessions.length,
    });
  } catch (error) {
    logger.error("查询会话失败:", error);

    return NextResponse.json(
      {
        error: "查询失败",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
});
