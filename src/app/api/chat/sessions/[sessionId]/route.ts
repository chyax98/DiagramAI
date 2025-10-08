/**
 * /api/chat/sessions/[sessionId] - 会话CRUD操作
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuthParams } from "@/lib/auth/middleware";
import { getDatabaseInstance } from "@/lib/db/client";
import { ChatSessionRepository } from "@/lib/repositories/ChatSessionRepository";
import type { UserPublic } from "@/types/database";

import { logger } from "@/lib/utils/logger";

export const GET = withAuthParams<{ sessionId: string }>(
  async (_request: NextRequest, user: UserPublic, params) => {
    try {
      const sessionId = parseInt(params.sessionId, 10);

      if (isNaN(sessionId)) {
        return NextResponse.json({ error: "无效的 sessionId" }, { status: 400 });
      }

      const db = getDatabaseInstance();
      const sessionRepo = new ChatSessionRepository(db);
      const session = sessionRepo.findById(sessionId);

      if (!session || session.user_id !== user.id) {
        return NextResponse.json({ error: "会话不存在或无权访问" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        session,
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
  }
);

export const PUT = withAuthParams<{ sessionId: string }>(
  async (request: NextRequest, user: UserPublic, params) => {
    try {
      const sessionId = parseInt(params.sessionId, 10);

      if (isNaN(sessionId)) {
        return NextResponse.json({ error: "无效的 sessionId" }, { status: 400 });
      }

      const body = await request.json();
      const { sessionData, roundCount } = body;

      if (!sessionData || roundCount === undefined) {
        return NextResponse.json(
          { error: "缺少必需参数: sessionData, roundCount" },
          { status: 400 }
        );
      }

      const db = getDatabaseInstance();
      const sessionRepo = new ChatSessionRepository(db);

      // 验证权限
      const session = sessionRepo.findById(sessionId);
      if (!session || session.user_id !== user.id) {
        return NextResponse.json({ error: "会话不存在或无权访问" }, { status: 404 });
      }

      // 更新会话
      sessionRepo.update(
        sessionId,
        typeof sessionData === "string" ? sessionData : JSON.stringify(sessionData),
        roundCount
      );

      // 返回更新后的会话
      const updatedSession = sessionRepo.findById(sessionId);

      return NextResponse.json({
        success: true,
        session: updatedSession,
      });
    } catch (error) {
      logger.error("更新会话失败:", error);

      return NextResponse.json(
        {
          error: "更新失败",
          message: (error as Error).message,
        },
        { status: 500 }
      );
    }
  }
);

export const DELETE = withAuthParams<{ sessionId: string }>(
  async (_request: NextRequest, user: UserPublic, params) => {
    try {
      const sessionId = parseInt(params.sessionId, 10);

      if (isNaN(sessionId)) {
        return NextResponse.json({ error: "无效的 sessionId" }, { status: 400 });
      }

      const db = getDatabaseInstance();
      const sessionRepo = new ChatSessionRepository(db);

      // 验证权限
      const session = sessionRepo.findById(sessionId);
      if (!session || session.user_id !== user.id) {
        return NextResponse.json({ error: "会话不存在或无权访问" }, { status: 404 });
      }

      // 删除会话
      const deleted = sessionRepo.delete(sessionId);

      if (!deleted) {
        return NextResponse.json({ error: "删除失败" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "会话已删除",
      });
    } catch (error) {
      logger.error("删除会话失败:", error);

      return NextResponse.json(
        {
          error: "删除失败",
          message: (error as Error).message,
        },
        { status: 500 }
      );
    }
  }
);
