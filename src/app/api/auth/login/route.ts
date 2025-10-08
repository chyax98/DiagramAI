/**
 * POST /api/auth/login - 用户登录
 * 验证凭据并返回JWT token
 */

import { NextRequest } from "next/server";
import { getDatabaseInstance } from "@/lib/db/client";
import { UserRepository } from "@/lib/repositories/UserRepository";
import { verifyPassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/jwt";
import { LoginRequestSchema } from "@/lib/validations/auth";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  ErrorCodes,
} from "@/lib/utils/api-response";

import { logger } from "@/lib/utils/logger";

export async function POST(request: NextRequest) {
  try {
    // 步骤 1: 解析请求体
    const body = await request.json();

    // 步骤 2: 验证请求参数
    const validation = LoginRequestSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        validation.error.errors.map((err) => err.message).join("; "),
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const { username, password } = validation.data;

    // 步骤 3: 查找用户
    const db = getDatabaseInstance();
    const userRepo = new UserRepository(db);
    const user = userRepo.findByUsername(username);

    if (!user) {
      // 用户不存在,返回 401(不暴露具体是用户名还是密码错误)
      return unauthorizedResponse("用户名或密码错误");
    }

    // 步骤 4: 验证密码
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      // 密码错误,返回 401
      return unauthorizedResponse("用户名或密码错误");
    }

    // 步骤 5: 更新最后登录时间
    userRepo.updateLastLogin(user.id);

    // 步骤 6: 生成 Token
    const token = await generateToken({
      userId: user.id,
      username: user.username,
    });

    // 步骤 7: 获取用户公开信息
    const publicUser = userRepo.findPublicById(user.id);

    if (!publicUser) {
      // 理论上不应该发生
      return errorResponse("获取用户信息失败", ErrorCodes.INTERNAL_ERROR, 500);
    }

    // 步骤 8: 返回成功响应
    return successResponse({
      user: publicUser,
      token,
    });
  } catch (error) {
    // 处理未预期的错误
    logger.error("登录失败:", error);

    return errorResponse("服务器错误,请稍后重试", ErrorCodes.INTERNAL_ERROR, 500);
  }
}
