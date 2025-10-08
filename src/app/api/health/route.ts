/**
 * 健康检查端点
 * 用于应用健康检查和监控
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 简单的健康检查 - 返回 200 表示服务正常
    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: "DiagramAI",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
