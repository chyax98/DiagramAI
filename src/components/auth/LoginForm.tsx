/** 登录表单 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, AlertCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "登录失败");
      }

      // API 使用 successResponse 包装: { success: true, data: { token, user } }
      if (!result.data?.token || !result.data?.user) {
        throw new Error("登录响应格式错误");
      }

      login(result.data.token, result.data.user);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive leading-relaxed">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-semibold">
          用户名
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <User className="w-5 h-5" />
          </div>
          <Input
            {...register("username")}
            id="username"
            type="text"
            placeholder="请输入用户名"
            className={`pl-10 h-11 ${
              errors.username ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
        </div>
        {errors.username && (
          <p className="text-sm text-destructive flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-semibold">
          密码
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="w-5 h-5" />
          </div>
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="请输入密码"
            className={`pl-10 h-11 ${
              errors.password ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-destructive flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        className="w-full h-11 text-base font-semibold"
      >
        {isLoading ? "登录中..." : "登录"}
      </Button>
    </form>
  );
}
