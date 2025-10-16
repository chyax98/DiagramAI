/**
 * 密码加密工具 - Password Encryption Utilities
 *
 * 功能:
 * 1. 密码加密 (hash) - 注册时使用
 * 2. 密码验证 (verify) - 登录时使用
 *
 * 技术选型:
 * - 使用 bcrypt 加密算法
 * - 10 轮加盐 (rounds=10),平衡安全性和性能
 * - 输出固定 60 字符,符合数据库约束
 */

import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "@/lib/constants/env";

/**
 * 加密密码 (Hash Password)
 *
 * 使用场景: 用户注册时
 *
 * 工作流程:
 * 1. bcrypt 自动生成随机盐 (salt)
 * 2. 将盐和密码混合
 * 3. 进行 10 轮哈希运算
 * 4. 返回 60 字符的哈希值
 *
 * 输出格式: $2b$10$[22-char salt][31-char hash]
 *
 * @param password - 原始密码(明文)
 * @returns 加密后的哈希值(60 字符)
 *
 * @example
 * const hash = await hashPassword("mySecret123");
 * // 返回: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
 */
export async function hashPassword(password: string): Promise<string> {
  // bcrypt.hash() 自动处理盐的生成和混合

  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * 验证密码 (Verify Password)
 *
 * 使用场景: 用户登录时
 *
 * 工作流程:
 * 1. 从哈希值中提取盐 (前 29 字符)
 * 2. 用相同的盐对输入密码加密
 * 3. 比较两个哈希值是否相同
 * 4. 返回 true(正确) 或 false(错误)
 *
 * 安全特性:
 * - 时间恒定比较,防止时序攻击
 * - 无法从哈希值反推原密码
 *
 * @param password - 用户输入的密码(明文)
 * @param hash - 数据库中存储的哈希值
 * @returns true = 密码正确, false = 密码错误
 *
 * @example
 * const isValid = await verifyPassword(
 *   "mySecret123",
 *   "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
 * );
 * // 返回: true(如果密码匹配)
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // bcrypt.compare() 自动提取盐并进行比较

  return await bcrypt.compare(password, hash);
}

/**
 * 验证密码强度 (Validate Password Strength)
 *
 * 使用场景: 注册时的前端/后端验证
 *
 * 密码要求:
 * - 最少 8 个字符
 * - 至少包含 1 个字母
 * - 至少包含 1 个数字
 *
 * @param password - 待验证的密码
 * @returns { valid: boolean, message?: string } - 验证结果
 *
 * @example
 * validatePasswordStrength("abc");
 * // 返回: { valid: false, message: "密码至少需要 8 个字符" }
 *
 * validatePasswordStrength("abcd1234");
 * // 返回: { valid: true }
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  message?: string;
} {
  // 规则 1: 最少 8 个字符
  if (password.length < 8) {
    return {
      valid: false,
      message: "密码至少需要 8 个字符",
    };
  }

  // 规则 2: 至少包含 1 个字母
  if (!/[a-zA-Z]/.test(password)) {
    return {
      valid: false,
      message: "密码必须包含至少 1 个字母",
    };
  }

  // 规则 3: 至少包含 1 个数字
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "密码必须包含至少 1 个数字",
    };
  }

  // 所有规则通过
  return { valid: true };
}
