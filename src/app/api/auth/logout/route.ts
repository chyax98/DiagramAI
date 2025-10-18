/**
 * POST /api/auth/logout - 用户登出
 * JWT无状态设计,实际登出由客户端删除token完成
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";

import { logger } from "@/lib/utils/logger";
export const POST = withAuth(async (_request: NextRequest, user) => {
  logger.warn(`用户登出: userId=${user.id}, username=${user.username}`);

  return NextResponse.json(
    {
      message: "登出成功",
    },
    { status: 200 }
  );
});
