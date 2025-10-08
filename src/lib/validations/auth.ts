/**
 * 认证验证 schemas
 */

import { z } from "zod";

export const LoginRequestSchema = z.object({
  username: z
    .string()
    .min(1, "用户名不能为空")
    .max(50, "用户名最多 50 个字符")
    .regex(/^[a-zA-Z0-9_-]+$/, "用户名只能包含字母、数字、下划线和连字符"),
  password: z
    .string()
    .min(1, "密码不能为空")
    .min(6, "密码至少 6 个字符")
    .max(100, "密码最多 100 个字符"),
});

export const RegisterRequestSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少 3 个字符")
    .max(50, "用户名最多 50 个字符")
    .regex(/^[a-zA-Z0-9_-]+$/, "用户名只能包含字母、数字、下划线和连字符"),
  password: z.string().min(6, "密码至少 6 个字符").max(100, "密码最多 100 个字符"),
});

// 前端表单使用的 Schema (注册表单需要确认密码)
export const LoginSchema = LoginRequestSchema;
export const RegisterSchema = RegisterRequestSchema.extend({
  confirmPassword: z.string().min(6, "确认密码至少 6 个字符"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
