/**
 * GET /api/auth/me - 获取当前用户信息
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";

export const GET = withAuth(async (_request: NextRequest, user) => {
  return NextResponse.json(
    {
      user,
    },
    { status: 200 }
  );
});
