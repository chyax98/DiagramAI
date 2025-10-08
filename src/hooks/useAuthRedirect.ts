/** useAuthRedirect - 401检测和登录重定向 */

"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { logger } from "@/lib/utils/logger";
export function useAuthRedirect() {
  const router = useRouter();

  const handleAuthResponse = useCallback(
    (response: Response): boolean => {
      if (response.status === 401) {
        logger.info("[Auth] 检测到 401,重定向到登录页");
        router.push("/login");
        return true;
      }
      return false;
    },
    [router]
  );

  const handleAuthError = useCallback(
    (error: unknown): boolean => {
      if (
        error instanceof Error &&
        (error.message.includes("401") || error.message.includes("未登录"))
      ) {
        logger.info("[Auth] 检测到认证错误,重定向到登录页");
        router.push("/login");
        return true;
      }
      return false;
    },
    [router]
  );

  return {
    handleAuthResponse,
    handleAuthError,
  };
}
