/**
 * JWT 工具 - JSON Web Token Utilities
 *
 * 功能:
 * 1. 生成 Token (generateToken) - 登录成功后使用
 * 2. 验证 Token (verifyToken) - API 访问时使用
 *
 * 技术选型:
 * - 使用 jose 库(Next.js 官方推荐)
 * - HS256 算法(HMAC + SHA256)
 * - 7 天有效期(可配置)
 *
 * JWT 结构:
 * - Header: {"alg": "HS256", "typ": "JWT"}
 * - Payload: {"userId": 1, "username": "alice", "exp": 1234567890}
 * - Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
 */

import * as jose from "jose";
import { ENV } from "@/lib/constants/env";

/**
 * JWT 配置
 */
const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET 环境变量未配置或长度不足 32 字符。\n" +
        "请在 .env 文件中设置强密钥:\n" +
        "  openssl rand -base64 48 | tr -d '\\n' > .env.jwt\n" +
        '  echo "JWT_SECRET=$(cat .env.jwt)" >> .env'
    );
  }
  return secret;
})();

const JWT_EXPIRATION = ENV.JWT_EXPIRES_IN; // 从环境变量读取,默认 7 天

/**
 * Token Payload 类型定义
 *
 * 说明:
 * - userId: 用户 ID(用于数据库查询)
 * - username: 用户名(用于显示)
 * - exp: 过期时间(UNIX 时间戳,自动添加)
 */
export interface TokenPayload {
  userId: number;
  username: string;
}

/**
 * 验证结果类型定义
 */
export interface VerifyResult {
  valid: boolean;
  payload?: TokenPayload;
  error?: string;
}

/**
 * 生成 JWT Token
 *
 * 使用场景: 用户登录成功后
 *
 * 工作流程:
 * 1. 将用户信息封装到 Payload
 * 2. 设置 7 天有效期
 * 3. 使用密钥签名
 * 4. 返回 Token 字符串
 *
 * @param payload - 用户信息 { userId, username }
 * @returns JWT Token 字符串
 *
 * @example
 * const token = await generateToken({ userId: 1, username: "alice" });
 * // 返回: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWxpY2UiLCJleHAiOjE3MzY4NTI4MDB9.signature"
 */
export async function generateToken(payload: TokenPayload): Promise<string> {
  // 将密钥转换为 Uint8Array(jose 要求的格式)
  const secret = new TextEncoder().encode(JWT_SECRET);

  // 创建 JWT
  const token = await new jose.SignJWT({
    userId: payload.userId,
    username: payload.username,
  })
    .setProtectedHeader({ alg: "HS256" }) // 设置签名算法
    .setExpirationTime(JWT_EXPIRATION) // 设置过期时间
    .setIssuedAt() // 设置签发时间
    .sign(secret); // 签名

  return token;
}

/**
 * 验证 JWT Token
 *
 * 使用场景: API 访问时验证用户身份
 *
 * 工作流程:
 * 1. 提取 Token 字符串
 * 2. 验证签名(防止篡改)
 * 3. 检查过期时间
 * 4. 提取 Payload 数据
 * 5. 返回验证结果
 *
 * @param token - JWT Token 字符串
 * @returns { valid, payload?, error? } - 验证结果
 *
 * @example
 * // 成功案例
 * const result = await verifyToken("eyJhbGciOi...");
 * // 返回: { valid: true, payload: { userId: 1, username: "alice" } }
 *
 * // 失败案例(Token 过期)
 * const result = await verifyToken("expired-token");
 * // 返回: { valid: false, error: "Token 已过期" }
 */
export async function verifyToken(token: string): Promise<VerifyResult> {
  try {
    // 将密钥转换为 Uint8Array
    const secret = new TextEncoder().encode(JWT_SECRET);

    // 验证 Token
    const { payload } = await jose.jwtVerify(token, secret);

    // 提取用户信息
    return {
      valid: true,
      payload: {
        userId: payload.userId as number,
        username: payload.username as string,
      },
    };
  } catch (error) {
    // 处理各种错误情况
    if (error instanceof Error) {
      // Token 过期
      if (error.message.includes("exp")) {
        return {
          valid: false,
          error: "Token 已过期",
        };
      }

      // 签名无效(Token 被篡改)
      if (error.message.includes("signature")) {
        return {
          valid: false,
          error: "Token 签名无效",
        };
      }

      // 格式错误
      return {
        valid: false,
        error: "Token 格式错误",
      };
    }

    // 未知错误
    return {
      valid: false,
      error: "Token 验证失败",
    };
  }
}

/**
 * 从 Authorization Header 中提取 Token
 *
 * 使用场景: 中间件中从请求头提取 Token
 *
 * 标准格式: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 * @param authHeader - Authorization 请求头的值
 * @returns Token 字符串 或 null(如果格式错误)
 *
 * @example
 * const token = extractToken("Bearer eyJhbGciOi...");
 * // 返回: "eyJhbGciOi..."
 *
 * const token = extractToken("InvalidFormat");
 * // 返回: null
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  // 验证格式: "Bearer <token>"
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  // 提取 Token 部分
  const token = authHeader.substring(7); // 去掉 "Bearer "

  // 验证 Token 不为空
  if (!token || token.trim() === "") {
    return null;
  }

  return token;
}

/**
 * 刷新 Token
 *
 * 使用场景: Token 即将过期时自动刷新
 *
 * 说明:
 * - 验证旧 Token 是否有效
 * - 如果有效,生成新 Token
 * - 新 Token 包含相同的用户信息,但有效期延长
 *
 * @param oldToken - 旧的 JWT Token
 * @returns 新的 Token 或 null(如果旧 Token 无效)
 *
 * @example
 * const newToken = await refreshToken("eyJhbGciOi...");
 * // 返回: "eyJhbGciOi..." (新 Token,有效期延长)
 */
export async function refreshToken(oldToken: string): Promise<string | null> {
  // 验证旧 Token
  const result = await verifyToken(oldToken);

  if (!result.valid || !result.payload) {
    return null;
  }

  // 生成新 Token(包含相同的用户信息)
  const newToken = await generateToken(result.payload);
  return newToken;
}
