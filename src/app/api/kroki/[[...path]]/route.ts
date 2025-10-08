import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/lib/constants/env";
import { logger } from "@/lib/utils/logger";

/**
 * Kroki 代理端点
 *
 * 解决客户端 CORS 问题:
 * - 客户端请求 /api/kroki → 服务端代理 → Kroki 服务
 *
 * 支持两种请求方式：
 * 1. GET: /api/kroki/{language}/{format}/{encoded_data}
 * 2. POST: /api/kroki/{language}/{format} (body: diagram code)
 */

/**
 * GET 请求处理 - 客户端主要使用方式
 * URL 格式: /api/kroki/{language}/{format}/{encoded_data}
 */
export async function GET(request: NextRequest) {
    try {
        // 提取路径: /api/kroki/mermaid/svg/eNpL...
        const pathname = request.nextUrl.pathname.replace("/api/kroki", "");
        const search = request.nextUrl.search;

        if (!pathname || pathname === "/") {
            return NextResponse.json(
                { error: "缺少 Kroki 路径参数" },
                { status: 400 }
            );
        }

        // 使用服务端 Kroki URL
        const krokiUrl = ENV.KROKI_INTERNAL_URL;
        const targetUrl = `${krokiUrl}${pathname}${search}`;

        logger.info(`[Kroki Proxy GET] ${targetUrl}`);

        // 转发请求到 Kroki 服务
        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                Accept: request.headers.get("Accept") || "image/svg+xml",
            },
        });

        // 错误处理 - 完整透传错误信息给客户端
        if (!response.ok) {
            const errorText = await response.text();
            logger.error(`[Kroki Proxy] GET 错误 ${response.status}:`, errorText);
            
            // 重要：保持原始状态码和错误文本，确保修复功能能获取完整错误信息
            return new NextResponse(errorText, {
                status: response.status,
                statusText: response.statusText,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                },
            });
        }

        // 成功响应 - 返回图表内容
        const contentType = response.headers.get("Content-Type") || "image/svg+xml";
        const content = await response.arrayBuffer();

        return new NextResponse(content, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600", // 缓存 1 小时
            },
        });
    } catch (error) {
        logger.error("[Kroki Proxy] GET 异常:", error);
        return NextResponse.json(
            {
                error: "Kroki 代理请求失败",
                details: error instanceof Error ? error.message : "未知错误",
            },
            { status: 500 }
        );
    }
}

/**
 * POST 请求处理 - 备用方式
 * 支持直接提交代码而非编码后的数据
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, language, type } = body;

        // 参数验证
        if (!code || !language || !type) {
            return NextResponse.json(
                { error: "缺少必需参数: code, language, type" },
                { status: 400 }
            );
        }

        // 使用服务端 Kroki URL
        const krokiUrl = ENV.KROKI_INTERNAL_URL;
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
            
            // 重要：保持原始错误信息
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
