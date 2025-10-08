/**
 * GET /api/performance/stats - API性能统计
 * 返回所有端点的性能指标(P50/P95/P99)
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllEndpointStats, printPerformanceReport } from "@/lib/middleware/performance-monitor";

import { logger } from "@/lib/utils/logger";
export async function GET(_request: NextRequest) {
  try {
    // 获取所有端点的性能统计
    const statsMap = getAllEndpointStats();

    const statsObject: Record<string, unknown> = {};
    for (const [endpoint, stats] of statsMap.entries()) {
      statsObject[endpoint] = stats;
    }

    printPerformanceReport();

    return NextResponse.json({
      success: true,
      data: statsObject,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("❌ 获取性能统计失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "获取性能统计失败",
      },
      { status: 500 }
    );
  }
}
