/**
 * 认证中间件 - Authentication Middleware
 *
 * 功能:
 * 1. 从请求头提取 Token
 * 2. 验证 Token 有效性
 * 3. 查询用户信息
 * 4. 将用户信息注入到请求中
 *
 * 使用场景:
 * - 保护需要登录才能访问的 API
 * - 获取当前登录用户信息
 */

import { NextRequest, NextResponse } from "next/server";
import { getDatabaseInstance } from "@/lib/db/client";
import { UserRepository } from "@/lib/repositories/UserRepository";
import { extractToken, verifyToken } from "@/lib/auth/jwt";
import type { UserPublic } from "@/types/database";
import type Database from "better-sqlite3";

/**
 * 认证结果类型
 */
export interface AuthResult {
  success: boolean;
  user?: UserPublic;
  error?: string;
}

/**
 * 认证中间件函数
 *
 * 工作流程:
 * 1. 从 Authorization Header 提取 Token
 * 2. 验证 Token 的签名和有效期
 * 3. 从数据库查询用户信息
 * 4. 返回用户公开信息
 *
 * @param request - Next.js 请求对象
 * @param dbInstance - 数据库实例(可选,测试时使用)
 * @returns AuthResult - 认证结果(成功 + 用户信息 或 失败 + 错误信息)
 *
 * @example
 * // 在 API 路由中使用
 * export async function GET(request: NextRequest) {
 *   const auth = await authenticate(request);
 *
 *   if (!auth.success) {
 *     return NextResponse.json({ error: auth.error }, { status: 401 });
 *   }
 *
 *   // auth.user 包含当前登录用户信息
 *   return NextResponse.json({ message: `Hello ${auth.user.username}` });
 * }
 */
export async function authenticate(
  request: NextRequest,
  dbInstance?: Database.Database
): Promise<AuthResult> {
  // 步骤 1: 提取 Authorization Header
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return {
      success: false,
      error: "缺少 Authorization Header",
    };
  }

  // 步骤 2: 提取 Token
  const token = extractToken(authHeader);

  if (!token) {
    return {
      success: false,
      error: "Authorization Header 格式错误,应为 'Bearer <token>'",
    };
  }

  // 步骤 3: 验证 Token
  const verifyResult = await verifyToken(token);

  if (!verifyResult.valid || !verifyResult.payload) {
    return {
      success: false,
      error: verifyResult.error || "Token 无效",
    };
  }

  // 步骤 4: 查询用户信息
  const db = dbInstance || getDatabaseInstance();
  const userRepo = new UserRepository(db);
  const user = userRepo.findPublicById(verifyResult.payload.userId);

  if (!user) {
    return {
      success: false,
      error: "用户不存在",
    };
  }

  // 步骤 5: 返回成功结果
  return {
    success: true,
    user,
  };
}

/**
 * 认证中间件高阶函数 (基础版本 - 无 params)
 *
 * 说明:
 * - 这是一个高阶函数(Higher-Order Function),返回一个 API 处理函数
 * - 自动处理认证逻辑,简化 API 路由代码
 * - 适用于不需要动态路由参数的 API
 *
 * @param handler - API 处理函数,接收 (request, user) 作为参数
 * @returns Next.js API Route Handler
 *
 * @example
 * // 使用高阶函数简化 API 路由
 * export const GET = withAuth(async (request, user) => {
 *   // user 参数自动包含当前登录用户信息
 *   return NextResponse.json({
 *     message: `Hello ${user.username}`,
 *   });
 * });
 *
 * // 等价于:
 * export async function GET(request: NextRequest) {
 *   const auth = await authenticate(request);
 *   if (!auth.success) {
 *     return NextResponse.json({ error: auth.error }, { status: 401 });
 *   }
 *   const user = auth.user!;
 *   return NextResponse.json({ message: `Hello ${user.username}` });
 * }
 */
export function withAuth(
  handler: (request: NextRequest, user: UserPublic) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // 认证检查
    const auth = await authenticate(request);

    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error || "认证失败" }, { status: 401 });
    }

    return handler(request, auth.user);
  };
}

/**
 * 认证中间件高阶函数 (增强版本 - 支持 params)
 *
 * 说明:
 * - 扩展版本的 withAuth,支持动态路由参数
 * - 自动处理 Next.js 15 中 params 为 Promise 的情况
 * - 兼容 Next.js 14/15 两种模式
 *
 * Next.js 15 变更:
 * - params 从同步对象变为 Promise
 * - 必须使用 await params 来访问参数
 *
 * @param handler - API 处理函数,接收 (request, user, params) 作为参数
 * @returns Next.js API Route Handler
 *
 * @example
 * // Next.js 15 动态路由: app/api/histories/[historyId]/route.ts
 * export const GET = withAuthParams<{ historyId: string }>(
 *   async (request, user, params) => {
 *     const historyId = parseInt(params.historyId, 10);
 *     // ...处理逻辑...
 *     return NextResponse.json({ success: true });
 *   }
 * );
 *
 * // 等价于:
 * export async function GET(
 *   request: NextRequest,
 *   { params }: { params: Promise<{ historyId: string }> }
 * ) {
 *   const auth = await authenticate(request);
 *   if (!auth.success) {
 *     return NextResponse.json({ error: auth.error }, { status: 401 });
 *   }
 *   const resolvedParams = await params;
 *   const historyId = parseInt(resolvedParams.historyId, 10);
 *   // ...处理逻辑...
 * }
 */
export function withAuthParams<TParams = Record<string, string>>(
  handler: (request: NextRequest, user: UserPublic, params: TParams) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    context?: { params?: TParams | Promise<TParams> }
  ): Promise<NextResponse> => {
    // 步骤 1: 认证检查
    const auth = await authenticate(request);

    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error || "认证失败" }, { status: 401 });
    }

    // 步骤 2: 解析 params (兼容 Next.js 14/15)
    let resolvedParams: TParams;

    if (!context?.params) {
      // 如果没有 params,抛出错误
      return NextResponse.json({ error: "内部错误: 缺少路由参数" }, { status: 500 });
    }

    // 检测 params 是否为 Promise (Next.js 15)
    if (context.params instanceof Promise) {
      resolvedParams = await context.params;
    } else {
      // Next.js 14 及更早版本,params 是同步对象
      resolvedParams = context.params;
    }

    return handler(request, auth.user, resolvedParams);
  };
}

/**
 * 可选认证中间件
 *
 * 说明:
 * - 与 withAuth 不同,这个中间件不强制要求登录
 * - 如果有 Token 且有效,则注入用户信息
 * - 如果没有 Token 或 Token 无效,user 为 null
 *
 * 使用场景:
 * - 公开 API,但登录用户可以获得额外功能
 * - 例如:首页显示,登录用户显示个性化内容
 *
 * @param handler - API 处理函数,接收 (request, user | null)
 * @returns Next.js API Route Handler
 *
 * @example
 * export const GET = withOptionalAuth(async (request, user) => {
 *   if (user) {
 *     return NextResponse.json({ message: `Welcome back, ${user.username}` });
 *   } else {
 *     return NextResponse.json({ message: "Welcome, guest" });
 *   }
 * });
 */
export function withOptionalAuth(
  handler: (request: NextRequest, user: UserPublic | null) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // 尝试认证
    const auth = await authenticate(request);

    return handler(request, auth.success ? auth.user! : null);
  };
}
