import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/lib/constants/env";
import { logger } from "@/lib/utils/logger";

/**
 * Kroki 代理端点 (POST 方式)
 *
 * 解决客户端 CORS 问题:
 * - 客户端 POST 请求 /api/kroki/{language}/{format} → 服务端代理 → Kroki 服务
 *
 * 优势:
 * - ⚡ 无 URL 长度限制,支持大型图表
 * - 🚀 无需编码/解码,性能更好
 * - 🧹 代码更简洁
 */

/**
 * POST 请求处理
 * URL 格式: /api/kroki/{language}/{format}
 * Body: JSON { code, language, type }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, type } = body;

    // 参数验证
    if (!code || !language || !type) {
      return NextResponse.json({ error: "缺少必需参数: code, language, type" }, { status: 400 });
    }

    // 直接访问 Kroki 服务
    const krokiUrl = ENV.KROKI_URL;
    const targetUrl = `${krokiUrl}/${language}/${type}`;

    logger.info(`[Kroki Proxy POST] ${targetUrl}`);

    // 转发请求到 Kroki 服务
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: code,
    });

    // 错误处理 - 完整透传错误信息
    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`[Kroki Proxy] POST 错误 ${response.status}:`, errorText);

      // 重要：保持原始错误信息,确保修复功能能获取完整错误信息
      return new NextResponse(errorText, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    // 成功响应
    const contentType = response.headers.get("Content-Type") || "image/svg+xml";
    const content = await response.arrayBuffer();

    return new NextResponse(content, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // 缓存 1 小时
      },
    });
  } catch (error) {
    logger.error("[Kroki Proxy] POST 异常:", error);
    return NextResponse.json(
      {
        error: "Kroki 代理请求失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
