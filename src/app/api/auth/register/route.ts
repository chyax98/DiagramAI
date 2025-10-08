/**
 * POST /api/auth/register - 用户注册
 * 验证输入,创建用户并返回JWT token
 */

import { NextRequest } from "next/server";
import { getDatabaseInstance } from "@/lib/db/client";
import { UserRepository } from "@/lib/repositories/UserRepository";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/jwt";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
interface RegisterRequest {
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // 步骤 1: 解析请求体
    const body = (await request.json()) as RegisterRequest;
    const { username, password } = body;

    // 步骤 2: 验证必填字段
    if (!username || !password) {
      return errorResponse("缺少必填字段: username 或 password", ErrorCodes.VALIDATION_ERROR, 400);
    }

    // 步骤 3: 验证用户名格式
    if (username.length < 3) {
      return errorResponse("用户名至少需要 3 个字符", ErrorCodes.VALIDATION_ERROR, 400);
    }

    if (username.length > 20) {
      return errorResponse("用户名最多 20 个字符", ErrorCodes.VALIDATION_ERROR, 400);
    }

    // 验证用户名只包含字母、数字、下划线
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return errorResponse("用户名只能包含字母、数字、下划线", ErrorCodes.VALIDATION_ERROR, 400);
    }

    // 步骤 4: 验证密码强度
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return errorResponse(
        passwordValidation.message || "密码格式不正确",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    // 步骤 5: 检查用户名是否已存在
    const db = getDatabaseInstance();
    const userRepo = new UserRepository(db);

    if (userRepo.existsByUsername(username)) {
      return errorResponse("用户名已被占用,请换一个", ErrorCodes.CONFLICT, 409);
    }

    // 步骤 6: 加密密码
    const passwordHash = await hashPassword(password);

    // 步骤 7: 保存到数据库
    const userId = userRepo.create({
      username,
      password_hash: passwordHash,
    });

    // 步骤 8: 查询用户公开信息
    const user = userRepo.findPublicById(userId);

    if (!user) {
      // 理论上不应该发生(刚创建的用户)
      return errorResponse("用户创建失败", ErrorCodes.INTERNAL_ERROR, 500);
    }

    // 步骤 9: 生成 Token
    const token = await generateToken({
      userId: user.id,
      username: user.username,
    });

    // 步骤 10: 返回成功响应（使用 successResponse 包装，与登录 API 保持一致）
    return successResponse(
      {
        user,
        token,
      },
      201 // 201 Created
    );
  } catch (error) {
    // 处理未预期的错误
    logger.error("注册失败:", error);

    return errorResponse("服务器错误,请稍后重试", ErrorCodes.INTERNAL_ERROR, 500);
  }
}
